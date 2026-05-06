import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

// Disable worker for server-side usage
GlobalWorkerOptions.workerSrc = "";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const uint8Array = new Uint8Array(buffer);
    const doc = await getDocument({
      data: uint8Array,
      useSystemFonts: true,
      isEvalSupported: false,
      disableFontFace: true,
    }).promise;

    const textParts: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .filter((item) => "str" in item)
        .map((item) => (item as { str: string }).str)
        .join(" ");
      textParts.push(pageText);
    }

    await doc.destroy();
    return textParts.join("\n");
  } catch {
    throw new Error(
      "Could not read this PDF. It may be password-protected, image-only, or corrupted."
    );
  }
}
