import { clsx } from "clsx";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

export default function Alert({
  variant = "info",
  title,
  children,
  className,
}: AlertProps) {
  const Icon = icons[variant];

  return (
    <div
      className={clsx(
        "flex gap-3 rounded-xl p-4 text-sm",
        {
          "bg-sky-50 text-sky-800 border border-sky-200": variant === "info",
          "bg-green-50 text-green-800 border border-green-200":
            variant === "success",
          "bg-warm-50 text-warm-800 border border-warm-200":
            variant === "warning",
          "bg-rose-50 text-rose-800 border border-rose-200":
            variant === "error",
        },
        className
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
