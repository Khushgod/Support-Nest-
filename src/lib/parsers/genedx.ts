import type { ExtractedVariant } from "../types";
import type { LabExtractionResult } from "./index";

/**
 * GeneDx reports use a "FINDINGS"/"RESULT SUMMARY" block with variant lines
 * such as:
 *
 *   Gene: BRCA1
 *   Variant: c.5266dupC (p.Gln1756Profs*74) — NM_007294.4
 *   Classification: Pathogenic
 *   Zygosity: Heterozygous
 *   Inheritance: Autosomal Dominant
 *
 * We key extraction off explicit "Gene:" labels and use the surrounding block
 * (next ~12 lines) for the structured fields.
 */

const HGVS_CODING = /(?:NM_\d+\.\d+:)?c\.[A-Za-z0-9_+\-*>]+/;
const HGVS_WITH_TRANSCRIPT = /NM_\d+\.\d+/;
const HGVS_PROTEIN_INNER = /p\.[A-Za-z]{3}\d+[A-Za-z*=0-9]+/;
const CLASS_WORDS =
  /\b(Pathogenic|Likely\s*Pathogenic|Uncertain\s*Significance|VUS|Likely\s*Benign|Benign)\b/i;
const ZYGOSITY = /\b(Heterozygous|Homozygous|Hemizygous)\b/i;
const INHERITANCE =
  /(Autosomal\s*Dominant|Autosomal\s*Recessive|X-[Ll]inked(?:\s*Dominant|\s*Recessive)?|Mitochondrial)/i;

function normalizeClassification(raw: string): string {
  const lower = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (lower === "pathogenic") return "Pathogenic";
  if (lower === "likely pathogenic") return "Likely Pathogenic";
  if (lower.includes("uncertain") || lower === "vus")
    return "Variant of Uncertain Significance (VUS)";
  if (lower === "likely benign") return "Likely Benign";
  if (lower === "benign") return "Benign";
  return raw;
}

export function extractGeneDx(rawText: string): LabExtractionResult {
  const variants: ExtractedVariant[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  const lines = rawText.split(/\n/);

  for (let i = 0; i < lines.length; i++) {
    const geneMatch = lines[i].match(/\bGene\s*:\s*([A-Z][A-Z0-9]{1,9})\b/);
    if (!geneMatch) continue;
    const gene = geneMatch[1];
    const window = lines
      .slice(Math.max(0, i - 1), Math.min(lines.length, i + 12))
      .join(" ");

    const classMatch = window.match(CLASS_WORDS);
    if (!classMatch) continue;

    const coding = window.match(HGVS_CODING);
    const transcript = window.match(HGVS_WITH_TRANSCRIPT);
    const prot = window.match(HGVS_PROTEIN_INNER);
    const zyg = window.match(ZYGOSITY);
    const inh = window.match(INHERITANCE);

    let hgvsNotation: string | undefined;
    if (coding) {
      const codingStr = coding[0].startsWith("NM_")
        ? coding[0]
        : transcript
        ? `${transcript[0]}:${coding[0]}`
        : coding[0];
      hgvsNotation = prot ? `${codingStr} (${prot[0]})` : codingStr;
    }

    const key = `${gene}-${classMatch[1]}-${hgvsNotation ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const variant: ExtractedVariant = {
      gene,
      acmgClassification: normalizeClassification(classMatch[1]),
    };
    if (hgvsNotation) variant.hgvsNotation = hgvsNotation;
    if (zyg) variant.zygosity = capitalize(zyg[1]);
    if (inh) variant.inheritance = inh[1];
    variants.push(variant);
  }

  let confidence: "high" | "partial" | "failed" = "failed";
  if (variants.length > 0) {
    confidence = variants.every((v) => v.hgvsNotation) ? "high" : "partial";
  }
  if (variants.length === 0) {
    warnings.push("GeneDx parser could not locate Gene: labels.");
  }
  return { variants, confidence, warnings };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
