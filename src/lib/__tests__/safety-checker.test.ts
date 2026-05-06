import { describe, it, expect } from "vitest";
import {
  checkSafetyFlags,
  scanOutputForProhibitedContent,
} from "../safety-checker";
import type { ExtractedVariant } from "../types";

const v = (gene: string, cls: string, hgvs?: string): ExtractedVariant => ({
  gene,
  acmgClassification: cls,
  ...(hgvs ? { hgvsNotation: hgvs } : {}),
});

describe("checkSafetyFlags", () => {
  it("flags BRCA1 as high-risk", () => {
    const flags = checkSafetyFlags([v("BRCA1", "Pathogenic", "NM_x:c.1A>T")]);
    expect(flags.hasHighRiskGenes).toBe(true);
    expect(flags.highRiskGenes).toContain("BRCA1");
  });

  it("does not flag CFTR as high-risk", () => {
    const flags = checkSafetyFlags([v("CFTR", "Pathogenic", "NM_x:c.1A>T")]);
    expect(flags.hasHighRiskGenes).toBe(false);
  });

  it("returns High confidence for pathogenic with complete data", () => {
    const flags = checkSafetyFlags([v("BRCA1", "Pathogenic", "NM_x:c.1A>T")]);
    expect(flags.overallConfidence).toBe("High");
  });

  it("returns Moderate for VUS", () => {
    const flags = checkSafetyFlags([
      v("TP53", "Variant of Uncertain Significance (VUS)", "NM_x:c.1A>T"),
    ]);
    expect(flags.overallConfidence).toBe("Moderate");
  });

  it("returns Uncertain for empty input", () => {
    expect(checkSafetyFlags([]).overallConfidence).toBe("Uncertain");
  });
});

describe("scanOutputForProhibitedContent", () => {
  it("flags treatment recommendations", () => {
    expect(
      scanOutputForProhibitedContent(
        "you should start treatment with tamoxifen"
      ).length
    ).toBeGreaterThan(0);
  });

  it("flags direct diagnostic claims", () => {
    expect(
      scanOutputForProhibitedContent("you have breast cancer").length
    ).toBeGreaterThan(0);
  });

  it("allows safe, hedged language", () => {
    expect(
      scanOutputForProhibitedContent(
        "The report found a variant in BRCA1 associated with hereditary breast cancer. Please discuss with your genetic counselor."
      )
    ).toHaveLength(0);
  });
});
