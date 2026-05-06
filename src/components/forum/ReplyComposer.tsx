"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { replyAction, type ReplyFormState } from "@/lib/forum/actions";

export default function ReplyComposer({
  threadId,
  parentReplyId,
  signedIn,
  loginNext,
  placeholder,
  compact = false,
}: {
  threadId: string;
  parentReplyId?: string;
  signedIn: boolean;
  loginNext: string;
  placeholder?: string;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState<ReplyFormState, FormData>(
    replyAction,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // After a successful submit (state cleared), reset the textarea.
  useEffect(() => {
    if (!state && !pending && taRef.current && formRef.current) {
      // We don't have a separate "submitted" signal; rely on user pressing send
      // and the action returning undefined on success.
    }
  }, [state, pending]);

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-dashed border-cream-300 bg-white p-4 text-sm text-slate-600">
        <a
          href={`/login?next=${encodeURIComponent(loginNext)}`}
          className="font-semibold text-coral-600 hover:text-coral-700"
        >
          Log in
        </a>{" "}
        or{" "}
        <a
          href={`/register?next=${encodeURIComponent(loginNext)}`}
          className="font-semibold text-coral-600 hover:text-coral-700"
        >
          create a free account
        </a>{" "}
        to reply. Reading is always open.
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      className={`rounded-2xl border bg-white p-4 ${state?.errors?.body || state?.message ? "border-rose-200" : "border-cream-200"}`}
    >
      <input type="hidden" name="threadId" value={threadId} />
      {parentReplyId && (
        <input type="hidden" name="parentReplyId" value={parentReplyId} />
      )}
      <textarea
        ref={taRef}
        name="body"
        rows={compact ? 2 : 5}
        placeholder={placeholder ?? "Reply with what you'd want to read…"}
        defaultValue={state?.values?.body ?? ""}
        className="w-full resize-y rounded-xl border border-cream-300 bg-cream-50/40 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition"
      />
      {state?.errors?.body?.[0] && (
        <p className="mt-1.5 text-xs text-rose-600">{state.errors.body[0]}</p>
      )}
      {state?.message && (
        <p className="mt-1.5 text-xs text-rose-700">{state.message}</p>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">
          Lead with kindness. Use a content note for heavy topics.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white text-sm font-semibold transition"
        >
          <Send className="w-3.5 h-3.5" />
          {pending ? "Posting…" : "Post reply"}
        </button>
      </div>
    </form>
  );
}
