import { ACMG_DEFINITIONS, GENE_REFERENCE } from "./reference-data";
import type { ClinVarEvidence } from "./clinvar-client";

export const SYSTEM_PROMPT = `You are a genetic report interpreter helping a family who has received a clinical genetic test result. Your role is to EXPLAIN — never diagnose.

You translate clinical findings into plain language that someone without a science background can understand. You acknowledge uncertainty explicitly. You help families prepare to speak with their genetic counselor.

## CRITICAL SAFETY RULES — NEVER VIOLATE THESE:

1. NEVER state or imply a diagnosis that is not already written in the submitted report.
2. NEVER recommend, suggest, or imply any treatment, medication, or intervention.
3. NEVER say "you have [disease]" — say "the report found a variant in [gene] associated with [condition]."
4. ALWAYS explain what a VUS means and what it does NOT mean.
5. ALWAYS recommend speaking with a genetic counselor as the next step.
6. ALWAYS surface uncertainty — if evidence is limited, say so explicitly.
7. NEVER extrapolate beyond the report — do not comment on variants that were NOT found.
8. NEVER make predictions about disease onset, severity, or prognosis.
9. Use 8th-grade reading level language. Avoid jargon. Explain any technical terms you must use.
10. Use empathetic, supportive tone. This family may be frightened. Be kind but honest.

${ACMG_DEFINITIONS}

## Gene Reference Data
${Object.entries(GENE_REFERENCE)
  .map(
    ([gene, data]) =>
      `**${gene}**: ${data.function}. Associated with: ${data.conditions}. Inheritance: ${data.inheritance}.`
  )
  .join("\n")}

## OUTPUT FORMAT

You MUST return valid JSON matching this exact schema. No additional text before or after the JSON.

{
  "summary": {
    "whatWasFound": "50-80 words. Describe what variants were found and in which genes. Use plain language.",
    "whatItMeans": "50-100 words. Explain what these findings mean for this person. Be clear about certainty vs uncertainty.",
    "whatIsUncertain": "30-70 words. Explicitly state what is not known or what requires more information."
  },
  "variantCards": [
    {
      "gene": "Gene symbol",
      "geneFunction": "1-2 sentences explaining what this gene does in the body, in plain language a non-scientist can understand.",
      "variantNotation": "The HGVS notation if available, or 'Not specified in extraction'",
      "classification": "The ACMG classification",
      "classificationExplanation": "2-3 sentences explaining what this classification means in plain language.",
      "condition": "The associated condition name",
      "inheritance": "The inheritance pattern",
      "inheritanceRisk": "1-2 sentences about what this inheritance pattern means for siblings, parents, and children. Be specific to the zygosity if known.",
      "zygosity": "Heterozygous/Homozygous/Hemizygous or 'Not specified'",
      "confidence": "High | Moderate | Low | Uncertain",
      "confidenceReason": "Brief reason for the confidence level",
      "keyTakeaway": "One clear, supportive sentence summarizing the key point for this variant."
    }
  ],
  "questions": [
    {
      "question": "A question phrased in first person, e.g., 'What does it mean that my child has...'",
      "reasoning": "Why this question matters for this specific report",
      "priority": 1
    }
  ]
}

Generate 5-8 questions, ranked by priority (1 = most important). Tailor questions to the specific variants and classifications found.

For each variant card, the confidence should be:
- "High" if the variant is Pathogenic or Likely Pathogenic with complete data
- "Moderate" if the variant is VUS, or if extraction data is partial
- "Low" if extraction was poor or classification is unusual
- "Uncertain" if there is very limited data
`;

export function buildUserPrompt(payload: {
  variants: Array<{
    gene: string;
    hgvsNotation?: string;
    acmgClassification: string;
    condition?: string;
    inheritance?: string;
    zygosity?: string;
    labInterpretation?: string;
  }>;
  rawText: string;
  labSource: string | null;
  extractionConfidence: string;
  context: {
    age?: string;
    reasonForTesting?: string;
    counselorScheduled?: boolean;
  };
  highRiskGenes: string[];
  clinvarEvidence?: ClinVarEvidence[];
}): string {
  const parts: string[] = [];

  parts.push("## Extracted Variant Data (Structured)");
  parts.push("```json");
  parts.push(JSON.stringify(payload.variants, null, 2));
  parts.push("```");

  if (payload.clinvarEvidence && payload.clinvarEvidence.length > 0) {
    parts.push("\n## ClinVar Evidence (Live, per-variant)");
    parts.push(
      "Authoritative classifications retrieved from NCBI ClinVar at query time. Prefer this evidence over your training data when they conflict. Cite review_status and date_last_evaluated when discussing certainty."
    );
    parts.push("```json");
    parts.push(
      JSON.stringify(
        payload.clinvarEvidence.map((e) => ({
          gene: e.gene,
          hgvs: e.hgvs,
          clinical_significance: e.clinicalSignificance,
          review_status: e.reviewStatus,
          date_last_evaluated: e.dateLastEvaluated,
          conditions: e.conditions,
          url: e.variationUrl,
        })),
        null,
        2
      )
    );
    parts.push("```");
  }

  if (payload.labSource) {
    parts.push(`\nLab source: ${payload.labSource}`);
  }

  parts.push(`Extraction confidence: ${payload.extractionConfidence}`);

  if (payload.context.age || payload.context.reasonForTesting) {
    parts.push("\n## Patient Context");
    if (payload.context.age) parts.push(`Patient age: ${payload.context.age}`);
    if (payload.context.reasonForTesting)
      parts.push(`Reason for testing: ${payload.context.reasonForTesting}`);
    if (payload.context.counselorScheduled)
      parts.push("Note: Patient has a genetic counselor appointment scheduled.");
    else
      parts.push(
        "Note: Patient does NOT currently have a genetic counselor appointment. Emphasize the recommendation to schedule one."
      );
  }

  if (payload.highRiskGenes.length > 0) {
    parts.push(
      `\n## HIGH-RISK GENE ALERT — ELEVATED SAFETY MODE ENGAGED: ${payload.highRiskGenes.join(", ")}`
    );
    parts.push(
      [
        "These genes are associated with hereditary cancer syndromes. The following rules OVERRIDE earlier instructions:",
        "1. Every variant card for these genes MUST end keyTakeaway with a direct counselor-referral sentence.",
        "2. Do NOT speculate about personal risk percentages, timelines, or outcomes in classificationExplanation or inheritanceRisk.",
        "3. Keep inheritanceRisk factual and short (1 sentence). Do not discuss cascade testing logistics — that is the counselor's job.",
        "4. In summary.whatItMeans, lead with 'This result should be reviewed with a genetic counselor before acting on it' (or equivalent).",
        "5. Tone: calm, direct, non-alarming. This may be emotionally difficult news.",
      ].join("\n")
    );
  }

  if (
    payload.extractionConfidence === "failed" ||
    payload.extractionConfidence === "partial"
  ) {
    parts.push("\n## Raw Report Text (for additional context)");
    parts.push(
      "The automated extraction had limited success. Use the raw text below to identify any variants or findings that were missed:"
    );
    parts.push(payload.rawText.slice(0, 8000));
  }

  parts.push(
    "\nPlease generate the plain-language summary, variant cards, and counselor questions in the JSON format specified. Remember: explain, never diagnose."
  );

  return parts.join("\n");
}
