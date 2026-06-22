import Groq from "groq-sdk";

/**
 * Drop-in replacement for ollama-client.ts using Groq's hosted API.
 * All function signatures and exports are identical — no changes needed
 * in any other file (analyze/route.ts, etc).
 *
 * Setup:
 *   1. Get a free API key at https://console.groq.com
 *   2. Add GROQ_API_KEY to your .env.local
 *   3. Optionally set GROQ_MODEL (defaults to llama-3.3-70b-versatile)
 */

export const OLLAMA_MODEL =
  process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

const DEFAULT_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS ?? 60_000);
const MAX_ATTEMPTS = 3;

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: DEFAULT_TIMEOUT_MS,
});

// Kept the same name so analyze/route.ts doesn't need changes
export class OllamaUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OllamaUnavailableError";
  }
}

export interface GenerateJsonArgs {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Ask Groq for a JSON object and parse it.
 * Retries up to 3 times with exponential backoff.
 */
export async function generateJson<T = unknown>(
  args: GenerateJsonArgs
): Promise<T> {
  const model = args.model ?? OLLAMA_MODEL;

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        temperature: args.temperature ?? 0.2,
        max_tokens: args.maxTokens ?? 4096,
        response_format: { type: "json_object" }, // Groq native JSON mode
        messages: [
          { role: "system", content: args.system },
          { role: "user", content: args.user },
        ],
      });

      const raw = response.choices[0]?.message?.content ?? "";

      try {
        return JSON.parse(stripCodeFences(raw)) as T;
      } catch {
        // One-shot JSON-correction retry
        const retry = await client.chat.completions.create({
          model,
          temperature: 0,
          max_tokens: args.maxTokens ?? 4096,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: args.system },
            { role: "user", content: args.user },
            { role: "assistant", content: raw },
            {
              role: "user",
              content:
                "Your previous response was not valid JSON. Return ONLY a single JSON object with no surrounding text, prose, or code fences.",
            },
          ],
        });
        return JSON.parse(
          stripCodeFences(retry.choices[0]?.message?.content ?? "")
        ) as T;
      }
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
    `Groq API failed after ${MAX_ATTEMPTS} attempts: ${message}`
  );
}

/**
 * Generate freeform text (no JSON constraint).
 * Same retry semantics as generateJson.
 */
export async function generateText(args: GenerateJsonArgs): Promise<string> {
  const model = args.model ?? OLLAMA_MODEL;

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        temperature: args.temperature ?? 0.3,
        max_tokens: args.maxTokens ?? 2048,
        messages: [
          { role: "system", content: args.system },
          { role: "user", content: args.user },
        ],
      });
      return (response.choices[0]?.message?.content ?? "").trim();
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
    `Groq API failed after ${MAX_ATTEMPTS} attempts: ${message}`
  );
}

/**
 * Health check — replaces the Ollama model-pull check.
 * Simply verifies the API key is present and Groq is reachable.
 */
export async function ensureModelAvailable(
  model: string = OLLAMA_MODEL
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!process.env.GROQ_API_KEY) {
    return {
      ok: false,
      reason: "GROQ_API_KEY is not set. Add it to your .env.local file.",
    };
  }
  try {
    // Lightweight call to verify connectivity
    await client.chat.completions.create({
      model,
      max_tokens: 1,
      messages: [{ role: "user", content: "ping" }],
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      reason: `Could not reach Groq API: ${message}`,
    };
  }
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
}