import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface Payment { amount: number; payment_date: string; }
interface Perf { id: string; full_name: string; is_active: boolean; total_clients: number; sessions_month: number; homework_given_count: number; next_appt_count: number; }

const fmtUGX = (n: number) => `UGX ${Math.round(n).toLocaleString()}`;

const AdminRevenueTab = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [perf, setPerf] = useState<Perf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
      const [{ data: p, error: e1 }, { data: perfData, error: e2 }] = await Promise.all([
        supabase.from("payments").select("amount, payment_date").gte("payment_date", since),
        supabase.rpc("admin_therapist_performance" as any),
      ]);
      if (e1) toast.error(e1.message);
      if (e2) toast.error(e2.message);
      setPayments((p as Payment[]) || []);
      setPerf((perfData as Perf[]) || []);
      setLoading(false);
    })();
  }, []);

  const weekly = useMemo(() => {
    const buckets = new Map<string, number>();
    payments.forEach((p) => {
      const d = new Date(p.payment_date);
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      const k = monday.toISOString().slice(0, 10);
      buckets.set(k, (buckets.get(k) || 0) + Number(p.amount || 0));
    });
    return Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-12).map(([week, total]) => ({ week: week.slice(5), total }));
  }, [payments]);

  const total90 = payments.reduce((s, p) => s + Number(p.amount || 0), 0);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Revenue · last 90 days</p><p className="text-2xl font-bold mt-1">{fmtUGX(total90)}</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Payments recorded</p><p className="text-2xl font-bold mt-1">{payments.length}</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Active therapists</p><p className="text-2xl font-bold mt-1">{perf.filter((p) => p.is_active).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Weekly revenue (UGX)</CardTitle></CardHeader>
        <CardContent>
          {weekly.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">No payment data yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} fontSize={11} />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => fmtUGX(v)} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Therapist performance (last 30 days)</CardTitle></CardHeader>
        <CardContent>
          {perf.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">No therapists yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Homework given</TableHead>
                    <TableHead>Rebook rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perf.map((p) => {
                    const rebook = p.sessions_month > 0 ? Math.round((p.next_appt_count / p.sessions_month) * 100) : 0;
                    const hw = p.sessions_month > 0 ? Math.round((p.homework_given_count / p.sessions_month) * 100) : 0;
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.full_name}</TableCell>
                        <TableCell className="text-xs">{p.is_active ? "Active" : "Inactive"}</TableCell>
                        <TableCell>{p.total_clients}</TableCell>
                        <TableCell>{p.sessions_month}</TableCell>
                        <TableCell className="text-xs">{p.homework_given_count} ({hw}%)</TableCell>
                        <TableCell className="text-xs">{p.next_appt_count} ({rebook}%)</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenueTab;