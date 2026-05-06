import { Sparkles } from "lucide-react";
import ToolShell from "@/components/supportnest/ToolShell";
import SensoryClient from "./SensoryClient";

export const metadata = {
  title: "Sensory Day Planner | SupportNest",
  description:
    "Map out a day's sensory load by time block, identify trouble zones, and bake in pre-emptive breaks before the meltdown.",
};

export default function SensoryPlannerPage() {
  return (
    <ToolShell
      toolName="Sensory Day Planner"
      tagline="Map a day, spot the high-load stretches, and plan recovery before you need it."
      icon={Sparkles}
      accent="sun"
      privacy="Saves only in your browser (localStorage)"
      intro={
        <>
          Build a realistic timeline for the day, tag each block with its
          sensory cost and triggers, and the planner will flag stretches that
          look like meltdown bait. Useful for parents pre-planning weekends and
          for adults pacing their own week.
        </>
      }
    >
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <SensoryClient />
      </section>
    </ToolShell>
  );
}
