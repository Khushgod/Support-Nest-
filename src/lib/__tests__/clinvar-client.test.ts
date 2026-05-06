import { describe, it, expect, beforeEach } from "vitest";
import {
  lookupVariant,
  lookupMany,
  __clearClinVarCache,
} from "../clinvar-client";

function makeFetchStub(
  responses: Record<string, unknown>
): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    for (const [frag, body] of Object.entries(responses)) {
      if (url.includes(frag)) {
        return new Response(JSON.stringify(body), { status: 200 });
      }
    }
    return new Response("not found", { status: 404 });
  }) as unknown as typeof fetch;
}

describe("ClinVar client", () => {
  beforeEach(() => {
    __clearClinVarCache();
  });

  it("returns evidence with review_status and last_evaluated for a known variant", async () => {
    const fetchImpl = makeFetchStub({
      "esearch.fcgi": { esearchresult: { idlist: ["12345"] } },
      "esummary.fcgi": {
        result: {
          "12345": {
            germline_classification: {
              description: "Pathogenic",
              review_status: "criteria provided, multiple submitters",
              last_evaluated: "2024-03-15",
            },
            trait_set: [{ trait_name: "Hereditary breast and ovarian cancer" }],
          },
        },
      },
    });

    const evidence = await lookupVariant(
      "BRCA1",
      "NM_007294.4:c.68_69delAG",
      { fetchImpl }
    );

    expect(evidence).not.toBeNull();
    expect(evidence!.uid).toBe("12345");
    expect(evidence!.clinicalSignificance).toBe("Pathogenic");
    expect(evidence!.reviewStatus).toContain("criteria provided");
    expect(evidence!.dateLastEvaluated).toBe("2024-03-15");
    expect(evidence!.conditions).toContain(
      "Hereditary breast and ovarian cancer"
    );
    expect(evidence!.variationUrl).toContain("12345");
  });

  it("returns null when ClinVar has no hits", async () => {
    const fetchImpl = makeFetchStub({
      "esearch.fcgi": { esearchresult: { idlist: [] } },
    });
    const evidence = await lookupVariant("XYZ9", "NM_999:c.1A>T", {
      fetchImpl,
    });
    expect(evidence).toBeNull();
  });

  it("caches results for identical gene+HGVS", async () => {
    let calls = 0;
    const fetchImpl = (async (input: RequestInfo | URL) => {
      calls++;
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("esearch"))
        return new Response(
          JSON.stringify({ esearchresult: { idlist: ["1"] } }),
          { status: 200 }
        );
      return new Response(
        JSON.stringify({
          result: {
            "1": {
              germline_classification: { description: "Pathogenic" },
            },
          },
        }),
        { status: 200 }
      );
    }) as unknown as typeof fetch;

    await lookupVariant("BRCA1", "NM_x:c.1A>T", { fetchImpl });
    const before = calls;
    await lookupVariant("BRCA1", "NM_x:c.1A>T", { fetchImpl });
    expect(calls).toBe(before); // no additional network calls
  });

  it("lookupMany paces calls to respect NCBI rate limits", async () => {
    const fetchImpl = makeFetchStub({
      "esearch.fcgi": { esearchresult: { idlist: ["1"] } },
      "esummary.fcgi": {
        result: {
          "1": { germline_classification: { description: "Pathogenic" } },
        },
      },
    });
    const started = Date.now();
    await lookupMany(
      [
        { gene: "BRCA1", hgvsNotation: "NM_x:c.1A>T" },
        { gene: "BRCA2", hgvsNotation: "NM_y:c.1A>T" },
        { gene: "TP53", hgvsNotation: "NM_z:c.1A>T" },
      ],
      { fetchImpl, minIntervalMs: 50 }
    );
    const elapsed = Date.now() - started;
    // 3 calls separated by 2 × 50ms intervals = at least 100ms between first
    // and last. Allow slack.
    expect(elapsed).toBeGreaterThanOrEqual(90);
  });

  it("lookupMany still caches — second pass over same inputs is instant", async () => {
    const fetchImpl = makeFetchStub({
      "esearch.fcgi": { esearchresult: { idlist: ["1"] } },
      "esummary.fcgi": {
        result: {
          "1": { germline_classification: { description: "Pathogenic" } },
        },
      },
    });
    const inputs = [{ gene: "BRCA1", hgvsNotation: "NM_x:c.1A>T" }];
    await lookupMany(inputs, { fetchImpl, minIntervalMs: 0 });
    const started = Date.now();
    await lookupMany(inputs, { fetchImpl, minIntervalMs: 500 });
    expect(Date.now() - started).toBeLessThan(100);
  });

  it("returns null (does not throw) on network error", async () => {
    const fetchImpl = (async () => {
      throw new Error("ECONNREFUSED");
    }) as unknown as typeof fetch;
    const evidence = await lookupVariant("BRCA1", "NM_x:c.1A>T", {
      fetchImpl,
    });
    expect(evidence).toBeNull();
  });
});

describe("prompt injection of ClinVar evidence (GT-301)", () => {
  it("includes review_status and date_last_evaluated in the user prompt", async () => {
    const { buildPrompt } = await import("../prompt-builder");
    // We can't easily intercept fetch from inside prompt-builder without
    // module mocking; instead, inject directly via the templates path.
    const { buildUserPrompt } = await import("../prompt-templates");

    const prompt = buildUserPrompt({
      variants: [
        {
          gene: "BRCA1",
          hgvsNotation: "NM_007294.4:c.68_69delAG",
          acmgClassification: "Pathogenic",
        },
      ],
      rawText: "",
      labSource: "Invitae",
      extractionConfidence: "high",
      context: {},
      highRiskGenes: ["BRCA1"],
      clinvarEvidence: [
        {
          uid: "17661",
          gene: "BRCA1",
          hgvs: "NM_007294.4:c.68_69delAG",
          clinicalSignificance: "Pathogenic",
          reviewStatus: "criteria provided, multiple submitters",
          dateLastEvaluated: "2024-03-15",
          conditions: ["Hereditary breast and ovarian cancer"],
          variationUrl: "https://www.ncbi.nlm.nih.gov/clinvar/variation/17661/",
        },
      ],
    });

    expect(prompt).toContain("review_status");
    expect(prompt).toContain("date_last_evaluated");
    expect(prompt).toContain("2024-03-15");
    expect(prompt).toContain("ClinVar");
    // buildPrompt should still be callable (smoke).
    expect(typeof buildPrompt).toBe("function");
  });
});
