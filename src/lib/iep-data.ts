/**
 * IEP/504 Companion data: challenge areas, common strengths, and an
 * accommodation menu organized by area.
 *
 * Lightly opinionated, drawn from publicly available accommodation lists used
 * in U.S. school IEP/504 practice. This is educational content, not legal
 * advice.
 */

export type ChallengeArea =
  | "sensory"
  | "executive_function"
  | "communication"
  | "social_emotional"
  | "academic"
  | "regulation"
  | "transitions"
  | "motor"
  | "behavioral";

export const CHALLENGE_AREAS: { id: ChallengeArea; label: string; blurb: string }[] = [
  {
    id: "sensory",
    label: "Sensory processing",
    blurb: "Lights, sounds, textures, smells, motion.",
  },
  {
    id: "executive_function",
    label: "Executive function",
    blurb: "Starting tasks, time, organization, working memory.",
  },
  {
    id: "communication",
    label: "Communication",
    blurb: "Receptive/expressive language, AAC, conversation.",
  },
  {
    id: "social_emotional",
    label: "Social & emotional",
    blurb: "Friendships, group work, reading social cues, anxiety.",
  },
  {
    id: "academic",
    label: "Academics",
    blurb: "Reading, writing, math, processing speed.",
  },
  {
    id: "regulation",
    label: "Regulation",
    blurb: "Recognizing and managing big feelings; meltdowns/shutdowns.",
  },
  {
    id: "transitions",
    label: "Transitions",
    blurb: "Between activities, classrooms, settings, days.",
  },
  {
    id: "motor",
    label: "Motor",
    blurb: "Handwriting, fine motor, gross motor, coordination.",
  },
  {
    id: "behavioral",
    label: "Behavioral support",
    blurb: "FBA-informed plans, antecedent strategies, replacement skills.",
  },
];

export const COMMON_STRENGTHS = [
  "Strong vocabulary",
  "Detail-oriented",
  "Pattern recognition",
  "Visual thinker",
  "Deep interests / hyperfocus",
  "Creative",
  "Honest / direct",
  "Empathetic",
  "Mathematical reasoning",
  "Memory for facts",
  "Tech / coding aptitude",
  "Strong sense of justice",
  "Resilience",
  "Loyal friend",
  "Loves to read",
  "Enjoys building / making",
];

export type Accommodation = {
  id: string;
  text: string;
  area: ChallengeArea;
};

