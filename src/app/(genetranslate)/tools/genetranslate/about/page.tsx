import Link from "next/link";
import {
  FileText,
  Search,
  Database,
  Cpu,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About GeneTranslate",
  description:
    "How GeneTranslate turns clinical genetic-test PDFs into plain-language summaries using a local LLM and ClinVar evidence.",
};

const PIPELINE = [
  {
    icon: FileText,
    title: "1. Extract the PDF",
    desc: "We parse the uploaded PDF in memory using pdfjs-dist. The file never touches disk and is discarded as soon as the request returns.",
  },
  {
    icon: Search,
    title: "2. Detect the lab and parse variants",
    desc: "Lab-specific parsers identify Invitae and GeneDx report layouts and pull out gene, HGVS notation, ACMG classification, condition, inheritance, and zygosity. Unknown layouts fall back to manual entry.",
  },
  {
    icon: Database,
    title: "3. Enrich with ClinVar",
    desc: "Each variant is looked up against NCBI ClinVar via E-utilities (esearch + esummary) so the LLM has current public evidence to ground its explanation.",
  },
  {
    icon: Cpu,
    title: "4. Local LLM analysis",
    desc: "A model running on your machine through Ollama (default qwen2.5:7b-instruct) writes a plain-language summary, per-variant explanations, and counselor questions. No cloud LLM calls.",
  },
  {
    icon: ShieldCheck,
    title: "5. Safety scan",
    desc: "Before anything reaches the page, the output is scanned for prohibited content: diagnostic claims, treatment recommendations, prognostic statements. Findings in high-risk genes (BRCA1/2, Lynch genes, TP53, etc.) trigger an elevated mode that hides quantitative risk and routes you back to a counselor.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
        <section className="pt-12 pb-6 sm:pt-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3">
              About
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              How GeneTranslate works
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              GeneTranslate is an educational tool that converts clinical
              genetic-test PDFs into plain-language summaries you can bring to
              your genetic counselor. It is local-first, ephemeral by design,
              and intentionally narrow in scope: explanation, never
              diagnosis.
            </p>
          </div>
        </section>

        {/* Pipeline */}
        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              The pipeline
            </h2>
            <div className="space-y-4">
              {PIPELINE.map((step) => (
                <div
                  key={step.title}
                  className="bg-white rounded-2xl border border-sage-200 p-6 flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech */}
        <section className="py-10 bg-sage-50/50 border-y border-sage-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Under the hood
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {[
                ["Frontend", "Next.js 16 (App Router) + React 19 + Tailwind v4"],
                ["PDF parsing", "pdfjs-dist running in the Node runtime"],
                ["LLM", "Ollama (default qwen2.5:7b-instruct), JSON mode"],
                ["Evidence", "NCBI ClinVar via E-utilities (esearch + esummary)"],
                ["Storage", "None server-side. sessionStorage on the client."],
                ["Email", "Resend, optional. Addresses are not retained."],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-semibold text-slate-800">{k}</dt>
                  <dd className="text-slate-600 mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* What we don't do */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              What GeneTranslate does not do
            </h2>
            <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <li className="flex gap-3">
                <span className="text-rose-500 font-bold">&times;</span>
                Provide a diagnosis, prognosis, or medical advice of any
                kind.
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 font-bold">&times;</span>
                Recommend screening intervals, prophylactic surgery, or any
                treatment.
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 font-bold">&times;</span>
                Quote quantitative risk percentages for high-risk genes.
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 font-bold">&times;</span>
                Replace a board-certified genetic counselor or physician.
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 font-bold">&times;</span>
                Send your data anywhere &mdash; the LLM runs locally on your
                machine.
              </li>
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors"
              >
                Analyze a report
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="text-sm text-sky-700 hover:text-sky-800 font-medium"
              >
                Browse FAQ &rarr;
              </Link>
            </div>
          </div>
        </section>
    </main>
  );
}
