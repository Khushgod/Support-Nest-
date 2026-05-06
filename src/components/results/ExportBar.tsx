"use client";

import { Download, Copy, Check, Mail } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import type { AnalysisResult } from "@/lib/types";
import { buildResultsPdfBuffer, exportResultsToPDF } from "@/lib/export-pdf";

interface ExportBarProps {
  result: AnalysisResult;
}

type EmailState =
  | { status: "idle" }
  | { status: "prompting" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

export default function ExportBar({ result }: ExportBarProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState<EmailState>({ status: "idle" });
  const [address, setAddress] = useState("");

  const handleExportPDF = () => {
    exportResultsToPDF(result);
  };

  const handleCopyAll = async () => {
    const text = buildCopyText(result);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openEmailPrompt = () => {
    setEmail({ status: "prompting" });
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmail({ status: "sending" });
    try {
      const pdfBytes = buildResultsPdfBuffer(result);
      const pdfBase64 = bytesToBase64(pdfBytes);
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: address, pdfBase64 }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setEmail({
          status: "error",
          message: err.error || "Could not send email.",
        });
        return;
      }
      setEmail({ status: "sent" });
      // Spec §5.4: don't persist the address client-side either.
      setAddress("");
      setTimeout(() => setEmail({ status: "idle" }), 4000);
    } catch (err) {
      setEmail({
        status: "error",
        message: err instanceof Error ? err.message : "Send failed.",
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-sage-200 shadow-lg z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        {email.status === "prompting" || email.status === "sending" ? (
          <form
            onSubmit={handleSendEmail}
            className="flex items-center gap-2 w-full"
          >
            <input
              type="email"
              required
              autoFocus
              placeholder="your@email.com"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
              disabled={email.status === "sending"}
            />
            <Button
              type="submit"
              size="sm"
              disabled={email.status === "sending"}
            >
              {email.status === "sending" ? "Sending…" : "Send"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setEmail({ status: "idle" })}
              disabled={email.status === "sending"}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 hidden sm:block">
              {email.status === "sent"
                ? "Email sent. Your address was not saved."
                : email.status === "error"
                ? email.message
                : "For educational purposes only. Review with your genetic counselor."}
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <Button variant="secondary" size="sm" onClick={handleCopyAll}>
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy All"}
              </Button>
              <Button variant="secondary" size="sm" onClick={openEmailPrompt}>
                <Mail className="w-4 h-4" />
                Email me these results
              </Button>
              <Button size="sm" onClick={handleExportPDF}>
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk))
    );
  }
  return btoa(binary);
}

function buildCopyText(result: AnalysisResult): string {
  const parts: string[] = [];

  parts.push("=== GENETRANSLATE REPORT ===\n");

  parts.push("SUMMARY");
  parts.push(`What was found: ${result.summary.whatWasFound}`);
  parts.push(`What this means: ${result.summary.whatItMeans}`);
  parts.push(`What is uncertain: ${result.summary.whatIsUncertain}\n`);

  parts.push("VARIANT DETAILS");
  for (const v of result.variantCards) {
    parts.push(`\n--- ${v.gene} ---`);
    parts.push(`Classification: ${v.classification}`);
    parts.push(`Condition: ${v.condition}`);
    parts.push(`Inheritance: ${v.inheritance}`);
    parts.push(`Key takeaway: ${v.keyTakeaway}`);
  }

  parts.push("\n\nQUESTIONS FOR YOUR GENETIC COUNSELOR");
  for (let i = 0; i < result.questions.length; i++) {
    parts.push(`${i + 1}. ${result.questions[i].question}`);
  }

  parts.push(`\n\n${result.disclaimer}`);

  return parts.join("\n");
}
