import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, Clock, TrendingUp, Wallet, FileDown } from 'lucide-react';
import { exportFinancialPDF, formatUGX } from '@/lib/financeExports';

const FinanceDashboardTab = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    netRevenue: 0,
    pendingPayments: 0,
    totalExpenses: 0,
    cashBalance: 0,
    netProfit: 0,
    recentInvoices: [] as any[],
    incomeByService: {} as Record<string, number>,
    expensesByCategory: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [invoiceRes, expenseRes, incomeRes] = await Promise.all([
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*'),
        supabase.from('income_entries').select('*'),
      ]);

      const invoices = (invoiceRes.data || []) as any[];
      const expenses = (expenseRes.data || []) as any[];
      const incomes = (incomeRes.data || []) as any[];

      const totalRevenue = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
      const netRevenue = incomes.reduce((sum, i) => sum + Number(i.net_amount || i.amount), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const cashBalance = totalRevenue - totalExpenses;
      const netProfit = totalRevenue - totalExpenses;
      const pendingPayments = invoices
        .filter((i) => ['sent', 'overdue', 'partially_paid'].includes(i.status))
        .reduce((sum, i) => sum + Number(i.balance_due), 0);

      const incomeByService = incomes.reduce<Record<string, number>>((acc, i) => {
        const k = i.service_type === 'other' && i.custom_service ? i.custom_service : i.service_type;
        acc[k] = (acc[k] || 0) + Number(i.amount);
        return acc;
      }, {});
      const expensesByCategory = expenses.reduce<Record<string, number>>((acc, e) => {
        const k = e.category === 'other' && e.custom_category ? e.custom_category : e.category;
        acc[k] = (acc[k] || 0) + Number(e.amount);
        return acc;
      }, {});

      setStats({
        totalInvoices: invoices.length,
        totalRevenue, netRevenue, pendingPayments, totalExpenses,
        cashBalance, netProfit,
        recentInvoices: invoices.slice(0, 5),
        incomeByService, expensesByCategory,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    const channel = supabase.channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'income_entries' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => fetchStats())
      .subscribe();
    const interval = setInterval(fetchStats, 30000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [fetchStats]);

  const handleExportPDF = async () => {
    await exportFinancialPDF({
      title: 'Finance Dashboard Snapshot',
      rangeLabel: 'All Time',
      filename: `innerspark-dashboard-${new Date().toISOString().slice(0,10)}`,
      summary: [
        { label: 'Income', value: formatUGX(stats.totalRevenue), highlight: 'income' },
        { label: 'Expenses', value: formatUGX(stats.totalExpenses), highlight: 'expense' },
        { label: 'Net Profit', value: formatUGX(stats.netProfit), highlight: 'net' },
        { label: 'Cash Balance', value: formatUGX(stats.cashBalance) },
      ],
      sections: [
        { heading: 'Key Metrics', rows: [
          { label: 'Total Invoices', value: String(stats.totalInvoices) },
          { label: 'Pending Payments (Receivables)', value: formatUGX(stats.pendingPayments) },
          { label: 'Net Income (after offsets)', value: formatUGX(stats.netRevenue) },
        ]},
        { heading: 'Income by Service', rows: Object.entries(stats.incomeByService).map(([k, v]) => ({ label: k, value: formatUGX(v) })) },
        { heading: 'Expenses by Category', rows: Object.entries(stats.expensesByCategory).map(([k, v]) => ({ label: k, value: formatUGX(v) })) },
      ],
    });
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-1" onClick={handleExportPDF}>
          <FileDown className="h-3.5 w-3.5" /> Export Dashboard PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-1">
              <FileText className="h-5 w-5 text-blue-500" />
              <p className="text-xs text-muted-foreground">Invoices</p>
            </div>
            <p className="text-2xl font-bold">{stats.totalInvoices}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
            <p className="text-lg font-bold text-emerald-700">{formatUGX(stats.totalRevenue)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-1">
              <DollarSign className="h-5 w-5 text-red-500" />
              <p className="text-xs text-muted-foreground">Expenses</p>
            </div>
            <p className="text-lg font-bold text-red-700">{formatUGX(stats.totalExpenses)}</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${stats.netProfit >= 0 ? 'from-primary/10 to-primary/5 border-primary/20' : 'from-amber-500/10 to-amber-600/5 border-amber-500/20'}`}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className={`h-5 w-5 ${stats.netProfit >= 0 ? 'text-primary' : 'text-amber-500'}`} />
              <p className="text-xs text-muted-foreground">Net Profit</p>
            </div>
            <p className={`text-lg font-bold ${stats.netProfit >= 0 ? 'text-primary' : 'text-amber-700'}`}>{formatUGX(stats.netProfit)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-1">
              <Wallet className="h-5 w-5 text-cyan-600" />
              <p className="text-xs text-muted-foreground">Cash Balance</p>
            </div>
            <p className="text-lg font-bold text-cyan-700">{formatUGX(stats.cashBalance)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-1">
              <Clock className="h-5 w-5 text-amber-500" />
              <p className="text-xs text-muted-foreground">Receivables</p>
            </div>
            <p className="text-lg font-bold text-amber-700">{formatUGX(stats.pendingPayments)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Profit Overview (All Time)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-semibold text-emerald-600">{formatUGX(stats.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Income (after expense offsets)</span>
                <span className="font-semibold text-blue-600">{formatUGX(stats.netRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-red-600">−{formatUGX(stats.totalExpenses)}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="font-semibold">Net Profit</span>
                <span className={`font-bold text-lg ${stats.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatUGX(stats.netProfit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Invoices</CardTitle></CardHeader>
          <CardContent>
            {stats.recentInvoices.length === 0 ? (
              <p className="text-muted-foreground text-sm">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentInvoices.map((inv: any) => (
                  <div key={inv.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{inv.invoice_number}</p>
                      <p className="text-xs text-muted-foreground">{new Date(inv.issue_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatUGX(Number(inv.total_amount))}</p>
                      <StatusBadge status={inv.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
    partially_paid: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default FinanceDashboardTab;
