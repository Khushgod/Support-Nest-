import Link from "next/link";
import { Bookmark, MessageSquare, Bell, FileText, ChevronLeft } from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import ThreadCard from "@/components/forum/ThreadCard";
import Body from "@/components/forum/Body";
import { requireUser } from "@/lib/auth/dal";
import {
  bookmarksForUser,
  followsForUser,
  listThreads,
  repliesByUser,
  getThread,
} from "@/lib/forum/store";
import { snippet, timeAgo } from "@/lib/forum/format";
import {
  REACTION_LABELS,
  REACTION_ORDER,
  type ReactionEmoji,
} from "@/lib/forum/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your community activity | SupportNest",
};

type Tab = "bookmarks" | "threads" | "replies" | "follows";
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "threads", label: "Your threads", icon: FileText },
  { id: "replies", label: "Your replies", icon: MessageSquare },
  { id: "follows", label: "Following", icon: Bell },
];

function asTab(v: string | undefined): Tab {
  return v === "threads" || v === "replies" || v === "follows"
    ? v
    : "bookmarks";
}

export default async function CommunityMePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const tab = asTab(sp.tab);

  const [bookmarks, follows, myReplies, myThreads] = await Promise.all([
    bookmarksForUser(user.id),
    followsForUser(user.id),
    repliesByUser(user.id, 50),
    listThreads({ authorId: user.id, sort: "newest", limit: 50 }),
  ]);

  // Hydrate bookmarked threads (and follows) by joining against the store.
  const bookmarkedThreads = await Promise.all(
    bookmarks.map((b) => getThread(b.threadId))
  );
  const followedThreads = await Promise.all(
    follows.map((f) => getThread(f.threadId))
  );

  // For replies we need the parent thread to render the link with the right
  // space slug. Fetch in parallel and key by threadId for fast lookup.
  const replyThreadEntries = await Promise.all(
    Array.from(new Set(myReplies.map((r) => r.threadId))).map(
      async (id) => [id, await getThread(id)] as const
    )
  );
  const replyThreads = new Map(replyThreadEntries);

  // Bookmark IDs for ThreadCard's "Bookmarked" badge.
  const bookmarkSet = new Set(bookmarks.map((b) => b.threadId));

  const tabHref = (id: Tab) =>
    id === "bookmarks" ? "/community/me" : `/community/me?tab=${id}`;

  return (
    <Shell>
      <section className="py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-coral-600 mb-3"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to community
          </Link>

          <div className="rounded-3xl border border-cream-200 bg-white p-6 sm:p-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Your activity
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Signed in as{" "}
              <span className="font-medium text-slate-800">{user.email}</span>.
              Everything here is yours; nobody else can see this view.
            </p>

            <nav
              aria-label="Activity sections"
              className="mt-5 flex items-center gap-1.5 overflow-x-auto"
            >
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                const count =
                  id === "bookmarks"
                    ? bookmarks.length
                    : id === "threads"
                      ? myThreads.total
                      : id === "replies"
                        ? myReplies.length
                        : follows.length;
                return (
                  <Link
                    key={id}
                    href={tabHref(id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition whitespace-nowrap ${active ? "bg-coral-500 border-coral-500 text-white" : "bg-white border-cream-200 text-slate-700 hover:bg-cream-50"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    <span
                      className={`tabular-nums text-[10px] font-semibold ${active ? "text-white/90" : "text-slate-500"}`}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {tab === "bookmarks" && (
            <PaneList
              empty="Nothing bookmarked yet. Tap the bookmark icon on any thread to save it for later."
              items={bookmarkedThreads
                .filter(<T,>(t: T | null): t is T => t !== null)
                .map((t) => (
                  <ThreadCard
                    key={t.id}
                    thread={t}
                    bookmarked={bookmarkSet.has(t.id)}
                    showSpace
                  />
                ))}
            />
          )}

          {tab === "threads" && (
            <PaneList
              empty="You haven't posted yet — the community welcomes you whenever you're ready."
              cta={{ href: "/community/new", label: "Start a thread" }}
              items={myThreads.items.map((t) => (
                <ThreadCard
                  key={t.id}
                  thread={t}
                  bookmarked={bookmarkSet.has(t.id)}
                  showSpace
                />
              ))}
            />
          )}

          {tab === "replies" && (
            <PaneList
              empty="You haven't replied to anything yet."
              items={myReplies.map((r) => {
                const parent = replyThreads.get(r.threadId) ?? null;
                const href = parent
                  ? `/community/${parent.spaceId}/${parent.id}#r-${r.id}`
                  : "/community";
                return (
                  <article
                    key={r.id}
                    className="rounded-2xl border border-cream-200 bg-white p-5"
                  >
                    <header className="text-[11px] text-slate-500 mb-2">
                      Replied {timeAgo(r.createdAt)}
                      {parent && (
                        <>
                          {" "}· in{" "}
                          <Link
                            href={href}
                            className="font-medium text-coral-600 hover:text-coral-700"
                          >
                            {parent.title}
                          </Link>
                        </>
                      )}
                    </header>
                    <Body text={snippet(r.body, 600)} />
                    {r.totalReactions > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                        {REACTION_ORDER.filter(
                          (e: ReactionEmoji) => r.reactionCounts[e] > 0
                        ).map((e: ReactionEmoji) => (
                          <span
                            key={e}
                            className="inline-flex items-center gap-0.5"
                          >
                            <span aria-hidden>{REACTION_LABELS[e].glyph}</span>
                            {r.reactionCounts[e]}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            />
          )}

          {tab === "follows" && (
            <PaneList
              empty="Not following any threads yet. Tap the bell icon on a thread to get notified about new replies."
              items={followedThreads
                .filter(<T,>(t: T | null): t is T => t !== null)
                .map((t) => (
                  <ThreadCard
                    key={t.id}
                    thread={t}
                    bookmarked={bookmarkSet.has(t.id)}
                    showSpace
                  />
                ))}
            />
          )}
        </div>
      </section>
    </Shell>
  );
}

function PaneList({
  items,
  empty,
  cta,
}: {
  items: React.ReactNode[];
  empty: string;
  cta?: { href: string; label: string };
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-600">{empty}</p>
        {cta && (
          <Link
            href={cta.href}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold"
          >
            {cta.label}
          </Link>
        )}
      </div>
    );
  }
  return <div className="space-y-4">{items}</div>;
}
