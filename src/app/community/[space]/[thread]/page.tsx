import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock, Pin, Eye, MessageCircle } from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import Body from "@/components/forum/Body";
import ReactionBar from "@/components/forum/ReactionBar";
import ReplyCard from "@/components/forum/ReplyCard";
import ReplyComposer from "@/components/forum/ReplyComposer";
import ThreadActions from "@/components/forum/ThreadActions";
import {
  AudienceChip,
  ContentNoteChip,
  TagChip,
} from "@/components/forum/AudienceChips";
import { timeAgo } from "@/lib/forum/format";
import { getCurrentUser } from "@/lib/auth/dal";
import {
  getRepliesForThread,
  getThread,
  incrementViewCount,
  isBookmarked,
  isFollowing,
  reactionsForUser,
} from "@/lib/forum/store";
import {
  REACTION_LABELS,
  REACTION_ORDER,
  SPACE_BY_ID,
  spaceIdFromParam,
  type ReactionEmoji,
} from "@/lib/forum/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ space: string; thread: string }>;
}) {
  const { thread: tid } = await params;
  const t = await getThread(tid);
  if (!t) return { title: "Thread | SupportNest" };
  return {
    title: `${t.title} | SupportNest community`,
    description: t.body.slice(0, 160),
  };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ space: string; thread: string }>;
}) {
  const { space, thread: tid } = await params;
  const spaceId = spaceIdFromParam(space);
  const meta = spaceId ? SPACE_BY_ID[spaceId] : undefined;
  if (!meta) notFound();
  const t = await getThread(tid);
  if (!t || t.spaceId !== meta.id) notFound();

  // Best-effort view counter; not critical if it races.
  void incrementViewCount(t.id).catch(() => undefined);

  const user = await getCurrentUser();
  const [replies, threadReactions, bookmarked, following] = await Promise.all([
    getRepliesForThread(t.id),
    user
      ? reactionsForUser(user.id, "thread", t.id)
      : Promise.resolve(new Set<ReactionEmoji>()),
    user ? isBookmarked(user.id, t.id) : Promise.resolve(false),
    user ? isFollowing(user.id, t.id) : Promise.resolve(false),
  ]);

  // Per-reply user reactions, fetched in parallel.
  const replyReactionMap = new Map<string, ReactionEmoji[]>();
  if (user) {
    const sets = await Promise.all(
      replies.map((r) => reactionsForUser(user.id, "reply", r.id))
    );
    replies.forEach((r, i) => replyReactionMap.set(r.id, Array.from(sets[i])));
  }

  const isOwner = user?.id === t.authorId;
  const returnTo = `/community/${meta.id}/${t.id}`;

  return (
    <Shell>
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-500 mb-4"
          >
            <Link href="/community" className="hover:text-coral-600">
              Community
            </Link>
            <span>›</span>
            <Link
              href={`/community/${meta.id}`}
              className="hover:text-coral-600"
            >
              {meta.name}
            </Link>
          </nav>

          <article className="rounded-3xl border border-cream-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {t.isPinned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sun-100 text-sun-800">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              )}
              {t.isLocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-slate-700">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
              {t.audienceTags.map((a) => (
                <AudienceChip key={a} tag={a} />
              ))}
              {t.contentNotes.map((c) => (
                <ContentNoteChip key={c} note={c} />
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {t.title}
            </h1>

            <header className="mt-4 flex items-center gap-3 flex-wrap text-xs text-slate-500">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-300 to-lavender-300" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {t.author?.handle ?? "former member"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {timeAgo(t.createdAt)}
                  </div>
                </div>
              </div>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {t.viewCount} view{t.viewCount === 1 ? "" : "s"}
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {t.replyCount} repl{t.replyCount === 1 ? "y" : "ies"}
              </span>
            </header>

            <div className="mt-6">
              <Body text={t.body} />
            </div>

            {t.tags.length > 0 && (
              <div className="mt-6 flex items-center gap-1.5 flex-wrap">
                {t.tags.map((tag) => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    href={`/community/search?tag=${encodeURIComponent(tag)}`}
                  />
                ))}
              </div>
            )}

            <footer className="mt-7 flex items-center justify-between gap-3 flex-wrap pt-5 border-t border-cream-100">
              <ReactionBar
                targetType="thread"
                targetId={t.id}
                counts={t.reactionCounts}
                mine={Array.from(threadReactions)}
                total={t.totalReactions}
                returnTo={returnTo}
                signedIn={!!user}
              />
              <ThreadActions
                threadId={t.id}
                bookmarked={bookmarked}
                following={following}
                isPinned={t.isPinned}
                isLocked={t.isLocked}
                isOwnerOrMod={isOwner}
                signedIn={!!user}
                returnTo={returnTo}
                variant="row"
              />
            </footer>
          </article>

          {/* Replies */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {replies.length === 0
                ? "Be the first to reply"
                : `${replies.length} repl${replies.length === 1 ? "y" : "ies"}`}
            </h2>

            {replies.length > 0 && (
              <div className="space-y-4 mb-6">
                {replies.map((r) => (
                  <ReplyCard
                    key={r.id}
                    reply={r}
                    myReactions={replyReactionMap.get(r.id) ?? []}
                    isOwn={!!user && r.authorId === user.id}
                    signedIn={!!user}
                    threadId={t.id}
                    returnTo={returnTo}
                    threadLocked={t.isLocked}
                  />
                ))}
              </div>
            )}

            {!t.isLocked && (
              <div>
                <ReplyComposer
                  threadId={t.id}
                  signedIn={!!user}
                  loginNext={returnTo}
                />
              </div>
            )}
            {t.isLocked && (
              <div className="rounded-2xl border border-cream-200 bg-cream-50/50 p-4 text-sm text-slate-600">
                <Lock className="w-3.5 h-3.5 inline-block mr-1.5" />
                This thread is locked. Existing replies are still visible.
              </div>
            )}
          </section>

          {/* Reaction legend (helps newcomers know what each emoji means) */}
          <aside className="mt-10 rounded-2xl border border-cream-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Reactions, in plain language
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Use them generously. They&rsquo;re how we say &ldquo;heard&rdquo;
              without piling on.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REACTION_ORDER.map((e: ReactionEmoji) => {
                const meta = REACTION_LABELS[e];
                return (
                  <li
                    key={e}
                    className="flex items-center gap-2 text-xs text-slate-700"
                  >
                    <span aria-hidden className="text-base">
                      {meta.glyph}
                    </span>
                    <span>{meta.label}</span>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
