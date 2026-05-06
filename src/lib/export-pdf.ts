import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalysisResult } from "./types";
import { MAIN_DISCLAIMER } from "./safety-checker";

export function exportResultsToPDF(result: AnalysisResult) {
  buildPdfDoc(result).save("GeneTranslate-Report.pdf");
}

/**
 * Generate the same PDF but return the raw bytes (for server-side email).
 * Callers: the "Email me these results" flow in ExportBar.
 */
export function buildResultsPdfBuffer(result: AnalysisResult): Uint8Array {
  const buf = buildPdfDoc(result).output("arraybuffer");
  return new Uint8Array(buf);
}

function buildPdfDoc(result: AnalysisResult): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addFooter = () => {
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    const lines = doc.splitTextToSize(MAIN_DISCLAIMER, contentWidth);
    doc.text(lines, margin, pageHeight - 12);
    doc.text(
      `Page ${doc.getNumberOfPages()}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: "right" }
    );
  };

  const checkPageBreak = (needed: number) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - 25) {
      addFooter();
      doc.addPage();
      y = margin;
    }
  };

  // Title
  doc.setFontSize(22);
  doc.setTextColor(26, 30, 46);
  doc.text("GeneTranslate Report", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, y);
  y += 12;

  // Safety flags
  if (result.safetyFlags.hasHighRiskGenes) {
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "F");
    doc.setFontSize(9);
    doc.setTextColor(179, 58, 58);
    doc.text(
      `HIGH-SIGNIFICANCE GENES: ${result.safetyFlags.highRiskGenes.join(", ")} — Please speak with a genetic counselor.`,
      margin + 4,
      y + 6
    );
    y += 22;
  }

  // Summary
  doc.setFontSize(14);
  doc.setTextColor(26, 30, 46);
  doc.text("Plain-Language Summary", margin, y);
  y += 8;

  const summaryParts = [
    { title: "What was found", text: result.summary.whatWasFound },
    { title: "What this means", text: result.summary.whatItMeans },
    { title: "What is uncertain", text: result.summary.whatIsUncertain },
  ];

  for (const part of summaryParts) {
    checkPageBreak(20);
    doc.setFontSize(9);
    doc.setTextColor(59, 143, 194);
    doc.text(part.title.toUpperCase(), margin, y);
    y += 5;

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(part.text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  }

  y += 4;

  // Variant Cards
  checkPageBreak(20);
  doc.setFontSize(14);
  doc.setTextColor(26, 30, 46);
  doc.text("Variant Details", margin, y);
  y += 8;

  for (const variant of result.variantCards) {
    checkPageBreak(50);

    // Gene header
    doc.setFontSize(12);
    doc.setTextColor(26, 30, 46);
    doc.text(`${variant.gene}`, margin, y);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Confidence: ${variant.confidence}`, pageWidth - margin, y, {
      align: "right",
    });
    y += 6;

    // Info table
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 35, textColor: [100, 116, 139] },
        1: { textColor: [51, 65, 85] },
      },
      body: [
        ["Classification", variant.classification],
        ["Condition", variant.condition],
        ["Inheritance", variant.inheritance],
        ["Zygosity", variant.zygosity],
      ],
    });

    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 4;

    // Gene function
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const funcLines = doc.splitTextToSize(variant.geneFunction, contentWidth);
    doc.text(funcLines, margin, y);
    y += funcLines.length * 4.5 + 3;

    // Key takeaway
    doc.setFontSize(9);
    doc.setTextColor(59, 143, 194);
    const takeawayLines = doc.splitTextToSize(
      `Key takeaway: ${variant.keyTakeaway}`,
      contentWidth
    );
    doc.text(takeawayLines, margin, y);
    y += takeawayLines.length * 4.5 + 8;
  }

  // Questions
  checkPageBreak(20);
  doc.setFontSize(14);
  doc.setTextColor(26, 30, 46);
  doc.text("Questions for Your Genetic Counselor", margin, y);
  y += 8;

  for (let i = 0; i < result.questions.length; i++) {
    checkPageBreak(15);
    const q = result.questions[i];
    doc.setFontSize(10);
    doc.setTextColor(26, 30, 46);
    const qLines = doc.splitTextToSize(
      `${i + 1}. ${q.question}`,
      contentWidth
    );
    doc.text(qLines, margin, y);
    y += qLines.length * 5 + 2;

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const rLines = doc.splitTextToSize(q.reasoning, contentWidth - 5);
    doc.text(rLines, margin + 5, y);
    y += rLines.length * 4 + 5;
  }

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter();
  }

  return doc;
}
