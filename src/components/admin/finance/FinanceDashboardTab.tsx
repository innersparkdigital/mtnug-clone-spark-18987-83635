import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const FinanceDashboardTab = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    totalExpenses: 0,
    recentInvoices: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [invoiceRes, expenseRes, paymentRes] = await Promise.all([
          supabase.from('invoices').select('*'),
          supabase.from('expenses').select('*'),
          supabase.from('payments').select('*'),
        ]);

        const invoices = (invoiceRes.data || []) as any[];
        const expenses = (expenseRes.data || []) as any[];
        const payments = (paymentRes.data || []) as any[];

        const totalRevenue = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        const totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
        const pendingPayments = invoices
          .filter((i: any) => ['sent', 'overdue', 'partially_paid'].includes(i.status))
          .reduce((sum: number, i: any) => sum + Number(i.balance_due), 0);

        setStats({
          totalInvoices: invoices.length,
          totalRevenue,
          pendingPayments,
          totalExpenses,
          recentInvoices: invoices.slice(0, 5),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatUGX = (amount: number) => `UGX ${amount.toLocaleString()}`;

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-3xl font-bold">{stats.totalInvoices}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatUGX(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">{formatUGX(stats.pendingPayments)}</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">{formatUGX(stats.totalExpenses)}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profit Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-semibold text-emerald-600">{formatUGX(stats.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-red-600">-{formatUGX(stats.totalExpenses)}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="font-semibold">Net Profit</span>
                <span className={`font-bold ${stats.totalRevenue - stats.totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatUGX(stats.totalRevenue - stats.totalExpenses)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
          </CardHeader>
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
