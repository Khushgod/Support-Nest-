import type { ExtractedVariant } from "./types";

const GENE_TOKEN = /\b([A-Z][A-Z0-9]{1,9})\b/;
const HGVS_CODING = /NM_\d+\.\d+:c\.\S+/;
const HGVS_PROTEIN = /p\.\(?[A-Za-z]{3}\d+[A-Za-z*=]+\)?/;
const ACMG_CLASS =
  /\b(Pathogenic|Likely\s*Pathogenic|Uncertain\s*Significance|VUS|Likely\s*Benign|Benign)\b/i;
const ZYGOSITY = /\b(Heterozygous|Homozygous|Hemizygous|Het|Hom)\b/i;
const INHERITANCE =
  /\b(Autosomal\s*Dominant|Autosomal\s*Recessive|X-[Ll]inked(?:\s*Dominant|\s*Recessive)?|Mitochondrial|AD|AR|XL|XLD|XLR)\b/i;

// Tokens that look like genes by shape but are common English/lab acronyms we
// must not pick up. Keep conservative — the goal is to remove false positives,
// not to maintain a gene allow-list (that was the GT-302 problem).
const NON_GENE_TOKENS = new Set([
  // Stock terminology / acronyms that pass the gene-shape filter.
  "DNA", "RNA", "MRNA", "CDNA", "PCR", "NGS", "WES", "WGS", "VUS",
  "HGVS", "ACMG", "CLIA", "CAP", "FDA", "HIPAA", "ID", "USA", "US",
  "LLC", "INC", "PHD", "MD", "PO", "NM", "NP", "NR", "NC", "XM",
  "NOTE", "PAGE", "DATE", "REF", "ALT", "TEST", "LAB", "NM_",
  "CHR", "BP", "KB", "MB", "AA", "UTR", "SNP", "INDEL", "CNV",
  "PDF", "URL", "HTTP", "HTTPS", "API",
  // Classification / report words that match the gene shape.
  "PATHOGENIC", "BENIGN", "UNCERTAIN", "LIKELY", "POSITIVE",
  "NEGATIVE", "VARIANT", "RESULT", "RESULTS", "GENE", "GENES",
  "ZYGOSITY", "INHERIT", "CLASS", "CLASSIFIED", "REPORT",
  "SAMPLE", "PATIENT", "SUBJECT", "CLINICAL", "FINDING",
  "FINDINGS", "SUMMARY", "CARRIER", "HOMOZYG", "HETEROZYG",
  "HEMIZYG", "DOMINANT", "RECESSIVE", "LINKED",
]);

// HGVS / transcript identifiers can look like GENE tokens when uppercased —
// strip them before gene matching.
function isLikelyGene(token: string): boolean {
  if (NON_GENE_TOKENS.has(token)) return false;
  if (/^NM_?$/.test(token)) return false;
  if (/^NP_?$/.test(token)) return false;
  if (/^\d/.test(token)) return false;
  // All-digit or too short
  if (token.length < 2) return false;
  // Must contain at least one letter
  if (!/[A-Z]/.test(token)) return false;
  return true;
}

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

function normalizeInheritance(raw: string): string {
  const map: Record<string, string> = {
    ad: "Autosomal Dominant",
    ar: "Autosomal Recessive",
    xl: "X-linked",
    xld: "X-linked Dominant",
    xlr: "X-linked Recessive",
  };
  return map[raw.toLowerCase()] || raw;
}

function normalizeZygosity(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower === "het") return "Heterozygous";
  if (lower === "hom") return "Homozygous";
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

interface LineContext {
  line: string;
  nearby: string;
}

function getLineContexts(text: string): LineContext[] {
  const lines = text.split(/\n/);
  return lines.map((line, i) => {
    const start = Math.max(0, i - 3);
    const end = Math.min(lines.length, i + 6);
    const nearby = lines.slice(start, end).join(" ");
    return { line: line.trim(), nearby };
  });
}

/**
 * Pick the most likely gene token from a line. Prefers tokens that sit next
 * to an HGVS notation (NM_…:c.…) since those unambiguously belong to a gene.
 */
