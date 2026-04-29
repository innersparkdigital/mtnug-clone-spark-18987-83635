import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { usePagePermissions } from '@/hooks/usePagePermissions';
import SensitiveAccessGate from '@/components/admin/SensitiveAccessGate';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, DollarSign, Users, BarChart3, Activity, Settings, TrendingUp, PieChart, Receipt, Camera } from 'lucide-react';
import InvoicesTab from '@/components/admin/finance/InvoicesTab';
import FinanceDashboardTab from '@/components/admin/finance/FinanceDashboardTab';
import ClientsTab from '@/components/admin/finance/ClientsTab';
import ExpensesTab from '@/components/admin/finance/ExpensesTab';
import IncomeTab from '@/components/admin/finance/IncomeTab';
import ReportsTab from '@/components/admin/finance/ReportsTab';
import ActivityLogsTab from '@/components/admin/finance/ActivityLogsTab';
import AccountsTab from '@/components/admin/finance/AccountsTab';
import TaxCodesTab from '@/components/admin/finance/TaxCodesTab';
import SnapshotsTab from '@/components/admin/finance/SnapshotsTab';

const AdminFinance = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, hasRole, loading: roleLoading } = useUserRole();
  const { hasPageAccess, loading: permLoading } = usePagePermissions();

  const canAccess = isAdmin || hasRole('finance_admin') || hasRole('operations_admin') || hasPageAccess('finance');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/admin/finance');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !permLoading && !canAccess && user) {
      navigate('/');
    }
  }, [canAccess, roleLoading, permLoading, user, navigate]);

  if (authLoading || roleLoading || permLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !canAccess) return null;

  return (
    <SensitiveAccessGate pageKey="finance" pageLabel="Finance & Accounts">
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <Badge className="mb-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Finance & Accounts
          </Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Accounts & Finance Management
          </h1>
          <p className="text-muted-foreground">
            Manage invoices, payments, expenses & financial reports
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2">
              <FileText className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="income" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <PieChart className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="snapshots" className="gap-2">
              <Camera className="h-4 w-4" />
              Snapshots
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="tax" className="gap-2">
              <Receipt className="h-4 w-4" />
              Tax Codes
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Activity Log
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="accounts" className="gap-2">
                <Settings className="h-4 w-4" />
                Accounts
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <FinanceDashboardTab />
          </TabsContent>
          <TabsContent value="invoices">
            <InvoicesTab />
          </TabsContent>
          <TabsContent value="income">
            <IncomeTab />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesTab />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>
          <TabsContent value="snapshots">
            <SnapshotsTab />
          </TabsContent>
          <TabsContent value="clients">
            <ClientsTab />
          </TabsContent>
          <TabsContent value="tax">
            <TaxCodesTab />
          </TabsContent>
          <TabsContent value="activity">
            <ActivityLogsTab />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="accounts">
              <AccountsTab />
            </TabsContent>
          )}
        </Tabs>
      </main>
      <Footer />
    </div>
    </SensitiveAccessGate>
  );
};

export default AdminFinance;
