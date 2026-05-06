"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "../actions";
import type { LoginFormState } from "@/lib/auth/schema";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginFormState, FormData>(
    login,
    undefined
  );

  return (
    <form action={action} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state?.values?.email}
          className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition"
        />
        {state?.errors?.email?.[0] && (
          <p className="mt-1 text-xs text-coral-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition"
        />
        {state?.errors?.password?.[0] && (
          <p className="mt-1 text-xs text-coral-600">{state.errors.password[0]}</p>
        )}
      </div>

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
        {pending ? "Signing you in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-slate-600">
        New here?{" "}
        <Link href="/register" className="font-medium text-coral-600 hover:text-coral-700">
          Create a free account
        </Link>
      </p>
    </form>
  );
}
