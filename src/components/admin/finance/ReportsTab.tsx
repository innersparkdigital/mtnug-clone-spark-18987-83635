import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download, FileSpreadsheet, TrendingUp, TrendingDown, DollarSign, RefreshCw, FileDown, Scale, BookOpen, Receipt,
} from 'lucide-react';
import {
  Period, SERVICE_LABELS, filterByPeriod, exportCSV, exportXLSX, formatUGX,
  periodLabel, getPeriodRange, exportFinancialPDF, DateRange,
} from '@/lib/financeExports';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area,
} from 'recharts';
import { useTaxCodes } from '@/hooks/useTaxCodes';

interface IncomeRow {
  id: string;
  income_date: string;
  amount: number;
  net_amount: number;
  linked_expense_total: number;
  service_type: string;
  custom_service: string | null;
  client_name: string | null;
  reference: string | null;
  source: string;
  is_taxable: boolean;
  tax_code_id: string | null;
}

interface ExpenseRow {
  id: string;
  expense_date: string;
  amount: number;
  category: string;
  custom_category: string | null;
  description: string;
  is_tax_deductible: boolean;
  tax_code_id: string | null;
  linked_income_id: string | null;
}

interface InvoiceRow {
  id: string;
  invoice_number: string;
  status: string;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
}

