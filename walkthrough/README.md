# SupportNest — product walkthrough

This folder contains a per-page walkthrough of the SupportNest product.

- `SupportNest-Walkthrough.pdf` — the final deliverable (8 MB, ~50 pages,
  printable A4).
- `walkthrough.html` — the same document as a single HTML file. The PDF is
  rendered from this file using Chromium's print-to-PDF.
- `screenshots/` — 33 JPEG screenshots, one per page, captured at 1440×900
  full-page from a live dev instance.
- `scripts/` — the screenshot harness, the HTML builder, and the PDF
  renderer.
- `_manifest.json` — capture metadata (when, against what URL, which test
  user was used).

## Regenerating

```bash
# Start the dev server with isolated data dirs and known secrets:
SUPPORTNEST_DATA_DIR=/tmp/sn-walk \
SUPPORTNEST_VAULT_DIR=/tmp/sn-walk/vault \
SUPPORTNEST_SESSION_SECRET=$(openssl rand -base64 32) \
SUPPORTNEST_DATA_KEY=$(openssl rand -base64 32) \
npm run dev -- -p 3179

# In another shell:
npm run walkthrough              # capture → html → pdf
# or piecewise:
npm run walkthrough:capture http://localhost:3179
npm run walkthrough:html
npm run walkthrough:pdf
```

The harness registers a fresh test user (`walkthrough-<random>@supportnest.test`)
in the new data directory before capturing, so auth-protected pages render
properly and no real user data is touched.

## Adding a page

Edit `walkthrough/scripts/pages.ts` — that file is the single source of
truth for both the screenshot list and the document layout. Add a new
`ShotSpec`, optionally with an `interact()` hook to set up state, then
re-run `npm run walkthrough`.

## Why JPEGs

A first pass with full-page PNG screenshots produced a 22 MB PDF on a 26 MB
screenshot folder. JPEG quality 84 brings the screenshots to ~6 MB and the
PDF to ~8 MB with no visible loss at A4 print scale.
