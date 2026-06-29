// Generates src/lib/forum/thread-ideas.generated.ts from this folder's
// thread-ideas.csv (a copy of Thread_Database_250_Ideas.csv).
//
// Run from the repo root:
//   node src/lib/forum/data/generate-thread-ideas.mjs
//
// The CSV schema is:
//   space, thread_title, thread_description, pain_point_tag, opening_story,
//   invitation_questions, audience_tags, content_type, priority

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(here, "thread-ideas.csv");
const OUT_PATH = path.join(here, "..", "thread-ideas.generated.ts");

// --- CSV parse (RFC4180-ish, matches the repo's parser semantics) ---
function parseCsv(t) {
  const rows = [];
  let row = [],
    cell = "",
    q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i],
      n = t[i + 1];
    if (c === '"') {
      if (q && n === '"') {
        cell += '"';
        i++;
      } else q = !q;
      continue;
    }
    if (c === "," && !q) {
      row.push(cell);
      cell = "";
      continue;
    }
    if ((c === "\n" || c === "\r") && !q) {
      if (c === "\r" && n === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += c;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function normalizeTag(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitTags(value, max = 6) {
  const seen = new Set();
  const out = [];
  for (const item of value.split(/[,\s]+/)) {
    const tag = normalizeTag(item);
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
    if (out.length >= max) break;
  }
  return out;
}

// space name -> { spaceId, audienceTags }
const SPACE_MAP = {
  "First Steps & Introductions": { id: "first-steps", aud: ["everyone"] },
  "Tweens & Teens (9-18)": { id: "tweens-teens", aud: ["parents"] },
  "Parenting Little Ones (0-8)": { id: "parenting-littles", aud: ["parents"] },
  "Adults: Workplace & Life (nd_adults)": { id: "adults", aud: ["nd_adults"] },
  "Educators' Lounge (teachers)": { id: "educators", aud: ["teachers"] },
  "Healthcare & Genetics (parents)": { id: "healthcare", aud: ["parents"] },
  "Job Seekers (job_seekers)": { id: "job seekers", aud: ["job_seekers"] },
};

// Author pools per space (all must exist in SEED_USERS in seed.ts).
const AUTHOR_POOLS = {
  "first-steps": ["seed-kavya", "seed-nikhil", "seed-eli", "seed-tara", "seed-aarti"],
  "parenting-littles": ["seed-ren", "seed-leah", "seed-maya", "seed-noor", "seed-kavya", "seed-tara"],
  "tweens-teens": ["seed-leah", "seed-noor", "seed-priya", "seed-kavya", "seed-maya"],
  adults: ["seed-aarti", "seed-sam", "seed-eli", "seed-nikhil", "seed-arjun"],
  educators: ["seed-devon", "seed-priya", "seed-meera"],
  healthcare: ["seed-noor", "seed-ren", "seed-kavya", "seed-arjun", "seed-eli"],
  "job seekers": ["seed-rohan", "seed-divya", "seed-nikhil", "seed-arjun"],
};

const VALID_NOTES = new Set([
  "burnout", "diagnosis", "meltdown", "school-stress", "medical",
  "grief", "anxiety", "rejection", "unemployment",
]);

function contentNotesFor(haystack) {
  const h = haystack.toLowerCase();
  const notes = [];
  const add = (n) => {
    if (VALID_NOTES.has(n) && !notes.includes(n)) notes.push(n);
  };
  if (/burnout/.test(h)) add("burnout");
  if (/diagnos/.test(h)) add("diagnosis");
  if (/meltdown|shutdown/.test(h)) add("meltdown");
  if (/school|exam|homework|refusal|education|\biep\b|classroom/.test(h)) add("school-stress");
  if (/medicat|medical|crisis|safety|genetic|clinician|therap|health/.test(h)) add("medical");
  if (/grief|mourning/.test(h)) add("grief");
  if (/anxiet|overwhelm|future-worry|future_worry/.test(h)) add("anxiety");
  if (/rejection|bully|lonely|isolation|peer/.test(h)) add("rejection");
  if (/employ|unemploy|job|resume|interview|career|gap/.test(h)) add("unemployment");
  return notes.slice(0, 3);
}

function reactionsFor(contentType, priority, idx) {
  const base = (priority === "high" ? 11 : 6) + (idx % 4);
  const ct = contentType.split(",")[0].trim();
  if (["practical_advice", "coping_strategies", "guidance", "boundary_setting"].includes(ct))
    return { helpful: base + 4, thanks: base };
  if (ct === "advice_request") return { thoughtful: base + 1, metoo: base };
  if (ct === "emotional_support") return { care: base + 2, hug: base };
  if (ct === "story_invitation" || ct === "reflection")
    return { metoo: base + 2, thoughtful: base };
  return { thoughtful: base, helpful: base };
}

function composeBody(d) {
  return [d.thread_description, d.opening_story, d.invitation_questions]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join("\n\n");
}

const text = fs.readFileSync(CSV_PATH, "utf8");
const rows = parseCsv(text);
const headers = rows[0].map((h) => h.trim().replace(/^﻿/, ""));
const data = rows.slice(1).map((r) =>
  Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()]))
);

const perSpaceCount = {};
const seeds = data.map((d, idx) => {
  const space = SPACE_MAP[d.space];
  if (!space) throw new Error(`Unknown space: "${d.space}"`);
  const pool = AUTHOR_POOLS[space.id];
  perSpaceCount[space.id] = (perSpaceCount[space.id] ?? 0) + 1;
  const author = pool[(perSpaceCount[space.id] - 1) % pool.length];

  const tags = splitTags(
    [d.pain_point_tag, d.audience_tags, d.content_type].filter(Boolean).join(","),
    6
  );
  const notes = contentNotesFor(
    [d.pain_point_tag, d.audience_tags, d.content_type].join(",")
  );

  const seed = {
    seedId: `idea-${idx + 1}`,
    authorId: author,
    spaceId: space.id,
    title: d.thread_title,
    body: composeBody(d),
    daysAgo: (d.priority === "high" ? 1 : 6) + (idx % 24),
    minutesOffset: idx * 3,
    tags,
    audienceTags: space.aud,
    reactions: reactionsFor(d.content_type, d.priority, idx),
  };
  if (notes.length) seed.contentNotes = notes;
  return seed;
});

const header = `import type { ForumSeedThreadInput } from "./types";

// AUTO-GENERATED from data/thread-ideas.csv (Thread_Database_250_Ideas.csv).
// Do not edit by hand. Regenerate with:
//   node src/lib/forum/data/generate-thread-ideas.mjs
export const THREAD_IDEA_SEEDS: ForumSeedThreadInput[] = `;

fs.writeFileSync(
  OUT_PATH,
  header + JSON.stringify(seeds, null, 2) + ";\n",
  "utf8"
);

console.log(`Wrote ${seeds.length} thread-idea seeds to ${OUT_PATH}`);
console.log("Per space:", perSpaceCount);
