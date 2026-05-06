import Link from "next/link";
import {
  ArrowRight,
  PenLine,
  Shield,
  Lock,
  Cpu,
  FileText,
  MessageSquare,
  BookOpen,
  Mail,
  ListChecks,
  Sparkles,
  Database,
  AlertTriangle,
} from "lucide-react";
export default function LandingPage() {
  return (
    <main className="flex-1">
        {/* Hero */}
        <section className="pt-16 pb-10 sm:pt-24 sm:pb-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs font-medium text-sky-700 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Local-first &middot; ephemeral by design
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
              Make sense of your{" "}
              <span className="text-sky-600">genetic report</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              GeneTranslate turns clinical genetic-test PDFs into a clear,
              plain-language summary, variant-by-variant explanations, and
              tailored questions for your genetic counselor &mdash; without
              sending your data to the cloud.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Analyze a report
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/manual-input"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-sage-50 border border-sage-200 text-slate-700 text-sm font-semibold transition-colors"
              >
                <PenLine className="w-4 h-4" />
                Enter variants manually
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              For educational purposes only. Not a substitute for a genetic
              counselor or physician.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 bg-sage-50/50 border-y border-sage-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center tracking-tight">
              From PDF to plain language in three steps
            </h2>
            <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">
              Drop a report, let GeneTranslate extract and explain the
              variants, then bring the result to your counseling appointment.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  icon: FileText,
                  title: "Upload your PDF",
                  desc: "Invitae, GeneDx, and other lab reports are recognized automatically. Or skip the PDF and enter variants by hand.",
                },
                {
                  step: "2",
                  icon: Cpu,
                  title: "Local LLM does the work",
                  desc: "A model running on your machine via Ollama parses, enriches with ClinVar evidence, and writes a plain-language summary.",
                },
                {
                  step: "3",
                  icon: MessageSquare,
                  title: "Review with your counselor",
                  desc: "Export results as PDF or email. Bring them to your board-certified genetic counselor for the medical conversation.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="bg-white rounded-2xl border border-sage-200 p-6 relative"
                >
                  <div className="absolute -top-3 left-6 w-7 h-7 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mb-4">
                    <s.icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center tracking-tight">
              What you get
            </h2>
            <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">
              Everything you need to walk into your appointment prepared.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: BookOpen,
                  title: "Plain-language summary",
                  desc: "Each finding explained without jargon, with what it does and does not mean.",
                },
                {
                  icon: ListChecks,
                  title: "Variant-by-variant cards",
                  desc: "Gene, HGVS notation, ACMG class, condition, inheritance, and zygosity at a glance.",
                },
                {
                  icon: MessageSquare,
                  title: "Counselor questions",
                  desc: "Personalized questions tuned to your specific findings to bring to your appointment.",
                },
                {
                  icon: Database,
                  title: "ClinVar evidence",
                  desc: "Live lookups against NCBI ClinVar so the explanation is grounded in current evidence.",
                },
                {
                  icon: FileText,
                  title: "PDF export",
                  desc: "Download a clean printable copy of your results to share with your clinician.",
                },
                {
                  icon: Mail,
                  title: "Optional email delivery",
                  desc: "Send a copy to yourself. Email addresses are not stored after delivery.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl border border-sage-200 p-6 hover:border-sky-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety + privacy split */}
        <section className="py-16 bg-sage-50/50 border-y border-sage-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-sage-200 p-7">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Built for safety
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                A post-LLM safety layer scans every output for prohibited
                content and blocks responses that read as diagnostic or
                treatment advice. High-risk genes such as BRCA1/2 and Lynch
                syndrome genes trigger an elevated banner that hides
                quantitative risk estimates and routes you back to a
                counselor.
              </p>
              <Link
                href="/tools/genetranslate/about"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:text-sky-800"
              >
                How the safety layer works
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-sage-200 p-7">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Your data stays on your machine
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                The LLM runs locally via Ollama &mdash; no prompts leave the
                host. PDFs are processed in memory and discarded. Results live
                only in your browser&rsquo;s session storage. No accounts, no
                analytics, no cookies.
              </p>
              <Link
                href="/tools/genetranslate/privacy"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:text-sky-800"
              >
                Read the data lifecycle
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* What this is not */}
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-900 mb-2">
                    What GeneTranslate is not
                  </h3>
                  <ul className="text-sm text-amber-900/80 leading-relaxed space-y-1.5 list-disc list-inside">
                    <li>It is not a diagnosis or a treatment plan.</li>
                    <li>
                      It does not replace a board-certified genetic counselor
                      or physician.
                    </li>
                    <li>
                      It does not predict outcomes, prescribe screening, or
                      recommend prophylactic interventions.
                    </li>
                    <li>
                      It is an educational aid to help you prepare for your
                      counseling appointment.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-sky-700 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to translate your report?
              </h2>
              <p className="mt-3 text-sky-50 max-w-xl mx-auto">
                It takes about a minute. Your PDF never leaves your machine.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-sky-50 text-sky-700 text-sm font-semibold transition-colors"
                >
                  Analyze a report
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools/genetranslate/resources"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500/30 hover:bg-sky-500/40 border border-sky-300/30 text-white text-sm font-semibold transition-colors"
                >
                  Browse resources
                </Link>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
