"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Wind,
  Hand,
  Snowflake,
  Footprints,
  Music2,
  Eye,
  Users2,
  Brain,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  HeartPulse,
} from "lucide-react";

type Energy = "low" | "medium" | "high";
type Body =
  | "numb"
  | "shutdown"
  | "tense"
  | "restless"
  | "panicky"
  | "heavy"
  | "floaty"
  | "fine";
type Need = "ground" | "soothe" | "move" | "rest" | "connect" | "focus";

type State = {
  energy: Energy | null;
  body: Body | null;
  need: Need | null;
};

const BODY_OPTIONS: { value: Body; label: string }[] = [
  { value: "panicky", label: "Panicky / racing" },
  { value: "tense", label: "Tense / wound up" },
  { value: "restless", label: "Restless / fidgety" },
  { value: "fine", label: "Mostly fine" },
  { value: "floaty", label: "Floaty / unreal" },
  { value: "heavy", label: "Heavy / tired" },
  { value: "numb", label: "Numb / blank" },
  { value: "shutdown", label: "Shut down / frozen" },
];

const NEED_OPTIONS: { value: Need; label: string; icon: React.ElementType }[] =
  [
    { value: "ground", label: "Ground", icon: Hand },
    { value: "soothe", label: "Soothe", icon: HeartPulse },
    { value: "move", label: "Move", icon: Footprints },
    { value: "rest", label: "Rest", icon: Pause },
    { value: "connect", label: "Connect", icon: Users2 },
    { value: "focus", label: "Focus", icon: Brain },
  ];

type ZoneKey = "hyper" | "window" | "hypo";

const ZONES: Record<
  ZoneKey,
  { label: string; description: string; chip: string }
> = {
  hyper: {
    label: "Up-shifted (sympathetic)",
    description:
      "Your nervous system is in mobilize mode. The goal is to gently bring the gas pedal off the floor — not to force calm, just to add a little brake.",
    chip: "bg-coral-100 text-coral-800",
  },
  window: {
    label: "In your window of tolerance",
    description:
      "You're regulated enough to use cognitive tools. This is a great moment to plan, set a small goal, or co-regulate with someone.",
    chip: "bg-sun-100 text-sun-800",
  },
  hypo: {
    label: "Down-shifted (dorsal)",
    description:
      "Your system has flipped to conserve mode. The goal isn't to push through — it's to invite a little aliveness back, slowly and safely.",
    chip: "bg-lavender-100 text-lavender-800",
  },
};

type Tool = {
  title: string;
  zones: ZoneKey[];
  needs: Need[];
  duration: string;
  icon: React.ElementType;
  steps: string[];
};

