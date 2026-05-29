import { splitForumTags } from "./format";
import type {
  AudienceTag,
  ContentNote,
  ForumSeedThreadInput,
  ReactionEmoji,
  SpaceId,
} from "./types";

export type QuestionResponseCsvRow = {
  theme: string;
  rank: number;
  question: string;
  response: string;
  suggestedTags: string;
  anchorThreadType: string;
  timeliness: string;
  communityUse: string;
};

const REQUIRED_HEADERS = [
  "theme",
  "rank",
  "question",
  "response",
  "suggested_tags",
  "anchor_thread_type",
  "timeliness",
  "community_use",
] as const;

const THEME_TO_SPACE: Record<string, SpaceId> = {
  "Workplace and Career Navigation": "job seekers",
  "Parenting and Family Systems": "parenting-littles",
  "Mental Health and Recovery": "adults",
  "Diagnosis and Identity Navigation": "first-steps",
  "School and Learning Support": "educators",
};

const THEME_TO_AUTHOR: Record<string, string> = {
  "Workplace and Career Navigation": "seed-csv-workplace",
  "Parenting and Family Systems": "seed-csv-parenting",
  "Mental Health and Recovery": "seed-csv-mental-health",
  "Diagnosis and Identity Navigation": "seed-csv-identity",
  "School and Learning Support": "seed-csv-school",
};

const THEME_TO_AUDIENCE: Record<string, AudienceTag[]> = {
  "Workplace and Career Navigation": ["job_seekers", "nd_adults"],
  "Parenting and Family Systems": ["parents"],
  "Mental Health and Recovery": ["everyone"],
  "Diagnosis and Identity Navigation": ["nd_adults"],
  "School and Learning Support": ["parents", "teachers"],
};

export function parseQuestionResponseCsv(text: string): QuestionResponseCsvRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim().replace(/^\uFEFF/, ""));
  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missing.length > 0) {
    throw new Error(`CSV_MISSING_HEADERS:${missing.join(",")}`);
  }

  return rows.slice(1).flatMap((row) => {
    if (row.every((cell) => cell.trim() === "")) return [];
    const record = Object.fromEntries(
      headers.map((header, index) => [header, row[index]?.trim() ?? ""])
    );
    const rank = Number.parseInt(record.rank, 10);
    if (!Number.isFinite(rank)) {
      throw new Error(`CSV_INVALID_RANK:${record.rank}`);
    }
    return [
      {
        theme: record.theme,
        rank,
        question: record.question,
        response: record.response,
        suggestedTags: record.suggested_tags,
        anchorThreadType: record.anchor_thread_type,
        timeliness: record.timeliness,
        communityUse: record.community_use,
      },
    ];
  });
}

export function csvRowsToSeedThreads(
  rows: QuestionResponseCsvRow[]
): ForumSeedThreadInput[] {
  return rows.map((row, index) => {
    const tags = splitForumTags(row.suggestedTags, 6);
    const anchorTags = splitForumTags(row.anchorThreadType, 2);
    const contentNotes = contentNotesFor(tags);
    const rank = Math.max(1, row.rank);

    return {
      authorId: THEME_TO_AUTHOR[row.theme] ?? "seed-csv-community",
      spaceId: THEME_TO_SPACE[row.theme] ?? "first-steps",
      title: row.question,
      body: row.response,
      daysAgo: rank + 1,
      minutesOffset: (rows.length - index) * 5,
      tags: [...tags, ...anchorTags].slice(0, 6),
      audienceTags: THEME_TO_AUDIENCE[row.theme] ?? ["everyone"],
      contentNotes,
      reactions: reactionsFor(row.anchorThreadType, rank),
      seedMetadata: {
        source: "question-response-csv",
        theme: row.theme,
        rank: row.rank,
        anchorThreadType: row.anchorThreadType,
        timeliness: row.timeliness,
        communityUse: row.communityUse,
      },
    };
  });
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += ch;
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((value) => value.trim() !== ""));
}

function contentNotesFor(tags: string[]): ContentNote[] {
  const tagSet = new Set(tags);
  const notes: ContentNote[] = [];
  const add = (note: ContentNote) => {
    if (!notes.includes(note)) notes.push(note);
  };

  if (tagSet.has("burnout")) add("burnout");
  if (tagSet.has("diagnosis") || tagSet.has("late-diagnosis")) add("diagnosis");
  if (tagSet.has("meltdown") || tagSet.has("shutdown")) add("meltdown");
  if (tagSet.has("school-refusal") || tagSet.has("homework")) add("school-stress");
  if (tagSet.has("crisis-support") || tagSet.has("safety")) add("medical");
  if (tagSet.has("grief")) add("grief");
  if (tagSet.has("anxiety")) add("anxiety");
  if (tagSet.has("employment-gaps") || tagSet.has("job-search")) add("unemployment");

  return notes;
}

function reactionsFor(
  anchorThreadType: string,
  rank: number
): Partial<Record<ReactionEmoji, number>> {
  const base = Math.max(2, 8 - rank);
  if (anchorThreadType.includes("Script") || anchorThreadType.includes("Template")) {
    return { helpful: base + 4, thanks: base };
  }
  if (anchorThreadType === "What helped me") {
    return { helpful: base + 3, agree: base };
  }
  if (anchorThreadType === "Resource") {
    return { helpful: base + 2, thoughtful: base };
  }
  if (anchorThreadType === "Start here") {
    return { care: base + 2, helpful: base + 2 };
  }
  return { thoughtful: base + 1, metoo: base };
}
