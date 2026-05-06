import CollectionPage, { type Section } from "../_collection";

export const metadata = {
  title: "Resources for parents & caregivers | SupportNest",
  description:
    "Plain-language guides, scripts, and checklists for parents and caregivers of neurodivergent kids.",
};

const SECTIONS: Section[] = [
  {
    heading: "First-week-after-diagnosis essentials",
    blurb:
      "If you just got an evaluation report, breathe. Start here. Nothing on this list is urgent.",
    items: [
      {
        title: "What to do in the first 14 days (and what can wait)",
        desc: "A gentle pacing plan: rest, share with one person, line up the next conversation.",
        href: "#",
        format: "Article",
        minutes: 6,
      },
      {
        title: "Decoding an evaluation report, paragraph by paragraph",
        desc: "Walk through standardized scores, narrative sections, and the recommendations table.",
        href: "#",
        format: "Article",
        minutes: 10,
      },
      {
        title: "How to tell your child (age-by-age scripts)",
        desc: "Conversation openers for ages 4–6, 7–10, 11–14, and 15+.",
        href: "#",
        format: "Script",
        minutes: 5,
      },
      {
        title: "Gentle scripts for telling extended family",
        desc: "Boundaries, FAQs, and what to do when grandma 'doesn't believe in it.'",
        href: "#",
        format: "Script",
        minutes: 4,
      },
    ],
  },
  {
    heading: "School & meetings",
    blurb:
      "The IEP / 504 process, in human language. Templates you can edit, not boilerplate to sign.",
    items: [
      {
        title: "IEP meeting prep: a 20-minute walkthrough",
        desc: "Pre-meeting checklist, talking-point worksheet, and what to do if it goes sideways.",
        href: "#",
        format: "Checklist",
        minutes: 8,
      },
      {
        title: "Plain-English accommodation menu",
        desc: "200+ accommodations grouped by what they help with. Print and circle.",
        href: "#",
        format: "Reading list",
      },
      {
        title: "Email templates for school transitions",
        desc: "Mid-year teacher change, principal escalation, accommodation revisions.",
        href: "#",
        format: "Script",
        minutes: 3,
      },
      {
        title: "Getting your child's voice into the meeting",
        desc: "Three age-appropriate ways for kids to weigh in on their own plan.",
        href: "#",
        format: "Article",
        minutes: 6,
      },
    ],
  },
  {
    heading: "Daily life & regulation",
    items: [
      {
        title: "The low-demand morning routine",
        desc: "Why insisting on toothbrushing might cost you the whole morning.",
        href: "#",
        format: "Article",
        minutes: 7,
      },
      {
        title: "Sensory-friendly grocery & errand kit",
        desc: "Pre-made shopping list of headphones, fidgets, snacks, and visual schedules.",
        href: "#",
        format: "Checklist",
        minutes: 4,
      },
      {
        title: "Sibling support without comparison",
        desc: "How to talk about differences without making siblings feel less seen.",
        href: "#",
        format: "Article",
        minutes: 5,
      },
    ],
  },
];

export default function ParentsResources() {
  return (
    <CollectionPage
      eyebrow="For parents & caregivers"
      title="A shelf for the long, beautiful project of raising your kid."
      subtitle="Curated and reviewed by parents who've been there. Take what helps. We won't judge what you skip."
      sections={SECTIONS}
    />
  );
}
