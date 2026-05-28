import Link from "next/link";
import {
  PlusCircle,
  Search,
  Sparkles,
  HeartHandshake,
  CalendarDays,
  Bookmark,
} from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import PageHeader from "@/components/supportnest/PageHeader";
import ThreadCard from "@/components/forum/ThreadCard";
import { TagChip } from "@/components/forum/AudienceChips";
import { getCurrentUser } from "@/lib/auth/dal";
import {
  bookmarksForUser,
  listSpaceStats,
  listThreads,
  listTrendingTags,
} from "@/lib/forum/store";
import { SPACES } from "@/lib/forum/types";
import { timeAgo } from "@/lib/forum/format";

export const metadata = {
  title: "Community | SupportNest",
  description:
    "A thoughtful, audience-tagged community forum for parents, teachers, and neurodivergent people. Gentle moderation. No ads.",
};

const PRINCIPLES = [
  "Lead with kindness — assume good faith.",
  "Use content notes for heavy topics; allow opt-in reading.",
  "No diagnosing strangers; share experiences, not prescriptions.",
  "Respect identity-first vs. person-first language preferences.",
  "What's shared in support stays in support.",
  "Hate, harassment, and hard-sell self-promotion get removed.",
];

export default async function CommunityHubPage() {
  const user = await getCurrentUser();
  const [recent, pinned, trending, stats] = await Promise.all([
    listThreads({ limit: 6, sort: "latest", pinnedFirst: false }),
    listThreads({ limit: 3, sort: "newest", pinnedFirst: true }).then((r) => ({
      ...r,
      items: r.items.filter((t) => t.isPinned),
    })),
    listTrendingTags(10),
    listSpaceStats(),
  ]);
  const userBookmarks = user ? new Set(
    (await bookmarksForUser(user.id)).map((b) => b.threadId)
  ) : new Set<string>();

  return (
    <Shell>
      {/* Hero */}
      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-[1.4fr_1fr] gap-10 items-end">
          <div>
            <PageHeader
              eyebrow="Community"
              title="A forum that feels like a friend's living room."
              subtitle="Threads are tagged by audience so the right people see them. Mods keep things kind. New members welcome — the only rule is be soft with each other."
            />
            <div className="mt-7 flex flex-col sm:flex-row gap-3 flex-wrap">
              <Link
                href="/community/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                {user ? "Start a thread" : "Join free to post"}
              </Link>
              <Link
                href="/community/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-800 text-sm font-semibold transition-colors"
              >
                <Search className="w-4 h-4" /> Search threads
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-700 text-sm font-medium transition-colors"
              >
                <CalendarDays className="w-4 h-4" /> Upcoming events
              </Link>
              {user && (
                <Link
                  href="/community/me"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-700 text-sm font-medium transition-colors"
                >
                  <Bookmark className="w-4 h-4" /> Your activity
                </Link>
              )}
            </div>
          </div>

          <aside className="rounded-3xl bg-white border border-cream-200 p-6">
            <h2 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sun-500" />
              Trending tags
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {trending.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Tags will surface once the community starts adding them.
                </p>
              ) : (
                trending.map((t) => (
                  <TagChip
                    key={t.tag}
                    tag={t.tag}
                    href={`/community/search?tag=${encodeURIComponent(t.tag)}`}
                  />
                ))
              )}
            </div>
            <h3 className="mt-6 text-sm font-semibold text-slate-900">
              Members welcomed this week
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Soft starts go a long way. Drop a hi if you&rsquo;re new — the{" "}
              <Link
                href="/community/first-steps"
                className="underline hover:text-coral-600"
              >
                First Steps space
              </Link>{" "}
              is for exactly that.
            </p>
          </aside>
        </div>
      </section>

      {/* Pinned highlights */}
      {pinned.items.length > 0 && (
        <section className="py-10 bg-white border-y border-cream-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              Pinned by mods
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Worth reading first.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pinned.items.map((t) => (
                <ThreadCard
                  key={t.id}
                  thread={t}
                  bookmarked={userBookmarks.has(t.id)}
                  showSpace
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Spaces */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Spaces in the nest
              </h2>
              <p className="text-sm text-slate-600">
                Pick the room that matches what you need today.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPACES.map((s) => {
              const meta = stats[s.id] ?? { threads: 0, replies: 0 };
              return (
                <Link
                  key={s.id}
                  href={`/community/${s.id}`}
                  className="relative overflow-hidden rounded-3xl border border-cream-200 bg-cream-50/40 p-6 hover:-translate-y-0.5 hover:shadow-[var(--shadow-primary-card)] transition"
                >
                  <div
                    className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${s.accent} blur-2xl opacity-60`}
                    aria-hidden
                  />
                  <div className="relative">
                    <h3 className="text-base font-semibold text-slate-900">
                      {s.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {s.blurb}
                    </p>
                    <dl className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      <div>
                        <dt className="sr-only">Threads</dt>
                        <dd className="font-semibold text-slate-700">
                          {meta.threads}
                        </dd>
                        <dd>thread{meta.threads === 1 ? "" : "s"}</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Replies</dt>
                        <dd className="font-semibold text-slate-700">
                          {meta.replies}
                        </dd>
                        <dd>repl{meta.replies === 1 ? "y" : "ies"}</dd>
                      </div>
                      {meta.lastActivityAt && (
                        <div>
                          <dt className="sr-only">Last activity</dt>
                          <dd className="font-semibold text-slate-700">
                            {timeAgo(meta.lastActivityAt)}
                          </dd>
                          <dd>last post</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent activity feed */}
      <section className="py-10 bg-white border-y border-cream-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Recent activity
              </h2>
              <p className="text-sm text-slate-600">
                Latest posts across every space.
              </p>
            </div>
            <Link
              href="/community/search?sort=latest"
              className="text-sm font-medium text-coral-600 hover:text-coral-700"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recent.items.map((t) => (
              <ThreadCard
                key={t.id}
                thread={t}
                bookmarked={userBookmarks.has(t.id)}
                showSpace
              />
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-slate-900 inline-flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-coral-500" />
            Community guidelines, in plain language
          </h2>
          <ul className="mt-5 space-y-3">
            {PRINCIPLES.map((p) => (
              <li
                key={p}
                className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed bg-white border border-cream-200 rounded-2xl px-4 py-3"
              >
                <span className="mt-0.5 inline-flex w-5 h-5 rounded-full bg-coral-100 text-coral-600 items-center justify-center text-xs font-bold">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Mods get notified within an hour of a flag. Harm happens slowly,
            then all at once — we&rsquo;d rather catch it slow.
          </p>
        </div>
      </section>
    </Shell>
  );
}
