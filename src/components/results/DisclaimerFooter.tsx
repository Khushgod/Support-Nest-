import { Shield, ExternalLink } from "lucide-react";
import { MAIN_DISCLAIMER } from "@/lib/safety-checker";

export default function DisclaimerFooter() {
  return (
    <div className="bg-sage-100 border border-sage-200 rounded-2xl p-5">
      <div className="flex gap-3">
        <Shield className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-sage-800 leading-relaxed font-medium mb-2">
            {MAIN_DISCLAIMER}
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <a
              href="https://www.nsgc.org/findageneticcounselor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800 font-medium"
            >
              Find a Genetic Counselor
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://rarediseases.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800 font-medium"
            >
              NORD Resources
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
