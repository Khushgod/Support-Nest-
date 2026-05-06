import type {
  AudienceTag,
  Author,
  ContentNote,
  Reply,
  SpaceId,
  Thread,
} from "./types";

/**
 * Synthetic seed data so a freshly cloned/started instance has a forum that
 * actually feels alive. These users and threads are clearly marked as sample
 * data (handles end in `~`) so they can never be confused for real members.
 */

export const SEED_USERS: Author[] = [
  { id: "seed-maya", displayName: "Maya", handle: "maya~", role: "parent" },
  { id: "seed-devon", displayName: "Devon", handle: "devon~", role: "teacher" },
  { id: "seed-aarti", displayName: "Aarti", handle: "aarti~", role: "neurodivergent_adult" },
  { id: "seed-ren", displayName: "Ren", handle: "ren~", role: "parent" },
  { id: "seed-sam", displayName: "Sam", handle: "sam~", role: "neurodivergent_adult" },
  { id: "seed-priya", displayName: "Priya", handle: "priya~", role: "teacher" },
  { id: "seed-jordan", displayName: "Jordan", handle: "jordan~", role: "ally" },
  { id: "seed-noor", displayName: "Noor", handle: "noor~", role: "parent" },
  { id: "seed-eli", displayName: "Eli", handle: "eli~", role: "neurodivergent_adult" },
  { id: "seed-leah", displayName: "Leah", handle: "leah~", role: "parent" },
];

type Seed = {
  authorId: string;
  spaceId: SpaceId;
  title: string;
  body: string;
  daysAgo: number;
  tags?: string[];
  audienceTags?: AudienceTag[];
  contentNotes?: ContentNote[];
  pinned?: boolean;
  reactions?: Partial<Record<string, number>>;
  replies?: { authorId: string; body: string; daysAgo: number; reactions?: Partial<Record<string, number>> }[];
};