const TOOLS: Tool[] = [
  {
    title: "5-4-3-2-1 grounding",
    zones: ["hyper", "window"],
    needs: ["ground", "focus"],
    duration: "2–3 min",
    icon: Hand,
    steps: [
      "Notice 5 things you can see — colors, shapes, edges.",
      "Notice 4 things you can feel — your feet, the chair, fabric, air.",
      "Notice 3 things you can hear — near, middle distance, far away.",
      "Notice 2 things you can smell, or 2 scents you'd like.",
      "Notice 1 thing you can taste, or one you'd like next.",
    ],
  },
  {
    title: "Box breathing (built-in)",
    zones: ["hyper", "window"],
    needs: ["ground", "soothe", "focus"],
    duration: "3–5 min",
    icon: Wind,
    steps: [
      "Use the box-breath companion below.",
      "Inhale 4, hold 4, exhale 4, hold 4 — repeat for 8 cycles.",
      "If holds feel hard, drop them. Slow exhale alone counts.",
    ],
  },
  {
    title: "Cold sensory reset",
    zones: ["hyper"],
    needs: ["ground"],
    duration: "30–60 sec",
    icon: Snowflake,
    steps: [
      "Hold an ice cube in one hand for 30 seconds, or splash cold water on your face.",
      "Cup ice water and exhale into it for a long, slow breath.",
      "Activates the mammalian dive reflex; useful for acute panic.",
    ],
  },
  {
    title: "Brisk movement, then settle",
    zones: ["hyper", "hypo"],
    needs: ["move"],
    duration: "5–10 min",
    icon: Footprints,
    steps: [
      "Walk briskly for 3 minutes (stairs, hallway, around the block).",
      "Slow your pace gradually for the last minute.",
      "End with three slow exhales, longer than your inhales.",
    ],
  },
  {
    title: "Bilateral self-soothe (butterfly hug)",
    zones: ["hyper", "hypo"],
    needs: ["soothe"],
    duration: "2–4 min",
    icon: HeartPulse,
    steps: [
      "Cross your arms over your chest, hands resting on opposite shoulders.",
      "Tap left, right, left, right — slow and even, for 1–2 minutes.",
      "Pair with a long exhale on every other tap.",
    ],
  },
  {
    title: "Co-regulation check-in",
    zones: ["window", "hypo"],
    needs: ["connect"],
    duration: "5 min",
    icon: Users2,
    steps: [
      "Text or call one safe person. You don't have to talk about the hard thing.",
      "Try: 'I'm low-bandwidth today. Could we just be in the same room / on the line for a bit?'",
      "Co-regulation works through tone of voice and presence, not problem-solving.",
    ],
  },
  {
    title: "Orienting (look-around)",
    zones: ["hyper", "hypo"],
    needs: ["ground"],
    duration: "1–2 min",
    icon: Eye,
    steps: [
      "Slowly turn your head left, right, up, down — let your eyes lead.",
      "Name three things in the room out loud.",
      "Reminds the brain you're here, now, and the environment is the current one.",
    ],
  },
  {
    title: "Music with a slowing tempo",
    zones: ["hyper", "hypo"],
    needs: ["soothe", "move", "focus"],
    duration: "5–10 min",
    icon: Music2,
    steps: [
      "Pick a familiar song that matches your current energy.",
      "After it ends, queue one slightly slower song.",
      "Then one slower again. Step the tempo down toward where you want to be.",
    ],
  },
  {
    title: "Gentle activation (hypoarousal)",
    zones: ["hypo"],
    needs: ["move", "rest"],
    duration: "3–5 min",
    icon: Sparkles,
    steps: [
      "Stand up slowly. Wiggle fingers and toes for 30 seconds.",
      "Press feet firmly into the floor. Push palms into a wall.",
      "Hum or sigh on the exhale — vocal cords stimulate the vagus nerve.",
    ],
  },
  {
    title: "Permission to rest",
    zones: ["hypo", "window"],
    needs: ["rest"],
    duration: "10+ min",
    icon: Pause,
    steps: [
      "If you're shut down, the answer is sometimes just rest. That counts.",
      "Set a 20-minute timer. Lie down. No productivity required.",
      "When the timer ends, reassess. Don't push past what your body says.",
    ],
  },
];

function pickZone(state: State): ZoneKey {
  if (
    state.energy === "high" ||
    state.body === "panicky" ||
    state.body === "tense" ||
    state.body === "restless"
  ) {
    return "hyper";
  }
  if (
    state.energy === "low" ||
    state.body === "numb" ||
    state.body === "shutdown" ||
    state.body === "heavy" ||
    state.body === "floaty"
  ) {
    return "hypo";
  }
  return "window";
}

