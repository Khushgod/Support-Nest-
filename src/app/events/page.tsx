import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Mic2,
  Users,
  ArrowRight,
  MapPin,
  Headphones,
} from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";

export const metadata = {
  title: "Events & circles | SupportNest",
  description:
    "Live workshops, weekly support circles, expert AMAs, and quiet co-working sessions for parents, teachers, and neurodivergent adults.",
};

type EventItem = {
  title: string;
  desc: string;
  date: string;
  time: string;
  format: "Online workshop" | "Support circle" | "AMA" | "Co-working";
  audience: string;
  spotsLeft?: number;
};

const UPCOMING: EventItem[] = [
  {
    title: "IEP season survival kit",
    desc: "A 60-minute walkthrough of accommodation menus, the language that gets results, and how to bring your child's voice into the meeting.",
    date: "Tue, May 13",
    time: "7:00 PM ET",
    format: "Online workshop",
    audience: "Parents",
    spotsLeft: 24,
  },
  {
    title: "Quiet co-working: Wednesday focus hour",
    desc: "Cameras off, mics off, body-double through your hardest task. We'll set a 50/10 work-rest cadence together.",
    date: "Wed, May 14",
    time: "2:00 PM ET",
    format: "Co-working",
    audience: "ND adults",
  },
  {
    title: "AMA: Genetic testing & what it actually tells you",
    desc: "Board-certified genetic counselor Dr. R. Patel answers your questions. Submit ahead anonymously when you RSVP.",
    date: "Thu, May 15",
    time: "12:00 PM ET",
    format: "AMA",
    audience: "Everyone",
    spotsLeft: 8,
  },
  {
    title: "Teachers' lounge: regulation strategies that scale",
    desc: "Five teachers share what's working in their classrooms. Bring one strategy you'd like to swap.",
    date: "Sat, May 17",
    time: "10:00 AM ET",
    format: "Online workshop",
    audience: "Teachers",
  },
  {
    title: "First Friday support circle",
    desc: "Drop-in, peer-led space for parents of newly diagnosed kids. Soft start, no need to share.",
    date: "Fri, Jun 6",
    time: "8:00 PM ET",
    format: "Support circle",
    audience: "Parents",
  },
  {
    title: "Sensory walks for grown-ups",
    desc: "Asynchronous, do-it-anytime: a 25-minute outdoor sensory-grounding walk with audio prompts you can pause.",
    date: "On-demand",
    time: "Anytime",
    format: "Co-working",
    audience: "ND adults",
  },
];

const FORMAT_STYLES: Record<EventItem["format"], string> = {
  "Online workshop": "bg-coral-100 text-coral-700",
  "Support circle": "bg-lavender-100 text-lavender-700",
  AMA: "bg-sun-100 text-sun-700",
  "Co-working": "bg-cream-200 text-slate-700",
};

export default function EventsPage() {
  return (
    <Shell>
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <PageHeader
            eyebrow="Events"
            title="Live, recorded, asynchronous — whatever fits your week."
            subtitle="Soft, low-pressure formats designed for tired humans. Most events are free; donations are welcome and never required."
          />
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
            >
              Get the weekly digest
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-800 text-sm font-semibold transition-colors"
            >
              Visit the community
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Upcoming &amp; on-demand
            </h2>
            <Link
              href="/events/calendar"
              className="text-sm font-medium text-coral-600 hover:text-coral-700"
            >
              See full calendar →
            </Link>
          </div>
          <ul className="space-y-4">
            {UPCOMING.map((e) => (
              <li
                key={e.title}
                className="rounded-3xl bg-white border border-cream-200 p-6 sm:flex sm:items-center sm:justify-between gap-6 hover:shadow-[var(--shadow-primary-card)] transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${FORMAT_STYLES[e.format]}`}
                    >
                      {e.format}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      For {e.audience}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {e.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {e.desc}
                  </p>
                  <dl className="mt-3 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <Pair icon={CalendarDays} label={e.date} />
                    <Pair icon={Clock} label={e.time} />
                    {e.format === "Co-working" && (
                      <Pair icon={Headphones} label="Bring your task" />
                    )}
                    <Pair icon={MapPin} label="Online · Zoom + captions" />
                    {e.spotsLeft != null && (
                      <Pair
                        icon={Users}
                        label={`${e.spotsLeft} spots left`}
                      />
                    )}
                  </dl>
                </div>
                <div className="mt-5 sm:mt-0 flex-shrink-0">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition"
                  >
                    RSVP free
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 bg-white border-t border-cream-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Mic2 className="w-7 h-7 mx-auto text-lavender-600" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
            Have an idea for an event?
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Members propose and host most of our circles. Pitch a topic and
            we&rsquo;ll help you set it up — captions, slides, accessibility
            checks, all of it.
          </p>
          <Link
            href="/community"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-lavender-500 hover:bg-lavender-600 text-white text-sm font-semibold transition-colors"
          >
            Pitch an event
          </Link>
        </div>
      </section>
    </Shell>
  );
}

function Pair({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" /> {label}
    </span>
  );
}
