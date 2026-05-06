"use server";

import { redirect } from "next/navigation";
import {
  RegisterSchema,
  LoginSchema,
  type LoginFormState,
  type RegisterFormState,
} from "@/lib/auth/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createUser, findByEmail } from "@/lib/auth/users";
import { createSession, deleteSession } from "@/lib/auth/session";

export async function register(
  _state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    agree: formData.get("agree"),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      values: {
        name: typeof raw.name === "string" ? raw.name : "",
        email: typeof raw.email === "string" ? raw.email : "",
        role: typeof raw.role === "string" ? raw.role : "",
      },
    };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await findByEmail(email);
  if (existing) {
    return {
      ok: false,
      message: "An account already exists for that email. Try logging in.",
      values: { name, email, role },
    };
  }

  let user;
  try {
    const passwordHash = await hashPassword(password);
    user = await createUser({ name, email, role, passwordHash });
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error && err.message === "EMAIL_TAKEN"
          ? "An account already exists for that email."
          : "Something went wrong creating your account. Please try again.",
      values: { name, email, role },
    };
  }

  await createSession(user.id, user.email);
  redirect("/dashboard?welcome=1");
}

export async function login(
  _state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      values: { email: typeof raw.email === "string" ? raw.email : "" },
    };
  }

  const { email, password } = parsed.data;
  const user = await findByEmail(email);

  // Constant-ish-time miss: still hash to avoid trivial enumeration.
  const stored =
    user?.passwordHash ??
    "$2a$12$0000000000000000000000000000000000000000000000000000";
  const ok = await verifyPassword(password, stored);

  if (!user || !ok) {
    return {
      ok: false,
      message: "Email or password didn't match. Please try again.",
      values: { email },
    };
  }

  await createSession(user.id, user.email);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
