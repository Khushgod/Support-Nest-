import Link from "next/link";
import { Lock, FileX, Database, Cpu, Mail, Cookie } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy & data lifecycle | GeneTranslate",
  description:
    "What GeneTranslate does and does not store. PDFs are in-memory only, results live in browser sessionStorage, and the LLM runs locally.",
};

const GUARANTEES = [
  {
    icon: FileX,
    title: "PDFs are in-memory only",
    desc: "Uploaded PDFs are read into memory by the API route, parsed once, and discarded when the request returns. They are never written to disk and never persisted in any database.",
  },
  {
    icon: Database,
    title: "Results live only in your browser",
    desc: "Analysis results are written to your browser's sessionStorage. They are gone when you close the tab. There is no server-side copy.",
  },
  {
    icon: Cpu,
    title: "The LLM runs on your machine",
    desc: "GeneTranslate uses Ollama to run the language model locally. Prompts, your patient context, and the model's output never leave the host. There is no cloud LLM call.",
  },
  {
    icon: Mail,
    title: "Email addresses are not retained",
    desc: "If you choose to email yourself a copy of your results, the address is passed through to Resend for delivery and is not retained by GeneTranslate, server-side or client-side, after the send completes.",
  },
  {
    icon: Cookie,
    title: "No accounts, no cookies, no analytics",
    desc: "We don't ask you to register. We don't set cookies. We don't run analytics, tracking pixels, or session replay. There is nothing to opt out of because there is nothing collected.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="pt-12 pb-6 sm:pt-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3">
              Privacy
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Ephemeral by design
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Genetic information is deeply personal. GeneTranslate is built so
              there is nothing for us to leak, sell, or hand over &mdash; we
              don&rsquo;t keep your data. Here&rsquo;s exactly what happens
              when you use the product.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
            {GUARANTEES.map((g) => (
              <div
                key={g.title}
                className="bg-white rounded-2xl border border-sage-200 p-6 flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <g.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                    {g.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10 bg-sage-50/50 border-y border-sage-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-sky-600" />
              The one outbound network call
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When the analyzer enriches your report, it queries the public
              NCBI ClinVar archive over HTTPS using gene names and variant
              identifiers (for example,{" "}
              <code className="px-1 py-0.5 bg-white rounded text-xs">BRCA1 c.5266dupC</code>
              ). Patient names, addresses, dates of birth, your uploaded PDF
              text, and your patient context are never included. ClinVar is
              the same public database your lab and counselor consult.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              In short
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you close this tab, your data is gone. If our servers vanish
              tomorrow, no copy of your report exists anywhere we control.
              That is the design.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors"
              >
                Analyze a report
              </Link>
              <Link
                href="/about"
                className="text-sm text-sky-700 hover:text-sky-800 font-medium"
              >
                See the full pipeline &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
