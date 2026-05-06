import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * At-rest encryption for uploaded files and saved analyses.
 *
 * Algorithm: AES-256-GCM with a 96-bit IV and 128-bit auth tag.
 * Master key: 32 bytes from `SUPPORTNEST_DATA_KEY` (base64 or 64-char hex).
 * Per-record key: HKDF(masterKey, info=`vault:{userId}:{recordId}`).
 *
 * On disk format:
 *   v1<0x01> | userIdLen(1B) | userId(utf8) | recordIdLen(1B) | recordId(utf8)
 *           | iv(12B) | tag(16B) | ciphertext...
 *
 * Files are written with mode 0o600 inside a per-user directory.
 */

const VERSION_BYTE = 0x01;
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;

const VAULT_DIR =
  process.env.SUPPORTNEST_VAULT_DIR ||
  path.join(process.cwd(), ".data", "vault");

function getMasterKey(): Buffer {
  const raw = process.env.SUPPORTNEST_DATA_KEY;
  if (!raw) {
    throw new Error(
      "SUPPORTNEST_DATA_KEY is not set. Generate one with `openssl rand -base64 32` and add to .env.local."
    );
  }
  // Accept hex (64 chars) or base64.
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, "hex");
  }
  const buf = Buffer.from(raw, "base64");
  if (buf.length !== KEY_LEN) {
    throw new Error(
      "SUPPORTNEST_DATA_KEY must decode to 32 bytes (use `openssl rand -base64 32`)."
    );
  }
  return buf;
}

function deriveRecordKey(userId: string, recordId: string): Buffer {
  const info = Buffer.from(`vault:${userId}:${recordId}`, "utf8");
  const salt = Buffer.alloc(0);
  return Buffer.from(
    crypto.hkdfSync("sha256", getMasterKey(), salt, info, KEY_LEN)
  );
}

function userDir(userId: string): string {
  // Hash the userId before using it as a path component to avoid surprises.
  const safe = crypto.createHash("sha256").update(userId).digest("hex");
  return path.join(VAULT_DIR, safe.slice(0, 2), safe);
}

export type SealedRef = {
  userId: string;
  recordId: string;
  byteLength: number;
  contentType?: string;
  filename?: string;
  createdAt: string;
};

export async function sealAndStore(input: {
  userId: string;
  data: Buffer | Uint8Array;
  contentType?: string;
  filename?: string;
}): Promise<SealedRef> {
  if (!input.userId) throw new Error("userId required");
  const recordId = crypto.randomUUID();
  const key = deriveRecordKey(input.userId, recordId);
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const data = Buffer.isBuffer(input.data) ? input.data : Buffer.from(input.data);
  const ct = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();

  const userBuf = Buffer.from(input.userId, "utf8");
  const recBuf = Buffer.from(recordId, "utf8");
  if (userBuf.length > 255 || recBuf.length > 255) {
    throw new Error("userId/recordId too long");
  }

  const blob = Buffer.concat([
    Buffer.from([0x76, VERSION_BYTE]), // 'v', 0x01
    Buffer.from([userBuf.length]),
    userBuf,
    Buffer.from([recBuf.length]),
    recBuf,
    iv,
    tag,
    ct,
  ]);

  const dir = userDir(input.userId);
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });

  const filePath = path.join(dir, `${recordId}.bin`);
  await fs.writeFile(filePath, blob, { mode: 0o600 });

  // Sidecar metadata (not encrypted; contains only filename + content-type, no PII unless caller adds it).
  const meta = {
    userId: input.userId,
    recordId,
    contentType: input.contentType ?? null,
    filename: input.filename ?? null,
    byteLength: data.byteLength,
    createdAt: new Date().toISOString(),
  };
  await fs.writeFile(
    path.join(dir, `${recordId}.json`),
    JSON.stringify(meta, null, 2),
    { mode: 0o600 }
  );

  return {
    userId: input.userId,
    recordId,
    byteLength: data.byteLength,
    contentType: input.contentType,
    filename: input.filename,
    createdAt: meta.createdAt,
  };
}

export async function openAndDecrypt(
  userId: string,
  recordId: string
): Promise<Buffer> {
  const dir = userDir(userId);
  const filePath = path.join(dir, `${recordId}.bin`);
  const blob = await fs.readFile(filePath);

  let off = 0;
  if (blob[off++] !== 0x76 || blob[off++] !== VERSION_BYTE) {
    throw new Error("Unrecognized vault format.");
  }
  const userLen = blob[off++];
  const storedUser = blob.subarray(off, off + userLen).toString("utf8");
  off += userLen;
  const recLen = blob[off++];
  const storedRec = blob.subarray(off, off + recLen).toString("utf8");
  off += recLen;

  if (storedUser !== userId || storedRec !== recordId) {
    throw new Error("Vault record ownership mismatch.");
  }

  const iv = blob.subarray(off, off + IV_LEN);
  off += IV_LEN;
  const tag = blob.subarray(off, off + TAG_LEN);
  off += TAG_LEN;
  const ct = blob.subarray(off);

  const key = deriveRecordKey(userId, recordId);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]);
}

export async function listForUser(userId: string): Promise<SealedRef[]> {
  const dir = userDir(userId);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  const out: SealedRef[] = [];
  for (const name of entries) {
    if (!name.endsWith(".json")) continue;
    try {
      const meta = JSON.parse(
        await fs.readFile(path.join(dir, name), "utf8")
      );
      if (meta.userId === userId && typeof meta.recordId === "string") {
        out.push({
          userId,
          recordId: meta.recordId,
          byteLength: meta.byteLength ?? 0,
          contentType: meta.contentType ?? undefined,
          filename: meta.filename ?? undefined,
          createdAt: meta.createdAt ?? new Date(0).toISOString(),
        });
      }
    } catch {
      // ignore corrupt sidecars
    }
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteRecord(
  userId: string,
  recordId: string
): Promise<void> {
  const dir = userDir(userId);
  await Promise.allSettled([
    fs.rm(path.join(dir, `${recordId}.bin`)),
    fs.rm(path.join(dir, `${recordId}.json`)),
  ]);
}
