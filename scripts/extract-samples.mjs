// One-shot script: parse every PDF in public/samples/ and print extraction
// output. Used to generate baseline expected fixtures.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Use pdfjs directly so we can see real parser errors instead of the
// user-facing wrapper.
const { getDocument, GlobalWorkerOptions } = await import(
  "pdfjs-dist/legacy/build/pdf.mjs"
);
const { createRequire } = await import("node:module");
const localRequire = createRequire(import.meta.url);
GlobalWorkerOptions.workerSrc = localRequire.resolve(
  "pdfjs-dist/legacy/build/pdf.worker.mjs"
);

async function extractTextFromPDF(buffer) {
  const doc = await getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    isEvalSupported: false,
    disableFontFace: true,
    disableWorker: true,
  }).promise;
  const parts = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const t = content.items
      .filter((it) => "str" in it)
      .map((it) => it.str)
      .join(" ");
    parts.push(t);
  }
  await doc.destroy();
  return parts.join("\n");
}
const { detectLab } = await import(path.join(root, "src/lib/lab-detector.ts"));
const { extractByLab } = await import(path.join(root, "src/lib/parsers/index.ts"));

const samplesDir = path.join(root, "public/samples");
const files = (await fs.readdir(samplesDir)).filter((f) => f.endsWith(".pdf"));

for (const f of files) {
  const buf = await fs.readFile(path.join(samplesDir, f));
  const text = await extractTextFromPDF(Buffer.from(buf));
  const lab = detectLab(text);
  const result = extractByLab(lab, text);
  console.log("===", f, "===");
  console.log(
    JSON.stringify(
      { lab, confidence: result.confidence, variants: result.variants },
      null,
      2
    )
  );
  console.log("--- first 500 chars of text ---");
  console.log(text.slice(0, 500).replace(/\s+/g, " "));
  console.log();
}
