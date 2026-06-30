import Link from "next/link";
import { Mic2, ArrowRight } from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";

export const metadata = {
  title: "Events & circles | SupportNest",
  description:
    "Live workshops, weekly support circles, expert AMAs, and quiet co-working sessions for parents, teachers, and neurodivergent adults.",
};

export default function EventsPage() {
  return (
    <Shell>
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <PageHeader
            eyebrow="Events"
            title="Live, recorded, asynchronous - whatever fits your week."
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
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Upcoming &amp; on-demand
            </h2>
          </div>
          <div className="rounded-3xl bg-white border border-cream-200 p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">
              What do you suggest we do next?
            </p>
          </div>
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
            we&rsquo;ll help you set it up - captions, slides, accessibility
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
