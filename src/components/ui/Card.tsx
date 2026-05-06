import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export default function Card({
  children,
  className,
  padding = "md",
  style,
}: CardProps) {
  return (
    <div
      style={style}
      className={clsx(
        "bg-white rounded-2xl border border-sage-200 shadow-sm",
        {
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        className
      )}
    >
      {children}
    </div>
  );
}
