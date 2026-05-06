"use client";

import { clsx } from "clsx";
import { Check, Upload, Cpu, FileText } from "lucide-react";

const steps = [
  { label: "Upload", icon: Upload },
  { label: "Analyze", icon: Cpu },
  { label: "Results", icon: FileText },
];

interface ProgressStepsProps {
  currentStep: number; // 0, 1, 2
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
      {steps.map((step, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;
        const Icon = step.icon;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  {
                    "bg-sky-600 text-white shadow-sm": isCurrent,
                    "bg-green-500 text-white": isComplete,
                    "bg-sage-100 text-sage-400": !isCurrent && !isComplete,
                  }
                )}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={clsx("text-xs font-medium", {
                  "text-sky-700": isCurrent,
                  "text-green-600": isComplete,
                  "text-sage-400": !isCurrent && !isComplete,
                })}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={clsx(
                  "w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300",
                  {
                    "bg-green-400": i < currentStep,
                    "bg-sage-200": i >= currentStep,
                  }
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