export const ACCOMMODATIONS: Accommodation[] = [
  // Sensory
  { id: "s1", area: "sensory", text: "Permission to wear noise-reducing headphones or earplugs in class." },
  { id: "s2", area: "sensory", text: "Access to a quieter testing/work space or sensory room as needed." },
  { id: "s3", area: "sensory", text: "Reduced fluorescent-light exposure (preferential seating, lamp, dimmer)." },
  { id: "s4", area: "sensory", text: "Access to fidget tools, weighted lap pad, or chewable jewelry." },
  { id: "s5", area: "sensory", text: "Pre-warning before fire drills or assemblies whenever possible." },
  { id: "s6", area: "sensory", text: "Allow alternative seating (wobble cushion, standing desk, floor space)." },
  { id: "s7", area: "sensory", text: "Permit eating in a quieter location at lunch when needed." },

  // Executive function
  { id: "e1", area: "executive_function", text: "Preview agenda for the day; transitions previewed in advance." },
  { id: "e2", area: "executive_function", text: "Chunk multi-step assignments into smaller steps with checkpoints." },
  { id: "e3", area: "executive_function", text: "Provide written copies of verbal instructions." },
  { id: "e4", area: "executive_function", text: "Use visual schedules and checklists; allow taking pictures of the board." },
  { id: "e5", area: "executive_function", text: "Extended time on assessments (1.5x or 2x as appropriate)." },
  { id: "e6", area: "executive_function", text: "Color-coded folders / digital organization support." },
  { id: "e7", area: "executive_function", text: "Daily/weekly check-in with a case manager or advisory teacher." },
  { id: "e8", area: "executive_function", text: "Permission to use timers and time-management apps." },

  // Communication
  { id: "c1", area: "communication", text: "Allow use of AAC devices, text-to-speech, or speech-to-text." },
  { id: "c2", area: "communication", text: "Provide processing time before requiring a verbal response." },
  { id: "c3", area: "communication", text: "Pre-print discussion questions; allow written instead of verbal participation." },
  { id: "c4", area: "communication", text: "Reduce 'cold-calling'; offer turn-taking systems instead." },
  { id: "c5", area: "communication", text: "Allow non-verbal signals to indicate needs (e.g., break card, color cards)." },

  // Social & emotional
  { id: "se1", area: "social_emotional", text: "Identified safe adult and check-in routine at the start of the day." },
  { id: "se2", area: "social_emotional", text: "Strategic group-work partnering; not always pick-your-own." },
  { id: "se3", area: "social_emotional", text: "Access to lunch club / structured social time during unstructured periods." },
  { id: "se4", area: "social_emotional", text: "Counselor support and pre-arranged crisis plan." },
  { id: "se5", area: "social_emotional", text: "Modified attendance considerations during high-anxiety periods, with a plan." },

  // Academic
  { id: "a1", area: "academic", text: "Reduced volume of homework when full set is not necessary to demonstrate mastery." },
  { id: "a2", area: "academic", text: "Audiobooks / read-aloud option for grade-level texts." },
  { id: "a3", area: "academic", text: "Math facts on a reference sheet; calculator on appropriate assessments." },
  { id: "a4", area: "academic", text: "Graphic organizers and templates for written work." },
  { id: "a5", area: "academic", text: "Alternative assessments (oral, project-based, multiple-choice)." },
  { id: "a6", area: "academic", text: "Spelling not penalized in non-spelling subjects." },

  // Regulation
  { id: "r1", area: "regulation", text: "Pre-arranged 'movement break' or 'reset pass' usable without justification, up to N times per day." },
  { id: "r2", area: "regulation", text: "Access to a calm-down space and identified de-escalation routine." },
  { id: "r3", area: "regulation", text: "Visual zones-of-regulation chart shared with all teachers." },
  { id: "r4", area: "regulation", text: "Plan that distinguishes meltdown (overload) from misbehavior (intent)." },
  { id: "r5", area: "regulation", text: "After-overload re-entry routine documented and consistent across classrooms." },

  // Transitions
  { id: "t1", area: "transitions", text: "5-minute and 1-minute warnings before transitions." },
  { id: "t2", area: "transitions", text: "Permission to leave class 2–3 minutes early to avoid hallway crush." },
  { id: "t3", area: "transitions", text: "Predictable bell schedule shared in advance; substitute teachers briefed." },
  { id: "t4", area: "transitions", text: "Special transition support for known triggers (e.g., field trips, fire drills)." },
  { id: "t5", area: "transitions", text: "Gradual re-entry plan after extended absences." },

  // Motor
  { id: "m1", area: "motor", text: "Permission to type assignments instead of handwriting." },
  { id: "m2", area: "motor", text: "Provide pencil grips, slant boards, and adapted tools as recommended by OT." },
  { id: "m3", area: "motor", text: "Reduce volume of handwritten copy work; provide pre-printed notes." },
  { id: "m4", area: "motor", text: "Adapted PE plan when needed; alternative activities allowed." },

  // Behavioral
  { id: "b1", area: "behavioral", text: "Functional Behavior Assessment (FBA) completed; Behavior Intervention Plan (BIP) attached." },
  { id: "b2", area: "behavioral", text: "Antecedent strategies prioritized over consequences." },
  { id: "b3", area: "behavioral", text: "Replacement skills explicitly taught and reinforced." },
  { id: "b4", area: "behavioral", text: "Reinforcement plan tied to student-identified rewards, not generic ones." },
  { id: "b5", area: "behavioral", text: "Suspensions reviewed for manifestation determination per IDEA." },
];

export const ROLES = [
  { id: "parent", label: "Parent / caregiver" },
  { id: "teacher", label: "Teacher / case manager" },
  { id: "self", label: "Self-advocate (student or adult)" },
] as const;
export type IepRole = (typeof ROLES)[number]["id"];
