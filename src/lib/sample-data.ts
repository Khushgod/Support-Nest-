import type { AnalysisResult } from "./types";

export interface SampleReport {
  id: string;
  file: string;
  lab: string;
  title: string;
  testType: string;
  finding: "positive" | "negative";
  description: string;
  /** Pre-computed analysis output — lets users view the results page without running the API. */
  sampleOutput: AnalysisResult;
}

// Output modeled after the real Invitae BRIP1 cancer screen PDF in public/samples.
const invitaeBrip1Output: AnalysisResult = {
  summary: {
    whatWasFound:
      "Your report identified one pathogenic (disease-causing) change in a gene called BRIP1. Specifically, a single letter in the DNA was swapped (c.1343G>A), which creates an early stop signal in the protein (p.Trp448*). This means the BRIP1 gene likely can't make a full, working copy of its protein from that copy of the gene. You have this change in only one of your two copies of BRIP1 (heterozygous) — the other copy is unchanged.",
    whatItMeans:
      "BRIP1 helps your cells repair damaged DNA. When one copy doesn't work, the risk of certain cancers goes up over a lifetime — most clearly ovarian cancer, and possibly breast cancer (evidence is still being gathered). This is not a diagnosis of cancer, and most people with a BRIP1 change will not develop it. There are well-established screening and risk-reducing options that a genetics provider can walk you through. Because this change is inherited, close biological relatives (parents, siblings, children) each have a 50% chance of carrying it and may want to consider testing.",
    whatIsUncertain:
      "The size of the breast-cancer risk increase from BRIP1 is still being studied and is likely smaller than the ovarian-cancer risk. Your personal risk also depends on your family history, age, and other factors this report doesn't cover. A genetic counselor can help translate the BRIP1 finding into specific, individualized recommendations for you.",
  },
  variantCards: [
    {
      gene: "BRIP1",
      geneFunction:
        "BRIP1 helps repair damaged DNA, especially damage caused by errors during cell division. It works closely with the well-known BRCA1 gene in a protective pathway. When BRIP1 isn't working properly, cells are more likely to accumulate mutations that can eventually lead to cancer.",
      variantNotation: "c.1343G>A (p.Trp448*)",
      classification: "Pathogenic",
      classificationExplanation:
        "This change creates a premature stop signal at amino-acid position 448 of the BRIP1 protein. That means the protein gets cut short and can't do its normal DNA-repair job. Loss-of-function changes like this one are well-established as disease-causing, which is why the lab classified it as Pathogenic.",
      condition: "Hereditary ovarian cancer (and possibly breast cancer)",
      inheritance: "Autosomal dominant",
      inheritanceRisk:
        "Each first-degree relative (parent, sibling, child) has about a 50% chance of also carrying this change. Being a carrier also matters for family planning: if a future partner also carries a BRIP1 change, children could inherit a rarer condition called Fanconi anemia.",
      zygosity: "Heterozygous (one of two copies)",
      confidence: "High",
      confidenceReason:
        "This variant has been reported in published studies, is listed in ClinVar (Variation ID: 216129), and matches a well-understood mechanism — a protein-truncating change in a gene where loss-of-function is known to cause disease.",
      keyTakeaway:
        "Bring this report to a genetic counselor soon. They can help you plan cancer screening (especially for ovarian cancer) and decide who in your family might also benefit from testing.",
    },
  ],
  questions: [
    {
      question:
        "Given this BRIP1 finding, what cancer-screening schedule do you recommend for me specifically, and at what age should each test start?",
      reasoning:
        "Screening recommendations for BRIP1 carriers (especially around ovarian cancer) depend on your age, personal history, and family history. Getting a clear plan up front is the single most actionable next step.",
      priority: 1,
    },
    {
      question:
        "Should I consider risk-reducing options like a salpingo-oophorectomy, and if so, what's the typical timing and what would I need to weigh?",
      reasoning:
        "For some BRIP1 carriers, surgical removal of the fallopian tubes and ovaries is discussed once childbearing is complete. It's a major decision with quality-of-life trade-offs — worth a full conversation with a specialist rather than a one-line answer.",
      priority: 2,
    },
    {
      question:
        "Which of my family members should be offered testing for this specific BRIP1 change, and how should I start that conversation with them?",
      reasoning:
        "Each first-degree relative has a 50% chance of carrying the same change. A counselor can help identify who is most important to test and can often provide a family letter you can share.",
      priority: 3,
    },
    {
      question:
        "How confident are we about the breast-cancer risk from BRIP1 right now, and does that change whether I should add breast MRI to my screening?",
      reasoning:
        "The breast-cancer risk from BRIP1 is still being characterized. It's worth asking directly whether current evidence justifies enhanced breast screening for you.",
      priority: 4,
    },
    {
      question:
        "If I plan to have children, what are my options for family planning given this BRIP1 carrier status?",
      reasoning:
        "Because BRIP1 also causes Fanconi anemia when both copies are affected, partner screening and reproductive options (including PGT-M) may be worth discussing depending on your life stage.",
      priority: 5,
    },
  ],
  safetyFlags: {
    hasHighRiskGenes: true,
    highRiskGenes: ["BRIP1"],
    overallConfidence: "High",
  },
  disclaimer:
    "This plain-language summary is generated by AI from a sample lab report for demonstration purposes only. It is not medical advice, not a diagnosis, and must not replace a consultation with a qualified clinician or certified genetic counselor. Always review your actual results with your care team.",
};

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: "invitae-brip1-positive",
    file: "/samples/invitae-cancer-screen-positive.pdf",
    lab: "Invitae",
    title: "Hereditary cancer screen — BRIP1 pathogenic",
    testType: "Genetic Health Screen (147 genes)",
    finding: "positive",
    description:
      "A real Invitae sample report with a pathogenic BRIP1 variant (c.1343G>A) associated with hereditary ovarian cancer risk.",
    sampleOutput: invitaeBrip1Output,
  },
  {
    id: "invitae-hereditary-cancer-negative",
    file: "/samples/invitae-hereditary-cancer-negative.pdf",
    lab: "Invitae",
    title: "Common Hereditary Cancers Panel — negative",
    testType: "Hereditary cancer panel (47 genes)",
    finding: "negative",
    description:
      "A real Invitae sample report with no reportable variants, useful for seeing how a negative result is explained.",
    sampleOutput: {
      summary: {
        whatWasFound:
          "Your report is negative. The lab looked at 47 genes known to be linked to hereditary cancer risk and did not find any pathogenic (disease-causing) changes in those genes.",
        whatItMeans:
          "Based on this panel alone, there's no known inherited cancer-risk gene change to act on. Many cancers still happen by chance or due to factors this test doesn't measure, so a negative result is reassuring but not a guarantee. Your personal cancer-screening schedule should still be based on your age, family history, and lifestyle factors.",
        whatIsUncertain:
          "This panel only covers 47 genes. If your family history is strong, a larger panel or a different test may still be worth considering. A genetic counselor can help decide whether further testing is appropriate.",
      },
      variantCards: [],
      questions: [
        {
          question:
            "Given my family history, does a negative result on this 47-gene panel change what screening you recommend for me?",
          reasoning:
            "A negative result is reassuring but doesn't always lower baseline screening recommendations, especially when there's a notable family history.",
          priority: 1,
        },
        {
          question:
            "Are there other genes or more comprehensive panels that might still be worth considering in my case?",
          reasoning:
            "47 genes is a common but not exhaustive cancer panel. Knowing whether a broader panel would add meaningful information helps you decide whether this result is the full picture.",
          priority: 2,
        },
        {
          question:
            "What signs or changes in my health or family history should trigger us to revisit genetic testing in the future?",
          reasoning:
            "Testing strategies evolve over time. A clear 'come back if X happens' plan helps you stay proactive.",
          priority: 3,
        },
      ],
      safetyFlags: {
        hasHighRiskGenes: false,
        highRiskGenes: [],
        overallConfidence: "High",
      },
      disclaimer:
        "This plain-language summary is generated by AI from a sample lab report for demonstration purposes only. It is not medical advice, not a diagnosis, and must not replace a consultation with a qualified clinician or certified genetic counselor. Always review your actual results with your care team.",
    },
  },
  {
    id: "invitae-carrier-positive",
    file: "/samples/invitae-carrier-screen-positive.pdf",
    lab: "Invitae",
    title: "Comprehensive carrier screen — HBA1 deletion",
    testType: "Carrier screen",
    finding: "positive",
    description:
      "A real Invitae sample carrier screen showing a pathogenic HBA1 deletion relevant to reproductive planning.",
    sampleOutput: invitaeBrip1Output, // fallback until the HBA1 report is authored; see note in UI
  },
  {
    id: "genedx-wes",
    file: "/samples/genedx-wes-report.pdf",
    lab: "GeneDx",
    title: "Whole Exome Sequencing — sample report",
    testType: "Whole exome sequencing",
    finding: "positive",
    description:
      "A real GeneDx sample whole-exome sequencing report — useful for seeing a different lab's format.",
    sampleOutput: invitaeBrip1Output, // fallback until a WES-specific output is authored; see note in UI
  },
];

/** The canonical, hand-authored sample used by the "View Sample Output" button. */
export const DEFAULT_SAMPLE_OUTPUT = invitaeBrip1Output;
