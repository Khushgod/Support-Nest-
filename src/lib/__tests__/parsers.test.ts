import { describe, it, expect } from "vitest";
import { extractInvitae } from "../parsers/invitae";
import { extractGeneDx } from "../parsers/genedx";
import { extractByLab } from "../parsers";

describe("Invitae parser", () => {
  it("extracts a single Pathogenic BRCA1 variant", () => {
    const text = `
      Invitae Corporation
      Patient: Test
      RESULTS: POSITIVE
      Variant(s) identified:
      BRCA1  NM_007294.4:c.68_69delAG  p.(Glu23ValfsTer17)  PATHOGENIC  Heterozygous
      A pathogenic variant was identified in BRCA1.
    `;
    const { variants, confidence } = extractInvitae(text);
    expect(variants.length).toBeGreaterThanOrEqual(1);
    const brca = variants.find((v) => v.gene === "BRCA1");
    expect(brca).toBeDefined();
    expect(brca!.acmgClassification).toBe("Pathogenic");
    expect(brca!.zygosity).toBe("Heterozygous");
    expect(brca!.hgvsNotation).toContain("NM_007294.4:c.68_69delAG");
    expect(confidence).toBe("high");
  });

  it("handles VUS classification spelled out", () => {
    const text = `
      RESULTS: UNCERTAIN
      MSH2  NM_000251.3:c.942+3A>T  VARIANT OF UNCERTAIN SIGNIFICANCE  Heterozygous
    `;
    const { variants } = extractInvitae(text);
    expect(variants[0].acmgClassification).toContain("Uncertain");
  });

  it("returns failed when no RESULTS section", () => {
    const { confidence } = extractInvitae("Random unrelated text");
    expect(confidence).toBe("failed");
  });
});

describe("GeneDx parser", () => {
  it("extracts labeled Gene:/Classification: fields", () => {
    const text = `
      GeneDx Report
      FINDINGS
      Gene: BRCA2
      Variant: c.5946delT (p.Ser1982Argfs*22) — NM_000059.3
      Classification: Pathogenic
      Zygosity: Heterozygous
      Inheritance: Autosomal Dominant
    `;
    const { variants, confidence } = extractGeneDx(text);
    expect(variants).toHaveLength(1);
    expect(variants[0].gene).toBe("BRCA2");
    expect(variants[0].acmgClassification).toBe("Pathogenic");
    expect(variants[0].inheritance).toBe("Autosomal Dominant");
    expect(variants[0].hgvsNotation).toContain("c.5946delT");
    expect(confidence).toBe("high");
  });

  it("captures NM_ transcript even when on a separate line from c.", () => {
    const text = `
      Gene: MSH6
      Transcript: NM_000179.3
      Variant: c.3261dup (p.Phe1088Leufs*5)
      Classification: Likely Pathogenic
    `;
    const { variants } = extractGeneDx(text);
    expect(variants[0].hgvsNotation).toContain("NM_000179.3");
  });
});

describe("extractByLab routing", () => {
  it("routes Invitae text to the Invitae parser", () => {
    const text = `
      Invitae Corporation
      RESULTS: POSITIVE
      PALB2  NM_024675.3:c.3113G>A  p.(Trp1038*)  PATHOGENIC  Heterozygous
    `;
    const { variants } = extractByLab("Invitae", text);
    expect(variants.find((v) => v.gene === "PALB2")).toBeDefined();
  });

  it("falls through to generic extraction for unknown labs", () => {
    const text = `
      SomeLab Report
      CFTR NM_000492.4:c.1521_1523delCTT Pathogenic AR
    `;
    const { variants } = extractByLab(null, text);
    expect(variants.find((v) => v.gene === "CFTR")).toBeDefined();
  });

  it("falls through when lab parser finds nothing", () => {
    // Labeled Invitae but actually formatted like a generic line.
    const text = `
      Invitae Corporation
      GeneDx-style line: Gene: BRCA1, Classification: Pathogenic, NM_007294.4:c.68A>G
    `;
    const { variants } = extractByLab("Invitae", text);
    expect(variants.length).toBeGreaterThan(0);
  });
});
