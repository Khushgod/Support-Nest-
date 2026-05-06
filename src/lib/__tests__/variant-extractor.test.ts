import { describe, it, expect } from "vitest";
import { extractVariants } from "../variant-extractor";

describe("extractVariants", () => {
  it("extracts a pathogenic BRCA1 variant with HGVS", () => {
    const text = `
      Gene: BRCA1
      Variant: NM_007294.4:c.68_69delAG (p.Glu23ValfsTer17)
      Classification: Pathogenic
      Zygosity: Heterozygous
      Inheritance: Autosomal Dominant
    `;
    const { variants, confidence } = extractVariants(text);
    expect(variants.length).toBeGreaterThanOrEqual(1);
    const brca = variants.find((v) => v.gene === "BRCA1");
    expect(brca).toBeDefined();
    expect(brca!.acmgClassification).toBe("Pathogenic");
    expect(brca!.hgvsNotation).toContain("NM_007294.4:c.68_69delAG");
    expect(brca!.zygosity).toBe("Heterozygous");
    expect(confidence).toBe("high");
  });

  it("extracts out-of-allow-list genes (GT-302)", () => {
    // NPC1 was NOT in the old KNOWN_GENES allow-list; must be extracted now.
    const text = `
      NPC1 NM_000271.5:c.3182T>C (p.Ile1061Thr)
      Classification: Likely Pathogenic
    `;
    const { variants } = extractVariants(text);
    const npc1 = variants.find((v) => v.gene === "NPC1");
    expect(npc1).toBeDefined();
    expect(npc1!.acmgClassification).toBe("Likely Pathogenic");
  });

  it("extracts another rare gene (GJA8)", () => {
    const text = `
      GJA8 variant NM_005267.5:c.139G>A classified as Pathogenic.
    `;
    const { variants } = extractVariants(text);
    expect(variants.find((v) => v.gene === "GJA8")).toBeDefined();
  });

  it("normalizes VUS to full name", () => {
    const text = `MSH2 NM_000251.3:c.942+3A>T Classification: VUS`;
    const { variants } = extractVariants(text);
    expect(variants[0].acmgClassification).toContain("Uncertain");
  });

  it("normalizes inheritance abbreviations", () => {
    const text = `CFTR NM_000492.4:c.1521_1523delCTT Pathogenic AR`;
    const { variants } = extractVariants(text);
    expect(variants[0].inheritance).toBe("Autosomal Recessive");
  });

  it("reports failed confidence when no variants found", () => {
    const { variants, confidence, warnings } = extractVariants(
      "This is a normal report with no variants."
    );
    expect(variants).toHaveLength(0);
    expect(confidence).toBe("failed");
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("does not pick up common acronyms as genes", () => {
    // Must not treat "DNA" or "PCR" as gene names.
    const text = `DNA was sequenced via PCR. Classification: Pathogenic BRCA2`;
    const { variants } = extractVariants(text);
    const genes = variants.map((v) => v.gene);
    expect(genes).not.toContain("DNA");
    expect(genes).not.toContain("PCR");
    expect(genes).toContain("BRCA2");
  });

  it("deduplicates repeated gene+classification pairs", () => {
    const text = `
      BRCA1 Pathogenic
      Later in report: BRCA1 Pathogenic
    `;
    const { variants } = extractVariants(text);
    expect(variants.filter((v) => v.gene === "BRCA1")).toHaveLength(1);
  });
});
