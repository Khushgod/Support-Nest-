import Link from "next/link";
import {
  HeartHandshake,
  GraduationCap,
  Sparkles,
  Stethoscope,
  ArrowRight,
  BookOpenText,
  Bookmark,
} from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";

export const metadata = {
  title: "Resources library | SupportNest",
  description:
    "Curated, plainly-written resources for parents, teachers, and neurodivergent adults — explainers, scripts, checklists, and reading lists.",
};

const COLLECTIONS = [
  {
    href: "/resources/parents",
    title: "For parents & caregivers",
    desc: "Diagnosis decoding, school-meeting scripts, sensory-friendly routines, sibling support.",
    count: 142,
    icon: HeartHandshake,
    accent: "from-coral-200 to-sun-200",
  },
  {
    href: "/resources/teachers",
    title: "For teachers & therapists",
    desc: "IEP/504 templates, classroom strategies, sensory tools, communication frameworks.",
    count: 96,
    icon: GraduationCap,
    accent: "from-lavender-200 to-coral-200",
  },
  {
    href: "/resources/neurodivergent-adults",
    title: "For neurodivergent adults",
    desc: "Workplace accommodations, energy & burnout, late-diagnosis stories, identity & advocacy.",
    count: 88,
    icon: Sparkles,
    accent: "from-sun-200 to-lavender-200",
  },
  {
    href: "/resources/healthcare",
    title: "Healthcare & genetics",
    desc: "Finding clinicians, decoding evaluations, genetic-testing guides, GeneTranslate links.",
    count: 54,
    icon: Stethoscope,
    accent: "from-cream-200 to-coral-200",
  },
];

const FEATURED = [
  {
    title: "The 'meeting before the meeting': IEP prep in 20 minutes",
    audience: "Parents",
    minutes: 7,
  },
  {
    title: "Identity-first vs. person-first language: a respectful primer",
    audience: "Everyone",
    minutes: 5,
  },
  {
    title: "Building a low-demand morning routine that actually holds",
    audience: "Parents",
    minutes: 9,
  },
  {
    title: "Sensory regulation tools that scale across a classroom",
    audience: "Teachers",
    minutes: 8,
  },
  {
    title: "Asking for accommodations at work without overexplaining",
    audience: "ND adults",
    minutes: 6,
  },
  {
    title: "Decoding a clinical evaluation, paragraph by paragraph",
    audience: "Parents · ND adults",
    minutes: 10,
  },
];

export default function ResourcesHubPage() {
  return (
    <Shell>
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <PageHeader
            eyebrow="Resources"
            title="A library, not a content firehose."
            subtitle="Hand-curated and lightly opinionated. Each resource is reviewed by people in the relevant role before it lands here. We link out generously to the originals."
          />
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {COLLECTIONS.map(({ href, title, desc, count, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-3xl border border-cream-200 bg-white p-7 hover:-translate-y-0.5 hover:shadow-[var(--shadow-primary-soft)] transition"
            >
              <div
                className={`absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-70`}
                aria-hidden
              />
              <div className="relative">
                <span className="inline-flex w-11 h-11 rounded-2xl bg-white border border-cream-200 shadow-sm items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-coral-500" />
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {desc}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {count} curated items
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-coral-600 group-hover:text-coral-700">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-14 bg-white border-y border-cream-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpenText className="w-5 h-5 text-lavender-600" />
            <h2 className="text-xl font-semibold text-slate-900">
              Featured this week
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-6 max-w-xl">
            Short, useful, and easy to come back to.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED.map((r) => (
              <li
                key={r.title}
                className="rounded-2xl border border-cream-200 bg-cream-50/40 p-5 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  <Bookmark className="w-3 h-3" /> {r.audience}
                  <span aria-hidden>·</span>
                  <span>{r.minutes} min read</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-900 leading-snug">
                  {r.title}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Save what helps. Skip what doesn&rsquo;t.
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            With a free SupportNest account you can build a personal shelf,
            tag resources for your kid&rsquo;s teacher, and re-find anything in
            seconds.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
            >
              Make my shelf
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools/genetranslate"
              className="text-sm font-medium text-coral-600 hover:text-coral-700"
            >
              Or try GeneTranslate →
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
