"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookmarkPlus, BookmarkCheck } from "lucide-react";
import type { Resource } from "./_collection";
import { articleHref } from "./_content";

const FORMAT_STYLES: Record<Resource["format"], string> = {
  Article: "bg-coral-100 text-coral-700",
  Script: "bg-lavender-100 text-lavender-700",
  Checklist: "bg-sun-100 text-sun-700",
  Tool: "bg-cream-200 text-slate-700",
  "Reading list": "bg-white border border-cream-200 text-slate-700",
};

const SHELF_KEY = "supportnest:shelf";

function readShelf(): string[] {
  try {
    const raw = localStorage.getItem(SHELF_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ResourceCard({ r }: { r: Resource }) {
  const [saved, setSaved] = useState(false);
  // The GeneTranslate tool and any internal /tools link keep their own
  // destination. Everything else resolves to an in-app article page that we
  // open in a new tab, so the reader can return to the library easily.
  const keepsOwnHref = r.format === "Tool" || r.href.startsWith("/tools");
  const articleUrl = articleHref(r.title);

  useEffect(() => {
    const sync = () => setSaved(readShelf().includes(r.title));
    sync();
    window.addEventListener("supportnest:shelf-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("supportnest:shelf-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [r.title]);

  function toggleSave() {
    const shelf = readShelf();
    const next = shelf.includes(r.title)
      ? shelf.filter((t) => t !== r.title)
      : [...shelf, r.title];
    try {
      localStorage.setItem(SHELF_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable (private mode) — keep optimistic UI state */
    }
    setSaved(next.includes(r.title));
    // Let other cards / the shelf page react to the change.
    window.dispatchEvent(new Event("supportnest:shelf-changed"));
  }

  return (
    <li className="group rounded-2xl border border-cream-200 bg-white p-5 hover:shadow-[var(--shadow-primary-card)] transition flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${FORMAT_STYLES[r.format]}`}
        >
          {r.format}
        </span>
        {r.minutes && (
          <span className="text-[11px] text-slate-500">{r.minutes} min</span>
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900 leading-snug">
        {r.title}
      </h3>
      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{r.desc}</p>
      <div className="mt-4 flex items-center justify-between">
        {keepsOwnHref ? (
          <Link
            href={r.href}
            className="text-xs font-medium text-coral-600 hover:text-coral-700 inline-flex items-center gap-1"
          >
            {r.format === "Tool" ? "Open" : "Read"}{" "}
            <ArrowRight className="w-3 h-3" />
          </Link>
        ) : (
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-coral-600 hover:text-coral-700 inline-flex items-center gap-1"
          >
            Read <ArrowRight className="w-3 h-3" />
          </a>
        )}
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          className={`text-xs inline-flex items-center gap-1 transition-colors ${
            saved
              ? "text-coral-600 hover:text-coral-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
          aria-label={
            saved
              ? `Remove ${r.title} from your shelf`
              : `Save ${r.title} to your shelf`
          }
        >
          {saved ? (
            <BookmarkCheck className="w-3.5 h-3.5" />
          ) : (
            <BookmarkPlus className="w-3.5 h-3.5" />
          )}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </li>
  );
}
