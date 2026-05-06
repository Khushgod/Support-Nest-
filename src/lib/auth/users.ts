import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Role } from "./schema";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
};

export type SafeUser = Omit<UserRecord, "passwordHash">;

type Store = {
  version: 1;
  users: UserRecord[];
};

const DATA_DIR =
  process.env.SUPPORTNEST_DATA_DIR ||
  path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    const empty: Store = { version: 1, users: [] };
    await fs.writeFile(USERS_FILE, JSON.stringify(empty, null, 2), {
      mode: 0o600,
    });
  }
}

async function read(): Promise<Store> {
  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && Array.isArray(parsed.users)) {
      return parsed as Store;
    }
  } catch {
    // fallthrough
  }
  return { version: 1, users: [] };
}

async function write(store: Store): Promise<void> {
  const tmp = USERS_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), { mode: 0o600 });
  await fs.rename(tmp, USERS_FILE);
}

export function toSafeUser(user: UserRecord): SafeUser {
  const { passwordHash: _omit, ...rest } = user;
  void _omit;
  return rest;
}

export async function findByEmail(email: string): Promise<UserRecord | null> {
  const lower = email.trim().toLowerCase();
  const store = await read();
  return store.users.find((u) => u.email === lower) ?? null;
}

export async function findById(id: string): Promise<UserRecord | null> {
  const store = await read();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
}): Promise<UserRecord> {
  const store = await read();
  const lower = input.email.trim().toLowerCase();
  if (store.users.some((u) => u.email === lower)) {
    throw new Error("EMAIL_TAKEN");
  }
  const user: UserRecord = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: lower,
    role: input.role,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await write(store);
  return user;
}
