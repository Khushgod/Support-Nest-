import {
  AUDIENCE_LABELS,
  CONTENT_NOTE_LABELS,
  type AudienceTag,
  type ContentNote,
} from "@/lib/forum/types";

const AUD_CLASS: Record<AudienceTag, string> = {
  parents: "bg-coral-100 text-coral-700",
  teachers: "bg-lavender-100 text-lavender-700",
  nd_adults: "bg-sun-100 text-sun-800",
  everyone: "bg-cream-200 text-slate-700",
};

export function AudienceChip({ tag }: { tag: AudienceTag }) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${AUD_CLASS[tag]}`}
    >
      {AUDIENCE_LABELS[tag]}
    </span>
  );
}

export function ContentNoteChip({ note }: { note: ContentNote }) {
  return (
    <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
      CN: {CONTENT_NOTE_LABELS[note]}
    </span>
  );
}

export function TagChip({ tag, href }: { tag: string; href?: string }) {
  const cls =
    "inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-cream-100 hover:bg-cream-200 text-slate-700 transition-colors";
  if (href) {
    return (
      <a href={href} className={cls}>
        #{tag}
      </a>
    );
  }
  return <span className={cls}>#{tag}</span>;
}
