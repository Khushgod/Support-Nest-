import type Database from "better-sqlite3";
import { buildSeedReplies, SEED_USERS } from "./seed";

/**
 * Idempotently inserts all seed users, threads, and replies into the given
 * SQLite database. Every statement uses INSERT OR IGNORE against stable ids, so
 * this is safe to run on every startup and on an already-populated database: it
 * only adds rows that are missing and never overwrites existing or user-created
 * content.
 *
 * Kept free of `server-only` and the app's db singleton so it can be reused by
 * dev tooling (see data/sync-dev-db.ts).
 */
export function seedDatabase(db: Database.Database): void {
  const { threads, replies } = buildSeedReplies();

  const insertSeedUser = db.prepare(
    `INSERT OR IGNORE INTO seed_users (id, display_name, handle, role)
     VALUES (?, ?, ?, ?)`
  );
  const insertThread = db.prepare(`
    INSERT OR IGNORE INTO threads
      (id, space_id, author_id, title, body, created_at, updated_at,
       last_activity_at, is_pinned, is_locked, view_count,
       seed_source, seed_theme, seed_rank, seed_anchor_type,
       seed_timeliness, seed_community_use)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertTag = db.prepare(
    `INSERT OR IGNORE INTO thread_tags (thread_id, tag) VALUES (?, ?)`
  );
  const insertAudience = db.prepare(
    `INSERT OR IGNORE INTO thread_audience_tags (thread_id, audience_tag)
     VALUES (?, ?)`
  );
  const insertNote = db.prepare(
    `INSERT OR IGNORE INTO thread_content_notes (thread_id, content_note)
     VALUES (?, ?)`
  );
  const insertThreadReaction = db.prepare(
    `INSERT OR IGNORE INTO thread_reactions (thread_id, user_id, emoji)
     VALUES (?, ?, ?)`
  );
  const insertReply = db.prepare(`
    INSERT OR IGNORE INTO replies
      (id, thread_id, author_id, body, created_at, parent_reply_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertReplyReaction = db.prepare(
    `INSERT OR IGNORE INTO reply_reactions (reply_id, user_id, emoji)
     VALUES (?, ?, ?)`
  );

  db.transaction(() => {
    for (const u of SEED_USERS) {
      insertSeedUser.run(u.id, u.displayName, u.handle, u.role);
    }

    for (const t of threads) {
      const sm = t.seedMetadata;
      insertThread.run(
        t.id,
        t.spaceId,
        t.authorId,
        t.title,
        t.body,
        t.createdAt,
        t.updatedAt,
        t.lastActivityAt,
        t.isPinned ? 1 : 0,
        t.isLocked ? 1 : 0,
        t.viewCount,
        sm?.source ?? null,
        sm?.theme ?? null,
        sm?.rank ?? null,
        sm?.anchorThreadType ?? null,
        sm?.timeliness ?? null,
        sm?.communityUse ?? null
      );
      for (const tag of t.tags) insertTag.run(t.id, tag);
      for (const at of t.audienceTags) insertAudience.run(t.id, at);
      for (const cn of t.contentNotes) insertNote.run(t.id, cn);
      for (const rx of t.reactions) {
        insertThreadReaction.run(t.id, rx.userId, rx.emoji);
      }
    }

    for (const r of replies) {
      insertReply.run(
        r.id,
        r.threadId,
        r.authorId,
        r.body,
        r.createdAt,
        r.parentReplyId ?? null
      );
      for (const rx of r.reactions) {
        insertReplyReaction.run(r.id, rx.userId, rx.emoji);
      }
    }
  })();
}
