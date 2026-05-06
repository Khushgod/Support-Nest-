import { Languages } from "lucide-react";
import ToolShell from "@/components/supportnest/ToolShell";
import PlainLanguageClient from "./PlainLanguageClient";

export const metadata = {
  title: "Plain-Language Translator | SupportNest",
  description:
    "Paste a clinical letter, school evaluation, or insurance letter and get a friendlier, jargon-free version. Local-first — your text never leaves your machine.",
};

export default function PlainLanguagePage() {
  return (
    <ToolShell
      toolName="Plain-Language Translator"
      tagline="Decode medical, legal, school, and insurance jargon into something you can actually act on."
      icon={Languages}
      accent="lavender"
      privacy="Local-first · runs on your machine via Ollama"
      intro={
        <>
          Paste a clinical letter, IEP draft, evaluation report, or insurance
          denial. Pick how you want it rewritten. The model runs locally, so
          nothing you paste here is sent to a cloud LLM &mdash; the text stays
          on your machine and is discarded when this page closes.
        </>
      }
    >
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <PlainLanguageClient />
      </section>
    </ToolShell>
  );
}
