import { describe, it, expect } from "vitest";
import { extractInvitae } from "../parsers/invitae";
import { extractGeneDx } from "../parsers/genedx";
import { extractByLab } from "../parsers";

describe("Invitae parser", () => {
  it("extracts a single Pathogenic variant from a real-shape table", () => {
    // The Invitae result table includes the column header line followed by
    // one row per variant, then an "About this test" disclaimer.
    const text = `
      Invitae Genetic Health Screen
      RESULT: POSITIVE
      A clinically significant genetic change was found in the BRIP1 gene.
      GENE VARIANT ZYGOSITY VARIANT CLASSIFICATION
      BRIP1 c.1343G>A (p.Trp448*) heterozygous PATHOGENIC
      About this test
    `;
    const { variants, confidence } = extractInvitae(text);
    const brip1 = variants.find((v) => v.gene === "BRIP1");
    expect(brip1).toBeDefined();
    expect(brip1!.acmgClassification).toBe("Pathogenic");
    expect(brip1!.zygosity).toBe("Heterozygous");
    expect(brip1!.hgvsNotation).toContain("c.1343G>A");
    expect(brip1!.hgvsNotation).toContain("p.Trp448*");
    // No double-paren regression.
    expect(brip1!.hgvsNotation).not.toMatch(/\)\)/);
    expect(confidence).toBe("high");
  });

  it("handles VUS classification spelled out", () => {
    const text = `
      RESULT: UNCERTAIN
      GENE VARIANT ZYGOSITY VARIANT CLASSIFICATION
      MSH2 NM_000251.3:c.942+3A>T heterozygous VARIANT OF UNCERTAIN SIGNIFICANCE
      About this test
    `;
    const { variants } = extractInvitae(text);
    const msh2 = variants.find((v) => v.gene === "MSH2");
    expect(msh2?.acmgClassification).toContain("Uncertain");
  });

  it("returns confidence=high with [] for a NEGATIVE result", () => {
    const text = `
      Invitae Common Hereditary Cancers Panel
      RESULT: NEGATIVE
      About this test
      Genes Analyzed: BRCA1, BRCA2, EPCAM, MLH1
    `;
    const { variants, confidence } = extractInvitae(text);
    expect(variants).toHaveLength(0);
    expect(confidence).toBe("high");
  });

  it("returns failed when the result-table header is missing", () => {
    const { variants, confidence } = extractInvitae("Random unrelated text");
    expect(variants).toHaveLength(0);
    expect(confidence).toBe("failed");
  });

  it("does not emit phantom variants from the patient header (DOE, MIM, DOB)", () => {
    const text = `
      Patient name: Jane DOE
      DOB: 1990-01-01
      MIM: 12345
      Invitae Test
      GENE VARIANT ZYGOSITY VARIANT CLASSIFICATION
      BRCA1 c.68A>G heterozygous PATHOGENIC
      About this test
    `;
    const { variants } = extractInvitae(text);
    const genes = variants.map((v) => v.gene);
    expect(genes).not.toContain("DOE");
    expect(genes).not.toContain("DOB");
    expect(genes).not.toContain("MIM");
    expect(genes).toContain("BRCA1");
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
    // No double-paren regression.
    expect(variants[0].hgvsNotation).not.toMatch(/\)\)/);
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
      RESULT: POSITIVE
      GENE VARIANT ZYGOSITY VARIANT CLASSIFICATION
      PALB2 NM_024675.3:c.3113G>A (p.Trp1038*) heterozygous PATHOGENIC
      About this test
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

  it("does NOT fall through when a lab is detected but parser fails (refuses to manufacture phantoms)", () => {
    // Labeled Invitae but missing the result-table header. The OLD behaviour
    // fell through to the generic extractor and produced false positives;
    // the new behaviour preserves the lab parser's "failed" verdict.
    const text = `
      Invitae Corporation
      GeneDx-style line: Gene: BRCA1, Classification: Pathogenic, NM_007294.4:c.68A>G
    `;
    const { variants, confidence } = extractByLab("Invitae", text);
    expect(variants).toHaveLength(0);
    expect(confidence).toBe("failed");
  });
});
