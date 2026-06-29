import "server-only";

import crypto from "node:crypto";
import db from "@/lib/db";
import {
  emptyReactionCounts,
  REACTION_ORDER,
  SPACE_BY_ID,
  type AudienceTag,
  type Author,
  type Bookmark,
  type ContentNote,
  type Follow,
  type ReactionEmoji,
  type Reply,
  type ReplyView,
  type SpaceId,
  type Thread,
  type ThreadView,
} from "./types";
import { findById, type SafeUser } from "@/lib/auth/users";
import { seedDatabase } from "./seed-db";
import { splitForumTags } from "./format";

try {
  // Seeding is idempotent: every insert uses INSERT OR IGNORE against stable
  // ids, so we run it on every startup. This keeps the database in sync as new
  // seed threads are added over time, without overwriting existing rows or any
  // user-created content.
  seedDatabase(db);
} catch (err: unknown) {
  if (
    err instanceof Error &&
    err.message.includes("SQLITE_BUSY")
  ) {
    // During concurrent build worker startup, one worker may hold the write
    // lock while another initializes. If the database is already being
    // populated, proceed and let the next worker read the seeded data.
  } else {
    throw err;
  }
}

type ThreadRow = {
  id: string;
  space_id: string;
  author_id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  is_pinned: number;
  is_locked: number;
  view_count: number;
  seed_source: string | null;
  seed_theme: string | null;
  seed_rank: number | null;
  seed_anchor_type: string | null;
  seed_timeliness: string | null;
  seed_community_use: string | null;
};

type ReplyRow = {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  created_at: string;
  parent_reply_id: string | null;
};

type ReactionRow = { user_id: string; emoji: string };

function rowToThread(row: ThreadRow): Thread {
  const tags = (
    db
      .prepare("SELECT tag FROM thread_tags WHERE thread_id = ?")
      .all(row.id) as { tag: string }[]
  ).map((r) => r.tag);
  const audienceTags = (
    db
      .prepare(
        "SELECT audience_tag FROM thread_audience_tags WHERE thread_id = ?"
      )
      .all(row.id) as { audience_tag: string }[]
  ).map((r) => r.audience_tag as AudienceTag);
  const contentNotes = (
    db
      .prepare(
        "SELECT content_note FROM thread_content_notes WHERE thread_id = ?"
      )
      .all(row.id) as { content_note: string }[]
  ).map((r) => r.content_note as ContentNote);
  const reactions = (
    db
      .prepare("SELECT user_id, emoji FROM thread_reactions WHERE thread_id = ?")
      .all(row.id) as ReactionRow[]
  ).map((r) => ({ userId: r.user_id, emoji: r.emoji as ReactionEmoji }));

  return {
    id: row.id,
    spaceId: row.space_id as SpaceId,
    authorId: row.author_id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastActivityAt: row.last_activity_at,
    isPinned: row.is_pinned === 1,
    isLocked: row.is_locked === 1,
    viewCount: row.view_count,
    tags,
    audienceTags,
    contentNotes,
    reactions,
    seedMetadata: row.seed_source
      ? {
          source: row.seed_source as "question-response-csv",
          theme: row.seed_theme ?? "",
          rank: row.seed_rank ?? 0,
          anchorThreadType: row.seed_anchor_type ?? "",
          timeliness: row.seed_timeliness ?? "",
          communityUse: row.seed_community_use ?? "",
        }
      : undefined,
  };
}

function rowToReply(row: ReplyRow): Reply {
  const reactions = (
    db
      .prepare("SELECT user_id, emoji FROM reply_reactions WHERE reply_id = ?")
      .all(row.id) as ReactionRow[]
  ).map((r) => ({ userId: r.user_id, emoji: r.emoji as ReactionEmoji }));

  return {
    id: row.id,
    threadId: row.thread_id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
    parentReplyId: row.parent_reply_id ?? undefined,
    reactions,
  };
}

function safeUserToAuthor(u: SafeUser): Author {
  const first = u.name.split(" ")[0];
  const last = u.name.split(" ").slice(1).join(" ");
  const handle = last ? `${first} ${last[0]}.` : first;
  return { id: u.id, displayName: u.name, handle, role: u.role };
}

