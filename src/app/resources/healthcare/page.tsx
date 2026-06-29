import CollectionPage, { type Section } from "../_collection";

export const metadata = {
  title: "Healthcare & genetics resources | SupportNest",
  description:
    "Finding clinicians, decoding evaluations, genetic-testing guides, and the GeneTranslate tool for plain-language report summaries.",
};

const SECTIONS: Section[] = [
  {
    heading: "Genetic testing & counseling",
    items: [
      {
        title: "GeneTranslate: turn a genetic-test PDF into plain language",
        desc: "Our local-first tool that summarizes variants and helps you prep for counseling.",
        href: "/tools/genetranslate",
        format: "Tool",
      },
      {
        title: "Find a genetic counselor",
        desc: "NSGC, ABGC, and CAGC directories — plus how to vet for ND-affirming care.",
        href: "/tools/genetranslate/resources",
        format: "Reading list",
      },
      {
        title: "What ACMG variant classifications mean (and don't mean)",
        desc: "Pathogenic, VUS, benign — what each label says about probability vs. evidence.",
        href: "#",
        format: "Article",
        minutes: 9,
      },
    ],
  },
  {
    heading: "Working with clinicians",
    items: [
      {
        title: "Finding ND-affirming providers",
        desc: "Questions to ask, scripts for switching, what red flags look like.",
        href: "#",
        format: "Checklist",
      },
      {
        title: "Bringing a parent or partner to appointments",
        desc: "How to use a second person without losing your own voice in the room.",
        href: "#",
        format: "Article",
        minutes: 5,
      },
      {
        title: "Decoding clinical letters",
        desc: "A primer on the structure, abbreviations, and where the action items hide.",
        href: "#",
        format: "Article",
        minutes: 8,
      },
    ],
  },
  {
    heading: "Diagnosis & India's legal framework",
    items: [
      {
        title: "Autism spectrum disorder: an Indian perspective",
        desc: "ScienceDirect on how the RPWD Act recognizes ASD and frames the right to support and services.",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0377123725002291",
        format: "Article",
        minutes: 8,
      },
    ],
  },
  {
    heading: "India organizations & directories",
    blurb:
      "Established organizations for assessment, family support, and adult services. Verify current offerings before you rely on them.",
    items: [
      {
        title: "Action for Autism (AFA)",
        desc: "Delhi-based pioneer: early intervention, diagnosis, parent training, and vocational programs.",
        href: "https://actionforautism.org",
        format: "Reading list",
      },
      {
        title: "India Autism Center (IAC)",
        desc: "Kolkata: residential campus, adult vocational training, family guidance, and research.",
        href: "https://indiaautismcenter.org",
        format: "Reading list",
      },
      {
        title: "Atypical Advantage",
        desc: "India's largest inclusive employment platform for people with disabilities — job portal and corporate hiring.",
        href: "https://atypicaladvantage.in",
        format: "Reading list",
      },
    ],
  },
];

export default function HealthcareResources() {
  return (
    <CollectionPage
      eyebrow="Healthcare & genetics"
      title="The medical-system glossary you should not have to write yourself."
      subtitle="Educational, not medical advice. Always loop in a qualified clinician for decisions; we're here to help you walk in prepared."
      sections={SECTIONS}
    />
  );
}
