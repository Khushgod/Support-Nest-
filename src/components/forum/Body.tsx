import { bodyToSegments } from "@/lib/forum/format";

export default function Body({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const { paragraphs } = bodyToSegments(text);
  return (
    <div className={`space-y-3 text-sm text-slate-800 leading-relaxed ${className}`}>
      {paragraphs.map((segs, i) => (
        <p key={i}>
          {segs.map((s, j) =>
            s.kind === "link" ? (
              <a
                key={j}
                href={s.value}
                target="_blank"
                rel="noreferrer noopener"
                className="text-coral-600 underline decoration-coral-300 underline-offset-2 hover:decoration-coral-500 break-all"
              >
                {s.value}
              </a>
            ) : (
              <span key={j}>{s.value}</span>
            )
          )}
        </p>
      ))}
    </div>
  );
}
