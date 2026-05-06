"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Trash2,
  Plus,
  RotateCcw,
  Volume2,
  Sun,
  Users,
  Move,
  Hand,
  Brain,
  AlertTriangle,
  Info,
  Lightbulb,
  Download,
} from "lucide-react";

type Load = "calm" | "low" | "medium" | "high";

const LOAD_META: Record<
  Load,
  { label: string; weight: number; color: string; ring: string }
> = {
  calm: {
    label: "Calm",
    weight: 0,
    color: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-200",
  },
  low: {
    label: "Low",
    weight: 1,
    color: "bg-sun-100 text-sun-800",
    ring: "ring-sun-200",
  },
  medium: {
    label: "Medium",
    weight: 2,
    color: "bg-coral-100 text-coral-800",
    ring: "ring-coral-200",
  },
  high: {
    label: "High",
    weight: 3,
    color: "bg-rose-100 text-rose-800",
    ring: "ring-rose-200",
  },
};

const TRIGGER_OPTIONS: {
  value: string;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "sound", label: "Sound", icon: Volume2 },
  { value: "light", label: "Light", icon: Sun },
  { value: "crowds", label: "Crowds", icon: Users },
  { value: "transitions", label: "Transitions", icon: Move },
  { value: "touch", label: "Touch / texture", icon: Hand },
  { value: "social", label: "Social demand", icon: Users },
  { value: "cognitive", label: "Cognitive load", icon: Brain },
];

type Block = {
  id: string;
  time: string;
  activity: string;
  load: Load;
  triggers: string[];
  notes: string;
};

const STORAGE_KEY = "supportnest_sensory_planner_v1";

