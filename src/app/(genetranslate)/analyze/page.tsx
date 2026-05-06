"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Shield,
  Clock,
  BookOpen,
  MessageSquare,
  PenLine,
} from "lucide-react";
import DropZone from "@/components/upload/DropZone";
import FilePreview from "@/components/upload/FilePreview";
import ContextForm from "@/components/upload/ContextForm";
import SampleReports from "@/components/upload/SampleReports";
import ProgressSteps from "@/components/ui/ProgressSteps";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import { useAnalysis } from "@/hooks/useAnalysis";
import type { PatientContext } from "@/lib/types";
import Link from "next/link";

const STATUS_MESSAGES: Record<string, string> = {
  extracting: "Reading your report and extracting variant data...",
  analyzing: "Generating your plain-language summary...",
};

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [context, setContext] = useState<PatientContext>({});
  const { status, error, analyzeFile, reset } = useAnalysis();

  const isProcessing = status === "extracting" || status === "analyzing";

  const handleAnalyze = async () => {
    if (!file) return;
    const result = await analyzeFile(file, context);
    if (result) {
      router.push("/results");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    reset();
  };

  const currentStep =
    status === "idle" || status === "error"
      ? 0
      : status === "extracting" || status === "analyzing"
        ? 1
        : 2;

  return (
    <main className="flex-1">
        {/* Hero */}
        <section className="pt-12 pb-6 sm:pt-16 sm:pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Analyze Your{" "}
              <span className="text-sky-600">Genetic Report</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload your genetic lab report and get a clear, plain-language
              summary, variant-by-variant explanations, and tailored questions
              to bring to your genetic counselor.
            </p>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="pb-8">
          <ProgressSteps currentStep={currentStep} />
        </section>

        {/* Upload Section */}
        <section className="pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl border border-sage-200 shadow-sm p-6 sm:p-8 space-y-6">
              {!file ? (
                <DropZone onFileSelect={setFile} disabled={isProcessing} />
              ) : (
                <FilePreview
                  file={file}
                  onRemove={handleRemoveFile}
                  disabled={isProcessing}
                />
              )}

              <ContextForm
                context={context}
                onChange={setContext}
                disabled={isProcessing}
              />

              {error && (
                <Alert variant="error" title="Something went wrong">
                  {error}
                  <Link
                    href="/manual-input"
                    className="block mt-2 text-sky-700 font-medium hover:underline"
                  >
                    Try manual entry instead &rarr;
                  </Link>
                </Alert>
              )}

              {isProcessing && (
                <div className="flex items-center gap-3 py-2 animate-fade-in">
                  <Spinner size="sm" />
                  <p className="text-sm text-slate-600">
                    {STATUS_MESSAGES[status]}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!file || isProcessing}
                  loading={isProcessing}
                  className="w-full sm:w-auto"
                >
                  Analyze Report
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Link
                  href="/manual-input"
                  className="text-sm text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1.5"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Enter variants manually
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sample reports + sample output */}
        <SampleReports />

        {/* How It Works */}
        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-800 text-center mb-8">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: "Plain-Language Summary",
                  desc: "Your report translated into clear, everyday language anyone can understand.",
                },
                {
                  icon: MessageSquare,
                  title: "Questions for Your Counselor",
                  desc: "Personalized questions to make the most of your genetic counseling appointment.",
                },
                {
                  icon: Shield,
                  title: "Safety First",
                  desc: "No diagnostic claims. Every output includes guidance to review with your clinician.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-sage-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-sky-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Results typically ready in 30-60 seconds</span>
            </div>
          </div>
        </section>
    </main>
  );
}
