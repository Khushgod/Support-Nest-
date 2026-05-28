import Link from "next/link";
import {
  Sparkles,
  CalendarDays,
  Users,
  Wrench,
  BookmarkCheck,
  ShieldCheck,
  ArrowRight,
  Lock,
  Trash2,
} from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import LogoutButton from "@/components/supportnest/LogoutButton";
import { requireUser } from "@/lib/auth/dal";
import { listForUser } from "@/lib/crypto/vault";
import { ROLE_LABELS } from "@/lib/auth/schema";
import { deleteVaultRecord } from "./actions";

export const metadata = {
  title: "Your nest | SupportNest",
};

type SearchProps = { searchParams: Promise<{ welcome?: string }> };

export default async function DashboardPage({ searchParams }: SearchProps) {
  const user = await requireUser();
  const params = await searchParams;
  const isWelcome = params.welcome === "1";

  const records = await listForUser(user.id);

  const QUICK = [
    {
      icon: Users,
      title: "Visit the community",
      desc: "Drop into a thread that matches what you need today.",
      href: "/community",
      color: "bg-coral-50 text-coral-600",
    },
    {
      icon: CalendarDays,
      title: "Browse events",
      desc: "Workshops, support circles, and quiet co-working sessions.",
      href: "/events",
      color: "bg-sun-50 text-sun-600",
    },
    {
      icon: BookmarkCheck,
      title: "Open your shelf",
      desc: "Resources you've saved for yourself or your kid's teacher.",
      href: "/resources",
      color: "bg-lavender-50 text-lavender-600",
    },
    {
      icon: Wrench,
      title: "Use a free tool",
      desc: "GeneTranslate, Plain-Language Translator, IEP Companion, Regulation Toolkit.",
      href: "/tools",
      color: "bg-cream-100 text-slate-700",
    },
  ];

  return (
    <Shell>
      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {isWelcome && (
            <div className="rounded-3xl border border-coral-200 bg-coral-50/70 px-5 py-4 mb-6 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-coral-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-coral-900">
                <strong className="font-semibold">
                  Welcome to the nest, {user.name.split(" ")[0]}.
                </strong>{" "}
                Here&rsquo;s your home base. Take what helps; we&rsquo;ll be
                here when you need more.
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-coral-600">
                Your nest
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Hi, {user.name.split(" ")[0]} <span aria-hidden>👋</span>
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Signed in as {user.email} ·{" "}
                <span className="text-slate-700 font-medium">
                  {ROLE_LABELS[user.role]}
                </span>
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="rounded-3xl border border-cream-200 bg-white p-6 hover:-translate-y-0.5 hover:shadow-[var(--shadow-primary-card)] transition"
            >
              <span
                className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-4 ${q.color}`}
              >
                <q.icon className="w-5 h-5" />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                {q.title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                {q.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-coral-600">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-cream-200 bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-lavender-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Your encrypted vault
                </h2>
              </div>
              <span className="text-[11px] font-medium text-slate-500 inline-flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                AES&#8209;256&#8209;GCM &middot; per&#8209;record key
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
              Anything you save here is encrypted at rest. Each file gets its
              own key derived from your account scope and a unique nonce. Only
              you can decrypt your records when you&rsquo;re signed in.
            </p>

            {records.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-cream-300 p-6 text-center">
                <p className="text-sm text-slate-600">
                  Your vault is empty &mdash; that&rsquo;s a good thing if you
                  don&rsquo;t need it. When you save a file from one of our
                  tools, it&rsquo;ll appear here.
                </p>
                <Link
                  href="/tools/genetranslate"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
                >
                  Try GeneTranslate
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-cream-100 border border-cream-200 rounded-2xl overflow-hidden">
                {records.map((r) => (
                  <li
                    key={r.recordId}
                    className="flex items-center justify-between gap-3 px-4 py-3 bg-white"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {r.filename ?? r.recordId}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {(r.byteLength / 1024).toFixed(1)} KB ·{" "}
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/vault/${encodeURIComponent(r.recordId)}`}
                        className="text-xs font-medium text-coral-600 hover:text-coral-700"
                      >
                        Decrypt &amp; download
                      </a>
                      <form action={deleteVaultRecord}>
                        <input
                          type="hidden"
                          name="recordId"
                          value={r.recordId}
                        />
                        <button
                          type="submit"
                          className="text-xs text-slate-500 hover:text-rose-600 inline-flex items-center gap-1"
                          aria-label="Delete record"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
