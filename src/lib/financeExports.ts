import * as XLSX from 'xlsx';

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'financial_year' | 'all';

export const SERVICE_LABELS: Record<string, string> = {
  therapy: 'Therapy Sessions',
  support_group: 'Support Groups',
  chat_consultation: 'Chat Consultation',
  corporate: 'Corporate Services',
  app_service: 'App-based Services',
  training: 'Trainings',
  other: 'Other',
};

export const filterByPeriod = <T extends { date: string | Date }>(
  rows: T[],
  period: Period,
  customStart?: Date,
  customEnd?: Date
): T[] => {
  if (period === 'all') return rows;
  const now = new Date();
  let start: Date;
  let end: Date = customEnd ?? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

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
      // UG financial year: July - June
      const fyStartYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
      start = new Date(fyStartYear, 6, 1);
      end = new Date(fyStartYear + 1, 5, 30, 23, 59, 59);
      break;
    }
    default:
      return rows;
  }
  if (customStart) start = customStart;
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
