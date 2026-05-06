import { AlertTriangle, ExternalLink } from "lucide-react";

interface HighRiskBannerProps {
  genes: string[];
}

export default function HighRiskBanner({ genes }: HighRiskBannerProps) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 animate-fade-in">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-rose-800 mb-1.5">
            Important: High-Significance Gene{genes.length > 1 ? "s" : ""}{" "}
            Detected
          </h3>
          <p className="text-sm text-rose-700 leading-relaxed mb-3">
            This report includes findings in{" "}
            <strong>{genes.join(", ")}</strong>, which{" "}
            {genes.length > 1 ? "are" : "is"} associated with hereditary cancer
            syndromes. These results can have significant implications for you
            and your family members.
          </p>
          <p className="text-sm text-rose-700 leading-relaxed mb-3">
            We <strong>strongly recommend</strong> speaking with a
            board-certified genetic counselor before discussing these results
            with family members. A counselor can help you understand the
            implications and develop an appropriate plan.
          </p>
          <a
            href="https://www.nsgc.org/findageneticcounselor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-900 underline underline-offset-2"
          >
            Find a genetic counselor near you
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
