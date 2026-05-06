import { describe, it, expect, beforeAll } from "vitest";
import { tmpdir } from "node:os";
import path from "node:path";
import crypto from "node:crypto";

// Set required envs and isolate the on-disk store before importing modules
// that touch them.
const RUN_DIR = path.join(
  tmpdir(),
  `supportnest-test-${crypto.randomBytes(6).toString("hex")}`
);
process.env.SUPPORTNEST_DATA_DIR = RUN_DIR;
process.env.SUPPORTNEST_VAULT_DIR = path.join(RUN_DIR, "vault");
process.env.SUPPORTNEST_SESSION_SECRET = crypto.randomBytes(32).toString("hex");
process.env.SUPPORTNEST_DATA_KEY = crypto.randomBytes(32).toString("base64");

describe("auth / vault stack", () => {
  beforeAll(async () => {
    await import("node:fs/promises").then((fs) =>
      fs.mkdir(RUN_DIR, { recursive: true })
    );
  });

  it("hashes and verifies passwords", async () => {
    const { hashPassword, verifyPassword } = await import("../password");
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).toMatch(/^\$2[aby]\$/);
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(
      true
    );
    expect(await verifyPassword("wrong password", hash)).toBe(false);
  });

  it("validates the registration schema", async () => {
    const { RegisterSchema } = await import("../schema");
    const ok = RegisterSchema.safeParse({
      name: "Maya Patel",
      email: "  Maya@Example.COM ",
      password: "letmein123!",
      role: "parent",
      agree: "on",
    });
    expect(ok.success).toBe(true);
    if (ok.success) {
      expect(ok.data.email).toBe("maya@example.com");
    }

    const tooShort = RegisterSchema.safeParse({
      name: "M",
      email: "not-an-email",
      password: "short",
      role: "parent",
      agree: "on",
    });
    expect(tooShort.success).toBe(false);
  });

  it("creates and finds users; rejects duplicate emails", async () => {
    const { createUser, findByEmail, toSafeUser } = await import("../users");
    const { hashPassword } = await import("../password");
    const hash = await hashPassword("supersecret123");
    const user = await createUser({
      name: "Devon T.",
      email: "devon@example.com",
      role: "teacher",
      passwordHash: hash,
    });
    expect(user.id).toMatch(/[0-9a-f-]{36}/);
    expect(toSafeUser(user)).not.toHaveProperty("passwordHash");

    const found = await findByEmail("DEVON@example.com");
    expect(found?.id).toBe(user.id);

    await expect(
      createUser({
        name: "Other",
        email: "devon@example.com",
        role: "ally",
        passwordHash: hash,
      })
    ).rejects.toThrow(/EMAIL_TAKEN/);
  });

  it("signs and verifies session JWTs", async () => {
    const { encrypt, decrypt } = await import("../session");
    const token = await encrypt({
      userId: "u1",
      email: "a@b",
      expiresAt: new Date(Date.now() + 1000 * 60).toISOString(),
    });
    const back = await decrypt(token);
    expect(back?.userId).toBe("u1");
    expect(await decrypt("not-a-real-token")).toBeNull();
  });

  it("seals and opens vault records, rejecting wrong owner / tamper", async () => {
    const { sealAndStore, openAndDecrypt, listForUser } = await import(
      "@/lib/crypto/vault"
    );
    const userA = "user-a";
    const userB = "user-b";
    const data = Buffer.from("Top secret report contents.\n", "utf8");

    const ref = await sealAndStore({
      userId: userA,
      data,
      contentType: "text/plain",
      filename: "secret.txt",
    });
    expect(ref.byteLength).toBe(data.length);

    const got = await openAndDecrypt(userA, ref.recordId);
    expect(got.equals(data)).toBe(true);

    const list = await listForUser(userA);
    expect(list.length).toBe(1);
    expect(list[0].recordId).toBe(ref.recordId);

    // Wrong-user access fails.
    await expect(openAndDecrypt(userB, ref.recordId)).rejects.toThrow();

    // Tamper: flip a ciphertext byte and ensure decryption fails.
    const fs = await import("node:fs/promises");
    const sha = (await import("node:crypto")).createHash("sha256");
    const userHash = sha.update(userA).digest("hex");
    const filePath = path.join(
      RUN_DIR,
      "vault",
      userHash.slice(0, 2),
      userHash,
      `${ref.recordId}.bin`
    );
    const blob = await fs.readFile(filePath);
    blob[blob.length - 1] ^= 0x01;
    await fs.writeFile(filePath, blob);
    await expect(openAndDecrypt(userA, ref.recordId)).rejects.toThrow();
  });
});
