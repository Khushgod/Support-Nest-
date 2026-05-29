import type {
  Author,
  ForumSeedThreadInput,
  Reply,
  Thread,
} from "./types";
import { csvRowsToSeedThreads, type QuestionResponseCsvRow } from "./csv-import";
import { normalizeForumTag } from "./format";

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
  { id: "seed-csv-workplace", displayName: "Workplace Guide", handle: "workplace-guide~", role: "moderator" },
  { id: "seed-csv-parenting", displayName: "Parenting Guide", handle: "parenting-guide~", role: "moderator" },
  { id: "seed-csv-mental-health", displayName: "Recovery Guide", handle: "recovery-guide~", role: "moderator" },
  { id: "seed-csv-identity", displayName: "Identity Guide", handle: "identity-guide~", role: "moderator" },
  { id: "seed-csv-school", displayName: "School Support Guide", handle: "school-guide~", role: "moderator" },
  { id: "seed-csv-community", displayName: "Community Guide", handle: "community-guide~", role: "moderator" },
];

type Seed = ForumSeedThreadInput;

const QUESTION_RESPONSE_CSV_ROWS: QuestionResponseCsvRow[] = [
  {
    theme: "Workplace and Career Navigation",
    rank: 1,
    question: "How do I explain employment gaps without making my ADHD or burnout sound like a liability?",
    response: "You do not have to narrate every difficult season in detail. A calm version can be: 'I took time for health and skill-building, and I am now ready for a structured role where I can contribute consistently.' Then pivot to proof: projects, courses, freelance work, volunteering, or what you learned about the conditions that help you work well. The goal is not to hide your story. It is to keep the interview focused on your readiness and strengths.",
    suggestedTags: "job-search, employment-gaps, burnout, interview-scripts, adhd",
    anchorThreadType: "Script / Template",
    timeliness: "Evergreen launch seed",
    communityUse: "Anchor discussion and resource page example",
  },
  {
    theme: "Workplace and Career Navigation",
    rank: 2,
    question: "How do I ask my manager for clearer instructions without sounding difficult?",
    response: "Try making it about work quality instead of personal deficiency. For example: 'I do my best work when priorities and next steps are written down. Could we summarize action items after meetings so I can make sure I deliver the right thing?' That is a reasonable work-system request. Many people, ND or not, benefit from written clarity.",
    suggestedTags: "workplace, manager-communication, accommodations, written-briefs",
    anchorThreadType: "What helped me",
    timeliness: "Evergreen launch seed",
    communityUse: "Workplace scripts library",
  },
  {
    theme: "Workplace and Career Navigation",
    rank: 3,
    question: "Is remote work really better for neurodivergent people, or am I just avoiding the office?",
    response: "It can be both: remote work may reduce sensory load and social masking, while the office may offer structure and faster feedback. A useful question is not 'Which one should I be able to tolerate?' but 'Where do I produce good work without paying for it with recovery time?' Some people need remote, some need hybrid, and some need office days with sensory boundaries.",
    suggestedTags: "remote-work, sensory, hybrid-work, workplace-design",
    anchorThreadType: "Open discussion",
    timeliness: "Timely/current workplace topic",
    communityUse: "Forum debate and poll",
  },
  {
    theme: "Workplace and Career Navigation",
    rank: 4,
    question: "How do I stop job-hopping when every role eventually burns me out?",
    response: "Look for the pattern underneath the exits: unclear expectations, sensory overload, too many meetings, no recovery time, or constant masking. Job-hopping is often treated like a character flaw, but it can be useful data. Before the next role, write your non-negotiables, your early warning signs, and the supports you will ask for before you are already depleted.",
    suggestedTags: "career-navigation, burnout, job-hopping, boundaries",
    anchorThreadType: "Open discussion",
    timeliness: "Evergreen launch seed",
    communityUse: "Career planning worksheet",
  },
  {
    theme: "Workplace and Career Navigation",
    rank: 5,
    question: "How do I talk about strengths without sounding like I am overcompensating for my challenges?",
    response: "Use evidence, not hype. Instead of saying 'ADHD is my superpower,' try: 'I am strong at fast pattern recognition and creative problem solving, and I use written systems to manage follow-through.' That keeps the whole picture honest: strengths plus supports. People tend to trust that more than a polished performance.",
    suggestedTags: "strengths, self-advocacy, career-story, job-search",
    anchorThreadType: "What helped me",
    timeliness: "Evergreen launch seed",
    communityUse: "Profile-building prompt",
  },
  {
    theme: "Parenting and Family Systems",
    rank: 1,
    question: "My child just got diagnosed. What should we do first?",
    response: "First, breathe. You do not have to solve the whole future this week. Start with three things: understand the report in plain language, identify the one situation causing the most stress right now, and tell your child in a way that protects their dignity. A diagnosis is not a verdict. It is a map you can slowly learn to use.",
    suggestedTags: "diagnosis, parenting, first-steps, tween-support",
    anchorThreadType: "Start here",
    timeliness: "Evergreen launch seed",
    communityUse: "New parent onboarding resource",
  },
  {
    theme: "Parenting and Family Systems",
    rank: 2,
    question: "How do I help my tween without turning every day into a battle?",
    response: "When everything becomes a battle, the family system is usually overloaded, not lazy or broken. Pick one pressure point: homework, mornings, bedtime, or screens. Change the environment before increasing consequences. Snacks, movement, visual steps, fewer verbal reminders, and a decompression window can do more than another lecture.",
    suggestedTags: "parenting, routines, homework, family-systems",
    anchorThreadType: "What helped me",
    timeliness: "Evergreen launch seed",
    communityUse: "Parent routines guide",
  },
  {
    theme: "Parenting and Family Systems",
    rank: 3,
    question: "How do I explain ADHD or autism to my child without making them feel broken?",
    response: "Use language that separates difference from defect. Something like: 'Your brain works differently, and that means some things are harder and some things may come naturally. Our job is to understand your brain and build supports around it.' Children often remember the emotional tone more than the exact words, so calm and matter-of-fact helps.",
    suggestedTags: "identity, parenting, autism, adhd, self-understanding",
    anchorThreadType: "Script / Template",
    timeliness: "Evergreen launch seed",
    communityUse: "Conversation script page",
  },
  {
    theme: "Parenting and Family Systems",
    rank: 4,
    question: "What do I do when the school says my child is fine, but home tells a different story?",
    response: "Believe the pattern, not just the setting. Many ND children hold it together at school and collapse at home. Document what you see: sleep, meltdowns, avoidance, physical complaints, shutdowns, homework distress. Bring examples, not just conclusions. A child who looks fine all day may still be paying a very high price.",
    suggestedTags: "school-advocacy, masking, parenting, documentation",
    anchorThreadType: "Open discussion",
    timeliness: "Evergreen launch seed",
    communityUse: "Advocacy checklist",
  },
  {
    theme: "Parenting and Family Systems",
    rank: 5,
    question: "How do I take care of myself while advocating for my ND child?",
    response: "Parent advocacy can quietly become a second full-time job. You are allowed to need support too. Start small: one person who can listen without judging, one admin block per week instead of constant firefighting, and one recovery ritual that is not earned by productivity. Your wellbeing is part of the support system, not a bonus.",
    suggestedTags: "parent-wellbeing, advocacy, burnout, family-support",
    anchorThreadType: "Open discussion",
    timeliness: "High emotional relevance",
    communityUse: "Parent wellbeing anchor thread",
  },
  {
    theme: "Mental Health and Recovery",
    rank: 1,
    question: "How do I know if this is burnout and not just me failing again?",
    response: "Burnout often feels personal, but it is usually a signal that demand has exceeded capacity for too long. Look for changes: losing skills you normally have, needing much more recovery, shutdowns, sensory sensitivity, dread, or being unable to start even simple tasks. That is not a moral failure. It is information that your system needs less pressure and more support.",
    suggestedTags: "burnout, recovery, self-compassion, mental-health",
    anchorThreadType: "Open discussion",
    timeliness: "High emotional relevance",
    communityUse: "Burnout recognition resource",
  },
  {
    theme: "Mental Health and Recovery",
    rank: 2,
    question: "What actually helps recovery when rest alone is not fixing it?",
    response: "Rest matters, but recovery often also needs reduced demands, fewer transitions, sensory relief, practical help, and permission to stop performing 'fine.' Think in layers: body basics, environment, workload, relationships, and identity. If you only sleep but return to the same overload, your system may never get a real chance to recover.",
    suggestedTags: "recovery, burnout, sensory, support-systems",
    anchorThreadType: "What helped me",
    timeliness: "Evergreen launch seed",
    communityUse: "Recovery planning guide",
  },
  {
    theme: "Mental Health and Recovery",
    rank: 3,
    question: "My child says scary things when overwhelmed. How seriously should I take it?",
    response: "Take it seriously and calmly. You do not have to panic, but you also do not have to guess alone. Stay close, reduce immediate demands, ask simple direct questions, and contact a qualified professional or local crisis/emergency service if there is any risk of harm. A child saying frightening things is not attention-seeking to dismiss. It is a signal to increase support.",
    suggestedTags: "child-mental-health, crisis-support, parenting, safety",
    anchorThreadType: "Resource",
    timeliness: "Safety-critical evergreen",
    communityUse: "Crisis support signposting page",
  },
  {
    theme: "Mental Health and Recovery",
    rank: 4,
    question: "How do I get out of the shame spiral after a bad ADHD day?",
    response: "Try treating the spiral as a nervous-system event, not a courtroom. First regulate: food, water, movement, quiet, shower, or sleep. Then repair one small thing if needed. The sentence 'I had a hard day, and I can still take the next right step' can be more useful than forcing yourself to feel positive.",
    suggestedTags: "adhd, shame, emotional-regulation, self-compassion",
    anchorThreadType: "What helped me",
    timeliness: "Evergreen launch seed",
    communityUse: "Emotional regulation thread",
  },
  {
    theme: "Mental Health and Recovery",
    rank: 5,
    question: "How do I tell the difference between a meltdown, shutdown, and regular stress?",
    response: "A rough way to think about it: stress says 'this is hard,' meltdown says 'my system has overflowed outward,' and shutdown says 'my system has powered down inward.' The support is often different. During the moment, reduce input and demands. Afterward, look for triggers and recovery needs instead of debating whether the reaction was reasonable.",
    suggestedTags: "meltdown, shutdown, autism, regulation, recovery",
    anchorThreadType: "Resource",
    timeliness: "Evergreen launch seed",
    communityUse: "Psychoeducation explainer",
  },
  {
    theme: "Diagnosis and Identity Navigation",
    rank: 1,
    question: "Why do I feel grief after diagnosis when I thought I would feel relief?",
    response: "Relief and grief can arrive together. Diagnosis can explain your life and also make you mourn the years when you were misunderstood, unsupported, or blamed. That does not mean the diagnosis is bad. It means your story is being rewritten with new information, and that can be tender work.",
    suggestedTags: "diagnosis, grief, late-diagnosis, identity",
    anchorThreadType: "Open discussion",
    timeliness: "Evergreen launch seed",
    communityUse: "Identity anchor discussion",
  },
  {
    theme: "Diagnosis and Identity Navigation",
    rank: 2,
    question: "How do I stop masking without blowing up my whole life?",
    response: "Unmasking does not have to mean becoming unfiltered everywhere overnight. Start with low-risk truth: one sensory preference, one boundary, one honest answer with a safe person. The goal is not to remove every mask immediately. It is to build a life where you need fewer masks to survive.",
    suggestedTags: "masking, unmasking, identity, boundaries",
    anchorThreadType: "Open discussion",
    timeliness: "Evergreen launch seed",
    communityUse: "Identity practice thread",
  },
  {
    theme: "Diagnosis and Identity Navigation",
    rank: 3,
    question: "What if I relate to ADHD or autism content but I do not have a formal diagnosis?",
    response: "You can use helpful strategies without claiming certainty you do not have. It is okay to say, 'I am exploring whether this fits me.' Track patterns over time, read from credible sources and lived experience, and seek assessment if it is accessible and useful. Support needs are real even while labels are still being clarified.",
    suggestedTags: "self-identification, diagnosis, assessment, neurodivergent",
    anchorThreadType: "Start here",
    timeliness: "Timely/current community topic",
    communityUse: "Self-discovery resource page",
  },
  {
    theme: "Diagnosis and Identity Navigation",
    rank: 4,
    question: "How do I tell people about my diagnosis when I am not ready for their reactions?",
    response: "You get to choose the level of disclosure. You might share the practical part first: 'I process verbal instructions better when I can also see them written down.' You do not owe everyone your full diagnostic history. A boundary can be both honest and brief.",
    suggestedTags: "disclosure, diagnosis, boundaries, communication",
    anchorThreadType: "Script / Template",
    timeliness: "Evergreen launch seed",
    communityUse: "Disclosure scripts",
  },
  {
    theme: "Diagnosis and Identity Navigation",
    rank: 5,
    question: "How do I rebuild my self-image after years of thinking I was lazy or broken?",
    response: "Start by changing the explanation, not by demanding instant confidence. Many traits that were called laziness may have been executive function, sensory overload, anxiety, or unsupported difference. Confidence often grows when your life starts fitting your brain better. You are not starting from zero. You are reinterpreting old evidence with a better lens.",
    suggestedTags: "identity, self-compassion, late-diagnosis, reframing",
    anchorThreadType: "Open discussion",
    timeliness: "High emotional relevance",
    communityUse: "Identity recovery anchor thread",
  },
  {
    theme: "School and Learning Support",
    rank: 1,
    question: "What should I put in a one-page profile for my child's teacher?",
    response: "Keep it practical and kind to the teacher's time. Include: what helps my child learn, what can trigger distress, early warning signs, best communication style, sensory needs, and two strengths the teacher should notice. A good profile is not a full history. It is a quick-start guide for helping your child have a better day.",
    suggestedTags: "school, teacher-profile, accommodations, parent-advocacy",
    anchorThreadType: "Template",
    timeliness: "Back-to-school timely seed",
    communityUse: "Downloadable template",
  },
  {
    theme: "School and Learning Support",
    rank: 2,
    question: "How do we handle homework when my child is already exhausted after school?",
    response: "Assume the after-school crash is real. Try a decompression block before homework: food, movement, quiet, no interrogation. Then make the task smaller than feels necessary. Ten calm minutes often beats an hour of conflict. If homework regularly costs the whole evening, it may be time to talk to school about adjustments.",
    suggestedTags: "homework, routines, school, executive-function",
    anchorThreadType: "What helped me",
    timeliness: "Evergreen launch seed",
    communityUse: "Homework support guide",
  },
  {
    theme: "School and Learning Support",
    rank: 3,
    question: "How do I ask school for accommodations without sounding like I am making excuses?",
    response: "Frame accommodations as access to learning, not special treatment. You can say: 'We are trying to reduce barriers so my child can show what they know.' Bring specific examples and specific asks: movement breaks, written instructions, sensory options, chunked assignments, or a check-in point. Specific is harder to dismiss than general worry.",
    suggestedTags: "school-accommodations, advocacy, scripts, learning-support",
    anchorThreadType: "Script / Template",
    timeliness: "Evergreen launch seed",
    communityUse: "School advocacy scripts",
  },
  {
    theme: "School and Learning Support",
    rank: 4,
    question: "What can help with school refusal when pushing harder makes it worse?",
    response: "School refusal is usually communication from an overloaded system. Look for the reason: bullying, sensory overwhelm, anxiety, transitions, academic shame, or masking fatigue. The first goal is not force. It is understanding the barrier well enough to lower it. Work with school on a gradual, supported return rather than a daily power struggle.",
    suggestedTags: "school-refusal, anxiety, sensory, parent-support",
    anchorThreadType: "Open discussion",
    timeliness: "High emotional relevance",
    communityUse: "School refusal resource page",
  },
  {
    theme: "School and Learning Support",
    rank: 5,
    question: "How do we prepare for the move to secondary school without waiting for things to fall apart?",
    response: "Start earlier than feels necessary. Visit with your child's needs in mind, write down likely pressure points, ask how support works in practice, and get agreements in writing. Transitions are easier when the receiving school knows the child before the crisis version of the child appears.",
    suggestedTags: "secondary-transition, school-planning, send, parent-advocacy",
    anchorThreadType: "Resource",
    timeliness: "Seasonal/timely school transition seed",
    communityUse: "Transition checklist",
  },
];

const CSV_SEED_THREADS = csvRowsToSeedThreads(QUESTION_RESPONSE_CSV_ROWS);

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
  ...CSV_SEED_THREADS,
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
    const tid = s.seedMetadata
      ? `seed-csv-${normalizeForumTag(s.seedMetadata.theme)}-${s.seedMetadata.rank}`
      : `seed-thread-${i + 1}`;
    const created = new Date(
      now - s.daysAgo * day + (s.minutesOffset ?? 0) * 60_000
    ).toISOString();
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
      seedMetadata: s.seedMetadata,
    };

    let lastActivity = created;
    (s.replies ?? []).forEach((r, j) => {
      const rid = `seed-reply-${i + 1}-${j + 1}`;
      const rCreated = new Date(
        now -
          r.daysAgo * day +
          ((r.minutesOffset ?? 0) + j + 1) * 60_000
      ).toISOString();
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