function pickTools(state: State): Tool[] {
  const zone = pickZone(state);
  const matches = TOOLS.filter((t) => t.zones.includes(zone));
  const ranked = matches
    .map((t) => ({
      tool: t,
      score:
        (state.need && t.needs.includes(state.need) ? 2 : 0) +
        (zone === "hyper" && t.title.includes("Cold") ? 1 : 0) +
        (zone === "hypo" && t.title.includes("Gentle") ? 1 : 0) +
        (state.need === "rest" && t.title.includes("rest") ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map((r) => r.tool);
  return ranked.slice(0, 5);
}

export default function RegulationClient() {
  const [tab, setTab] = useState<"now" | "tools" | "breathe">("now");

  return (
    <div>
      <div className="inline-flex p-1 rounded-2xl bg-cream-100 border border-cream-200 mb-6">
        {(
          [
            { id: "now", label: "Right now" },
            { id: "tools", label: "All tools" },
            { id: "breathe", label: "Box breathing" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${tab === t.id ? "bg-white shadow-sm text-coral-700" : "text-slate-600 hover:text-coral-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "now" && <RightNow />}
      {tab === "tools" && <ToolGallery />}
      {tab === "breathe" && <BoxBreathing />}
    </div>
  );
}

function RightNow() {
  const [state, setState] = useState<State>({
    energy: null,
    body: null,
    need: null,
  });

  const ready = state.energy && state.body && state.need;
  const zone = ready ? pickZone(state) : null;
  const picks = ready ? pickTools(state) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
      <div className="rounded-3xl bg-white border border-cream-200 p-6 sm:p-7 space-y-5">
        <Question label="Where's your energy?">
          <ChipRow
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            selected={state.energy}
            onSelect={(v) => setState({ ...state, energy: v as Energy })}
          />
        </Question>

        <Question label="What does your body feel like?">
          <div className="grid grid-cols-2 gap-2">
            {BODY_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setState({ ...state, body: o.value })}
                className={`text-left rounded-2xl border px-3.5 py-2 text-sm transition ${state.body === o.value ? "border-coral-400 bg-coral-50/60" : "border-cream-200 hover:bg-cream-50"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Question>

        <Question label="What do you need most?">
          <div className="grid grid-cols-3 gap-2">
            {NEED_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setState({ ...state, need: value })}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 transition ${state.need === value ? "border-coral-400 bg-coral-50/60" : "border-cream-200 hover:bg-cream-50"}`}
              >
                <Icon className="w-4 h-4 text-coral-500" />
                <span className="text-xs font-medium text-slate-700">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </Question>

        {ready && (
          <button
            type="button"
            onClick={() => setState({ energy: null, body: null, need: null })}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-coral-600"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="rounded-3xl bg-white border border-cream-200 p-6 sm:p-7">
        {!ready && (
          <div className="text-center py-10 text-sm text-slate-500">
            Answer the three on the left and your tailored set of tools will
            appear here.
          </div>
        )}
        {ready && zone && (
          <>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${ZONES[zone].chip}`}
            >
              {ZONES[zone].label}
            </span>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              {ZONES[zone].description}
            </p>
            <ul className="mt-5 space-y-3">
              {picks.map((t) => (
                <ToolCard key={t.title} tool={t} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function ToolGallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {TOOLS.map((t) => (
        <ToolCard key={t.title} tool={t} />
      ))}
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const [open, setOpen] = useState(false);
  const Icon = tool.icon;
  return (
    <li className="rounded-2xl border border-cream-200 bg-cream-50/30 p-4 list-none">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start gap-3"
      >
        <span className="inline-flex w-9 h-9 rounded-xl bg-white border border-cream-200 items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-coral-500" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              {tool.title}
            </h3>
            <span className="text-[11px] text-slate-500">{tool.duration}</span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Tap to {open ? "hide" : "see"} the steps.
          </p>
        </div>
      </button>
      {open && (
        <ol className="mt-3 ml-12 list-decimal space-y-1 text-sm text-slate-700">
          {tool.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      )}
    </li>
  );
}

function Question({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function ChipRow({
  options,
  selected,
  onSelect,
}: {
  options: { value: string; label: string }[];
  selected: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          className={`px-4 py-1.5 rounded-full border text-sm transition ${selected === o.value ? "border-coral-400 bg-coral-50 text-coral-700" : "border-cream-300 text-slate-700 hover:bg-cream-50"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// 4-4-4-4 box breathing companion.
function BoxBreathing() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">(
    "inhale"
  );
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const labels = useMemo(
    () => ({
      inhale: "Breathe in",
      hold1: "Hold",
      exhale: "Breathe out",
      hold2: "Hold",
    }),
    []
  );
  const order: Array<"inhale" | "hold1" | "exhale" | "hold2"> = useMemo(
    () => ["inhale", "hold1", "exhale", "hold2"],
    []
  );

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // advance phase
        setPhase((p) => {
          const idx = order.indexOf(p);
          const next = order[(idx + 1) % order.length];
          if (next === "inhale") setCycle((c) => c + 1);
          return next;
        });
        return 4;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running, order]);

  function reset() {
    setRunning(false);
    setPhase("inhale");
    setSecondsLeft(4);
    setCycle(0);
    if (tickRef.current) clearInterval(tickRef.current);
  }

  // Visual scale: inhale grows, hold stays, exhale shrinks, hold stays small.
  const scale =
    phase === "inhale"
      ? 1 + (4 - secondsLeft) * 0.12
      : phase === "hold1"
        ? 1.48
        : phase === "exhale"
          ? 1.48 - (4 - secondsLeft) * 0.12
          : 1;

  return (
    <div className="rounded-3xl bg-white border border-cream-200 p-8 sm:p-12 text-center">
      <div className="relative mx-auto w-72 h-72 flex items-center justify-center">
        <div
          className="absolute inset-0 m-auto w-40 h-40 rounded-3xl bg-gradient-to-br from-coral-200 via-sun-200 to-lavender-200 opacity-70 transition-transform duration-1000"
          style={{ transform: `scale(${scale})` }}
          aria-hidden
        />
        <div className="absolute inset-0 m-auto w-40 h-40 rounded-3xl border-2 border-coral-300/60" aria-hidden />
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
            {labels[phase]}
          </div>
          <div className="text-5xl font-bold text-slate-900 tabular-nums">
            {secondsLeft}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? "Pause" : cycle === 0 ? "Start" : "Resume"}
        </button>
        {(running || cycle > 0) && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-coral-600"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Cycle {cycle} of 8 (recommended). 4 seconds each: in → hold → out →
        hold.
      </p>
      <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto">
        If holding feels uncomfortable, just inhale for 4 and exhale for 6.
        Lengthening the exhale alone is enough to engage your parasympathetic
        system.
      </p>
    </div>
  );
}
