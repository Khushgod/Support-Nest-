/**
 * Renders walkthrough/walkthrough.html to walkthrough/SupportNest-Walkthrough.pdf
 * via Chromium's print-to-PDF, using the same browser binary the screenshot
 * harness uses. Images are loaded straight off disk via file:// so the PDF
 * doesn't need a running dev server.
 */
import { chromium } from "playwright";
import path from "node:path";
import { promises as fs } from "node:fs";

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const HTML = path.resolve(__dirname, "..", "walkthrough.html");
const PDF = path.resolve(__dirname, "..", "SupportNest-Walkthrough.pdf");

async function main() {
  await fs.access(HTML);
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
    headless: true,
  });
  try {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const url = "file://" + HTML;
    // file:// + dozens of lazy-loaded PNGs never reaches networkidle reliably
    // in headless Chromium; load only to DOMContentLoaded and then drive image
    // loading explicitly.
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Force any lazy-loaded images to load immediately, then await each one.
    await page.evaluate(() => {
      for (const img of Array.from(document.images)) {
        img.loading = "eager";
        // Re-trigger by re-assigning src (cheap for file:// images).
        img.src = img.src;
      }
    });
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise<void>((res) => {
                const done = () => res();
                img.addEventListener("load", done, { once: true });
                img.addEventListener("error", done, { once: true });
              })
        )
      );
    });
    // Belt-and-braces: give the layout one frame to settle after images sized.
    await page.waitForTimeout(500);
    // Coerce print-media so @page rules apply.
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: PDF,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
  } finally {
    await browser.close();
  }
  const stat = await fs.stat(PDF);
  console.log(`Wrote ${PDF} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
