"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgressSteps from "@/components/ui/ProgressSteps";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import ContextForm from "@/components/upload/ContextForm";
import { useAnalysis } from "@/hooks/useAnalysis";
import type { PatientContext, ExtractedVariant } from "@/lib/types";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const EMPTY_VARIANT: ExtractedVariant = {
  gene: "",
  acmgClassification: "",
  hgvsNotation: "",
  condition: "",
  inheritance: "",
  zygosity: "",
};

const ACMG_OPTIONS = [
  "Pathogenic",
  "Likely Pathogenic",
  "Variant of Uncertain Significance (VUS)",
  "Likely Benign",
  "Benign",
];

const INHERITANCE_OPTIONS = [
  "Autosomal Dominant",
  "Autosomal Recessive",
  "X-linked Dominant",
  "X-linked Recessive",
  "Mitochondrial",
  "Unknown",
];

const ZYGOSITY_OPTIONS = [
  "Heterozygous",
  "Homozygous",
  "Hemizygous",
  "Unknown",
];

export default function ManualInputPage() {
  const router = useRouter();
  const [variants, setVariants] = useState<ExtractedVariant[]>([
    { ...EMPTY_VARIANT },
  ]);
  const [context, setContext] = useState<PatientContext>({});
  const { status, error, analyzeManual } = useAnalysis();

  const isProcessing = status === "analyzing";

  const updateVariant = (index: number, updates: Partial<ExtractedVariant>) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...updates } : v))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...EMPTY_VARIANT }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    const valid = variants.filter(
      (v) => v.gene.trim() && v.acmgClassification
    );
    if (valid.length === 0) return;

    const result = await analyzeManual(valid, context);
    if (result) {
      router.push("/results");
    }
  };

  const hasValidVariant = variants.some(
    (v) => v.gene.trim() && v.acmgClassification
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="pt-8 pb-4">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to PDF upload
            </Link>

            <ProgressSteps currentStep={isProcessing ? 1 : 0} />

            <div className="text-center mt-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Manual Variant Entry
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
                If your report couldn&apos;t be parsed automatically, enter the
                variant information from your genetic test results below.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
            {variants.map((variant, index) => (
              <Card key={index} className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Variant {index + 1}
                  </h3>
                  {variants.length > 1 && (
                    <button
                      onClick={() => removeVariant(index)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      aria-label="Remove variant"
                      disabled={isProcessing}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Gene Symbol <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., BRCA1"
                      value={variant.gene}
                      onChange={(e) =>
                        updateVariant(index, {
                          gene: e.target.value.toUpperCase(),
                        })
                      }
                      disabled={isProcessing}
                      className="w-full px-3 py-2 text-sm bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      ACMG Classification{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={variant.acmgClassification}
                      onChange={(e) =>
                        updateVariant(index, {
                          acmgClassification: e.target.value,
                        })
                      }
                      disabled={isProcessing}
                      className="w-full px-3 py-2 text-sm bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
                    >
                      <option value="">Select classification</option>
                      {ACMG_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Variant Notation (HGVS)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., NM_000059.4:c.5266dupC"
                      value={variant.hgvsNotation || ""}
                      onChange={(e) =>
                        updateVariant(index, {
                          hgvsNotation: e.target.value,
                        })
                      }
                      disabled={isProcessing}
                      className="w-full px-3 py-2 text-sm bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 disabled:opacity-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Condition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Hereditary Breast Cancer"
                      value={variant.condition || ""}
                      onChange={(e) =>
                        updateVariant(index, { condition: e.target.value })
                      }
                      disabled={isProcessing}
                      className="w-full px-3 py-2 text-sm bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Inheritance Pattern
                    </label>
                    <select
                      value={variant.inheritance || ""}
                      onChange={(e) =>
                        updateVariant(index, { inheritance: e.target.value })
                      }
                      disabled={isProcessing}
                      className="w-full px-3 py-2 text-sm bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
                    >
                      <option value="">Select inheritance</option>
                      {INHERITANCE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Zygosity
                    </label>
                    <select
                      value={variant.zygosity || ""}
                      onChange={(e) =>
                        updateVariant(index, { zygosity: e.target.value })
                      }
                      disabled={isProcessing}
                      className="w-full px-3 py-2 text-sm bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
                    >
                      <option value="">Select zygosity</option>
                      {ZYGOSITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            ))}

            <button
              onClick={addVariant}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-sage-300 rounded-2xl text-sm font-medium text-slate-600 hover:border-sky-400 hover:text-sky-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Another Variant
            </button>

            <Card>
              <ContextForm
                context={context}
                onChange={setContext}
                disabled={isProcessing}
              />
            </Card>

            {error && (
              <Alert variant="error" title="Analysis Error">
                {error}
              </Alert>
            )}

            {isProcessing && (
              <div className="flex items-center justify-center gap-3 py-4">
                <Spinner size="sm" />
                <p className="text-sm text-slate-600">
                  Generating your plain-language summary...
                </p>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!hasValidVariant || isProcessing}
                loading={isProcessing}
              >
                Analyze Variants
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
