"use client";

import { useTransition } from "react";
import { reactAction } from "@/lib/forum/actions";
import {
  REACTION_LABELS,
  REACTION_ORDER,
  type ReactionEmoji,
} from "@/lib/forum/types";

export default function ReactionBar({
  targetType,
  targetId,
  counts,
  mine,
  total,
  returnTo,
  signedIn,
}: {
  targetType: "thread" | "reply";
  targetId: string;
  counts: Record<ReactionEmoji, number>;
  mine: ReactionEmoji[];
  total: number;
  returnTo: string;
  signedIn: boolean;
}) {
  const [pending, start] = useTransition();
  // Show reactions that have at least one count, plus a small picker for the rest.
  const visible = REACTION_ORDER.filter((e) => counts[e] > 0 || mine.includes(e));
  const rest = REACTION_ORDER.filter((e) => !visible.includes(e));

  const click = (emoji: ReactionEmoji) => {
    if (!signedIn) {
      window.location.assign(`/login?next=${encodeURIComponent(returnTo)}`);
      return;
    }
    const fd = new FormData();
    fd.set("targetType", targetType);
    fd.set("targetId", targetId);
    fd.set("emoji", emoji);
    fd.set("returnTo", returnTo);
    start(() => reactAction(fd));
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {visible.map((e) => {
        const meta = REACTION_LABELS[e];
        const on = mine.includes(e);
        return (
          <button
            key={e}
            type="button"
            onClick={() => click(e)}
            disabled={pending}
            aria-label={`${on ? "Remove" : "Add"} ${meta.label} reaction`}
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition ${on ? "bg-coral-50 border-coral-300 text-coral-800" : "bg-white border-cream-300 text-slate-700 hover:bg-cream-100"}`}
          >
            <span aria-hidden>{meta.glyph}</span>
            <span className="font-semibold tabular-nums">{counts[e]}</span>
          </button>
        );
      })}

      {rest.length > 0 && (
        <details className="relative inline-block">
          <summary className="list-none cursor-pointer inline-flex items-center px-2 py-0.5 rounded-full border border-dashed border-cream-300 text-[11px] text-slate-500 hover:bg-cream-50 hover:text-coral-600">
            + react
          </summary>
          <div className="absolute left-0 top-7 z-20 rounded-2xl border border-cream-200 bg-white shadow-lg p-2 flex gap-1 flex-wrap w-64">
            {rest.map((e) => {
              const meta = REACTION_LABELS[e];
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => click(e)}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs hover:bg-cream-100"
                  aria-label={`Add ${meta.label}`}
                >
                  <span aria-hidden>{meta.glyph}</span>
                  <span className="text-slate-700">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </details>
      )}

      {total > 0 && (
        <span className="text-[11px] text-slate-500 ml-1">
          {total} reaction{total === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
}
