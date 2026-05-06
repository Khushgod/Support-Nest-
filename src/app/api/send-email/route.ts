import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

interface SendEmailRequest {
  to: string;
  pdfBase64: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.RESEND_FROM ?? "GeneTranslate <noreply@genetranslate.local>";

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Email delivery is not configured on this server. Set RESEND_API_KEY to enable it.",
      },
      { status: 503 }
    );
  }

  let body: SendEmailRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.to || !EMAIL_RE.test(body.to)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 }
    );
  }

  if (!body.pdfBase64 || body.pdfBase64.length < 100) {
    return NextResponse.json(
      { error: "PDF payload missing or too small." },
      { status: 400 }
    );
  }
  if (body.pdfBase64.length > 15 * 1024 * 1024) {
    return NextResponse.json(
      { error: "PDF payload exceeds 15 MB." },
      { status: 413 }
    );
  }

  // Spec §5.4: the user's email MUST NOT be persisted after send. We do not
  // write it to any store; it lives only for the duration of this request.
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: body.to,
        subject: "Your GeneTranslate report",
        text:
          "Your GeneTranslate plain-language report is attached. " +
          "This document is for educational purposes only; please review it with your genetic counselor or physician.",
        attachments: [
          {
            filename: "GeneTranslate-Report.pdf",
            content: body.pdfBase64,
          },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: `Email provider rejected the send: ${detail.slice(0, 200)}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
