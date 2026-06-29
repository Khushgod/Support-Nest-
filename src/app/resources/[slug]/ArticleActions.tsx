"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Bell, BellRing } from "lucide-react";

const SHELF_KEY = "supportnest:shelf";
const FOLLOW_KEY = "supportnest:following";
const REACT_KEY = "supportnest:reactions";

// A small, friendly reaction set with seed counts so the bar feels alive.
const REACTIONS: { emoji: string; label: string; base: number }[] = [
  { emoji: "❤️", label: "This helped", base: 9 },
  { emoji: "🫂", label: "Heard", base: 12 },
  { emoji: "💡", label: "Learned something", base: 6 },
];

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode) — keep optimistic UI state */
  }
}

export default function ArticleActions({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [mine, setMine] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setSaved(readList(SHELF_KEY).includes(title));
      setFollowing(readList(FOLLOW_KEY).includes(title));
      setMine(readList(REACT_KEY).filter((k) => k.startsWith(`${title}::`)));
    };
    sync();
    window.addEventListener("supportnest:shelf-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("supportnest:shelf-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [title]);

  function toggleSave() {
    const list = readList(SHELF_KEY);
    const next = list.includes(title)
      ? list.filter((t) => t !== title)
      : [...list, title];
    writeList(SHELF_KEY, next);
    setSaved(next.includes(title));
    window.dispatchEvent(new Event("supportnest:shelf-changed"));
  }

  function toggleFollow() {
    const list = readList(FOLLOW_KEY);
    const next = list.includes(title)
      ? list.filter((t) => t !== title)
      : [...list, title];
    writeList(FOLLOW_KEY, next);
    setFollowing(next.includes(title));
  }

  function toggleReaction(label: string) {
    const id = `${title}::${label}`;
    const list = readList(REACT_KEY);
    const next = list.includes(id)
      ? list.filter((k) => k !== id)
      : [...list, id];
    writeList(REACT_KEY, next);
    setMine(next.filter((k) => k.startsWith(`${title}::`)));
  }

  const total = REACTIONS.reduce(
    (sum, r) => sum + r.base + (mine.includes(`${title}::${r.label}`) ? 1 : 0),
    0
  );

  return (
    <footer className="mt-7 flex items-center justify-between gap-3 flex-wrap pt-5 border-t border-cream-100">
      <div className="flex items-center gap-2 flex-wrap">
        {REACTIONS.map((r) => {
          const isMine = mine.includes(`${title}::${r.label}`);
          return (
            <button
              key={r.label}
              type="button"
              onClick={() => toggleReaction(r.label)}
              aria-pressed={isMine}
              title={r.label}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                isMine
                  ? "border-coral-300 bg-coral-50 text-coral-700"
                  : "border-cream-200 bg-white text-slate-600 hover:border-coral-200"
              }`}
            >
              <span aria-hidden>{r.emoji}</span>
              {r.base + (isMine ? 1 : 0)}
            </button>
          );
        })}
        <span className="text-xs text-slate-500">{total} reactions</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-sm font-medium transition-colors ${
            saved
              ? "border-coral-300 bg-coral-50 text-coral-700"
              : "border-cream-200 bg-white text-slate-700 hover:bg-cream-50"
          }`}
        >
          {saved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          {saved ? "Saved" : "Bookmark"}
        </button>
        <button
          type="button"
          onClick={toggleFollow}
          aria-pressed={following}
          className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-sm font-medium transition-colors ${
            following
              ? "border-lavender-300 bg-lavender-50 text-lavender-700"
              : "border-cream-200 bg-white text-slate-700 hover:bg-cream-50"
          }`}
        >
          {following ? (
            <BellRing className="w-4 h-4" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
          {following ? "Following" : "Follow"}
        </button>
      </div>
    </footer>
  );
}
