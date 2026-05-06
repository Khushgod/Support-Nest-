import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(80, "Name is too long.")
    .trim(),
  email: z
    .preprocess(
      (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
      z.string().email("Please enter a valid email address.")
    ),
  password: z
    .string()
    .min(10, "Use at least 10 characters.")
    .max(128, "Password is too long.")
    .regex(/[a-zA-Z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
  role: z.enum(["parent", "teacher", "neurodivergent_adult", "ally"]),
  agree: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .refine((v) => v === "on" || v === "true" || v === true, {
      message: "Please agree to the Privacy & Community policies.",
    }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
    z.string().email("Please enter a valid email address.")
  ),
  password: z.string().min(1, "Please enter your password."),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export type SessionPayload = {
  userId: string;
  email: string;
  expiresAt: string;
  [key: string]: unknown;
};

export type RegisterFormState =
  | {
      ok?: false;
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
        agree?: string[];
      };
      message?: string;
      values?: { name?: string; email?: string; role?: string };
    }
  | undefined;

export type LoginFormState =
  | {
      ok?: false;
      errors?: { email?: string[]; password?: string[] };
      message?: string;
      values?: { email?: string };
    }
  | undefined;

export type Role = RegisterInput["role"];

export const ROLE_LABELS: Record<Role, string> = {
  parent: "Parent or caregiver",
  teacher: "Teacher or therapist",
  neurodivergent_adult: "Neurodivergent adult",
  ally: "Friend, family member, or ally",
};
