import type { ExtractedVariant } from "../types";
import { extractVariants as genericExtract } from "../variant-extractor";
import { extractInvitae } from "./invitae";
import { extractGeneDx } from "./genedx";

export interface LabExtractionResult {
  variants: ExtractedVariant[];
  confidence: "high" | "partial" | "failed";
  warnings: string[];
}

/**
 * Route to a lab-specific parser based on the detected lab source.
 *
 * Routing policy (intentionally conservative — the cost of phantom variants
 * is higher than the cost of a clear "unsupported format" error):
 *
 *   - Lab detected and parser returned variants → use those.
 *   - Lab detected, parser returned []          → trust it (NEGATIVE result
 *     OR unknown format). Do NOT fall through to the generic regex pipeline,
 *     which is prone to manufacturing variants from panel-gene disclaimer
 *     text and patient-name headers (e.g., "DOE", "TRANSCRIPT").
 *   - No lab detected → run the generic pipeline.
 */
export function extractByLab(
  labSource: string | null,
  rawText: string
): LabExtractionResult {
  const labResult = runLabParser(labSource, rawText);
  if (labResult) return labResult;
  return genericExtract(rawText);
}

function runLabParser(
  labSource: string | null,
  rawText: string
): LabExtractionResult | null {
  switch (labSource) {
    case "Invitae":
      return extractInvitae(rawText);
    case "GeneDx":
      return extractGeneDx(rawText);
    default:
      return null;
  }
}
