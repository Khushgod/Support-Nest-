import type { ExtractedVariant } from "../types";
import type { LabExtractionResult } from "./index";

/**
 * Invitae reports present variants in a "RESULTS" block followed by sections
 * per variant. Common patterns observed across the sample corpus:
 *
 *   GENE     NM_xxxxxx.x:c.yyyy    p.(Abc123Def)      PATHOGENIC   Heterozygous
 *   GENE     NM_xxxxxx.x:c.yyyy                        VARIANT OF UNCERTAIN...
 *
 * The Invitae result header typically contains "POSITIVE", "NEGATIVE", or
 * "UNCERTAIN" and the variant block follows a "Variant(s) identified" heading.
 */

const CLASS_WORDS =
  /(PATHOGENIC|LIKELY\s*PATHOGENIC|VARIANT\s+OF\s+UNCERTAIN\s+SIGNIFICANCE|UNCERTAIN\s+SIGNIFICANCE|VUS|LIKELY\s*BENIGN|BENIGN)/i;

const HGVS_CODING = /NM_\d+\.\d+:c\.\S+/;
const HGVS_PROTEIN = /p\.\(?[A-Za-z]{3}\d+[A-Za-z*=]+\)?/;
const ZYGOSITY = /\b(Heterozygous|Homozygous|Hemizygous)\b/i;
const GENE_TOKEN = /^([A-Z][A-Z0-9]{1,9})\b/;

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

export function extractInvitae(rawText: string): LabExtractionResult {
  const variants: ExtractedVariant[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  // Scope to the results section when present.
  const resultsStart = rawText.search(
    /(?:RESULTS|VARIANT\(S\)\s+IDENTIFIED|POSITIVE|NEGATIVE)[:\s]/i
  );
  const scoped =
    resultsStart >= 0 ? rawText.slice(resultsStart) : rawText;

  const lines = scoped.split(/\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const window = lines.slice(i, Math.min(lines.length, i + 8)).join(" ");

    const geneMatch = line.match(GENE_TOKEN);
    if (!geneMatch) continue;
    const gene = geneMatch[1];
    // Skip obvious non-gene leading tokens that share the gene shape.
    if (
      [
        "THE", "AND", "FOR", "NOT", "TEST", "DNA", "RNA",
        "RESULTS", "RESULT", "VARIANT", "VARIANTS", "GENE",
        "GENES", "POSITIVE", "NEGATIVE", "UNCERTAIN", "PATHOGENIC",
        "BENIGN", "PATIENT", "REPORT", "SUMMARY", "FINDINGS",
        "CLASSIFICATION", "ZYGOSITY", "INHERITANCE",
      ].includes(gene)
    ) {
      continue;
    }

    const classMatch = window.match(CLASS_WORDS);
    if (!classMatch) continue;

    const hgvs = window.match(HGVS_CODING);
    const prot = window.match(HGVS_PROTEIN);
    const zyg = window.match(ZYGOSITY);

    const key = `${gene}-${classMatch[1]}-${hgvs?.[0] ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const variant: ExtractedVariant = {
      gene,
      acmgClassification: normalizeClassification(classMatch[1]),
    };
    if (hgvs) {
      variant.hgvsNotation = prot ? `${hgvs[0]} (${prot[0]})` : hgvs[0];
    }
    if (zyg) variant.zygosity = capitalize(zyg[1]);
    variants.push(variant);
  }

  let confidence: "high" | "partial" | "failed" = "failed";
  if (variants.length > 0) {
    confidence = variants.every((v) => v.hgvsNotation) ? "high" : "partial";
  }
  if (variants.length === 0) {
    warnings.push("Invitae parser could not locate variants in the RESULTS section.");
  }
  return { variants, confidence, warnings };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
