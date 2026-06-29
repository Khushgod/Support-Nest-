// Central content registry for the Resources library.
// Every resource card (except the GeneTranslate tool and internal /tools links)
// resolves to an in-app article page at /resources/<slug>, rendered by [slug]/page.tsx.
// Slugs are derived from the title via slugify() so the collection pages and the
// reader stay in sync without duplicating the slug string.

export type Block =
  | { k: "p"; t: string }
  | { k: "h"; t: string }
  | { k: "ul"; i: string[] }
  | { k: "ol"; i: string[] }
  | { k: "note"; t: string }
  | { k: "quote"; t: string };

export type CollKey = "parents" | "teachers" | "adults" | "healthcare";
export type ArticleFormat = "Article" | "Script" | "Checklist" | "Reading list";

export type Article = {
  slug: string;
  title: string;
  dek: string;
  audience: string;
  coll: CollKey;
  minutes: number;
  format: ArticleFormat;
  body: Block[];
};

type ArticleSeed = Omit<Article, "slug">;

export const COLLECTION_META: Record<
  CollKey,
  { label: string; href: string }
> = {
  parents: { label: "For parents & caregivers", href: "/resources/parents" },
  teachers: { label: "For teachers & therapists", href: "/resources/teachers" },
  adults: {
    label: "For neurodivergent adults",
    href: "/resources/neurodivergent-adults",
  },
  healthcare: { label: "Healthcare & genetics", href: "/resources/healthcare" },
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Block helpers — keep the article bodies terse and readable.
const p = (t: string): Block => ({ k: "p", t });
const h = (t: string): Block => ({ k: "h", t });
const ul = (...i: string[]): Block => ({ k: "ul", i });
const ol = (...i: string[]): Block => ({ k: "ol", i });
const note = (t: string): Block => ({ k: "note", t });
const quote = (t: string): Block => ({ k: "quote", t });

const PARENTS: ArticleSeed[] = [
  {
    title: "What to do in the first 14 days (and what can wait)",
    dek: "A gentle two-week pacing plan for right after an evaluation — what matters now, and what can absolutely wait.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Article",
    body: [
      p("An evaluation report is not a countdown clock. Almost nothing on it needs action this week. The most useful thing you can do in the first fortnight is protect your own bandwidth, so the bigger decisions later are made by a rested version of you."),
      h("A pace for the first two weeks"),
      ol(
        "Days 1–3: Rest. Tell one trusted person. Don't research at 2am.",
        "Days 4–7: Read the report once, slowly. Highlight only what you don't understand.",
        "Days 8–10: Write your questions down. Book a follow-up to ask them.",
        "Days 11–14: Pick one small, concrete next step — and stop there."
      ),
      h("What can genuinely wait"),
      ul(
        "Choosing therapies — that's weeks or months away, not days.",
        "Telling extended family — only when you're ready, on your terms.",
        "Big school decisions — the system moves slowly; you have time."
      ),
      note("If grief shows up instead of relief, that's normal and healthy. It is not a verdict on your child, or on you."),
    ],
  },
  {
    title: "Decoding an evaluation report, paragraph by paragraph",
    dek: "Standardized scores, narrative sections, and the recommendations table — translated into plain language.",
    audience: "Parents",
    coll: "parents",
    minutes: 10,
    format: "Article",
    body: [
      p("Evaluation reports are written for other clinicians, not for parents. That's why they feel cold and dense. Here's the map so you can read yours without a dictionary."),
      h("The four parts of almost every report"),
      ol(
        "Background & history — context the clinician was given. Check it for errors.",
        "Test scores — usually a table with standard scores and percentiles.",
        "Narrative / clinical impressions — what the clinician concluded and why.",
        "Recommendations — the part that actually drives next steps."
      ),
      h("Reading the scores without panic"),
      p("Most tests are scaled so 100 is average and roughly two-thirds of children fall between 85 and 115. A percentile is just 'out of 100 same-age peers, how many scored at or below this.' A single low score is a data point, not a destiny."),
      note("The recommendations section is the one to photocopy and bring to school. The scores explain the 'why'; the recommendations are the 'what now.'"),
    ],
  },
  {
    title: "How to tell your child (age-by-age scripts)",
    dek: "Conversation openers for ages 4–6, 7–10, 11–14, and 15+ — honest, warm, and never framed as bad news.",
    audience: "Parents",
    coll: "parents",
    minutes: 5,
    format: "Script",
    body: [
      p("Kids usually already know they're different. Naming it gives them language and relief, not a label to fear. Lead with strengths, keep it short, and leave the door open for more later."),
      h("Ages 4–6"),
      quote("Your brain works in its own cool way. Some things are easy for you that are tricky for other kids, and some things are the other way round. That's just how brains come."),
      h("Ages 7–10"),
      quote("There's a word for the way your brain is wired — autistic / ADHD. It's not a sickness. It explains why loud places wear you out and why you can focus so hard on the things you love."),
      h("Ages 11–14"),
      quote("I want to share something the doctor helped us understand about you. It's a part of who you are, lots of people share it, and it doesn't change a single thing about how much I'm on your team."),
      h("Ages 15+"),
      quote("You're old enough to lead this conversation. Here's what the assessment said. What do you already feel fits? What do you want to do with it — or not?"),
      note("There's no perfect script. Showing it isn't shameful matters more than getting the words exactly right."),
    ],
  },
  {
    title: "Gentle scripts for telling extended family",
    dek: "Boundaries, FAQs, and what to do when grandma 'doesn't believe in it.'",
    audience: "Parents",
    coll: "parents",
    minutes: 4,
    format: "Script",
    body: [
      p("You don't owe anyone a debate about your child. These lines let you share what you choose to share and close the topic when it stops being useful."),
      h("Opening line"),
      quote("We've learned something about how [child] is wired, and it's helped us support them better. I'm telling you because you love them — not because I'm looking for opinions on it."),
      h("When you hear 'they'll grow out of it' or 'back in my day…'"),
      quote("I know it's new language. The support is what's changed things for us, and that's what I need backed up — not the diagnosis re-litigated."),
      h("Setting a boundary"),
      quote("I'm not going to keep defending this. You don't have to fully understand it to be kind about it. That part isn't optional."),
      note("Some relatives come around slowly, after they see your child thrive. You're allowed to protect your energy while they catch up."),
    ],
  },
  {
    title: "IEP meeting prep: a 20-minute walkthrough",
    dek: "A pre-meeting checklist, a talking-point worksheet, and what to do if it goes sideways.",
    audience: "Parents",
    coll: "parents",
    minutes: 8,
    format: "Checklist",
    body: [
      p("Walking in prepared changes the whole tone. You don't need to be a lawyer — you need three priorities and a calm way to ask for them."),
      h("Before the meeting"),
      ul(
        "Re-read the latest report; mark 2–3 things you most want addressed.",
        "Write your top three priorities in one sentence each.",
        "Ask for the draft IEP in advance — you're entitled to read before you sign.",
        "Bring one specific example of each concern (a photo, a note, a quote)."
      ),
      h("In the room"),
      ul(
        "Start by naming a shared goal: 'We all want them to have a good year.'",
        "Ask 'What will this look like day to day?' for every accommodation.",
        "If something's vague, ask for it in writing with a who and a when."
      ),
      h("If it goes sideways"),
      p("You can pause. Say: 'I'd like to think about this and continue another day.' You never have to sign at the table. Request everything discussed in writing before you agree."),
      note("Disagreement is documented in the record. A polite 'I don't agree, and here's why' is a normal, powerful sentence."),
    ],
  },
  {
    title: "Plain-English accommodation menu",
    dek: "A browsable list of common accommodations grouped by what they actually help with.",
    audience: "Parents",
    coll: "parents",
    minutes: 5,
    format: "Reading list",
    body: [
      p("Accommodations aren't favors — they're how a fair playing field gets built. Skim by the problem you're seeing and bring a few options to the table."),
      h("For attention & focus"),
      ul("Preferential seating", "Scheduled movement breaks", "Chunked instructions", "A quiet space to reset"),
      h("For sensory needs"),
      ul("Noise-reducing headphones", "Dimmer / alternative lighting", "Permission to fidget", "Advance warning of fire drills"),
      h("For processing & output"),
      ul("Extra time on tasks and tests", "Verbal answers instead of written", "Notes or slides provided in advance", "Assistive tech (speech-to-text)"),
      h("For regulation"),
      ul("A check-in adult", "A discreet exit signal", "Reduced homework load during hard weeks"),
      note("You don't pick everything. Choose the two or three that target what you're actually seeing, and review them next term."),
    ],
  },
  {
    title: "Email templates for school transitions",
    dek: "Copy-and-edit templates for a mid-year teacher change, a principal escalation, and accommodation revisions.",
    audience: "Parents",
    coll: "parents",
    minutes: 3,
    format: "Script",
    body: [
      p("Short, warm, specific emails get answered. Use these as starting points and trim to fit."),
      h("New teacher introduction"),
      quote("Hi [Name], I'm [child]'s parent. They have an IEP/504 and I'd love 15 minutes before things get busy to share what helps them have a good day. What works for your schedule?"),
      h("Polite escalation to a principal"),
      quote("Hi [Name], I've raised [issue] twice with [teacher] without a resolution and wanted to loop you in. I'm confident we can sort it out together — could we find a time this week?"),
      h("Requesting an accommodation revision"),
      quote("Hi [Name], [accommodation] isn't landing the way we hoped — here's what we're seeing. Could we adjust it to [proposed change] and check back in a month?"),
      note("Keep a folder of sent emails. A friendly paper trail is your best friend if you ever need one."),
    ],
  },
  {
    title: "Getting your child's voice into the meeting",
    dek: "Three age-appropriate ways for kids to weigh in on their own plan.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Article",
    body: [
      p("Plans land better when the child had a say. Even young kids can contribute something true about what helps and what hurts."),
      h("Three ways in"),
      ol(
        "The two-column page: 'What helps me' / 'What's hard for me.' Drawings count.",
        "A short voice note the child records, played at the start of the meeting.",
        "For teens: a seat at the table, with one prepared point they want heard."
      ),
      p("You're not handing them the whole meeting — you're making sure the plan reflects the person it's about. Self-advocacy is a skill, and this is where it starts."),
      note("If your child says something that contradicts the adults' assumptions, treat it as the most important data in the room."),
    ],
  },
  {
    title: "The low-demand morning routine",
    dek: "Why insisting on toothbrushing might cost you the whole morning — and what to do instead.",
    audience: "Parents",
    coll: "parents",
    minutes: 7,
    format: "Article",
    body: [
      p("Mornings are a series of demands stacked on a half-awake nervous system. For a demand-avoidant or easily overloaded kid, the order and the framing matter more than the checklist."),
      h("Cut the stack"),
      ul(
        "Move what you can to the night before (clothes out, bag packed).",
        "Offer choices, not commands: 'Socks or shoes first?' keeps autonomy intact.",
        "Drop the battles that don't change the day — a missed toothbrush is recoverable."
      ),
      h("Lower the temperature"),
      p("A regulated adult is the best tool you have. If you're rushing and tense, the demand feels bigger. Build in a ten-minute buffer that exists only to absorb the wobble."),
      note("A 'good morning' is one where everyone arrives intact — not one where every box got ticked."),
    ],
  },
  {
    title: "Sensory-friendly grocery & errand kit",
    dek: "A pre-made list of what to pack so a supermarket trip doesn't end in the parking lot.",
    audience: "Parents",
    coll: "parents",
    minutes: 4,
    format: "Checklist",
    body: [
      p("Shops are sensory minefields: fluorescent lights, echo, smells, crowds. A small kit and a plan turn 'impossible' into 'doable.'"),
      h("Pack"),
      ul(
        "Noise-reducing headphones or earplugs",
        "A favourite fidget or comfort object",
        "A snack and water",
        "A simple visual list (pictures of the few items) so the trip has a visible end"
      ),
      h("Plan"),
      ul(
        "Go at quiet hours, not after school or on weekends.",
        "Name the finish line up front: 'Five things, then we're out.'",
        "Have a calm exit script ready in case you need to leave — leaving early is a win, not a failure."
      ),
      note("If it goes wrong, nothing has gone wrong. You gathered data for next time."),
    ],
  },
  {
    title: "Sibling support without comparison",
    dek: "How to talk about differences without making any sibling feel less seen.",
    audience: "Parents",
    coll: "parents",
    minutes: 5,
    format: "Article",
    body: [
      p("Siblings notice everything — including when one child seems to get more attention or different rules. The goal isn't identical treatment; it's each child feeling individually known."),
      h("What helps"),
      ul(
        "Frame needs, not ranks: 'Everyone gets what they need, and needs look different.'",
        "Protect a little one-on-one time with each child that isn't about the diagnosis.",
        "Let siblings have their own hard feelings without rushing to fix or hush them."
      ),
      p("Avoid casting a sibling as a junior carer. They can be kind and helpful without their childhood becoming a job."),
      note("'It's not fair' usually means 'I need to feel seen too.' That's answerable — and worth answering."),
    ],
  },
  {
    title: "Accepting the autism diagnosis: 5 steps of grieving",
    dek: "The classic grief stages, reframed for parents — ending not at loss, but at action.",
    audience: "Parents",
    coll: "parents",
    minutes: 7,
    format: "Article",
    body: [
      p("Many parents are surprised to feel grief after a diagnosis. You're not grieving your child — you're grieving an imagined future, and making room for the real one. The familiar five stages can be a useful map."),
      h("The stages, loosely"),
      ol(
        "Denial — 'Maybe the assessment is wrong.' A pause to catch your breath.",
        "Anger — at the system, the wait, the unfairness. Valid fuel, if you aim it.",
        "Bargaining — 'If we just do enough therapy…' The wish to control the uncontrollable.",
        "Sadness — the heaviest and most necessary part. Let it move through.",
        "Acceptance — not resignation, but clarity: this is my child, and here's how I help."
      ),
      p("These don't run in a neat line. You'll loop back, especially at milestones. That's the cycle, not a setback."),
      note("Acceptance is where advocacy begins. You can't fight effectively for a child you're still wishing were different."),
    ],
  },
  {
    title: "Stages of acceptance of your child's diagnosis",
    dek: "Why letting yourself feel the sadness is what eventually moves you toward action.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Article",
    body: [
      p("There's a quiet myth that 'good' parents skip straight to positivity. In practice, the parents who land best are the ones who let themselves feel the hard part first."),
      h("Feeling it is the work"),
      p("Suppressed grief doesn't disappear — it leaks out as exhaustion, short fuses, and decision paralysis. Naming the sadness ('I'm allowed to find this hard') is what frees up the energy to act."),
      h("Signs you're moving toward acceptance"),
      ul(
        "You start describing your child's traits without flinching.",
        "You make decisions from their actual needs, not the imagined ones.",
        "Hope returns — quieter, more durable, and more honest than before."
      ),
      note("Toxic positivity skips the feeling. Real acceptance includes it, then keeps going."),
    ],
  },
  {
    title: "Understanding the autism grief cycle in parents",
    dek: "How professional, family, and community support can make the process far less lonely.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Article",
    body: [
      p("Grief done in isolation gets stuck. The single biggest predictor of moving through it well is whether you have somewhere honest to put it."),
      h("Three kinds of support that help"),
      ul(
        "Professional — a counsellor who gets neurodivergence, even for a few sessions.",
        "Peer — other parents who've been here and won't flinch at the hard days.",
        "Practical — someone who'll take a task off your plate so you can breathe."
      ),
      p("You don't need all three at once. One real connection can change the whole experience of the first year."),
      note("Asking for help isn't failing the test of parenthood. It's how the durable parents last the distance."),
    ],
  },
  {
    title: "The autism grief cycle: a guide for parents and caregivers",
    dek: "A stage-by-stage guide that normalizes the emotions and points to the right support at each one.",
    audience: "Parents",
    coll: "parents",
    minutes: 8,
    format: "Article",
    body: [
      p("Recognising the grief cycle for what it is — a normal response, not a flaw — is what lets families stop fighting their own feelings and start using them."),
      h("What's normal at each stage"),
      ul(
        "Shock: numbness, going through the motions. Keep things small.",
        "Searching: over-Googling at midnight. Cap it; sleep matters more.",
        "Disorganisation: everything feels like too much. Lower the bar on purpose.",
        "Reorganisation: a new normal forms, and it's more solid than the old one."
      ),
      h("A note on time"),
      p("Recovery is typically measured in months and sometimes years, not days or weeks. Going gently is not going slowly — it's going sustainably."),
      note("If grief tips into something that won't lift — no joy, no sleep, no appetite — that's a reason to talk to a professional, not to push harder."),
    ],
  },
  {
    title: "The autism journey: accepting vs. resisting a diagnosis",
    dek: "Resistance isn't the enemy of acceptance — channelled well, it becomes advocacy.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Article",
    body: [
      p("'Resistance' gets a bad name. Some of it is denial — but some of it is the very fire that makes a parent stand up in a meeting and refuse to be brushed off."),
      h("Two kinds of resistance"),
      ul(
        "Resistance to reality — 'This isn't happening.' This one keeps you stuck.",
        "Resistance to low expectations — 'No, my kid can, with the right support.' This one moves mountains."
      ),
      p("The skill is sorting which is which. Let go of the first; sharpen the second into clear, specific asks."),
      note("Acceptance of your child and high expectations for your child are not opposites. The best advocates hold both."),
    ],
  },
  {
    title: "Understanding the autism grief cycle in families",
    dek: "Everyone's path differs in order and intensity — and that's exactly what's normal.",
    audience: "Parents",
    coll: "parents",
    minutes: 5,
    format: "Article",
    body: [
      p("Two parents in the same house can be in completely different places — one researching furiously, one not ready to talk. Neither is doing it wrong."),
      h("When partners grieve differently"),
      ul(
        "Name it out loud: 'We're processing this at different speeds, and that's okay.'",
        "Don't make one person's pace the 'correct' one.",
        "Find one shared, concrete next step you can both stand behind."
      ),
      p("Kids and siblings have their own version of this cycle too. Give the whole family room to feel it in their own order."),
      note("The goal isn't to grieve in sync. It's to keep talking while you each find your footing."),
    ],
  },
  {
    title: "Myths and the grief cycle, explained",
    dek: "Busting the myths that make the early days harder than they need to be — starting with intelligence.",
    audience: "Parents",
    coll: "parents",
    minutes: 5,
    format: "Article",
    body: [
      p("A lot of early grief is grief over myths, not over your actual child. Clearing the myths often clears a surprising amount of the weight."),
      h("Myths worth dropping"),
      ul(
        "'Autistic means not intelligent.' Intelligence is entirely separate from being autistic.",
        "'A diagnosis is a ceiling.' It's a map, not a limit.",
        "'They'll never…' Predictions made at diagnosis age out fast. Stay curious instead.",
        "'It's caused by something we did.' It isn't, and that guilt helps no one."
      ),
      note("When a wave of grief hits, ask: am I grieving my child, or a myth about my child? The answer often softens it."),
    ],
  },
  {
    title: "Grief among parents of autistic children: a systematic review",
    dek: "What the research literature actually finds about parental grief — in plain language.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Reading list",
    body: [
      p("This is a plain-language summary of what published reviews on parental grief tend to converge on — useful if you want to know your experience is documented and normal."),
      h("Recurring findings"),
      ul(
        "Grief after a child's diagnosis is common, real, and not a sign of rejecting the child.",
        "Parental coping strongly shapes outcomes — for the child's progress and the family's wellbeing.",
        "Support (professional and peer) consistently buffers distress.",
        "Grief tends to recur at transitions — starting school, adolescence, adulthood."
      ),
      note("If it helps to know: the heaviness you may feel is one of the most-studied and best-validated parts of this whole experience."),
    ],
  },
  {
    title: "Living-loss: a narrative synthesis of the grief process",
    dek: "The idea of 'living loss' — and why parents describe a roughly two-year arc.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Reading list",
    body: [
      p("'Living loss' names something specific: grieving an expected future while the beloved person is right here, thriving in their own way. Researchers find it follows a long arc."),
      h("What parents describe"),
      ul(
        "An early mix of shock, denial, fear, guilt, and sorrow — often all at once.",
        "A roughly two-year arc, with intensity shaped by how the news was delivered.",
        "A gradual shift from 'loss of the imagined child' to 'love of the actual child.'"
      ),
      p("Knowing it's an arc — not a permanent state — is itself a relief for many parents in the thick of it."),
      note("A blunt or rushed diagnosis delivery tends to make the grief sharper. If yours was handled badly, that wasn't your failing."),
    ],
  },
  {
    title: "Parents' experiences after a child's autism diagnosis",
    dek: "The themes that come up again and again when parents describe the months after diagnosis.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Reading list",
    body: [
      p("Qualitative studies — where researchers simply listen to parents — surface a handful of themes so consistent they're almost universal."),
      h("Themes parents name"),
      ul(
        "'Shock and control' — scrambling to regain footing after the floor shifts.",
        "'A thousand little conversations' — explaining, again and again, to everyone.",
        "'Put your own oxygen mask on first' — learning that self-care is load-bearing.",
        "Identity wobble — feeling subsumed by the diagnosis before re-finding yourself."
      ),
      note("If you've felt all four of these, you're not coping badly. You're having the documented, normal experience."),
    ],
  },
  {
    title: "Affiliate stigma among parents in eastern India",
    dek: "What research on 'affiliate stigma' shows about the weight Indian parents carry — and why it isn't yours to hold.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Reading list",
    body: [
      p("'Affiliate stigma' is the stigma you absorb by association — the shame society tries to attach to families. Indian research shows it's heavy, often heavier than the outward behaviour of others would suggest."),
      h("What the research highlights"),
      ul(
        "Internalised stigma drives real psychological distress in parents.",
        "Mothers tend to perceive more stigma than fathers.",
        "Felt stigma (what you brace for) often exceeds enacted stigma (what's actually said).",
        "Stigma delays help-seeking — the cost lands on the child."
      ),
      note("The stigma is a flaw in the society, not in your family. Naming it as external is the first step to setting it down."),
    ],
  },
  {
    title: "Breaking the stigma: ADHD & autism awareness in India",
    dek: "Why labels like 'problem child' and 'slow learner' persist in India — and how families push back.",
    audience: "Parents",
    coll: "parents",
    minutes: 6,
    format: "Article",
    body: [
      p("In much of India, neurodivergence is still read through an old lens: a 'problem child,' a 'slow learner,' or 'bad parenting.' That mindset delays diagnosis and isolates families."),
      h("Where the stigma comes from"),
      ul(
        "Invisible disability — no outward marker, so behaviour gets moralised.",
        "Limited public awareness and outdated school training.",
        "Fear of marriage and social prospects driving secrecy."
      ),
      h("What shifts it"),
      p("Plain, repeated, non-defensive explanation — 'this is how their brain is wired' — plus visible examples of neurodivergent people doing well. Change is slow, but it's happening, especially among younger families."),
      note("You are not responsible for fixing a whole culture's awareness. You're responsible for protecting one child inside it."),
    ],
  },
  {
    title: "ADHD and autism in India: what research reveals",
    dek: "Expensive, urban-centric, and slow — the real barriers Indian families face, and how to work around them.",
    audience: "Parents",
    coll: "parents",
    minutes: 7,
    format: "Article",
    body: [
      p("The research picture in India is clear-eyed: services exist, but access is the bottleneck. Knowing the barriers helps you plan around them."),
      h("The barriers, named"),
      ul(
        "Cost — assessment and therapy are expensive and rarely insured.",
        "Geography — services cluster in metros; families travel hundreds of kilometres.",
        "Waits — months between referral and appointment are common.",
        "Awareness gaps — even some professionals miss subtler presentations, especially in girls."
      ),
      h("Working around them"),
      p("Tele-assessment is expanding access. Parent WhatsApp groups crowdsource which clinicians and schools actually deliver. NGOs like Action for Autism run sliding-scale and training programmes."),
      note("If you're rural or low-income, you're not at the back of a fair queue — you're facing a structural gap. Community knowledge is your strongest tool."),
    ],
  },
  {
    title: "Inclusive education in India: rights, IEPs & ADHD",
    dek: "The RTE and RPWD Acts give your child the right to mainstream school and reasonable accommodations.",
    audience: "Parents",
    coll: "parents",
    minutes: 8,
    format: "Article",
    body: [
      p("Many Indian parents don't know their child has a legal right to be in a mainstream classroom — with support. Two laws back you up."),
      h("The two laws to know"),
      ul(
        "RTE Act (2009) — the right to free education in mainstream schools.",
        "RPWD Act (2016) — recognises autism and ADHD, and requires reasonable accommodations and non-discrimination."
      ),
      h("Turning rights into reality"),
      ol(
        "Put your accommodation request in writing, citing the RPWD Act.",
        "Ask for a specific, named plan — who does what, and when.",
        "Keep records of every request and reply.",
        "If refused, escalate calmly to the principal, then the district authority."
      ),
      note("A school saying 'we don't do that here' is not the final word. The law is. A polite, written, rights-based ask is hard to ignore."),
    ],
  },
  {
    title: "Just got the diagnosis — the grief wave",
    dek: "A discussion guide for the thread parents start when relief and grief arrive together.",
    audience: "Parents",
    coll: "parents",
    minutes: 4,
    format: "Script",
    body: [
      p("This one's for the car-ride-home silence after a diagnosis. If you're starting or joining this conversation in the community, here's how to make it a soft place to land."),
      quote("We left the doctor's office and no one spoke. I thought I'd feel relief — instead I'm grieving. Is it wrong to feel this sad about my own child?"),
      h("Prompts that open it up"),
      ul(
        "What did the first days actually feel like for you?",
        "When did grief start turning into acceptance?",
        "What helped you move forward — and what didn't?",
        "For parents further along: does the grief come back?"
      ),
      note("Validate grief as healthy. Gently steer away from 'everything happens for a reason.' Real feelings first; hope second."),
    ],
  },
  {
    title: "School rejected our IEP — what are our rights?",
    dek: "A discussion guide for parents fighting a school that says accommodations 'aren't necessary.'",
    audience: "Parents",
    coll: "parents",
    minutes: 4,
    format: "Script",
    body: [
      p("When a school says 'she's fine academically, so no accommodations,' families of masking kids know that 'fine at school, falling apart at home' is its own emergency. Here's how to talk it through."),
      quote("We requested an IEP under the RTE Act. The school said accommodations aren't necessary. We know she's masking and collapsing at home. What are our actual rights?"),
      h("Prompts"),
      ul(
        "Has anyone successfully challenged a school on this? What worked?",
        "Which organisation or advocate helped you?",
        "Are there template letters for a formal request?",
        "How do you evidence need when the child looks 'fine'?"
      ),
      note("Share concrete resources — the RPWD Act, Action for Autism, sample letters. Celebrate small wins loudly."),
    ],
  },
  {
    title: "Family says we're coddling our child",
    dek: "A discussion guide for parents exhausted by relatives who think a diagnosis is an excuse.",
    audience: "Parents",
    coll: "parents",
    minutes: 4,
    format: "Script",
    body: [
      p("'Back in our day, kids didn't have these diagnoses' is a sentence that drains a year off your life. This thread is for trading scripts and solidarity."),
      quote("Extended family keeps saying we're 'making excuses.' We're exhausted from defending our own parenting. How do you deal with this?"),
      h("Prompts"),
      ul(
        "What boundaries actually worked with judgmental relatives?",
        "Do you have a go-to line for the dismissive comments?",
        "Does it ease as the child gets older?",
        "How do you protect your own mental health while you wait for them to catch up?"
      ),
      note("Validate the frustration first. Then celebrate the families who held the line together."),
    ],
  },
];

const TEACHERS: ArticleSeed[] = [
  {
    title: "Five-minute regulation tools that scale to a class of 28",
    dek: "Quick resets that don't single anyone out and don't cost you prep time.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 6,
    format: "Article",
    body: [
      p("The best regulation tools are the ones the whole class uses, so no one gets flagged as 'the kid who needs the break.' Universal beats targeted, every time."),
      h("Five that scale"),
      ul(
        "A 60-second 'reset' between subjects — stretch, breathe, shake it out.",
        "Movement built into transitions, not withheld as a reward.",
        "A standing option at the back of the room, open to anyone.",
        "A quiet corner that's framed as a tool, never a punishment.",
        "A visible timer so 'how much longer' never becomes a crisis."
      ),
      note("When regulation is the room's default, the kids who need it most can use it without being seen needing it."),
    ],
  },
  {
    title: "Visual schedules that students actually use",
    dek: "Why most visual schedules fail by week three — and the small changes that keep them alive.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 5,
    format: "Article",
    body: [
      p("A visual schedule isn't wallpaper. The ones that work get touched, moved, and referred to — the ones that fail become decoration by October."),
      h("Why they die"),
      ul(
        "Too detailed — no one can scan 14 steps.",
        "Never updated — it stops matching reality, so it stops being trusted.",
        "Adult-only — the student never interacts with it."
      ),
      h("Keep them alive"),
      ul(
        "Fewer items, bigger icons.",
        "A 'done' action — move a card, flip a tile, tick a box.",
        "Hand the updating to the student where you can."
      ),
      note("If a schedule isn't being touched, it isn't being used. Touch is the whole point."),
    ],
  },
  {
    title: "Universal Design for Learning (UDL) cheat-sheet",
    dek: "One page to stick next to your lesson-plan template.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 4,
    format: "Checklist",
    body: [
      p("UDL boils down to one idea: plan for variability from the start, so you're not retrofitting accommodations for individual kids later."),
      h("The three questions to ask any lesson"),
      ol(
        "Multiple means of engagement — is there more than one way in to caring about this?",
        "Multiple means of representation — is the content available in more than one format?",
        "Multiple means of action & expression — can students show what they know in more than one way?"
      ),
      h("Fast wins"),
      ul("Offer choice in how work is submitted", "Provide slides/notes in advance", "Caption every video", "Chunk big tasks into visible steps"),
      note("UDL isn't extra work bolted on. Done up front, it's less work — fewer one-off accommodations to manage."),
    ],
  },
  {
    title: "Goal-writing templates that pass compliance review",
    dek: "Measurable, observable, jargon-light goal structures you can adapt.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 6,
    format: "Reading list",
    body: [
      p("A good goal survives compliance review because it's measurable and observable — and it serves the student because it's written in plain language a parent can picture."),
      h("The reliable formula"),
      p("By [date], given [condition/support], [student] will [observable behaviour] to [criterion], as measured by [method]."),
      h("Worked example"),
      quote("By June, given a visual checklist, Aanya will start independent work within two minutes of instructions, in 4 of 5 observed sessions, as measured by teacher tally."),
      h("Smell-test before you submit"),
      ul("Could two people watching agree it happened?", "Is the criterion a number, not a vibe?", "Would a parent understand it without a glossary?"),
      note("If you can't measure it, it isn't a goal yet — it's a hope. Tighten until it's countable."),
    ],
  },
  {
    title: "Accommodation menus by need profile",
    dek: "Sensory, executive function, communication, social, and regulation — accommodations grouped by need.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 5,
    format: "Checklist",
    body: [
      p("Match the accommodation to the need profile, not the diagnosis label. Two students with the same label can need opposite things."),
      h("Sensory"),
      ul("Headphones", "Lighting options", "Advance warning of loud events", "A low-stimulation seat"),
      h("Executive function"),
      ul("Chunked instructions", "Checklists", "Extended time", "Modelled examples"),
      h("Communication & social"),
      ul("Written instructions alongside verbal", "No forced eye contact", "Structured roles in group work", "A scripted way to ask for help"),
      h("Regulation"),
      ul("A check-in adult", "A discreet break pass", "A predictable routine with warnings before change"),
      note("Pick a few, review them, and adjust. A menu is for choosing from — not for serving all at once."),
    ],
  },
  {
    title: "Working with reluctant administrators",
    dek: "Scripted talking points for advocating up the chain when a plan stalls.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 6,
    format: "Script",
    body: [
      p("Sometimes the barrier isn't the family or the student — it's a 'we don't do that here.' These lines keep you collaborative while holding the line."),
      h("Lead with shared goals"),
      quote("We both want this student to succeed and the school to be in good standing. This accommodation protects both — here's how."),
      h("When you hear 'we don't have resources'"),
      quote("I hear the constraint. Several of these cost nothing but a change in routine. Can we start with those and revisit the rest next term?"),
      h("When it's a compliance worry"),
      quote("Documenting and providing this is actually our safer position legally, not our riskier one. I'm happy to put the plan in writing."),
      note("Stay on the student's side and the school's side at once. 'Us vs. the problem' beats 'me vs. you' every time."),
    ],
  },
  {
    title: "First-week-of-school welcome email",
    dek: "A warm, low-burden template families actually reply to.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 3,
    format: "Script",
    body: [
      p("The first email sets the tone for the year. Make it short, human, and easy to answer — and you'll build a line of communication you can use when it matters."),
      h("Template"),
      quote("Hi [family], I'm [name], [student]'s teacher this year, and I'm really glad they're in our class. Before things get busy: what's one thing that helps [student] have a good day, and one thing I should know? No need for a long reply — a sentence is perfect."),
      note("Asking for 'one thing' instead of a form gets you a reply and a relationship. You can go deeper once trust exists."),
    ],
  },
  {
    title: "How to deliver hard observations gently",
    dek: "Frameworks for telling families what you've noticed without setting off alarm.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 7,
    format: "Article",
    body: [
      p("Families remember how news was delivered for years. You can share a real concern without it landing as a verdict."),
      h("A structure that lands"),
      ol(
        "Open with genuine warmth and a strength you've actually seen.",
        "Describe the specific, observable thing — not an interpretation or label.",
        "Invite their view: 'Does this match what you see at home?'",
        "Move to 'what might help,' together, rather than 'what's wrong.'"
      ),
      p("Avoid diagnosing from the front of the room. Your job is to describe what you observe and open a door — not to name a condition."),
      note("'I've noticed…' invites partnership. 'I think your child has…' invites defensiveness. Choose the first."),
    ],
  },
  {
    title: "Identity-first vs. person-first: a respectful primer",
    dek: "How to ask, what to listen for, and what not to assume about language.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 5,
    format: "Article",
    body: [
      p("'Autistic person' (identity-first) or 'person with autism' (person-first)? There's no universal right answer — there's the answer the person in front of you prefers."),
      h("The short version"),
      ul(
        "Many autistic adults prefer identity-first ('autistic person').",
        "Many parents and some clinicians lean person-first.",
        "Preferences vary by person, community, and country."
      ),
      h("So what do you do?"),
      p("Ask, then mirror their language. 'What words do you prefer I use?' is a five-second question that signals respect louder than any policy."),
      note("When in doubt, default to how the person describes themselves — and update without fuss when corrected."),
    ],
  },
  {
    title: "IEP accommodations for ADHD",
    dek: "Preferential seating, movement breaks, and visual supports — a practical, classroom-ready menu.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 7,
    format: "Article",
    body: [
      p("ADHD accommodations work best when they discharge energy and reduce working-memory load, rather than demanding more self-control the student doesn't have on tap."),
      h("Reliable accommodations"),
      ul(
        "Preferential seating — near the teacher, away from high-traffic distraction.",
        "Scheduled movement breaks that let restless energy out in short bursts.",
        "Instructions chunked and posted visually, not just spoken once.",
        "Extended time and a quiet space for tests.",
        "A discreet refocus cue agreed with the student in advance."
      ),
      note("ADHD is a problem of regulation, not willpower. Accommodations that lower the regulation tax work; ones that demand more of it don't."),
    ],
  },
  {
    title: "IEP accommodations for autism",
    dek: "Four pillars — sensory, communication, behavioral, environmental — for genuinely individualized plans.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 7,
    format: "Article",
    body: [
      p("Strong autism plans are built from four pillars, then individualised. The pillars stop you from missing a whole domain of need."),
      h("The four pillars"),
      ul(
        "Sensory — manage light, sound, smell, texture, and unexpected stimuli.",
        "Communication — pair verbal with written; allow processing time; honour AAC.",
        "Behavioural — read behaviour as communication; plan for the function, not just the form.",
        "Environmental — predictable routines, warnings before change, defined safe spaces."
      ),
      p("Then individualise: two autistic students may need opposite sensory environments. The pillars are the checklist; the student is the plan."),
      note("Behaviour is communication. Ask 'what is this telling me the student needs?' before asking 'how do I stop it?'"),
    ],
  },
  {
    title: "Neurodivergent-affirming community guidelines",
    dek: "A moderation baseline for anyone running a group, club, or online space — what to remove, encourage, and mentor toward.",
    audience: "Teachers & therapists",
    coll: "teachers",
    minutes: 5,
    format: "Checklist",
    body: [
      p("Affirming spaces don't happen by accident. They're built on a clear, repeated baseline that everyone can see. Here's a starting point you can adapt."),
      h("Remove"),
      ul("Medical advice without 'talk to your clinician'", "Cure-seeking pitches", "Stereotypes ('all autistic people are…')", "Inspiration porn and unsolicited 'you should just…'"),
      h("Encourage"),
      ul("Lived experience and honest stories", "Questions — no question is dumb", "Respectful disagreement", "Resource sharing and peer mentorship"),
      h("Mentor toward"),
      ul("Self-compassion over shame", "'This is hard AND I'm not broken'", "Community over isolation", "Acceptance over cure"),
      note("Flag, don't ignore, signs of crisis — and route to real support. Safety is the one thing moderation can't be relaxed about."),
    ],
  },
];

const ADULTS: ArticleSeed[] = [
  {
    title: "Asking for accommodations without overexplaining",
    dek: "Templates by accommodation type, plus what to do when HR pushes back.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Script",
    body: [
      p("You're allowed to ask for what helps without narrating your whole neurology. Accommodations are about function — frame the need, name the fix, skip the diagnosis story if you want to."),
      h("The frame that works"),
      quote("To do my best work, I need [specific support]. Could we put that in place? Happy to discuss what works on your end."),
      h("By type"),
      ul(
        "Noise: 'I focus best with headphones / a quieter spot for deep work.'",
        "Communication: 'Could you send agendas/asks in writing? I process detail better that way.'",
        "Time: 'I do my best work with a day's notice on changes where possible.'"
      ),
      h("If HR pushes back"),
      p("Ask for the reason in writing, and frame the accommodation as a performance enabler. You can disclose a diagnosis later if needed — you don't have to lead with it."),
      note("'What I need to do great work' is a stronger opening than 'what's wrong with me.' Same request, better footing."),
    ],
  },
  {
    title: "Disclosure decision tree",
    dek: "A step-by-step for whether, when, and how much to disclose at work.",
    audience: "ND adults",
    coll: "adults",
    minutes: 5,
    format: "Article",
    body: [
      p("There's no universally right answer to disclosure — only the right answer for your role, your manager, and what you actually need. Walk it, don't agonise it."),
      h("Work through these in order"),
      ol(
        "Do I need an accommodation right now? If no, disclosure is optional.",
        "Can I get what I need by describing the need, without a label? If yes, try that first.",
        "Is my manager/HR likely to respond well? Gather evidence before deciding.",
        "What's my downside if it goes poorly — and can I cushion it?"
      ),
      p("You can also disclose in layers: a need first, more detail only if required. Partial disclosure is a legitimate choice."),
      note("Disclosure is reversible in only one direction. It's fine to move slowly and keep the next step in your pocket."),
    ],
  },
  {
    title: "Building executive-function scaffolding (without an app graveyard)",
    dek: "What actually helps long-term — in plain language, minus the productivity hype.",
    audience: "ND adults",
    coll: "adults",
    minutes: 8,
    format: "Article",
    body: [
      p("Most of us have a graveyard of abandoned productivity apps. The problem usually isn't the tool — it's that the system demanded more executive function than it gave back."),
      h("Principles that outlast apps"),
      ul(
        "Externalise everything — if it's only in your head, it doesn't exist.",
        "Reduce steps, don't add features. The best system is the one you'll actually use tired.",
        "Make the next action stupidly small and visible.",
        "Build around your real patterns, not the patterns you wish you had."
      ),
      h("A test for any new system"),
      p("Could you use it on your worst-functioning day? If it only works when you're already organised, it's decoration, not scaffolding."),
      note("Pick one tool. Use it badly for a month before adding anything. Boring and consistent beats clever and abandoned."),
    ],
  },
  {
    title: "Spoons, batteries, and budgets: pick a metaphor that works",
    dek: "Practical capacity management without performative wellness.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Article",
    body: [
      p("Whether you call it spoons, battery, or a budget, the insight is the same: your daily capacity is finite, uneven, and worth tracking. Naming it lets you spend it on purpose."),
      h("Make it usable"),
      ul(
        "Notice your real costs — masking, transitions, and noise are often pricier than the 'big' tasks.",
        "Pre-spend for known drains: schedule recovery after the costly thing, not instead of it.",
        "Watch for the overdraft signs — irritability, word-finding trouble, sensory rawness."
      ),
      p("This isn't about doing less for its own sake. It's about not spending Thursday's energy on Monday and crashing midweek."),
      note("Capacity management is maintenance, not indulgence. You budget money you respect; do the same with energy."),
    ],
  },
  {
    title: "Sensory regulation kits for adult life",
    dek: "Daily, work, and travel kits curated by and for neurodivergent adults.",
    audience: "ND adults",
    coll: "adults",
    minutes: 5,
    format: "Checklist",
    body: [
      p("A sensory kit is just the small set of things that reliably bring you back to baseline. Build three: one you always carry, one for work, one for travel."),
      h("Everyday carry"),
      ul("Earplugs or ANC headphones", "A discreet fidget", "Sunglasses", "A snack and water"),
      h("Work"),
      ul("A desk light you control", "Headphones as a 'do not disturb' signal", "A go-to break spot", "A grounding object"),
      h("Travel"),
      ul("Eye mask and earplugs", "A familiar comfort item", "Downloaded calm media", "A printed plan so you're not improvising under load"),
      note("Kits work because they remove decisions from your worst moments. Stock them when you're calm; reach for them when you're not."),
    ],
  },
  {
    title: "Recovering from autistic burnout",
    dek: "What burnout is, what helps, and what doesn't — gathered from people who've recovered.",
    audience: "ND adults",
    coll: "adults",
    minutes: 7,
    format: "Reading list",
    body: [
      p("Autistic burnout isn't ordinary tiredness. It's exhaustion plus skill loss plus reduced tolerance, driven by sustained masking and overload. Recovery is real — and slower than anyone wants."),
      h("What helps"),
      ul(
        "Radically reducing demands and masking, not just 'self-care' on top of a full load.",
        "Sensory rest — genuine low-stimulation time, daily.",
        "Reconnecting with special interests, with zero pressure to be productive.",
        "Lowering expectations of yourself, on purpose, without guilt."
      ),
      h("What doesn't"),
      ul("Pushing through", "More structure piled on an empty tank", "Treating it as ordinary stress to be powered past"),
      note("Recovery is measured in months, sometimes years. Going gently isn't giving up — it's the only thing that actually works."),
    ],
  },
  {
    title: "What to do the week after a late diagnosis",
    dek: "A gentle pacing plan that honours both the grief and the relief.",
    audience: "ND adults",
    coll: "adults",
    minutes: 7,
    format: "Article",
    body: [
      p("A late diagnosis can feel like two things at once: relief ('it has a name') and grief ('all those years without support'). Both are valid. The first week is for feeling, not fixing."),
      h("A soft first week"),
      ol(
        "Let the reframe land — reread your past through this new lens, kindly.",
        "Resist the urge to overhaul your life immediately.",
        "Find one other late-diagnosed person's story; the recognition helps.",
        "Note questions as they arise; you don't have to answer them yet."
      ),
      p("Identity reshuffles after a late diagnosis. Going slow isn't avoidance — it's letting a big thing settle before you build on it."),
      note("The grief over lost years is real and deserves room. So does the relief. You don't have to pick one."),
    ],
  },
  {
    title: "Coming out as ND to friends and family",
    dek: "Scripts, FAQs, and how to handle disbelief.",
    audience: "ND adults",
    coll: "adults",
    minutes: 5,
    format: "Script",
    body: [
      p("You decide who, when, and how much. Telling people is for your benefit, not theirs — so share on terms that serve you."),
      h("A simple opener"),
      quote("I've learned something about myself that explains a lot: I'm autistic / ADHD. I'm telling you because you matter to me, not because I need you to do anything."),
      h("When you hear 'but you don't seem…'"),
      quote("That's masking — it costs me a lot, and it's part of why I'm sharing this. You've been seeing the effort, not the ease."),
      h("Setting the boundary"),
      quote("You don't have to fully get it. I'm asking for openness, not a verdict."),
      note("Some people surprise you for the better; some won't get there. Lead with the ones who can hold it."),
    ],
  },
  {
    title: "Finding ND-affirming therapists",
    dek: "Questions to ask in a consultation, and the red flags worth walking away from.",
    audience: "ND adults",
    coll: "adults",
    minutes: 5,
    format: "Checklist",
    body: [
      p("A good fit is worth the search. An affirming therapist treats your neurology as a difference to work with, not a defect to fix."),
      h("Ask in a first call"),
      ul(
        "'What's your experience with autistic / ADHD adults?'",
        "'Do you see neurodivergence as something to support or to correct?'",
        "'Are you open to accommodations in how we work — pacing, format, lighting?'"
      ),
      h("Green flags"),
      ul("Curiosity about your experience", "Comfort with stimming and directness", "Willingness to adapt their style"),
      h("Red flags"),
      ul("Framing your traits as things to eliminate", "Pushing eye contact or 'normal' social performance", "Dismissing burnout or masking as excuses"),
      note("It's okay to interview a therapist. A good one expects it and respects it."),
    ],
  },
  {
    title: "Should I disclose my ADHD?",
    dek: "A balanced framework for the disclosure decision — including the real discrimination risk.",
    audience: "ND adults",
    coll: "adults",
    minutes: 7,
    format: "Article",
    body: [
      p("Disclosure can unlock support — or expose you to a manager who doesn't understand ADHD. The honest answer is 'it depends,' and the variables are knowable."),
      h("Reasons it can help"),
      ul("Access to formal accommodations", "Context for patterns a manager already sees", "Relief from hiding"),
      h("Reasons for caution"),
      ul("Some employers still doubt adult ADHD is real", "Bias can attach to things they used to overlook", "Once said, it can't be unsaid"),
      h("A middle path"),
      p("You can often request the accommodation by describing the need, and disclose the diagnosis only if and when it's required. Layered disclosure keeps options open."),
      note("Weigh your specific manager and culture, not ADHD in the abstract. The same diagnosis plays very differently across two desks."),
    ],
  },
  {
    title: "Should you tell your boss about your ADHD?",
    dek: "A cautious, experience-based take on workplace disclosure.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Article",
    body: [
      p("One seasoned view: the default answer is often 'no' — not from shame, but from realism about how uneven awareness still is."),
      h("The cautionary logic"),
      ul(
        "Not every boss is informed or kind about ADHD.",
        "Behaviour they tolerated ('runs a little late') can harden once it has a label.",
        "You can't predict how it travels through an organisation."
      ),
      h("When it tilts toward yes"),
      p("A demonstrably supportive manager, a real need for formal accommodations, or a workplace with a track record of handling disclosure well."),
      note("This isn't a rule, it's a caution. Know your boss before you decide — the relationship matters more than the policy."),
    ],
  },
  {
    title: "ADHD disclosure for a job? (community thread)",
    dek: "Real outcomes from people who disclosed — stigma is real, but it's shifting.",
    audience: "ND adults",
    coll: "adults",
    minutes: 5,
    format: "Article",
    body: [
      p("Beyond the frameworks, it helps to hear what actually happened to people. Community accounts paint a more hopeful — and more nuanced — picture than the fear suggests."),
      h("Patterns people report"),
      ul(
        "Stigma persists, but many describe it improving, especially recently.",
        "Disclosure often surfaces a colleague who quietly shares ADHD too.",
        "Outcomes track heavily to the individual manager, not the company logo.",
        "Several say they'd disclose again — and a few say they wouldn't."
      ),
      note("Your mileage will vary. Collect a few real stories before you decide; they're better data than a single rule."),
    ],
  },
  {
    title: "Successful job interview tips for ADHD",
    dek: "Managing symptoms under interview pressure — and deciding whether to be transparent.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Article",
    body: [
      p("Interviews stack everything ADHD finds hard: high stakes, sitting still, working memory under pressure. Preparation is your equaliser."),
      h("Before"),
      ul("Research the company until it's boring", "Pre-write stories for likely questions", "Build in extra travel time so lateness isn't a variable"),
      h("During"),
      ul(
        "It's fine to ask for a question to be repeated.",
        "Jot a keyword before answering, to anchor working memory.",
        "If you blank, narrate it briefly and move — interviewers forgive a reset."
      ),
      h("On transparency"),
      p("Some people find a light, in-the-moment mention ('I think best when I jot a note first') eases the pressure. Optional, never required."),
      note("You're being assessed on whether you can do the job, not on whether you can sit perfectly still for 45 minutes."),
    ],
  },
  {
    title: "ADHD job interview adjustments",
    dek: "Reasonable adjustments you can request before the interview even starts.",
    audience: "ND adults",
    coll: "adults",
    minutes: 5,
    format: "Article",
    body: [
      p("You can often shape the interview before you walk in. Many employers will accommodate requests if you ask plainly — and many are legally expected to."),
      h("Adjustments worth requesting"),
      ul(
        "The questions in advance, or the broad topics.",
        "A quieter room or a virtual option to cut sensory load.",
        "Extra time, or breaks in a longer process.",
        "Written materials alongside anything spoken."
      ),
      p("Frame it simply: 'To interview at my best, could we [adjustment]?' You don't have to over-explain to make a reasonable ask."),
      note("Asking for an adjustment isn't a red flag to a good employer — it's a preview of someone who knows how they work best."),
    ],
  },
  {
    title: "ADHD career advice: job interview tips",
    dek: "A step-by-step pre-interview routine: extra time, role-play, research, and reading the room.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Article",
    body: [
      p("A repeatable routine takes the executive-function load off interview day, so your actual ability gets to show up."),
      h("The routine"),
      ol(
        "Research the company and role until you could explain them to a friend.",
        "Role-play your weak-spot questions out loud with someone.",
        "Set two or three concrete goals for what you want to convey.",
        "Build in extra time — arrive early enough to settle your nervous system.",
        "Pre-plan for problems: what you'll do if you blank or run late."
      ),
      h("In the room"),
      p("Watch nonverbal cues, but don't obsess — pick two things to track, not ten. Channel any nervous energy into the topic you know best."),
      note("Preparation converts anxiety into something you can spend. The goal is to walk in with fewer live decisions to make."),
    ],
  },
  {
    title: "How to interview when you have ADHD",
    dek: "Reframing hyperfocus and energy as strengths an interviewer wants to see.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Article",
    body: [
      p("ADHD shows up in interviews as deficits to hide — but the same wiring carries genuine strengths worth naming on purpose."),
      h("Strengths to surface"),
      ul(
        "Hyperfocus — the ability to channel intense attention and ship quickly.",
        "Crisis calm — many with ADHD do their best work when it's urgent and real.",
        "Pattern-spotting and idea generation under the right conditions."
      ),
      h("How to say it"),
      quote("When I'm engaged, I can go deep and get a lot done fast — I've learned to set up my work so that mode kicks in on the things that matter."),
      note("You don't have to hide how your brain works. Framed honestly, the way it works is part of what you're selling."),
    ],
  },
  {
    title: "Autistic burnout at work: recognition & prevention",
    dek: "The more 'successful' the mask looks, the closer the breaking point — how to spot and prevent it.",
    audience: "ND adults",
    coll: "adults",
    minutes: 9,
    format: "Article",
    body: [
      p("There's a cruel irony in autistic burnout: the people who mask best, and look most 'fine,' are often closest to collapse. Prolonged masking is a primary driver."),
      h("Early warning signs"),
      ul(
        "Skills that used to be automatic start failing.",
        "Sensory tolerance drops — ordinary noise and light become unbearable.",
        "Special interests stop bringing relief.",
        "Recovery from a normal day takes longer and longer."
      ),
      h("Prevention that's real"),
      ul("Reduce masking where it's safe to", "Protect genuine low-demand recovery time", "Secure accommodations before you're in crisis", "Treat early signs as a stop sign, not a speed bump"),
      note("By the time burnout is obvious to others, it's usually advanced. Believe your own early signals."),
    ],
  },
  {
    title: "Understanding autistic burnout at work",
    dek: "Lack of accommodations plus over-masking equals emotional exhaustion — and how to break the equation.",
    audience: "ND adults",
    coll: "adults",
    minutes: 7,
    format: "Article",
    body: [
      p("Autistic burnout at work usually comes from a simple, brutal equation: too few accommodations, too much masking, not enough recovery. Each term is something you can change."),
      h("Lower each term"),
      ul(
        "Accommodations: ask for the environmental changes that cut the daily tax.",
        "Masking: find pockets — remote days, quiet hours — where you can drop it.",
        "Recovery: defend it on the calendar, not just in theory."
      ),
      p("Inclusive employers help by offering flexibility and predictability. But you can move the equation yourself, one term at a time, while you push for that."),
      note("Burnout isn't a personal failing or weak resilience. It's a load problem — and loads can be redistributed."),
    ],
  },
  {
    title: "Autistic burnout: signs, causes, recovery",
    dek: "How burnout differs from ordinary stress — and what recovery actually requires.",
    audience: "ND adults",
    coll: "adults",
    minutes: 7,
    format: "Article",
    body: [
      p("Ordinary stress eases with a weekend. Autistic burnout doesn't — because its roots are chronic sensory overload, social demand, and the emotional toll of masking, not just a busy week."),
      h("Telling them apart"),
      ul(
        "Stress lifts with rest; burnout persists despite it.",
        "Burnout brings skill regression — losing abilities you reliably had.",
        "Burnout flattens interests and raises sensory sensitivity."
      ),
      h("What recovery needs"),
      p("Real reduction in demands, sustained low-stimulation rest, and time — often a lot of it. Short fixes don't touch it because the cause isn't short-term."),
      note("If a 'normal' break didn't help, that's a clue it's burnout, not tiredness — and a sign to change the load, not the weekend."),
    ],
  },
  {
    title: "How does autism masking cause burnout?",
    dek: "The link between camouflaging, identity loss, and the slow drain that leads to collapse.",
    audience: "ND adults",
    coll: "adults",
    minutes: 8,
    format: "Article",
    body: [
      p("Masking — suppressing stims, forcing eye contact, scripting small talk, monitoring your face in real time — is constant, invisible labour. Done for years, it depletes you and blurs who you are."),
      h("The mechanism"),
      ul(
        "Every masked interaction spends executive and emotional energy.",
        "The cost is invisible to others, so no one offers relief.",
        "Over time the line blurs: 'I don't know what's me and what's the mask.'"
      ),
      p("That identity erosion is its own harm — it feeds depression, anxiety, and a numb, hollowed-out feeling that rest alone won't fix."),
      note("Unmasking, in safe places and small doses, isn't self-indulgence. It's how you stop the leak."),
    ],
  },
  {
    title: "What is autistic burnout? Signs & recovery",
    dek: "A comprehensive look at burnout — including the hard truth that it can last months or years.",
    audience: "ND adults",
    coll: "adults",
    minutes: 8,
    format: "Article",
    body: [
      p("Autistic burnout is a state of pervasive exhaustion, lost skills, and reduced tolerance. Notably, social exhaustion can build even inside supportive, loving relationships — it's about load, not whether people are kind."),
      h("The signs"),
      ul("Deep fatigue that rest barely touches", "Loss of previously solid skills", "Heightened sensory sensitivity", "Withdrawal and shutdown"),
      h("The recovery"),
      p("It often lasts months, sometimes years. The work is reducing demand and increasing genuine rest — repeatedly, patiently — not finding one clever fix."),
      note("Burnout in a good relationship or a good job doesn't mean something's wrong with the relationship or the job. The load can be real even when nothing is 'bad.'"),
    ],
  },
  {
    title: "Avoiding autistic burnout",
    dek: "Why heavy masking drains reserves faster — and the habits that protect them.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Article",
    body: [
      p("Prevention beats recovery, because recovery is so slow. The core insight: the more you mask, the faster you burn through reserves — so protecting reserves means managing masking."),
      h("Protective habits"),
      ul(
        "Build daily, non-negotiable low-stimulation recovery time.",
        "Create unmasked spaces — people and places where you don't perform.",
        "Track your load and pull back before the tank hits empty.",
        "Say no to optional demands during heavy stretches."
      ),
      note("Treat your reserves like a bank balance you can't overdraw without penalty. Spend deliberately; refill on schedule."),
    ],
  },
  {
    title: "When navigating a neurotypical world becomes too much",
    dek: "A lived account of hitting the wall — and what it teaches about limits.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Article",
    body: [
      p("Sometimes burnout arrives as a single moment that crystallises months of strain. One person described masking through a customer-service job until someone yelled — and suddenly they couldn't speak at all."),
      h("What stories like this teach"),
      ul(
        "Shutdown isn't drama or defiance — it's a nervous system out of capacity.",
        "The 'final straw' is rarely the real cause; it's the accumulated load.",
        "Pushing past the wall doesn't build resilience — it deepens the burnout."
      ),
      p("Naming the wall before you hit it — 'I'm near my limit' — is a skill worth practising, even when the world doesn't make space for it."),
      note("If you've hit a wall like this, you didn't fail. You ran a system past its limit, which is information, not a verdict."),
    ],
  },
  {
    title: "Autistic masking and burnout: what helps",
    dek: "The cost of continuous self-suppression — and the practical moves that lighten it.",
    audience: "ND adults",
    coll: "adults",
    minutes: 7,
    format: "Article",
    body: [
      p("Masking becomes harmful when it means continuous self-suppression without enough recovery. The fix isn't to never mask — sometimes it's protective — but to stop running a permanent deficit."),
      h("What helps"),
      ul(
        "Identify where you mask hardest, and find one place to drop it.",
        "Schedule recovery in proportion to how heavily a day was masked.",
        "Tell at least one safe person, so somewhere you don't have to perform.",
        "Notice and honour your stims instead of suppressing them by reflex."
      ),
      note("The goal isn't zero masking — it's a sustainable balance, where what you spend masking, you reliably get back in rest."),
    ],
  },
  {
    title: "TestingPro: building a neurodiverse workforce",
    dek: "How a Nagarro × Atypical Advantage × Action for Autism × NASSCOM programme turns autistic talent into a software-testing pipeline.",
    audience: "ND adults",
    coll: "adults",
    minutes: 5,
    format: "Article",
    body: [
      p("TestingPro is a working proof that the 'autistic unemployment problem' is really an access problem. It trains autistic adults as software testers and places them with real IT employers."),
      h("Why it works"),
      ul(
        "It builds a structured pathway from training to placement, not just a job board.",
        "Employer partners are prepared, so hires land in ready environments.",
        "It plays to genuine strengths — precision, pattern detection, focus."
      ),
      p("Born from a partnership between Nagarro, Atypical Advantage, Action for Autism, and NASSCOM, and recognised with international awards, it's a model worth pointing employers toward."),
      note("If you're job-seeking, programmes like this matter because the employer arrives already trained to work with you — half the usual battle, gone."),
    ],
  },
  {
    title: "Action for Autism: tech employment",
    dek: "Roles, contacts, and what to know about AFA's employment pathway into tech.",
    audience: "ND adults",
    coll: "adults",
    minutes: 4,
    format: "Reading list",
    body: [
      p("Action for Autism (AFA), one of South Asia's pioneering autism organisations, runs an employment pathway aimed squarely at the tech sector."),
      h("What's on offer"),
      ul(
        "Roles including programmers, software testers, developers, and data analysts.",
        "Vocational training and job placement with ongoing support.",
        "A bridge to employers who've worked with neurodivergent hires before."
      ),
      p("It's worth approaching as a relationship, not a one-off application — their support tends to continue past the offer letter."),
      note("AFA's employment division can be reached at wne.afa@gmail.com. Lead with your strengths and the support that helps you do your best work."),
    ],
  },
  {
    title: "Specialised support for adults on the spectrum",
    dek: "Adulthood on the spectrum can be meaningful and respected — here's what dedicated adult services cover.",
    audience: "ND adults",
    coll: "adults",
    minutes: 6,
    format: "Article",
    body: [
      p("Most autism services stop at childhood, which leaves adults stranded. Dedicated adult programmes — like those at the India Autism Center — exist to fill exactly that gap."),
      h("What good adult support covers"),
      ul(
        "Life-skills training for independence.",
        "Vocational support matched to real strengths.",
        "Emotional wellbeing, not just behaviour management.",
        "Community and belonging, so adulthood isn't isolating."
      ),
      p("The premise matters: adulthood on the spectrum can be productive, meaningful, and respected — when support is built for adults, by people who take that seriously."),
      note("If you've aged out of children's services, you haven't aged out of support. Adult-specific programmes are growing — seek them out."),
    ],
  },
  {
    title: "Just diagnosed in college — everything makes sense",
    dek: "A discussion guide for the relief-and-grief of a late diagnosis at university.",
    audience: "ND adults",
    coll: "adults",
    minutes: 4,
    format: "Script",
    body: [
      p("This thread is for the moment a late diagnosis reframes your whole history. Bring your story; make room for others' mixed feelings."),
      quote("Diagnosed with ADHD at 19. Suddenly my 'laziness' and time-management failures make sense — but I'm also grieving years of struggling without support. Anyone else?"),
      h("Prompts"),
      ul(
        "Did a late diagnosis change how you saw your school years?",
        "Did accommodation requests get easier afterwards?",
        "How did it affect your self-compassion?",
        "For those diagnosed after college: does the regret fade?"
      ),
      note("Normalise the grief and celebrate the 'finally understanding myself.' Both belong in the same thread."),
    ],
  },
  {
    title: "Job interview anxiety — should I disclose?",
    dek: "A discussion guide for the disclosure dilemma, with frameworks instead of directives.",
    audience: "ND adults",
    coll: "adults",
    minutes: 4,
    format: "Script",
    body: [
      p("First real interviews bring the disclosure question to a head. This thread trades real outcomes, not one-size advice."),
      quote("ADHD means I fidget, blank on questions, and struggle to sit still for 45 minutes. Do I disclose in the interview? In the application? Not at all?"),
      h("Prompts"),
      ul(
        "Disclosure outcomes — success stories and cautionary ones?",
        "Does industry change the calculus (tech vs. finance vs. public sector)?",
        "If you didn't disclose, did you regret it?",
        "Strategies for managing symptoms without disclosing?"
      ),
      note("Both choices are valid. Offer frameworks and lived experience — never a single 'right' answer."),
    ],
  },
  {
    title: "Masking so hard I'm losing myself",
    dek: "A discussion guide for the early warning signs of burnout.",
    audience: "ND adults",
    coll: "adults",
    minutes: 4,
    format: "Script",
    body: [
      p("This thread is for the slow erosion of masking too hard for too long — and catching it before it becomes full burnout."),
      quote("I mask constantly — forcing eye contact, suppressing stims, performing in groups while exhausted. At home I collapse. Is this burnout? Will it get better?"),
      h("Prompts"),
      ul(
        "How did you know masking had become unsustainable?",
        "What were your first signs of burnout?",
        "Recovery strategies that worked while still studying or working?",
        "How did you find people who accept the unmasked you?"
      ),
      note("Take early burnout signals seriously and point people toward real support. Recognition is the first relief."),
    ],
  },
  {
    title: "Burnout recognition — am I experiencing it?",
    dek: "A discussion guide for telling autistic burnout apart from depression and ADHD dysfunction.",
    audience: "ND adults",
    coll: "adults",
    minutes: 4,
    format: "Script",
    body: [
      p("'Is this burnout, depression, or executive dysfunction?' is one of the most-asked and least-answered questions. This thread compares notes."),
      quote("Five years of masking at work. Now I can't remember basic tasks, I've lost skills, even quiet feels unbearable, and I'm empty. Is this burnout specifically?"),
      h("Prompts"),
      ul(
        "What did early burnout feel like for you?",
        "How do you tell burnout from depression or ADHD dysfunction?",
        "Did you need to step back from work to recover — and for how long?",
        "What actually helped, beyond generic 'self-care'?"
      ),
      note("Validate that burnout is real and serious, and that recovery timelines run in months and years, not weeks."),
    ],
  },
  {
    title: "Remote work changed everything",
    dek: "A discussion guide on remote work as accommodation — and protecting it.",
    audience: "ND adults",
    coll: "adults",
    minutes: 4,
    format: "Script",
    body: [
      p("For many neurodivergent adults, remote work isn't a perk — it's the accommodation that made working sustainable. This thread is for sharing what helped and how to keep it."),
      quote("Remote work removed the commute, the open-office overload, and the constant masking. My burnout dropped massively. Now we're forced back three days a week and I'm panicking."),
      h("Prompts"),
      ul(
        "What specifically does remote work fix for you?",
        "How did you ask to keep it — and what worked?",
        "Which hybrid compromises actually held?",
        "If forced back, how do you protect your nervous system?"
      ),
      note("Frame remote work as a legitimate accommodation, not a weakness or a favour. The data is on your side."),
    ],
  },
];

const HEALTHCARE: ArticleSeed[] = [
  {
    title: "What ACMG variant classifications mean (and don't mean)",
    dek: "Pathogenic, VUS, benign — what each label says about probability versus evidence.",
    audience: "Healthcare",
    coll: "healthcare",
    minutes: 9,
    format: "Article",
    body: [
      p("A genetic report's classification isn't a yes/no verdict — it's a statement about how much evidence currently links a variant to a condition. Reading it that way prevents a lot of unnecessary fear."),
      h("The five-tier scale, in plain words"),
      ul(
        "Pathogenic — strong evidence it's disease-causing.",
        "Likely pathogenic — good but not conclusive evidence.",
        "VUS (variant of uncertain significance) — not enough evidence either way. Common, and not a diagnosis.",
        "Likely benign — probably harmless.",
        "Benign — confidently harmless."
      ),
      h("The part people miss"),
      p("A VUS is the most misread label. It does not mean 'probably bad' — it means 'unknown.' Classifications also change over time as evidence grows, so today's VUS may be reclassified later."),
      note("Educational, not medical advice: always interpret a report with a qualified genetic counsellor or clinician. GeneTranslate can help you prep the questions."),
    ],
  },
  {
    title: "Finding ND-affirming providers",
    dek: "Questions to ask, scripts for switching, and what red flags look like in a clinician.",
    audience: "Healthcare",
    coll: "healthcare",
    minutes: 5,
    format: "Checklist",
    body: [
      p("An affirming clinician can make care feel safe; a dismissive one can do lasting damage. You're allowed to vet, and to leave."),
      h("Questions worth asking"),
      ul(
        "'What's your experience with neurodivergent patients?'",
        "'Are you comfortable adapting how we communicate?'",
        "'Do you see my neurology as something to support or to fix?'"
      ),
      h("A script for switching"),
      quote("I don't think this is the right fit for my care. Could you transfer my records to [provider]? Thank you for your time."),
      h("Red flags"),
      ul("Dismissing your reported experience", "Insisting on 'normal' behaviour as a goal", "Refusing simple communication accommodations"),
      note("Leaving a provider who doesn't fit isn't being difficult — it's good self-advocacy. You don't owe anyone your continued discomfort."),
    ],
  },
  {
    title: "Bringing a parent or partner to appointments",
    dek: "How to use a second person in the room without losing your own voice.",
    audience: "Healthcare",
    coll: "healthcare",
    minutes: 5,
    format: "Article",
    body: [
      p("A support person can hold details, prompt questions, and steady your nerves. The trick is making sure they amplify your voice rather than replace it."),
      h("Set it up beforehand"),
      ul(
        "Agree their role: note-taker, memory backup, or advocate — and what they won't do.",
        "Share your priority questions so they can nudge if one gets missed.",
        "Decide a signal for 'let me answer this one.'"
      ),
      p("Tell the clinician directly: 'They're here to support me; please still address me.' It keeps the conversation pointed at you, where it belongs."),
      note("A good support person catches what you drop and hands the mic back. The appointment is still yours."),
    ],
  },
  {
    title: "Decoding clinical letters",
    dek: "The structure, the abbreviations, and where the action items hide.",
    audience: "Healthcare",
    coll: "healthcare",
    minutes: 8,
    format: "Article",
    body: [
      p("Clinical letters follow a predictable skeleton. Once you know it, you can skim straight to what actually affects you."),
      h("The usual structure"),
      ol(
        "History / presenting concern — why you were seen.",
        "Examination / findings — what they observed or measured.",
        "Impression / assessment — the clinician's conclusion.",
        "Plan / recommendations — the action items. This is the part to act on."
      ),
      h("Decoding the shorthand"),
      p("Common abbreviations: Hx (history), Dx (diagnosis), Ix (investigations), Rx (treatment), F/U (follow-up), PRN (as needed). If a letter uses one you can't decode, that's a fair question for the clinic."),
      note("The 'Plan' section is where your next steps live. Read it first if you read nothing else, and confirm anything unclear."),
    ],
  },
  {
    title: "Autism spectrum disorder: an Indian perspective",
    dek: "How the RPWD Act recognises autism, and what that legal framework means for support and services.",
    audience: "Healthcare",
    coll: "healthcare",
    minutes: 8,
    format: "Article",
    body: [
      p("India's legal recognition of autism is more meaningful than it first appears. By naming ASD a disability, the RPWD Act (2016) creates a framework for rights, services, and a slow chipping-away at stigma."),
      h("What recognition unlocks"),
      ul(
        "A legal basis for reasonable accommodations in school and work.",
        "Eligibility for disability provisions and protections.",
        "A foothold for advocacy when institutions resist."
      ),
      h("The gap that remains"),
      p("Recognition on paper outruns delivery on the ground — services are urban-centric, costly, and uneven. The law is a lever, but families and clinicians still have to pull it."),
      note("Knowing the RPWD Act exists changes the conversation with a reluctant school or employer from a plea into a rights-based request."),
    ],
  },
  {
    title: "Action for Autism (AFA)",
    dek: "South Asia's pioneering autism organisation — what it offers families and adults.",
    audience: "Healthcare",
    coll: "healthcare",
    minutes: 4,
    format: "Reading list",
    body: [
      p("Action for Autism, founded in 1991 and based in Delhi, helped start the autism movement in South Asia. It's a first stop many Indian families never knew existed."),
      h("What they offer"),
      ul(
        "Early intervention, diagnosis, and assessment.",
        "Parent training programmes and support groups.",
        "Vocational training and an employment pathway.",
        "Teacher training, research, and advocacy."
      ),
      p("Its reach is national, and it has collaborated with international research institutions — useful credibility when you're navigating a system that doubts you."),
      note("Verify current services and intake directly with AFA (actionforautism.org) — offerings and waitlists change."),
    ],
  },
  {
    title: "India Autism Center (IAC)",
    dek: "An emerging lifespan model in Kolkata — residential, vocational, and research-backed.",
    audience: "Healthcare",
    coll: "healthcare",
    minutes: 4,
    format: "Reading list",
    body: [
      p("The India Autism Center, based in Kolkata, is building something rare in India: support designed for the whole lifespan, including the adult years that most services ignore."),
      h("What they're developing"),
      ul(
        "A residential campus model for adults.",
        "Vocational and life-skills training.",
        "Family guidance and emotional-wellbeing programmes.",
        "Research that feeds back into practice."
      ),
      p("As an emerging model, it's especially relevant for families thinking past childhood — about independence, work, and where an autistic adult can genuinely belong."),
      note("Confirm current programmes and availability with IAC (indiaautismcenter.org) before planning around them."),
    ],
  },
  {
    title: "Atypical Advantage",
    dek: "India's largest inclusive employment platform — a route from diagnosis to livelihood.",
    audience: "Healthcare",
    coll: "healthcare",
    minutes: 4,
    format: "Reading list",
    body: [
      p("Atypical Advantage is India's largest inclusive employment platform for people with disabilities — relevant to healthcare because livelihood and wellbeing are deeply linked."),
      h("What it does"),
      ul(
        "A job portal connecting disabled candidates with employers.",
        "Employability and digital-skills training.",
        "Corporate partnerships and disability-inclusion workshops.",
        "A platform for artists with disabilities, too."
      ),
      p("With thousands of candidates and a large roster of corporate partners, it's proof that inclusive hiring works at scale — useful to point patients and families toward."),
      note("Explore current openings and programmes at atypicaladvantage.in. Employment is part of health; treat it that way."),
    ],
  },
];

const RAW: ArticleSeed[] = [...PARENTS, ...TEACHERS, ...ADULTS, ...HEALTHCARE];

export const ARTICLES: Record<string, Article> = Object.fromEntries(
  RAW.map((a) => {
    const slug = slugify(a.title);
    return [slug, { ...a, slug }];
  })
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLES[slug];
}

// Stable href for a resource card title. Used by ResourceCard so the collection
// pages don't need to hardcode article URLs.
export function articleHref(title: string): string {
  return `/resources/${slugify(title)}`;
}
