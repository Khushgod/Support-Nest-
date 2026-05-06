import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Sparkles,
  Users,
  CalendarDays,
  BookOpenText,
  Wrench,
  ShieldCheck,
  Lock,
  Cpu,
  MessagesSquare,
  Lightbulb,
  Quote,
  Star,
  Coffee,
  Map,
} from "lucide-react";
import Header from "@/components/supportnest/Header";
import Footer from "@/components/supportnest/Footer";

export const metadata = {
  title: "SupportNest — A warm home for parents, teachers & ND people",
  description:
    "SupportNest is a warm, ad-free space with a supportive community, free tools (including GeneTranslate), curated resources, and welcoming events for parents, teachers, and neurodivergent people.",
};

const AUDIENCES = [
  {
    title: "Parents & caregivers",
    desc: "Practical guides, school-meeting scripts, sensory-friendly routines, and a gentle community of people who get it.",
    href: "/resources/parents",
    accent: "from-coral-300 via-coral-200 to-sun-200",
    icon: HeartHandshake,
  },
  {
    title: "Teachers & therapists",
    desc: "Classroom strategies, IEP/504 templates, communication-friendly lesson plans, and discussions with educators.",
    href: "/resources/teachers",
    accent: "from-lavender-300 via-lavender-200 to-coral-200",
    icon: BookOpenText,
  },
  {
    title: "Neurodivergent adults",
    desc: "Self-advocacy, workplace accommodations, sensory and energy management, and peer support without the noise.",
    href: "/resources/neurodivergent-adults",
    accent: "from-sun-300 via-sun-200 to-lavender-200",
    icon: Sparkles,
  },
];

const PILLARS = [
  {
    icon: Users,
    title: "Community forum",
    desc: "Audience-tagged threads, opt-in identity, and gentle moderation so conversations stay supportive and useful.",
    href: "/community",
  },
  {
    icon: CalendarDays,
    title: "Events & circles",
    desc: "Live workshops, weekly support circles, ask-me-anythings with specialists, and quiet co-working sessions.",
    href: "/events",
  },
  {
    icon: BookOpenText,
    title: "Resources library",
    desc: "Curated explainers, scripts, checklists, and reading lists — sourced carefully and updated by the community.",
    href: "/resources",
  },
  {
    icon: Wrench,
    title: "Free tools",
    desc: "A growing suite of practical tools you can use without an account, including GeneTranslate for genetic-test reports.",
    href: "/tools",
  },
];

const TOOLS = [
  {
    name: "GeneTranslate",
    tagline: "Plain-language genetic-test summaries",
    desc: "Turn a clinical genetic-test PDF into clear, variant-by-variant explanations and counselor questions — local-first, no cloud LLM.",
    href: "/tools/genetranslate",
    badge: "Live",
    badgeClass: "bg-coral-100 text-coral-700",
  },
  {
    name: "Sensory Planner",
    tagline: "Plan calmer days, classrooms, and outings",
    desc: "Build sensory-friendly schedules, identify triggers, and share routines with caregivers, teachers, or therapists.",
    href: "/tools",
    badge: "Coming soon",
    badgeClass: "bg-cream-200 text-slate-700",
  },
  {
    name: "IEP/504 Companion",
    tagline: "Prep for school meetings without the dread",
    desc: "Walk through accommodation menus, draft talking points, and export a clean one-pager for your next meeting.",
    href: "/tools",
    badge: "Coming soon",
    badgeClass: "bg-cream-200 text-slate-700",
  },
  {
    name: "Plain-Lang Translator",
    tagline: "Decode forms, letters, and reports",
    desc: "Paste a school report, evaluation, or insurance letter and get a friendlier, jargon-free version.",
    href: "/tools",
    badge: "Coming soon",
    badgeClass: "bg-cream-200 text-slate-700",
  },
];

