import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { readSession } from "./session";
import { findById, toSafeUser, type SafeUser } from "./users";

export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  const session = await readSession();
  if (!session?.userId) return null;
  const user = await findById(session.userId);
  if (!user) return null;
  return toSafeUser(user);
});

export const requireUser = cache(async (): Promise<SafeUser> => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
});
