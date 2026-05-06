import { Ollama } from "ollama";

/**
 * Thin wrapper around the Ollama Node SDK so the rest of the app does not need
 * to know which open-source model is running underneath. All config comes from
 * environment variables with sensible local-dev defaults.
 *
 * Setup:
 *   1. Install Ollama from https://ollama.com
 *   2. `ollama pull qwen2.5:7b-instruct` (or any instruct-tuned model)
 *   3. Make sure `ollama serve` is running on http://127.0.0.1:11434
 */

const HOST = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";

// Default to Qwen2.5 7B Instruct — it follows instructions well, supports
// JSON output natively, and runs comfortably on an 8GB machine.
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:7b-instruct";

const DEFAULT_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS ?? 60_000);
const MAX_ATTEMPTS = 3; // 1 initial + 2 retries.

const client = new Ollama({ host: HOST });

export class OllamaUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OllamaUnavailableError";
  }
}

export interface GenerateJsonArgs {
  system: string;
  user: string;
  /** Override the default model for a single call. */
  model?: string;
  /** Cap on generated tokens. Ollama maps this to num_predict. */
  maxTokens?: number;
  /** Lower = more deterministic. Clinical-style output should stay low. */
  temperature?: number;
  /** Override the per-attempt timeout. */
  timeoutMs?: number;
}

async function chatWithTimeout(
  args: Parameters<typeof client.chat>[0],
  timeoutMs: number
): Promise<Awaited<ReturnType<typeof client.chat>>> {
  // Best-effort cancellation: the `ollama` SDK exposes `client.abort()` to
  // terminate the current streaming request. We fall back to Promise.race if
  // it isn't available (older versions).
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    try {
      (client as unknown as { abort?: () => void }).abort?.();
    } catch {
      // abort is advisory — the timeout still fires via the race below.
    }
  }, timeoutMs);

  try {
    return await Promise.race([
      client.chat(args),
      new Promise<never>((_, reject) => {
        setTimeout(
          () =>
            reject(
              new OllamaUnavailableError(
                `Ollama request timed out after ${timeoutMs}ms. The local model may be busy or unresponsive.`
              )
            ),
          timeoutMs
        );
      }),
    ]);
  } catch (err) {
    if (timedOut) {
      throw new OllamaUnavailableError(
        `Ollama request timed out after ${timeoutMs}ms.`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Ask a local Ollama model for a JSON object and parse it.
 *
 * Retries up to 3 times with exponential backoff on timeouts / transport
 * errors. On JSON-parse failures, attempts a single correction round (same
 * pattern the previous Anthropic-backed route used).
 */
export async function generateJson<T = unknown>(
  args: GenerateJsonArgs
): Promise<T> {
  const model = args.model ?? OLLAMA_MODEL;
  const timeoutMs = args.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseRequest = {
    model,
    format: "json" as const,
    options: {
      temperature: args.temperature ?? 0.2,
      num_predict: args.maxTokens ?? 4096,
    },
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await chatWithTimeout(baseRequest, timeoutMs);
      const raw = response.message?.content ?? "";
      try {
        return JSON.parse(stripCodeFences(raw)) as T;
      } catch {
        // One-shot JSON-correction retry in the same attempt.
        const retry = await chatWithTimeout(
          {
            ...baseRequest,
            options: { ...baseRequest.options, temperature: 0 },
            messages: [
              ...baseRequest.messages,
              { role: "assistant", content: raw },
              {
                role: "user",
                content:
                  "Your previous response was not valid JSON. Return ONLY a single JSON object with no surrounding text, prose, or code fences.",
              },
            ],
          },
          timeoutMs
        );
        return JSON.parse(stripCodeFences(retry.message?.content ?? "")) as T;
      }
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS) {
        // Exponential backoff: 500ms, 1500ms.
        await sleep(500 * Math.pow(3, attempt - 1));
      }
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new OllamaUnavailableError(
    `Ollama failed after ${MAX_ATTEMPTS} attempts: ${message}`
  );
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
}

/**
 * Generate freeform text (no JSON-mode constraint). Use this for tools whose
 * output is naturally prose, such as the plain-language translator.
 *
 * Same retry / timeout semantics as `generateJson`. Output is returned as-is
 * (no fence-stripping or parsing).
 */
export async function generateText(
  args: GenerateJsonArgs
): Promise<string> {
  const model = args.model ?? OLLAMA_MODEL;
  const timeoutMs = args.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseRequest = {
    model,
    options: {
      temperature: args.temperature ?? 0.3,
      num_predict: args.maxTokens ?? 2048,
    },
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await chatWithTimeout(baseRequest, timeoutMs);
      return (response.message?.content ?? "").trim();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS) {
        await sleep(500 * Math.pow(3, attempt - 1));
      }
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new OllamaUnavailableError(
    `Ollama failed after ${MAX_ATTEMPTS} attempts: ${message}`
  );
}

/** Quick health check used by the analyze route to give a friendlier error. */
export async function ensureModelAvailable(
  model: string = OLLAMA_MODEL
): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    const list = await client.list();
    const names = list.models.map((m) => m.name);
    if (names.some((n) => n === model || n.startsWith(`${model}:`))) {
      return { ok: true };
    }
    return {
      ok: false,
      reason: `Model "${model}" is not pulled. Run: ollama pull ${model}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      reason: `Could not reach Ollama at ${HOST}. Is it running? (${message})`,
    };
  }
}