function pickGeneFromLine(line: string): string | null {
  const hgvsIdx = line.search(HGVS_CODING);
  const tokens = Array.from(line.matchAll(new RegExp(GENE_TOKEN, "g")));
  if (tokens.length === 0) return null;

  if (hgvsIdx >= 0) {
    // Prefer the gene-shaped token closest to (and usually before) the HGVS.
    let best: { token: string; dist: number } | null = null;
    for (const m of tokens) {
      const tok = m[1];
      if (!isLikelyGene(tok)) continue;
      const dist = Math.abs((m.index ?? 0) - hgvsIdx);
      if (!best || dist < best.dist) best = { token: tok, dist };
    }
    if (best) return best.token;
  }

  // Fallback: first gene-shaped token on the line.
  for (const m of tokens) {
    const tok = m[1];
    if (isLikelyGene(tok)) return tok;
  }
  return null;
}

export function extractVariants(rawText: string): {
  variants: ExtractedVariant[];
  confidence: "high" | "partial" | "failed";
  warnings: string[];
} {
  const warnings: string[] = [];
  const variants: ExtractedVariant[] = [];
  const seen = new Set<string>();

  const contexts = getLineContexts(rawText);

  for (const { line, nearby } of contexts) {
    const classMatch = nearby.match(ACMG_CLASS);
    if (!classMatch) continue;

    const gene = pickGeneFromLine(line);
    if (!gene) continue;

    const key = `${gene}-${classMatch[1]}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const hgvsCoding = nearby.match(HGVS_CODING);
    const hgvsProtein = nearby.match(HGVS_PROTEIN);
    const zygosityMatch = nearby.match(ZYGOSITY);
    const inheritanceMatch = nearby.match(INHERITANCE);

    const variant: ExtractedVariant = {
      gene,
      acmgClassification: normalizeClassification(classMatch[1]),
    };

    if (hgvsCoding) {
      variant.hgvsNotation = hgvsCoding[0];
      if (hgvsProtein) {
        variant.hgvsNotation += ` (${hgvsProtein[0]})`;
      }
    }

    if (zygosityMatch) {
      variant.zygosity = normalizeZygosity(zygosityMatch[1]);
    }

    if (inheritanceMatch) {
      variant.inheritance = normalizeInheritance(inheritanceMatch[1]);
    }

    const conditionPatterns = [
      /associated\s+with\s+([A-Z][a-zA-Z\s\-]+(?:syndrome|disease|disorder|cancer|deficiency))/i,
      /(?:condition|disorder|disease|diagnosis):\s*([A-Za-z\s\-]+)/i,
    ];
    for (const pattern of conditionPatterns) {
      const match = nearby.match(pattern);
      if (match) {
        variant.condition = match[1].trim();
        break;
      }
    }

    variants.push(variant);
  }

  // Fallback: when line-oriented scan misses everything, do a global sweep
  // pairing any gene-shaped token with a nearby classification.
  if (variants.length === 0) {
    const fullText = rawText.replace(/\n/g, " ");
    const globalRegex =
      /\b([A-Z][A-Z0-9]{1,9})\b[^.]{0,300}?(Pathogenic|Likely\s*Pathogenic|Uncertain\s*Significance|VUS|Likely\s*Benign|Benign)/gi;
    let m: RegExpExecArray | null;
    while ((m = globalRegex.exec(fullText)) !== null) {
      const gene = m[1];
      if (!isLikelyGene(gene)) continue;
      const key = `${gene}-${m[2]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      variants.push({
        gene,
        acmgClassification: normalizeClassification(m[2]),
      });
    }
  }

  let confidence: "high" | "partial" | "failed" = "failed";
  if (variants.length > 0) {
    const hasFullExtraction = variants.some(
      (v) => v.hgvsNotation && v.acmgClassification && v.gene
    );
    confidence = hasFullExtraction ? "high" : "partial";
  }

  if (variants.length === 0) {
    warnings.push(
      "No variants could be automatically extracted. The report may use an unsupported format."
    );
  }

  return { variants, confidence, warnings };
}