const ReportsTab = () => {
  const { taxCodes } = useTaxCodes();
  const [period, setPeriod] = useState<Period>('monthly');
  const [customRange, setCustomRange] = useState<DateRange>({});
  const [income, setIncome] = useState<IncomeRow[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAll = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    const [incRes, expRes, invRes] = await Promise.all([
      supabase.from('income_entries').select('*').order('income_date', { ascending: false }),
      supabase.from('expenses').select('*').order('expense_date', { ascending: false }),
      supabase.from('invoices').select('id,invoice_number,status,total_amount,amount_paid,balance_due'),
    ]);
    setIncome((incRes.data || []) as unknown as IncomeRow[]);
    setExpenses((expRes.data || []) as unknown as ExpenseRow[]);
    setInvoices((invRes.data || []) as unknown as InvoiceRow[]);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const channel = supabase.channel('reports-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'income_entries' }, () => fetchAll(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => fetchAll(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => fetchAll(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchAll(false))
      .subscribe();
    const interval = setInterval(() => fetchAll(false), 30000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [fetchAll]);

  const incomeFiltered = useMemo(
    () => filterByPeriod(income.map(i => ({ ...i, date: i.income_date })), period, customRange),
    [income, period, customRange]
  );
  const expensesFiltered = useMemo(
    () => filterByPeriod(expenses.map(e => ({ ...e, date: e.expense_date })), period, customRange),
    [expenses, period, customRange]
  );

  const totalIncome = incomeFiltered.reduce((s, i) => s + Number(i.amount), 0);
  const totalNetIncome = incomeFiltered.reduce((s, i) => s + Number(i.net_amount || i.amount), 0);
  const totalExpenses = expensesFiltered.reduce((s, e) => s + Number(e.amount), 0);
  const linkedExpenses = expensesFiltered.filter(e => e.linked_income_id).reduce((s, e) => s + Number(e.amount), 0);
  const generalExpenses = totalExpenses - linkedExpenses;
  const netProfit = totalIncome - totalExpenses;

  const pLabel = periodLabel(period, customRange);

  // Cash flow over time (group by day)
  const cashFlowData = useMemo(() => {
    const map = new Map<string, { date: string; income: number; expenses: number }>();
    incomeFiltered.forEach(i => {
      const k = new Date(i.income_date).toISOString().slice(0, 10);
      const cur = map.get(k) || { date: k, income: 0, expenses: 0 };
      cur.income += Number(i.amount);
      map.set(k, cur);
    });
    expensesFiltered.forEach(e => {
      const k = new Date(e.expense_date).toISOString().slice(0, 10);
      const cur = map.get(k) || { date: k, income: 0, expenses: 0 };
      cur.expenses += Number(e.amount);
      map.set(k, cur);
    });
    let running = 0;
    return Array.from(map.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => {
        running += d.income - d.expenses;
        return { ...d, net: d.income - d.expenses, running };
      });
  }, [incomeFiltered, expensesFiltered]);

  const incomeByService = incomeFiltered.reduce<Record<string, { gross: number; net: number }>>((acc, i) => {
    const key = i.service_type === 'other' && i.custom_service ? i.custom_service : (SERVICE_LABELS[i.service_type] || i.service_type);
    if (!acc[key]) acc[key] = { gross: 0, net: 0 };
    acc[key].gross += Number(i.amount);
    acc[key].net += Number(i.net_amount || i.amount);
    return acc;
  }, {});

  const expensesByCategory = expensesFiltered.reduce<Record<string, number>>((acc, e) => {
    const key = e.category === 'other' && e.custom_category ? e.custom_category : e.category;
    acc[key] = (acc[key] || 0) + Number(e.amount);
    return acc;
  }, {});

  // Balance Sheet (lightweight, derived)
  const totalReceivables = invoices
    .filter(i => ['sent', 'overdue', 'partially_paid'].includes(i.status))
    .reduce((s, i) => s + Number(i.balance_due), 0);
  const allTimeIncome = income.reduce((s, i) => s + Number(i.amount), 0);
  const allTimeExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const cashBalance = allTimeIncome - allTimeExpenses;
  const retainedEarnings = cashBalance;
  const totalAssets = cashBalance + totalReceivables;
  const totalLiabilities = 0;
  const totalEquity = totalAssets - totalLiabilities;

  // Trial balance
  const trialBalance = [
    { account: 'Cash & Bank', debit: Math.max(cashBalance, 0), credit: 0 },
    { account: 'Accounts Receivable', debit: totalReceivables, credit: 0 },
    { account: 'Revenue (Income)', debit: 0, credit: allTimeIncome },
    { account: 'Operating Expenses', debit: allTimeExpenses, credit: 0 },
    { account: 'Retained Earnings', debit: 0, credit: retainedEarnings },
  ];
  const totalDebits = trialBalance.reduce((s, t) => s + t.debit, 0);
  const totalCredits = trialBalance.reduce((s, t) => s + t.credit, 0);

  // Tax summary
  const taxableIncome = incomeFiltered.filter(i => i.is_taxable).reduce((s, i) => s + Number(i.amount), 0);
  const exemptIncome = incomeFiltered.filter(i => !i.is_taxable).reduce((s, i) => s + Number(i.amount), 0);
  const deductibleExpenses = expensesFiltered.filter(e => e.is_tax_deductible).reduce((s, e) => s + Number(e.amount), 0);
  const nonDeductible = totalExpenses - deductibleExpenses;
  const taxableProfit = taxableIncome - deductibleExpenses;

  const taxByCode = incomeFiltered.reduce<Record<string, { name: string; rate: number; base: number; tax: number }>>((acc, i) => {
    if (!i.tax_code_id) return acc;
    const tc = taxCodes.find(t => t.id === i.tax_code_id);
    if (!tc) return acc;
    if (!acc[tc.id]) acc[tc.id] = { name: tc.name, rate: tc.rate, base: 0, tax: 0 };
    acc[tc.id].base += Number(i.amount);
    acc[tc.id].tax += Number(i.amount) * (Number(tc.rate) / 100);
    return acc;
  }, {});

  // Exports
  const buildSheets = () => ({
    'P&L Summary': [
      { Metric: 'Total Income (Gross)', Value: totalIncome },
      { Metric: 'Linked Expenses', Value: linkedExpenses },
      { Metric: 'Net Income (after offsets)', Value: totalNetIncome },
      { Metric: 'General Expenses', Value: generalExpenses },
      { Metric: 'Total Expenses', Value: totalExpenses },
      { Metric: 'Net Profit/Loss', Value: netProfit },
      { Metric: 'Period', Value: pLabel },
      { Metric: 'Generated', Value: new Date().toLocaleString() },
    ],
    'Income by Service': Object.entries(incomeByService).map(([Service, v]) => ({ Service, 'Gross (UGX)': v.gross, 'Net (UGX)': v.net })),
    'Expenses by Category': Object.entries(expensesByCategory).map(([Category, Amount]) => ({ Category, 'Amount (UGX)': Amount })),
    'Cash Flow': cashFlowData.map(d => ({ Date: d.date, Income: d.income, Expenses: d.expenses, Net: d.net, 'Running Balance': d.running })),
    'Balance Sheet': [
      { Section: 'ASSETS', Account: 'Cash & Bank', 'Amount (UGX)': cashBalance },
      { Section: 'ASSETS', Account: 'Accounts Receivable', 'Amount (UGX)': totalReceivables },
      { Section: 'ASSETS', Account: 'Total Assets', 'Amount (UGX)': totalAssets },
      { Section: 'LIABILITIES', Account: 'Total Liabilities', 'Amount (UGX)': totalLiabilities },
      { Section: 'EQUITY', Account: 'Retained Earnings', 'Amount (UGX)': retainedEarnings },
      { Section: 'EQUITY', Account: 'Total Equity', 'Amount (UGX)': totalEquity },
    ],
    'Trial Balance': trialBalance.map(t => ({ Account: t.account, 'Debit (UGX)': t.debit, 'Credit (UGX)': t.credit })),
    'Tax Summary': [
      { Metric: 'Taxable Income', Value: taxableIncome },
      { Metric: 'Exempt Income', Value: exemptIncome },
      { Metric: 'Deductible Expenses', Value: deductibleExpenses },
      { Metric: 'Non-Deductible Expenses', Value: nonDeductible },
      { Metric: 'Taxable Profit', Value: taxableProfit },
      ...Object.values(taxByCode).map(t => ({ Metric: `${t.name} (${t.rate}%) - Base`, Value: t.base })),
      ...Object.values(taxByCode).map(t => ({ Metric: `${t.name} (${t.rate}%) - Tax`, Value: t.tax })),
    ],
    'Income Detail': incomeFiltered.map(i => ({
      Date: new Date(i.income_date).toLocaleDateString(),
      Service: i.service_type === 'other' ? i.custom_service : (SERVICE_LABELS[i.service_type] || i.service_type),
      Client: i.client_name || '',
      Reference: i.reference || '',
      Source: i.source,
      'Gross (UGX)': Number(i.amount),
      'Net (UGX)': Number(i.net_amount || i.amount),
    })),
    'Expenses Detail': expensesFiltered.map(e => ({
      Date: new Date(e.expense_date).toLocaleDateString(),
      Category: e.category === 'other' ? e.custom_category : e.category,
      Description: e.description,
      'Amount (UGX)': Number(e.amount),
      Linked: e.linked_income_id ? 'Yes' : 'No',
      Deductible: e.is_tax_deductible ? 'Yes' : 'No',
    })),
  });

  const handleExportXLSX = () =>
    exportXLSX(buildSheets(), `innerspark-financial-report-${period}-${new Date().toISOString().slice(0,10)}`);

  const handleExportCSV = (kind: 'income' | 'expenses' | 'pnl' | 'balance' | 'tax') => {
    const sheets = buildSheets();
    const map = {
      income: 'Income Detail', expenses: 'Expenses Detail', pnl: 'P&L Summary',
      balance: 'Balance Sheet', tax: 'Tax Summary',
    } as const;
    exportCSV(sheets[map[kind]] as any[], `innerspark-${kind}-${period}-${new Date().toISOString().slice(0,10)}`);
  };

  const handleExportPDF = async () => {
    await exportFinancialPDF({
      title: 'Financial Report',
      rangeLabel: pLabel,
      filename: `innerspark-financial-report-${period}-${new Date().toISOString().slice(0,10)}`,
      summary: [
        { label: 'Income', value: formatUGX(totalIncome), highlight: 'income' },
        { label: 'Expenses', value: formatUGX(totalExpenses), highlight: 'expense' },
        { label: 'Net Profit', value: formatUGX(netProfit), highlight: 'net' },
      ],
      sections: [
        {
          heading: 'Income by Service',
          rows: Object.entries(incomeByService).map(([k, v]) => ({ label: k, value: `${formatUGX(v.gross)} (net ${formatUGX(v.net)})` })),
        },
        {
          heading: 'Expenses by Category',
          rows: Object.entries(expensesByCategory).map(([k, v]) => ({ label: k, value: formatUGX(v) })),
        },
        {
          heading: 'Balance Sheet (as of today)',
          rows: [
            { label: 'Cash & Bank', value: formatUGX(cashBalance) },
            { label: 'Accounts Receivable', value: formatUGX(totalReceivables) },
            { label: 'Total Assets', value: formatUGX(totalAssets) },
            { label: 'Total Liabilities', value: formatUGX(totalLiabilities) },
            { label: 'Total Equity', value: formatUGX(totalEquity) },
          ],
        },
        {
          heading: 'Tax Summary',
          rows: [
            { label: 'Taxable Income', value: formatUGX(taxableIncome) },
            { label: 'Deductible Expenses', value: formatUGX(deductibleExpenses) },
            { label: 'Taxable Profit', value: formatUGX(taxableProfit) },
            ...Object.values(taxByCode).map(t => ({ label: `${t.name} on ${formatUGX(t.base)}`, value: formatUGX(t.tax) })),
          ],
        },
      ],
    });
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading reports...</div>;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-end justify-between flex-wrap">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Reporting Period</Label>
              <Select value={period} onValueChange={(v: Period) => setPeriod(v)}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Today</SelectItem>
                  <SelectItem value="weekly">This Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                  <SelectItem value="yearly">This Year</SelectItem>
                  <SelectItem value="financial_year">Financial Year (Jul–Jun)</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {period === 'custom' && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">From</Label>
                  <Input type="date" className="w-[160px]" value={customRange.start ? customRange.start.toISOString().slice(0,10) : ''}
                    onChange={e => setCustomRange(r => ({ ...r, start: e.target.value ? new Date(e.target.value) : undefined }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">To</Label>
                  <Input type="date" className="w-[160px]" value={customRange.end ? customRange.end.toISOString().slice(0,10) : ''}
                    onChange={e => setCustomRange(r => ({ ...r, end: e.target.value ? new Date(e.target.value + 'T23:59:59') : undefined }))} />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => fetchAll(false)}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleExportCSV('pnl')}>
              <Download className="h-3.5 w-3.5" /> P&L CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={handleExportPDF}>
              <FileDown className="h-3.5 w-3.5" /> PDF
            </Button>
            <Button size="sm" className="gap-1" onClick={handleExportXLSX}>
              <FileSpreadsheet className="h-3.5 w-3.5" /> Full Excel
            </Button>
          </div>
        </div>
      </Card>

      {/* P&L Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Income (Gross)</p>
            <p className="text-2xl font-bold text-emerald-700">{formatUGX(totalIncome)}</p>
            <p className="text-xs text-muted-foreground mt-1">{incomeFiltered.length} transactions</p>
            <TrendingUp className="h-6 w-6 text-emerald-500/40 absolute top-4 right-4" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Expenses</p>
            <p className="text-2xl font-bold text-red-700">{formatUGX(totalExpenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">{linkedExpenses ? `${formatUGX(linkedExpenses)} linked` : `${expensesFiltered.length} entries`}</p>
            <TrendingDown className="h-6 w-6 text-red-500/40 absolute top-4 right-4" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Net Income (after offset)</p>
            <p className="text-2xl font-bold text-blue-700">{formatUGX(totalNetIncome)}</p>
            <p className="text-xs text-muted-foreground mt-1">After linked expenses</p>
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-primary/10 to-primary/5 border-primary/20' : 'from-amber-500/10 to-amber-600/5 border-amber-500/20'}`}>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Net {netProfit >= 0 ? 'Profit' : 'Loss'}</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-primary' : 'text-amber-700'}`}>{formatUGX(Math.abs(netProfit))}</p>
            <p className="text-xs text-muted-foreground mt-1">{pLabel}</p>
            <DollarSign className="h-6 w-6 text-primary/40 absolute top-4 right-4" />
          </CardContent>
        </Card>
      </div>

      {/* Tabbed reports */}
      <Tabs defaultValue="cashflow" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="cashflow" className="gap-1"><TrendingUp className="h-3.5 w-3.5" /> Cash Flow</TabsTrigger>
          <TabsTrigger value="pnl" className="gap-1"><BookOpen className="h-3.5 w-3.5" /> P&L Detail</TabsTrigger>
          <TabsTrigger value="balance" className="gap-1"><Scale className="h-3.5 w-3.5" /> Balance Sheet</TabsTrigger>
          <TabsTrigger value="trial" className="gap-1">Trial Balance</TabsTrigger>
          <TabsTrigger value="tax" className="gap-1"><Receipt className="h-3.5 w-3.5" /> Tax Summary</TabsTrigger>
        </TabsList>

        {/* Cash Flow */}
        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Cash Flow — Income vs Expenses ({pLabel})</CardTitle></CardHeader>
            <CardContent>
              {cashFlowData.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No transactions in this period</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 6 }}
                      formatter={(v: number) => formatUGX(v)}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="hsl(142 71% 45%)" strokeWidth={2} name="Income" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="expenses" stroke="hsl(0 84% 60%)" strokeWidth={2} name="Expenses" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Running Net Balance</CardTitle></CardHeader>
            <CardContent>
              {cashFlowData.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">—</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="netG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 6 }}
                      formatter={(v: number) => formatUGX(v)} />
                    <Area type="monotone" dataKey="running" stroke="hsl(var(--primary))" fill="url(#netG)" name="Net" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* P&L */}
        <TabsContent value="pnl" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex justify-between items-center">
                  <span>Income by Service</span>
                  <Button size="sm" variant="ghost" onClick={() => handleExportCSV('income')} className="h-7 gap-1">
                    <Download className="h-3 w-3" /> CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {Object.entries(incomeByService).length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4">No income</TableCell></TableRow>
                    ) : Object.entries(incomeByService).sort((a, b) => b[1].gross - a[1].gross).map(([svc, v]) => (
                      <TableRow key={svc}>
                        <TableCell className="font-medium">{svc}</TableCell>
                        <TableCell className="text-right text-emerald-700">{formatUGX(v.gross)}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">{formatUGX(v.net)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex justify-between items-center">
                  <span>Expenses by Category</span>
                  <Button size="sm" variant="ghost" onClick={() => handleExportCSV('expenses')} className="h-7 gap-1">
                    <Download className="h-3 w-3" /> CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right w-[80px]">%</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {Object.entries(expensesByCategory).length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4">No expenses</TableCell></TableRow>
                    ) : Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                      <TableRow key={cat}>
                        <TableCell className="font-medium capitalize">{cat}</TableCell>
                        <TableCell className="text-right font-semibold text-red-700">{formatUGX(amt)}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{totalExpenses ? Math.round((amt / totalExpenses) * 100) : 0}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex justify-between items-center">
                <span>Balance Sheet (as of {new Date().toLocaleDateString()})</span>
                <Button size="sm" variant="ghost" onClick={() => handleExportCSV('balance')} className="h-7 gap-1">
                  <Download className="h-3 w-3" /> CSV
                </Button>
              </CardTitle>
              <p className="text-xs text-muted-foreground">Lightweight derivation: Cash = total income − total expenses; Receivables = unpaid invoices; Equity = retained earnings</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-emerald-700 mb-2 text-sm uppercase tracking-wide">Assets</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Cash & Bank</span><span className="font-medium">{formatUGX(cashBalance)}</span></div>
                    <div className="flex justify-between"><span>Accounts Receivable</span><span className="font-medium">{formatUGX(totalReceivables)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2 font-bold"><span>Total Assets</span><span className="text-emerald-700">{formatUGX(totalAssets)}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-red-700 mb-2 text-sm uppercase tracking-wide">Liabilities & Equity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Total Liabilities</span><span>{formatUGX(totalLiabilities)}</span></div>
                    <div className="flex justify-between"><span>Retained Earnings</span><span className="font-medium">{formatUGX(retainedEarnings)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2 font-bold"><span>Total L+E</span><span className="text-red-700">{formatUGX(totalLiabilities + totalEquity)}</span></div>
                  </div>
                </div>
              </div>
              <div className={`mt-4 p-3 rounded text-xs text-center ${Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1 ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'}`}>
                {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1
                  ? '✓ Balance sheet is balanced'
                  : `⚠ Imbalance: ${formatUGX(Math.abs(totalAssets - (totalLiabilities + totalEquity)))}`}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trial Balance */}
        <TabsContent value="trial">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trial Balance (all-time)</CardTitle>
              <p className="text-xs text-muted-foreground">Verifies double-entry consistency: total debits should equal total credits</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {trialBalance.map(t => (
                    <TableRow key={t.account}>
                      <TableCell className="font-medium">{t.account}</TableCell>
                      <TableCell className="text-right">{t.debit > 0 ? formatUGX(t.debit) : '—'}</TableCell>
                      <TableCell className="text-right">{t.credit > 0 ? formatUGX(t.credit) : '—'}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right text-primary">{formatUGX(totalDebits)}</TableCell>
                    <TableCell className="text-right text-primary">{formatUGX(totalCredits)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className={`mt-4 p-3 rounded text-xs text-center ${Math.abs(totalDebits - totalCredits) < 1 ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'}`}>
                {Math.abs(totalDebits - totalCredits) < 1
                  ? '✓ Debits equal Credits — books balance'
                  : `⚠ Difference: ${formatUGX(Math.abs(totalDebits - totalCredits))}`}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Summary */}
        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex justify-between items-center">
                <span>Tax Summary — {pLabel}</span>
                <Button size="sm" variant="ghost" onClick={() => handleExportCSV('tax')} className="h-7 gap-1">
                  <Download className="h-3 w-3" /> CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-500/5 p-3 rounded border border-emerald-500/20">
                  <p className="text-xs text-muted-foreground">Taxable Income</p>
                  <p className="text-xl font-bold text-emerald-700">{formatUGX(taxableIncome)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Exempt: {formatUGX(exemptIncome)}</p>
                </div>
                <div className="bg-blue-500/5 p-3 rounded border border-blue-500/20">
                  <p className="text-xs text-muted-foreground">Deductible Expenses</p>
                  <p className="text-xl font-bold text-blue-700">{formatUGX(deductibleExpenses)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Non-deductible: {formatUGX(nonDeductible)}</p>
                </div>
              </div>
              <div className="bg-primary/5 p-4 rounded border border-primary/20 mb-6">
                <p className="text-xs text-muted-foreground uppercase">Taxable Profit</p>
                <p className="text-2xl font-bold text-primary">{formatUGX(taxableProfit)}</p>
              </div>
              <h4 className="font-semibold text-sm mb-2">Tax by Code</h4>
              {Object.values(taxByCode).length === 0 ? (
                <p className="text-sm text-muted-foreground">No income with tax codes assigned in this period.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Tax Code</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Taxable Base</TableHead>
                    <TableHead className="text-right">Tax Due</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {Object.values(taxByCode).map((t, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell className="text-right">{t.rate}%</TableCell>
                        <TableCell className="text-right">{formatUGX(t.base)}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">{formatUGX(t.tax)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsTab;
