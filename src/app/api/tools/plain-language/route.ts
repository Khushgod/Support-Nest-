import { NextRequest, NextResponse } from "next/server";
import {
  ensureModelAvailable,
  generateText,
  OllamaUnavailableError,
} from "@/lib/ollama-client";

export const runtime = "nodejs";
export const maxDuration = 90;

const AUDIENCES = {
  plain: {
    label: "Plain English",
    instructions:
      "Rewrite the input in plain English aimed at a general adult reader (around an 8th-grade reading level). Replace jargon with everyday words. Keep all factual content; do not invent information. Use short sentences and short paragraphs.",
  },
  kid: {
    label: "Kid-friendly (age 8–12)",
    instructions:
      "Rewrite the input for a kid aged 8 to 12. Use a warm, calm tone. Keep sentences short. Replace medical, legal, or educational jargon with simple words a kid would know. Do not be condescending. Do not invent information; if you must omit a detail because it would be too complex, that is fine.",
  },
  summary: {
    label: "Quick summary",
    instructions:
      "Produce a 3 to 5 sentence plain-English summary of the input. Lead with the single most important takeaway. Do not include caveats, source attributions, or filler like 'In summary'.",
  },
  actions: {
    label: "Action items only",
    instructions:
      "Extract only the concrete action items the reader is being asked or expected to do, as a short bulleted list. Each bullet should start with a verb and be specific. If the input is informational with no actions, respond with a single bullet that says: 'No action items required.' Do not add commentary.",
  },
} as const;

const TONES = {
  warm: "Use a warm, supportive tone. Acknowledge that the topic may be hard, but don't be saccharine.",
  neutral: "Use a neutral, matter-of-fact tone.",
  professional:
    "Use a professional, calm tone suitable for forwarding to a clinician, school administrator, or HR.",
} as const;

type Audience = keyof typeof AUDIENCES;
type Tone = keyof typeof TONES;

const MAX_INPUT_CHARS = 12_000;

interface Body {
  text?: unknown;
  audience?: unknown;
  tone?: unknown;
  glossary?: unknown;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Expected a JSON body." },
      { status: 400 }
    );
  }

  if (typeof body.text !== "string" || body.text.trim().length < 20) {
    return NextResponse.json(
      { error: "Please paste at least a sentence or two of text." },
      { status: 400 }
    );
  }
  if (body.text.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `Text exceeds the ${MAX_INPUT_CHARS.toLocaleString()}-character limit.` },
      { status: 413 }
    );
  }

  const audience: Audience =
    typeof body.audience === "string" && body.audience in AUDIENCES
      ? (body.audience as Audience)
      : "plain";
  const tone: Tone =
    typeof body.tone === "string" && body.tone in TONES
      ? (body.tone as Tone)
      : "warm";
  const includeGlossary = body.glossary === true;

  const health = await ensureModelAvailable();
  if (!health.ok) {
    return NextResponse.json(
      {
        error: `Local model is not available. ${health.reason}`,
        hint: "The Plain-Language Translator runs on a local model via Ollama, so your text never leaves your machine. Install Ollama and pull a model to use this tool.",
      },
      { status: 503 }
    );
  }

  const system = [
    "You rewrite jargon-heavy text into plain language for parents, teachers, and neurodivergent adults.",
    AUDIENCES[audience].instructions,
    TONES[tone],
    "Preserve all medication names, dosages, dates, deadlines, names, and numbers exactly. Do not soften legal or medical content into something it isn't.",
    "Output the rewritten text only. Do not preface with 'Here is...' or 'Sure!'. Do not add headings unless the original had them.",
  ].join(" ");

  let rewritten: string;
  try {
    rewritten = await generateText({
      system,
      user: body.text,
      temperature: audience === "summary" ? 0.2 : 0.35,
      maxTokens: audience === "summary" ? 600 : 2048,
    });
  } catch (err) {
    if (err instanceof OllamaUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: "The model failed to respond. Please try again." },
      { status: 500 }
    );
  }

  let glossary: { term: string; plain: string }[] | undefined;
  if (includeGlossary) {
    try {
      const glossarySystem =
        "You extract jargon (medical, legal, educational, insurance) from the user's input and explain each term in one short plain-English sentence. Return at most 8 entries. Skip terms a typical adult would already know.";
      const raw = await generateText({
        system: `${glossarySystem} Respond with a JSON array of objects shaped like {"term": "...", "plain": "..."} and nothing else.`,
        user: body.text,
        temperature: 0.1,
        maxTokens: 800,
      });
      const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```$/, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        glossary = parsed
          .filter(
            (g) =>
              g &&
              typeof g === "object" &&
              typeof g.term === "string" &&
              typeof g.plain === "string"
          )
          .slice(0, 8)
          .map((g) => ({ term: g.term.trim(), plain: g.plain.trim() }))
          .filter((g) => g.term && g.plain);
      }
    } catch {
      // Glossary is best-effort; swallow errors and return without it.
    }
  }

  return NextResponse.json({
    rewritten,
    glossary,
    audience: AUDIENCES[audience].label,
    tone,
  });
}