export const SEED_THREADS: Seed[] = [
  {
    authorId: "seed-maya",
    spaceId: "first-steps",
    title: "Hi from a tired parent — finally somewhere quiet to talk",
    body: "Just got home from school pickup with a 7yo who had a 30-minute meltdown in the parking lot. Not looking for advice tonight, mostly just wanted to say hi. This place feels softer than the FB groups I've been on.",
    daysAgo: 0,
    tags: ["intro"],
    audienceTags: ["parents"],
    pinned: true,
    reactions: { hug: 18, care: 9, metoo: 12 },
    replies: [
      { authorId: "seed-jordan", body: "Welcome. Take what you need. We're glad you're here.", daysAgo: 0, reactions: { care: 4 } },
      { authorId: "seed-ren", body: "Sending you a hug. Parking lot meltdowns are their own special level of hard.", daysAgo: 0, reactions: { hug: 6, metoo: 3 } },
      { authorId: "seed-noor", body: "You're not alone. There are good days and there are parking-lot days. Tonight just exists.", daysAgo: 0 },
    ],
  },
  {
    authorId: "seed-priya",
    spaceId: "educators",
    title: "Quick reset strategies that don't make a kid feel singled out — what's working?",
    body: "I have a class of 26 and three students who'd benefit from a regulation cue, but I don't want it to be A Thing for them. Currently using a class-wide stretch break every 25 min. What else has worked for you?",
    daysAgo: 1,
    tags: ["classroom", "regulation"],
    audienceTags: ["teachers"],
    reactions: { helpful: 11, thoughtful: 4 },
    replies: [
      { authorId: "seed-devon", body: "We do 'shake it out' — full class stands and shakes one limb at a time. Started as silly, now everyone uses it. The kids who needed it most don't stand out at all.", daysAgo: 1, reactions: { helpful: 9, agree: 3 } },
      { authorId: "seed-jordan", body: "We use color cards on every desk (everyone has them). Quiet way to ask for a check-in without raising a hand.", daysAgo: 1, reactions: { helpful: 7 } },
    ],
  },
  {
    authorId: "seed-aarti",
    spaceId: "adults",
    title: "Asked for accommodations at work today and it went… fine?",
    body: "31 and I finally did the thing. HR was actually kind. I got: noise-canceling headphones reimbursed, an end-of-day 1:1 with my manager instead of a Friday-afternoon team meeting, and explicit permission to skip the open-plan area on heavy days. Posting in case anyone needs proof it can go well.",
    daysAgo: 2,
    tags: ["work", "accommodations", "late-diagnosed"],
    audienceTags: ["nd_adults"],
    reactions: { care: 22, agree: 8, metoo: 14, thanks: 7 },
    replies: [
      { authorId: "seed-sam", body: "This is huge. Saving this thread. Thank you for posting it.", daysAgo: 2, reactions: { thanks: 4 } },
      { authorId: "seed-eli", body: "Did you have a doctor's note or just ask? I'm psyching myself up for a similar conversation.", daysAgo: 2 },
      { authorId: "seed-aarti", body: "Just asked. Said 'I have ADHD and these specific environments make my work day harder' and listed three concrete asks. The specificity helped a lot.", daysAgo: 2, reactions: { helpful: 10 } },
    ],
  },
  {
    authorId: "seed-ren",
    spaceId: "parenting-littles",
    title: "The low-demand morning routine is saving us. Sharing what we changed.",
    body: "We dropped: enforced toothbrushing before breakfast, choosing clothes the night before (he wanted to choose in the morning), and the 'one warning' system. Added: a soft start window of 20 min where nothing has to happen, breakfast at the couch is fine, and a single visual schedule with magnets he moves himself. We've gone from 4 meltdowns/wk to 0–1.",
    daysAgo: 3,
    tags: ["routines", "regulation"],
    audienceTags: ["parents"],
    contentNotes: ["meltdown"],
    reactions: { helpful: 28, thanks: 15, agree: 11 },
    replies: [
      { authorId: "seed-leah", body: "The soft-start window is what unlocked our mornings too. We call it 'wake up time isn't get-up time'.", daysAgo: 3, reactions: { agree: 5 } },
      { authorId: "seed-maya", body: "Trying this tomorrow. Thank you for writing it out so concretely.", daysAgo: 3, reactions: { thanks: 3 } },
      { authorId: "seed-priya", body: "From a teacher: kids who arrive after a soft-start morning are SO much more available to learn. This is upstream work that benefits everyone.", daysAgo: 3, reactions: { helpful: 8 } },
    ],
  },
  {
    authorId: "seed-eli",
    spaceId: "adults",
    title: "Recovering from autistic burnout — what actually helped you?",
    body: "Six months into a hard one. Cut hours, started rest, started OT for sensory stuff. Looking for first-hand experiences of recovery beyond 'it gets better' — what concretely helped your nervous system come back online?",
    daysAgo: 4,
    tags: ["burnout", "recovery"],
    audienceTags: ["nd_adults"],
    contentNotes: ["burnout"],
    reactions: { care: 16, metoo: 19 },
    replies: [
      { authorId: "seed-sam", body: "Permission to be useless was the biggest. Like actually useless, not productive-useless. Year one was rest, year two was rebuilding, year three I'm starting to feel like myself again. There's no fast version.", daysAgo: 4, reactions: { thoughtful: 12, metoo: 8 } },
      { authorId: "seed-aarti", body: "Reduced screens at night, walks daily, no demand-leisure (no 'fun activities I should be doing'). Boring works.", daysAgo: 4 },
    ],
  },
  {
    authorId: "seed-leah",
    spaceId: "tweens-teens",
    title: "12yo just got an autism diagnosis — how do we tell extended family without it becoming A Whole Thing?",
    body: "We're solid. He's solid. The diagnosis gave us a road map. But my MIL is going to ask 30 questions and start sending articles. Looking for scripts that work.",
    daysAgo: 5,
    tags: ["family", "diagnosis"],
    audienceTags: ["parents"],
    contentNotes: ["diagnosis"],
    reactions: { metoo: 7, helpful: 12 },
    replies: [
      { authorId: "seed-noor", body: "What worked for us: 'We have it covered. We'll loop you in on what would be helpful when we know.' Repeat that exact sentence. They eventually stop sending articles.", daysAgo: 5, reactions: { helpful: 14, agree: 6 } },
      { authorId: "seed-ren", body: "Also — your kid gets a vote in who gets told and what. We had our 13yo write the email to the grandparents. Took a lot of pressure off us.", daysAgo: 5, reactions: { thoughtful: 9 } },
    ],
  },
  {
    authorId: "seed-noor",
    spaceId: "healthcare",
    title: "ND-affirming therapist near a major metro — what to actually ask in a consult",
    body: "Looking for a therapist for myself (recently late-diagnosed). I have a list of names but every consult feels like an interview I'll fail. What questions actually surface whether someone is ND-affirming vs. trying to fix you?",
    daysAgo: 6,
    tags: ["therapy", "late-diagnosed"],
    audienceTags: ["nd_adults"],
    reactions: { helpful: 14, thoughtful: 5 },
    replies: [
      { authorId: "seed-jordan", body: "My favorite test question: 'Do you treat masking as a coping skill or as something to work on reducing?' The answer tells you a lot.", daysAgo: 6, reactions: { helpful: 17 } },
      { authorId: "seed-eli", body: "I ask about specific frameworks they use. If they say 'we treat the symptoms', that's a no for me. If they mention neurodiversity-affirming care, polyvagal, internal family systems, I lean in.", daysAgo: 6, reactions: { helpful: 9 } },
    ],
  },
  {
    authorId: "seed-devon",
    spaceId: "educators",
    title: "Sample IEP goal language that's actually measurable — share yours?",
    body: "Compliance officer keeps kicking ours back. Looking for goal templates that pass review without being soulless. Posting one of mine to start.\n\nMine: 'During whole-class instruction, [student] will use a self-identified regulation tool (visual schedule check, fidget, break card) at least 1x per session in 4 of 5 observed periods, as recorded by the case manager.'",
    daysAgo: 7,
    tags: ["iep", "goals", "compliance"],
    audienceTags: ["teachers"],
    reactions: { helpful: 19, thanks: 6 },
    replies: [
      { authorId: "seed-priya", body: "I love the 'self-identified' part. Centers the student's agency and is still measurable.", daysAgo: 7, reactions: { agree: 8 } },
    ],
  },
  {
    authorId: "seed-sam",
    spaceId: "adults",
    title: "Sensory-friendly grocery shopping — current setup",
    body: "Posting in case useful: noise-canceling earbuds, sunglasses indoors (yes, even though it looks weird), a written list in the same order as the store layout, chewable necklace, and a 5-minute decompression in the car after. Cuts a 2-hour ordeal down to 25 minutes flat.",
    daysAgo: 8,
    tags: ["sensory", "daily-life"],
    audienceTags: ["nd_adults"],
    reactions: { helpful: 23, agree: 14, thanks: 8 },
    replies: [
      { authorId: "seed-aarti", body: "The list-in-store-order is a game changer. Mine looks like a treasure map, organized by aisle.", daysAgo: 8, reactions: { agree: 5 } },
    ],
  },
  {
    authorId: "seed-jordan",
    spaceId: "first-steps",
    title: "Welcome — about this space (read first if you're new)",
    body: "We keep this place gentle on purpose. Lead with kindness, use content notes for heavy topics, no diagnosing strangers, identity-first vs. person-first language is a choice. What's shared in support stays in support. If you see something that feels off, flag it — mods get notified within an hour.",
    daysAgo: 14,
    tags: ["meta"],
    pinned: true,
    audienceTags: ["everyone"],
    reactions: { thanks: 41, care: 16 },
  },
  {
    authorId: "seed-maya",
    spaceId: "parenting-littles",
    title: "Sibling support without comparison — looking for scripts",
    body: "5yo neurotypical and 7yo autistic. The 5yo asked tonight, 'why does brother get to leave dinner when he's loud?' Looking for scripts that don't pit them against each other or make special needs sound like a free pass.",
    daysAgo: 9,
    tags: ["siblings"],
    audienceTags: ["parents"],
    reactions: { helpful: 8, metoo: 11 },
    replies: [
      { authorId: "seed-leah", body: "We use 'fair isn't equal — fair is everyone gets what they need.' Then we ask the NT sibling what THEY need. Sometimes it's a quiet snack break, sometimes it's just being heard.", daysAgo: 9, reactions: { helpful: 12, thoughtful: 5 } },
    ],
  },
  {
    authorId: "seed-priya",
    spaceId: "tweens-teens",
    title: "Teen wants to drop their accommodations because 'it makes them weird'. How do you talk about this?",
    body: "Eighth-grader. Has used a fidget, extended time, and a quiet test space for two years. Now wants to opt out of all of it because of a comment a peer made. I don't want to override their voice but I also know they need it.",
    daysAgo: 10,
    tags: ["teens", "advocacy"],
    audienceTags: ["parents"],
    contentNotes: ["school-stress"],
    reactions: { metoo: 8, thoughtful: 14 },
    replies: [
      { authorId: "seed-aarti", body: "From an adult who masked through high school: ask them what they'd choose if no one were watching. Then ask what would make 'being watched' less of a thing — sometimes it's a different cover story for the accommodation, not removing it.", daysAgo: 10, reactions: { thoughtful: 19 } },
    ],
  },
  {
    authorId: "seed-ren",
    spaceId: "healthcare",
    title: "Genetic testing came back with a VUS — what does that mean for our family?",
    body: "Took the panel for our 6yo. One variant came back as 'VUS — variant of unknown significance'. Counselor explained but I'm still fuzzy on what to do with this info.",
    daysAgo: 11,
    tags: ["genetics", "VUS"],
    audienceTags: ["parents"],
    contentNotes: ["medical"],
    reactions: { helpful: 9 },
    replies: [
      { authorId: "seed-jordan", body: "VUS basically means: we found a change in this gene, but we don't yet have enough evidence to call it harmful or harmless. The honest answer is 'wait and revisit in a few years' — variant classifications change as the database grows.", daysAgo: 11, reactions: { helpful: 16, thanks: 4 } },
      { authorId: "seed-jordan", body: "Also — there's a free tool here on SupportNest called GeneTranslate that walks through what a report says in plain language. Worth a look.", daysAgo: 11, reactions: { helpful: 7 } },
    ],
  },
  {
    authorId: "seed-eli",
    spaceId: "first-steps",
    title: "First post — late-diagnosed at 39 and still digesting it",
    body: "Just here to say hi. Got an autism + ADHD diagnosis last month. The relief and grief are showing up at the same time and I don't quite know what to do with that.",
    daysAgo: 12,
    tags: ["intro", "late-diagnosed"],
    audienceTags: ["nd_adults"],
    contentNotes: ["diagnosis"],
    reactions: { care: 24, hug: 18, metoo: 22 },
    replies: [
      { authorId: "seed-aarti", body: "Same exact feeling at 31. The grief is real and you don't have to rush past it. Welcome to the nest.", daysAgo: 12, reactions: { care: 6 } },
      { authorId: "seed-sam", body: "Both feelings are real. Both get to exist at once. Take your time.", daysAgo: 12, reactions: { thoughtful: 4 } },
    ],
  },
];

