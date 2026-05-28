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
  Bell,
  BellOff,
  BellRing,
  Clock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Load = "calm" | "low" | "medium" | "high";

// NEW: bell state — "none" | "active" | "done"
// "none"   → reminder not set (grey bell)
// "active" → reminder set; turns red if block time has passed, purple if upcoming
// "done"   → user marked task done (green bell)
type BellState = "none" | "active" | "done";

// ─── Constants ────────────────────────────────────────────────────────────────

const LOAD_META: Record<
  Load,
  { label: string; weight: number; color: string; ring: string; dot: string }
> = {
  calm: {
    label: "Calm",
    weight: 0,
    color: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-300",
    dot: "bg-emerald-400",
  },
  low: {
    label: "Low",
    weight: 1,
    color: "bg-amber-100 text-amber-800",
    ring: "ring-amber-300",
    dot: "bg-amber-400",
  },
  medium: {
    label: "Medium",
    weight: 2,
    color: "bg-orange-100 text-orange-800",
    ring: "ring-orange-300",
    dot: "bg-orange-400",
  },
  high: {
    label: "High",
    weight: 3,
    color: "bg-rose-100 text-rose-800",
    ring: "ring-rose-300",
    dot: "bg-rose-400",
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

// ─── Block type — bell field added ────────────────────────────────────────────

type Block = {
  id: string;
  time: string;
  activity: string;
  load: Load;
  triggers: string[];
  notes: string;
  bell: BellState; // NEW
};

// ─── Storage & defaults ───────────────────────────────────────────────────────

const STORAGE_KEY = "supportnest_sensory_planner_v1";

const DEFAULT_BLOCKS: Block[] = [
  { id: rid(), time: "07:00", activity: "Wake-up routine",               load: "low",    triggers: [],                         notes: "",                                   bell: "none" },
  { id: rid(), time: "07:45", activity: "Breakfast",                     load: "low",    triggers: ["sound"],                  notes: "",                                   bell: "none" },
  { id: rid(), time: "08:15", activity: "Drop-off / commute",            load: "medium", triggers: ["transitions", "sound"],   notes: "",                                   bell: "none" },
  { id: rid(), time: "09:00", activity: "School / work morning block",   load: "medium", triggers: ["cognitive", "social"],    notes: "",                                   bell: "none" },
  { id: rid(), time: "12:00", activity: "Lunch / break",                 load: "low",    triggers: [],                         notes: "",                                   bell: "none" },
  { id: rid(), time: "13:00", activity: "School / work afternoon block", load: "medium", triggers: ["cognitive"],              notes: "",                                   bell: "none" },
  { id: rid(), time: "15:30", activity: "Pickup / transition home",      load: "high",   triggers: ["transitions", "social"],  notes: "Often the hardest part of the day.", bell: "none" },
  { id: rid(), time: "16:30", activity: "Snack + decompression",         load: "calm",   triggers: [],                         notes: "",                                   bell: "none" },
  { id: rid(), time: "17:30", activity: "Homework / errands",            load: "medium", triggers: ["cognitive", "transitions"],notes: "",                                  bell: "none" },
  { id: rid(), time: "19:00", activity: "Dinner",                        load: "low",    triggers: ["social"],                 notes: "",                                   bell: "none" },
  { id: rid(), time: "20:00", activity: "Bath / wind-down",              load: "low",    triggers: ["touch"],                  notes: "",                                   bell: "none" },
  { id: rid(), time: "21:00", activity: "Bedtime routine",               load: "calm",   triggers: [],                         notes: "",                                   bell: "none" },
];

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Bell helpers ─────────────────────────────────────────────────────────────

/** Returns the resolved visual state of a bell given the current time. */
function resolveBell(
  bell: BellState,
  blockTime: string,
  nowHHMM: string
): "green" | "red" | "purple" | "grey" {
  if (bell === "done") return "green";
  if (bell === "none") return "grey";
  // bell === "active"
  return blockTime <= nowHHMM ? "red" : "purple";
}

/** HH:MM string for right now */
function nowHHMM() {
  const d = new Date();
  return (
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0")
  );
}

/** Cycle: none → active → done → none */
function nextBell(current: BellState): BellState {
  if (current === "none") return "active";
  if (current === "active") return "done";
  return "none";
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SensoryClient() {
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS);
  const [now, setNow] = useState<string>(nowHHMM());
  const hydratedRef = useRef(false);

  // SSR-safe localStorage hydration (unchanged from original)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setBlocks(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parsed.map((b: any) => ({
              id: b.id ?? rid(),
              time: b.time ?? "09:00",
              activity: b.activity ?? "",
              load: (["calm","low","medium","high"].includes(b.load) ? b.load : "low") as Load,
              triggers: Array.isArray(b.triggers) ? b.triggers : [],
              notes: b.notes ?? "",
              bell: (["none","active","done"].includes(b.bell) ? b.bell : "none") as BellState,
            }))
          );
        }
      }
    } catch {
      // ignore
    }
    hydratedRef.current = true;
  }, []);

  // Persist to localStorage (unchanged from original)
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch {
      // localStorage may be full / disabled; fail silently
    }
  }, [blocks]);

  // NEW: tick every 60 s to refresh bell colours
  useEffect(() => {
    const id = setInterval(() => setNow(nowHHMM()), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Derived state (unchanged from original) ──────────────────────────────

  const sorted = useMemo(
    () => [...blocks].sort((a, b) => a.time.localeCompare(b.time)),
    [blocks]
  );
  const total = sorted.reduce((s, b) => s + LOAD_META[b.load].weight, 0);
  const max = sorted.length * 3;

  const trouble = useMemo(() => {
    const out: { startIndex: number; length: number }[] = [];
    let runStart = -1;
    for (let i = 0; i < sorted.length; i++) {
      const heavy =
        sorted[i].load === "medium" || sorted[i].load === "high";
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

  // ── Handlers (unchanged from original) ───────────────────────────────────

  function update(id: string, patch: Partial<Block>) {
    setBlocks((bs) =>
      bs.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
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
        bell: "none",
      },
    ]);
  }
  function reset() {
    if (
      confirm("Reset to the default day plan? Your current edits will be lost.")
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

  // NEW: toggle bell for a block
  function toggleBell(id: string) {
    setBlocks((bs) =>
      bs.map((b) =>
        b.id === id ? { ...b, bell: nextBell(b.bell) } : b
      )
    );
  }

  // ── Budget bar colour ─────────────────────────────────────────────────────

  const budgetPct = max > 0 ? Math.min(100, (total / max) * 100) : 0;
  const budgetColor =
    budgetPct > 70
      ? "bg-rose-400"
      : budgetPct > 50
      ? "bg-orange-400"
      : budgetPct > 30
      ? "bg-amber-400"
      : "bg-emerald-400";

  // ── Bell summary for sidebar ──────────────────────────────────────────────

  const bellBlocks = sorted.filter((b) => b.bell !== "none");

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* ── Timeline panel ── */}
      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Today&rsquo;s timeline
            </h2>
            {/* Live clock badge */}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {now}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={add}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add block
            </button>
            <button
              type="button"
              onClick={exportPlan}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-500 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Bell legend */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Done
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            Missed / overdue
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
            Reminder set
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />
            No reminder
          </span>
        </div>

        {/* Block list */}
        <ul className="space-y-2.5">
          {sorted.map((block, idx) => {
            const isCurrentBlock =
              block.time <= now &&
              (idx === sorted.length - 1 || sorted[idx + 1].time > now);
            return (
              <BlockRow
                key={block.id}
                block={block}
                now={now}
                isCurrent={isCurrentBlock}
                onChange={(patch) => update(block.id, patch)}
                onRemove={() => remove(block.id)}
                onBellToggle={() => toggleBell(block.id)}
              />
            );
          })}
        </ul>

        <p className="mt-5 text-[11px] text-slate-400 inline-flex items-center gap-1.5">
          <Info className="w-3 h-3" /> Saved automatically in this browser. Use
          export to share or print.
        </p>
      </div>

      {/* ── Sidebar ── */}
      <aside className="space-y-4">
        {/* Sensory budget */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Sensory budget
          </h3>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${budgetColor}`}
              style={{
                width: `${budgetPct}%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {total} of {max} load points across {sorted.length} blocks.
          </p>
          <ul className="mt-4 space-y-1.5">
            {(["calm", "low", "medium", "high"] as Load[]).map((l) => (
              <li
                key={l}
                className="flex items-center justify-between text-xs text-slate-600"
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${LOAD_META[l].dot}`}
                  />
                  {LOAD_META[l].label}
                </span>
                <span className="tabular-nums text-slate-400">
                  {sorted.filter((b) => b.load === l).length}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-rose-500" />
            Suggestions
          </h3>
          {trouble.length === 0 ? (
            <p className="text-xs text-slate-500 leading-relaxed">
              No long stretches of medium/high load. Nice pacing.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {trouble.map((t, i) => {
                const start = sorted[t.startIndex];
                const end = sorted[t.startIndex + t.length - 1];
                return (
                  <li key={i} className="flex gap-2 text-xs text-slate-700 leading-relaxed">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">
                        {start.time}–{end.time}
                      </strong>{" "}
                      is {t.length} medium-or-high blocks in a row. Insert a
                      calm or low buffer partway through.
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
            General rule: 2–3 medium/high blocks in a row is fine. Four or
            more without a recovery block is asking for a hard stop.
          </p>
        </div>

        {/* Bell reminders summary — NEW */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-violet-500" />
            Bell reminders
          </h3>
          {bellBlocks.length === 0 ? (
            <p className="text-xs text-slate-400 leading-relaxed">
              No reminders set. Tap the bell on any block to activate one.
            </p>
          ) : (
            <ul className="space-y-2">
              {bellBlocks.map((b) => {
                const vis = resolveBell(b.bell, b.time, now);
                const dotColor =
                  vis === "green"
                    ? "bg-emerald-400"
                    : vis === "red"
                    ? "bg-rose-400"
                    : "bg-violet-400";
                const label =
                  vis === "green"
                    ? "Done"
                    : vis === "red"
                    ? "Overdue"
                    : "Upcoming";
                return (
                  <li
                    key={b.id}
                    className="flex items-center gap-2.5 text-xs text-slate-600"
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`}
                    />
                    <span className="font-medium tabular-nums">{b.time}</span>
                    <span className="truncate flex-1">{b.activity}</span>
                    <span className="text-[11px] text-slate-400">{label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

// ─── BlockRow ─────────────────────────────────────────────────────────────────

function BlockRow({
  block,
  now,
  isCurrent,
  onChange,
  onRemove,
  onBellToggle,
}: {
  block: Block;
  now: string;
  isCurrent: boolean;
  onChange: (patch: Partial<Block>) => void;
  onRemove: () => void;
  onBellToggle: () => void;
}) {
  const meta = LOAD_META[block.load];
  const bellVis = resolveBell(block.bell, block.time, now);

  // Bell button appearance
  const bellConfig = {
    green: {
      cls: "bg-emerald-50 border-emerald-300 text-emerald-600 hover:bg-emerald-100",
      Icon: BellRing,
      tip: "Marked done — click to clear",
    },
    red: {
      cls: "bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100",
      Icon: BellOff,
      tip: "Overdue — click to mark done",
    },
    purple: {
      cls: "bg-violet-50 border-violet-300 text-violet-600 hover:bg-violet-100",
      Icon: Bell,
      tip: "Reminder active — click to mark done",
    },
    grey: {
      cls: "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600",
      Icon: Bell,
      tip: "No reminder — click to set one",
    },
  }[bellVis];

  // Block left-border accent by load
  const borderAccent: Record<Load, string> = {
    calm: "border-l-emerald-300",
    low: "border-l-amber-300",
    medium: "border-l-orange-300",
    high: "border-l-rose-400",
  };

  return (
    <li
      className={[
        "rounded-2xl border bg-white border-slate-100 border-l-4 p-3.5 sm:p-4 transition-all",
        borderAccent[block.load],
        isCurrent ? "ring-2 ring-violet-200 ring-offset-1" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_auto_auto] gap-3 items-start">
        {/* Time */}
        <input
          type="time"
          value={block.time}
          onChange={(e) => onChange({ time: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm font-medium text-slate-800 outline-none focus:border-rose-400 focus:bg-white transition-colors"
        />

        {/* Activity + controls */}
        <div className="space-y-2">
          <input
            type="text"
            value={block.activity}
            onChange={(e) => onChange({ activity: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-rose-400 transition-colors"
            placeholder="Activity"
          />

          {/* Load pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["calm", "low", "medium", "high"] as Load[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onChange({ load: l })}
                className={[
                  "text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-all",
                  LOAD_META[l].color,
                  block.load === l
                    ? `ring-2 ring-offset-1 ${LOAD_META[l].ring}`
                    : "opacity-50 hover:opacity-80",
                ].join(" ")}
              >
                {LOAD_META[l].label}
              </button>
            ))}
          </div>

          {/* Trigger chips */}
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
                  className={[
                    "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-all",
                    on
                      ? "bg-violet-50 border-violet-200 text-violet-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Notes */}
          <input
            type="text"
            value={block.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="w-full rounded-xl border border-dashed border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-rose-400 placeholder:text-slate-300 transition-colors"
            placeholder="Notes (optional)"
          />
        </div>

        {/* Bell button — NEW */}
        <button
          type="button"
          onClick={onBellToggle}
          title={bellConfig.tip}
          aria-label={bellConfig.tip}
          className={[
            "w-8 h-8 rounded-xl border flex items-center justify-center transition-all flex-shrink-0",
            bellConfig.cls,
          ].join(" ")}
        >
          <bellConfig.Icon className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove block"
          className="w-8 h-8 rounded-xl border border-transparent flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
