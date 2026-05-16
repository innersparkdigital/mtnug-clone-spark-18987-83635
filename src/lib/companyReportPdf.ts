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
  // Optional: 10-section toggle map (key -> on). When omitted, all sections render.
  sections?: Record<string, boolean>;
  // Optional manual layer
  observations?: string | null;
  recommended_services?: Array<{ name: string; description?: string | null; physical_price?: number | null; virtual_price?: number | null; per_employee_price?: number | null; unit_label?: string | null; reason?: string | null }>;
  business_impact?: { productivity_loss_fte?: number; lost_days_per_year?: number; estimated_annual_cost_ugx?: number; estimated_roi_ugx?: number } | null;
  // Per-section consultant overrides — when set, replaces auto content for that section
  section_overrides?: Record<string, string>;
  // Rich data layer — mirrors the on-screen Report Preview
  gender_breakdown?: Array<{ label: string; enrolled: number; completed: number }>;
  question_averages?: Array<{ short_label: string; avg: number; status: 'green' | 'amber' | 'red'; flag_name: string }>;
  triggered_clusters_detailed?: Array<{ label: string; interpretation: string }>;
  triggered_flags_detailed?: Array<{ flag_name: string; affected_employees: number; average_pct: number; recommendation: string; service_label: string; productivity_cost_days_per_month: number }>;
  action_plan?: Array<{ week: number; title: string; items: string[] }>;
  business_impact_extended?: {
    annual_cost_min?: number; annual_cost_mid?: number; annual_cost_max?: number;
    lost_days_min?: number; lost_days_max?: number;
    eap_investment?: number; projected_roi_x?: number; monthly_cost?: number;
  } | null;
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
    // Footer banner intentionally removed to maximise content space per page.
    // Keep a thin brand strip with contact info instead.
    pdf.setFillColor(...PRIMARY);
    pdf.rect(0, pageH - 8, pageW, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text('InnerSpark Africa  •  www.innersparkafrica.com  •  info@innersparkafrica.com', pageW / 2, pageH - 3, { align: 'center' });
    pdf.setTextColor(...TEXT);
  };

  const ensureSpace = async (h: number) => {
    if (y + h > pageH - 14) {
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

  const sec = (key: string) => !d.sections || d.sections[key] !== false;
  const ov = (key: string) => {
    const t = d.section_overrides?.[key];
    return t && t.trim() ? t.trim() : null;
  };
  const renderOverride = async (text: string) => {
    await para(text);
  };

  const fmtUGX = (n: number) => `UGX ${Math.round(n).toLocaleString('en-UG')}`;
  const dotFor = (s: 'green' | 'amber' | 'red') => s === 'green' ? '●' : s === 'amber' ? '●' : '●';
  const colorFor = (s: 'green' | 'amber' | 'red'): [number, number, number] =>
    s === 'green' ? [34, 197, 94] : s === 'amber' ? [234, 179, 8] : [239, 68, 68];
  const sectionHeader = async (n: number, label: string) => {
    await h2(`${n}. ${label}`);
  };

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

  // ===== 1. Cover & Summary =====
  if (sec('cover')) {
    await sectionHeader(1, 'Cover & Summary');
    if (ov('cover')) {
      await renderOverride(ov('cover')!);
    } else {
      await para(`${d.company_name} — Wellbeing Report (${d.reporting_period})`, { bold: true });
      await para(`Prepared by InnerSpark Africa${d.contact_name ? ` for ${d.contact_name}` : ''}.`);
      await para(`${d.total_completed} of ${d.total_employees} employees completed the WHO-5 + Workplace screening (${d.completion_rate}% participation). Average wellbeing score: ${d.avg_who5}%.`);
    }
  }

  // ===== 2. Participation & Demographics =====
  if (sec('participation')) {
    await sectionHeader(2, 'Participation & Demographics');
    if (ov('participation')) {
      await renderOverride(ov('participation')!);
    } else if (d.total_employees === 0) {
      await para('No data yet.', { size: 9, color: MUTED });
    } else {
      await para(`Total enrolled: ${d.total_employees}  ·  Completed: ${d.total_completed}  ·  Pending: ${d.total_employees - d.total_completed}  ·  Rate: ${d.completion_rate}%`);
      if (d.gender_breakdown && d.gender_breakdown.length > 0) {
        await para('Gender breakdown (enrolled / completed)', { bold: true, size: 10 });
        for (const g of d.gender_breakdown) {
          await para(`•  ${g.label}: ${g.enrolled} enrolled / ${g.completed} completed`);
        }
      }
    }
  }

  // ===== 3. Overall Wellbeing Score =====
  if (sec('overall_wellbeing')) {
    await sectionHeader(3, 'Overall Wellbeing Score');
    if (ov('overall_wellbeing')) {
      await renderOverride(ov('overall_wellbeing')!);
    } else if (d.total_completed === 0) {
      await para('No data yet.', { size: 9, color: MUTED });
    } else {
      const band = d.avg_who5 >= 76 ? 'Healthy' : d.avg_who5 >= 51 ? 'At Risk' : 'Critical';
      await para(`Company average wellbeing: ${d.avg_who5}% (${band})`, { bold: true });
      await para(`•  Healthy (76-100%): ${d.high_count} (${d.high_wellbeing_pct}%)`, { color: [34, 197, 94] });
      await para(`•  At Risk (51-75%): ${d.moderate_count} (${d.moderate_wellbeing_pct}%)`, { color: [234, 179, 8] });
      await para(`•  Critical (0-50%): ${d.low_count} (${d.low_wellbeing_pct}%)`, { color: [239, 68, 68] });
      await para(`•  Needs immediate support: ${d.needs_support_count}`);
    }
  }

  // ===== 4. Per-Question Averages =====
  if (sec('per_question')) {
    await sectionHeader(4, 'Per-Question Averages');
    if (ov('per_question')) {
      await renderOverride(ov('per_question')!);
    } else if (!d.question_averages || d.question_averages.length === 0) {
      await para('No data yet.', { size: 9, color: MUTED });
    } else {
      for (const q of d.question_averages) {
        await para(`•  ${q.short_label} — ${q.avg}% (${q.flag_name})`, { color: colorFor(q.status) });
      }
    }
  }

  // ===== 5. Triggered Clusters =====
  if (sec('triggered_clusters')) {
    await sectionHeader(5, 'Triggered Clusters');
    if (ov('triggered_clusters')) {
      await renderOverride(ov('triggered_clusters')!);
    } else if (d.total_completed === 0) {
      await para('No data yet.', { size: 9, color: MUTED });
    } else if (!d.triggered_clusters_detailed || d.triggered_clusters_detailed.length === 0) {
      await para('No clinical clusters triggered. The team is not showing combined burnout, anxiety, or depression-risk patterns.');
    } else {
      for (const c of d.triggered_clusters_detailed) {
        await para(c.label, { bold: true });
        await para(c.interpretation, { size: 9, color: MUTED });
      }
    }
  }

  // ===== 6. Priority Focus Areas =====
  if (sec('priority_areas')) {
    await sectionHeader(6, 'Priority Focus Areas');
    if (ov('priority_areas')) {
      await renderOverride(ov('priority_areas')!);
    } else if (d.total_completed === 0) {
      await para('No data yet.', { size: 9, color: MUTED });
    } else if (!d.triggered_flags_detailed || d.triggered_flags_detailed.length === 0) {
      await para('No priority concerns flagged. Sustain with quarterly check-ins.');
    } else {
      d.triggered_flags_detailed.slice(0, 5).forEach(() => {});
      let i = 1;
      for (const f of d.triggered_flags_detailed.slice(0, 5)) {
        await para(`#${i} ${f.flag_name} — ${f.affected_employees} employees affected (avg ${f.average_pct}%)`, { bold: true });
        await para(f.recommendation, { size: 9 });
        await para(`→ Suggested: ${f.service_label}  ·  ~${f.productivity_cost_days_per_month} productivity days/month at risk`, { size: 9, color: MUTED });
        i++;
      }
    }
  }

  // ===== 7. Business Impact =====
  if (sec('business_impact')) {
    await sectionHeader(7, 'Business Impact');
    if (ov('business_impact')) {
      await renderOverride(ov('business_impact')!);
    } else if (!d.business_impact_extended) {
      await para('Business Impact toggle is off, or no screenings yet.', { size: 9, color: MUTED });
    } else {
      const b = d.business_impact_extended;
      if (b.annual_cost_min != null && b.annual_cost_max != null) {
        await para(`Estimated annual cost of inaction: ${fmtUGX(b.annual_cost_min)}–${fmtUGX(b.annual_cost_max)}${b.annual_cost_mid != null ? ` (mid: ${fmtUGX(b.annual_cost_mid)})` : ''}`);
      }
      if (b.lost_days_min != null && b.lost_days_max != null) {
        await para(`Estimated productivity days lost / year: ${b.lost_days_min}–${b.lost_days_max}`);
      }
      if (b.eap_investment != null) {
        await para(`Estimated EAP investment: ${fmtUGX(b.eap_investment)}  ·  Projected ROI: ${b.projected_roi_x ?? 0}x`);
      }
      if (b.monthly_cost != null) {
        await para(`Cost of inaction per month: ${fmtUGX(b.monthly_cost)}`);
      }
    }
  }

  // ===== 8. Recommended Services =====
  if (sec('recommended_services')) {
    await sectionHeader(8, 'Recommended Services');
    if (ov('recommended_services')) {
      await renderOverride(ov('recommended_services')!);
    } else if (!d.recommended_services || d.recommended_services.length === 0) {
      await para('No services selected.', { size: 9, color: MUTED });
    } else {
      for (const s of d.recommended_services) {
        await para(`•  ${s.name}`, { bold: true });
        if (s.description) await para(`   ${s.description}`, { size: 9, color: MUTED });
        const priceBits: string[] = [];
        if (s.physical_price) priceBits.push(`Physical: UGX ${Number(s.physical_price).toLocaleString('en-UG')}`);
        if (s.virtual_price) priceBits.push(`Virtual: UGX ${Number(s.virtual_price).toLocaleString('en-UG')}`);
        if (s.per_employee_price) priceBits.push(`UGX ${Number(s.per_employee_price).toLocaleString('en-UG')} / ${s.unit_label || 'unit'}`);
        if (priceBits.length) await para(`   ${priceBits.join('  ·  ')}`, { size: 9 });
        if (s.reason) await para(`   Why: ${s.reason}`, { size: 9, color: MUTED });
      }
    }
  }

  // ===== 9. 30-Day Action Plan =====
  if (sec('action_plan')) {
    await sectionHeader(9, '30-Day Action Plan');
    if (ov('action_plan')) {
      await renderOverride(ov('action_plan')!);
    } else if (!d.action_plan || d.action_plan.length === 0) {
      await para('No data yet.', { size: 9, color: MUTED });
    } else {
      for (const w of d.action_plan) {
        await para(`Week ${w.week} — ${w.title}`, { bold: true });
        for (const it of w.items) {
          await para(`•  ${it}`, { size: 9 });
        }
      }
    }
  }

  // ===== 10. Consultant Observations =====
  if (sec('consultant_notes')) {
    await sectionHeader(10, 'Consultant Observations');
    if (ov('consultant_notes')) {
      await renderOverride(ov('consultant_notes')!);
    } else if (!d.observations || !d.observations.trim()) {
      await para('No observations entered yet.', { size: 9, color: MUTED });
    } else {
      await para(d.observations.trim());
    }
  }

  await drawFooterBanner();
  return pdf.output('blob');
}