const VOICES = [
  {
    quote:
      "I finally have a place that feels like a soft landing. The forum is full of people who've actually been there.",
    name: "Maya",
    role: "Parent, Atlanta",
  },
  {
    quote:
      "I came in for the IEP templates and stayed for the community. Saved me hours of re-inventing the wheel.",
    name: "Devon",
    role: "Special-ed teacher",
  },
  {
    quote:
      "GeneTranslate helped me prep for my counseling appointment with way fewer tears. Thank you for building it.",
    name: "Aarti",
    role: "Adult ND, recently tested",
  },
];

const VALUES = [
  {
    icon: Lock,
    title: "Encrypted in transit & at rest",
    desc: "Every page is served over HTTPS with HSTS. Anything you upload (when you opt in to save) is sealed with AES-256-GCM and a per-record key.",
  },
  {
    icon: ShieldCheck,
    title: "Ad-free, human-first",
    desc: "No ads, no creepy tracking, no doomscroll loops. SupportNest is supported by donations and grants — not by your attention.",
  },
  {
    icon: Cpu,
    title: "Local-first where possible",
    desc: "Tools like GeneTranslate run AI on your machine via Ollama. Your most sensitive data never has to leave the device.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-gradient">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Blobs />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-24 pb-16 sm:pb-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-cream-200 text-xs font-medium text-coral-700 backdrop-blur-sm">
                <HeartHandshake className="w-3.5 h-3.5" />
                A warm corner of the internet for neurodivergent families
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.05]">
                Where parents, teachers, and{" "}
                <span className="text-gradient-warm">neurodivergent people</span>{" "}
                find their footing.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-700/90 max-w-2xl leading-relaxed">
                SupportNest is a free, kind, ad&#8209;free home with a thoughtful
                community, practical resources, welcoming events, and a small
                suite of tools we built because we needed them too.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  Join the nest — it&rsquo;s free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools/genetranslate"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-800 text-sm font-semibold transition-colors"
                >
                  Try GeneTranslate
                </Link>
              </div>
              <p className="mt-5 text-xs text-slate-500 max-w-xl">
                No ads, no creepy tracking, no surprise paywalls. Sign-up
                takes about 30 seconds.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Members welcomed" value="12,400+" />
              <Stat label="Resources curated" value="380+" />
              <Stat label="Events / year" value="160+" />
              <Stat label="Free tools" value="4 (and growing)" />
            </div>
          </div>
        </section>

        {/* Audiences */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Built for everyone in the conversation"
              title="Find your people"
              subtitle="Whichever role you're in, there's a corner of the nest tuned to you. No need to mask, translate, or explain yourself from scratch."
            />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {AUDIENCES.map(({ title, desc, href, accent, icon: Icon }) => (
                <Link
                  key={title}
                  href={href}
                  className="group relative overflow-hidden rounded-3xl border border-cream-200 bg-white p-7 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(208,74,44,0.25)] transition"
                >
                  <div
                    className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-70`}
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="inline-flex w-11 h-11 rounded-2xl bg-white shadow-sm border border-cream-200 items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-coral-500" />
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {desc}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-coral-600 group-hover:text-coral-700">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-16 sm:py-20 bg-white border-y border-cream-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="What lives inside the nest"
              title="Four softly woven pillars"
              subtitle="Each piece works on its own — together they make a complete, supportive home."
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PILLARS.map(({ icon: Icon, title, desc, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="rounded-3xl border border-cream-200 p-6 hover:border-coral-200 hover:bg-coral-50/30 transition-colors group"
                >
                  <span className="inline-flex w-10 h-10 rounded-xl bg-coral-50 items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-coral-500" />
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-coral-600 group-hover:text-coral-700">
                    Visit <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Free tools"
              title="A small toolkit, made with care"
              subtitle="Tools that respect your time, your attention, and your data. Use them with or without a SupportNest account."
            />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {TOOLS.map((t) => (
                <Link
                  key={t.name}
                  href={t.href}
                  className="rounded-3xl border border-cream-200 bg-white p-7 hover:shadow-[0_20px_40px_-20px_rgba(138,97,223,0.25)] transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                        {t.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {t.tagline}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${t.badgeClass}`}
                    >
                      {t.badge}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    {t.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-lavender-700">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Voices */}
        <section className="py-16 sm:py-20 bg-cream-50/60 border-y border-cream-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="In their words"
              title="A few voices from the nest"
              subtitle="Real people, anonymized only when they asked. Stories shared with consent."
            />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {VOICES.map((v) => (
                <figure
                  key={v.name}
                  className="rounded-3xl bg-white border border-cream-200 p-7"
                >
                  <Quote className="w-6 h-6 text-coral-300" />
                  <blockquote className="mt-3 text-sm text-slate-700 leading-relaxed">
                    &ldquo;{v.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-coral-300 to-lavender-300" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {v.name}
                      </div>
                      <div className="text-xs text-slate-500">{v.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-sun-400 text-sun-400"
                  aria-hidden
                />
              ))}
              <span className="ml-2 text-sm text-slate-600">
                Rated 4.9 / 5 by community members
              </span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="How SupportNest works"
              title="From signup to settled-in, in three soft steps"
            />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: Coffee,
                  title: "Make yourself at home",
                  desc: "Create a free account in 30 seconds. Tell us if you're a parent, teacher, ND adult, or ally — we tune the home page to you.",
                },
                {
                  icon: Map,
                  title: "Find your path",
                  desc: "Hop into a forum thread, RSVP to an event, save resources to your shelf, or pop open a free tool. No pressure to do everything.",
                },
                {
                  icon: Lightbulb,
                  title: "Take what helps, leave the rest",
                  desc: "Export anything you want. Delete what you don't. Your data is yours; we just make it useful while you're here.",
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className="relative rounded-3xl bg-white border border-cream-200 p-7"
                >
                  <span className="absolute -top-3 left-7 inline-flex items-center justify-center w-7 h-7 rounded-full bg-coral-500 text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="inline-flex w-10 h-10 rounded-xl bg-sun-50 items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-sun-600" />
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-16 sm:py-20 bg-white border-y border-cream-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Our security pledge"
              title="Your data is treated like family"
              subtitle="We're a small team and we sweat the privacy details so you don't have to."
            />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-cream-200 p-6 bg-cream-50/40"
                >
                  <span className="inline-flex w-10 h-10 rounded-xl bg-white border border-cream-200 items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-lavender-600" />
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-slate-500 max-w-2xl">
              Read our full{" "}
              <Link href="/privacy" className="underline hover:text-coral-600">
                Privacy &amp; Security commitments
              </Link>{" "}
              for the technical details, including key derivation, session
              cookies, and our deletion timeline.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-coral-500 via-coral-400 to-sun-400 px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-[0_30px_60px_-25px_rgba(208,74,44,0.5)]">
              <div
                className="absolute inset-0 opacity-30 mix-blend-soft-light"
                style={{
                  background:
                    "radial-gradient(60% 60% at 80% 20%, white 0%, transparent 60%), radial-gradient(50% 50% at 20% 80%, white 0%, transparent 60%)",
                }}
                aria-hidden
              />
              <div className="relative">
                <MessagesSquare className="w-8 h-8 mx-auto opacity-90" />
                <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                  Pull up a chair. We saved you a spot.
                </h2>
                <p className="mt-3 text-white/90 max-w-xl mx-auto">
                  Free forever for the core community, resources, events, and
                  tools. Whenever you&rsquo;re ready.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-coral-600 hover:bg-cream-50 text-sm font-semibold transition-colors"
                  >
                    Create your free account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/community"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/40 text-white text-sm font-semibold transition-colors backdrop-blur-sm"
                  >
                    Peek inside the community
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-coral-600 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white/70 backdrop-blur-sm p-4">
      <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        {value}
      </div>
      <div className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}

function Blobs() {
  return (
    <div className="absolute inset-0 -z-0 pointer-events-none" aria-hidden>
      <span className="absolute top-10 -left-16 w-72 h-72 rounded-full bg-coral-200/60 blur-3xl animate-float" />
      <span className="absolute top-32 right-0 w-80 h-80 rounded-full bg-sun-200/60 blur-3xl animate-float-slow" />
      <span className="absolute -bottom-10 left-1/3 w-72 h-72 rounded-full bg-lavender-200/60 blur-3xl animate-float" />
    </div>
  );
}
