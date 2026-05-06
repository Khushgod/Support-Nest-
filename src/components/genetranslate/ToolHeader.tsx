import Link from "next/link";
import { ChevronRight, Dna } from "lucide-react";

const NAV = [
  { href: "/tools/genetranslate", label: "Overview" },
  { href: "/analyze", label: "Analyze a PDF" },
  { href: "/manual-input", label: "Manual entry" },
  { href: "/tools/genetranslate/resources", label: "Counselor finder" },
  { href: "/faq", label: "FAQ" },
];

export default function ToolHeader() {
  return (
    <div className="bg-gradient-to-r from-cream-50 via-coral-50 to-lavender-50 border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/tools" className="hover:text-coral-600">
            Tools
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="inline-flex items-center gap-1.5 text-slate-800 font-medium">
            <span className="w-5 h-5 rounded-md bg-sky-600 text-white inline-flex items-center justify-center">
              <Dna className="w-3 h-3" />
            </span>
            GeneTranslate
          </span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs sm:text-[13px] font-medium text-slate-600 hover:text-sky-700 px-2 py-1 rounded-md hover:bg-white/60 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
