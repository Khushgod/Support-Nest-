import { ListChecks } from "lucide-react";
import ToolShell from "@/components/supportnest/ToolShell";
import IepClient from "./IepClient";

export const metadata = {
  title: "IEP / 504 Companion | SupportNest",
  description:
    "Walk into your IEP or 504 meeting prepared. Pick strengths, challenge areas, accommodations, and talking points; export a printable one-pager.",
};

export default function IepCompanionPage() {
  return (
    <ToolShell
      toolName="IEP / 504 Companion"
      tagline="Walk into the meeting with a one-page brief that says exactly what you want to say."
      icon={ListChecks}
      accent="lavender"
      privacy="Saves only in your browser (localStorage)"
      intro={
        <>
          The hardest part of an IEP/504 meeting is hearing yourself in the
          room. This walkthrough turns your kid&rsquo;s strengths, challenge
          areas, the accommodations you want to ask for, and your concerns
          into a tidy one-pager you can hand out, email, or print.
          Educational content &mdash; not legal advice.
        </>
      }
    >
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <IepClient />
      </section>
    </ToolShell>
  );
}
