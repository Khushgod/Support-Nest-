import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, PlusCircle, Search } from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import ThreadCard from "@/components/forum/ThreadCard";
import { TagChip } from "@/components/forum/AudienceChips";
import { getCurrentUser } from "@/lib/auth/dal";
import {
  bookmarksForUser,
  listThreads,
  listTrendingTags,
} from "@/lib/forum/store";
import {
  AUDIENCE_LABELS,
  CONTENT_NOTE_LABELS,
  SPACE_BY_ID,
  SPACES,
  type AudienceTag,
  type ContentNote,
  type SpaceId,
} from "@/lib/forum/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type SortKey = "latest" | "newest" | "most-replies" | "most-reactions";
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "latest", label: "Latest activity" },
  { value: "newest", label: "Newest" },
  { value: "most-replies", label: "Most replies" },
  { value: "most-reactions", label: "Most reacted" },
];

function asSort(v: string | undefined): SortKey {
  return v === "newest" || v === "most-replies" || v === "most-reactions"
    ? v
    : "latest";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ space: string }>;
}) {
  const { space } = await params;
  const meta = SPACE_BY_ID[space as SpaceId];
  if (!meta) return { title: "Community | SupportNest" };
  return {
    title: `${meta.name} | SupportNest community`,
    description: meta.blurb,
  };
}

export default async function SpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ space: string }>;
  searchParams: Promise<{
    sort?: string;
    audience?: string;
    cn?: string;
    tag?: string;
    page?: string;
  }>;
}) {
  const { space } = await params;
  const sp = await searchParams;
  const meta = SPACE_BY_ID[space as SpaceId];
  if (!meta) notFound();

  const sort = asSort(sp.sort);
  const audience =
    sp.audience && (["parents", "teachers", "nd_adults", "everyone"].includes(sp.audience))
      ? (sp.audience as AudienceTag)
      : undefined;
  const cn =
    sp.cn &&
    [
      "burnout",
      "diagnosis",
      "meltdown",
      "school-stress",
      "medical",
      "grief",
      "anxiety",
    ].includes(sp.cn)
      ? (sp.cn as ContentNote)
      : undefined;
  const tag = sp.tag?.trim() || undefined;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const user = await getCurrentUser();
  const [list, trending] = await Promise.all([
    listThreads({
      spaceId: meta.id,
      audience,
      contentNote: cn,
      tag,
      sort,
      limit: PAGE_SIZE,
      offset,
    }),
    listTrendingTags(8),
  ]);
  const userBookmarks = user
    ? new Set((await bookmarksForUser(user.id)).map((b) => b.threadId))
    : new Set<string>();

  const totalPages = Math.max(1, Math.ceil(list.total / PAGE_SIZE));
  const baseHref = (override: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    if (sort !== "latest" && override.sort === undefined) next.set("sort", sort);
    if (override.sort) next.set("sort", override.sort);
    if (audience && override.audience === undefined) next.set("audience", audience);
    if (override.audience) next.set("audience", override.audience);
    if (cn && override.cn === undefined) next.set("cn", cn);
    if (override.cn) next.set("cn", override.cn);
    if (tag && override.tag === undefined) next.set("tag", tag);
    if (override.tag) next.set("tag", override.tag);
    if (override.page) next.set("page", override.page);
    const qs = next.toString();
    return qs ? `?${qs}` : "?";
  };

  return (
    <Shell>
      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link
              href="/community"
              className="inline-flex items-center gap-1 hover:text-coral-600"
            >
              <ChevronLeft className="w-3 h-3" />
              All spaces
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-cream-200 bg-white p-7">
            <div
              className={`absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br ${meta.accent} blur-2xl opacity-60`}
              aria-hidden
            />
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {meta.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                {meta.blurb}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {meta.audience.map((a) => (
                  <span
                    key={a}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-cream-100 text-slate-700"
                  >
                    For {AUDIENCE_LABELS[a]}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 flex-wrap">
                <Link
                  href={`/community/new?space=${meta.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  New thread in this space
                </Link>
                <Link
                  href={`/community/search?space=${meta.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-cream-50 border border-cream-200 text-slate-700 text-sm font-semibold transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search this space
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
          <div>
            {/* Filter strip */}
            <form
              action={`/community/${meta.id}`}
              method="get"
              className="mb-5 rounded-2xl border border-cream-200 bg-white p-4"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Sort
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    defaultValue={sort}
                    className="rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-sm"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="audience"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Audience
                  </label>
                  <select
                    id="audience"
                    name="audience"
                    defaultValue={audience ?? ""}
                    className="rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-sm"
                  >
                    <option value="">Any</option>
                    {(
                      ["parents", "teachers", "nd_adults", "everyone"] as AudienceTag[]
                    ).map((a) => (
                      <option key={a} value={a}>
                        {AUDIENCE_LABELS[a]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="cn"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Content note
                  </label>
                  <select
                    id="cn"
                    name="cn"
                    defaultValue={cn ?? ""}
                    className="rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-sm"
                  >
                    <option value="">Any</option>
                    {Object.entries(CONTENT_NOTE_LABELS).map(([v, label]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[160px]">
                  <label
                    htmlFor="tag"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Tag
                  </label>
                  <input
                    id="tag"
                    name="tag"
                    type="text"
                    defaultValue={tag ?? ""}
                    placeholder="e.g., diagnosis"
                    className="flex-1 rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold"
                >
                  Apply
                </button>
                {(audience || cn || tag || sort !== "latest") && (
                  <Link
                    href={`/community/${meta.id}`}
                    className="text-xs font-medium text-slate-500 hover:text-coral-600"
                  >
                    Clear
                  </Link>
                )}
              </div>
            </form>

            {list.items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-10 text-center">
                <p className="text-sm text-slate-600">
                  No threads match those filters yet.
                </p>
                <Link
                  href={`/community/new?space=${meta.id}`}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coral-500 text-white text-sm font-semibold"
                >
                  Be the first to post →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {list.items.map((t) => (
                  <ThreadCard
                    key={t.id}
                    thread={t}
                    bookmarked={userBookmarks.has(t.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-7 flex items-center justify-between"
              >
                <span className="text-xs text-slate-500">
                  Page {page} of {totalPages} · {list.total.toLocaleString()}{" "}
                  thread{list.total === 1 ? "" : "s"}
                </span>
                <div className="flex items-center gap-1.5">
                  {page > 1 && (
                    <Link
                      href={`/community/${meta.id}${baseHref({ page: String(page - 1) })}`}
                      className="px-3 py-1.5 rounded-lg border border-cream-200 hover:bg-cream-50 text-xs font-medium text-slate-700"
                    >
                      ← Newer
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/community/${meta.id}${baseHref({ page: String(page + 1) })}`}
                      className="px-3 py-1.5 rounded-lg border border-cream-200 hover:bg-cream-50 text-xs font-medium text-slate-700"
                    >
                      Older →
                    </Link>
                  )}
                </div>
              </nav>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-3xl bg-white border border-cream-200 p-5">
              <h2 className="text-sm font-semibold text-slate-900">
                Other spaces
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm">
                {SPACES.filter((s) => s.id !== meta.id).map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/community/${s.id}`}
                      className="text-slate-700 hover:text-coral-600"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {trending.length > 0 && (
              <div className="rounded-3xl bg-white border border-cream-200 p-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Trending tags
                </h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {trending.map((t) => (
                    <TagChip
                      key={t.tag}
                      tag={t.tag}
                      href={`/community/${meta.id}?tag=${encodeURIComponent(t.tag)}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </Shell>
  );
}