async function hydrateAuthor(
  authorId: string,
  cache: Map<string, Author | null>
): Promise<Author | null> {
  if (cache.has(authorId)) return cache.get(authorId) ?? null;

  const seed = db
    .prepare("SELECT * FROM seed_users WHERE id = ?")
    .get(authorId) as
    | { id: string; display_name: string; handle: string; role: string }
    | undefined;
  if (seed) {
    const author: Author = {
      id: seed.id,
      displayName: seed.display_name,
      handle: seed.handle,
      role: seed.role,
    };
    cache.set(authorId, author);
    return author;
  }

  const u = await findById(authorId);
  const author = u ? safeUserToAuthor(u) : null;
  cache.set(authorId, author);
  return author;
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

export async function listThreads(
  filters: ThreadFilters = {}
): Promise<{ items: ThreadView[]; total: number }> {
  let rows = db.prepare("SELECT * FROM threads").all() as ThreadRow[];

  if (filters.spaceId) {
    rows = rows.filter((r) => r.space_id === filters.spaceId);
  }

  if (filters.audience) {
    rows = rows.filter(
      (r) =>
        db
          .prepare(
            "SELECT 1 FROM thread_audience_tags WHERE thread_id = ? AND audience_tag = ?"
          )
          .get(r.id, filters.audience) != null
    );
  }

  if (filters.contentNote) {
    rows = rows.filter(
      (r) =>
        db
          .prepare(
            "SELECT 1 FROM thread_content_notes WHERE thread_id = ? AND content_note = ?"
          )
          .get(r.id, filters.contentNote) != null
    );
  }

  if (filters.tag) {
    rows = rows.filter(
      (r) =>
        db
          .prepare("SELECT 1 FROM thread_tags WHERE thread_id = ? AND tag = ?")
          .get(r.id, filters.tag) != null
    );
  }

  if (filters.authorId) {
    rows = rows.filter((r) => r.author_id === filters.authorId);
  }

  if (filters.bookmarkedBy) {
    const bookmarked = new Set(
      (
        db
          .prepare("SELECT thread_id FROM bookmarks WHERE user_id = ?")
          .all(filters.bookmarkedBy) as { thread_id: string }[]
      ).map((b) => b.thread_id)
    );
    rows = rows.filter((r) => bookmarked.has(r.id));
  }

  if (filters.q) {
    const needle = filters.q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        r.body.toLowerCase().includes(needle) ||
        db
          .prepare(
            "SELECT 1 FROM thread_tags WHERE thread_id = ? AND LOWER(tag) LIKE ?"
          )
          .get(r.id, `%${needle}%`) != null ||
        [
          r.seed_theme,
          r.seed_anchor_type,
          r.seed_timeliness,
          r.seed_community_use,
        ].some((value) => value?.toLowerCase().includes(needle))
    );
  }

  const sort = filters.sort ?? "latest";
  rows.sort((a, b) => {
    if (filters.pinnedFirst !== false && a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }
    if (sort === "newest") return b.created_at.localeCompare(a.created_at);
    if (sort === "most-replies") {
      const ra = (
        db
          .prepare("SELECT COUNT(*) as c FROM replies WHERE thread_id = ?")
          .get(a.id) as { c: number }
      ).c;
      const rb = (
        db
          .prepare("SELECT COUNT(*) as c FROM replies WHERE thread_id = ?")
          .get(b.id) as { c: number }
      ).c;
      return rb - ra;
    }
    if (sort === "most-reactions") {
      const ra = (
        db
          .prepare(
            "SELECT COUNT(*) as c FROM thread_reactions WHERE thread_id = ?"
          )
          .get(a.id) as { c: number }
      ).c;
      const rb = (
        db
          .prepare(
            "SELECT COUNT(*) as c FROM thread_reactions WHERE thread_id = ?"
          )
          .get(b.id) as { c: number }
      ).c;
      return rb - ra;
    }
    return b.last_activity_at.localeCompare(a.last_activity_at);
  });

  const total = rows.length;
  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 25;
  const page = rows.slice(offset, offset + limit);
  const cache = new Map<string, Author | null>();

  const items: ThreadView[] = await Promise.all(
    page.map(async (row) => {
      const t = rowToThread(row);
      const replyCount = (
        db
          .prepare("SELECT COUNT(*) as c FROM replies WHERE thread_id = ?")
          .get(t.id) as { c: number }
      ).c;
      const lastReplyAt =
        (
          db
            .prepare("SELECT MAX(created_at) as la FROM replies WHERE thread_id = ?")
            .get(t.id) as { la: string | null }
        ).la ?? undefined;
      const author = await hydrateAuthor(t.authorId, cache);
      const counts = reactionCounts(t.reactions);
      return {
        ...t,
        author,
        replyCount,
        reactionCounts: counts,
        totalReactions: totalReactions(counts),
        lastReplyAt,
        spaceName: SPACE_BY_ID[t.spaceId].name,
      };
    })
  );

  return { items, total };
}

