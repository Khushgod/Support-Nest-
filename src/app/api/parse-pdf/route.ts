import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { detectLab } from "@/lib/lab-detector";
import { extractByLab } from "@/lib/parsers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 25 MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const rawText = await extractTextFromPDF(buffer);

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract meaningful text from this PDF. It may be a scanned image. Try the manual input form instead.",
        },
        { status: 422 }
      );
    }

    const labSource = detectLab(rawText);
    const { variants, confidence, warnings } = extractByLab(labSource, rawText);

    return NextResponse.json({
      labSource,
      rawText: rawText.slice(0, 15000),
      variants,
      extractionConfidence: confidence,
      warnings,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to process the PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
