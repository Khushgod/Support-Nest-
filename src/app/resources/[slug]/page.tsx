import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/supportnest/Shell";
import {
  ARTICLES,
  getArticle,
  COLLECTION_META,
  type Block,
} from "../_content";
import ArticleActions from "./ArticleActions";

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Resource | SupportNest" };
  return { title: `${a.title} | SupportNest`, description: a.dek };
}

const FORMAT_STYLES: Record<string, string> = {
  Article: "bg-coral-100 text-coral-700",
  Script: "bg-lavender-100 text-lavender-700",
  Checklist: "bg-sun-100 text-sun-700",
  "Reading list": "bg-white border border-cream-200 text-slate-700",
};

function BlockView({ block }: { block: Block }) {
  switch (block.k) {
    case "p":
      return (
        <p className="text-[15px] leading-relaxed text-slate-700">{block.t}</p>
      );
    case "h":
      return (
        <h2 className="text-lg font-semibold text-slate-900 mt-2">{block.t}</h2>
      );
    case "ul":
      return (
        <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-slate-700 marker:text-coral-400">
          {block.i.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal pl-5 space-y-1.5 text-[15px] text-slate-700 marker:text-slate-400">
          {block.i.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-coral-200 bg-cream-50/60 rounded-r-xl px-4 py-3 text-[15px] italic text-slate-700">
          {block.t}
        </blockquote>
      );
    case "note":
      return (
        <div className="rounded-2xl border border-cream-200 bg-cream-50/60 px-4 py-3 text-sm text-slate-700">
          {block.t}
        </div>
      );
  }
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const collection = COLLECTION_META[article.coll];
  const readMinutes = article.minutes;

  return (
    <Shell>
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-500 mb-4"
          >
            <Link href="/resources" className="hover:text-coral-600">
              Resources
            </Link>
            <span aria-hidden>›</span>
            <Link href={collection.href} className="hover:text-coral-600">
              {collection.label}
            </Link>
          </nav>

          <article className="rounded-3xl border border-cream-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  FORMAT_STYLES[article.format] ?? "bg-cream-200 text-slate-700"
                }`}
              >
                {article.format}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-coral-50 text-coral-700">
                {article.audience}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">
              {article.dek}
            </p>

            <header className="mt-5 flex items-center gap-3 flex-wrap text-xs text-slate-500">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-300 to-lavender-300" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    SupportNest Editorial
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Reviewed by people in this role
                  </div>
                </div>
              </div>
              <span aria-hidden>·</span>
              <span>{readMinutes} min read</span>
            </header>

            <div className="mt-7 space-y-4 border-t border-cream-100 pt-6">
              {article.body.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>

            <ArticleActions title={article.title} />
          </article>

          <div className="mt-8 rounded-2xl border border-cream-200 bg-white p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              A note on how to use this
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              This is a plain-language explainer written and reviewed by the
              SupportNest community. It&rsquo;s educational, not medical or legal
              advice — bring decisions to a qualified professional. Found
              something that&rsquo;s out of date or could be kinder?{" "}
              <Link
                href="/community"
                className="font-medium text-coral-600 hover:text-coral-700"
              >
                Tell us in the forum.
              </Link>
            </p>
            <div className="mt-4">
              <Link
                href={collection.href}
                className="text-sm font-medium text-coral-600 hover:text-coral-700"
              >
                ← Back to {collection.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
