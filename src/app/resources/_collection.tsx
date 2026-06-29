import Link from "next/link";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";
import ResourceCard from "./ResourceCard";

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
                <ResourceCard key={r.title} r={r} />
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
