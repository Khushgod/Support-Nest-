"use client";

import { useState, useCallback } from "react";
import type {
  AnalysisResult,
  AnalysisStatus,
  PatientContext,
  ExtractedVariant,
} from "@/lib/types";

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeFile = useCallback(
    async (file: File, context: PatientContext) => {
      setError(null);
      setResult(null);

      try {
        // Step 1: Parse PDF
        setStatus("extracting");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("context", JSON.stringify(context));

        const parseRes = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });

        if (!parseRes.ok) {
          const errData = await parseRes.json().catch(() => null);
          throw new Error(
            errData?.error || "Failed to parse the PDF. Please try again."
          );
        }

        const extraction = await parseRes.json();

        // Step 2: Analyze with Claude
        setStatus("analyzing");
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variants: extraction.variants,
            rawText: extraction.rawText,
            context,
            labSource: extraction.labSource,
            extractionConfidence: extraction.extractionConfidence,
          }),
        });

        if (!analyzeRes.ok) {
          const errData = await analyzeRes.json().catch(() => null);
          if (errData?.code === "SAFETY_BLOCKED") {
            throw new Error(
              "Safety block: the generated analysis contained language that resembles medical advice, so we didn't show it. Please review your report with a genetic counselor directly, or try again."
            );
          }
          if (errData?.code === "OLLAMA_UNAVAILABLE") {
            throw new Error(
              "The local model is slow or unavailable. Make sure Ollama is running and the model is loaded, then try again."
            );
          }
          throw new Error(
            errData?.error || "Analysis failed. Please try again."
          );
        }

        const analysisResult: AnalysisResult = await analyzeRes.json();

        // Store in sessionStorage for results page
        sessionStorage.setItem(
          "genetranslate_result",
          JSON.stringify(analysisResult)
        );

        setResult(analysisResult);
        setStatus("complete");
        return analysisResult;
      } catch (err) {
        setStatus("error");
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
        return null;
      }
    },
    []
  );

  const analyzeManual = useCallback(
    async (variants: ExtractedVariant[], context: PatientContext) => {
      setError(null);
      setResult(null);

      try {
        setStatus("analyzing");
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variants,
            rawText: "",
            context,
            labSource: null,
            extractionConfidence: "high" as const,
          }),
        });

        if (!analyzeRes.ok) {
          const errData = await analyzeRes.json().catch(() => null);
          if (errData?.code === "SAFETY_BLOCKED") {
            throw new Error(
              "Safety block: the generated analysis contained language that resembles medical advice, so we didn't show it. Please review your report with a genetic counselor directly, or try again."
            );
          }
          if (errData?.code === "OLLAMA_UNAVAILABLE") {
            throw new Error(
              "The local model is slow or unavailable. Make sure Ollama is running and the model is loaded, then try again."
            );
          }
          throw new Error(
            errData?.error || "Analysis failed. Please try again."
          );
        }

        const analysisResult: AnalysisResult = await analyzeRes.json();
        sessionStorage.setItem(
          "genetranslate_result",
          JSON.stringify(analysisResult)
        );

        setResult(analysisResult);
        setStatus("complete");
        return analysisResult;
      } catch (err) {
        setStatus("error");
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, analyzeFile, analyzeManual, reset };
}
