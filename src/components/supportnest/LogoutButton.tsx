"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/actions";

export default function LogoutButton({
  variant = "ghost",
}: {
  variant?: "ghost" | "primary";
}) {
  const [pending, start] = useTransition();
  const cls =
    variant === "primary"
      ? "px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold"
      : "px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-coral-600 hover:bg-cream-100";
  return (
    <button
      type="button"
      onClick={() => start(() => logout())}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 ${cls} transition disabled:opacity-60`}
    >
      <LogOut className="w-3.5 h-3.5" />
      {pending ? "Signing out…" : "Log out"}
    </button>
  );
}
