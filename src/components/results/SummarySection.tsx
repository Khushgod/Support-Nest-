"use client";

import Card from "@/components/ui/Card";
import CopyButton from "@/components/ui/CopyButton";
import type { AnalysisSummary } from "@/lib/types";
import { FileText } from "lucide-react";

interface SummarySectionProps {
  summary: AnalysisSummary;
}

export default function SummarySection({ summary }: SummarySectionProps) {
  const fullText = `What was found:\n${summary.whatWasFound}\n\nWhat this means:\n${summary.whatItMeans}\n\nWhat is uncertain:\n${summary.whatIsUncertain}`;

  return (
    <Card className="animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Plain-Language Summary
          </h2>
        </div>
        <CopyButton text={fullText} />
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-sky-700 uppercase tracking-wider mb-2">
            What was found
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {summary.whatWasFound}
          </p>
        </div>

        <div className="border-t border-sage-100 pt-5">
          <h3 className="text-sm font-semibold text-sky-700 uppercase tracking-wider mb-2">
            What this means
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {summary.whatItMeans}
          </p>
        </div>

        <div className="border-t border-sage-100 pt-5">
          <h3 className="text-sm font-semibold text-warm-600 uppercase tracking-wider mb-2">
            What is uncertain
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {summary.whatIsUncertain}
          </p>
        </div>
      </div>
    </Card>
  );
}
