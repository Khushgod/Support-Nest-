"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  AUDIENCE_LABELS,
  CONTENT_NOTE_LABELS,
  SPACES,
  type AudienceTag,
  type ContentNote,
  type SpaceId,
} from "@/lib/forum/types";
import {
  createThreadAction,
  type NewThreadFormState,
} from "@/lib/forum/actions";

const DRAFT_KEY = "supportnest_thread_draft_v1";

const AUDIENCE_OPTIONS: AudienceTag[] = [
  "everyone",
  "parents",
  "teachers",
  "nd_adults",
];

const NOTE_ENTRIES = Object.entries(CONTENT_NOTE_LABELS) as [
  ContentNote,
  string,
][];

export default function NewThreadForm({
  initialSpace,
}: {
  initialSpace: SpaceId;
}) {
  const [state, action, pending] = useActionState<NewThreadFormState, FormData>(
    createThreadAction,
    undefined
  );

  type FormState = {
    spaceId: SpaceId;
    title: string;
    body: string;
    tags: string;
    audience: AudienceTag[];
    notes: ContentNote[];
  };

  const [form, setForm] = useState<FormState>({
    spaceId: (state?.values?.spaceId as SpaceId) || initialSpace,
    title: state?.values?.title ?? "",
    body: state?.values?.body ?? "",
    tags: state?.values?.tags ?? "",
    audience: (state?.values?.audience as AudienceTag[]) || ["everyone"],
    notes: (state?.values?.notes as ContentNote[]) || [],
  });
  const { spaceId, title, body, tags, audience, notes } = form;
  const setSpaceId = (v: SpaceId) => setForm((f) => ({ ...f, spaceId: v }));
  const setTitle = (v: string) => setForm((f) => ({ ...f, title: v }));
  const setBody = (v: string) => setForm((f) => ({ ...f, body: v }));
  const setTags = (v: string) => setForm((f) => ({ ...f, tags: v }));
  const setAudience = (
    update: AudienceTag[] | ((curr: AudienceTag[]) => AudienceTag[])
  ) =>
    setForm((f) => ({
      ...f,
      audience: typeof update === "function" ? update(f.audience) : update,
    }));
  const setNotes = (
    update: ContentNote[] | ((curr: ContentNote[]) => ContentNote[])
  ) =>
    setForm((f) => ({
      ...f,
      notes: typeof update === "function" ? update(f.notes) : update,
    }));
  const hydratedRef = useRef(false);

  // SSR-safe localStorage hydration: render the server's initial state, then
  // merge the user's draft on mount via a single setState.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<FormState>;
        // SSR-safe hydration; see SensoryClient/IepClient for rationale.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm((f) => {
          const next = { ...f };
          if (draft.spaceId && SPACES.some((s) => s.id === draft.spaceId)) {
            next.spaceId = draft.spaceId;
          }
          if (typeof draft.title === "string" && draft.title) next.title = draft.title;
          if (typeof draft.body === "string" && draft.body) next.body = draft.body;
          if (typeof draft.tags === "string" && draft.tags) next.tags = draft.tags;
          if (Array.isArray(draft.audience)) next.audience = draft.audience;
          if (Array.isArray(draft.notes)) next.notes = draft.notes;
          return next;
        });
      }
    } catch {
      // ignore corrupt drafts
    }
    hydratedRef.current = true;
  }, []);

  // Save draft on every change after hydration.
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ spaceId, title, body, tags, audience, notes })
      );
    } catch {
      // ignore
    }
  }, [spaceId, title, body, tags, audience, notes]);

  // On a successful submit (server action redirects so we never get here),
  // the form unmounts. If the action returns an error, we keep the values.

  function toggleAudience(a: AudienceTag) {
    setAudience((curr) => {
      if (curr.includes(a)) return curr.filter((x) => x !== a);
      // "everyone" is the catch-all; if the user picks something else, drop it.
      const next =
        a === "everyone" ? ["everyone" as AudienceTag] : [...curr.filter((x) => x !== "everyone"), a];
      return next;
    });
  }

  function toggleNote(n: ContentNote) {
    setNotes((curr) =>
      curr.includes(n) ? curr.filter((x) => x !== n) : [...curr, n]
    );
  }

  function clearDraft() {
    if (!confirm("Clear this draft? Anything you've typed will be lost.")) return;
    setSpaceId(initialSpace);
    setTitle("");
    setBody("");
    setTags("");
    setAudience(["everyone"]);
    setNotes([]);
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="spaceId" value={spaceId} />
      {audience.map((a) => (
        <input key={a} type="hidden" name="audience" value={a} />
      ))}
      {notes.map((n) => (
        <input key={n} type="hidden" name="notes" value={n} />
      ))}

      <Field label="Space">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SPACES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSpaceId(s.id)}
              className={`text-left rounded-2xl border p-3 transition ${spaceId === s.id ? "border-coral-400 bg-coral-50/60" : "border-cream-200 hover:bg-cream-50"}`}
            >
              <div className="text-sm font-semibold text-slate-900">
                {s.name}
              </div>
              <p className="mt-0.5 text-xs text-slate-600">{s.blurb}</p>
            </button>
          ))}
        </div>
        {state?.errors?.spaceId?.[0] && (
          <p className="mt-1 text-xs text-rose-600">{state.errors.spaceId[0]}</p>
        )}
      </Field>

      <Field label="Title">
        <input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's this about? Specific is better than clever."
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-coral-200/60 transition ${state?.errors?.title?.[0] ? "border-rose-300 focus:border-rose-400" : "border-cream-300 focus:border-coral-400"}`}
        />
        <div className="mt-1 flex items-center justify-between">
          {state?.errors?.title?.[0] ? (
            <p className="text-xs text-rose-600">{state.errors.title[0]}</p>
          ) : (
            <span className="text-[11px] text-slate-500">
              8–200 characters
            </span>
          )}
          <span className="text-[11px] text-slate-400 tabular-nums">
            {title.length} / 200
          </span>
        </div>
      </Field>

      <Field label="Post body">
        <textarea
          name="body"
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={"Share what's on your mind. Bullet points and links are fine. Plain text only — no markdown.\n\nLead with kindness."}
          className={`w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-coral-200/60 transition ${state?.errors?.body?.[0] ? "border-rose-300 focus:border-rose-400" : "border-cream-300 focus:border-coral-400"}`}
        />
        <div className="mt-1 flex items-center justify-between">
          {state?.errors?.body?.[0] ? (
            <p className="text-xs text-rose-600">{state.errors.body[0]}</p>
          ) : (
            <span className="text-[11px] text-slate-500">
              At least one or two sentences. URLs autolink on display.
            </span>
          )}
          <span className="text-[11px] text-slate-400 tabular-nums">
            {body.length} / 8,000
          </span>
        </div>
      </Field>

      <Field label="Audience tags (who is this for?)">
        <div className="flex flex-wrap gap-2">
          {AUDIENCE_OPTIONS.map((a) => {
            const on = audience.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAudience(a)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${on ? "bg-coral-50 border-coral-400 text-coral-700" : "border-cream-300 text-slate-700 hover:bg-cream-50"}`}
              >
                {AUDIENCE_LABELS[a]}
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Threads marked &ldquo;Everyone&rdquo; show up for all members.
          Specific audiences can still be read by anyone.
        </p>
      </Field>

      <Field label="Content notes (heads-up for heavy topics)">
        <div className="flex flex-wrap gap-2">
          {NOTE_ENTRIES.map(([value, label]) => {
            const on = notes.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleNote(value)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${on ? "bg-rose-50 border-rose-300 text-rose-800" : "border-cream-300 text-slate-700 hover:bg-cream-50"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Optional. Lets readers opt in to heavy topics with eyes open.
        </p>
      </Field>

      <Field label="Tags (comma- or space-separated, optional)">
        <input
          name="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., diagnosis, intro, IEP"
          className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition"
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Up to 6 tags. Lowercased automatically.
        </p>
      </Field>

      {state?.message && !state.errors && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800">
          {state.message}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-cream-100">
        <button
          type="button"
          onClick={clearDraft}
          className="text-xs text-slate-500 hover:text-coral-600"
        >
          Clear draft
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white text-sm font-semibold transition shadow-sm"
        >
          {pending ? "Posting…" : "Post thread"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
