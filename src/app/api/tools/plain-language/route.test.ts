import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/ollama-client", () => ({
  ensureModelAvailable: vi.fn(),
  generateText: vi.fn(),
  OllamaUnavailableError: class extends Error {},
}));

import {
  ensureModelAvailable,
  generateText,
  OllamaUnavailableError,
} from "@/lib/ollama-client";

const mEnsure = vi.mocked(ensureModelAvailable);
const mGen = vi.mocked(generateText);

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/tools/plain-language", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mEnsure.mockReset();
  mGen.mockReset();
});

describe("POST /api/tools/plain-language", () => {
  it("400s when text is missing or too short", async () => {
    const r = await POST(makeRequest({ text: "hi" }) as never);
    expect(r.status).toBe(400);
  });

  it("413s when text exceeds the 12k cap", async () => {
    const long = "a".repeat(12_001);
    const r = await POST(makeRequest({ text: long }) as never);
    expect(r.status).toBe(413);
  });

  it("503s with a friendly hint when Ollama is unreachable", async () => {
    mEnsure.mockResolvedValue({
      ok: false,
      reason: "Could not reach Ollama at http://127.0.0.1:11434.",
    });
    const r = await POST(
      makeRequest({ text: "Some long enough sample text to pass the gate." }) as never
    );
    expect(r.status).toBe(503);
    const body = await r.json();
    expect(body.error).toMatch(/Local model is not available/);
    expect(body.hint).toMatch(/Ollama/);
  });

  it("returns rewritten text on success and respects the audience label", async () => {
    mEnsure.mockResolvedValue({ ok: true });
    mGen.mockResolvedValueOnce("Plain version of the text.");
    const r = await POST(
      makeRequest({
        text: "The patient presents with significant intra-cognitive discrepancy on testing.",
        audience: "kid",
        tone: "warm",
        glossary: false,
      }) as never
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.rewritten).toBe("Plain version of the text.");
    expect(body.audience).toMatch(/Kid-friendly/);
    expect(mGen).toHaveBeenCalledTimes(1);
  });

  it("attaches a glossary when requested and parses array output", async () => {
    mEnsure.mockResolvedValue({ ok: true });
    mGen
      .mockResolvedValueOnce("Plain version with terms.") // main rewrite
      .mockResolvedValueOnce(
        JSON.stringify([
          { term: "ACMG", plain: "A medical-genetics rule book." },
          { term: "VUS", plain: "Variant of unknown significance." },
        ])
      );
    const r = await POST(
      makeRequest({
        text: "Some long enough sample with ACMG VUS terminology in it.",
        glossary: true,
      }) as never
    );
    const body = await r.json();
    expect(body.glossary).toEqual([
      { term: "ACMG", plain: "A medical-genetics rule book." },
      { term: "VUS", plain: "Variant of unknown significance." },
    ]);
  });

  it("returns 503 when the model itself bombs", async () => {
    mEnsure.mockResolvedValue({ ok: true });
    mGen.mockRejectedValueOnce(
      new (OllamaUnavailableError as unknown as new (m: string) => Error)(
        "Ollama failed after 3 attempts"
      )
    );
    const r = await POST(
      makeRequest({ text: "A reasonable length input here please." }) as never
    );
    expect(r.status).toBe(503);
  });
});
