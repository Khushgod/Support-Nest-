import { describe, it, expect } from "vitest";
import { detectLab } from "../lab-detector";

describe("detectLab", () => {
  it("detects Invitae", () => {
    expect(detectLab("Invitae Corporation\nSan Francisco, CA")).toBe("Invitae");
  });

  it("detects GeneDx", () => {
    expect(detectLab("Report from GeneDx, LLC")).toBe("GeneDx");
  });

  it("detects Quest Diagnostics", () => {
    expect(detectLab("Quest Diagnostics Nichols Institute")).toBe(
      "Quest Diagnostics"
    );
  });

  it("detects Blueprint Genetics", () => {
    expect(detectLab("Blueprint Genetics report")).toBe("Blueprint Genetics");
  });

  it("is case-insensitive", () => {
    expect(detectLab("INVITAE CORPORATION")).toBe("Invitae");
  });

  it("returns null for unknown labs", () => {
    expect(detectLab("SomeUnknownLab Inc.")).toBe(null);
  });

  it("only looks at the header (first 3000 chars)", () => {
    const filler = "x".repeat(3500);
    expect(detectLab(filler + "\nInvitae")).toBe(null);
  });
});
