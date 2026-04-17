import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileSpreadsheet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Period, SERVICE_LABELS, filterByPeriod, exportCSV, exportXLSX, formatUGX } from '@/lib/financeExports';

const ReportsTab = () => {
  const [period, setPeriod] = useState<Period>('monthly');
  const [income, setIncome] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [incRes, expRes] = await Promise.all([
      supabase.from('income_entries').select('*').order('income_date', { ascending: false }),
      supabase.from('expenses').select('*').order('expense_date', { ascending: false }),
    ]);
    setIncome(incRes.data || []);
    setExpenses(expRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const incomeFiltered = useMemo(
    () => filterByPeriod(income.map(i => ({ ...i, date: i.income_date })), period),
    [income, period]
  );
  const expensesFiltered = useMemo(
    () => filterByPeriod(expenses.map(e => ({ ...e, date: e.expense_date })), period),
    [expenses, period]
  );

  const totalIncome = incomeFiltered.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpenses = expensesFiltered.reduce((s, e) => s + Number(e.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  const incomeByService = incomeFiltered.reduce<Record<string, number>>((acc, i) => {
    const key = i.service_type === 'other' && i.custom_service ? i.custom_service : (SERVICE_LABELS[i.service_type] || i.service_type);
    acc[key] = (acc[key] || 0) + Number(i.amount);
    return acc;
  }, {});

  const expensesByCategory = expensesFiltered.reduce<Record<string, number>>((acc, e) => {
    const key = e.category === 'other' && e.custom_category ? e.custom_category : e.category;
    acc[key] = (acc[key] || 0) + Number(e.amount);
    return acc;
  }, {});

  const periodLabel = {
    daily: 'Today', weekly: 'This Week', monthly: 'This Month',
    yearly: 'This Year', financial_year: 'Financial Year (Jul–Jun)', all: 'All Time',
  }[period];

  const buildExportSheets = () => ({
    'Profit & Loss Summary': [
      { Metric: 'Total Income', Value: totalIncome },
      { Metric: 'Total Expenses', Value: totalExpenses },
      { Metric: 'Net Profit/Loss', Value: netProfit },
      { Metric: 'Period', Value: periodLabel },
      { Metric: 'Generated', Value: new Date().toLocaleString() },
    ],
    'Income by Service': Object.entries(incomeByService).map(([Service, Amount]) => ({ Service, 'Amount (UGX)': Amount })),
    'Expenses by Category': Object.entries(expensesByCategory).map(([Category, Amount]) => ({ Category, 'Amount (UGX)': Amount })),
    'Income Detail': incomeFiltered.map(i => ({
      Date: new Date(i.income_date).toLocaleDateString(),
      Service: i.service_type === 'other' ? i.custom_service : (SERVICE_LABELS[i.service_type] || i.service_type),
      Client: i.client_name || '',
      Reference: i.reference || '',
      Source: i.source,
      'Amount (UGX)': Number(i.amount),
    })),
    'Expenses Detail': expensesFiltered.map(e => ({
      Date: new Date(e.expense_date).toLocaleDateString(),
      Category: e.category === 'other' ? e.custom_category : e.category,
      Description: e.description,
      'Amount (UGX)': Number(e.amount),
    })),
  });

  const handleExportXLSX = () => {
    exportXLSX(buildExportSheets(), `innerspark-financial-report-${period}-${new Date().toISOString().slice(0,10)}`);
  };

  const handleExportCSV = (kind: 'income' | 'expenses' | 'pnl') => {
    const sheets = buildExportSheets();
    const map = { income: 'Income Detail', expenses: 'Expenses Detail', pnl: 'Profit & Loss Summary' } as const;
    exportCSV(sheets[map[kind]] as any[], `innerspark-${kind}-${period}-${new Date().toISOString().slice(0,10)}`);
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading reports...</div>;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end justify-between flex-wrap">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Reporting Period</Label>
            <Select value={period} onValueChange={(v: Period) => setPeriod(v)}>
              <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
                <SelectItem value="financial_year">Financial Year (Jul–Jun)</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleExportCSV('income')}>
              <Download className="h-3.5 w-3.5" /> Income CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleExportCSV('expenses')}>
              <Download className="h-3.5 w-3.5" /> Expenses CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleExportCSV('pnl')}>
              <Download className="h-3.5 w-3.5" /> P&L CSV
            </Button>
            <Button size="sm" className="gap-1" onClick={handleExportXLSX}>
              <FileSpreadsheet className="h-3.5 w-3.5" /> Full Excel Report
            </Button>
          </div>
        </div>
      </Card>

      {/* P&L Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Income</p>
                <p className="text-2xl font-bold text-emerald-700">{formatUGX(totalIncome)}</p>
                <p className="text-xs text-muted-foreground mt-1">{incomeFiltered.length} transactions</p>
              </div>
              <TrendingUp className="h-10 w-10 text-emerald-500/70" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">{formatUGX(totalExpenses)}</p>
                <p className="text-xs text-muted-foreground mt-1">{expensesFiltered.length} entries</p>
              </div>
              <TrendingDown className="h-10 w-10 text-red-500/70" />
            </div>
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-500/10 to-blue-600/5 border-blue-500/20' : 'from-amber-500/10 to-amber-600/5 border-amber-500/20'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Net {netProfit >= 0 ? 'Profit' : 'Loss'}</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>{formatUGX(Math.abs(netProfit))}</p>
                <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
              </div>
              <DollarSign className={`h-10 w-10 ${netProfit >= 0 ? 'text-blue-500/70' : 'text-amber-500/70'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Income by Service</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right w-[80px]">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(incomeByService).length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4">No income data</TableCell></TableRow>
                ) : Object.entries(incomeByService).sort((a, b) => b[1] - a[1]).map(([svc, amt]) => (
                  <TableRow key={svc}>
                    <TableCell className="font-medium">{svc}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-700">{formatUGX(amt)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{totalIncome ? Math.round((amt / totalIncome) * 100) : 0}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right w-[80px]">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(expensesByCategory).length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4">No expense data</TableCell></TableRow>
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

      {/* Cash flow summary */}
      <Card>
        <CardHeader><CardTitle className="text-base">Cash Flow Summary — {periodLabel}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">💰 Cash In (Income)</span>
              <span className="font-semibold text-emerald-700">{formatUGX(totalIncome)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">💸 Cash Out (Expenses)</span>
              <span className="font-semibold text-red-700">-{formatUGX(totalExpenses)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold">Net Cash Flow</span>
              <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {netProfit >= 0 ? '+' : ''}{formatUGX(netProfit)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
