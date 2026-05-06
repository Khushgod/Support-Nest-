"use client";

import { useState, useTransition } from "react";
import { Reply, Trash2 } from "lucide-react";
import Body from "./Body";
import ReactionBar from "./ReactionBar";
import { timeAgo } from "@/lib/forum/format";
import { deleteReplyAction } from "@/lib/forum/actions";
import type { ReplyView, ReactionEmoji } from "@/lib/forum/types";
import ReplyComposer from "./ReplyComposer";

export default function ReplyCard({
  reply,
  myReactions,
  isOwn,
  signedIn,
  threadId,
  returnTo,
  threadLocked,
}: {
  reply: ReplyView;
  myReactions: ReactionEmoji[];
  isOwn: boolean;
  signedIn: boolean;
  threadId: string;
  returnTo: string;
  threadLocked: boolean;
}) {
  const [showReply, setShowReply] = useState(false);
  const [pending, start] = useTransition();

  const onDelete = () => {
    if (!confirm("Delete this reply?")) return;
    const fd = new FormData();
    fd.set("replyId", reply.id);
    fd.set("returnTo", returnTo);
    start(() => deleteReplyAction(fd));
  };

  return (
    <article
      id={`r-${reply.id}`}
      className="rounded-2xl border border-cream-200 bg-white p-5"
    >
      <header className="flex items-center gap-3 flex-wrap mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-300 to-lavender-300" />
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {reply.author?.handle ?? "former member"}
            </div>
            <div className="text-[11px] text-slate-500">
              {timeAgo(reply.createdAt)}
              {reply.editedAt ? " · edited" : ""}
            </div>
          </div>
        </div>
      </header>

      <Body text={reply.body} />

      <footer className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <ReactionBar
          targetType="reply"
          targetId={reply.id}
          counts={reply.reactionCounts}
          mine={myReactions}
          total={reply.totalReactions}
          returnTo={returnTo}
          signedIn={signedIn}
        />
        <div className="flex items-center gap-1">
          {!threadLocked && (
            <button
              type="button"
              onClick={() => setShowReply((v) => !v)}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-cream-100 text-slate-600"
            >
              <Reply className="w-3.5 h-3.5" />
              {showReply ? "Cancel" : "Reply"}
            </button>
          )}
          {isOwn && (
            <button
              type="button"
              onClick={onDelete}
              disabled={pending}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-cream-100 text-slate-500 hover:text-rose-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      </footer>

      {showReply && !threadLocked && (
        <div className="mt-4">
          <ReplyComposer
            threadId={threadId}
            parentReplyId={reply.id}
            signedIn={signedIn}
            loginNext={returnTo}
            placeholder={`Replying to ${reply.author?.handle ?? "this member"}…`}
            compact
          />
        </div>
      )}
    </article>
  );
}
