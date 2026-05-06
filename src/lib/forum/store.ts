import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  emptyReactionCounts,
  REACTION_ORDER,
  SPACE_BY_ID,
  type AudienceTag,
  type Author,
  type Bookmark,
  type ContentNote,
  type Follow,
  type ForumStore,
  type ReactionEmoji,
  type Reply,
  type ReplyView,
  type SpaceId,
  type Thread,
  type ThreadView,
} from "./types";
import { findById, type SafeUser } from "@/lib/auth/users";
import { buildSeedReplies, SEED_USERS } from "./seed";

/**
 * File-backed forum store. Same atomic-write pattern as the user store.
 *
 * Concurrency: single-process is fine. For multi-process / high-load we'd
 * swap in a real database; the API surface here would stay the same.
 */

const DATA_DIR =
  process.env.SUPPORTNEST_DATA_DIR || path.join(process.cwd(), ".data");
const FORUM_FILE = path.join(DATA_DIR, "forum.json");

async function ensureSeeded(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FORUM_FILE);
    return;
  } catch {
    // doesn't exist; seed
  }
  const { threads, replies } = buildSeedReplies();
  const seed: ForumStore = {
    version: 1,
    threads,
    replies,
    bookmarks: [],
    follows: [],
    seedUsers: SEED_USERS,
  };
  await fs.writeFile(FORUM_FILE, JSON.stringify(seed, null, 2), { mode: 0o600 });
}

async function read(): Promise<ForumStore> {
  await ensureSeeded();
  const raw = await fs.readFile(FORUM_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1) return parsed as ForumStore;
  } catch {
    // fall through
  }
  const { threads, replies } = buildSeedReplies();
  return {
    version: 1,
    threads,
    replies,
    bookmarks: [],
    follows: [],
    seedUsers: SEED_USERS,
  };
}

async function write(store: ForumStore): Promise<void> {
  const tmp = FORUM_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), { mode: 0o600 });
  await fs.rename(tmp, FORUM_FILE);
}

// In-process write lock so concurrent server actions can't tear the JSON.
let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(() => fn());
  writeChain = next.catch(() => undefined);
  return next;
}

function dedupe<T>(items: T[]): T[] {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const x of items) {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}

function authorFor(store: ForumStore, id: string): Author | null {
  const seed = store.seedUsers.find((u) => u.id === id);
  if (seed) return seed;
  // Real users are looked up async by the view layer.
  return null;
}

function reactionCounts(reactions: { emoji: ReactionEmoji }[]) {
  const counts = emptyReactionCounts();
  for (const r of reactions) {
    if (REACTION_ORDER.includes(r.emoji)) counts[r.emoji] += 1;
  }
  return counts;
}

function totalReactions(counts: Record<ReactionEmoji, number>) {
  return REACTION_ORDER.reduce((a, k) => a + counts[k], 0);
}

async function hydrateAuthor(
  store: ForumStore,
  authorId: string,
  liveCache: Map<string, Author | null>
): Promise<Author | null> {
  if (liveCache.has(authorId)) return liveCache.get(authorId) ?? null;
  const seed = authorFor(store, authorId);
  if (seed) {
    liveCache.set(authorId, seed);
    return seed;
  }
  const u = await findById(authorId);
  const author = u ? safeUserToAuthor(u) : null;
  liveCache.set(authorId, author);
  return author;
}

function safeUserToAuthor(u: SafeUser): Author {
  const first = u.name.split(" ")[0];
  const last = u.name.split(" ").slice(1).join(" ");
  const handle =
    last
      ? `${first} ${last[0]}.`
      : first;
  return {
    id: u.id,
    displayName: u.name,
    handle,
    role: u.role,
  };
}

export type ThreadFilters = {
  spaceId?: SpaceId;
  audience?: AudienceTag;
  contentNote?: ContentNote;
  tag?: string;
  authorId?: string;
  bookmarkedBy?: string;
  q?: string;
  pinnedFirst?: boolean;
  sort?: "latest" | "newest" | "most-replies" | "most-reactions";
  limit?: number;
  offset?: number;
};

