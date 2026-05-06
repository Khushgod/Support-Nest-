import { clsx } from "clsx";

interface BadgeProps {
  variant?: "info" | "success" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = "neutral",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
        {
          "bg-sky-100 text-sky-700": variant === "info",
          "bg-green-100 text-green-600": variant === "success",
          "bg-warm-100 text-warm-700": variant === "warning",
          "bg-rose-100 text-rose-700": variant === "danger",
          "bg-slate-100 text-slate-600": variant === "neutral",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
