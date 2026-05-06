/**
 * Builds walkthrough/walkthrough.html from pages.ts + the screenshots that
 * already live in walkthrough/screenshots. The HTML is print-friendly and
 * ready to be passed to Chromium's PDF renderer.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { PAGES, SECTIONS } from "./pages";

const OUT = path.resolve(__dirname, "..", "walkthrough.html");
const SHOTS_REL = "screenshots";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function ensureExists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const screenshotsDir = path.resolve(__dirname, "..", "screenshots");
  const present = await Promise.all(
    PAGES.map(async (p) => ({
      slug: p.slug,
      ext: (await ensureExists(path.join(screenshotsDir, `${p.slug}.jpg`)))
        ? "jpg"
        : (await ensureExists(path.join(screenshotsDir, `${p.slug}.png`)))
          ? "png"
          : null,
    }))
  );
  const presence = new Map(present.map((p) => [p.slug, p.ext]));

  const grouped = new Map<string, typeof PAGES>();
  for (const p of PAGES) {
    if (!grouped.has(p.section)) grouped.set(p.section, []);
    grouped.get(p.section)!.push(p);
  }

  const tocItems = Array.from(grouped.entries())
    .map(([section, items]) => {
      const sectionId = `s-${slugify(section)}`;
      const sub = items
        .map(
          (p) =>
            `<li><a href="#${p.slug}">${escape(p.title)}</a> <span class="toc-path">${escape(p.path)}</span></li>`
        )
        .join("\n");
      return `<li class="toc-section">
        <a href="#${sectionId}">${escape(section)}</a>
        <ol>${sub}</ol>
      </li>`;
    })
    .join("\n");

  const sectionsHtml = SECTIONS.filter((s) => grouped.has(s))
    .map((section) => {
      const items = grouped.get(section)!;
      const sectionId = `s-${slugify(section)}`;
      const cards = items
        .map((p) => {
          const ext = presence.get(p.slug);
          const img = ext
            ? `<img class="shot" src="${SHOTS_REL}/${p.slug}.${ext}" alt="${escape(p.title)}" />`
            : `<div class="shot missing">Screenshot unavailable</div>`;
          const highlights = (p.highlights ?? [])
            .map((h) => `<li>${escape(h)}</li>`)
            .join("");
          const highlightsBlock = highlights
            ? `<aside class="highlights"><h4>Highlights</h4><ul>${highlights}</ul></aside>`
            : "";
          const auth = p.auth
            ? `<span class="badge auth">Signed in</span>`
            : "";
          return `<article class="page" id="${p.slug}">
            <header class="page-head">
              <div class="page-meta">
                <span class="route">${escape(p.path)}</span>
                ${auth}
              </div>
              <h3>${escape(p.title)}</h3>
            </header>
            <div class="page-body">
              <p class="lede">${escape(p.description)}</p>
              ${highlightsBlock}
            </div>
            <figure class="figure">${img}</figure>
          </article>`;
        })
        .join("\n");
      return `<section class="section" id="${sectionId}">
        <h2>${escape(section)}</h2>
        ${cards}
      </section>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>SupportNest — Product walkthrough</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
    @media print { .no-print { display: none !important; } }

    :root {
      --coral-50: #fff4f0;
      --coral-100: #ffe5dc;
      --coral-500: #f06745;
      --coral-600: #d04a2c;
      --coral-700: #a73a23;
      --sun-100: #ffefc4;
      --sun-500: #f09a14;
      --lavender-100: #ece1ff;
      --lavender-500: #8a61df;
      --lavender-700: #573a99;
      --cream-50: #fdfaf3;
      --cream-100: #faf3e2;
      --cream-200: #f4e7c8;
      --cream-300: #ecd7a2;
      --slate-50: #f8f9fa;
      --slate-200: #e2e4e8;
      --slate-400: #9da2ac;
      --slate-500: #6c7483;
      --slate-700: #475569;
      --slate-900: #1a1e2e;
    }

    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: white;
      color: var(--slate-900);
      font: 12px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI",
        "Inter", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 760px;
      margin: 0 auto;
      padding: 28px 32px 64px;
    }

    /* ---------- Cover ---------- */
    .cover {
      page-break-after: always;
      min-height: 92vh;
      padding: 80px 36px 36px;
      background: radial-gradient(at 12% 8%, var(--coral-100) 0, transparent 45%),
                  radial-gradient(at 92% 12%, var(--sun-100) 0, transparent 45%),
                  radial-gradient(at 78% 92%, var(--lavender-100) 0, transparent 45%),
                  radial-gradient(at 8% 88%, var(--cream-100) 0, transparent 45%),
                  linear-gradient(180deg, var(--cream-50) 0%, #fff 100%);
      position: relative;
      overflow: hidden;
    }
    .cover-mark {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: var(--coral-700);
      font-weight: 600;
    }
    .cover-mark-glyph {
      width: 32px; height: 32px; border-radius: 10px;
      background: linear-gradient(135deg, var(--coral-500), var(--sun-500), var(--lavender-500));
      box-shadow: 0 6px 14px rgba(208, 74, 44, 0.25);
    }
    h1.cover-title {
      margin: 36px 0 6px;
      font-size: 46px;
      letter-spacing: -0.02em;
      line-height: 1.05;
      max-width: 600px;
    }
    h1.cover-title em {
      font-style: normal;
      background: linear-gradient(90deg, var(--coral-500), var(--sun-500), var(--lavender-500));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .cover-sub {
      margin-top: 14px;
      font-size: 15px;
      color: var(--slate-500);
      max-width: 540px;
      line-height: 1.6;
    }
    .cover-meta {
      margin-top: 56px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px 36px;
      max-width: 540px;
      font-size: 12px;
    }
    .cover-meta dt {
      color: var(--slate-500);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: 10px;
    }
    .cover-meta dd { margin: 4px 0 0; color: var(--slate-700); }

    .cover-foot {
      position: absolute;
      bottom: 36px;
      left: 36px;
      right: 36px;
      font-size: 11px;
      color: var(--slate-500);
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 16px;
    }

    /* ---------- TOC ---------- */
    .toc {
      page-break-after: always;
      padding-top: 12px;
    }
    .toc h2 {
      font-size: 20px;
      margin: 0 0 16px;
      letter-spacing: -0.01em;
    }
    .toc ol { list-style: none; margin: 0; padding: 0; }
    .toc-section { margin-bottom: 16px; }
    .toc-section > a {
      font-weight: 700;
      color: var(--slate-900);
      font-size: 13px;
    }
    .toc-section > ol { margin-top: 6px; padding-left: 14px; }
    .toc-section > ol > li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 11.5px;
      padding: 3px 0;
      border-bottom: 1px dotted var(--slate-200);
    }
    .toc a { color: var(--slate-700); text-decoration: none; }
    .toc a:hover { color: var(--coral-600); }
    .toc-path { color: var(--slate-400); font-family: ui-monospace, "SFMono-Regular", Menlo, monospace; }

    /* ---------- Sections ---------- */
    .section {
      page-break-before: always;
    }
    .section > h2 {
      font-size: 22px;
      margin: 0 0 18px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--coral-100);
      color: var(--coral-700);
      letter-spacing: -0.01em;
    }

    .page {
      page-break-inside: avoid;
      margin: 0 0 26px;
      padding: 18px 18px 4px;
      background: var(--cream-50);
      border: 1px solid var(--cream-200);
      border-radius: 14px;
    }
    .page-head {
      margin-bottom: 8px;
    }
    .page-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }
    .route {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 11px;
      color: var(--coral-700);
      background: var(--coral-100);
      padding: 1px 8px;
      border-radius: 999px;
      font-weight: 600;
    }
    .badge.auth {
      font-size: 10px;
      color: var(--lavender-700);
      background: var(--lavender-100);
      padding: 1px 8px;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .page-head h3 {
      margin: 4px 0 0;
      font-size: 16px;
      letter-spacing: -0.01em;
    }
    .page-body {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .lede {
      margin: 4px 0 0;
      color: var(--slate-700);
      font-size: 12px;
    }
    .highlights {
      margin: 8px 0 0;
      padding: 10px 14px;
      background: white;
      border: 1px solid var(--cream-200);
      border-radius: 10px;
    }
    .highlights h4 {
      margin: 0 0 6px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--coral-600);
    }
    .highlights ul {
      margin: 0;
      padding-left: 16px;
      color: var(--slate-700);
      font-size: 11px;
    }
    .highlights li { margin-bottom: 3px; }

    .figure {
      margin: 12px -2px 12px;
      padding: 6px;
      background: white;
      border: 1px solid var(--cream-200);
      border-radius: 10px;
      box-shadow: 0 12px 24px -16px rgba(208, 74, 44, 0.18);
    }
    .shot {
      display: block;
      max-width: 100%;
      max-height: 200mm; /* Cap so very tall screenshots fit on one page */
      width: auto;
      height: auto;
      margin: 0 auto;
      border-radius: 6px;
    }
    .shot.missing {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 220px;
      color: var(--slate-400);
      font-size: 11px;
      background: repeating-linear-gradient(
        45deg,
        var(--cream-100),
        var(--cream-100) 8px,
        var(--cream-200) 8px,
        var(--cream-200) 16px
      );
      border-radius: 6px;
    }

    /* ---------- Coda ---------- */
    .coda {
      page-break-before: always;
      padding-top: 24px;
    }
    .coda h2 { font-size: 20px; margin: 0 0 12px; }
    .coda p { color: var(--slate-700); font-size: 12px; }
    .coda .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-top: 18px;
    }
    .coda .grid h3 { font-size: 12px; margin: 0 0 4px; color: var(--coral-700); }
    .coda .grid p { margin: 0; font-size: 11px; }

    .footer-line {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid var(--slate-200);
      font-size: 10px;
      color: var(--slate-400);
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <!-- Cover -->
  <section class="cover">
    <div class="cover-mark">
      <div class="cover-mark-glyph"></div>
      Support<span style="color: var(--coral-500);">Nest</span>
    </div>
    <h1 class="cover-title">A product <em>walkthrough</em>, page by page.</h1>
    <p class="cover-sub">A warm corner of the internet for parents, teachers, and neurodivergent people: a moderated community forum, a curated resources library, four free privacy-first tools (plus GeneTranslate as a sub-tool), and an authenticated experience built around an encrypted vault. This document walks through every page in the product with annotated screenshots.</p>
    <dl class="cover-meta">
      <div><dt>Total pages covered</dt><dd>${PAGES.length}</dd></div>
      <div><dt>Sections</dt><dd>${SECTIONS.length}</dd></div>
      <div><dt>Built on</dt><dd>Next.js 16 · React 19 · Tailwind v4</dd></div>
      <div><dt>Captured at</dt><dd>${new Date().toISOString().replace("T", " ").slice(0, 16)} UTC</dd></div>
    </dl>
    <div class="cover-foot">
      <span>SupportNest · product walkthrough · v1</span>
      <span>Internal · share with care</span>
    </div>
  </section>

  <!-- Table of contents -->
  <section class="toc">
    <div class="container">
      <h2>Contents</h2>
      <ol>${tocItems}</ol>
    </div>
  </section>

  <div class="container">
    ${sectionsHtml}

    <!-- Coda -->
    <section class="coda">
      <h2>Architecture &amp; build notes</h2>
      <p>This walkthrough is generated from a single source of truth in <code>walkthrough/scripts/pages.ts</code>: the same list drives both the screenshot harness and the document layout. Re-running <code>npx tsx walkthrough/scripts/capture.ts</code> against a running dev server refreshes the screenshots; running <code>npx tsx walkthrough/scripts/build-html.ts</code> rebuilds this document.</p>

      <div class="grid">
        <div>
          <h3>Stack</h3>
          <p>Next.js 16 App Router with the new <code>proxy.ts</code> middleware convention, React 19.2, Tailwind CSS v4 with a coral / sun / lavender / cream palette in <code>globals.css</code>, Zod-validated Server Actions for every mutation, and <code>jose</code> JWT sessions in HttpOnly cookies.</p>
        </div>
        <div>
          <h3>Data &amp; storage</h3>
          <p>File-backed JSON stores at <code>.data/users.json</code> and <code>.data/forum.json</code> (atomic writes, mode 0600, in-process write-lock). Anything users opt to save runs through an AES-256-GCM vault with HKDF-SHA256-derived per-record keys scoped by user + record id.</p>
        </div>
        <div>
          <h3>Tooling</h3>
          <p>GeneTranslate, the Plain-Language Translator, the Regulation Toolkit, the Sensory Day Planner, and the IEP/504 Companion. Two of these route through local Ollama for LLM features; the others are entirely client-side. None upload data to a third party.</p>
        </div>
        <div>
          <h3>Tests</h3>
          <p>105 vitest tests across 16 files cover password hashing &amp; verify, registration validation, the user store and DAL, JWT round-trip, the AES-GCM vault (including tamper detection and wrong-owner refusal), the forum store and search, the IEP data shape, the Plain-Language API surface, and a long-running PDF accuracy harness.</p>
        </div>
      </div>

      <p class="footer-line">
        <span>Generated from <code>walkthrough/scripts/pages.ts</code></span>
        <span>${new Date().getFullYear()} · SupportNest</span>
      </p>
    </section>
  </div>
</body>
</html>`;

  await fs.writeFile(OUT, html);
  console.log(`Wrote ${OUT} (${(html.length / 1024).toFixed(0)}KB)`);
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