export function buildSeedReplies(): {
  threads: Thread[];
  replies: Reply[];
} {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const threads: Thread[] = [];
  const replies: Reply[] = [];

  for (let i = 0; i < SEED_THREADS.length; i++) {
    const s = SEED_THREADS[i];
    const tid = `seed-thread-${i + 1}`;
    const created = new Date(now - s.daysAgo * day).toISOString();
    const tReactions = Object.entries(s.reactions ?? {}).flatMap(
      ([emoji, count]) =>
        Array.from({ length: count ?? 0 }).map((_, k) => ({
          userId: `seed-reactor-t${i}-${emoji}-${k}`,
          emoji: emoji as never,
        }))
    );

    const t: Thread = {
      id: tid,
      spaceId: s.spaceId,
      authorId: s.authorId,
      title: s.title,
      body: s.body,
      createdAt: created,
      updatedAt: created,
      lastActivityAt: created,
      tags: s.tags ?? [],
      audienceTags: s.audienceTags ?? ["everyone"],
      contentNotes: s.contentNotes ?? [],
      isPinned: !!s.pinned,
      isLocked: false,
      viewCount: 50 + i * 13,
      reactions: tReactions,
    };

    let lastActivity = created;
    (s.replies ?? []).forEach((r, j) => {
      const rid = `seed-reply-${i + 1}-${j + 1}`;
      const rCreated = new Date(now - r.daysAgo * day + (j + 1) * 60_000).toISOString();
      const rReactions = Object.entries(r.reactions ?? {}).flatMap(
        ([emoji, count]) =>
          Array.from({ length: count ?? 0 }).map((_, k) => ({
            userId: `seed-reactor-r${i}-${j}-${emoji}-${k}`,
            emoji: emoji as never,
          }))
      );
      replies.push({
        id: rid,
        threadId: tid,
        authorId: r.authorId,
        body: r.body,
        createdAt: rCreated,
        reactions: rReactions,
      });
      if (rCreated > lastActivity) lastActivity = rCreated;
    });
    t.lastActivityAt = lastActivity;
    threads.push(t);
  }

  return { threads, replies };
}
