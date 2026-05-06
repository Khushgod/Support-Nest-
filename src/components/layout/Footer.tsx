import { Dna, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-sage-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sage-200 flex items-center justify-center">
              <Dna className="w-4 h-4 text-sage-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              GeneTranslate
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a
              href="https://www.nsgc.org/findageneticcounselor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-sky-600 transition-colors"
            >
              Find a Genetic Counselor
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">|</span>
            <span>Educational purposes only</span>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-400 max-w-3xl">
          GeneTranslate is intended for educational purposes only and does not
          constitute medical advice. Always review genetic test results with a
          board-certified genetic counselor or physician before making any health
          decisions.
        </p>
      </div>
    </footer>
  );
}
