import jsPDF from "jspdf";

export interface ReceiptData {
  receiptNumber: string;
  clientName: string;
  clientCode?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  therapistName?: string | null;
  sessionDate?: string | null;
  sessionType?: string | null;
  durationMins?: number | null;
  amountUgx: number;
  paidStatus?: string | null;
}

export const makeReceiptNumber = () =>
  `INS-R${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;

const money = (n: number) => `UGX ${Math.round(n || 0).toLocaleString()}`;

/** Builds a SafeBoda-style narrow digital receipt and returns { doc, base64 }. */
export function buildReceiptPdf(d: ReceiptData) {
  const doc = new jsPDF({ unit: "mm", format: [80, 170] });
  const W = 80;
  const c = W / 2;
  let y = 12;

  doc.setFillColor(12, 68, 124);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("InnerSpark Africa", c, 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Therapy & Wellbeing · Payment Receipt", c, 16, { align: "center" });

  y = 30;
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(money(d.amountUgx), c, y, { align: "center" });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text((d.paidStatus || "paid").toUpperCase(), c, y, { align: "center" });

  y += 6;
  doc.setDrawColor(220, 220, 220);
  doc.line(6, y, W - 6, y);
  y += 6;

  const row = (label: string, value: string) => {
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7.5);
    doc.text(label, 6, y);
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(value || "—", 42);
    doc.text(lines, W - 6, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += Math.max(6, lines.length * 4.5);
  };

  row("Receipt No.", d.receiptNumber);
  row("Date", d.sessionDate || new Date().toISOString().slice(0, 10));
  row("Client", d.clientName);
  if (d.clientCode) row("Client code", d.clientCode);
  if (d.clientPhone) row("Phone", d.clientPhone);
  if (d.therapistName) row("Therapist", d.therapistName);
  if (d.sessionType) row("Session type", d.sessionType);
  if (d.durationMins) row("Duration", `${d.durationMins} mins`);
  row("Total paid", money(d.amountUgx));

  y += 2;
  doc.setDrawColor(220, 220, 220);
  doc.line(6, y, W - 6, y);
  y += 6;
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(7);
  doc.text(
    doc.splitTextToSize(
      "Thank you for choosing InnerSpark Africa. Keep this receipt for your records. Support: info@innersparkafrica.com | www.innersparkafrica.com",
      W - 12,
    ),
    c,
    y,
    { align: "center" },
  );

  const dataUri = doc.output("datauristring");
  const base64 = dataUri.split(",")[1];
  return { doc, base64 };
}