export async function getThread(threadId: string): Promise<ThreadView | null> {
  const row = db
    .prepare("SELECT * FROM threads WHERE id = ?")
    .get(threadId) as ThreadRow | undefined;
  if (!row) return null;

  const t = rowToThread(row);
  const replyCount = (
    db
      .prepare("SELECT COUNT(*) as c FROM replies WHERE thread_id = ?")
      .get(t.id) as { c: number }
  ).c;
  const lastReplyAt =
    (
      db
        .prepare("SELECT MAX(created_at) as la FROM replies WHERE thread_id = ?")
        .get(t.id) as { la: string | null }
    ).la ?? undefined;
  const cache = new Map<string, Author | null>();
  const author = await hydrateAuthor(t.authorId, cache);
  const counts = reactionCounts(t.reactions);

  return {
    ...t,
    author,
    replyCount,
    reactionCounts: counts,
    totalReactions: totalReactions(counts),
    lastReplyAt,
    spaceName: SPACE_BY_ID[t.spaceId].name,
  };
}

export async function getRepliesForThread(
  threadId: string
): Promise<ReplyView[]> {
  const rows = db
    .prepare("SELECT * FROM replies WHERE thread_id = ? ORDER BY created_at ASC")
    .all(threadId) as ReplyRow[];
  const cache = new Map<string, Author | null>();

  return Promise.all(
    rows.map(async (row) => {
      const r = rowToReply(row);
      const author = await hydrateAuthor(r.authorId, cache);
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
  return db
    .prepare(
      `SELECT tag, COUNT(*) as count
       FROM thread_tags
       GROUP BY tag
       ORDER BY count DESC
       LIMIT ?`
    )
    .all(limit) as { tag: string; count: number }[];
}

export async function listSpaceStats(): Promise<
  Record<SpaceId, { threads: number; replies: number; lastActivityAt?: string }>
> {
  const threadStats = db
    .prepare(
      `SELECT space_id, COUNT(*) as threads, MAX(last_activity_at) as lastActivityAt
       FROM threads
       GROUP BY space_id`
    )
    .all() as {
    space_id: string;
    threads: number;
    lastActivityAt: string | null;
  }[];
  const replyStats = db
    .prepare(
      `SELECT t.space_id, COUNT(r.id) as replies
       FROM replies r
       JOIN threads t ON t.id = r.thread_id
       GROUP BY t.space_id`
    )
    .all() as { space_id: string; replies: number }[];

  const acc: Record<
    string,
    { threads: number; replies: number; lastActivityAt?: string }
  > = {};
  for (const row of threadStats) {
    acc[row.space_id] = {
      threads: row.threads,
      replies: 0,
      lastActivityAt: row.lastActivityAt ?? undefined,
    };
  }
  for (const row of replyStats) {
    if (acc[row.space_id]) acc[row.space_id].replies = row.replies;
  }

  return acc as Record<SpaceId, (typeof acc)[string]>;
}

export type CreateThreadInput = {
  authorId: string;
  spaceId: SpaceId;
  title: string;
  body: string;
  tags?: string[];
  audienceTags?: AudienceTag[];
  contentNotes?: ContentNote[];
};

export async function createThread(input: CreateThreadInput): Promise<Thread> {
  const now = new Date().toISOString();
  const id = `thr_${crypto.randomUUID()}`;
  const tags = splitForumTags(input.tags ?? [], 6);
  const audienceTags = input.audienceTags ?? ["everyone"];
  const contentNotes = input.contentNotes ?? [];

  db.transaction(() => {
    db.prepare(
      `INSERT INTO threads
        (id, space_id, author_id, title, body, created_at, updated_at,
         last_activity_at, is_pinned, is_locked, view_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)`
    ).run(
      id,
      input.spaceId,
      input.authorId,
      input.title.trim(),
      input.body.trim(),
      now,
      now,
      now
    );
    for (const tag of tags) {
      db.prepare(
        "INSERT OR IGNORE INTO thread_tags (thread_id, tag) VALUES (?, ?)"
      ).run(id, tag);
    }
    for (const at of audienceTags) {
      db.prepare(
        `INSERT OR IGNORE INTO thread_audience_tags (thread_id, audience_tag)
         VALUES (?, ?)`
      ).run(id, at);
    }
    for (const cn of contentNotes) {
      db.prepare(
        `INSERT OR IGNORE INTO thread_content_notes (thread_id, content_note)
         VALUES (?, ?)`
      ).run(id, cn);
    }
  })();

  return {
    id,
    spaceId: input.spaceId,
    authorId: input.authorId,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
    tags,
    audienceTags,
    contentNotes,
    isPinned: false,
    isLocked: false,
    viewCount: 0,
    reactions: [],
  };
}

export async function createReply(input: {
  authorId: string;
  threadId: string;
  body: string;
  parentReplyId?: string;
}): Promise<Reply> {
  const t = db
    .prepare("SELECT id, is_locked FROM threads WHERE id = ?")
    .get(input.threadId) as { id: string; is_locked: number } | undefined;
  if (!t) throw new Error("THREAD_NOT_FOUND");
  if (t.is_locked) throw new Error("THREAD_LOCKED");

  const now = new Date().toISOString();
  const id = `rep_${crypto.randomUUID()}`;

  db.transaction(() => {
    db.prepare(
      `INSERT INTO replies
        (id, thread_id, author_id, body, created_at, parent_reply_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      input.threadId,
      input.authorId,
      input.body.trim(),
      now,
      input.parentReplyId ?? null
    );
    db.prepare("UPDATE threads SET last_activity_at = ? WHERE id = ?").run(
      now,
      input.threadId
    );
  })();

  return {
    id,
    threadId: input.threadId,
    authorId: input.authorId,
    body: input.body.trim(),
    createdAt: now,
    parentReplyId: input.parentReplyId,
    reactions: [],
  };
}

export async function toggleReaction(input: {
  userId: string;
  targetType: "thread" | "reply";
  targetId: string;
  emoji: ReactionEmoji;
}): Promise<{ added: boolean }> {
  if (input.targetType === "thread") {
    const target = db
      .prepare("SELECT 1 FROM threads WHERE id = ?")
      .get(input.targetId);
    if (!target) throw new Error("TARGET_NOT_FOUND");

    const exists = db
      .prepare(
        `SELECT 1 FROM thread_reactions
         WHERE thread_id = ? AND user_id = ? AND emoji = ?`
      )
      .get(input.targetId, input.userId, input.emoji);
    if (exists) {
      db.prepare(
        `DELETE FROM thread_reactions
         WHERE thread_id = ? AND user_id = ? AND emoji = ?`
      ).run(input.targetId, input.userId, input.emoji);
      return { added: false };
    }
    db.prepare(
      `INSERT INTO thread_reactions (thread_id, user_id, emoji)
       VALUES (?, ?, ?)`
    ).run(input.targetId, input.userId, input.emoji);
    return { added: true };
  }

  const target = db
    .prepare("SELECT 1 FROM replies WHERE id = ?")
    .get(input.targetId);
  if (!target) throw new Error("TARGET_NOT_FOUND");

  const exists = db
    .prepare(
      `SELECT 1 FROM reply_reactions
       WHERE reply_id = ? AND user_id = ? AND emoji = ?`
    )
    .get(input.targetId, input.userId, input.emoji);
  if (exists) {
    db.prepare(
      `DELETE FROM reply_reactions
       WHERE reply_id = ? AND user_id = ? AND emoji = ?`
    ).run(input.targetId, input.userId, input.emoji);
    return { added: false };
  }
  db.prepare(
    `INSERT INTO reply_reactions (reply_id, user_id, emoji)
     VALUES (?, ?, ?)`
  ).run(input.targetId, input.userId, input.emoji);
  return { added: true };
}

export async function toggleBookmark(input: {
  userId: string;
  threadId: string;
}): Promise<{ added: boolean }> {
  const exists = db
    .prepare("SELECT 1 FROM bookmarks WHERE user_id = ? AND thread_id = ?")
    .get(input.userId, input.threadId);
  if (exists) {
    db.prepare("DELETE FROM bookmarks WHERE user_id = ? AND thread_id = ?").run(
      input.userId,
      input.threadId
    );
    return { added: false };
  }
  db.prepare(
    "INSERT INTO bookmarks (user_id, thread_id, created_at) VALUES (?, ?, ?)"
  ).run(input.userId, input.threadId, new Date().toISOString());
  return { added: true };
}

export async function toggleFollow(input: {
  userId: string;
  threadId: string;
}): Promise<{ added: boolean }> {
  const exists = db
    .prepare("SELECT 1 FROM follows WHERE user_id = ? AND thread_id = ?")
    .get(input.userId, input.threadId);
  if (exists) {
    db.prepare("DELETE FROM follows WHERE user_id = ? AND thread_id = ?").run(
      input.userId,
      input.threadId
    );
    return { added: false };
  }
  db.prepare(
    "INSERT INTO follows (user_id, thread_id, created_at) VALUES (?, ?, ?)"
  ).run(input.userId, input.threadId, new Date().toISOString());
  return { added: true };
}

export async function isBookmarked(userId: string, threadId: string) {
  return (
    db
      .prepare("SELECT 1 FROM bookmarks WHERE user_id = ? AND thread_id = ?")
      .get(userId, threadId) != null
  );
}

export async function isFollowing(userId: string, threadId: string) {
  return (
    db
      .prepare("SELECT 1 FROM follows WHERE user_id = ? AND thread_id = ?")
      .get(userId, threadId) != null
  );
}

export async function reactionsForUser(
  userId: string,
  targetType: "thread" | "reply",
  targetId: string
): Promise<Set<ReactionEmoji>> {
  const rows =
    targetType === "thread"
      ? (db
          .prepare(
            "SELECT emoji FROM thread_reactions WHERE thread_id = ? AND user_id = ?"
          )
          .all(targetId, userId) as { emoji: string }[])
      : (db
          .prepare(
            "SELECT emoji FROM reply_reactions WHERE reply_id = ? AND user_id = ?"
          )
          .all(targetId, userId) as { emoji: string }[]);
  return new Set(rows.map((r) => r.emoji as ReactionEmoji));
}

export async function bookmarksForUser(userId: string): Promise<Bookmark[]> {
  return (
    db
      .prepare(
        `SELECT user_id, thread_id, created_at
         FROM bookmarks
         WHERE user_id = ?
         ORDER BY created_at DESC`
      )
      .all(userId) as {
      user_id: string;
      thread_id: string;
      created_at: string;
    }[]
  ).map((r) => ({
    userId: r.user_id,
    threadId: r.thread_id,
    createdAt: r.created_at,
  }));
}

export async function followsForUser(userId: string): Promise<Follow[]> {
  return (
    db
      .prepare("SELECT user_id, thread_id, created_at FROM follows WHERE user_id = ?")
      .all(userId) as {
      user_id: string;
      thread_id: string;
      created_at: string;
    }[]
  ).map((r) => ({
    userId: r.user_id,
    threadId: r.thread_id,
    createdAt: r.created_at,
  }));
}

export async function repliesByUser(
  userId: string,
  limit = 25
): Promise<ReplyView[]> {
  const rows = db
    .prepare(
      "SELECT * FROM replies WHERE author_id = ? ORDER BY created_at DESC LIMIT ?"
    )
    .all(userId, limit) as ReplyRow[];
  const cache = new Map<string, Author | null>();

  return Promise.all(
    rows.map(async (row) => {
      const r = rowToReply(row);
      const author = await hydrateAuthor(r.authorId, cache);
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
  db.prepare("UPDATE threads SET view_count = view_count + 1 WHERE id = ?").run(
    threadId
  );
}

export async function setPinned(threadId: string, pinned: boolean) {
  const result = db
    .prepare("UPDATE threads SET is_pinned = ? WHERE id = ?")
    .run(pinned ? 1 : 0, threadId);
  if (result.changes === 0) throw new Error("THREAD_NOT_FOUND");
}

export async function setLocked(threadId: string, locked: boolean) {
  const result = db
    .prepare("UPDATE threads SET is_locked = ? WHERE id = ?")
    .run(locked ? 1 : 0, threadId);
  if (result.changes === 0) throw new Error("THREAD_NOT_FOUND");
}

export async function deleteThread(threadId: string, requesterId: string) {
  const t = db
    .prepare("SELECT author_id FROM threads WHERE id = ?")
    .get(threadId) as { author_id: string } | undefined;
  if (!t) return;
  if (t.author_id !== requesterId) throw new Error("FORBIDDEN");
  db.prepare("DELETE FROM threads WHERE id = ?").run(threadId);
}

export async function deleteReply(replyId: string, requesterId: string) {
  const r = db
    .prepare("SELECT author_id FROM replies WHERE id = ?")
    .get(replyId) as { author_id: string } | undefined;
  if (!r) return;
  if (r.author_id !== requesterId) throw new Error("FORBIDDEN");
  db.prepare("DELETE FROM replies WHERE id = ?").run(replyId);
}
