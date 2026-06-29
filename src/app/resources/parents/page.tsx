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
  {
    heading: "Grief, acceptance & the first weeks",
    blurb:
      "Curated explainers on the grief that can follow a diagnosis. Every link goes to the original author.",
    items: [
      {
        title: "Accepting the autism diagnosis: 5 steps of grieving",
        desc: "Circle Care Services walks the five stages, ending at acceptance and action.",
        href: "https://circlecareservices.com/accepting-an-autism-diagnosis-and-the-five-steps-of-grieving/",
        format: "Article",
        minutes: 7,
      },
      {
        title: "Stages of acceptance of your child's diagnosis",
        desc: "ACES on why letting yourself feel the sadness is what moves you toward action.",
        href: "https://blog.acesaba.com/aba/stages-of-acceptance/",
        format: "Article",
        minutes: 6,
      },
      {
        title: "Understanding the autism grief cycle in parents",
        desc: "Epic Minds Therapy on how professional, family, and community support eases the process.",
        href: "https://epicmindstherapy.com/blog/autism-grief-cycle/",
        format: "Article",
        minutes: 6,
      },
      {
        title: "The autism grief cycle: a guide for parents and caregivers",
        desc: "Divine Steps Therapy on normalizing emotions and finding the right support.",
        href: "https://www.divinestepstherapy.com/blog/what-is-the-autism-grief-cycle",
        format: "Article",
        minutes: 8,
      },
      {
        title: "The autism journey: accepting vs. resisting a diagnosis",
        desc: "LEARN Behavioral reframes resistance as a healthy seed of advocacy.",
        href: "https://learnbehavioral.com/blog/the-autism-journey-accepting-vs-resisting-the-diagnosis",
        format: "Article",
        minutes: 6,
      },
      {
        title: "Understanding the autism grief cycle in families",
        desc: "Little Rays ABA: everyone's journey differs in order and intensity.",
        href: "https://www.littleraysaba.com/blog/autism-grief-cycle",
        format: "Article",
        minutes: 5,
      },
      {
        title: "Myths and the grief cycle, explained",
        desc: "Inclusive ABA busts myths — intelligence is separate from being autistic.",
        href: "https://www.inclusiveaba.com/blog/autism-grief-cycle",
        format: "Article",
        minutes: 5,
      },
    ],
  },
  {
    heading: "Research worth reading",
    blurb:
      "Peer-reviewed and academic sources, in case you want the evidence behind the guidance.",
    items: [
      {
        title: "Grief among parents of autistic children: a systematic review",
        desc: "Int'l Journal of Developmental Disabilities on coping and quality of life.",
        href: "https://www.tandfonline.com/doi/abs/10.1080/20473869.2024.2387401",
        format: "Reading list",
      },
      {
        title: "Living-loss: a narrative synthesis of the grief process",
        desc: "PubMed / Journal of Pediatric Nursing on shock, denial, guilt, and sorrow.",
        href: "https://pubmed.ncbi.nlm.nih.gov/38570227/",
        format: "Reading list",
      },
      {
        title: "Parents' experiences after a child's autism diagnosis",
        desc: "MDPI reflexive thematic analysis: the two-year grieving arc.",
        href: "https://www.mdpi.com/2673-5318/5/3/26",
        format: "Reading list",
      },
      {
        title: "Affiliate stigma among parents in eastern India",
        desc: "PubMed: internalized stigma and psychological distress, quantified.",
        href: "https://pubmed.ncbi.nlm.nih.gov/31315059/",
        format: "Reading list",
      },
    ],
  },
  {
    heading: "India: stigma, rights & access",
    blurb:
      "India-specific context — the RTE and RPWD Acts, the cost of access, and the stigma that delays help.",
    items: [
      {
        title: "Breaking the stigma: ADHD & autism awareness in India",
        desc: "Neuro Revolution International on the 'problem child' and 'slow learner' labels.",
        href: "https://neurorevolutioninternational.com/breaking-the-stigma-raising-awareness-about-adhd-and-autism-in-india/",
        format: "Article",
        minutes: 6,
      },
      {
        title: "ADHD and autism in India: what research reveals",
        desc: "NeuroNestHub on expensive, urban-centric diagnosis and long waits for assessment.",
        href: "https://neuronesthub.com/adhd-autism-in-india-what-the-research-really-shows/",
        format: "Article",
        minutes: 7,
      },
      {
        title: "Inclusive education in India: rights, IEPs & ADHD",
        desc: "Brio Kids on the RTE and RPWD Acts and your child's right to accommodations.",
        href: "https://brio-kids.com/inclusive-education-for-neurodivergent-children-rights-ieps-and-accommodations/",
        format: "Article",
        minutes: 8,
      },
    ],
  },
  {
    heading: "Conversation starters",
    blurb:
      "Threads to bring to the community when you're ready. No question is too small.",
    items: [
      {
        title: "Just got the diagnosis — the grief wave",
        desc: "Naming the grief that can arrive instead of relief, and what helped others move forward.",
        href: "/community",
        format: "Script",
        minutes: 4,
      },
      {
        title: "School rejected our IEP — what are our rights?",
        desc: "What worked under the RTE Act, template letters, and celebrating small wins.",
        href: "/community",
        format: "Script",
        minutes: 4,
      },
      {
        title: "Family says we're coddling our child",
        desc: "Boundary-setting scripts for dismissive relatives, and whether they come around.",
        href: "/community",
        format: "Script",
        minutes: 4,
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
