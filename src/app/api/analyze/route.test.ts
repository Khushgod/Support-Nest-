import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Ollama client and ClinVar client before importing the route.
vi.mock("@/lib/ollama-client", () => ({
  OLLAMA_MODEL: "test-model",
  ensureModelAvailable: vi.fn(async () => ({ ok: true })),
  generateJson: vi.fn(),
}));

vi.mock("@/lib/clinvar-client", () => ({
  lookupMany: vi.fn(async () => []),
}));

import { POST } from "./route";
import { generateJson } from "@/lib/ollama-client";

function makeReq(body: unknown): Request {
  return new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/analyze — safety gate (GT-304)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 422 SAFETY_BLOCKED when LLM output contains treatment recs", async () => {
    vi.mocked(generateJson).mockResolvedValueOnce({
      summary: {
        whatWasFound: "A BRCA1 variant.",
        whatItMeans: "you should start treatment with tamoxifen immediately",
        whatIsUncertain: "",
      },
      variantCards: [],
      questions: [],
    });

    const req = makeReq({
      variants: [{ gene: "BRCA1", acmgClassification: "Pathogenic" }],
      rawText: "",
      context: {},
      labSource: "Invitae",
      extractionConfidence: "high",
    });

    // Cast because NextRequest is a superset of Request and POST accepts it.
    const res = await POST(req as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.code).toBe("SAFETY_BLOCKED");
    expect(json.flags.length).toBeGreaterThan(0);
  });

  it("returns 200 when output is safe", async () => {
    vi.mocked(generateJson).mockResolvedValueOnce({
      summary: {
        whatWasFound: "The report found a variant in BRCA1.",
        whatItMeans:
          "This variant is associated with hereditary breast and ovarian cancer. Please discuss with your genetic counselor.",
        whatIsUncertain: "",
      },
      variantCards: [],
      questions: [{ question: "What next?", reasoning: "planning", priority: 1 }],
    });

    const req = makeReq({
      variants: [{ gene: "BRCA1", acmgClassification: "Pathogenic" }],
      rawText: "",
      context: {},
      labSource: "Invitae",
      extractionConfidence: "high",
    });

    const res = await POST(req as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.disclaimer).toBeDefined();
    expect(json.safetyFlags.hasHighRiskGenes).toBe(true);
  });
});
