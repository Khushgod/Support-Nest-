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
  {
    heading: "Disclosure at work",
    blurb:
      "Whether, when, and how much to tell an employer. Both choices are valid.",
    items: [
      {
        title: "Should I disclose my ADHD?",
        desc: "ADDA's balanced framework, including the discrimination risk when employers lack awareness.",
        href: "https://add.org/disclosing-adhd-at-work/",
        format: "Article",
        minutes: 7,
      },
      {
        title: "Should you tell your boss about your ADHD?",
        desc: "ADDitude's cautious take: the answer is often 'no', and here's why.",
        href: "https://www.additudemag.com/should-you-tell-your-boss-about-your-adhd/",
        format: "Article",
        minutes: 6,
      },
      {
        title: "ADHD disclosure for a job? (community thread)",
        desc: "CHADD forum: real outcomes — stigma is real but improving, especially for women.",
        href: "https://healthunlocked.com/adult-adhd/posts/150629815/adhd-disclosure-for-a-job",
        format: "Article",
        minutes: 5,
      },
    ],
  },
  {
    heading: "Job interviews & getting hired",
    items: [
      {
        title: "Successful job interview tips for ADHD",
        desc: "LDRFA on transparency and managing symptoms under interview pressure.",
        href: "https://www.ldrfa.org/job-interview-tips-adhd/",
        format: "Article",
        minutes: 6,
      },
      {
        title: "ADHD job interview adjustments",
        desc: "Inspired Ergonomics on the reasonable adjustments you can request in advance.",
        href: "https://www.inspiredergonomics.com/blog/adhd-job-interview-adjustments/",
        format: "Article",
        minutes: 5,
      },
      {
        title: "ADHD career advice: job interview tips",
        desc: "ADDitude's step-by-step: extra time, role-play weaknesses, arrive early, research deeply.",
        href: "https://www.additudemag.com/job-interview-career-advice/",
        format: "Article",
        minutes: 6,
      },
      {
        title: "How to interview when you have ADHD",
        desc: "TopInterview reframes hyperfocus as a strength worth highlighting.",
        href: "https://topinterview.com/interview-advice/successful-interview-ADHD",
        format: "Article",
        minutes: 6,
      },
    ],
  },
  {
    heading: "Masking & autistic burnout",
    blurb:
      "What burnout actually is, why masking drives it, and what recovery realistically looks like.",
    items: [
      {
        title: "Autistic burnout at work: recognition & prevention",
        desc: "NeuroLaunch: the more 'successful' the mask looks, the closer the breaking point.",
        href: "https://neurolaunch.com/autistic-burnout-at-work/",
        format: "Article",
        minutes: 9,
      },
      {
        title: "Understanding autistic burnout at work",
        desc: "Capstone: lack of accommodations plus over-masking equals emotional exhaustion.",
        href: "https://capstonementalhealth.com/understanding-autistic-burnout-at-work-and-how-to-combat-it/",
        format: "Article",
        minutes: 7,
      },
      {
        title: "Autistic burnout: signs, causes, recovery",
        desc: "Neuro Spark on how burnout differs from ordinary stress and fatigue.",
        href: "https://neurosparkhealth.com/autism/autistic-burnout-support",
        format: "Article",
        minutes: 7,
      },
      {
        title: "How does autism masking cause burnout?",
        desc: "Simply Psychology on identity loss: 'I don't know what's me and what's the mask.'",
        href: "https://www.simplypsychology.org/autism-masking-burnout.html",
        format: "Article",
        minutes: 8,
      },
      {
        title: "What is autistic burnout? Signs & recovery",
        desc: "Embrace Autism: burnout often lasts months or years, not days.",
        href: "https://embrace-autism.com/what-is-autistic-burnout/",
        format: "Article",
        minutes: 8,
      },
      {
        title: "Avoiding autistic burnout",
        desc: "Neurodivergent Insights on how heavy masking drains your reserves faster.",
        href: "https://neurodivergentinsights.com/how-to-avoid-autistic-burnout/",
        format: "Article",
        minutes: 6,
      },
      {
        title: "When navigating a neurotypical world becomes too much",
        desc: "Autism Speaks shares a lived account of hitting the wall mid-shift.",
        href: "https://www.autismspeaks.org/tool-kit-excerpt/autistic-burnout-when-navigating-neurotypical-world-becomes-too-much",
        format: "Article",
        minutes: 6,
      },
      {
        title: "Autistic masking and burnout: what helps",
        desc: "ScienceWorks on the cost of continuous self-suppression without recovery.",
        href: "https://www.scienceworkshealth.com/post/masking-burnout-understanding-autistic-camouflaging",
        format: "Article",
        minutes: 7,
      },
    ],
  },
  {
    heading: "India: jobs & adult support",
    blurb:
      "Programs that actually hire and support neurodivergent adults in India.",
    items: [
      {
        title: "TestingPro: building a neurodiverse workforce",
        desc: "Nagarro × Atypical Advantage × Action for Autism × NASSCOM — an autism-to-software-testing pipeline.",
        href: "https://www.nagarro.com/en/news-press-release/testingpro-india-launch-build-neurodiverse-workforce",
        format: "Article",
        minutes: 5,
      },
      {
        title: "Action for Autism: tech employment",
        desc: "Roles for programmers, testers, developers, and analysts. Contact: wne.afa@gmail.com.",
        href: "https://in.linkedin.com/company/action-for-autism-national-centre-for-autism",
        format: "Reading list",
      },
      {
        title: "Specialised support for adults on the spectrum",
        desc: "India Autism Center on life-skills, vocational support, and emotional wellbeing.",
        href: "https://indiaautismcenter.org/blog/specialised-support-for-adults-on-the-spectrum/",
        format: "Article",
        minutes: 6,
      },
    ],
  },
  {
    heading: "Conversation starters",
    blurb:
      "Threads from the community for late-diagnosed adults, job-seekers, and professionals.",
    items: [
      {
        title: "Just diagnosed in college — everything makes sense",
        desc: "Processing the relief and the grief over years spent struggling without support.",
        href: "/community",
        format: "Script",
        minutes: 4,
      },
      {
        title: "Job interview anxiety — should I disclose?",
        desc: "Frameworks, not directives, from people who did disclose and people who didn't.",
        href: "/community",
        format: "Script",
        minutes: 4,
      },
      {
        title: "Masking so hard I'm losing myself",
        desc: "Early signs of burnout and recovery strategies that don't require quitting.",
        href: "/community",
        format: "Script",
        minutes: 4,
      },
      {
        title: "Burnout recognition — am I experiencing it?",
        desc: "Telling autistic burnout apart from depression and ADHD executive dysfunction.",
        href: "/community",
        format: "Script",
        minutes: 4,
      },
      {
        title: "Remote work changed everything",
        desc: "Negotiating remote as an accommodation and managing return-to-office anxiety.",
        href: "/community",
        format: "Script",
        minutes: 4,
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
