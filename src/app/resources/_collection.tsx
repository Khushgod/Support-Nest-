import Link from "next/link";
import { ArrowRight, BookmarkPlus } from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";

export type Resource = {
  title: string;
  desc: string;
  href: string;
  format: "Article" | "Script" | "Checklist" | "Tool" | "Reading list";
  minutes?: number;
};

export type Section = {
  heading: string;
  blurb?: string;
  items: Resource[];
};

const FORMAT_STYLES: Record<Resource["format"], string> = {
  Article: "bg-coral-100 text-coral-700",
  Script: "bg-lavender-100 text-lavender-700",
  Checklist: "bg-sun-100 text-sun-700",
  Tool: "bg-cream-200 text-slate-700",
  "Reading list": "bg-white border border-cream-200 text-slate-700",
};

export default function CollectionPage({
  eyebrow,
  title,
  subtitle,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: Section[];
}) {
  return (
    <Shell>
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-medium text-coral-600 mb-2">
            <Link href="/resources" className="hover:underline">
              ← All resources
            </Link>
          </p>
          <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </div>
      </section>

      <section className="pb-16 space-y-12">
        {sections.map((s) => (
          <div key={s.heading} className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900">
              {s.heading}
            </h2>
            {s.blurb && (
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                {s.blurb}
              </p>
            )}
            <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {s.items.map((r) => (
                <li
                  key={r.title}
                  className="group rounded-2xl border border-cream-200 bg-white p-5 hover:shadow-[0_20px_40px_-22px_rgba(208,74,44,0.18)] transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${FORMAT_STYLES[r.format]}`}
                    >
                      {r.format}
                    </span>
                    {r.minutes && (
                      <span className="text-[11px] text-slate-500">
                        {r.minutes} min
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900 leading-snug">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {r.desc}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={r.href}
                      className="text-xs font-medium text-coral-600 hover:text-coral-700 inline-flex items-center gap-1"
                    >
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
                      aria-label={`Save ${r.title} to your shelf`}
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="py-12 bg-white border-t border-cream-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Missing something?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Suggest a resource you wish lived here. Members vote, mods review,
            authors get credit.
          </p>
          <Link
            href="/community"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
          >
            Suggest in the forum
          </Link>
        </div>
      </section>
    </Shell>
  );
}
