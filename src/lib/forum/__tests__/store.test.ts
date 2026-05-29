import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import crypto from "node:crypto";

// Each test file gets a fresh .data dir so the store seeds in isolation and
// does not collide with other suites that touch the user store.
const RUN_DIR = path.join(
  tmpdir(),
  `supportnest-forum-${crypto.randomBytes(6).toString("hex")}`
);
process.env.SUPPORTNEST_DATA_DIR = RUN_DIR;
process.env.SUPPORTNEST_VAULT_DIR = path.join(RUN_DIR, "vault");
process.env.SUPPORTNEST_SESSION_SECRET = crypto.randomBytes(32).toString("hex");
process.env.SUPPORTNEST_DATA_KEY = crypto.randomBytes(32).toString("base64");

beforeAll(async () => {
  await fs.mkdir(RUN_DIR, { recursive: true });
});

afterAll(async () => {
  // Best-effort cleanup; harmless if it fails.
  await fs.rm(RUN_DIR, { recursive: true, force: true }).catch(() => undefined);
});

describe("forum store", () => {
  it("seeds threads and replies on first read", async () => {
    const store = await import("../store");
    const { items, total } = await store.listThreads({ limit: 100 });
    expect(total).toBeGreaterThanOrEqual(35);
    expect(items.some((t) => t.author?.handle.endsWith("~"))).toBe(true);
    expect(items.some((t) => t.replyCount > 0)).toBe(true);
    expect(items[0].reactionCounts.care).toBeGreaterThanOrEqual(0);
  });

  it("includes imported CSV question/response seed threads in the right spaces", async () => {
    const store = await import("../store");
    const workplace = await store.listThreads({
      spaceId: "job seekers",
      tag: "employment-gaps",
      limit: 10,
    });
    expect(workplace.items).toHaveLength(1);
    expect(workplace.items[0]).toMatchObject({
      title:
        "How do I explain employment gaps without making my ADHD or burnout sound like a liability?",
      author: expect.objectContaining({ handle: "workplace-guide~" }),
      seedMetadata: expect.objectContaining({
        source: "question-response-csv",
        theme: "Workplace and Career Navigation",
        rank: 1,
      }),
    });
    expect(workplace.items[0].audienceTags).toContain("job_seekers");
    expect(workplace.items[0].contentNotes).toContain("unemployment");

    const school = await store.listThreads({
      spaceId: "educators",
      tag: "teacher-profile",
      limit: 10,
    });
    expect(school.items).toHaveLength(1);
    expect(school.items[0].title).toBe(
      "What should I put in a one-page profile for my child's teacher?"
    );
  });

  it("listSpaceStats covers every seeded space", async () => {
    const store = await import("../store");
    const stats = await store.listSpaceStats();
    expect(stats["first-steps"]?.threads).toBeGreaterThan(0);
    expect(stats["adults"]?.threads).toBeGreaterThan(0);
  });

  it("filters by space and content note", async () => {
    const store = await import("../store");
    const adults = await store.listThreads({
      spaceId: "adults",
      limit: 50,
    });
    expect(adults.items.every((t) => t.spaceId === "adults")).toBe(true);

    const burnout = await store.listThreads({
      contentNote: "burnout",
      limit: 50,
    });
    expect(burnout.items.length).toBeGreaterThan(0);
    expect(
      burnout.items.every((t) => t.contentNotes.includes("burnout"))
    ).toBe(true);
  });

  it("full-text search hits title, body, and tags", async () => {
    const store = await import("../store");
    const titleHit = await store.listThreads({ q: "morning routine", limit: 10 });
    expect(titleHit.items.length).toBeGreaterThan(0);
    const bodyHit = await store.listThreads({ q: "polyvagal", limit: 10 });
    // Polyvagal isn't in seeds; should return nothing.
    expect(bodyHit.items.length).toBe(0);
    const tagHit = await store.listThreads({ q: "iep", limit: 10 });
    expect(tagHit.items.some((t) => t.tags.includes("iep"))).toBe(true);

    const metadataHit = await store.listThreads({
      q: "workplace scripts library",
      limit: 10,
    });
    expect(
      metadataHit.items.some(
        (t) => t.seedMetadata?.communityUse === "Workplace scripts library"
      )
    ).toBe(true);
  });

  it("trendingTags returns counts in descending order", async () => {
    const store = await import("../store");
    const tags = await store.listTrendingTags(20);
    expect(tags.length).toBeGreaterThan(0);
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i].count).toBeLessThanOrEqual(tags[i - 1].count);
    }
  });

  it("createThread + createReply update lastActivityAt", async () => {
    const store = await import("../store");
    const t = await store.createThread({
      authorId: "user-1",
      spaceId: "first-steps",
      title: "Saying hi for the first time",
      body: "Just here to introduce myself. Glad to find this place.",
      tags: ["intro", "intro"],
      audienceTags: ["everyone"],
    });
    expect(t.id).toMatch(/^thr_/);
    expect(t.tags).toEqual(["intro"]); // de-duplicated via slice/cleanup

    const r = await store.createReply({
      authorId: "user-2",
      threadId: t.id,
      body: "Welcome!",
    });
    expect(r.id).toMatch(/^rep_/);

    const fetched = await store.getThread(t.id);
    expect(fetched?.lastActivityAt).toBe(r.createdAt);
    expect(fetched?.replyCount).toBe(1);
  });

  it("toggleReaction is idempotent and counts correctly", async () => {
    const store = await import("../store");
    const list = await store.listThreads({ limit: 1, sort: "newest" });
    const t = list.items[0];

    const a = await store.toggleReaction({
      userId: "user-x",
      targetType: "thread",
      targetId: t.id,
      emoji: "helpful",
    });
    expect(a.added).toBe(true);

    const b = await store.toggleReaction({
      userId: "user-x",
      targetType: "thread",
      targetId: t.id,
      emoji: "helpful",
    });
    expect(b.added).toBe(false);

    // Different emoji from the same user is independent.
    const c = await store.toggleReaction({
      userId: "user-x",
      targetType: "thread",
      targetId: t.id,
      emoji: "care",
    });
    expect(c.added).toBe(true);

    const after = await store.getThread(t.id);
    expect(after?.reactionCounts.helpful).toBe(t.reactionCounts.helpful);
    expect(after?.reactionCounts.care).toBe(t.reactionCounts.care + 1);
  });

  it("bookmark and follow are toggleable and per-user", async () => {
    const store = await import("../store");
    const list = await store.listThreads({ limit: 1, sort: "newest" });
    const t = list.items[0];

    expect(await store.isBookmarked("u1", t.id)).toBe(false);
    await store.toggleBookmark({ userId: "u1", threadId: t.id });
    expect(await store.isBookmarked("u1", t.id)).toBe(true);
    expect(await store.isBookmarked("u2", t.id)).toBe(false);
    await store.toggleBookmark({ userId: "u1", threadId: t.id });
    expect(await store.isBookmarked("u1", t.id)).toBe(false);

    // Follows are independent of bookmarks.
    await store.toggleFollow({ userId: "u3", threadId: t.id });
    expect(await store.isFollowing("u3", t.id)).toBe(true);
    expect(await store.isBookmarked("u3", t.id)).toBe(false);

    // bookmarkedBy filter scopes to bookmarks for that user only.
    await store.toggleBookmark({ userId: "u4", threadId: t.id });
    const filtered = await store.listThreads({ bookmarkedBy: "u4", limit: 5 });
    expect(filtered.items.some((x) => x.id === t.id)).toBe(true);
  });

  it("locked threads reject new replies", async () => {
    const store = await import("../store");
    const t = await store.createThread({
      authorId: "user-l",
      spaceId: "adults",
      title: "Locked thread test thread",
      body: "Body that's long enough to satisfy validation gates.",
    });
    await store.setLocked(t.id, true);
    await expect(
      store.createReply({
        authorId: "user-l2",
        threadId: t.id,
        body: "Should be rejected.",
      })
    ).rejects.toThrow(/THREAD_LOCKED/);
  });

  it("deleting a thread cleans up replies, bookmarks, and follows", async () => {
    const store = await import("../store");
    const t = await store.createThread({
      authorId: "user-d",
      spaceId: "first-steps",
      title: "Cleanup test thread title text",
      body: "Body that's long enough to satisfy validation gates.",
    });
    await store.createReply({
      authorId: "user-d2",
      threadId: t.id,
      body: "A reply that should be removed.",
    });
    await store.toggleBookmark({ userId: "user-bk", threadId: t.id });
    await store.toggleFollow({ userId: "user-fl", threadId: t.id });

    await store.deleteThread(t.id, "user-d");

    expect(await store.getThread(t.id)).toBeNull();
    expect(await store.isBookmarked("user-bk", t.id)).toBe(false);
    expect(await store.isFollowing("user-fl", t.id)).toBe(false);
  });

  it("deleting another user's thread is forbidden", async () => {
    const store = await import("../store");
    const t = await store.createThread({
      authorId: "owner",
      spaceId: "first-steps",
      title: "Other-user delete attempt",
      body: "Body that's long enough to satisfy validation gates.",
    });
    await expect(store.deleteThread(t.id, "stranger")).rejects.toThrow(
      /FORBIDDEN/
    );
  });
});
