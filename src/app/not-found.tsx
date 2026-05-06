import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Page not found | GeneTranslate",
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-7xl sm:text-8xl font-bold text-sky-600 tracking-tight">
            404
          </p>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            We couldn&rsquo;t find that page
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            The link may be stale or mistyped. Let&rsquo;s get you somewhere
            useful.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-sage-50 border border-sage-200 text-slate-700 text-sm font-semibold transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors"
            >
              Analyze a report
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
