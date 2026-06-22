import "server-only";

import crypto from "node:crypto";
import db from "@/lib/db";
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

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  password_hash: string;
  created_at: string;
};

function rowToRecord(row: UserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as Role,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

export function toSafeUser(user: UserRecord): SafeUser {
  const { passwordHash: _omit, ...rest } = user;
  void _omit;
  return rest;
}

export async function findByEmail(email: string): Promise<UserRecord | null> {
  const lower = email.trim().toLowerCase();
  const row = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(lower) as UserRow | undefined;
  return row ? rowToRecord(row) : null;
}

export async function findById(id: string): Promise<UserRecord | null> {
  const row = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(id) as UserRow | undefined;
  return row ? rowToRecord(row) : null;
}

export async function createUser(input: {
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
}): Promise<UserRecord> {
  const lower = input.email.trim().toLowerCase();
  const user: UserRecord = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: lower,
    role: input.role,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };

  try {
    db.prepare(
      `INSERT INTO users (id, name, email, role, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      user.id,
      user.name,
      user.email,
      user.role,
      user.passwordHash,
      user.createdAt
    );
  } catch (e: unknown) {
    if (
      e instanceof Error &&
      e.message.includes("UNIQUE constraint failed: users.email")
    ) {
      throw new Error("EMAIL_TAKEN");
    }
    throw e;
  }

  return user;
}