const DEFAULT_BLOCKS: Block[] = [
  { id: rid(), time: "07:00", activity: "Wake-up routine", load: "low", triggers: [], notes: "" },
  { id: rid(), time: "07:45", activity: "Breakfast", load: "low", triggers: ["sound"], notes: "" },
  { id: rid(), time: "08:15", activity: "Drop-off / commute", load: "medium", triggers: ["transitions", "sound"], notes: "" },
  { id: rid(), time: "09:00", activity: "School / work morning block", load: "medium", triggers: ["cognitive", "social"], notes: "" },
  { id: rid(), time: "12:00", activity: "Lunch / break", load: "low", triggers: [], notes: "" },
  { id: rid(), time: "13:00", activity: "School / work afternoon block", load: "medium", triggers: ["cognitive"], notes: "" },
  { id: rid(), time: "15:30", activity: "Pickup / transition home", load: "high", triggers: ["transitions", "social"], notes: "Often the hardest part of the day." },
  { id: rid(), time: "16:30", activity: "Snack + decompression", load: "calm", triggers: [], notes: "" },
  { id: rid(), time: "17:30", activity: "Homework / errands", load: "medium", triggers: ["cognitive", "transitions"], notes: "" },
  { id: rid(), time: "19:00", activity: "Dinner", load: "low", triggers: ["social"], notes: "" },
  { id: rid(), time: "20:00", activity: "Bath / wind-down", load: "low", triggers: ["touch"], notes: "" },
  { id: rid(), time: "21:00", activity: "Bedtime routine", load: "calm", triggers: [], notes: "" },
];

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function SensoryClient() {
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS);
  const hydratedRef = useRef(false);

  // SSR-safe localStorage hydration: server renders DEFAULT_BLOCKS, then on
  // mount we read the user's saved plan if there is one. Using a ref for
  // "hydrated" avoids extra renders. The setState below is the standard
  // hydration pattern; the rule's auto-suggestion (lazy init) would cause
  // hydration mismatches in App Router.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setBlocks(parsed);
        }
      }
    } catch {
      // ignore
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch {
      // localStorage may be full / disabled; fail silently
    }
  }, [blocks]);

  const sorted = useMemo(
    () => [...blocks].sort((a, b) => a.time.localeCompare(b.time)),
    [blocks]
  );
  const total = sorted.reduce((s, b) => s + LOAD_META[b.load].weight, 0);
  const max = sorted.length * 3;

  // Identify trouble zones: 3+ consecutive blocks at medium or high.
  const trouble = useMemo(() => {
    const out: { startIndex: number; length: number }[] = [];
    let runStart = -1;
    for (let i = 0; i < sorted.length; i++) {
      const heavy = sorted[i].load === "medium" || sorted[i].load === "high";
      if (heavy) {
        if (runStart === -1) runStart = i;
      } else {
        if (runStart !== -1 && i - runStart >= 3) {
          out.push({ startIndex: runStart, length: i - runStart });
        }
        runStart = -1;
      }
    }
    if (runStart !== -1 && sorted.length - runStart >= 3) {
      out.push({ startIndex: runStart, length: sorted.length - runStart });
    }
    return out;
  }, [sorted]);

  function update(id: string, patch: Partial<Block>) {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }
  function remove(id: string) {
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  }
  function add() {
    setBlocks((bs) => [
      ...bs,
      {
        id: rid(),
        time: "12:00",
        activity: "New block",
        load: "low",
        triggers: [],
        notes: "",
      },
    ]);
  }
  function reset() {
    if (
      confirm(
        "Reset to the default day plan? Your current edits will be lost."
      )
    ) {
      setBlocks(DEFAULT_BLOCKS);
    }
  }
  function exportPlan() {
    const lines: string[] = [
      "Sensory Day Plan",
      "================",
      "",
      ...sorted.map(
        (b) =>
          `${b.time}  [${LOAD_META[b.load].label.padEnd(6)}]  ${b.activity}` +
          (b.triggers.length ? ` (${b.triggers.join(", ")})` : "") +
          (b.notes ? `\n          ${b.notes}` : "")
      ),
      "",
      `Total load: ${total} of ${max}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sensory-day-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="rounded-3xl bg-white border border-cream-200 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <h2 className="text-base font-semibold text-slate-900">
            Today&rsquo;s timeline
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={add}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-coral-600 hover:text-coral-700 px-2 py-1.5 rounded-lg hover:bg-cream-100"
            >
              <Plus className="w-3.5 h-3.5" /> Add block
            </button>
            <button
              type="button"
              onClick={exportPlan}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-coral-700 px-2 py-1.5 rounded-lg hover:bg-cream-100"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-coral-600 px-2 py-1.5 rounded-lg hover:bg-cream-100"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <ul className="space-y-2.5">
          {sorted.map((block) => (
            <BlockRow
              key={block.id}
              block={block}
              onChange={(patch) => update(block.id, patch)}
              onRemove={() => remove(block.id)}
            />
          ))}
        </ul>

        <p className="mt-5 text-[11px] text-slate-500 inline-flex items-center gap-1.5">
          <Info className="w-3 h-3" /> Saved automatically in this browser. Use
          export to share or print.
        </p>
      </div>

      <aside className="space-y-4">
        <div className="rounded-3xl bg-white border border-cream-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900">Sensory budget</h3>
          <div className="mt-3 h-3 rounded-full bg-cream-100 overflow-hidden">
            <div
              className={`h-full transition-all ${total / max > 0.7 ? "bg-rose-400" : total / max > 0.5 ? "bg-coral-400" : total / max > 0.3 ? "bg-sun-400" : "bg-emerald-400"}`}
              style={{ width: `${Math.min(100, (total / Math.max(1, max)) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-600">
            {total} of {max} load points across {sorted.length} blocks.
          </p>
          <ul className="mt-4 space-y-1 text-xs text-slate-600">
            {(["calm", "low", "medium", "high"] as Load[]).map((l) => (
              <li key={l} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${LOAD_META[l].color}`}
                  />
                  {LOAD_META[l].label}
                </span>
                <span className="text-slate-500">
                  {sorted.filter((b) => b.load === l).length}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-white border border-cream-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-coral-500" />
            Suggestions
          </h3>
          {trouble.length === 0 ? (
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              No long stretches of medium/high load. Nice pacing.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
              {trouble.map((t, i) => {
                const start = sorted[t.startIndex];
                const end = sorted[t.startIndex + t.length - 1];
                return (
                  <li key={i} className="flex gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-coral-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">
                        {start.time}–{end.time}
                      </strong>{" "}
                      is {t.length} medium-or-high blocks in a row. Plan a
                      calm or low block partway through, and protect a quiet
                      buffer right after.
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-[11px] text-slate-500">
            General rule: 2–3 medium/high blocks in a row is usually fine.
            Four or more without a recovery block is asking for a hard stop.
          </p>
        </div>
      </aside>
    </div>
  );
}

function BlockRow({
  block,
  onChange,
  onRemove,
}: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
  onRemove: () => void;
}) {
  const meta = LOAD_META[block.load];
  return (
    <li
      className={`rounded-2xl border bg-cream-50/30 ring-2 ${meta.ring} border-cream-200 p-3.5 sm:p-4`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_auto] gap-3 items-start">
        <input
          type="time"
          value={block.time}
          onChange={(e) => onChange({ time: e.target.value })}
          className="w-full rounded-xl border border-cream-300 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-coral-400"
        />
        <div className="space-y-2">
          <input
            type="text"
            value={block.activity}
            onChange={(e) => onChange({ activity: e.target.value })}
            className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-coral-400"
            placeholder="Activity"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["calm", "low", "medium", "high"] as Load[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onChange({ load: l })}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${LOAD_META[l].color} ${block.load === l ? "ring-2 ring-offset-1 ring-coral-300" : "opacity-60 hover:opacity-100"}`}
              >
                {LOAD_META[l].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {TRIGGER_OPTIONS.map(({ value, label, icon: Icon }) => {
              const on = block.triggers.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    onChange({
                      triggers: on
                        ? block.triggers.filter((t) => t !== value)
                        : [...block.triggers, value],
                    })
                  }
                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition ${on ? "bg-lavender-50 border-lavender-300 text-lavender-800" : "border-cream-300 text-slate-600 hover:bg-cream-100"}`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={block.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="w-full rounded-xl border border-dashed border-cream-300 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-coral-400 placeholder:text-slate-400"
            placeholder="Notes (optional)"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove block"
          className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-cream-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
