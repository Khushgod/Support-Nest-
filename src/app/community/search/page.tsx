import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
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
  SPACES,
  type AudienceTag,
  type ContentNote,
  type SpaceId,
} from "@/lib/forum/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search | SupportNest community",
  description:
    "Full-text search across the SupportNest community forum, with audience, content-note, tag, and space filters.",
};

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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    space?: string;
    audience?: string;
    cn?: string;
    tag?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const spaceId =
    sp.space && SPACES.some((s) => s.id === sp.space)
      ? (sp.space as SpaceId)
      : undefined;
  const audience =
    sp.audience &&
    ["parents", "teachers", "nd_adults", "everyone"].includes(sp.audience)
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
  const sort = asSort(sp.sort);
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const user = await getCurrentUser();
  const hasAnyFilter = !!(q || spaceId || audience || cn || tag);

  const [list, trending, userBookmarks] = await Promise.all([
    hasAnyFilter
      ? listThreads({
          q,
          spaceId,
          audience,
          contentNote: cn,
          tag,
          sort,
          limit: PAGE_SIZE,
          offset,
        })
      : Promise.resolve({ items: [], total: 0 }),
    listTrendingTags(12),
    user
      ? bookmarksForUser(user.id).then(
          (bs) => new Set(bs.map((b) => b.threadId))
        )
      : Promise.resolve(new Set<string>()),
  ]);

  const totalPages = Math.max(1, Math.ceil(list.total / PAGE_SIZE));
  const baseHref = (override: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const set = (k: string, v: string | undefined) => {
      if (v) next.set(k, v);
    };
    set("q", override.q ?? q);
    set("space", override.space ?? spaceId);
    set("audience", override.audience ?? audience);
    set("cn", override.cn ?? cn);
    set("tag", override.tag ?? tag);
    if (override.sort) {
      next.set("sort", override.sort);
    } else if (sort !== "latest") {
      next.set("sort", sort);
    }
    if (override.page) next.set("page", override.page);
    const qs = next.toString();
    return qs ? `?${qs}` : "?";
  };

  const activeFilters: { label: string; href: string }[] = [];
  if (q) activeFilters.push({ label: `“${q}”`, href: `/community/search${baseHref({ q: "" })}` });
  if (spaceId)
    activeFilters.push({
      label: `Space: ${SPACES.find((s) => s.id === spaceId)?.name}`,
      href: `/community/search${baseHref({ space: "" })}`,
    });
  if (audience)
    activeFilters.push({
      label: `For ${AUDIENCE_LABELS[audience]}`,
      href: `/community/search${baseHref({ audience: "" })}`,
    });
  if (cn)
    activeFilters.push({
      label: `CN: ${CONTENT_NOTE_LABELS[cn]}`,
      href: `/community/search${baseHref({ cn: "" })}`,
    });
  if (tag)
    activeFilters.push({
      label: `#${tag}`,
      href: `/community/search${baseHref({ tag: "" })}`,
    });

  return (
    <Shell>
      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-coral-600 mb-3"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to community
          </Link>

          <div className="rounded-3xl border border-cream-200 bg-white p-6 sm:p-7">
            <div className="flex items-center gap-2 text-coral-600 mb-2">
              <Search className="w-4 h-4" />
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Search the community
              </h1>
            </div>
            <p className="text-sm text-slate-600">
              Searches the title, body, and tags of every thread.
            </p>

            <form
              action="/community/search"
              method="get"
              className="mt-5 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3"
            >
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="What are you looking for?"
                className="rounded-xl border border-cream-300 bg-cream-50/40 px-3.5 py-2.5 text-sm outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200/60"
              />
              <select
                name="space"
                defaultValue={spaceId ?? ""}
                className="rounded-xl border border-cream-300 bg-white px-3 py-2.5 text-sm"
                aria-label="Space"
              >
                <option value="">Any space</option>
                {SPACES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                name="audience"
                defaultValue={audience ?? ""}
                className="rounded-xl border border-cream-300 bg-white px-3 py-2.5 text-sm"
                aria-label="Audience"
              >
                <option value="">Any audience</option>
                {(
                  ["parents", "teachers", "nd_adults", "everyone"] as AudienceTag[]
                ).map((a) => (
                  <option key={a} value={a}>
                    {AUDIENCE_LABELS[a]}
                  </option>
                ))}
              </select>
              <select
                name="cn"
                defaultValue={cn ?? ""}
                className="rounded-xl border border-cream-300 bg-white px-3 py-2.5 text-sm"
                aria-label="Content note"
              >
                <option value="">Any content note</option>
                {Object.entries(CONTENT_NOTE_LABELS).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold"
              >
                Search
              </button>
              <input type="hidden" name="sort" value={sort} />
              {tag && <input type="hidden" name="tag" value={tag} />}
            </form>

            {activeFilters.length > 0 && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Filters:
                </span>
                {activeFilters.map((f) => (
                  <Link
                    key={f.label}
                    href={f.href}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-coral-50 text-coral-700 border border-coral-200 hover:bg-coral-100"
                  >
                    {f.label}
                    <span className="text-coral-500" aria-hidden>
                      ×
                    </span>
                  </Link>
                ))}
                <Link
                  href="/community/search"
                  className="text-[11px] font-medium text-slate-500 hover:text-coral-600 ml-1"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
          <div>
            {hasAnyFilter && (
              <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-slate-600">
                  {list.total === 0 ? (
                    <>No matches found.</>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-900">
                        {list.total.toLocaleString()}
                      </span>{" "}
                      thread{list.total === 1 ? "" : "s"} matched.
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="search-sort"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Sort
                  </label>
                  <form
                    action="/community/search"
                    method="get"
                    className="contents"
                  >
                    {q && <input type="hidden" name="q" value={q} />}
                    {spaceId && (
                      <input type="hidden" name="space" value={spaceId} />
                    )}
                    {audience && (
                      <input type="hidden" name="audience" value={audience} />
                    )}
                    {cn && <input type="hidden" name="cn" value={cn} />}
                    {tag && <input type="hidden" name="tag" value={tag} />}
                    <select
                      id="search-sort"
                      name="sort"
                      defaultValue={sort}
                      onChange={(e) => e.currentTarget.form?.submit()}
                      className="rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-sm"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </form>
                </div>
              </div>
            )}

            {!hasAnyFilter && (
              <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-10 text-center">
                <Search className="w-7 h-7 mx-auto text-coral-500" />
                <p className="mt-3 text-sm text-slate-600">
                  Type something to search, or pick a tag from the side.
                </p>
              </div>
            )}

            {hasAnyFilter && list.items.length === 0 && (
              <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-10 text-center">
                <p className="text-sm text-slate-600">
                  No threads match these filters yet. Try a broader search or{" "}
                  <Link href="/community/new" className="text-coral-600 hover:underline">
                    start a thread
                  </Link>
                  .
                </p>
              </div>
            )}

            {list.items.length > 0 && (
              <div className="space-y-4">
                {list.items.map((t) => (
                  <ThreadCard
                    key={t.id}
                    thread={t}
                    bookmarked={userBookmarks.has(t.id)}
                    showSpace
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-7 flex items-center justify-between"
              >
                <span className="text-xs text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1.5">
                  {page > 1 && (
                    <Link
                      href={`/community/search${baseHref({ page: String(page - 1) })}`}
                      className="px-3 py-1.5 rounded-lg border border-cream-200 hover:bg-cream-50 text-xs font-medium text-slate-700"
                    >
                      ← Newer
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/community/search${baseHref({ page: String(page + 1) })}`}
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
              <h2 className="text-sm font-semibold text-slate-900">Spaces</h2>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li>
                  <Link
                    href="/community/search"
                    className={`${spaceId ? "text-slate-700 hover:text-coral-600" : "font-semibold text-coral-600"}`}
                  >
                    Any space
                  </Link>
                </li>
                {SPACES.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/community/search${baseHref({ space: s.id, page: "" })}`}
                      className={`${spaceId === s.id ? "font-semibold text-coral-600" : "text-slate-700 hover:text-coral-600"}`}
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white border border-cream-200 p-5">
              <h2 className="text-sm font-semibold text-slate-900">
                Trending tags
              </h2>
              {trending.length === 0 ? (
                <p className="mt-3 text-xs text-slate-500">
                  No tags yet.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {trending.map((t) => (
                    <TagChip
                      key={t.tag}
                      tag={t.tag}
                      href={`/community/search${baseHref({ tag: t.tag, page: "" })}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
