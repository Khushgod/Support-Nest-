import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import Shell from "@/components/supportnest/Shell";

export const metadata = {
  title: "Page not found | SupportNest",
};

export default function NotFound() {
  return (
    <Shell>
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-7xl sm:text-8xl font-bold text-coral-500 tracking-tight">
          404
        </p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          That page hasn&rsquo;t hatched yet
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          The link may be stale or mistyped. Let&rsquo;s get you somewhere
          warmer.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-800 text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
          >
            Visit the community
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Shell>
  );
}
