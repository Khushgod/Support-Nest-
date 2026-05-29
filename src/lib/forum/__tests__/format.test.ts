import { describe, expect, it } from "vitest";
import {
  bodyToSegments,
  buildSearchHref,
  normalizeForumTag,
  snippet,
  splitForumTags,
  timeAgo,
} from "../format";

describe("forum/format", () => {
  describe("timeAgo", () => {
    const NOW = new Date("2026-05-06T12:00:00Z").getTime();

    it("returns 'just now' under one minute", () => {
      const past = new Date(NOW - 30_000).toISOString();
      expect(timeAgo(past, NOW)).toBe("just now");
    });

    it("returns minutes/hours/days/months/years bucketed", () => {
      expect(timeAgo(new Date(NOW - 5 * 60_000).toISOString(), NOW)).toBe("5m ago");
      expect(timeAgo(new Date(NOW - 3 * 60 * 60_000).toISOString(), NOW)).toBe("3h ago");
      expect(timeAgo(new Date(NOW - 2 * 24 * 60 * 60_000).toISOString(), NOW)).toBe("2d ago");
      expect(timeAgo(new Date(NOW - 60 * 24 * 60 * 60_000).toISOString(), NOW)).toBe("2mo ago");
      expect(timeAgo(new Date(NOW - 400 * 24 * 60 * 60_000).toISOString(), NOW)).toBe("1y ago");
    });

    it("returns 'just now' for future timestamps (clock skew safety)", () => {
      const future = new Date(NOW + 60_000).toISOString();
      expect(timeAgo(future, NOW)).toBe("just now");
    });
  });

  describe("snippet", () => {
    it("returns the original when shorter than the limit", () => {
      expect(snippet("hello world", 50)).toBe("hello world");
    });

    it("trims to whole words and adds an ellipsis", () => {
      const out = snippet("a ".repeat(120).trim(), 30);
      expect(out.length).toBeLessThanOrEqual(30);
      expect(out.endsWith("…")).toBe(true);
      expect(/\s$/.test(out.replace("…", ""))).toBe(false);
    });

    it("collapses runs of whitespace", () => {
      const out = snippet("a   b\n\n c", 50);
      expect(out).toBe("a b c");
    });
  });

  describe("forum tag helpers", () => {
    it("normalizes tags for seed imports and user-created posts", () => {
      expect(normalizeForumTag(" Interview Scripts! ")).toBe("interview-scripts");
      expect(normalizeForumTag("ND_adults")).toBe("nd-adults");
    });

    it("splits, de-duplicates, and caps tags", () => {
      expect(
        splitForumTags(
          "job-search, employment gaps, job-search, ADHD, burnout, scripts, extra",
          5
        )
      ).toEqual(["job-search", "employment", "gaps", "adhd", "burnout"]);
    });
  });

  describe("bodyToSegments", () => {
    it("splits on blank lines and detects URLs", () => {
      const { paragraphs } = bodyToSegments(
        "First paragraph with https://example.com inside.\n\nSecond paragraph."
      );
      expect(paragraphs).toHaveLength(2);
      const linkSeg = paragraphs[0].find((s) => s.kind === "link");
      expect(linkSeg?.value).toBe("https://example.com");
      expect(paragraphs[1][0]).toEqual({
        kind: "text",
        value: "Second paragraph.",
      });
    });

    it("does not include trailing punctuation in the link value", () => {
      const { paragraphs } = bodyToSegments(
        "See https://example.com/path?x=1, please."
      );
      const link = paragraphs[0].find((s) => s.kind === "link");
      expect(link?.value).toBe("https://example.com/path?x=1");
    });
  });

  describe("buildSearchHref", () => {
    it("encodes the active filters", () => {
      const href = buildSearchHref({
        q: "iep",
        spaceId: "educators",
        audience: "teachers",
        contentNote: "school-stress",
        tag: "goals",
        sort: "most-replies",
        page: 3,
      });
      expect(href).toContain("q=iep");
      expect(href).toContain("space=educators");
      expect(href).toContain("audience=teachers");
      expect(href).toContain("cn=school-stress");
      expect(href).toContain("tag=goals");
      expect(href).toContain("sort=most-replies");
      expect(href).toContain("page=3");
    });

    it("returns the bare path when no filters", () => {
      expect(buildSearchHref({})).toBe("/community/search");
    });

    it("omits page=1 (the default)", () => {
      const href = buildSearchHref({ q: "hi", page: 1 });
      expect(href).not.toContain("page=");
    });
  });
});
