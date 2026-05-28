import Link from "next/link";
import {
  MessageCircle,
  Pin,
  Lock,
  Eye,
  Clock,
} from "lucide-react";
import {
  AudienceChip,
  ContentNoteChip,
  TagChip,
} from "./AudienceChips";
import { snippet, timeAgo } from "@/lib/forum/format";
import type { ThreadView } from "@/lib/forum/types";
import { REACTION_LABELS, REACTION_ORDER } from "@/lib/forum/types";

export default function ThreadCard({
  thread,
  bookmarked = false,
  showSpace = false,
}: {
  thread: ThreadView;
  bookmarked?: boolean;
  showSpace?: boolean;
}) {
  const href = `/community/${thread.spaceId}/${thread.id}`;
  const top = REACTION_ORDER.filter((e) => thread.reactionCounts[e] > 0).slice(
    0,
    3
  );

  return (
    <Link
      href={href}
      className="block rounded-3xl border border-cream-200 bg-white p-5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-primary-card)] transition"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {showSpace && (
            <span className="text-[11px] font-medium uppercase tracking-wider text-coral-600">
              {thread.spaceName}
            </span>
          )}
          {thread.isPinned && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sun-100 text-sun-800">
              <Pin className="w-3 h-3" /> Pinned
            </span>
          )}
          {thread.isLocked && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-slate-700">
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
          {thread.audienceTags.map((a) => (
            <AudienceChip key={a} tag={a} />
          ))}
        </div>
        {bookmarked && (
          <span className="text-[11px] text-coral-600 font-semibold">
            Bookmarked
          </span>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
        {thread.title}
      </h3>
      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
        {snippet(thread.body, 220)}
      </p>

      {thread.contentNotes.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {thread.contentNotes.map((n) => (
            <ContentNoteChip key={n} note={n} />
          ))}
        </div>
      )}

      {thread.tags.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {thread.tags.slice(0, 5).map((t) => (
            <TagChip key={t} tag={t} />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap text-xs text-slate-500">
        <div className="flex items-center gap-3 flex-wrap">
          <span>
            by{" "}
            <span className="font-medium text-slate-700">
              {thread.author?.handle ?? "former member"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(thread.lastActivityAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {thread.replyCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {thread.viewCount}
          </span>
        </div>
        {top.length > 0 && (
          <div className="flex items-center gap-1.5">
            {top.map((e) => (
              <span
                key={e}
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-700"
                title={REACTION_LABELS[e].label}
              >
                <span aria-hidden>{REACTION_LABELS[e].glyph}</span>
                {thread.reactionCounts[e]}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
