import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * Parse a PDF buffer to plain text using pdfjs-dist's legacy build.
 *
 * In a Node/serverless environment we set `disableWorker: true` and let pdfjs
 * run the parsing pipeline on the main thread. We deliberately do NOT touch
 * `GlobalWorkerOptions.workerSrc` because:
 *
 *   - In a Next.js serverless function the bundler does not ship the worker
 *     file at a stable path; resolving it at runtime is unreliable.
 *   - With `disableWorker: true` pdfjs ≥ 4.x's main-thread fallback handles
 *     parsing without ever needing the worker bundle (we still need to
 *     suppress the worker-setup attempt — see the wrapper below).
 *
 * The cast through `unknown` is because `disableWorker` is honored at runtime
 * but not present in `DocumentInitParameters` in the published types.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const uint8Array = new Uint8Array(buffer);
    const doc = await getDocument({
      data: uint8Array,
      useSystemFonts: true,
      isEvalSupported: false,
      disableFontFace: true,
      disableWorker: true,
      verbosity: 0,
    } as unknown as Parameters<typeof getDocument>[0]).promise;

    const textParts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .filter(
          (item): item is typeof item & { str: string } =>
            typeof (item as { str?: unknown }).str === "string"
        )
        .map((item) => (item as { str: string }).str)
        .join(" ");
      textParts.push(pageText);
    }

    await doc.destroy();
    return textParts.join("\n");
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Could not read this PDF. It may be password-protected, image-only, or corrupted. (${detail})`
    );
  }
}
