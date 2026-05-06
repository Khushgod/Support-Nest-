import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";

function req(body: unknown): Request {
  return new Request("http://localhost/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const originalFetch = global.fetch;
const originalKey = process.env.RESEND_API_KEY;

describe("POST /api/send-email", () => {
  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalKey !== undefined) process.env.RESEND_API_KEY = originalKey;
    else delete process.env.RESEND_API_KEY;
    vi.restoreAllMocks();
  });

  it("returns 503 when RESEND_API_KEY is unset", async () => {
    const res = await POST(
      req({ to: "a@b.com", pdfBase64: "x".repeat(200) }) as never
    );
    expect(res.status).toBe(503);
  });

  it("returns 400 for a malformed email address", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const res = await POST(
      req({ to: "not-an-email", pdfBase64: "x".repeat(200) }) as never
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when pdfBase64 is missing or tiny", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const res = await POST(req({ to: "a@b.com", pdfBase64: "x" }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 413 when pdfBase64 exceeds size cap", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const huge = "x".repeat(16 * 1024 * 1024);
    const res = await POST(req({ to: "a@b.com", pdfBase64: huge }) as never);
    expect(res.status).toBe(413);
  });

  it("forwards to Resend and returns 200 on success", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ id: "msg_123" }), { status: 200 })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const res = await POST(
      req({ to: "user@example.com", pdfBase64: "x".repeat(300) }) as never
    );
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(init.body as string);
    expect(body.to).toBe("user@example.com");
    expect(body.attachments[0].filename).toBe("GeneTranslate-Report.pdf");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer re_test"
    );
  });

  it("returns 502 when Resend rejects", async () => {
    process.env.RESEND_API_KEY = "re_test";
    global.fetch = (async () =>
      new Response("Invalid API key", { status: 401 })) as unknown as typeof fetch;

    const res = await POST(
      req({ to: "user@example.com", pdfBase64: "x".repeat(300) }) as never
    );
    expect(res.status).toBe(502);
  });

  it("rejects invalid JSON body with 400", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const bad = new Request("http://localhost/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json{",
    });
    const res = await POST(bad as never);
    expect(res.status).toBe(400);
  });
});
