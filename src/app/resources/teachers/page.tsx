import CollectionPage, { type Section } from "../_collection";

export const metadata = {
  title: "Resources for teachers & therapists | SupportNest",
  description:
    "Classroom-tested strategies, IEP/504 templates, and communication frameworks for educators and therapists.",
};

const SECTIONS: Section[] = [
  {
    heading: "Classroom strategies",
    blurb:
      "Practical, field-tested moves you can try tomorrow, not pedagogy lectures.",
    items: [
      {
        title: "Five-minute regulation tools that scale to a class of 28",
        desc: "Quick resets that don't single anyone out and don't cost prep time.",
        href: "#",
        format: "Article",
        minutes: 6,
      },
      {
        title: "Visual schedules that students actually use",
        desc: "Why most visual schedules fail by week 3 — and what to change.",
        href: "#",
        format: "Article",
        minutes: 5,
      },
      {
        title: "Universal Design for Learning (UDL) cheat-sheet",
        desc: "One page. Print it. Stick it next to your lesson-plan template.",
        href: "#",
        format: "Checklist",
      },
    ],
  },
  {
    heading: "IEP/504 templates",
    items: [
      {
        title: "Goal-writing templates that pass compliance review",
        desc: "Measurable, observable, jargon-light. Ready to copy.",
        href: "#",
        format: "Reading list",
      },
      {
        title: "Accommodation menus by need profile",
        desc: "Sensory, executive function, communication, social, regulation.",
        href: "#",
        format: "Checklist",
      },
      {
        title: "Working with reluctant administrators",
        desc: "Scripted talking points for advocating up the chain when needed.",
        href: "#",
        format: "Script",
        minutes: 6,
      },
    ],
  },
  {
    heading: "Communication & families",
    items: [
      {
        title: "First-week-of-school welcome email",
        desc: "A warm, low-burden template families actually reply to.",
        href: "#",
        format: "Script",
        minutes: 3,
      },
      {
        title: "How to deliver hard observations gently",
        desc: "Frameworks for telling families what you've noticed without alarm.",
        href: "#",
        format: "Article",
        minutes: 7,
      },
      {
        title: "Identity-first vs. person-first: a respectful primer",
        desc: "How to ask, what to listen for, and what not to assume.",
        href: "#",
        format: "Article",
        minutes: 5,
      },
    ],
  },
];

export default function TeachersResources() {
  return (
    <CollectionPage
      eyebrow="For teachers & therapists"
      title="The shelf you wish came with the credential."
      subtitle="Built with five teachers, three SLPs, and an OT in our community. We add what works in real classrooms — not what wins conferences."
      sections={SECTIONS}
    />
  );
}
