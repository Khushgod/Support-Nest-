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
 * Route to a lab-specific parser based on the detected lab source. Unknown or
 * unsupported labs fall through to the generic regex pipeline.
 */
export function extractByLab(
  labSource: string | null,
  rawText: string
): LabExtractionResult {
  const labResult = runLabParser(labSource, rawText);
  if (labResult && labResult.variants.length > 0) {
    return labResult;
  }
  // Fall through — either no lab match or the lab parser missed.
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
