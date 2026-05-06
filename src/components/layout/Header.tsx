"use client";

import Link from "next/link";
import { Dna } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-sage-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center group-hover:bg-sky-700 transition-colors">
            <Dna className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900 tracking-tight">
            Gene<span className="text-sky-600">Translate</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <Link
            href="/"
            className="text-slate-600 hover:text-sky-700 transition-colors font-medium hidden sm:block"
          >
            Upload Report
          </Link>
          <Link
            href="/manual-input"
            className="text-slate-600 hover:text-sky-700 transition-colors font-medium"
          >
            Manual Entry
          </Link>
        </nav>
      </div>
    </header>
  );
}
