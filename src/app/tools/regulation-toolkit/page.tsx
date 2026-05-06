import { HeartPulse } from "lucide-react";
import ToolShell from "@/components/supportnest/ToolShell";
import RegulationClient from "./RegulationClient";

export const metadata = {
  title: "Regulation Toolkit | SupportNest",
  description:
    "Quick, evidence-informed regulation strategies tailored to how you're feeling right now — plus a built-in box-breathing companion.",
};

export default function RegulationToolkitPage() {
  return (
    <ToolShell
      toolName="Regulation Toolkit"
      tagline="Three quick questions, then a tailored set of regulation strategies for what you're feeling right now."
      icon={HeartPulse}
      accent="coral"
      privacy="Runs entirely in your browser"
      intro={
        <>
          This isn&rsquo;t therapy and it isn&rsquo;t triage. It&rsquo;s a
          gentle nudge toward an evidence-informed practice that fits the
          state your nervous system is actually in &mdash; pulled from
          polyvagal-informed and trauma-informed frameworks.
        </>
      }
    >
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <RegulationClient />
      </section>
    </ToolShell>
  );
}
