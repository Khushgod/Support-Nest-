import Link from "next/link";
import {
  ExternalLink,
  Users,
  BookOpen,
  HeartHandshake,
  GraduationCap,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Resources & support | GeneTranslate",
  description:
    "Find a genetic counselor, learn how variants are classified, and get pointers to trusted patient education and support resources.",
};

type Resource = {
  title: string;
  desc: string;
  href: string;
};

const COUNSELORS: Resource[] = [
  {
    title: "NSGC: Find a Genetic Counselor",
    desc: "National Society of Genetic Counselors directory — searchable by location and specialty.",
    href: "https://www.nsgc.org/findageneticcounselor",
  },
  {
    title: "ABGC: Find a Certified Counselor",
    desc: "American Board of Genetic Counseling registry of board-certified counselors.",
    href: "https://abgc.learningbuilder.com/Public/MemberSearch",
  },
  {
    title: "CAGC: Canadian Genetic Counsellors",
    desc: "Canadian Association of Genetic Counsellors find-a-counsellor directory.",
    href: "https://cagc-accg.ca/find-a-counsellor/",
  },
];

const EDUCATION: Resource[] = [
  {
    title: "MedlinePlus Genetics",
    desc: "NIH-run consumer-friendly explainers for genes, variants, and conditions.",
    href: "https://medlineplus.gov/genetics/",
  },
  {
    title: "NIH GARD",
    desc: "Genetic and Rare Diseases Information Center — searchable disease information.",
    href: "https://rarediseases.info.nih.gov/",
  },
  {
    title: "NHGRI Education",
    desc: "National Human Genome Research Institute educational hub.",
    href: "https://www.genome.gov/about-genomics/educational-resources",
  },
  {
    title: "ClinVar",
    desc: "NCBI public archive of variant interpretations &mdash; the same evidence GeneTranslate looks up.",
    href: "https://www.ncbi.nlm.nih.gov/clinvar/",
  },
  {
    title: "GeneReviews",
    desc: "Expert-authored, peer-reviewed disease descriptions for clinicians and patients.",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK1116/",
  },
];

const SUPPORT: Resource[] = [
  {
    title: "FORCE — Hereditary Cancer",
    desc: "Facing Our Risk of Cancer Empowered: peer support for hereditary cancer syndromes.",
    href: "https://www.facingourrisk.org/",
  },
  {
    title: "NORD",
    desc: "National Organization for Rare Disorders — patient assistance programs and disease communities.",
    href: "https://rarediseases.org/",
  },
  {
    title: "Genetic Alliance",
    desc: "Network of disease advocacy organizations and family-focused resources.",
    href: "https://geneticalliance.org/",
  },
];

const ACMG_TIERS = [
  {
    label: "Pathogenic",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    desc: "Strong evidence the variant causes disease.",
  },
  {
    label: "Likely pathogenic",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "Evidence leans toward disease-causing but isn't definitive.",
  },
  {
    label: "Variant of uncertain significance",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    desc: "Not enough evidence yet to classify either way. Often reclassified later.",
  },
  {
    label: "Likely benign",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Evidence leans toward harmless.",
  },
  {
    label: "Benign",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Strong evidence the variant does not cause disease.",
  },
];

function ResourceList({ items }: { items: Resource[] }) {
  return (
    <ul className="space-y-3">
      {items.map((r) => (
        <li key={r.href}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 p-4 rounded-xl border border-sage-200 bg-white hover:border-sky-200 hover:bg-sky-50/30 transition-colors"
          >
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 flex items-center gap-1.5">
                {r.title}
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                {r.desc}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ResourcesPage() {
  return (
    <main className="flex-1">
        <section className="pt-12 pb-6 sm:pt-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3">
              Resources & support
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Where to go from here
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              GeneTranslate is an educational starting point. The real
              conversation is with a board-certified counselor. Below are
              vetted directories, plain-language education, and patient
              support communities to help you take the next step.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
            {/* Find a counselor */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Find a genetic counselor
                </h2>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                A counseling appointment is the right next step after any
                positive or uncertain finding.
              </p>
              <ResourceList items={COUNSELORS} />
            </div>

            {/* Patient education */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Patient education
                </h2>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Trusted, free resources for understanding your condition and
                its inheritance.
              </p>
              <ResourceList items={EDUCATION} />
            </div>

            {/* ACMG */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Understanding ACMG variant classes
                </h2>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Labs use a 5-tier system to rate how confident they are that a
                variant causes disease. Classifications can change as new
                evidence emerges &mdash; ask your counselor whether a
                reclassification is worth checking.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACMG_TIERS.map((t) => (
                  <div
                    key={t.label}
                    className="bg-white rounded-xl border border-sage-200 p-4"
                  >
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${t.color}`}
                    >
                      {t.label}
                    </span>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support communities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HeartHandshake className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Support communities
                </h2>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Receiving genetic results can be overwhelming. These
                communities offer peer support, advocacy, and patient
                resources.
              </p>
              <ResourceList items={SUPPORT} />
            </div>

            {/* Contact */}
            <div className="rounded-2xl bg-sky-50/60 border border-sky-100 p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    Have feedback or a question?
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    GeneTranslate is open and ephemeral &mdash; we don&rsquo;t
                    track usage or hold accounts. For product feedback, bug
                    reports, or to ask us to support a new lab format, email{" "}
                    <a
                      href="mailto:support@genetranslate.example"
                      className="text-sky-700 font-medium hover:underline"
                    >
                      support@genetranslate.example
                    </a>
                    .
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Please do not include real patient data, PHI, or report
                    PDFs in support emails.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Looking for product help? Try the{" "}
              <Link
                href="/faq"
                className="text-sky-700 font-medium hover:underline"
              >
                FAQ
              </Link>{" "}
              or{" "}
              <Link
                href="/tools/genetranslate/about"
                className="text-sky-700 font-medium hover:underline"
              >
                how it works
              </Link>
              .
            </p>
          </div>
        </section>
    </main>
  );
}
