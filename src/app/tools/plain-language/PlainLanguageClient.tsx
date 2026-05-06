"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  CheckCheck,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

type Audience = "plain" | "kid" | "summary" | "actions";
type Tone = "warm" | "neutral" | "professional";

const AUDIENCE_OPTIONS: { value: Audience; label: string; hint: string }[] = [
  { value: "plain", label: "Plain English", hint: "8th-grade reading level" },
  { value: "kid", label: "Kid-friendly", hint: "Ages 8–12" },
  { value: "summary", label: "Quick summary", hint: "3–5 sentences" },
  { value: "actions", label: "Action items only", hint: "Bulleted to-do" },
];

const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "warm", label: "Warm" },
  { value: "neutral", label: "Neutral" },
  { value: "professional", label: "Professional" },
];

const SAMPLES = [
  {
    label: "School evaluation snippet",
    body: `RESULTS:
On the Wechsler Intelligence Scale for Children—Fifth Edition (WISC-V), the student's General Ability Index (GAI) score of 124 falls within the Superior range (95% confidence interval: 117–129), exceeding 95% of same-age peers. However, performance on the Working Memory Index (WMI) of 86 is in the Low Average range, indicating a significant intra-cognitive discrepancy.

RECOMMENDATIONS:
1. Consider a Section 504 plan or IEP referral for executive-function and processing-speed accommodations.
2. Provide preferential seating proximal to the instructor with reduced auditory distractors.
3. Permit extended time (1.5x) on timed assessments per district guidelines.
4. Allow access to assistive technology including text-to-speech and graphic organizers.`,
  },
  {
    label: "Insurance denial letter",
    body: `Dear Member,

We have received your request for prior authorization of the requested service. After review, the requested service is not approved as it does not meet medical-necessity criteria per InterQual guidelines and the member's plan documents. Specifically, conservative therapy of at least 6 weeks duration is not documented in the records submitted.

You have the right to appeal this decision within 180 days. Appeals must be submitted in writing to the address below and include any additional clinical documentation supporting medical necessity. An expedited appeal may be requested if delay would seriously jeopardize the member's life or health.`,
  },
  {
    label: "Clinical-letter excerpt",
    body: `IMPRESSION:
ASD level 1 with co-occurring features consistent with ADHD-combined presentation. The child meets DSM-5 criteria across domains A and B. Recommend referral to developmental-behavioral pediatrics for medication management consult, OT evaluation for sensory-processing concerns, and SLP for pragmatic-language support. School should consider 504 vs IEP eligibility under "Other Health Impairment" and "Autism" categories.`,
  },
];

type Result = {
  rewritten: string;
  glossary?: { term: string; plain: string }[];
  audience: string;
};

