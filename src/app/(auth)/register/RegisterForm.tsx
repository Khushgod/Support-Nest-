"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "../actions";
import { ROLE_LABELS, type RegisterFormState } from "@/lib/auth/schema";

const ROLES = Object.entries(ROLE_LABELS) as [
  keyof typeof ROLE_LABELS,
  string,
][];

export default function RegisterForm() {
  const [state, action, pending] = useActionState<RegisterFormState, FormData>(
    register,
    undefined
  );

  return (
    <form action={action} className="space-y-4" noValidate>
      <Field
        id="name"
        name="name"
        label="Your name"
        autoComplete="name"
        defaultValue={state?.values?.name}
        errors={state?.errors?.name}
      />

      <Field
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        defaultValue={state?.values?.email}
        errors={state?.errors?.email}
      />

      <div>
        <label
          htmlFor="role"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Which best describes you?
        </label>
        <select
          id="role"
          name="role"
          defaultValue={state?.values?.role ?? "parent"}
          className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition"
        >
          {ROLES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {state?.errors?.role?.[0] && (
          <p className="mt-1 text-xs text-coral-600">{state.errors.role[0]}</p>
        )}
      </div>

      <Field
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        helperText="At least 10 characters with a letter and a number."
        errors={state?.errors?.password}
      />

      <label className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
        <input
          type="checkbox"
          name="agree"
          className="mt-0.5 h-4 w-4 rounded border-cream-300 text-coral-500 focus:ring-coral-300"
        />
        <span>
          I agree to the SupportNest{" "}
          <Link href="/community" className="underline hover:text-coral-600">
            Community Guidelines
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-coral-600">
            Privacy &amp; Security
          </Link>
          .
        </span>
      </label>
      {state?.errors?.agree?.[0] && (
        <p className="-mt-2 text-xs text-coral-600">{state.errors.agree[0]}</p>
      )}

      {state?.message && (
        <div className="rounded-xl border border-coral-200 bg-coral-50 px-3.5 py-2.5 text-sm text-coral-800">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white text-sm font-semibold transition shadow-sm"
      >
        {pending ? "Creating your nest…" : "Create my free account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-coral-600 hover:text-coral-700">
          Log in
        </Link>
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  defaultValue,
  helperText,
  errors,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  helperText?: string;
  errors?: string[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-slate-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition"
      />
      {helperText && !errors?.[0] && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
      {errors && errors.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {errors.map((e) => (
            <li key={e} className="text-xs text-coral-600">
              {e}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
