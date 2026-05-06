"use client";

import { useRouter } from "next/navigation";
import { Download, Eye, FileText, Sparkles } from "lucide-react";
import { SAMPLE_REPORTS, DEFAULT_SAMPLE_OUTPUT } from "@/lib/sample-data";
import { clsx } from "clsx";

export default function SampleReports() {
  const router = useRouter();

  const handleViewSampleOutput = () => {
    sessionStorage.setItem(
      "genetranslate_result",
      JSON.stringify(DEFAULT_SAMPLE_OUTPUT)
    );
    router.push("/results");
  };

  return (
    <section className="pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-800">
            Don&apos;t have a report handy?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try GeneTranslate with a real sample lab report, or jump straight to
            a pre-generated example of the output.
          </p>
        </div>

        {/* View sample output CTA */}
        <button
          type="button"
          onClick={handleViewSampleOutput}
          className="group w-full text-left bg-gradient-to-br from-sky-50 to-sage-50 border border-sky-200 rounded-2xl p-5 sm:p-6 mb-6 hover:border-sky-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                View a sample output
                <Eye className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Skip the upload and see an example of the plain-language
                summary, variant explanations, and counselor questions —
                generated from a real Invitae BRIP1 sample report.
              </p>
            </div>
          </div>
        </button>

        {/* Downloadable sample reports */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Or download a sample report and upload it above
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_REPORTS.map((sample) => (
              <a
                key={sample.id}
                href={sample.file}
                download
                className="group flex items-start gap-3 bg-white border border-sage-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-sage-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-700">
                      {sample.lab}
                    </span>
                    <span
                      className={clsx(
                        "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
                        sample.finding === "positive"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-green-50 text-green-700"
                      )}
                    >
                      {sample.finding}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mt-1 leading-snug">
                    {sample.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {sample.description}
                  </p>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-sky-600 flex-shrink-0 mt-1" />
              </a>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Sample reports are publicly available examples published by each
            lab, included here for demonstration only.
          </p>
        </div>
      </div>
    </section>
  );
}
