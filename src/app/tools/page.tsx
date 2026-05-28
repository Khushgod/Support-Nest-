import Link from "next/link";
import {
  Dna,
  Wrench,
  Sparkles,
  ListChecks,
  Languages,
  HeartPulse,
  ArrowRight,
  Lock,
} from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";

export const metadata = {
  title: "Free tools | SupportNest",
  description:
    "A small, growing suite of free tools from SupportNest — privacy-first and built for parents, teachers, and neurodivergent people.",
};

const TOOLS = [
  {
    id: "genetranslate",
    name: "GeneTranslate",
    icon: Dna,
    tagline: "Plain-language genetic-test summaries",
    desc: "Drop a clinical genetic-test PDF and get clear, variant-by-variant explanations and counselor questions. Local-first: the LLM runs on your machine via Ollama.",
    href: "/tools/genetranslate",
    badge: "Live",
    badgeClass: "bg-coral-100 text-coral-700",
    accent: "from-sky-200 to-coral-200",
  },
  {
    id: "plain-language",
    name: "Plain-Language Translator",
    icon: Languages,
    tagline: "Decode forms, letters & reports",
    desc: "Paste a school report, evaluation, insurance letter, or any jargon-heavy text. Choose plain English, kid-friendly, quick summary, or action items only. Local-first.",
    href: "/tools/plain-language",
    badge: "Live",
    badgeClass: "bg-coral-100 text-coral-700",
    accent: "from-lavender-200 to-cream-200",
  },
  {
    id: "iep-companion",
    name: "IEP / 504 Companion",
    icon: ListChecks,
    tagline: "Walk into the meeting prepared",
    desc: "Step through strengths, challenges, and an accommodation menu. Add talking points and goals. Export a printable one-pager (PDF or text).",
    href: "/tools/iep-companion",
    badge: "Live",
    badgeClass: "bg-coral-100 text-coral-700",
    accent: "from-coral-200 to-lavender-200",
  },
  {
    id: "regulation-toolkit",
    name: "Regulation Toolkit",
    icon: HeartPulse,
    tagline: "Tools tuned to how you're feeling right now",
    desc: "Three quick questions about your energy, body, and need surface 5 evidence-informed regulation strategies. Includes a built-in box-breathing companion.",
    href: "/tools/regulation-toolkit",
    badge: "Live",
    badgeClass: "bg-coral-100 text-coral-700",
    accent: "from-coral-200 to-sun-200",
  },
  {
    id: "sensory-planner",
    name: "Sensory Day Planner",
    icon: Sparkles,
    tagline: "Plan calmer days, classrooms, and outings",
    desc: "Map a day in time blocks, tag each block's sensory load and triggers, and the planner flags trouble zones before they become meltdowns.",
    href: "/tools/sensory-planner",
    badge: "Live",
    badgeClass: "bg-coral-100 text-coral-700",
    accent: "from-sun-200 to-lavender-200",
  },
  {
    id: "more-soon",
    name: "More on the way",
    icon: Wrench,
    tagline: "Pitch a tool, rally upvotes",
    desc: "Accommodation-letter builder for adults, a meeting prep notebook, and a routine builder are next on the roadmap.",
    href: "/community",
    badge: "Coming soon",
    badgeClass: "bg-cream-200 text-slate-700",
    accent: "from-lavender-200 to-cream-200",
  },
];

export default function ToolsIndexPage() {
  return (
    <Shell>
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <PageHeader
            eyebrow="Tools"
            title="Small, sharp tools — built like good kitchen knives."
            subtitle="Tools that respect your time and your data. Most don't require an account; the ones that do encrypt anything you save."
          />
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border border-cream-200 px-3 py-1 text-xs text-slate-600">
            <Lock className="w-3.5 h-3.5 text-lavender-600" />
            HTTPS in transit · AES-256-GCM at rest
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {TOOLS.map(
            ({ id, name, icon: Icon, tagline, desc, href, badge, badgeClass, accent }) => (
              <Link
                key={id}
                href={href}
                className="group relative overflow-hidden rounded-3xl border border-cream-200 bg-white p-7 hover:-translate-y-0.5 hover:shadow-[var(--shadow-primary-soft)] transition"
              >
                <div
                  className={`absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-60`}
                  aria-hidden
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex w-12 h-12 rounded-2xl bg-white border border-cream-200 shadow-sm items-center justify-center">
                      <Icon className="w-6 h-6 text-coral-500" />
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}
                    >
                      {badge}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 tracking-tight">
                    {name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">{tagline}</p>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-coral-600 group-hover:text-coral-700">
                    {badge === "Live" ? "Open the tool" : "Get notified"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      <section className="py-12 bg-white border-t border-cream-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Wrench className="w-7 h-7 mx-auto text-coral-500" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
            Have an idea for a tool?
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            We build what the community asks for, in priority order. Pitch us in
            the forum and rally a few upvotes.
          </p>
          <Link
            href="/community"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
          >
            Pitch a tool
          </Link>
        </div>
      </section>
    </Shell>
  );
}
