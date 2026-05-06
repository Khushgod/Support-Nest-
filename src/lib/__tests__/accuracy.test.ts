/**
 * Extraction accuracy harness for the public/samples/ corpus (spec §7.4).
 *
 * For each PDF in `public/samples/`, we expect a sibling JSON file at
 * `public/samples/expected/<name>.json` with this shape:
 *
 *   {
 *     "labSource": "Invitae" | "GeneDx" | null,
 *     "expectedConfidence": "high" | "partial" | "failed",
 *     "groundTruth": [{ gene, acmgClassification, hgvsCoding?, hgvsProtein?, zygosity? }],
 *     "notes": string
 *   }
 *
 * The harness runs the full extraction pipeline (pdfjs → detectLab →
 * extractByLab) on each PDF, then computes:
 *
 *   - per-field precision / recall against `groundTruth`
 *   - overall field-level accuracy (TP / (TP + FP + FN))
 *
 * Spec §7.4 sets a ≥95% threshold. The test fails the suite if the corpus
 * average drops below it. Per-sample diagnostics are always printed so the
 * accuracy script (`npm run accuracy`) is human-readable.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import { detectLab } from "../lab-detector";
import { extractByLab } from "../parsers";
import type { ExtractedVariant } from "../types";

interface ExpectedVariant {
  gene: string;
  acmgClassification: string;
  hgvsCoding?: string;
  hgvsProtein?: string;
  zygosity?: string;
}

interface ExpectedFixture {
  labSource: string | null;
  expectedConfidence: "high" | "partial" | "failed";
  groundTruth: ExpectedVariant[];
  notes?: string;
}

interface PerSampleScore {
  pdf: string;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  fieldAccuracy: number;
  detectedLabOk: boolean;
  confidenceOk: boolean;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES = path.resolve(__dirname, "../../../public/samples");
const EXPECTED = path.join(SAMPLES, "expected");

// Use pdfjs in-process. Mirrors src/lib/pdf-parser.ts but inline so the test
// surfaces real parsing errors rather than the user-friendly wrapper message.
async function extractText(pdfPath: string): Promise<string> {
  const { getDocument, GlobalWorkerOptions } = await import(
    "pdfjs-dist/legacy/build/pdf.mjs"
  );
  const localRequire = createRequire(import.meta.url);
  GlobalWorkerOptions.workerSrc = localRequire.resolve(
    "pdfjs-dist/legacy/build/pdf.worker.mjs"
  );
  const buf = await fs.readFile(pdfPath);
  const doc = await getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    isEvalSupported: false,
    disableFontFace: true,
    disableWorker: true,
  } as unknown as Parameters<typeof getDocument>[0]).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    parts.push(
      content.items
        .filter(
          (it): it is typeof it & { str: string } =>
            typeof (it as { str?: unknown }).str === "string"
        )
        .map((it) => (it as { str: string }).str)
        .join(" ")
    );
  }
  await doc.destroy();
  return parts.join("\n");
}

function variantMatches(
  actual: ExtractedVariant,
  expected: ExpectedVariant
): { matched: boolean; fieldHits: number; fieldTotal: number } {
  if (actual.gene !== expected.gene) {
    return { matched: false, fieldHits: 0, fieldTotal: 1 };
  }
  let hits = 1; // gene matched
  let total = 1;

  // Classification.
  total++;
  if (
    actual.acmgClassification &&
    expected.acmgClassification &&
    actual.acmgClassification.toLowerCase().includes(
      expected.acmgClassification.toLowerCase()
    )
  ) {
    hits++;
  }

  if (expected.hgvsCoding) {
    total++;
    if (actual.hgvsNotation?.includes(expected.hgvsCoding)) hits++;
  }
  if (expected.hgvsProtein) {
    total++;
    if (actual.hgvsNotation?.includes(expected.hgvsProtein)) hits++;
  }
  if (expected.zygosity) {
    total++;
    if (
      actual.zygosity?.toLowerCase() === expected.zygosity.toLowerCase()
    ) {
      hits++;
    }
  }

  return { matched: true, fieldHits: hits, fieldTotal: total };
}

async function scoreSample(
  pdf: string,
  expected: ExpectedFixture
): Promise<PerSampleScore> {
  const text = await extractText(path.join(SAMPLES, pdf));
  const detectedLab = detectLab(text);
  const result = extractByLab(detectedLab, text);

  // Match each ground-truth variant to at most one extracted variant.
  const consumed = new Set<number>();
  let tp = 0;
  let fieldHitsTotal = 0;
  let fieldsExpectedTotal = 0;

  for (const exp of expected.groundTruth) {
    let bestIdx = -1;
    let bestScore = -1;
    for (let i = 0; i < result.variants.length; i++) {
      if (consumed.has(i)) continue;
      const m = variantMatches(result.variants[i], exp);
      if (m.matched && m.fieldHits > bestScore) {
        bestIdx = i;
        bestScore = m.fieldHits;
      }
    }
    if (bestIdx >= 0) {
      consumed.add(bestIdx);
      tp++;
      const m = variantMatches(result.variants[bestIdx], exp);
      fieldHitsTotal += m.fieldHits;
      fieldsExpectedTotal += m.fieldTotal;
    } else {
      fieldsExpectedTotal += 2; // gene + classification missed
    }
  }

  const fp = result.variants.length - consumed.size;
  const fn = expected.groundTruth.length - tp;

  // Field accuracy: hits / (hits + missed-fields-from-FN + 2 per FP).
  const fpPenalty = fp * 2;
  const denom = fieldsExpectedTotal + fpPenalty;
  const fieldAccuracy = denom === 0 ? 1 : fieldHitsTotal / denom;

  return {
    pdf,
    truePositives: tp,
    falsePositives: fp,
    falseNegatives: fn,
    fieldAccuracy,
    detectedLabOk: detectedLab === expected.labSource,
    confidenceOk: result.confidence === expected.expectedConfidence,
  };
}

describe("Extraction accuracy harness (spec §7.4 — ≥95% target)", () => {
  it("scores the public/samples/ corpus", async () => {
    const pdfs = (await fs.readdir(SAMPLES)).filter((f) =>
      f.toLowerCase().endsWith(".pdf")
    );
    expect(pdfs.length).toBeGreaterThan(0);

    const scores: PerSampleScore[] = [];
    for (const pdf of pdfs) {
      const fixturePath = path.join(EXPECTED, pdf.replace(/\.pdf$/i, ".json"));
      let fixture: ExpectedFixture;
      try {
        fixture = JSON.parse(await fs.readFile(fixturePath, "utf8"));
      } catch {
        throw new Error(
          `Missing expected fixture: ${path.relative(process.cwd(), fixturePath)}`
        );
      }
      const score = await scoreSample(pdf, fixture);
      scores.push(score);
    }

    // Per-sample diagnostic table.
    const rows = scores.map((s) => ({
      pdf: s.pdf,
      lab: s.detectedLabOk ? "✓" : "✗",
      conf: s.confidenceOk ? "✓" : "✗",
      tp: s.truePositives,
      fp: s.falsePositives,
      fn: s.falseNegatives,
      "field acc": `${(s.fieldAccuracy * 100).toFixed(1)}%`,
    }));
    // eslint-disable-next-line no-console
    console.table(rows);

    const avgFieldAcc =
      scores.reduce((a, s) => a + s.fieldAccuracy, 0) / scores.length;
    // eslint-disable-next-line no-console
    console.log(`\nCorpus average field accuracy: ${(avgFieldAcc * 100).toFixed(2)}%`);

    // Hard gates.
    expect(scores.every((s) => s.detectedLabOk)).toBe(true);
    expect(scores.every((s) => s.confidenceOk)).toBe(true);

    // Spec §7.4 threshold: ≥95% across the corpus.
    expect(avgFieldAcc).toBeGreaterThanOrEqual(0.95);
  }, 60_000);
});
