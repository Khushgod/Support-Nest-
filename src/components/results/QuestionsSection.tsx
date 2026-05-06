"use client";

import Card from "@/components/ui/Card";
import CopyButton from "@/components/ui/CopyButton";
import type { CounselorQuestion } from "@/lib/types";
import { MessageSquare } from "lucide-react";

interface QuestionsSectionProps {
  questions: CounselorQuestion[];
}

export default function QuestionsSection({ questions }: QuestionsSectionProps) {
  const copyText = questions
    .map((q, i) => `${i + 1}. ${q.question}`)
    .join("\n");

  return (
    <Card className="animate-slide-up">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Questions for Your Genetic Counselor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bring these to your next appointment
            </p>
          </div>
        </div>
        <CopyButton text={copyText} label="Copy all" />
      </div>

      <ol className="space-y-4">
        {questions.map((q, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-50 text-sky-700 text-sm font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {q.question}
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {q.reasoning}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
