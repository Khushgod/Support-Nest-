"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PatientContext } from "@/lib/types";

interface ContextFormProps {
  context: PatientContext;
  onChange: (context: PatientContext) => void;
  disabled?: boolean;
}

export default function ContextForm({
  context,
  onChange,
  disabled,
}: ContextFormProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors"
        disabled={disabled}
      >
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        Add context for a better summary
        <span className="text-xs text-slate-400 font-normal">(optional)</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Patient age
            </label>
            <input
              id="age"
              type="text"
              placeholder="e.g., 3 years old"
              value={context.age || ""}
              onChange={(e) => onChange({ ...context, age: e.target.value })}
              disabled={disabled}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Reason for testing
            </label>
            <input
              id="reason"
              type="text"
              placeholder="e.g., developmental delay, family history of..."
              value={context.reasonForTesting || ""}
              onChange={(e) =>
                onChange({ ...context, reasonForTesting: e.target.value })
              }
              disabled={disabled}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="counselor"
              type="checkbox"
              checked={context.counselorScheduled || false}
              onChange={(e) =>
                onChange({ ...context, counselorScheduled: e.target.checked })
              }
              disabled={disabled}
              className="w-4 h-4 rounded border-sage-300 text-sky-600 focus:ring-sky-400"
            />
            <label
              htmlFor="counselor"
              className="text-sm text-slate-700"
            >
              I have a genetic counselor appointment scheduled
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
