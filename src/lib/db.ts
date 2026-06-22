import "server-only";

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// Persist the SQLite database on disk. For EC2, set SUPPORTNEST_DATA_DIR to a
// persistent mounted path such as /var/lib/geneTranslate or /mnt/data/geneTranslate.
const DATA_DIR =
  process.env.SUPPORTNEST_DATA_DIR || path.join(process.cwd(), ".data");

fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "sagenest.db");

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    role          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS seed_users (
    id           TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    handle       TEXT NOT NULL,
    role         TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS threads (
    id                 TEXT PRIMARY KEY,
    space_id           TEXT NOT NULL,
    author_id          TEXT NOT NULL,
    title              TEXT NOT NULL,
    body               TEXT NOT NULL,
    created_at         TEXT NOT NULL,
    updated_at         TEXT NOT NULL,
    last_activity_at   TEXT NOT NULL,
    is_pinned          INTEGER NOT NULL DEFAULT 0,
    is_locked          INTEGER NOT NULL DEFAULT 0,
    view_count         INTEGER NOT NULL DEFAULT 0,
    seed_source        TEXT,
    seed_theme         TEXT,
    seed_rank          INTEGER,
    seed_anchor_type   TEXT,
    seed_timeliness    TEXT,
    seed_community_use TEXT
  );

  CREATE TABLE IF NOT EXISTS thread_tags (
    thread_id TEXT NOT NULL,
    tag       TEXT NOT NULL,
    PRIMARY KEY (thread_id, tag),
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS thread_audience_tags (
    thread_id    TEXT NOT NULL,
    audience_tag TEXT NOT NULL,
    PRIMARY KEY (thread_id, audience_tag),
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS thread_content_notes (
    thread_id    TEXT NOT NULL,
    content_note TEXT NOT NULL,
    PRIMARY KEY (thread_id, content_note),
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS thread_reactions (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id TEXT NOT NULL,
    user_id   TEXT NOT NULL,
    emoji     TEXT NOT NULL,
    UNIQUE (thread_id, user_id, emoji),
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS replies (
    id               TEXT PRIMARY KEY,
    thread_id        TEXT NOT NULL,
    author_id        TEXT NOT NULL,
    body             TEXT NOT NULL,
    created_at       TEXT NOT NULL,
    parent_reply_id  TEXT,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reply_reactions (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    reply_id TEXT NOT NULL,
    user_id  TEXT NOT NULL,
    emoji    TEXT NOT NULL,
    UNIQUE (reply_id, user_id, emoji),
    FOREIGN KEY (reply_id) REFERENCES replies(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    user_id    TEXT NOT NULL,
    thread_id  TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, thread_id),
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS follows (
    user_id    TEXT NOT NULL,
    thread_id  TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, thread_id),
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );
`);

export default db;
