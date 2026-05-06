import CollectionPage, { type Section } from "../_collection";

export const metadata = {
  title: "Resources for neurodivergent adults | SupportNest",
  description:
    "Workplace accommodations, energy and burnout, late diagnosis, identity, and self-advocacy resources for neurodivergent adults.",
};

const SECTIONS: Section[] = [
  {
    heading: "Work & accommodations",
    items: [
      {
        title: "Asking for accommodations without overexplaining",
        desc: "Templates by accommodation type, plus what to do when HR pushes back.",
        href: "#",
        format: "Script",
        minutes: 6,
      },
      {
        title: "Disclosure decision tree",
        desc: "A step-by-step for whether, when, and how much to disclose at work.",
        href: "#",
        format: "Article",
        minutes: 5,
      },
      {
        title: "Building executive-function scaffolding (without an app graveyard)",
        desc: "What actually helps long-term, in plain language.",
        href: "#",
        format: "Article",
        minutes: 8,
      },
    ],
  },
  {
    heading: "Energy, burnout & nervous system",
    items: [
      {
        title: "Spoons, batteries, and budgets: pick a metaphor that works",
        desc: "Practical capacity management without performative wellness.",
        href: "#",
        format: "Article",
        minutes: 6,
      },
      {
        title: "Sensory regulation kits for adult life",
        desc: "Daily, work, and travel kits curated by ND adults.",
        href: "#",
        format: "Checklist",
      },
      {
        title: "Recovering from autistic burnout",
        desc: "What it is, what helps, and what doesn't.",
        href: "#",
        format: "Reading list",
      },
    ],
  },
  {
    heading: "Identity & late diagnosis",
    items: [
      {
        title: "What to do the week after a late diagnosis",
        desc: "A gentle pacing plan that honors the grief and the relief.",
        href: "#",
        format: "Article",
        minutes: 7,
      },
      {
        title: "Coming out as ND to friends and family",
        desc: "Scripts, FAQs, and how to handle disbelief.",
        href: "#",
        format: "Script",
        minutes: 5,
      },
      {
        title: "Finding ND-affirming therapists",
        desc: "Questions to ask in a consultation; red flags to watch for.",
        href: "#",
        format: "Checklist",
      },
    ],
  },
];

export default function AdultsResources() {
  return (
    <CollectionPage
      eyebrow="For neurodivergent adults"
      title="A nest tuned to your bandwidth, your nervous system, your life."
      subtitle="Co-curated by ND adults in the community. Identity-first by default; person-first available where preferred."
      sections={SECTIONS}
    />
  );
}
