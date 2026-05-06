import type { ExtractedVariant, PatientContext } from "./types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt-templates";
import { checkSafetyFlags } from "./safety-checker";
import { lookupMany, type ClinVarEvidence } from "./clinvar-client";

export interface BuildPromptPayload {
  variants: ExtractedVariant[];
  rawText: string;
  labSource: string | null;
  extractionConfidence: string;
  context: PatientContext;
}

export async function buildPrompt(payload: BuildPromptPayload) {
  const safetyFlags = checkSafetyFlags(payload.variants);

  let clinvarEvidence: ClinVarEvidence[] = [];
  if (payload.variants.length > 0) {
    try {
      clinvarEvidence = await lookupMany(
        payload.variants.map((v) => ({
          gene: v.gene,
          hgvsNotation: v.hgvsNotation,
        }))
      );
    } catch {
      // ClinVar is best-effort — a network failure must not block analysis.
      clinvarEvidence = [];
    }
  }

  const systemPrompt = SYSTEM_PROMPT;
  const userPrompt = buildUserPrompt({
    variants: payload.variants,
    rawText: payload.rawText,
    labSource: payload.labSource,
    extractionConfidence: payload.extractionConfidence,
    context: payload.context,
    highRiskGenes: safetyFlags.highRiskGenes,
    clinvarEvidence,
  });

  return { systemPrompt, userPrompt, safetyFlags, clinvarEvidence };
}
