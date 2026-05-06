import type { ExtractedVariant } from "../types";
import type { LabExtractionResult } from "./index";

/**
 * Invitae reports present variants in a result table preceded by the column
 * header line:
 *
 *   GENE VARIANT ZYGOSITY VARIANT CLASSIFICATION
 *   BRIP1 c.1343G>A (p.Trp448*) heterozygous PATHOGENIC
 *
 * The result block is preceded by "RESULT: POSITIVE | NEGATIVE | UNCERTAIN"
 * and followed by an "About this test" disclaimer that lists ALL panel genes.
 * If we don't scope to the variant table, the disclaimer text turns every
 * panel gene into a phantom "Pathogenic" variant.
 */

const CLASS_WORDS =
  /(PATHOGENIC|LIKELY\s*PATHOGENIC|VARIANT\s+OF\s+UNCERTAIN\s+SIGNIFICANCE|UNCERTAIN\s+SIGNIFICANCE|VUS|LIKELY\s*BENIGN|BENIGN)/i;

// HGVS coding: prefer transcript-prefixed form, fall back to bare c.NNN.
const HGVS_CODING_FULL = /NM_\d+\.\d+:c\.\S+/;
const HGVS_CODING_BARE = /\bc\.[A-Za-z0-9_+\-*>]+/;
// Capture the inner protein notation only (without leading/trailing parens)
// so we can re-wrap it cleanly without producing `((p.X)))`.
const HGVS_PROTEIN_INNER = /p\.[A-Za-z]{3}\d+[A-Za-z*=0-9]+/;
const ZYGOSITY = /\b(Heterozygous|Homozygous|Hemizygous)\b/i;
const GENE_TOKEN = /^([A-Z][A-Z0-9]{1,9})\b/;

const NEGATIVE_RESULT =
  /RESULT:\s*NEGATIVE|no\s+(?:clinically\s+significant|reportable)\s+(?:variants?|genetic\s+changes?)\s+(?:were\s+)?(?:found|identified|detected)/i;

const SKIP_TOKENS = new Set([
  // Generic English / lab acronyms.
  "THE", "AND", "FOR", "NOT", "TEST", "DNA", "RNA", "MRNA", "CDNA",
  "PCR", "NGS", "WES", "WGS", "VUS", "HGVS", "ACMG", "CLIA",
  // Report-structure words.
  "RESULTS", "RESULT", "VARIANT", "VARIANTS", "GENE", "GENES",
  "POSITIVE", "NEGATIVE", "UNCERTAIN", "PATHOGENIC", "BENIGN",
  "LIKELY", "PATIENT", "REPORT", "SUMMARY", "FINDINGS", "FINDING",
  "CLASSIFICATION", "ZYGOSITY", "INHERITANCE", "TRANSCRIPT",
  "REFERENCE", "CARRIER", "ABOUT", "INFO", "INFORMATION",
  // Headers seen in real Invitae PDFs.
  "DOE", "DOB", "MRN", "MIM", "OMIM", "DATE", "PAGE",
  "ZYG", "HET", "HOM", "HEMI",
]);

function normalizeClassification(raw: string): string {
  const up = raw.toUpperCase().replace(/\s+/g, " ").trim();
  if (up === "PATHOGENIC") return "Pathogenic";
  if (up === "LIKELY PATHOGENIC") return "Likely Pathogenic";
  if (up.includes("UNCERTAIN") || up === "VUS")
    return "Variant of Uncertain Significance (VUS)";
  if (up === "LIKELY BENIGN") return "Likely Benign";
  if (up === "BENIGN") return "Benign";
  return raw;
}

/**
 * Scope to the variant-table region: from the "GENE VARIANT ZYGOSITY ...
 * CLASSIFICATION" header up to the next "About this test" or empty section.
 * If we cannot find the header, return an empty scoped region — better to
 * miss than to extract phantom variants from the panel-gene list.
 */
function scopeToResultTable(rawText: string): string | null {
  const headerRe =
    /GENE\s+VARIANT(?:\s+TRANSCRIPT)?\s+ZYGOSITY\s+VARIANT\s+CLASSIFICATION/i;
  const m = rawText.match(headerRe);
  if (!m || m.index === undefined) return null;

  const start = m.index + m[0].length;
  const tail = rawText.slice(start);
  // Stop at the disclaimer block.
  const stopRe = /About\s+this\s+test|Genes\s+Analyzed|Methodology|Disclaimer/i;
  const stopMatch = tail.match(stopRe);
  const end = stopMatch?.index ?? Math.min(tail.length, 4000);
  return tail.slice(0, end);
}

export function extractInvitae(rawText: string): LabExtractionResult {
  const variants: ExtractedVariant[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  // Negative reports must produce zero variants; otherwise the panel-gene
  // list in the disclaimer leaks in as false positives.
  if (NEGATIVE_RESULT.test(rawText)) {
    return {
      variants: [],
      confidence: "high",
      warnings: ["Report indicates a NEGATIVE / no clinically significant findings result."],
    };
  }

  const scoped = scopeToResultTable(rawText);
  if (!scoped) {
    warnings.push(
      "Invitae parser could not find the GENE/VARIANT/ZYGOSITY/CLASSIFICATION header. Skipping lab-specific path."
    );
    return { variants: [], confidence: "failed", warnings };
  }

  // The pdfjs text dump joins table cells with spaces, so the table is often
  // on a single line. Split the scoped region into rows by looking for a
  // gene-shaped token followed eventually by a CLASS_WORDS token.
  const rowRe = new RegExp(
    `\\b([A-Z][A-Z0-9]{1,9})\\b\\s+([^\\n]{0,200}?)\\b(${CLASS_WORDS.source.replace(/^\(|\)$/g, "")})\\b`,
    "gi"
  );
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(scoped)) !== null) {
    const gene = m[1].toUpperCase();
    if (SKIP_TOKENS.has(gene)) continue;
    const between = m[2];
    const classRaw = m[3];

    const hgvs =
      between.match(HGVS_CODING_FULL)?.[0] ??
      between.match(HGVS_CODING_BARE)?.[0];
    const prot = between.match(HGVS_PROTEIN_INNER)?.[0];
    const zyg = between.match(ZYGOSITY)?.[1];

    const key = `${gene}-${classRaw}-${hgvs ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const variant: ExtractedVariant = {
      gene,
      acmgClassification: normalizeClassification(classRaw),
    };
    if (hgvs) variant.hgvsNotation = prot ? `${hgvs} (${prot})` : hgvs;
    if (zyg) variant.zygosity = capitalize(zyg);
    variants.push(variant);
  }

  let confidence: "high" | "partial" | "failed" = "failed";
  if (variants.length > 0) {
    confidence = variants.every((v) => v.hgvsNotation) ? "high" : "partial";
  } else {
    warnings.push(
      "Invitae parser found a results table but did not match any gene/classification rows."
    );
  }
  // Keep the legacy line-oriented loop available for callers expecting it.
  void GENE_TOKEN;
  return { variants, confidence, warnings };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