function score(t: Thread, replies: Reply[]) {
  return {
    replies: replies.filter((r) => r.threadId === t.id).length,
    reactions: t.reactions.length,
  };
}

export async function listThreads(
  filters: ThreadFilters = {}
): Promise<{ items: ThreadView[]; total: number }> {
  const store = await read();
  let items = store.threads.slice();

  if (filters.spaceId) items = items.filter((t) => t.spaceId === filters.spaceId);
  if (filters.audience)
    items = items.filter((t) => t.audienceTags.includes(filters.audience!));
  if (filters.contentNote)
    items = items.filter((t) => t.contentNotes.includes(filters.contentNote!));
  if (filters.tag) items = items.filter((t) => t.tags.includes(filters.tag!));
  if (filters.authorId)
    items = items.filter((t) => t.authorId === filters.authorId);
  if (filters.bookmarkedBy) {
    const ids = new Set(
      store.bookmarks
        .filter((b) => b.userId === filters.bookmarkedBy)
        .map((b) => b.threadId)
    );
    items = items.filter((t) => ids.has(t.id));
  }
  if (filters.q) {
    const needle = filters.q.toLowerCase();
    items = items.filter(
      (t) =>
        t.title.toLowerCase().includes(needle) ||
        t.body.toLowerCase().includes(needle) ||
        t.tags.some((tag) => tag.toLowerCase().includes(needle))
    );
  }

  const sort = filters.sort ?? "latest";
  items.sort((a, b) => {
    if (filters.pinnedFirst !== false) {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    }
    if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
    if (sort === "most-replies") {
      const sa = score(a, store.replies);
      const sb = score(b, store.replies);
      return sb.replies - sa.replies;
    }
    if (sort === "most-reactions") {
      return b.reactions.length - a.reactions.length;
    }
    return b.lastActivityAt.localeCompare(a.lastActivityAt);
  });

  const total = items.length;
  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 25;
  items = items.slice(offset, offset + limit);

  const cache = new Map<string, Author | null>();
  const enriched: ThreadView[] = await Promise.all(
    items.map(async (t) => {
      const replies = store.replies.filter((r) => r.threadId === t.id);
      const author = await hydrateAuthor(store, t.authorId, cache);
      const counts = reactionCounts(t.reactions);
      return {
        ...t,
        author,
        replyCount: replies.length,
        reactionCounts: counts,
        totalReactions: totalReactions(counts),
        lastReplyAt: replies
          .map((r) => r.createdAt)
          .sort()
          .at(-1),
        spaceName: SPACE_BY_ID[t.spaceId].name,
      };
    })
  );

  return { items: enriched, total };
}

export async function getThread(
  threadId: string
): Promise<ThreadView | null> {
  const store = await read();
  const t = store.threads.find((x) => x.id === threadId);
  if (!t) return null;
  const replies = store.replies.filter((r) => r.threadId === t.id);
  const cache = new Map<string, Author | null>();
  const author = await hydrateAuthor(store, t.authorId, cache);
  const counts = reactionCounts(t.reactions);
  return {
    ...t,
    author,
    replyCount: replies.length,
    reactionCounts: counts,
    totalReactions: totalReactions(counts),
    lastReplyAt: replies
      .map((r) => r.createdAt)
      .sort()
      .at(-1),
    spaceName: SPACE_BY_ID[t.spaceId].name,
  };
}

