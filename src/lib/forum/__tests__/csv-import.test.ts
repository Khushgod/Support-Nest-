import { describe, expect, it } from "vitest";
import {
  csvRowsToSeedThreads,
  parseQuestionResponseCsv,
} from "../csv-import";

const SAMPLE = `theme,rank,question,response,suggested_tags,anchor_thread_type,timeliness,community_use
Workplace and Career Navigation,1,"How do I explain gaps, briefly?","Use a calm script, then pivot to proof.","job-search, employment-gaps, burnout",Script / Template,Evergreen launch seed,Anchor discussion
School and Learning Support,2,What should go in a teacher profile?,Keep it practical.,"school, teacher-profile, accommodations",Template,Back-to-school timely seed,Downloadable template
`;

describe("forum CSV import", () => {
  it("parses quoted CSV cells and expected headers", () => {
    const rows = parseQuestionResponseCsv(SAMPLE);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      theme: "Workplace and Career Navigation",
      rank: 1,
      question: "How do I explain gaps, briefly?",
      response: "Use a calm script, then pivot to proof.",
      anchorThreadType: "Script / Template",
    });
  });

  it("maps question/response rows into forum seed threads", () => {
    const threads = csvRowsToSeedThreads(parseQuestionResponseCsv(SAMPLE));

    expect(threads[0]).toMatchObject({
      authorId: "seed-csv-workplace",
      spaceId: "job seekers",
      title: "How do I explain gaps, briefly?",
      body: "Use a calm script, then pivot to proof.",
      audienceTags: ["job_seekers", "nd_adults"],
      contentNotes: ["burnout", "unemployment"],
      seedMetadata: {
        source: "question-response-csv",
        theme: "Workplace and Career Navigation",
        rank: 1,
      },
    });
    expect(threads[0].tags).toEqual([
      "job-search",
      "employment-gaps",
      "burnout",
      "script",
      "template",
    ]);
    expect(threads[1].spaceId).toBe("educators");
    expect(threads[1].audienceTags).toEqual(["parents", "teachers"]);
  });

  it("throws a focused error when required headers are missing", () => {
    expect(() => parseQuestionResponseCsv("theme,rank\nA,1")).toThrow(
      /CSV_MISSING_HEADERS/
    );
  });
});
