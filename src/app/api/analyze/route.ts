import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt-builder";
import {
  MAIN_DISCLAIMER,
  scanOutputForProhibitedContent,
} from "@/lib/safety-checker";
import {
  OLLAMA_MODEL,
  OllamaUnavailableError,
  ensureModelAvailable,
  generateJson,
} from "@/lib/ollama-client";
import type {
  AnalysisResult,
  ExtractedVariant,
  PatientContext,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

interface AnalyzeRequest {
  variants: ExtractedVariant[];
  rawText: string;
  context: PatientContext;
  labSource: string | null;
  extractionConfidence: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();

    if (!body.variants?.length && !body.rawText) {
      return NextResponse.json(
        { error: "No variant data or report text provided." },
        { status: 400 }
      );
    }

    // Friendly error if Ollama isn't running or the model isn't pulled.
    const health = await ensureModelAvailable();
    if (!health.ok) {
      return NextResponse.json(
        {
          error: `Local model is not available. ${health.reason}`,
        },
        { status: 503 }
      );
    }

    const { systemPrompt, userPrompt, safetyFlags } = await buildPrompt({
      variants: body.variants || [],
      rawText: body.rawText || "",
      labSource: body.labSource,
      extractionConfidence: body.extractionConfidence || "partial",
      context: body.context || {},
    });

    let parsed: {
      summary?: AnalysisResult["summary"];
      variantCards?: AnalysisResult["variantCards"];
      questions?: AnalysisResult["questions"];
    };

    try {
      parsed = await generateJson({
        system: systemPrompt,
        user: userPrompt,
        maxTokens: 4096,
        temperature: 0.2,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (err instanceof OllamaUnavailableError) {
        return NextResponse.json(
          {
            error: `The local model is slow or unavailable. ${message}`,
            code: "OLLAMA_UNAVAILABLE",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error: `The local model (${OLLAMA_MODEL}) did not return valid JSON. ${message}`,
        },
        { status: 502 }
      );
    }

    // Post-processing safety gate (spec §5.3). If the model produced
    // prohibited content (diagnostic claims or treatment recommendations),
    // we refuse to serve it rather than logging and moving on.
    const fullText = JSON.stringify(parsed);
    const prohibitedFlags = scanOutputForProhibitedContent(fullText);
    if (prohibitedFlags.length > 0) {
      console.warn("Blocking output: safety flags detected:", prohibitedFlags);
      return NextResponse.json(
        {
          error:
            "The generated analysis included content that may resemble medical advice. For your safety, we blocked it. Please try again, or review your report with a genetic counselor directly.",
          code: "SAFETY_BLOCKED",
          flags: prohibitedFlags,
        },
        { status: 422 }
      );
    }

    const result: AnalysisResult = {
      summary: parsed.summary || {
        whatWasFound: "",
        whatItMeans: "",
        whatIsUncertain: "",
      },
      variantCards: parsed.variantCards || [],
      questions: (parsed.questions || []).sort(
        (a: { priority: number }, b: { priority: number }) =>
          a.priority - b.priority
      ),
      safetyFlags,
      disclaimer: MAIN_DISCLAIMER,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
