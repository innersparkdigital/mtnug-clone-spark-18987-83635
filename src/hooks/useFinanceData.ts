import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Client {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  service_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number: string | null;
  notes: string | null;
  recorded_by: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string | null;
  status: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  notes: string | null;
  payment_instructions: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  client?: Client;
  items?: InvoiceItem[];
  payments?: Payment[];
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  recorded_by: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  created_at: string;
}

export const useFinanceData = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [invoiceRes, clientRes, expenseRes, logRes] = await Promise.all([
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('admin_clients').select('*').order('company_name'),
        supabase.from('expenses').select('*').order('expense_date', { ascending: false }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100),
      ]);

      if (invoiceRes.data) setInvoices(invoiceRes.data as unknown as Invoice[]);
      if (clientRes.data) setClients(clientRes.data as unknown as Client[]);
      if (expenseRes.data) setExpenses(expenseRes.data as unknown as Expense[]);
      if (logRes.data) setActivityLogs(logRes.data as unknown as ActivityLog[]);
    } catch (err) {
      console.error('Error fetching finance data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const logActivity = useCallback(async (action: string, entityType: string, entityId?: string, details?: any) => {
    if (!user) return;
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
  }, [user]);

  return { invoices, clients, expenses, activityLogs, loading, refetch: fetchAll, logActivity };
};
