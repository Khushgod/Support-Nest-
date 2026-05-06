import Link from "next/link";
import type React from "react";
import { ChevronRight, Lock } from "lucide-react";
import Header from "@/components/supportnest/Header";
import Footer from "@/components/supportnest/Footer";

type Accent = "coral" | "sun" | "lavender" | "sky";

const ACCENTS: Record<
  Accent,
  { ring: string; chip: string; gradient: string; chipText: string }
> = {
  coral: {
    ring: "ring-coral-200",
    chip: "bg-coral-100",
    chipText: "text-coral-700",
    gradient: "from-coral-200 via-sun-200 to-cream-100",
  },
  sun: {
    ring: "ring-sun-200",
    chip: "bg-sun-100",
    chipText: "text-sun-800",
    gradient: "from-sun-200 via-cream-200 to-coral-100",
  },
  lavender: {
    ring: "ring-lavender-200",
    chip: "bg-lavender-100",
    chipText: "text-lavender-700",
    gradient: "from-lavender-200 via-coral-100 to-cream-100",
  },
  sky: {
    ring: "ring-sky-200",
    chip: "bg-sky-100",
    chipText: "text-sky-700",
    gradient: "from-sky-200 via-lavender-100 to-cream-100",
  },
};

export default function ToolShell({
  toolName,
  tagline,
  icon: Icon,
  accent = "coral",
  privacy,
  children,
  intro,
}: {
  toolName: string;
  tagline: string;
  icon: React.ElementType;
  accent?: Accent;
  privacy: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      <Header />
      <main className="flex-1">
        <section className="relative border-b border-cream-200 bg-white overflow-hidden">
          <div
            className={`absolute -top-16 -right-16 w-72 h-72 rounded-full bg-gradient-to-br ${a.gradient} blur-3xl opacity-60 pointer-events-none`}
            aria-hidden
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-slate-500 mb-4"
            >
              <Link href="/tools" className="hover:text-coral-600">
                Tools
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-700 font-medium">{toolName}</span>
            </nav>
            <div className="flex items-start gap-4">
              <span
                className={`inline-flex w-12 h-12 rounded-2xl bg-white shadow-sm border border-cream-200 ring-2 ${a.ring} items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-6 h-6 text-coral-500" />
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {toolName}
                </h1>
                <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {tagline}
                </p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${a.chip} ${a.chipText}`}
                  >
                    <Lock className="w-3 h-3" />
                    {privacy}
                  </span>
                </div>
                {intro && (
                  <div className="mt-4 text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {intro}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {children}
      </main>
      <Footer />
    </div>
  );
}
