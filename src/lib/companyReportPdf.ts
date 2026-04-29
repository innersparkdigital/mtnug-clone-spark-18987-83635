import jsPDF from 'jspdf';

export interface CompanyReportData {
  contact_name?: string | null;
  company_name: string;
  reporting_period: string;
  total_employees: number;
  total_completed: number;
  completion_rate: number;
  avg_who5: number;
  high_count: number;
  moderate_count: number;
  low_count: number;
  high_wellbeing_pct: number;
  moderate_wellbeing_pct: number;
  low_wellbeing_pct: number;
  needs_support_count: number;
}

const PRIMARY: [number, number, number] = [91, 106, 191]; // #5B6ABF
const TEXT: [number, number, number] = [40, 40, 40];
const MUTED: [number, number, number] = [110, 110, 110];

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export async function generateCompanyReportPdf(d: CompanyReportData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let y = 0;

  const LOGO = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png';
  const FOOTER_BANNER = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/email-footer-banner.png';

  const drawHeader = async () => {
    pdf.setFillColor(...PRIMARY);
    pdf.rect(0, 0, pageW, 28, 'F');
    try {
      const logo = await loadImage(LOGO);
      pdf.addImage(logo, 'PNG', margin, 6, 16, 16);
    } catch {}
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('InnerSpark Africa', margin + 20, 14);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Corporate Mental Health Report', margin + 20, 20);
    pdf.setTextColor(...TEXT);
    y = 36;
  };

  const drawFooterBanner = async () => {
    try {
      const banner = await loadImage(FOOTER_BANNER);
      const ratio = banner.height / banner.width;
      const bw = pageW;
      const bh = bw * ratio;
      pdf.addImage(banner, 'PNG', 0, pageH - bh, bw, bh);
    } catch {
      pdf.setFillColor(...PRIMARY);
      pdf.rect(0, pageH - 12, pageW, 12, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.text('InnerSpark Africa  •  www.innersparkafrica.com  •  info@innersparkafrica.com', pageW / 2, pageH - 5, { align: 'center' });
      pdf.setTextColor(...TEXT);
    }
  };

  const ensureSpace = async (h: number) => {
    if (y + h > pageH - 30) {
      await drawFooterBanner();
      pdf.addPage();
      await drawHeader();
    }
  };

  const h2 = async (txt: string) => {
    await ensureSpace(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(...PRIMARY);
    pdf.text(txt, margin, y);
    y += 7;
    pdf.setTextColor(...TEXT);
  };

  const para = async (txt: string, opts: { size?: number; bold?: boolean; color?: [number, number, number] } = {}) => {
    pdf.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    pdf.setFontSize(opts.size ?? 10);
    pdf.setTextColor(...(opts.color ?? TEXT));
    const lines = pdf.splitTextToSize(txt, pageW - margin * 2);
    await ensureSpace(lines.length * 5 + 2);
    pdf.text(lines, margin, y);
    y += lines.length * 5 + 2;
    pdf.setTextColor(...TEXT);
  };

  await drawHeader();

  // Title block
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text(d.company_name, margin, y);
  y += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(...MUTED);
  pdf.text(`Reporting period: ${d.reporting_period}  •  Generated: ${new Date().toLocaleDateString()}`, margin, y);
  y += 8;
  pdf.setTextColor(...TEXT);

  if (d.contact_name) {
    await para(`Hello ${d.contact_name},`, { bold: true, size: 11 });
  }
  await para(`Below is the confidential aggregated wellbeing snapshot for ${d.company_name}. All figures are anonymised — no individual employee can be identified.`);

  // Risk banner
  const isCritical = d.low_wellbeing_pct >= 30 || d.avg_who5 < 50;
  const isElevated = !isCritical && (d.low_wellbeing_pct >= 10 || d.moderate_wellbeing_pct >= 40 || d.avg_who5 < 65);
  const banner = isCritical
    ? { label: 'URGENT - High Risk Detected', bg: [254, 226, 226] as [number,number,number], color: [185, 28, 28] as [number,number,number], text: `${d.low_count} of ${d.total_completed} screened employees are in a critical wellbeing zone. Without intervention, expect rising absenteeism, presenteeism and turnover within the next 60-90 days.` }
    : isElevated
      ? { label: 'ATTENTION - Elevated Stress', bg: [254, 243, 199] as [number,number,number], color: [146, 64, 14] as [number,number,number], text: 'A meaningful share of your team is showing reduced wellbeing. Acting now prevents these cases from sliding into crisis.' }
      : { label: 'STABLE - Maintain Momentum', bg: [220, 252, 231] as [number,number,number], color: [6, 95, 70] as [number,number,number], text: 'Your team is doing well. Keep the momentum with quarterly check-ins and continued access to support.' };

  await ensureSpace(28);
  pdf.setFillColor(...banner.bg);
  pdf.roundedRect(margin, y, pageW - margin * 2, 22, 2, 2, 'F');
  pdf.setTextColor(...banner.color);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(banner.label, margin + 4, y + 6);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(...TEXT);
  const bLines = pdf.splitTextToSize(banner.text, pageW - margin * 2 - 8);
  pdf.text(bLines, margin + 4, y + 12);
  y += 28;

  // Summary stats
  await h2('At a Glance');
  const statBox = (label: string, value: string, x: number, w: number) => {
    pdf.setFillColor(244, 245, 251);
    pdf.roundedRect(x, y, w, 18, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(...PRIMARY);
    pdf.text(value, x + w / 2, y + 8, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED);
    pdf.text(label, x + w / 2, y + 14, { align: 'center' });
    pdf.setTextColor(...TEXT);
  };
  await ensureSpace(22);
  const colW = (pageW - margin * 2 - 9) / 4;
  statBox('Completed', `${d.total_completed}/${d.total_employees}`, margin, colW);
  statBox('Participation', `${d.completion_rate}%`, margin + colW + 3, colW);
  statBox('Avg WHO-5', `${d.avg_who5}%`, margin + (colW + 3) * 2, colW);
  statBox('Need Support', `${d.needs_support_count}`, margin + (colW + 3) * 3, colW);
  y += 22;

  // Distribution
  await h2('Wellbeing Distribution');
  const distBox = (label: string, count: number, pct: number, color: [number,number,number], x: number, w: number) => {
    pdf.setFillColor(249, 250, 252);
    pdf.roundedRect(x, y, w, 22, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(...color);
    pdf.text(`${pct}%`, x + w / 2, y + 9, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED);
    pdf.text(`${label} (${count})`, x + w / 2, y + 16, { align: 'center' });
    pdf.setTextColor(...TEXT);
  };
  await ensureSpace(26);
  const dW = (pageW - margin * 2 - 6) / 3;
  distBox('Healthy', d.high_count, d.high_wellbeing_pct, [34, 197, 94], margin, dW);
  distBox('At Risk', d.moderate_count, d.moderate_wellbeing_pct, [234, 179, 8], margin + dW + 3, dW);
  distBox('Critical', d.low_count, d.low_wellbeing_pct, [239, 68, 68], margin + (dW + 3) * 2, dW);
  y += 26;

  // Productivity impact
  const productivityLoss = Math.round((d.low_count * 0.30 + d.moderate_count * 0.12) * 100) / 100;
  const lostDays = Math.round(d.low_count * 22 + d.moderate_count * 9);
  await h2('Productivity & Business Impact');
  await para('Research from WHO and Deloitte shows that untreated mental health challenges reduce individual productivity by 25-35% and drive absenteeism, presenteeism, and turnover.');
  await ensureSpace(20);
  pdf.setFillColor(255, 247, 237);
  pdf.roundedRect(margin, y, pageW - margin * 2, 16, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(194, 65, 12);
  pdf.text(`~${productivityLoss}`, margin + 30, y + 7, { align: 'center' });
  pdf.text(`~${lostDays}`, pageW - margin - 30, y + 7, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(124, 45, 18);
  pdf.text('FTE-equivalent at risk', margin + 30, y + 13, { align: 'center' });
  pdf.text('Lost productive days/yr', pageW - margin - 30, y + 13, { align: 'center' });
  pdf.setTextColor(...TEXT);
  y += 20;
  await para('Every UGX 1 invested in employee mental health returns an estimated UGX 4 in productivity, retention and reduced sick leave (WHO ROI study).', { size: 9, color: MUTED });

  // Recommendations
  await h2('Recommendations');
  const recs = [
    'Activate the InnerSpark Employee Digital Mental Health Package for full coverage.',
    'Run manager training on supportive conversations and burnout prevention.',
    'Offer confidential 1:1 sessions for employees flagged as needing support.',
    'Schedule the next quarterly Mind-Check & WHO-5 in 90 days.',
  ];
  for (const r of recs) await para(`•  ${r}`);

  // Solution package — new page for clarity
  await drawFooterBanner();
  pdf.addPage();
  await drawHeader();

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...PRIMARY);
  pdf.text('RECOMMENDED SOLUTION', margin, y);
  y += 6;
  pdf.setFontSize(18);
  pdf.setTextColor(...TEXT);
  pdf.text('Employee Digital Mental Health Package', margin, y);
  y += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(...MUTED);
  pdf.text('Insurance-style yearly subscription per employee — predictable, budget-friendly, fully virtual.', margin, y);
  y += 8;
  pdf.setTextColor(...TEXT);

  await para('Coverage includes:', { bold: true, size: 11 });
  await para('•  Video Teletherapy — 12 1:1 sessions / year with licensed therapists');
  await para('•  Support Group — 48 weekly structured online group sessions');
  await para('•  Chat Consultation — Quick virtual mental health guidance (~12/month)');
  await para('•  Quarterly Screening — Mind-Check & WHO-5 assessments');

  await para('Excluded:', { bold: true, size: 11 });
  await para('•  Any in-person intervention beyond the virtual scope');
  await para('•  Medication, hospitalization or specialised therapy outside the platform');

  // Fee table
  await h2('Fee Breakdown (per employee / year)');
  const tCols = [pageW - margin * 2 - 70, 30, 40];
  const tx = [margin, margin + tCols[0], margin + tCols[0] + tCols[1]];
  await ensureSpace(8);
  pdf.setFillColor(...PRIMARY);
  pdf.rect(margin, y, pageW - margin * 2, 7, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Service', tx[0] + 2, y + 5);
  pdf.text('Units', tx[1] + 2, y + 5);
  pdf.text('Total (UGX)', tx[2] + 2, y + 5);
  y += 7;
  pdf.setTextColor(...TEXT);
  pdf.setFont('helvetica', 'normal');

  const rows = [
    ['Video Teletherapy', '12 / yr', '900,000'],
    ['Support Group', '48 / yr', '1,200,000'],
    ['Chat Consultation', '~12 / mo', '360,000'],
  ];
  rows.forEach((r, i) => {
    if (i % 2 === 1) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, pageW - margin * 2, 7, 'F');
    }
    pdf.text(r[0], tx[0] + 2, y + 5);
    pdf.text(r[1], tx[1] + 2, y + 5);
    pdf.text(r[2], tx[2] + 2, y + 5);
    y += 7;
  });
  pdf.setFillColor(254, 249, 195);
  pdf.rect(margin, y, pageW - margin * 2, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.text('Discounted bundled fee', tx[0] + 2, y + 5);
  pdf.text('—', tx[1] + 2, y + 5);
  pdf.text('UGX 1,000,000', tx[2] + 2, y + 5);
  y += 12;

  pdf.setFont('helvetica', 'normal');
  await para(`For ${d.total_employees} employees, full-year coverage = approx UGX ${(d.total_employees * 1_000_000).toLocaleString('en-UG')}. Employees access every service anytime through the InnerSpark App.`, { bold: true });

  await para('Confidentiality: Individual employee responses are private and never shared. Reports are based on group-level aggregates only.', { size: 9, color: [6, 95, 70] });

  await para('Contact us: info@innersparkafrica.com  •  www.innersparkafrica.com', { size: 9, color: MUTED });

  await drawFooterBanner();

  return pdf.output('blob');
}
