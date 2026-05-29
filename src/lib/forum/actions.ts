"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";
import { getCurrentUser, requireUser } from "@/lib/auth/dal";
import {
  createReply,
  createThread,
  deleteReply,
  deleteThread,
  setLocked,
  setPinned,
  toggleBookmark,
  toggleFollow,
  toggleReaction,
} from "./store";
import {
  REACTION_ORDER,
  AUDIENCE_TAGS,
  CONTENT_NOTES,
  SPACES,
  type AudienceTag,
  type ContentNote,
  type ReactionEmoji,
  type SpaceId,
} from "./types";

const SpaceIdSchema = z.enum(
  SPACES.map((s) => s.id) as [SpaceId, ...SpaceId[]]
);
const AudienceSchema = z.enum(AUDIENCE_TAGS as [AudienceTag, ...AudienceTag[]]);
const ContentNoteSchema = z.enum(CONTENT_NOTES as [ContentNote, ...ContentNote[]]);
const ReactionSchema = z.enum(REACTION_ORDER as [ReactionEmoji, ...ReactionEmoji[]]);

const NewThreadSchema = z.object({
  spaceId: SpaceIdSchema,
  title: z.string().trim().min(8, "Give your post a clearer title (8+ chars).").max(200),
  body: z.string().trim().min(20, "Posts work best with at least a sentence or two.").max(8000),
  tags: z.string().optional(),
  audience: z.array(AudienceSchema).optional(),
  notes: z.array(ContentNoteSchema).optional(),
});

export type NewThreadFormState =
  | {
      ok?: false;
      errors?: {
        title?: string[];
        body?: string[];
        spaceId?: string[];
      };
      message?: string;
      values?: {
        spaceId?: string;
        title?: string;
        body?: string;
        tags?: string;
        audience?: string[];
        notes?: string[];
      };
    }
  | undefined;

function audienceArray(formData: FormData): AudienceTag[] {
  return formData
    .getAll("audience")
    .filter((v): v is string => typeof v === "string")
    .filter((v): v is AudienceTag => AUDIENCE_TAGS.includes(v as AudienceTag));
}

function notesArray(formData: FormData): ContentNote[] {
  return formData
    .getAll("notes")
    .filter((v): v is string => typeof v === "string")
    .filter((v): v is ContentNote => CONTENT_NOTES.includes(v as ContentNote));
}

export async function createThreadAction(
  _state: NewThreadFormState,
  formData: FormData
): Promise<NewThreadFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/community/new");
  }

  const raw = {
    spaceId: formData.get("spaceId"),
    title: formData.get("title"),
    body: formData.get("body"),
    tags: formData.get("tags"),
    audience: audienceArray(formData),
    notes: notesArray(formData),
  };

  const parsed = NewThreadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as NewThreadFormState extends infer U
        ? U extends { errors?: infer E }
          ? E
          : never
        : never,
      values: {
        spaceId: typeof raw.spaceId === "string" ? raw.spaceId : "",
        title: typeof raw.title === "string" ? raw.title : "",
        body: typeof raw.body === "string" ? raw.body : "",
        tags: typeof raw.tags === "string" ? raw.tags : "",
        audience: raw.audience,
        notes: raw.notes,
      },
    };
  }

  const tags = (parsed.data.tags ?? "")
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const thread = await createThread({
    authorId: user.id,
    spaceId: parsed.data.spaceId,
    title: parsed.data.title,
    body: parsed.data.body,
    tags,
    audienceTags: parsed.data.audience?.length
      ? parsed.data.audience
      : ["everyone"],
    contentNotes: parsed.data.notes ?? [],
  });

  revalidatePath("/community");
  revalidatePath(`/community/${thread.spaceId}`);
  redirect(`/community/${thread.spaceId}/${thread.id}`);
}

const ReplySchema = z.object({
  threadId: z.string().min(1),
  body: z.string().trim().min(2, "Reply needs at least a couple of characters.").max(6000),
  parentReplyId: z.string().optional(),
});

