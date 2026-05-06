export interface PatientContext {
  age?: string;
  reasonForTesting?: string;
  counselorScheduled?: boolean;
}

export interface ExtractedVariant {
  gene: string;
  hgvsNotation?: string;
  acmgClassification: string;
  condition?: string;
  inheritance?: string;
  zygosity?: string;
  labInterpretation?: string;
}

export interface ExtractionResult {
  labSource: string | null;
  rawText: string;
  variants: ExtractedVariant[];
  extractionConfidence: 'high' | 'partial' | 'failed';
  warnings: string[];
}

export interface VariantCardData {
  gene: string;
  geneFunction: string;
  variantNotation: string;
  classification: string;
  classificationExplanation: string;
  condition: string;
  inheritance: string;
  inheritanceRisk: string;
  zygosity: string;
  confidence: 'High' | 'Moderate' | 'Low' | 'Uncertain';
  confidenceReason: string;
  keyTakeaway: string;
}

export interface CounselorQuestion {
  question: string;
  reasoning: string;
  priority: number;
}

export interface AnalysisSummary {
  whatWasFound: string;
  whatItMeans: string;
  whatIsUncertain: string;
}

export interface SafetyFlags {
  hasHighRiskGenes: boolean;
  highRiskGenes: string[];
  overallConfidence: string;
}

export interface AnalysisResult {
  summary: AnalysisSummary;
  variantCards: VariantCardData[];
  questions: CounselorQuestion[];
  safetyFlags: SafetyFlags;
  disclaimer: string;
}

export type AnalysisStatus =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'analyzing'
  | 'complete'
  | 'error';
