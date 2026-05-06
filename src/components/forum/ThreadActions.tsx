"use client";

import { useTransition } from "react";
import { Bookmark, BookmarkCheck, Bell, BellRing, Pin, Lock, Trash2 } from "lucide-react";
import {
  bookmarkAction,
  followAction,
  pinAction,
  lockAction,
  deleteThreadAction,
} from "@/lib/forum/actions";

export default function ThreadActions({
  threadId,
  bookmarked,
  following,
  isPinned,
  isLocked,
  isOwnerOrMod,
  signedIn,
  returnTo,
  variant = "row",
}: {
  threadId: string;
  bookmarked: boolean;
  following: boolean;
  isPinned: boolean;
  isLocked: boolean;
  isOwnerOrMod: boolean;
  signedIn: boolean;
  returnTo: string;
  variant?: "row" | "card";
}) {
  const [pending, start] = useTransition();

  const guard = (fn: () => void) => () => {
    if (!signedIn) {
      window.location.assign(`/login?next=${encodeURIComponent(returnTo)}`);
      return;
    }
    fn();
  };

  const onBookmark = guard(() => {
    const fd = new FormData();
    fd.set("threadId", threadId);
    fd.set("returnTo", returnTo);
    start(() => bookmarkAction(fd));
  });

  const onFollow = guard(() => {
    const fd = new FormData();
    fd.set("threadId", threadId);
    fd.set("returnTo", returnTo);
    start(() => followAction(fd));
  });

  const onPin = () => {
    const fd = new FormData();
    fd.set("threadId", threadId);
    fd.set("pinned", String(!isPinned));
    fd.set("returnTo", returnTo);
    start(() => pinAction(fd));
  };
  const onLock = () => {
    const fd = new FormData();
    fd.set("threadId", threadId);
    fd.set("locked", String(!isLocked));
    fd.set("returnTo", returnTo);
    start(() => lockAction(fd));
  };
  const onDelete = () => {
    if (!confirm("Delete this thread? This cannot be undone.")) return;
    const fd = new FormData();
    fd.set("threadId", threadId);
    start(() => deleteThreadAction(fd));
  };

  const btn =
    variant === "card"
      ? "p-1.5 rounded-lg hover:bg-cream-100 text-slate-500 hover:text-coral-600"
      : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-cream-200 hover:bg-cream-50 text-slate-700";

  return (
    <div className={variant === "card" ? "flex items-center gap-1" : "flex items-center gap-2 flex-wrap"}>
      <button
        type="button"
        onClick={onBookmark}
        disabled={pending}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
        className={btn}
      >
        {bookmarked ? (
          <BookmarkCheck className="w-3.5 h-3.5 text-coral-600" />
        ) : (
          <Bookmark className="w-3.5 h-3.5" />
        )}
        {variant === "row" && <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>}
      </button>

      <button
        type="button"
        onClick={onFollow}
        disabled={pending}
        aria-label={following ? "Unfollow" : "Follow"}
        className={btn}
      >
        {following ? (
          <BellRing className="w-3.5 h-3.5 text-coral-600" />
        ) : (
          <Bell className="w-3.5 h-3.5" />
        )}
        {variant === "row" && <span>{following ? "Following" : "Follow"}</span>}
      </button>

      {isOwnerOrMod && (
        <>
          <button
            type="button"
            onClick={onPin}
            disabled={pending}
            aria-label={isPinned ? "Unpin" : "Pin"}
            className={btn}
          >
            <Pin className={`w-3.5 h-3.5 ${isPinned ? "text-coral-600" : ""}`} />
            {variant === "row" && <span>{isPinned ? "Pinned" : "Pin"}</span>}
          </button>
          <button
            type="button"
            onClick={onLock}
            disabled={pending}
            aria-label={isLocked ? "Unlock" : "Lock"}
            className={btn}
          >
            <Lock className={`w-3.5 h-3.5 ${isLocked ? "text-coral-600" : ""}`} />
            {variant === "row" && <span>{isLocked ? "Locked" : "Lock"}</span>}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            aria-label="Delete thread"
            className={btn}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {variant === "row" && <span>Delete</span>}
          </button>
        </>
      )}
    </div>
  );
}
