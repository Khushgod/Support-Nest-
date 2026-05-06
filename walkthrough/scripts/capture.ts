/**
 * Screenshot harness. Spins up a headless Chromium pointed at the live dev
 * server and captures one full-page PNG per entry in `pages.ts`. Pages that
 * require auth are visited inside a logged-in browser context.
 *
 * Run via:
 *   tsx walkthrough/scripts/capture.ts http://localhost:3179
 *
 * Outputs: walkthrough/screenshots/<slug>.png and walkthrough/_manifest.json
 */
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { PAGES } from "./pages";

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const SHOTS_DIR = path.resolve(__dirname, "..", "screenshots");
const MANIFEST_PATH = path.resolve(__dirname, "..", "_manifest.json");

const BASE_URL = process.argv[2] || "http://localhost:3179";

const VIEWPORT = { width: 1440, height: 900 } as const;

async function settle(page: Page) {
  // Wait for fonts and lazy assets so the screenshot doesn't catch a
  // half-rendered hero. networkidle is overkill for fully-static pages, but
  // for warm hero gradients it's the simplest correct knob.
  await page.waitForLoadState("networkidle").catch(() => undefined);
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
  });
  // Give CSS animations one beat to land on a stable frame.
  await page.waitForTimeout(350);
}

async function ensureFreshUser(): Promise<{
  email: string;
  password: string;
  name: string;
}> {
  const stamp = crypto.randomBytes(3).toString("hex");
  return {
    email: `walkthrough-${stamp}@supportnest.test`,
    password: "WalkThroughDocs1!",
    name: "Sage Walker",
  };
}

async function registerAndLogin(
  context: BrowserContext,
  creds: { email: string; password: string; name: string }
): Promise<void> {
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/register`, { waitUntil: "domcontentloaded" });
  await page.fill('input[name="name"]', creds.name);
  await page.fill('input[name="email"]', creds.email);
  await page.selectOption('select[name="role"]', "parent");
  await page.fill('input[name="password"]', creds.password);
  await page.check('input[name="agree"]');
  await Promise.all([
    page.waitForURL(/\/dashboard/),
    page.click('button[type="submit"]'),
  ]);
  await page.close();
}

async function captureOne(
  ctx: BrowserContext,
  spec: (typeof PAGES)[number]
): Promise<{ slug: string; bytes: number }> {
  const page = await ctx.newPage();
  await page.setViewportSize(spec.viewport ?? VIEWPORT);
  const url = new URL(spec.path, BASE_URL).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await settle(page);
  if (spec.interact) {
    try {
      await spec.interact(page);
    } catch (err) {
      console.warn(`interact() failed for ${spec.slug}:`, err);
    }
    await settle(page);
  }
  // Scroll to top so screenshots start consistently from the hero.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);

  const file = path.join(SHOTS_DIR, `${spec.slug}.jpg`);
  const buf = await page.screenshot({
    fullPage: spec.fullPage ?? true,
    animations: "disabled",
    path: file,
    type: "jpeg",
    quality: 84,
  });
  await page.close();
  return { slug: spec.slug, bytes: buf.length };
}

async function main() {
  await fs.mkdir(SHOTS_DIR, { recursive: true });

  const browser: Browser = await chromium.launch({
    executablePath: CHROME_PATH,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
    headless: true,
  });

  // Two contexts: one anonymous, one signed-in.
  const anon = await browser.newContext({ viewport: VIEWPORT });
  const authed = await browser.newContext({ viewport: VIEWPORT });

  const creds = await ensureFreshUser();
  await registerAndLogin(authed, creds);

  const manifest: {
    capturedAt: string;
    baseUrl: string;
    user: { email: string };
    shots: { slug: string; path: string; auth: boolean; bytes: number }[];
  } = {
    capturedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    user: { email: creds.email },
    shots: [],
  };

  const onlySlugs = (process.env.ONLY ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const spec of PAGES) {
    if (onlySlugs.length > 0 && !onlySlugs.includes(spec.slug)) continue;
    const ctx = spec.auth ? authed : anon;
    process.stdout.write(`  ${spec.slug.padEnd(34)} ${spec.path} `);
    const start = Date.now();
    try {
      const { bytes } = await captureOne(ctx, spec);
      manifest.shots.push({
        slug: spec.slug,
        path: spec.path,
        auth: !!spec.auth,
        bytes,
      });
      const ms = Date.now() - start;
      const kb = (bytes / 1024).toFixed(0);
      console.log(`✓ ${ms}ms · ${kb}KB`);
    } catch (err) {
      console.log(`✗ ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  await anon.close();
  await authed.close();
  await browser.close();
  console.log(`\nWrote ${manifest.shots.length} shots to ${SHOTS_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