export type ReplyFormState =
  | {
      ok?: false;
      errors?: { body?: string[] };
      message?: string;
      values?: { body?: string };
    }
  | undefined;

export async function replyAction(
  _state: ReplyFormState,
  formData: FormData
): Promise<ReplyFormState> {
  const user = await requireUser();

  const parsed = ReplySchema.safeParse({
    threadId: formData.get("threadId"),
    body: formData.get("body"),
    parentReplyId: formData.get("parentReplyId") || undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      values: {
        body: typeof formData.get("body") === "string" ? String(formData.get("body")) : "",
      },
    };
  }

  try {
    await createReply({
      authorId: user.id,
      threadId: parsed.data.threadId,
      body: parsed.data.body,
      parentReplyId: parsed.data.parentReplyId,
    });
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error && err.message === "THREAD_LOCKED"
          ? "This thread is locked. New replies are paused."
          : "Couldn't post your reply. Please try again.",
      values: {
        body: typeof formData.get("body") === "string" ? String(formData.get("body")) : "",
      },
    };
  }

  revalidatePath(`/community`);
  return undefined;
}

export async function reactAction(formData: FormData) {
  const user = await requireUser();
  const targetType = formData.get("targetType");
  const targetId = formData.get("targetId");
  const emoji = formData.get("emoji");
  if (
    (targetType !== "thread" && targetType !== "reply") ||
    typeof targetId !== "string" ||
    typeof emoji !== "string"
  ) {
    return;
  }
  const valid = ReactionSchema.safeParse(emoji);
  if (!valid.success) return;

  await toggleReaction({
    userId: user.id,
    targetType,
    targetId,
    emoji: valid.data,
  });
  const path = (formData.get("returnTo") as string) || "/community";
  revalidatePath(path);
}

export async function bookmarkAction(formData: FormData) {
  const user = await requireUser();
  const threadId = formData.get("threadId");
  if (typeof threadId !== "string") return;
  await toggleBookmark({ userId: user.id, threadId });
  const path = (formData.get("returnTo") as string) || "/community";
  revalidatePath(path);
}

export async function followAction(formData: FormData) {
  const user = await requireUser();
  const threadId = formData.get("threadId");
  if (typeof threadId !== "string") return;
  await toggleFollow({ userId: user.id, threadId });
  const path = (formData.get("returnTo") as string) || "/community";
  revalidatePath(path);
}

// Moderation: pin/lock are only allowed for the thread author for now.
// (A real admin role can be added later.)
export async function pinAction(formData: FormData) {
  const user = await requireUser();
  const threadId = formData.get("threadId");
  const pinned = formData.get("pinned") === "true";
  if (typeof threadId !== "string") return;
  // Authors can pin their own thread; treat it as a self-highlight.
  const { getThread } = await import("./store");
  const t = await getThread(threadId);
  if (!t || t.authorId !== user.id) return;
  await setPinned(threadId, pinned);
  const path = (formData.get("returnTo") as string) || "/community";
  revalidatePath(path);
}

export async function lockAction(formData: FormData) {
  const user = await requireUser();
  const threadId = formData.get("threadId");
  const locked = formData.get("locked") === "true";
  if (typeof threadId !== "string") return;
  const { getThread } = await import("./store");
  const t = await getThread(threadId);
  if (!t || t.authorId !== user.id) return;
  await setLocked(threadId, locked);
  const path = (formData.get("returnTo") as string) || "/community";
  revalidatePath(path);
}

export async function deleteThreadAction(formData: FormData) {
  const user = await requireUser();
  const threadId = formData.get("threadId");
  if (typeof threadId !== "string") return;
  await deleteThread(threadId, user.id);
  revalidatePath("/community");
  redirect("/community");
}

export async function deleteReplyAction(formData: FormData) {
  const user = await requireUser();
  const replyId = formData.get("replyId");
  if (typeof replyId !== "string") return;
  await deleteReply(replyId, user.id);
  const path = (formData.get("returnTo") as string) || "/community";
  revalidatePath(path);
}
