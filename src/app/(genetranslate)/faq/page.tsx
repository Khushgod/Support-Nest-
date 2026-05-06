import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

export const metadata = {
  title: "FAQ | GeneTranslate",
  description:
    "Frequently asked questions about GeneTranslate's data handling, accuracy, supported labs, and intended use.",
};

type QA = { q: string; a: React.ReactNode };

const FAQS: QA[] = [
  {
    q: "Is my data sent to the cloud?",
    a: (
      <>
        No. The LLM that writes your summary runs locally on your machine
        through Ollama &mdash; prompts never leave the host. PDFs are processed
        in memory and discarded as soon as the request returns. Results live
        only in your browser&rsquo;s session storage. ClinVar lookups are the
        one outbound network call (to NCBI), and they only contain gene names
        and variant identifiers, never anything from your file.{" "}
        <Link href="/tools/genetranslate/privacy" className="text-sky-700 font-medium hover:underline">
          Read the data lifecycle &rarr;
        </Link>
      </>
    ),
  },
  {
    q: "Which lab reports are supported?",
    a: (
      <>
        Lab-specific parsers currently cover Invitae cancer panels (positive
        and negative), Invitae carrier-screening report headers, and GeneDx
        whole-exome (XomeDx) reports. Other layouts are detected as
        &ldquo;unknown&rdquo; &mdash; in that case the parser returns a low-
        confidence signal and routes you to{" "}
        <Link
          href="/manual-input"
          className="text-sky-700 font-medium hover:underline"
        >
          manual entry
        </Link>{" "}
        rather than guess.
      </>
    ),
  },
  {
    q: "How accurate is the variant extraction?",
    a: (
      <>
        Extraction is regex- and layout-based, not ML, so it is deterministic.
        We run an accuracy harness against a small public corpus on every
        change and gate at &ge;95% field accuracy. If a variant looks wrong
        on the results page, do not act on it &mdash; bring the original PDF
        to your counselor.
      </>
    ),
  },
  {
    q: "Should I make medical decisions based on the summary?",
    a: (
      <>
        No. GeneTranslate is an educational aid. It deliberately avoids
        diagnostic language, treatment recommendations, and quantitative risk
        for high-risk genes. Every clinical decision should go through a
        board-certified genetic counselor or physician.
      </>
    ),
  },
  {
    q: "What if my report isn&rsquo;t recognized?",
    a: (
      <>
        If automatic parsing fails or returns low confidence, GeneTranslate
        prompts you to use{" "}
        <Link
          href="/manual-input"
          className="text-sky-700 font-medium hover:underline"
        >
          manual entry
        </Link>
        : type the gene, HGVS notation, classification, condition, and
        zygosity for each variant. The downstream LLM analysis works the same
        way.
      </>
    ),
  },
  {
    q: "Why are some risk numbers hidden?",
    a: (
      <>
        Findings in high-risk genes such as BRCA1, BRCA2, the Lynch genes
        (MLH1, MSH2, MSH6, PMS2, EPCAM), TP53, PALB2, ATM, CHEK2, STK11, CDH1,
        and MUTYH trigger an elevated safety mode. Quantitative lifetime risk
        estimates are removed and a banner routes you back to a counselor.
        These are conversations a clinician should have with you, not a tool.{" "}
        <Link href="/tools/genetranslate/about" className="text-sky-700 font-medium hover:underline">
          More on the safety layer &rarr;
        </Link>
      </>
    ),
  },
  {
    q: "Can I export or share my results?",
    a: (
      <>
        Yes. From the results page you can export a PDF (jsPDF) or email a
        copy through Resend. Email addresses are passed through to the email
        provider for delivery and are not retained server-side or
        client-side after the send completes.
      </>
    ),
  },
  {
    q: "Do you store anything about me?",
    a: (
      <>
        No accounts, no analytics, no cookies, no databases. The product is
        intentionally stateless. If you close the browser tab, your results
        are gone &mdash; export the PDF or email it to yourself if you want a
        copy.
      </>
    ),
  },
  {
    q: "Which LLM does it use?",
    a: (
      <>
        The default is <code className="px-1 py-0.5 bg-slate-100 rounded text-xs">qwen2.5:7b-instruct</code>{" "}
        running through Ollama. Any JSON-capable Ollama model can be swapped
        in via configuration. We use JSON mode to keep responses structured
        and parseable.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <main className="flex-1">
        <section className="pt-12 pb-6 sm:pt-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3">
              FAQ
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Frequently asked questions
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Answers to the questions we hear most. If something isn&rsquo;t
              covered, the{" "}
              <Link
                href="/tools/genetranslate/resources"
                className="text-sky-700 font-medium hover:underline"
              >
                resources page
              </Link>{" "}
              has a contact link.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="space-y-3">
              {FAQS.map((qa, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl border border-sage-200 overflow-hidden open:border-sky-200 open:shadow-sm"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-base font-semibold text-slate-900">
                      {qa.q}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                    {qa.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors"
              >
                Analyze a report
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tools/genetranslate/resources"
                className="text-sm text-sky-700 hover:text-sky-800 font-medium"
              >
                Browse resources &rarr;
              </Link>
            </div>
          </div>
        </section>
    </main>
  );
}
