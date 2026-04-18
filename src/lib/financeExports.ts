import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'financial_year' | 'custom' | 'all';

export const SERVICE_LABELS: Record<string, string> = {
  therapy: 'Therapy Sessions',
  support_group: 'Support Groups',
  chat_consultation: 'Chat Consultation',
  corporate: 'Corporate Services',
  app_service: 'App-based Services',
  training: 'Trainings',
  other: 'Other',
};

export interface DateRange {
  start?: Date;
  end?: Date;
}

export const getPeriodRange = (period: Period, custom?: DateRange): { start: Date | null; end: Date } => {
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  if (period === 'all') return { start: null, end: endOfToday };
  if (period === 'custom') {
    return {
      start: custom?.start ?? null,
      end: custom?.end ?? endOfToday,
    };
  }

  let start: Date;
  let end = endOfToday;
  switch (period) {
    case 'daily':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly': {
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
      break;
    }
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'yearly':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case 'financial_year': {
      const fyStartYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
      start = new Date(fyStartYear, 6, 1);
      end = new Date(fyStartYear + 1, 5, 30, 23, 59, 59);
      break;
    }
    default:
      start = new Date(0);
  }
  return { start, end };
};

export const filterByPeriod = <T extends { date: string | Date }>(
  rows: T[],
  period: Period,
  custom?: DateRange
): T[] => {
  const { start, end } = getPeriodRange(period, custom);
  if (!start) return rows;
  return rows.filter(r => {
    const d = new Date(r.date);
    return d >= start && d <= end;
  });
};

export const exportCSV = (rows: Record<string, any>[], filename: string) => {
  if (rows.length === 0) {
    alert('No data to export');
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (val: any) => {
    const s = val === null || val === undefined ? '' : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportXLSX = (
  sheets: Record<string, Record<string, any>[]>,
  filename: string
) => {
  const wb = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([name, rows]) => {
    const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: 'No data' }]);
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  });
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const formatUGX = (n: number): string =>
  `UGX ${Number(n || 0).toLocaleString()}`;

export const periodLabel = (p: Period, custom?: DateRange): string => {
  if (p === 'custom' && custom?.start && custom?.end) {
    return `${custom.start.toLocaleDateString()} – ${custom.end.toLocaleDateString()}`;
  }
  return ({
    daily: 'Today', weekly: 'This Week', monthly: 'This Month',
    yearly: 'This Year', financial_year: 'Financial Year (Jul–Jun)',
    custom: 'Custom Range', all: 'All Time',
  } as Record<Period, string>)[p];
};

const LOGO_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/logo.png';
const FOOTER_URL = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/footer-banner.png';

const loadImage = (url: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      try { resolve(canvas.toDataURL('image/png')); } catch { resolve(''); }
    };
    img.onerror = () => resolve('');
    img.src = url;
  });

export interface PdfReportOptions {
  title: string;
  rangeLabel: string;
  summary: { label: string; value: string; highlight?: 'income' | 'expense' | 'net' }[];
  sections: { heading: string; rows: { label: string; value: string }[] }[];
  filename: string;
}

export const exportFinancialPDF = async (opts: PdfReportOptions) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  let y = 12;

  // Header with logo
  try {
    const logo = await loadImage(LOGO_URL);
    if (logo) doc.addImage(logo, 'PNG', 15, y, 40, 14);
  } catch {}
  doc.setFontSize(18);
  doc.setTextColor(91, 106, 191);
  doc.text('InnerSpark Africa', W - 15, y + 6, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Finance Report', W - 15, y + 12, { align: 'right' });

  y = 35;
  doc.setDrawColor(91, 106, 191);
  doc.setLineWidth(0.5);
  doc.line(15, y, W - 15, y);
  y += 8;

  // Title
  doc.setFontSize(16);
  doc.setTextColor(30);
  doc.text(opts.title, 15, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Period: ${opts.rangeLabel}`, 15, y);
  doc.text(`Generated: ${new Date().toLocaleString()}`, W - 15, y, { align: 'right' });
  y += 8;

  // Summary cards
  doc.setFillColor(244, 245, 251);
  doc.roundedRect(15, y, W - 30, 28, 2, 2, 'F');
  const cardW = (W - 30) / opts.summary.length;
  opts.summary.forEach((s, i) => {
    const x = 15 + i * cardW + cardW / 2;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(s.label.toUpperCase(), x, y + 8, { align: 'center' });
    doc.setFontSize(13);
    if (s.highlight === 'income') doc.setTextColor(5, 150, 105);
    else if (s.highlight === 'expense') doc.setTextColor(220, 38, 38);
    else if (s.highlight === 'net') doc.setTextColor(91, 106, 191);
    else doc.setTextColor(30);
    doc.text(s.value, x, y + 18, { align: 'center' });
  });
  y += 36;

  // Sections
  for (const section of opts.sections) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setTextColor(91, 106, 191);
    doc.text(section.heading, 15, y);
    y += 5;
    doc.setDrawColor(220);
    doc.line(15, y, W - 15, y);
    y += 5;
    doc.setFontSize(10);
    doc.setTextColor(50);
    section.rows.forEach(r => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(r.label, 18, y);
      doc.text(r.value, W - 18, y, { align: 'right' });
      y += 6;
    });
    y += 6;
  }

  // Footer banner on last page
  if (y > 240) { doc.addPage(); y = 20; }
  try {
    const footer = await loadImage(FOOTER_URL);
    if (footer) doc.addImage(footer, 'PNG', 15, 270, W - 30, 18);
  } catch {}
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('www.innersparkafrica.com  •  finance@innersparkafrica.com', W / 2, 292, { align: 'center' });

  doc.save(`${opts.filename}.pdf`);
};