export async function getRepliesForThread(
  threadId: string
): Promise<ReplyView[]> {
  const store = await read();
  const replies = store.replies
    .filter((r) => r.threadId === threadId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const cache = new Map<string, Author | null>();
  return Promise.all(
    replies.map(async (r) => {
      const author = await hydrateAuthor(store, r.authorId, cache);
      const counts = reactionCounts(r.reactions);
      return {
        ...r,
        author,
        reactionCounts: counts,
        totalReactions: totalReactions(counts),
      };
    })
  );
}

export async function listTrendingTags(
  limit = 10
): Promise<{ tag: string; count: number }[]> {
  const store = await read();
  const counts = new Map<string, number>();
  for (const t of store.threads) {
    for (const tag of t.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function listSpaceStats(): Promise<
  Record<SpaceId, { threads: number; replies: number; lastActivityAt?: string }>
> {
  const store = await read();
  const acc: Record<string, { threads: number; replies: number; lastActivityAt?: string }> = {};
  for (const t of store.threads) {
    if (!acc[t.spaceId])
      acc[t.spaceId] = { threads: 0, replies: 0 };
    acc[t.spaceId].threads += 1;
    if (
      !acc[t.spaceId].lastActivityAt ||
      t.lastActivityAt > acc[t.spaceId].lastActivityAt!
    ) {
      acc[t.spaceId].lastActivityAt = t.lastActivityAt;
    }
  }
  for (const r of store.replies) {
    const t = store.threads.find((x) => x.id === r.threadId);
    if (!t) continue;
    if (!acc[t.spaceId]) acc[t.spaceId] = { threads: 0, replies: 0 };
    acc[t.spaceId].replies += 1;
  }
  return acc as Record<SpaceId, (typeof acc)[string]>;
}

// ---------- Mutations ----------

export type CreateThreadInput = {
  authorId: string;
  spaceId: SpaceId;
  title: string;
  body: string;
  tags?: string[];
  audienceTags?: AudienceTag[];
  contentNotes?: ContentNote[];
};

export async function createThread(
  input: CreateThreadInput
): Promise<Thread> {
  return withWriteLock(async () => {
    const store = await read();
    const now = new Date().toISOString();
    const thread: Thread = {
      id: `thr_${crypto.randomUUID()}`,
      spaceId: input.spaceId,
      authorId: input.authorId,
      title: input.title.trim(),
      body: input.body.trim(),
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
      tags: dedupe(
        (input.tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean)
      ).slice(0, 6),
      audienceTags: input.audienceTags ?? ["everyone"],
      contentNotes: input.contentNotes ?? [],
      isPinned: false,
      isLocked: false,
      viewCount: 0,
      reactions: [],
    };
    store.threads.push(thread);
    await write(store);
    return thread;
  });
}

export async function createReply(input: {
  authorId: string;
  threadId: string;
  body: string;
  parentReplyId?: string;
}): Promise<Reply> {
  return withWriteLock(async () => {
    const store = await read();
    const t = store.threads.find((x) => x.id === input.threadId);
    if (!t) throw new Error("THREAD_NOT_FOUND");
    if (t.isLocked) throw new Error("THREAD_LOCKED");
    const now = new Date().toISOString();
    const reply: Reply = {
      id: `rep_${crypto.randomUUID()}`,
      threadId: t.id,
      authorId: input.authorId,
      body: input.body.trim(),
      createdAt: now,
      parentReplyId: input.parentReplyId,
      reactions: [],
    };
    store.replies.push(reply);
    t.lastActivityAt = now;
    await write(store);
    return reply;
  });
}

export async function toggleReaction(input: {
  userId: string;
  targetType: "thread" | "reply";
  targetId: string;
  emoji: ReactionEmoji;
}): Promise<{ added: boolean }> {
  return withWriteLock(async () => {
    const store = await read();
    const target =
      input.targetType === "thread"
        ? store.threads.find((t) => t.id === input.targetId)
        : store.replies.find((r) => r.id === input.targetId);
    if (!target) throw new Error("TARGET_NOT_FOUND");
    const i = target.reactions.findIndex(
      (r) => r.userId === input.userId && r.emoji === input.emoji
    );
    let added = false;
    if (i >= 0) {
      target.reactions.splice(i, 1);
    } else {
      target.reactions.push({ userId: input.userId, emoji: input.emoji });
      added = true;
    }
    await write(store);
    return { added };
  });
}

export async function toggleBookmark(input: {
  userId: string;
  threadId: string;
}): Promise<{ added: boolean }> {
  return withWriteLock(async () => {
    const store = await read();
    const i = store.bookmarks.findIndex(
      (b) => b.userId === input.userId && b.threadId === input.threadId
    );
    let added = false;
    if (i >= 0) {
      store.bookmarks.splice(i, 1);
    } else {
      store.bookmarks.push({
        userId: input.userId,
        threadId: input.threadId,
        createdAt: new Date().toISOString(),
      });
      added = true;
    }
    await write(store);
    return { added };
  });
}

export async function toggleFollow(input: {
  userId: string;
  threadId: string;
}): Promise<{ added: boolean }> {
  return withWriteLock(async () => {
    const store = await read();
    const i = store.follows.findIndex(
      (f) => f.userId === input.userId && f.threadId === input.threadId
    );
    let added = false;
    if (i >= 0) {
      store.follows.splice(i, 1);
    } else {
      store.follows.push({
        userId: input.userId,
        threadId: input.threadId,
        createdAt: new Date().toISOString(),
      });
      added = true;
    }
    await write(store);
    return { added };
  });
}

export async function isBookmarked(userId: string, threadId: string) {
  const store = await read();
  return store.bookmarks.some(
    (b) => b.userId === userId && b.threadId === threadId
  );
}

export async function isFollowing(userId: string, threadId: string) {
  const store = await read();
  return store.follows.some(
    (f) => f.userId === userId && f.threadId === threadId
  );
}

export async function reactionsForUser(
  userId: string,
  targetType: "thread" | "reply",
  targetId: string
): Promise<Set<ReactionEmoji>> {
  const store = await read();
  const target =
    targetType === "thread"
      ? store.threads.find((t) => t.id === targetId)
      : store.replies.find((r) => r.id === targetId);
  if (!target) return new Set();
  return new Set(
    target.reactions
      .filter((r) => r.userId === userId)
      .map((r) => r.emoji)
  );
}

export async function bookmarksForUser(userId: string): Promise<Bookmark[]> {
  const store = await read();
  return store.bookmarks
    .filter((b) => b.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function followsForUser(userId: string): Promise<Follow[]> {
  const store = await read();
  return store.follows.filter((f) => f.userId === userId);
}

export async function repliesByUser(
  userId: string,
  limit = 25
): Promise<ReplyView[]> {
  const store = await read();
  const mine = store.replies
    .filter((r) => r.authorId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
  const cache = new Map<string, Author | null>();
  return Promise.all(
    mine.map(async (r) => {
      const author = await hydrateAuthor(store, r.authorId, cache);
      const counts = reactionCounts(r.reactions);
      return {
        ...r,
        author,
        reactionCounts: counts,
        totalReactions: totalReactions(counts),
      };
    })
  );
}

export async function incrementViewCount(threadId: string) {
  return withWriteLock(async () => {
    const store = await read();
    const t = store.threads.find((x) => x.id === threadId);
    if (!t) return;
    t.viewCount += 1;
    await write(store);
  });
}

// Moderation
export async function setPinned(threadId: string, pinned: boolean) {
  return withWriteLock(async () => {
    const store = await read();
    const t = store.threads.find((x) => x.id === threadId);
    if (!t) throw new Error("THREAD_NOT_FOUND");
    t.isPinned = pinned;
    await write(store);
  });
}

export async function setLocked(threadId: string, locked: boolean) {
  return withWriteLock(async () => {
    const store = await read();
    const t = store.threads.find((x) => x.id === threadId);
    if (!t) throw new Error("THREAD_NOT_FOUND");
    t.isLocked = locked;
    await write(store);
  });
}

export async function deleteThread(threadId: string, requesterId: string) {
  return withWriteLock(async () => {
    const store = await read();
    const t = store.threads.find((x) => x.id === threadId);
    if (!t) return;
    if (t.authorId !== requesterId) throw new Error("FORBIDDEN");
    store.threads = store.threads.filter((x) => x.id !== threadId);
    store.replies = store.replies.filter((r) => r.threadId !== threadId);
    store.bookmarks = store.bookmarks.filter((b) => b.threadId !== threadId);
    store.follows = store.follows.filter((f) => f.threadId !== threadId);
    await write(store);
  });
}

export async function deleteReply(replyId: string, requesterId: string) {
  return withWriteLock(async () => {
    const store = await read();
    const r = store.replies.find((x) => x.id === replyId);
    if (!r) return;
    if (r.authorId !== requesterId) throw new Error("FORBIDDEN");
    store.replies = store.replies.filter((x) => x.id !== replyId);
    await write(store);
  });
}
