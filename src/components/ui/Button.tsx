"use client";

import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 shadow-sm hover:shadow":
            variant === "primary",
          "bg-white text-slate-700 border border-sage-200 hover:bg-sage-50 hover:border-sage-300":
            variant === "secondary",
          "text-slate-600 hover:text-slate-900 hover:bg-sage-100":
            variant === "ghost",
        },
        {
          "text-sm px-3.5 py-2 h-9": size === "sm",
          "text-sm px-5 py-2.5 h-11": size === "md",
          "text-base px-7 py-3 h-13": size === "lg",
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
