import Link from "next/link";
import {
  MessageCircle,
  HeartHandshake,
  CalendarDays,
  Users,
  ArrowRight,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";
import { getCurrentUser } from "@/lib/auth/dal";

export const metadata = {
  title: "Community | SupportNest",
  description:
    "A thoughtful, audience-tagged community forum for parents, teachers, and neurodivergent people. Gentle moderation. No ads, no doomscrolling.",
};

const SPACES = [
  {
    title: "First steps & introductions",
    desc: "Say hi at your own pace. No pressure, no scripts.",
    threads: 412,
    members: 4830,
    accent: "from-coral-200 to-sun-200",
  },
  {
    title: "Parenting little ones (0–8)",
    desc: "Routines, regulation, sensory needs, school transitions.",
    threads: 1248,
    members: 6312,
    accent: "from-sun-200 to-cream-200",
  },
  {
    title: "Tweens & teens",
    desc: "Friendships, identity, school, executive-function support.",
    threads: 822,
    members: 4014,
    accent: "from-lavender-200 to-coral-200",
  },
  {
    title: "Adults: workplace & life",
    desc: "Accommodations, burnout, masking, mental-health peers.",
    threads: 1584,
    members: 7220,
    accent: "from-cream-200 to-lavender-200",
  },
  {
    title: "Educators' lounge",
    desc: "Classroom strategies, IEP wins, school-system venting.",
    threads: 932,
    members: 2810,
    accent: "from-lavender-200 to-sun-200",
  },
  {
    title: "Healthcare & genetics",
    desc: "Decoding evaluations, genetic testing, finding clinicians.",
    threads: 318,
    members: 1490,
    accent: "from-sun-200 to-coral-200",
  },
];

const PRINCIPLES = [
  "Lead with kindness — assume good faith.",
  "Use content notes for heavy topics; allow opt-in reading.",
  "No diagnosing strangers; share experiences, not prescriptions.",
  "Respect identity-first vs. person-first language preferences.",
  "What's shared in support stays in support.",
  "Hate, harassment, and hard-sell self-promotion get removed.",
];

export default async function CommunityPage() {
  const user = await getCurrentUser();

  return (
    <Shell>
      <section className="relative py-14 sm:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-end">
          <div>
            <PageHeader
              eyebrow="Community"
              title="A forum that feels like a friend's living room."
              subtitle="Share what's hard, ask what you need, celebrate what worked. Threads are tagged by audience so the right people see them, and our small mod team keeps things kind."
            />
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              {user ? (
                <Link
                  href="/community/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Start a thread
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
                >
                  Join free to post
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-800 text-sm font-semibold transition-colors"
              >
                <CalendarDays className="w-4 h-4" /> See upcoming events
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-cream-200 p-6 grid grid-cols-3 gap-4 text-center">
            <Stat label="Active members" value="12k+" icon={Users} />
            <Stat label="Threads / week" value="900+" icon={MessageCircle} />
            <Stat
              label="Welcomed by mods"
              value="100%"
              icon={HeartHandshake}
            />
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y border-cream-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Spaces in the nest
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Drop into the room that matches what you need today. You can move
            between as many as you like.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPACES.map((s) => (
              <article
                key={s.title}
                className="relative overflow-hidden rounded-3xl border border-cream-200 bg-cream-50/40 p-6 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(208,74,44,0.18)] transition"
              >
                <div
                  className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${s.accent} blur-2xl opacity-60`}
                  aria-hidden
                />
                <div className="relative">
                  <h3 className="text-base font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                  <dl className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <div>
                      <dt className="sr-only">Threads</dt>
                      <dd className="font-semibold text-slate-700">
                        {s.threads.toLocaleString()}
                      </dd>
                      <dd>threads</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Members</dt>
                      <dd className="font-semibold text-slate-700">
                        {s.members.toLocaleString()}
                      </dd>
                      <dd>members</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-dashed border-cream-300 p-5 bg-white">
            <p className="text-sm text-slate-600 leading-relaxed">
              <Sparkles className="w-4 h-4 inline-block mr-1.5 text-sun-500" />
              The forum is in friends-and-family beta while we get the
              moderation tooling right. Sign up to be invited as we open more
              spaces each month.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Community guidelines, in plain language
          </h2>
          <ul className="mt-6 space-y-3">
            {PRINCIPLES.map((p) => (
              <li
                key={p}
                className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed bg-white border border-cream-200 rounded-2xl px-4 py-3"
              >
                <span className="mt-0.5 inline-flex w-5 h-5 rounded-full bg-coral-100 text-coral-600 items-center justify-center text-xs font-bold">
                  &#10003;
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div>
      <Icon className="w-5 h-5 mx-auto text-coral-500" />
      <div className="mt-2 text-xl font-bold text-slate-900">{value}</div>
      <div className="text-[11px] text-slate-500 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
