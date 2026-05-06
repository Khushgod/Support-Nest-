/**
 * Tiny utilities for the forum surface that don't need to live on the server.
 */

export function timeAgo(iso: string, now = Date.now()): string {
  const diffMs = now - new Date(iso).getTime();
  if (diffMs < 0) return "just now";
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}mo ago`;
  return `${Math.floor(month / 12)}y ago`;
}

export function snippet(body: string, max = 240): string {
  const collapsed = body.replace(/\s+/g, " ").trim();
  if (collapsed.length <= max) return collapsed;
  return collapsed.slice(0, max - 1).replace(/\s\S*$/, "") + "…";
}

const URL_RE = /\bhttps?:\/\/[^\s<>"]+[^\s<>".,;:!?)]/g;

/** Renders body text with link autodetection and paragraph breaks. */
export function bodyToSegments(
  body: string
): { paragraphs: { kind: "text" | "link"; value: string }[][] } {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => {
      const segs: { kind: "text" | "link"; value: string }[] = [];
      let last = 0;
      for (const m of para.matchAll(URL_RE)) {
        const start = m.index ?? 0;
        if (start > last) {
          segs.push({ kind: "text", value: para.slice(last, start) });
        }
        segs.push({ kind: "link", value: m[0] });
        last = start + m[0].length;
      }
      if (last < para.length) segs.push({ kind: "text", value: para.slice(last) });
      return segs;
    });
  return { paragraphs };
}

export function buildSearchHref(params: {
  q?: string;
  spaceId?: string;
  audience?: string;
  contentNote?: string;
  tag?: string;
  sort?: string;
  page?: number;
}): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.spaceId) sp.set("space", params.spaceId);
  if (params.audience) sp.set("audience", params.audience);
  if (params.contentNote) sp.set("cn", params.contentNote);
  if (params.tag) sp.set("tag", params.tag);
  if (params.sort) sp.set("sort", params.sort);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/community/search?${qs}` : `/community/search`;
}
