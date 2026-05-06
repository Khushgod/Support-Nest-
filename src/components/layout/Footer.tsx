import Link from "next/link";
import { Dna, ExternalLink } from "lucide-react";

const PRODUCT = [
  { href: "/analyze", label: "Analyze a report" },
  { href: "/manual-input", label: "Manual entry" },
  { href: "/results", label: "Results" },
];

const RESOURCES = [
  { href: "/resources", label: "Resources & support" },
  { href: "/faq", label: "FAQ" },
  {
    href: "https://www.nsgc.org/findageneticcounselor",
    label: "Find a counselor",
    external: true,
  },
];

const TRUST = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-sage-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sage-200 flex items-center justify-center">
                <Dna className="w-4 h-4 text-sage-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                GeneTranslate
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Plain-language genetic-report explanations. Local-first.
              Educational use only.
            </p>
          </div>

          <FooterColumn title="Product" items={PRODUCT} />
          <FooterColumn title="Resources" items={RESOURCES} />
          <FooterColumn title="Trust" items={TRUST} />
        </div>

        <div className="mt-10 pt-6 border-t border-sage-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[11px] leading-relaxed text-slate-400 max-w-3xl">
            GeneTranslate is intended for educational purposes only and does
            not constitute medical advice. Always review genetic test results
            with a board-certified genetic counselor or physician before
            making any health decisions.
          </p>
          <p className="text-[11px] text-slate-400 whitespace-nowrap">
            &copy; {new Date().getFullYear()} GeneTranslate
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) =>
          item.external ? (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-sky-600 transition-colors inline-flex items-center gap-1"
              >
                {item.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-xs text-slate-500 hover:text-sky-600 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
