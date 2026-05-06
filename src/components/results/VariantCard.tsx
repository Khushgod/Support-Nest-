"use client";

import Card from "@/components/ui/Card";
import CopyButton from "@/components/ui/CopyButton";
import ConfidenceBadge from "./ConfidenceBadge";
import type { VariantCardData } from "@/lib/types";
import { Dna, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

interface VariantCardProps {
  variant: VariantCardData;
  index: number;
  isHighRisk?: boolean;
}

const SUPPRESS_SPECULATION_GENES = new Set([
  "BRCA1",
  "BRCA2",
  "MLH1",
  "MSH2",
  "MSH6",
  "PMS2",
  "EPCAM",
  "TP53",
  "PALB2",
  "STK11",
  "CDH1",
]);

const CLASSIFICATION_COLORS: Record<string, string> = {
  Pathogenic: "border-l-rose-400",
  "Likely Pathogenic": "border-l-rose-300",
  "Variant of Uncertain Significance (VUS)": "border-l-warm-400",
  VUS: "border-l-warm-400",
  "Likely Benign": "border-l-green-300",
  Benign: "border-l-green-400",
};

function getClassColor(classification: string): string {
  for (const [key, color] of Object.entries(CLASSIFICATION_COLORS)) {
    if (classification.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return "border-l-slate-300";
}

export default function VariantCard({
  variant,
  index,
  isHighRisk,
}: VariantCardProps) {
  const suppressSpeculation =
    isHighRisk || SUPPRESS_SPECULATION_GENES.has(variant.gene);
  const copyText = `Gene: ${variant.gene}\nVariant: ${variant.variantNotation}\nClassification: ${variant.classification}\nCondition: ${variant.condition}\nInheritance: ${variant.inheritance}\nKey takeaway: ${variant.keyTakeaway}`;

  return (
    <Card
      className={clsx(
        "border-l-4 animate-slide-up",
        getClassColor(variant.classification)
      )}
      style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
            <Dna className="w-4 h-4 text-sage-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {variant.gene}
            </h3>
            {variant.variantNotation &&
              variant.variantNotation !== "Not specified in extraction" && (
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {variant.variantNotation}
                </p>
              )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge confidence={variant.confidence} />
          <CopyButton text={copyText} label="" />
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        {variant.geneFunction}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <InfoRow label="Classification" value={variant.classification} />
        <InfoRow label="Condition" value={variant.condition} />
        <InfoRow label="Inheritance" value={variant.inheritance} />
        <InfoRow label="Zygosity" value={variant.zygosity} />
      </div>

      <div className="bg-sage-50 rounded-xl p-3.5 mb-3">
        <p className="text-sm text-slate-700 leading-relaxed">
          {variant.classificationExplanation}
        </p>
      </div>

      {variant.inheritanceRisk && !suppressSpeculation && (
        <div className="bg-sky-50 rounded-xl p-3.5 mb-3">
          <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
            Family implications
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {variant.inheritanceRisk}
          </p>
        </div>
      )}

      {suppressSpeculation && (
        <div className="bg-rose-50 rounded-xl p-3.5 mb-3 border border-rose-100">
          <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
            Family implications
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Because this finding is in a gene associated with hereditary cancer
            risk, we won&apos;t speculate about what it means for relatives
            here. A genetic counselor can walk your family through cascade
            testing and next steps.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 pt-2 border-t border-sage-100">
        <ArrowRight className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm font-medium text-slate-800">
          {variant.keyTakeaway}
        </p>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value || value === "Not specified") return null;
  return (
    <div>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <p className="text-sm text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}
