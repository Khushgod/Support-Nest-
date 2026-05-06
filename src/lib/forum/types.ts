/**
 * Forum domain model. Kept dependency-free so it can be imported from server
 * actions, route handlers, and tests.
 */

export type SpaceId =
  | "first-steps"
  | "parenting-littles"
  | "tweens-teens"
  | "adults"
  | "educators"
  | "healthcare";

export type AudienceTag = "parents" | "teachers" | "nd_adults" | "everyone";

export type ContentNote =
  | "burnout"
  | "diagnosis"
  | "meltdown"
  | "school-stress"
  | "medical"
  | "grief"
  | "anxiety";

export type ReactionEmoji =
  | "care"
  | "hug"
  | "helpful"
  | "agree"
  | "metoo"
  | "thanks"
  | "thoughtful";

export const REACTION_LABELS: Record<
  ReactionEmoji,
  { glyph: string; label: string }
> = {
  care: { glyph: "❤️", label: "Care" },
  hug: { glyph: "🤗", label: "Hug" },
  helpful: { glyph: "💡", label: "Helpful" },
  agree: { glyph: "👍", label: "Agree" },
  metoo: { glyph: "🫶", label: "Me too" },
  thanks: { glyph: "🌱", label: "Thank you" },
  thoughtful: { glyph: "📝", label: "Thoughtful" },
};

export const SPACES: {
  id: SpaceId;
  name: string;
  blurb: string;
  audience: AudienceTag[];
  accent: string;
}[] = [
  {
    id: "first-steps",
    name: "First steps & introductions",
    blurb: "Say hi at your own pace. No pressure, no scripts.",
    audience: ["everyone"],
    accent: "from-coral-200 to-sun-200",
  },
  {
    id: "parenting-littles",
    name: "Parenting little ones (0–8)",
    blurb: "Routines, regulation, sensory needs, school transitions.",
    audience: ["parents"],
    accent: "from-sun-200 to-cream-200",
  },
  {
    id: "tweens-teens",
    name: "Tweens & teens",
    blurb: "Friendships, identity, school, executive-function support.",
    audience: ["parents"],
    accent: "from-lavender-200 to-coral-200",
  },
  {
    id: "adults",
    name: "Adults: workplace & life",
    blurb: "Accommodations, burnout, masking, mental-health peers.",
    audience: ["nd_adults"],
    accent: "from-cream-200 to-lavender-200",
  },
  {
    id: "educators",
    name: "Educators' lounge",
    blurb: "Classroom strategies, IEP wins, school-system venting.",
    audience: ["teachers"],
    accent: "from-lavender-200 to-sun-200",
  },
  {
    id: "healthcare",
    name: "Healthcare & genetics",
    blurb: "Decoding evaluations, genetic testing, finding clinicians.",
    audience: ["everyone"],
    accent: "from-sun-200 to-coral-200",
  },
];

export const SPACE_BY_ID: Record<SpaceId, (typeof SPACES)[number]> =
  Object.fromEntries(SPACES.map((s) => [s.id, s])) as Record<
    SpaceId,
    (typeof SPACES)[number]
  >;

export const CONTENT_NOTE_LABELS: Record<ContentNote, string> = {
  burnout: "Burnout",
  diagnosis: "Diagnosis",
  meltdown: "Meltdowns / shutdowns",
  "school-stress": "School stress",
  medical: "Medical",
  grief: "Grief",
  anxiety: "Anxiety",
};

export const AUDIENCE_LABELS: Record<AudienceTag, string> = {
  parents: "Parents",
  teachers: "Teachers",
  nd_adults: "ND adults",
  everyone: "Everyone",
};

export type Author = {
  id: string;
  displayName: string;
  /** Pseudonym if the user opted in. Falls back to first-name + initial. */
  handle: string;
  role: string;
};

export type Reaction = {
  userId: string;
  emoji: ReactionEmoji;
};

export type Reply = {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  createdAt: string;
  editedAt?: string;
  parentReplyId?: string;
  reactions: Reaction[];
};

export type Thread = {
  id: string;
  spaceId: SpaceId;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  tags: string[];
  audienceTags: AudienceTag[];
  contentNotes: ContentNote[];
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  reactions: Reaction[];
};

export type Bookmark = {
  userId: string;
  threadId: string;
  createdAt: string;
};

export type Follow = {
  userId: string;
  threadId: string;
  createdAt: string;
};

export type ForumStore = {
  version: 1;
  threads: Thread[];
  replies: Reply[];
  bookmarks: Bookmark[];
  follows: Follow[];
  /** Seeded synthetic users for sample threads. Real users live elsewhere. */
  seedUsers: Author[];
};

export type ThreadView = Thread & {
  author: Author | null;
  replyCount: number;
  reactionCounts: Record<ReactionEmoji, number>;
  totalReactions: number;
  lastReplyAt?: string;
  spaceName: string;
};

export type ReplyView = Reply & {
  author: Author | null;
  reactionCounts: Record<ReactionEmoji, number>;
  totalReactions: number;
};

export const REACTION_ORDER: ReactionEmoji[] = [
  "care",
  "hug",
  "helpful",
  "agree",
  "metoo",
  "thanks",
  "thoughtful",
];

export function emptyReactionCounts(): Record<ReactionEmoji, number> {
  return REACTION_ORDER.reduce(
    (acc, k) => {
      acc[k] = 0;
      return acc;
    },
    {} as Record<ReactionEmoji, number>
  );
}
