import { describe, it, expect, vi } from "vitest";

// Inject a stub PDF text extractor and a deterministic detector so the route
// test exercises the wiring without touching pdfjs.
vi.mock("@/lib/pdf-parser", () => ({
  extractTextFromPDF: vi.fn(),
}));

vi.mock("@/lib/lab-detector", () => ({
  detectLab: vi.fn(),
}));

vi.mock("@/lib/parsers", () => ({
  extractByLab: vi.fn(),
}));

import { POST } from "./route";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { detectLab } from "@/lib/lab-detector";
import { extractByLab } from "@/lib/parsers";

function makeReq(file?: File): Request {
  const fd = new FormData();
  if (file) fd.append("file", file);
  return new Request("http://localhost/api/parse-pdf", {
    method: "POST",
    body: fd,
  });
}

function pdfFile(content = new Uint8Array([0x25, 0x50, 0x44, 0x46])): File {
  return new File([content], "report.pdf", { type: "application/pdf" });
}

describe("POST /api/parse-pdf", () => {
  it("returns 400 when no file is uploaded", async () => {
    const res = await POST(makeReq() as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 when the file isn't a PDF", async () => {
    const txt = new File(["hello"], "notes.txt", { type: "text/plain" });
    const res = await POST(makeReq(txt) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 when the file exceeds the 25 MB cap", async () => {
    const big = new Uint8Array(26 * 1024 * 1024);
    const res = await POST(makeReq(pdfFile(big)) as never);
    expect(res.status).toBe(400);
  });

  it("returns 422 when the parser produces no meaningful text", async () => {
    vi.mocked(extractTextFromPDF).mockResolvedValueOnce("   ");
    const res = await POST(makeReq(pdfFile()) as never);
    expect(res.status).toBe(422);
  });

  it("returns 200 with structured extraction on success", async () => {
    vi.mocked(extractTextFromPDF).mockResolvedValueOnce(
      "Invitae Genetic Health Screen ".repeat(20)
    );
    vi.mocked(detectLab).mockReturnValueOnce("Invitae");
    vi.mocked(extractByLab).mockReturnValueOnce({
      variants: [
        {
          gene: "BRIP1",
          acmgClassification: "Pathogenic",
          hgvsNotation: "c.1343G>A",
          zygosity: "Heterozygous",
        },
      ],
      confidence: "high",
      warnings: [],
    });

    const res = await POST(makeReq(pdfFile()) as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.labSource).toBe("Invitae");
    expect(json.extractionConfidence).toBe("high");
    expect(json.variants[0].gene).toBe("BRIP1");
  });

  it("propagates the parser's failed-confidence verdict", async () => {
    vi.mocked(extractTextFromPDF).mockResolvedValueOnce(
      "Some recognizable Invitae header text long enough to pass the 50-char minimum."
    );
    vi.mocked(detectLab).mockReturnValueOnce("Invitae");
    vi.mocked(extractByLab).mockReturnValueOnce({
      variants: [],
      confidence: "failed",
      warnings: ["Could not find result-table header."],
    });
    const res = await POST(makeReq(pdfFile()) as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.extractionConfidence).toBe("failed");
    expect(json.variants).toHaveLength(0);
    expect(json.warnings.length).toBeGreaterThan(0);
  });

  it("returns 500 when the PDF parser throws", async () => {
    vi.mocked(extractTextFromPDF).mockRejectedValueOnce(
      new Error("Could not read this PDF.")
    );
    const res = await POST(makeReq(pdfFile()) as never);
    expect(res.status).toBe(500);
  });
});
