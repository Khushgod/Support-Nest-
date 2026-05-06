import { describe, expect, it } from "vitest";
import {
  ACCOMMODATIONS,
  CHALLENGE_AREAS,
  COMMON_STRENGTHS,
  ROLES,
} from "@/lib/iep-data";

describe("IEP/504 Companion data", () => {
  it("ships at least one accommodation per challenge area", () => {
    for (const area of CHALLENGE_AREAS) {
      const matches = ACCOMMODATIONS.filter((a) => a.area === area.id);
      expect(
        matches.length,
        `area "${area.id}" should have ≥1 accommodation`
      ).toBeGreaterThan(0);
    }
  });

  it("uses unique accommodation ids", () => {
    const ids = ACCOMMODATIONS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only references known challenge areas", () => {
    const known = new Set(CHALLENGE_AREAS.map((c) => c.id));
    for (const a of ACCOMMODATIONS) {
      expect(known.has(a.area)).toBe(true);
    }
  });

  it("provides a reasonably broad strengths and roles list", () => {
    expect(COMMON_STRENGTHS.length).toBeGreaterThanOrEqual(10);
    expect(ROLES.map((r) => r.id)).toEqual(["parent", "teacher", "self"]);
  });

  it("keeps every accommodation text non-empty and reasonably scoped", () => {
    for (const a of ACCOMMODATIONS) {
      expect(a.text.length, `${a.id} text empty`).toBeGreaterThan(10);
      expect(a.text.length, `${a.id} text too long`).toBeLessThan(400);
    }
  });
});
