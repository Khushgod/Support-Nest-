/**
 * Pages to screenshot, ordered by user journey. Each entry produces one
 * image at walkthrough/screenshots/<slug>.png and one row in WALKTHROUGH.
 *
 * `auth: true` means the page requires sign-in. The harness logs in with a
 * dedicated test user before capturing those routes.
 *
 * `interact` is an optional async hook that runs after navigation and before
 * the screenshot — used to expand details/open tabs/etc. so the captured
 * state is representative.
 *
 * The list intentionally mirrors what the production-build route table
 * surfaces, so reviewers can confirm coverage at a glance.
 */
import type { Page } from "playwright";

export type ShotSpec = {
  slug: string;
  path: string;
  title: string;
  section: string;
  description: string;
  highlights?: string[];
  auth?: boolean;
  fullPage?: boolean;
  /** Hook to run on the page before the screenshot. */
  interact?: (page: Page) => Promise<void>;
  /** Override default 1440x900 viewport for this shot. */
  viewport?: { width: number; height: number };
};

export const SECTIONS = [
  "Landing & onboarding",
  "About & trust",
  "Community forum",
  "Resources library",
  "Free tools",
  "GeneTranslate (a SupportNest tool)",
  "Authenticated experience",
  "Edge cases",
] as const;

export const PAGES: ShotSpec[] = [
  // ---------- Landing & onboarding
  {
    slug: "01-home",
    path: "/",
    title: "Home — SupportNest landing",
    section: "Landing & onboarding",
    description:
      "The front door. A warm gradient hero with floating coral / sun / lavender blobs introduces SupportNest as a parent platform for parents, teachers, and neurodivergent people. The page sets expectations (free, ad-free, kind) and surfaces the four pillars that follow: community, events, resources, and free tools.",
    highlights: [
      "Hero with high-contrast warm gradient and inline CTAs (Join free / Try GeneTranslate)",
      "Audience cards highlight the three core groups so visitors immediately self-identify",
      "Pillars row introduces every major area (Community / Events / Resources / Tools)",
      "Tools section calls out GeneTranslate (Live) plus the four newer free tools",
      "Voices, security pledge, and a closing 'pull up a chair' CTA all reinforce the warm tone",
    ],
  },
  {
    slug: "02-register",
    path: "/register",
    title: "Register — Join SupportNest",
    section: "Landing & onboarding",
    description:
      "Free 30-second sign-up. Asks only what the platform actually needs (name, email, role, password) plus a clear consent checkbox. The privacy reminder under the form spells out the encryption posture in plain language so people can sign up with eyes open.",
    highlights: [
      "Role picker (Parent / Teacher / ND adult / Ally) tunes the post-signup experience",
      "Password rules surfaced inline; bcrypt-hashed at 12 rounds on the server",
      "Encryption notice (TLS in transit, AES-256-GCM at rest) anchors trust",
      "Direct link back to /login if you already have an account",
    ],
  },
  {
    slug: "03-login",
    path: "/login",
    title: "Log in — Welcome back",
    section: "Landing & onboarding",
    description:
      "Minimal login. Email + password, server-validated, with the same warm encryption chip beneath the form. Successful login redirects to the dashboard; failures keep you on the page with an inline message and never reveal whether the email was registered (timing-equalized).",
    highlights: [
      "HttpOnly + Secure + SameSite=Lax JWT session cookie set server-side",
      "Generic 'email or password didn't match' error to prevent enumeration",
      "Quick path to register if you don't have an account",
    ],
  },

  // ---------- About & trust
  {
    slug: "04-about",
    path: "/about",
    title: "About SupportNest",
    section: "About & trust",
    description:
      "A short, honest origin story. Five values in card form (Lived experience first / Kind by default / Slow growth / Privacy non-negotiable / Many ways to belong), a quote from the team, and a note that the platform is grant-supported with no advertisers in the mix.",
    highlights: [
      "Values cards reframe what a 'family resource' product can be when funded by donations, not ads",
      "Tone deliberately calmer than enterprise-style 'About' pages",
    ],
  },
  {
    slug: "05-privacy",
    path: "/privacy",
    title: "Privacy & Security",
    section: "About & trust",
    description:
      "Concrete commitments rather than marketing copy. Six cards spell out exactly how data is protected (HTTPS/HSTS, AES-256-GCM with HKDF per-record keys, minimal collection, no ad tracking, deletes propagated, no resale). A separate section links out to GeneTranslate's tool-specific local-first lifecycle, and a security email address is provided for responsible disclosure.",
    highlights: [
      "Calls out specific HSTS preload directive and SameSite cookie settings",
      "GeneTranslate-specific privacy section reinforces local-first architecture",
      "Plain-language deletion timeline (24 hours live; 30 days from encrypted backups)",
    ],
  },

  // ---------- Community forum
  {
    slug: "06-community",
    path: "/community",
    title: "Community hub",
    section: "Community forum",
    description:
      "The forum's front page. Live data drives every section: pinned highlights surface what mods think you should read first, the spaces grid shows real per-space thread counts and last-activity timestamps, the recent activity rail shows the latest threads across every space, and the trending-tags sidebar aggregates tags across the whole community.",
    highlights: [
      "Hero CTAs adapt to whether you're signed in (Start a thread vs. Join free to post)",
      "Spaces grid is data-driven from listSpaceStats(), not hard-coded",
      "Trending tags sidebar links straight into /community/search?tag=…",
      "Community guidelines strip lives at the bottom so newcomers see the norms early",
    ],
  },
  {
    slug: "07-community-space",
    path: "/community/first-steps",
    title: "Space view — First steps & introductions",
    section: "Community forum",
    description:
      "Every space has its own page with a colored gradient hero, a filter strip (sort + audience + content note + tag), a paginated thread list, and a trending-tags rail scoped to whatever you're viewing. The 'New thread in this space' button jumps you straight into the composer with the space pre-selected.",
    highlights: [
      "Filter strip filters server-side via the listThreads() typed query layer",
      "Pagination at 12 threads per page; pinned threads always rise to the top",
      "Sidebar lists every space + a tag rail for quick lateral movement",
    ],
  },
  {
    slug: "08-community-thread",
    path: "/community/first-steps/seed-thread-1",
    title: "Thread view",
    section: "Community forum",
    description:
      "A single thread with the OP, threaded replies, and every interaction surface enabled. Reactions (7 emoji set) are togglable per user; bookmarks and follows are one-click; pin / lock / delete only appear if you're the author. URLs in posts auto-link, content notes show inline, and the reaction legend at the bottom helps newcomers learn the vocabulary.",
    highlights: [
      "Reaction toggles use a Server Action; counts update with Next's revalidatePath",
      "Inline reply composer per reply for nested conversations",
      "Locked threads show existing replies but disable the composer at API + UI level",
      "Reaction legend at the bottom de-mystifies what each emoji means",
    ],
  },
  {
    slug: "09-community-search-empty",
    path: "/community/search",
    title: "Search — empty state",
    section: "Community forum",
    description:
      "Search lands empty until you ask for something. The form combines a free-text query with structured filters (space / audience / content note / tag) and a sort dropdown. The sidebar suggests spaces and trending tags as starting points.",
    highlights: [
      "Helpful empty state nudges you to start with a tag if you don't have a query in mind",
      "All filters compose; URL is the source of truth so any state is shareable",
    ],
  },
  {
    slug: "10-community-search-results",
    path: "/community/search?q=morning",
    title: "Search — with a query",
    section: "Community forum",
    description:
      "Substring search runs across thread titles, bodies, and tags (case-insensitive). Active filters render as removable chips at the top, the count line tells you exactly how many threads matched, and the sort dropdown auto-submits when you change it (extracted as a tiny client component because Server Components can't pass onChange handlers).",
    highlights: [
      "Removable filter chips with a single 'Clear all' for a clean reset",
      "Auto-submit sort widget keeps the URL canonical after every change",
      "Pagination preserves all active filters",
    ],
  },
  {
    slug: "11-community-new",
    path: "/community/new",
    title: "Compose a new thread",
    section: "Community forum",
    description:
      "The composer treats writing well as a feature. A visual space picker (cards, not a dropdown), audience tag toggles, content-note chips for heavy topics, character counters, and an autosaving draft (localStorage) that survives refresh. Validation is server-side via Zod; inline errors land next to each field.",
    highlights: [
      "Drafts autosave on every keystroke; refresh-safe via a hydratedRef pattern",
      "Picking a specific audience drops 'Everyone'; picking 'Everyone' clears the others",
      "Tags get auto-lowercased and de-duplicated; cap of 6 enforced server-side",
    ],
    auth: true,
  },
  {
    slug: "12-community-me",
    path: "/community/me",
    title: "Your activity",
    section: "Community forum",
    description:
      "A protected view onto everything you've done in the forum: bookmarks (saved-for-later), your threads, your replies (with the parent thread linked + a #r-anchor for jumping straight to the reply), and the threads you're following. Tab counts surface in the nav so you can see what you have without clicking.",
    highlights: [
      "Replies pane joins each reply back to its parent thread for one-click jump-to context",
      "Empty states are encouraging, not bare ('the community welcomes you whenever…')",
      "Same ThreadCard component as the rest of the forum keeps presentation consistent",
    ],
    auth: true,
  },

  // ---------- Resources library
  {
    slug: "13-resources",
    path: "/resources",
    title: "Resources library",
    section: "Resources library",
    description:
      "Hand-curated resources, organized by who they're for. Four collections (Parents / Teachers / ND adults / Healthcare & genetics) plus a 'Featured this week' rail with bite-sized reads. Anyone can browse; signed-in members can pin to a personal shelf.",
    highlights: [
      "Reviewers from the relevant role vet every resource before it lands here",
      "Featured rail tags each item with audience + read-time so it's easy to scan",
    ],
  },
  {
    slug: "14-resources-parents",
    path: "/resources/parents",
    title: "Resources for parents & caregivers",
    section: "Resources library",
    description:
      "A long shelf, pacing-friendly. First-week-after-diagnosis essentials, school & meeting templates, and daily-life regulation pieces. Each item carries a format chip (Article / Script / Checklist / Tool / Reading list) and an estimated read time.",
  },
  {
    slug: "15-resources-teachers",
    path: "/resources/teachers",
    title: "Resources for teachers & therapists",
    section: "Resources library",
    description:
      "Field-tested, classroom-tomorrow strategies. Regulation tools that scale, IEP / 504 templates that pass compliance review, and family-communication scripts. Co-curated with five teachers, three SLPs, and an OT in the community.",
  },
  {
    slug: "16-resources-nd-adults",
    path: "/resources/neurodivergent-adults",
    title: "Resources for neurodivergent adults",
    section: "Resources library",
    description:
      "Tuned to ND adult bandwidth. Workplace accommodations, energy & burnout, identity & late-diagnosis stories, and finding ND-affirming clinicians. Identity-first by default; person-first available where preferred.",
  },
  {
    slug: "17-resources-healthcare",
    path: "/resources/healthcare",
    title: "Healthcare & genetics resources",
    section: "Resources library",
    description:
      "The medical-system glossary you should not have to write yourself. Genetic testing & counseling pointers (including direct links into the GeneTranslate tool), what ACMG variant classifications actually mean, and a primer on decoding clinical letters.",
  },

  // ---------- Free tools
  {
    slug: "18-tools",
    path: "/tools",
    title: "Tools index",
    section: "Free tools",
    description:
      "All five SupportNest tools at a glance, each with a short tagline, longer description, and a 'Live' badge. Tools that don't need an account say so; the ones that save state make their privacy posture explicit (HTTPS in transit + AES-256-GCM at rest).",
  },
  {
    slug: "19-tools-plain-language",
    path: "/tools/plain-language",
    title: "Plain-Language Translator",
    section: "Free tools",
    description:
      "Paste a clinical letter, school evaluation, IEP draft, or insurance denial and get a plain-language rewrite. Audience presets (Plain English / Kid-friendly 8–12 / Quick summary / Action items) and a tone toggle (Warm / Neutral / Professional). Optional jargon glossary.",
    highlights: [
      "Routed through local Ollama via /api/tools/plain-language — no cloud LLM",
      "Three sample inputs let new users try the tool without finding their own text",
      "Live character counter and 12,000-character soft cap with friendly message",
    ],
  },
  {
    slug: "20-tools-iep-companion",
    path: "/tools/iep-companion",
    title: "IEP / 504 Companion — step 1",
    section: "Free tools",
    description:
      "Five-step wizard that turns strengths, challenges, an accommodation menu (50+ items in 9 areas), and concerns into a printable one-pager. Step 1 captures the basics: who you are (parent / teacher / self-advocate), the student's name, grade, and meeting date.",
    highlights: [
      "Live preview pane on the right updates as you type",
      "Drafts autosave to localStorage; refresh-safe",
      "Exports to PDF (jsPDF) and plain text",
    ],
  },
  {
    slug: "21-tools-iep-companion-step4",
    path: "/tools/iep-companion",
    title: "IEP / 504 Companion — accommodation menu",
    section: "Free tools",
    description:
      "Step 4 surfaces the accommodation menu, filtered to the challenge areas you picked in step 3. Every item is a single-tap toggle and the live preview on the right grows in real time. Custom accommodations can be added with a free-text field for anything the menu doesn't cover.",
    interact: async (page) => {
      // Step 1 -> 2 (Basics -> Strengths)
      await page.getByRole("button", { name: /^Next$/ }).click();
      // Step 2 -> 3 (Strengths -> Challenges)
      await page.getByRole("button", { name: /^Next$/ }).click();
      // In Step 3, pick a couple of challenge areas so the accommodation
      // menu in Step 4 is filtered to a meaningful subset.
      await page
        .getByRole("button", { name: /Sensory processing/i })
        .click();
      await page
        .getByRole("button", { name: /Executive function/i })
        .click();
      await page
        .getByRole("button", { name: /Communication/i })
        .first()
        .click();
      // Step 3 -> 4 (Challenges -> Accommodations)
      await page.getByRole("button", { name: /^Next$/ }).click();
      await page.waitForTimeout(200);
    },
  },
  {
    slug: "22-tools-regulation",
    path: "/tools/regulation-toolkit",
    title: "Regulation Toolkit — Right Now picker",
    section: "Free tools",
    description:
      "Three quick questions about your energy, body sensation, and current need surface a tailored set of evidence-informed regulation strategies. Polyvagal-informed framing distinguishes hyperarousal, hypoarousal, and the window of tolerance.",
    highlights: [
      "Strategy cards expand to show step-by-step instructions",
      "Tabs include the picker, an All Tools gallery, and a Box Breathing companion",
      "Pure client-side; nothing about your state leaves the browser",
    ],
  },
  {
    slug: "23-tools-regulation-breathe",
    path: "/tools/regulation-toolkit",
    title: "Regulation Toolkit — Box breathing",
    section: "Free tools",
    description:
      "A live 4-4-4-4 box-breathing companion. The gradient square scales with each phase, the seconds tick down on a tabular numeral display, the cycle counter shows progress toward the recommended 8 cycles, and there's a friendly fallback for anyone for whom holds are uncomfortable.",
    interact: async (page) => {
      await page.getByRole("button", { name: /Box breathing/i }).click();
    },
  },
  {
    slug: "24-tools-sensory",
    path: "/tools/sensory-planner",
    title: "Sensory Day Planner",
    section: "Free tools",
    description:
      "Map a day in time blocks, tag each block with sensory load (Calm / Low / Medium / High) and trigger chips (sound, light, crowds, transitions, touch, social demand, cognitive load), and the planner highlights stretches that look like meltdown bait.",
    highlights: [
      "Aggregate budget bar reflects total load across the day",
      "Suggestion engine flags 3+ medium/high blocks in a row and recommends a calm break",
      "Saves locally; exports to a printable text plan",
    ],
  },

  // ---------- GeneTranslate
  {
    slug: "25-genetranslate",
    path: "/tools/genetranslate",
    title: "GeneTranslate — overview",
    section: "GeneTranslate (a SupportNest tool)",
    description:
      "GeneTranslate's product page, scoped under the SupportNest tool umbrella with its own tool-sub-header bar. Same plain-language explainer as before, now with the SupportNest header above it so users always know they're inside a larger platform.",
  },
  {
    slug: "26-analyze",
    path: "/analyze",
    title: "GeneTranslate — Analyze a report",
    section: "GeneTranslate (a SupportNest tool)",
    description:
      "The PDF upload step. Drag-and-drop for Invitae, GeneDx, and other lab reports; manual entry as a fallback. The local-first promise (no cloud LLM, in-memory PDF parsing) is enforced server-side and explained right under the upload area.",
  },
  {
    slug: "27-manual-input",
    path: "/manual-input",
    title: "GeneTranslate — Manual variant entry",
    section: "GeneTranslate (a SupportNest tool)",
    description:
      "When the lab report layout isn't recognized, manual entry takes you through gene, HGVS notation, ACMG classification, condition, inheritance, and zygosity for each variant. Designed for people who can read the report but want help interpreting it.",
  },
  {
    slug: "28-genetranslate-faq",
    path: "/faq",
    title: "GeneTranslate — FAQ",
    section: "GeneTranslate (a SupportNest tool)",
    description:
      "Expandable FAQ panels covering data lifecycle, supported labs, accuracy, scope, and what GeneTranslate is and isn't. Tightly scoped to GeneTranslate, with sibling links to its tool-specific privacy and resources pages.",
  },
  {
    slug: "29-genetranslate-about",
    path: "/tools/genetranslate/about",
    title: "GeneTranslate — How it works",
    section: "GeneTranslate (a SupportNest tool)",
    description:
      "The five-stage pipeline (PDF extract → lab detect → ClinVar enrich → local LLM → safety scan), plus the tech stack and an explicit list of what the tool does NOT do. Reassures clinicians and counselors that the boundaries are well-defined.",
  },
  {
    slug: "30-genetranslate-privacy",
    path: "/tools/genetranslate/privacy",
    title: "GeneTranslate — Data lifecycle",
    section: "GeneTranslate (a SupportNest tool)",
    description:
      "Tool-specific privacy detail: PDFs in-memory only, results in browser sessionStorage, LLM running locally via Ollama, optional email pass-through with no retention, no accounts/cookies/analytics. Spells out the single outbound network call (ClinVar) and what it does and doesn't include.",
  },
  {
    slug: "31-genetranslate-resources",
    path: "/tools/genetranslate/resources",
    title: "GeneTranslate — Counselor finder",
    section: "GeneTranslate (a SupportNest tool)",
    description:
      "Curated directories for finding board-certified genetic counselors (NSGC, ABGC, CAGC), trusted patient-education resources (MedlinePlus, NIH GARD, NHGRI, ClinVar), and patient-support organizations.",
  },

  // ---------- Authenticated experience
  {
    slug: "32-dashboard",
    path: "/dashboard?welcome=1",
    title: "Dashboard — your nest",
    section: "Authenticated experience",
    description:
      "The signed-in landing. A welcome banner appears the first time after registration, four quick-action tiles (community / events / resources / tools), and the encrypted vault — anything you save through the tools is sealed with AES-256-GCM and a per-record key derived via HKDF-SHA256 from the user's scope.",
    highlights: [
      "Vault list pulls from listForUser() with metadata + decrypt-and-download links",
      "Logout button uses the same Server Action used elsewhere",
      "Quick-action tiles route to the most-used parts of the platform",
    ],
    auth: true,
  },

  // ---------- Edge cases
  {
    slug: "33-not-found",
    path: "/this-page-does-not-exist",
    title: "404 — That page hasn't hatched yet",
    section: "Edge cases",
    description:
      "The 404 page keeps the warm tone — soft gradient background, a coral 404 numeral, and friendly recovery CTAs back to home and the community. Same SupportNest header/footer as everywhere else so people don't feel lost.",
  },
];
