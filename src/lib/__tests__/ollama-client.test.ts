import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Ollama SDK before importing the module under test.
const { chatMock } = vi.hoisted(() => ({ chatMock: vi.fn() }));
vi.mock("ollama", () => ({
  Ollama: class {
    chat = chatMock;
    list = async () => ({ models: [] });
    abort = () => {};
  },
}));

import { generateJson, OllamaUnavailableError } from "../ollama-client";

describe("generateJson", () => {
  beforeEach(() => {
    chatMock.mockReset();
  });

  it("returns parsed JSON on first success", async () => {
    chatMock.mockResolvedValueOnce({
      message: { content: '{"ok": true}' },
    });
    const out = await generateJson<{ ok: boolean }>({
      system: "s",
      user: "u",
    });
    expect(out.ok).toBe(true);
    expect(chatMock).toHaveBeenCalledTimes(1);
  });

  it("strips code fences around JSON", async () => {
    chatMock.mockResolvedValueOnce({
      message: { content: "```json\n{\"a\":1}\n```" },
    });
    const out = await generateJson<{ a: number }>({ system: "s", user: "u" });
    expect(out.a).toBe(1);
  });

  it("retries on transport errors and eventually succeeds", async () => {
    chatMock
      .mockRejectedValueOnce(new Error("ECONNREFUSED"))
      .mockResolvedValueOnce({ message: { content: '{"ok":true}' } });
    const out = await generateJson<{ ok: boolean }>({
      system: "s",
      user: "u",
    });
    expect(out.ok).toBe(true);
    expect(chatMock).toHaveBeenCalledTimes(2);
  });

  it("throws OllamaUnavailableError after all retries fail", async () => {
    chatMock.mockRejectedValue(new Error("ECONNREFUSED"));
    await expect(
      generateJson({ system: "s", user: "u", timeoutMs: 100 })
    ).rejects.toBeInstanceOf(OllamaUnavailableError);
    expect(chatMock).toHaveBeenCalledTimes(3);
  }, 10000);

  it("runs a JSON-correction round when the first response is not JSON", async () => {
    chatMock
      .mockResolvedValueOnce({ message: { content: "sure, here you go!" } })
      .mockResolvedValueOnce({ message: { content: '{"fixed":true}' } });
    const out = await generateJson<{ fixed: boolean }>({
      system: "s",
      user: "u",
    });
    expect(out.fixed).toBe(true);
    expect(chatMock).toHaveBeenCalledTimes(2);
  });
});
