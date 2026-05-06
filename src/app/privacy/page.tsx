import Link from "next/link";
import { Lock, Database, KeyRound, Cookie, Trash2, Eye } from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";

export const metadata = {
  title: "Privacy & Security | SupportNest",
  description:
    "How SupportNest protects you: HTTPS / HSTS in transit, AES-256-GCM at rest, no ads, no tracking, no sale of data.",
};

const COMMITMENTS = [
  {
    icon: Lock,
    title: "Encrypted in transit",
    body: (
      <>
        Every page is served over HTTPS with HSTS{" "}
        <code className="px-1 py-0.5 bg-cream-100 rounded text-[11px]">
          max-age=63072000; includeSubDomains; preload
        </code>
        , a strict Content-Security-Policy, and modern transport ciphers.
        Session cookies are HttpOnly, Secure, and SameSite=Lax.
      </>
    ),
  },
  {
    icon: KeyRound,
    title: "Encrypted at rest",
    body: (
      <>
        Anything you opt to save (uploaded files, generated reports) is sealed
        with AES-256-GCM. Each record gets a unique 96-bit IV and a key derived
        from a server master key via HKDF&#8209;SHA256, scoped to your user ID
        and record ID. Tampering breaks decryption.
      </>
    ),
  },
  {
    icon: Database,
    title: "Minimal data, scoped access",
    body: (
      <>
        We collect only what we need to run your account: your name, email,
        role, and a salted-bcrypt password hash. There is no behavioral
        analytics database. There is no advertising audience.
      </>
    ),
  },
  {
    icon: Cookie,
    title: "No ad tracking, no third-party pixels",
    body: (
      <>
        SupportNest does not run ads, marketing pixels, session replay, or
        cross-site trackers. The only cookie we set is your session cookie.
        Your browsing inside the nest is private to you.
      </>
    ),
  },
  {
    icon: Trash2,
    title: "Delete anything, any time",
    body: (
      <>
        You can delete a saved file with one click and your account in two.
        Deletes are propagated through our store within 24 hours and removed
        from encrypted backups within 30 days.
      </>
    ),
  },
  {
    icon: Eye,
    title: "We never sell or rent your data",
    body: (
      <>
        Period. We don&rsquo;t share data with advertisers, brokers, or AI
        training pipelines. The only third parties involved are infrastructure
        providers (e.g. hosting, email-on-request) under strict
        data-processing agreements.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <Shell>
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <PageHeader
            eyebrow="Privacy & Security"
            title="Your data is treated like family."
            subtitle="Concrete, technical commitments — not marketing copy. If anything below stops being true, we'll tell you in a banner before we change it."
          />
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {COMMITMENTS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-3xl bg-white border border-cream-200 p-6"
            >
              <span className="inline-flex w-10 h-10 rounded-xl bg-lavender-50 items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-lavender-600" />
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-white border-y border-cream-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-slate-900">
            About GeneTranslate specifically
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            GeneTranslate is local-first. Genetic-test PDFs are processed in
            memory and discarded as soon as the request returns; the language
            model runs on your machine via Ollama; nothing about your case is
            sent to a cloud LLM. Read the{" "}
            <Link
              href="/tools/genetranslate/privacy"
              className="font-medium text-coral-600 hover:text-coral-700 underline"
            >
              GeneTranslate data lifecycle
            </Link>{" "}
            for the exact pipeline.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Reporting a security issue
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            We welcome responsible disclosure. Email{" "}
            <a
              className="font-medium text-coral-600 hover:text-coral-700 underline"
              href="mailto:security@supportnest.example"
            >
              security@supportnest.example
            </a>{" "}
            with reproduction steps. We&rsquo;ll acknowledge within 2 business
            days and credit you in our security notes if you&rsquo;d like.
          </p>
        </div>
      </section>
    </Shell>
  );
}
