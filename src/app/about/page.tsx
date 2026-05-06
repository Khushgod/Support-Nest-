import Link from "next/link";
import {
  Heart,
  HandHeart,
  Sprout,
  ShieldCheck,
  Users,
  Quote,
  ArrowRight,
} from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";

export const metadata = {
  title: "About SupportNest",
  description:
    "Why SupportNest exists: a warm, ad-free home for parents, teachers, and neurodivergent people, built on respect, privacy, and lived experience.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Lived experience first",
    desc: "We're a small team with neurodivergent kids, students, and selves. We build what we wished existed for our own families.",
  },
  {
    icon: HandHeart,
    title: "Kind by default",
    desc: "Every feature, prompt, and moderation rule starts from the question: would this make a tired parent's day a little softer?",
  },
  {
    icon: Sprout,
    title: "Slow, sustainable growth",
    desc: "We won't optimize for outrage clicks or growth-hack the community. We grow at the speed at which trust grows.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy is non-negotiable",
    desc: "No ads, no behavioral tracking, no dark patterns. Your data is yours; we encrypt anything you save.",
  },
  {
    icon: Users,
    title: "Many ways to belong",
    desc: "You don't have to choose 'parent' or 'ND adult' or 'teacher.' Bring all of who you are. The nest holds it.",
  },
];

export default function AboutPage() {
  return (
    <Shell>
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <PageHeader
            eyebrow="About"
            title="Built by people who needed it, for people who need it."
            subtitle="SupportNest started as a Sunday-evening conversation between a special-ed teacher, a clinical geneticist, and a stay-at-home parent of an autistic teen. We were tired of generic advice columns and adversarial forums. We wanted somewhere kind."
          />
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-3xl bg-white border border-cream-200 p-7"
            >
              <span className="inline-flex w-11 h-11 rounded-2xl bg-coral-50 items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-coral-500" />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white border-y border-cream-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Quote className="w-8 h-8 text-coral-300" />
          <p className="mt-4 text-xl sm:text-2xl text-slate-800 leading-relaxed font-medium">
            We don&rsquo;t want you to scroll for hours. We want you to find
            what you need, breathe a little easier, and get on with your life.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            &mdash; the SupportNest team
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Funded by people, not advertisers
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SupportNest is supported by community donations and small grants.
            We have no investors to chase, no engagement metrics to juice. If
            we ever change that, you&rsquo;ll be the first to know.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
            >
              Join the nest
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-800 text-sm font-semibold transition-colors"
            >
              Visit the community
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
