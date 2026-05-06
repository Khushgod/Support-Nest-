import Link from "next/link";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? 32 : size === "lg" ? 56 : 40;
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <span
        aria-hidden
        className="relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-coral-400 via-sun-300 to-lavender-300 group-hover:from-coral-500 group-hover:to-lavender-400 transition-colors shadow-sm"
        style={{ width: dim, height: dim }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          width={dim * 0.62}
          height={dim * 0.62}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {/* Stylized nest cradling a heart */}
          <path d="M5 21c2-4 6-6 11-6s9 2 11 6" />
          <path d="M3.5 22.5c3.5 2.5 7.5 4 12.5 4s9-1.5 12.5-4" />
          <path
            d="M16 13.5c-1.6-2.4-5-2.2-5 0.6 0 2.4 3.2 4.4 5 5.4 1.8-1 5-3 5-5.4 0-2.8-3.4-3-5-0.6z"
            fill="white"
            stroke="none"
          />
        </svg>
      </span>
      <span className={`${text} font-semibold text-slate-900 tracking-tight`}>
        Support<span className="text-coral-500">Nest</span>
      </span>
    </Link>
  );
}
