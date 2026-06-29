/**
 * Dev utility: idempotently sync all seed threads/replies into the local
 * SQLite database without wiping it. Useful after adding new seed data when a
 * database already exists (the app only auto-seeds an empty database on boot,
 * though it now also re-syncs on every startup).
 *
 * Run from the repo root:
 *   npx tsx src/lib/forum/data/sync-dev-db.ts
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { seedDatabase } from "../seed-db";

const DATA_DIR =
  process.env.SUPPORTNEST_DATA_DIR || path.join(process.cwd(), ".data");
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "sagenest.db");

const db = new Database(DB_PATH, { timeout: 30000 });
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 30000");
db.pragma("foreign_keys = ON");

const count = () =>
  (db.prepare("SELECT COUNT(*) AS n FROM threads").get() as { n: number }).n;

const before = count();
seedDatabase(db);
const after = count();

const perSpace = db
  .prepare(
    "SELECT space_id, COUNT(*) AS n FROM threads GROUP BY space_id ORDER BY n DESC"
  )
  .all() as { space_id: string; n: number }[];

console.log(`threads before: ${before}  ->  after: ${after}  (+${after - before})`);
console.table(perSpace);
db.close();
