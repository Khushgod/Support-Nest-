"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Plus,
  Download,
  FileDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  ACCOMMODATIONS,
  CHALLENGE_AREAS,
  COMMON_STRENGTHS,
  ROLES,
  type ChallengeArea,
  type IepRole,
} from "@/lib/iep-data";

type State = {
  role: IepRole;
  studentName: string;
  gradeOrAge: string;
  meetingDate: string;
  challenges: ChallengeArea[];
  strengths: string[];
  customStrength: string;
  accommodations: string[];
  goals: string;
  concerns: string;
  customAccommodations: string[];
  customAccommodationDraft: string;
};

const STORAGE_KEY = "supportnest_iep_companion_v1";

const INITIAL: State = {
  role: "parent",
  studentName: "",
  gradeOrAge: "",
  meetingDate: "",
  challenges: [],
  strengths: [],
  customStrength: "",
  accommodations: [],
  goals: "",
  concerns: "",
  customAccommodations: [],
  customAccommodationDraft: "",
};

export default function IepClient() {
  const [state, setState] = useState<State>(INITIAL);
  const hydratedRef = useRef(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // SSR-safe localStorage hydration; see SensoryClient for the rationale.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((s) => ({ ...s, ...parsed }));
      }
    } catch {
      // ignore
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  function patch(p: Partial<State>) {
    setState((s) => ({ ...s, ...p }));
  }

  function toggleChallenge(c: ChallengeArea) {
    patch({
      challenges: state.challenges.includes(c)
        ? state.challenges.filter((x) => x !== c)
        : [...state.challenges, c],
    });
  }
  function toggleStrength(s: string) {
    patch({
      strengths: state.strengths.includes(s)
        ? state.strengths.filter((x) => x !== s)
        : [...state.strengths, s],
    });
  }
  function toggleAccommodation(id: string) {
    patch({
      accommodations: state.accommodations.includes(id)
        ? state.accommodations.filter((x) => x !== id)
        : [...state.accommodations, id],
    });
  }

  const visibleAccommodations = useMemo(() => {
    if (state.challenges.length === 0) return ACCOMMODATIONS;
    return ACCOMMODATIONS.filter((a) => state.challenges.includes(a.area));
  }, [state.challenges]);

  function reset() {
    if (confirm("Reset all answers? This cannot be undone.")) {
      setState(INITIAL);
      setStep(1);
    }
  }

  function exportText() {
    const text = renderText(state);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IEP-prep-${slug(state.studentName) || "draft"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportPdf() {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 54;
    let y = margin;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margin * 2;

    const writeWrapped = (text: string, fontSize: number, gap = 6) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, usableWidth) as string[];
      for (const line of lines) {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += fontSize * 1.25;
      }
      y += gap;
    };

    doc.setFont("helvetica", "bold");
    writeWrapped(`IEP / 504 prep — ${state.studentName || "Student"}`, 18, 4);
    doc.setFont("helvetica", "normal");
    const meta: string[] = [];
    if (state.gradeOrAge) meta.push(state.gradeOrAge);
    if (state.meetingDate) meta.push(`Meeting: ${state.meetingDate}`);
    meta.push(roleLabel(state.role));
    writeWrapped(meta.join("  ·  "), 10, 16);

    doc.setFont("helvetica", "bold");
    writeWrapped("Strengths", 13, 2);
    doc.setFont("helvetica", "normal");
    const strengths = [
      ...state.strengths,
      ...(state.customStrength ? [state.customStrength] : []),
    ];
    if (strengths.length === 0) writeWrapped("(none added yet)", 11);
    else writeWrapped(strengths.map((s) => `• ${s}`).join("\n"), 11);

    doc.setFont("helvetica", "bold");
    writeWrapped("Areas of challenge", 13, 2);
    doc.setFont("helvetica", "normal");
    if (state.challenges.length === 0) writeWrapped("(none added yet)", 11);
    else
      writeWrapped(
        state.challenges
          .map((c) => `• ${CHALLENGE_AREAS.find((x) => x.id === c)?.label}`)
          .join("\n"),
        11
      );

    doc.setFont("helvetica", "bold");
    writeWrapped("Accommodations to discuss", 13, 2);
    doc.setFont("helvetica", "normal");
    const acc = [
      ...state.accommodations
        .map((id) => ACCOMMODATIONS.find((x) => x.id === id)?.text)
        .filter(Boolean),
      ...state.customAccommodations,
    ] as string[];
    if (acc.length === 0) writeWrapped("(none selected yet)", 11);
    else writeWrapped(acc.map((a) => `• ${a}`).join("\n"), 11);

    if (state.goals.trim()) {
      doc.setFont("helvetica", "bold");
      writeWrapped("Goals to bring up", 13, 2);
      doc.setFont("helvetica", "normal");
      writeWrapped(state.goals.trim(), 11);
    }

    if (state.concerns.trim()) {
      doc.setFont("helvetica", "bold");
      writeWrapped("Concerns / talking points", 13, 2);
      doc.setFont("helvetica", "normal");
      writeWrapped(state.concerns.trim(), 11);
    }

    doc.setFont("helvetica", "italic");
    doc.setTextColor(120);
    writeWrapped(
      "Prepared with SupportNest's IEP/504 Companion. Educational use only — not legal advice.",
      9
    );

    doc.save(`IEP-prep-${slug(state.studentName) || "draft"}.pdf`);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
      <div className="space-y-4">
        <Stepper current={step} onSelect={setStep} />

        <div className="rounded-3xl bg-white border border-cream-200 p-6 sm:p-7">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900">
                Step 1 · The basics
              </h2>
              <Field label="I'm filling this out as">
                <div className="flex gap-2 flex-wrap">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => patch({ role: r.id })}
                      className={`px-3.5 py-1.5 rounded-full text-sm border transition ${state.role === r.id ? "bg-coral-50 border-coral-400 text-coral-700" : "border-cream-300 text-slate-700 hover:bg-cream-50"}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={state.role === "self" ? "Your first name" : "Student's first name"}>
                  <Input
                    value={state.studentName}
                    onChange={(v) => patch({ studentName: v })}
                    placeholder="e.g., Maya"
                  />
                </Field>
                <Field label="Grade or age">
                  <Input
                    value={state.gradeOrAge}
                    onChange={(v) => patch({ gradeOrAge: v })}
                    placeholder="e.g., 4th grade · age 9"
                  />
                </Field>
              </div>
              <Field label="Meeting date (optional)">
                <Input
                  value={state.meetingDate}
                  onChange={(v) => patch({ meetingDate: v })}
                  placeholder="e.g., May 21, 2026"
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900">
                Step 2 · Strengths first
              </h2>
              <p className="text-xs text-slate-500">
                Lead with strengths — every IEP discussion goes better when
                the team starts here.
              </p>
              <div className="flex flex-wrap gap-2">
                {COMMON_STRENGTHS.map((s) => {
                  const on = state.strengths.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleStrength(s)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${on ? "bg-sun-50 border-sun-400 text-sun-800" : "border-cream-300 text-slate-700 hover:bg-cream-50"}`}
                    >
                      {on && <Check className="inline w-3 h-3 -mt-0.5 mr-1" />}
                      {s}
                    </button>
                  );
                })}
              </div>
              <Field label="Add another strength in your own words">
                <div className="flex gap-2">
                  <Input
                    value={state.customStrength}
                    onChange={(v) => patch({ customStrength: v })}
                    placeholder="e.g., Patient with younger siblings"
                  />
                  {state.customStrength && (
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          strengths: [...state.strengths, state.customStrength.trim()],
                          customStrength: "",
                        })
                      }
                      className="px-3 py-2 rounded-xl bg-sun-500 hover:bg-sun-600 text-white text-xs font-semibold"
                    >
                      Add
                    </button>
                  )}
                </div>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900">
                Step 3 · Areas of challenge
              </h2>
              <p className="text-xs text-slate-500">
                Pick what&rsquo;s actually getting in the way at school. The
                accommodations menu in the next step is filtered to these.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CHALLENGE_AREAS.map((c) => {
                  const on = state.challenges.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleChallenge(c.id)}
                      className={`text-left rounded-2xl border p-3.5 transition ${on ? "border-coral-400 bg-coral-50/60 ring-2 ring-coral-200/60" : "border-cream-200 hover:bg-cream-50"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {c.label}
                        </span>
                        {on && <Check className="w-4 h-4 text-coral-600" />}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{c.blurb}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900">
                Step 4 · Accommodations to discuss
              </h2>
              <p className="text-xs text-slate-500">
                {state.challenges.length === 0
                  ? "All areas shown. Tip: pick areas of challenge in step 3 to filter."
                  : "Filtered to your selected areas of challenge. Add custom items as needed."}
              </p>
              <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {visibleAccommodations.map((a) => {
                  const on = state.accommodations.includes(a.id);
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => toggleAccommodation(a.id)}
                        className={`w-full text-left rounded-xl border p-3 flex items-start gap-3 transition ${on ? "border-coral-400 bg-coral-50/50" : "border-cream-200 hover:bg-cream-50"}`}
                      >
                        <span
                          className={`mt-0.5 inline-flex w-4 h-4 rounded border ${on ? "bg-coral-500 border-coral-500" : "bg-white border-cream-300"} items-center justify-center flex-shrink-0`}
                        >
                          {on && <Check className="w-3 h-3 text-white" />}
                        </span>
                        <span className="text-sm text-slate-800 leading-relaxed">
                          {a.text}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="rounded-2xl border border-dashed border-cream-300 p-3.5">
                <Field label="Add a custom accommodation">
                  <div className="flex gap-2">
                    <Input
                      value={state.customAccommodationDraft}
                      onChange={(v) => patch({ customAccommodationDraft: v })}
                      placeholder="e.g., Quiet pre-read of new books before whole-class discussion."
                    />
                    {state.customAccommodationDraft && (
                      <button
                        type="button"
                        onClick={() =>
                          patch({
                            customAccommodations: [
                              ...state.customAccommodations,
                              state.customAccommodationDraft.trim(),
                            ],
                            customAccommodationDraft: "",
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    )}
                  </div>
                </Field>
                {state.customAccommodations.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {state.customAccommodations.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start justify-between gap-2 text-sm text-slate-800 rounded-lg bg-coral-50/40 px-2.5 py-1.5"
                      >
                        <span>{c}</span>
                        <button
                          type="button"
                          onClick={() =>
                            patch({
                              customAccommodations:
                                state.customAccommodations.filter(
                                  (_, j) => j !== i
                                ),
                            })
                          }
                          className="text-xs text-slate-500 hover:text-rose-600"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900">
                Step 5 · Goals &amp; concerns
              </h2>
              <Field label="Goals to bring up (e.g., things you want measurable)">
                <Textarea
                  value={state.goals}
                  onChange={(v) => patch({ goals: v })}
                  rows={5}
                  placeholder={"By the end of the year, Maya can…\n\nGoal 1: …\nGoal 2: …"}
                />
              </Field>
              <Field label="Concerns or talking points">
                <Textarea
                  value={state.concerns}
                  onChange={(v) => patch({ concerns: v })}
                  rows={5}
                  placeholder={"Things that aren't working yet, what you've already tried, questions for the team…"}
                />
              </Field>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-cream-100 flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-coral-600"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))}
                className="px-3 py-1.5 rounded-xl text-sm border border-cream-300 text-slate-700 hover:bg-cream-50 disabled:opacity-40"
              >
                Back
              </button>
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s < 5 ? ((s + 1) as 2 | 3 | 4 | 5) : s))}
                  className="px-4 py-1.5 rounded-xl text-sm bg-coral-500 hover:bg-coral-600 text-white font-semibold"
                >
                  Next
                </button>
              ) : (
                <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Ready to export →
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <aside className="space-y-4 lg:sticky lg:top-20 self-start">
        <div className="rounded-3xl bg-white border border-cream-200 p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900">
              Your one-pager preview
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={exportText}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-coral-700 px-2 py-1 rounded-lg hover:bg-cream-100"
                aria-label="Download as text file"
              >
                <Download className="w-3.5 h-3.5" /> .txt
              </button>
              <button
                type="button"
                onClick={exportPdf}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-coral-500 hover:bg-coral-600 px-3 py-1 rounded-lg"
              >
                <FileDown className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

          <div className="mt-5 prose-sm">
            <h4 className="text-base font-bold text-slate-900">
              IEP / 504 prep — {state.studentName || "Student"}
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              {[
                state.gradeOrAge,
                state.meetingDate ? `Meeting: ${state.meetingDate}` : null,
                roleLabel(state.role),
              ]
                .filter(Boolean)
                .join("  ·  ")}
            </p>

            <PreviewSection title="Strengths">
              <PreviewList
                items={[
                  ...state.strengths,
                  ...(state.customStrength ? [state.customStrength] : []),
                ]}
              />
            </PreviewSection>
            <PreviewSection title="Areas of challenge">
              <PreviewList
                items={state.challenges.map(
                  (c) =>
                    CHALLENGE_AREAS.find((x) => x.id === c)?.label ?? ""
                )}
              />
            </PreviewSection>
            <PreviewSection title="Accommodations to discuss">
              <PreviewList
                items={[
                  ...state.accommodations
                    .map((id) => ACCOMMODATIONS.find((x) => x.id === id)?.text)
                    .filter(Boolean) as string[],
                  ...state.customAccommodations,
                ]}
              />
            </PreviewSection>
            {state.goals.trim() && (
              <PreviewSection title="Goals to bring up">
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {state.goals.trim()}
                </p>
              </PreviewSection>
            )}
            {state.concerns.trim() && (
              <PreviewSection title="Concerns / talking points">
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {state.concerns.trim()}
                </p>
              </PreviewSection>
            )}
            <p className="mt-6 text-[11px] text-slate-400 italic">
              Educational content — not legal advice. SupportNest does not
              provide legal representation.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stepper({
  current,
  onSelect,
}: {
  current: 1 | 2 | 3 | 4 | 5;
  onSelect: (n: 1 | 2 | 3 | 4 | 5) => void;
}) {
  const STEPS = [
    "Basics",
    "Strengths",
    "Challenges",
    "Accommodations",
    "Goals & concerns",
  ];
  return (
    <ol className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {STEPS.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4 | 5;
        const active = n === current;
        const done = n < current;
        return (
          <li key={label} className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelect(n)}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border transition whitespace-nowrap ${
                active
                  ? "bg-coral-500 border-coral-500 text-white"
                  : done
                    ? "bg-coral-50 border-coral-200 text-coral-700"
                    : "bg-white border-cream-200 text-slate-500 hover:border-cream-300"
              }`}
            >
              <span
                className={`inline-flex w-4 h-4 rounded-full text-[10px] items-center justify-center ${active ? "bg-white text-coral-600" : done ? "bg-coral-200 text-coral-800" : "bg-cream-100 text-slate-500"}`}
              >
                {n}
              </span>
              {label}
            </button>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`block h-px w-3 ${done ? "bg-coral-300" : "bg-cream-200"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows ?? 4}
      placeholder={placeholder}
      className="w-full resize-y rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60 transition"
    />
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4">
      <h5 className="text-xs font-semibold uppercase tracking-wider text-coral-600 mb-1.5">
        {title}
      </h5>
      {children}
    </section>
  );
}

function PreviewList({ items }: { items: string[] }) {
  if (items.length === 0)
    return <p className="text-xs text-slate-400">Nothing here yet.</p>;
  return (
    <ul className="text-xs text-slate-800 list-disc list-inside space-y-1">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

function roleLabel(r: IepRole) {
  return ROLES.find((x) => x.id === r)?.label ?? "";
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 30);
}

function renderText(s: State) {
  const lines: string[] = [];
  lines.push(`IEP / 504 prep — ${s.studentName || "Student"}`);
  lines.push("=".repeat(60));
  const meta = [
    s.gradeOrAge,
    s.meetingDate ? `Meeting: ${s.meetingDate}` : "",
    roleLabel(s.role),
  ]
    .filter(Boolean)
    .join(" · ");
  if (meta) lines.push(meta);
  lines.push("");
  lines.push("STRENGTHS");
  for (const v of [
    ...s.strengths,
    ...(s.customStrength ? [s.customStrength] : []),
  ])
    lines.push(`  • ${v}`);
  if (s.strengths.length === 0 && !s.customStrength)
    lines.push("  (none added yet)");

  lines.push("");
  lines.push("AREAS OF CHALLENGE");
  if (s.challenges.length === 0) lines.push("  (none added yet)");
  else
    s.challenges.forEach((c) =>
      lines.push(`  • ${CHALLENGE_AREAS.find((x) => x.id === c)?.label}`)
    );

  lines.push("");
  lines.push("ACCOMMODATIONS TO DISCUSS");
  const acc = [
    ...(s.accommodations
      .map((id) => ACCOMMODATIONS.find((x) => x.id === id)?.text)
      .filter(Boolean) as string[]),
    ...s.customAccommodations,
  ];
  if (acc.length === 0) lines.push("  (none selected yet)");
  else acc.forEach((a) => lines.push(`  • ${a}`));

  if (s.goals.trim()) {
    lines.push("");
    lines.push("GOALS TO BRING UP");
    lines.push(s.goals.trim());
  }
  if (s.concerns.trim()) {
    lines.push("");
    lines.push("CONCERNS / TALKING POINTS");
    lines.push(s.concerns.trim());
  }
  lines.push("");
  lines.push("---");
  lines.push(
    "Prepared with SupportNest's IEP/504 Companion. Educational use only — not legal advice."
  );
  return lines.join("\n");
}