export default function PlainLanguageClient() {
  const [text, setText] = useState("");
  const [audience, setAudience] = useState<Audience>("plain");
  const [tone, setTone] = useState<Tone>("warm");
  const [glossary, setGlossary] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const tooLong = charCount > 12_000;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setCopied(false);
    if (text.trim().length < 20) {
      setError("Paste at least a sentence or two so the model has something to work with.");
      return;
    }
    if (tooLong) {
      setError("Text exceeds the 12,000-character limit.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/tools/plain-language", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, audience, tone, glossary }),
      });
      const data = (await res.json()) as
        | { rewritten: string; glossary?: Result["glossary"]; audience: string }
        | { error: string; hint?: string };
      if (!res.ok || "error" in data) {
        setError(
          ("error" in data ? data.error : "Something went wrong.") +
            ("hint" in data && data.hint ? `\n\n${data.hint}` : "")
        );
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setPending(false);
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result.rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function applySample(body: string) {
    setText(body);
    setResult(null);
    setError(null);
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input column */}
      <div className="rounded-3xl bg-white border border-cream-200 p-6 sm:p-7">
        <h2 className="text-base font-semibold text-slate-900">
          Paste your text
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Up to 12,000 characters. Nothing is saved by us.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a clinical letter, school evaluation, IEP draft, insurance letter, or any jargon-heavy text…"
          rows={14}
          className={`mt-4 block w-full resize-y rounded-2xl border ${tooLong ? "border-rose-300" : "border-cream-300"} bg-cream-50/40 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition`}
        />
        <div
          className={`mt-1.5 text-[11px] ${tooLong ? "text-rose-600" : "text-slate-500"}`}
        >
          {charCount.toLocaleString()} / 12,000 characters
        </div>

        <fieldset className="mt-6">
          <legend className="block text-xs font-semibold text-slate-700 mb-2">
            Rewrite for
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {AUDIENCE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex flex-col gap-0.5 rounded-2xl border px-3.5 py-2.5 cursor-pointer transition ${audience === opt.value ? "border-coral-400 bg-coral-50/60 ring-2 ring-coral-200/60" : "border-cream-200 hover:bg-cream-50"}`}
              >
                <input
                  type="radio"
                  name="audience"
                  value={opt.value}
                  checked={audience === opt.value}
                  onChange={() => setAudience(opt.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-slate-900">
                  {opt.label}
                </span>
                <span className="text-[11px] text-slate-500">{opt.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="block text-xs font-semibold text-slate-700 mb-2">
            Tone
          </legend>
          <div className="flex gap-2">
            {TONE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex-1 rounded-xl border px-3 py-2 text-center cursor-pointer transition ${tone === opt.value ? "border-coral-400 bg-coral-50/60" : "border-cream-200 hover:bg-cream-50"}`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={opt.value}
                  checked={tone === opt.value}
                  onChange={() => setTone(opt.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-slate-700">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="mt-5 flex items-start gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={glossary}
            onChange={(e) => setGlossary(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-cream-300 text-coral-500 focus:ring-coral-300"
          />
          <span>
            Also extract a glossary of any jargon used in the original (up to 8
            terms).
          </span>
        </label>

        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <button
            type="submit"
            disabled={pending || tooLong}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            {pending ? "Rewriting…" : "Rewrite in plain language"}
          </button>
          {text && (
            <button
              type="button"
              onClick={() => {
                setText("");
                setResult(null);
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-coral-600"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        <div className="mt-7 pt-5 border-t border-cream-200">
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Or try a sample:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => applySample(s.body)}
                className="text-xs px-2.5 py-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-slate-700"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output column */}
      <div className="rounded-3xl bg-white border border-cream-200 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-slate-900">
            Plain-language output
          </h2>
          {result && (
            <button
              type="button"
              onClick={copyResult}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-coral-600 hover:text-coral-700"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          )}
        </div>

        {pending && (
          <div className="mt-6 space-y-3 animate-pulse-gentle">
            <div className="h-3 w-full rounded bg-cream-100" />
            <div className="h-3 w-11/12 rounded bg-cream-100" />
            <div className="h-3 w-9/12 rounded bg-cream-100" />
            <div className="h-3 w-10/12 rounded bg-cream-100" />
            <p className="text-xs text-slate-500 mt-4">
              Running locally on your model. This usually takes 5–30 seconds
              depending on input length.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 flex gap-2 items-start whitespace-pre-line">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {!pending && !error && !result && (
          <p className="mt-6 text-sm text-slate-500 leading-relaxed">
            Your rewritten version will appear here. The original wording is
            preserved — only the framing and vocabulary change.
          </p>
        )}

        {result && !pending && (
          <>
            <article className="mt-5 prose-sm max-w-none whitespace-pre-wrap text-sm text-slate-800 leading-relaxed">
              {result.rewritten}
            </article>

            {result.glossary && result.glossary.length > 0 && (
              <div className="mt-7 pt-5 border-t border-cream-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Glossary
                </h3>
                <dl className="space-y-2">
                  {result.glossary.map((g) => (
                    <div
                      key={g.term}
                      className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5"
                    >
                      <dt className="text-xs font-semibold text-lavender-700">
                        {g.term}
                      </dt>
                      <dd className="text-xs text-slate-700 leading-relaxed">
                        {g.plain}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </>
        )}
      </div>
    </form>
  );
}
