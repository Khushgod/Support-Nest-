import { describe, it, expect, vi } from "vitest";

// Mock ClinVar so the builder does not hit the network.
vi.mock("../clinvar-client", () => ({
  lookupMany: vi.fn(async (variants: Array<{ gene: string }>) =>
    variants.map((v) => ({
      uid: "42",
      gene: v.gene,
      hgvs: "NM_X:c.1A>T",
      clinicalSignificance: "Pathogenic",
      reviewStatus: "criteria provided, multiple submitters",
      dateLastEvaluated: "2024-03-15",
      conditions: ["Hereditary breast and ovarian cancer"],
      variationUrl: "https://www.ncbi.nlm.nih.gov/clinvar/variation/42/",
    }))
  ),
}));

import { buildPrompt } from "../prompt-builder";

describe("buildPrompt", () => {
  it("injects ClinVar evidence into the user prompt", async () => {
    const { userPrompt, safetyFlags, clinvarEvidence } = await buildPrompt({
      variants: [
        {
          gene: "BRCA1",
          acmgClassification: "Pathogenic",
          hgvsNotation: "NM_007294.4:c.68_69delAG",
        },
      ],
      rawText: "",
      labSource: "Invitae",
      extractionConfidence: "high",
      context: {},
    });

    expect(userPrompt).toContain("ClinVar");
    expect(userPrompt).toContain("review_status");
    expect(userPrompt).toContain("date_last_evaluated");
    expect(userPrompt).toContain("2024-03-15");
    expect(safetyFlags.highRiskGenes).toContain("BRCA1");
    expect(clinvarEvidence).toHaveLength(1);
  });

  it("engages elevated safety mode for high-risk genes", async () => {
    const { userPrompt } = await buildPrompt({
      variants: [{ gene: "BRCA1", acmgClassification: "Pathogenic" }],
      rawText: "",
      labSource: null,
      extractionConfidence: "high",
      context: {},
    });
    expect(userPrompt).toContain("ELEVATED SAFETY MODE ENGAGED");
    expect(userPrompt).toContain("BRCA1");
  });

  it("does not engage elevated mode for non-high-risk genes", async () => {
    const { userPrompt } = await buildPrompt({
      variants: [{ gene: "CFTR", acmgClassification: "Pathogenic" }],
      rawText: "",
      labSource: null,
      extractionConfidence: "high",
      context: {},
    });
    expect(userPrompt).not.toContain("ELEVATED SAFETY MODE");
  });

  it("does not fail when ClinVar returns empty", async () => {
    const mod = await import("../clinvar-client");
    vi.mocked(mod.lookupMany).mockResolvedValueOnce([]);

    const { userPrompt } = await buildPrompt({
      variants: [{ gene: "BRCA1", acmgClassification: "Pathogenic" }],
      rawText: "",
      labSource: null,
      extractionConfidence: "high",
      context: {},
    });
    expect(userPrompt).not.toContain("ClinVar Evidence");
    expect(userPrompt).toContain("Extracted Variant Data");
  });

  it("survives ClinVar network failure (best-effort)", async () => {
    const mod = await import("../clinvar-client");
    vi.mocked(mod.lookupMany).mockRejectedValueOnce(new Error("network down"));

    const result = await buildPrompt({
      variants: [{ gene: "BRCA1", acmgClassification: "Pathogenic" }],
      rawText: "",
      labSource: null,
      extractionConfidence: "high",
      context: {},
    });
    // Should complete with empty evidence, not throw.
    expect(result.clinvarEvidence).toEqual([]);
    expect(result.userPrompt).toContain("Extracted Variant Data");
  });
});
