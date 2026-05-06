"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ui/ProgressSteps";
import SummarySection from "@/components/results/SummarySection";
import VariantCard from "@/components/results/VariantCard";
import QuestionsSection from "@/components/results/QuestionsSection";
import HighRiskBanner from "@/components/results/HighRiskBanner";
import DisclaimerFooter from "@/components/results/DisclaimerFooter";
import ExportBar from "@/components/results/ExportBar";
import type { AnalysisResult } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  const router = useRouter();
  const [result] = useState<AnalysisResult | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem("genetranslate_result");
      return stored ? (JSON.parse(stored) as AnalysisResult) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!result) router.push("/analyze");
  }, [result, router]);

  if (!result) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="animate-pulse-gentle text-slate-500">
          Loading results...
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 pb-20">
        {/* Top bar */}
        <section className="pt-8 pb-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Analyze another report
            </Link>
            <ProgressSteps currentStep={2} />
          </div>
        </section>

        <section className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            {/* High-risk banner */}
            {result.safetyFlags.hasHighRiskGenes && (
              <HighRiskBanner genes={result.safetyFlags.highRiskGenes} />
            )}

            {/* Summary */}
            <SummarySection summary={result.summary} />

            {/* Variant Cards */}
            {result.variantCards.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  Variant Details
                  <span className="text-sm font-normal text-slate-500">
                    ({result.variantCards.length} variant
                    {result.variantCards.length !== 1 ? "s" : ""})
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {result.variantCards.map((variant, i) => (
                    <VariantCard
                      key={i}
                      variant={variant}
                      index={i}
                      isHighRisk={result.safetyFlags.highRiskGenes.includes(
                        variant.gene
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            {result.questions.length > 0 && (
              <QuestionsSection questions={result.questions} />
            )}

            {/* Disclaimer */}
            <DisclaimerFooter />
          </div>
        </section>
      </main>

      <ExportBar result={result} />
    </>
  );
}
