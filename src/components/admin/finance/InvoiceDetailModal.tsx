import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Download, Send, MessageSquare } from 'lucide-react';

interface InvoiceDetailModalProps {
  invoiceId: string;
  clients: { id: string; company_name: string; contact_person: string | null; email: string | null; phone: string | null }[];
  onClose: () => void;
}

interface InvoiceItem {
  id: string;
  service_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number: string | null;
  notes: string | null;
}

const InvoiceDetailModal = ({ invoiceId, clients, onClose }: InvoiceDetailModalProps) => {
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const fetchDetails = useCallback(async () => {
    const [invRes, itemsRes, payRes] = await Promise.all([
      supabase.from('invoices').select('*').eq('id', invoiceId).single(),
      supabase.from('invoice_items').select('*').eq('invoice_id', invoiceId).order('created_at'),
      supabase.from('payments').select('*').eq('invoice_id', invoiceId).order('payment_date'),
    ]);
    if (invRes.data) setInvoice(invRes.data);
    if (itemsRes.data) setItems(itemsRes.data as unknown as InvoiceItem[]);
    if (payRes.data) setPayments(payRes.data as unknown as Payment[]);
  }, [invoiceId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const client = invoice?.client_id ? clients.find(c => c.id === invoice.client_id) : null;

  const handleAddItem = async (data: any) => {
    const total = data.quantity * data.unit_price;
    await supabase.from('invoice_items').insert([{ ...data, invoice_id: invoiceId, total } as any]);
    await supabase.from('activity_logs').insert([{ user_id: user?.id, action: 'Added invoice item', entity_type: 'invoice_item', entity_id: invoiceId } as any]);
    toast({ title: 'Item added' });
    setShowAddItem(false);
    fetchDetails();
  };

  const handleDeleteItem = async (id: string) => {
    await supabase.from('invoice_items').delete().eq('id', id);
    fetchDetails();
  };

  const handleAddPayment = async (data: any) => {
    const { data: payment } = await supabase.from('payments').insert([{ ...data, invoice_id: invoiceId, recorded_by: user?.id } as any]).select().single();
    await supabase.from('activity_logs').insert([{ user_id: user?.id, action: 'Recorded payment', entity_type: 'payment', entity_id: invoiceId } as any]);
    toast({ title: 'Payment recorded', description: 'Income auto-logged. Sending receipt…' });
    setShowAddPayment(false);

    // Auto-send receipt to client
    if (client?.email && payment) {
      try {
        // refetch invoice to get updated balance after payment trigger
        const { data: freshInv } = await supabase.from('invoices').select('balance_due').eq('id', invoiceId).single();
        await supabase.functions.invoke('send-resend-email', {
          body: {
            type: 'payment-receipt',
            to: client.email,
            data: {
              clientName: client.contact_person || client.company_name,
              invoiceNumber: invoice.invoice_number,
              amountPaid: data.amount,
              paymentDate: new Date(data.payment_date).toLocaleDateString('en-UG'),
              paymentMethod: data.payment_method,
              reference: data.reference_number || '',
              balanceDue: freshInv?.balance_due ?? 0,
            },
          },
        });
        toast({ title: 'Receipt sent', description: `Receipt emailed to ${client.email}` });
      } catch (err) {
        console.error('Receipt send failed:', err);
      }
    }
    fetchDetails();
  };

  const handleSendEmail = async () => {
    if (!client?.email) {
      toast({ title: 'No client email', description: 'Add client email first', variant: 'destructive' });
      return;
    }
    try {
      const services = items.length
        ? items.map(it => it.description).join(', ')
        : 'professional services';
      await supabase.functions.invoke('send-resend-email', {
        body: {
          type: 'invoice',
          to: client.email,
          data: {
            clientName: client.contact_person || client.company_name,
            invoiceNumber: invoice.invoice_number,
            issueDate: new Date(invoice.issue_date).toLocaleDateString('en-UG'),
            dueDate: new Date(invoice.due_date).toLocaleDateString('en-UG'),
            services,
            items: items.map(it => ({
              description: it.description,
              quantity: it.quantity,
              unit_price: it.unit_price,
              total: it.total,
            })),
            subtotal: invoice.subtotal,
            taxAmount: invoice.tax_amount,
            taxRate: invoice.tax_rate,
            totalAmount: invoice.total_amount,
            balanceDue: invoice.balance_due,
            paymentInstructions: invoice.payment_instructions,
            notes: invoice.notes,
          },
        },
      });
      await supabase.from('invoices').update({ status: 'sent' }).eq('id', invoiceId);
      await supabase.from('activity_logs').insert([{ user_id: user?.id, action: 'Sent invoice email via Resend', entity_type: 'invoice', entity_id: invoiceId } as any]);
      toast({ title: 'Invoice sent', description: `Sent from finance@innersparkafrica.com to ${client.email}` });
      fetchDetails();
    } catch (err) {
      console.error(err);
      toast({ title: 'Email sending failed', variant: 'destructive' });
    }
  };

  const handleShareWhatsApp = () => {
    if (!invoice) return;
    const clientName = client?.company_name || 'Client';
    const msg = `📄 *Invoice ${invoice.invoice_number}*\n\nDear ${clientName},\n\nPlease find your invoice details:\n• Total: UGX ${Number(invoice.total_amount).toLocaleString()}\n• Due: ${new Date(invoice.due_date).toLocaleDateString()}\n• Balance: UGX ${Number(invoice.balance_due).toLocaleString()}\n\n${invoice.payment_instructions || ''}\n\n— InnerSpark Africa`;
    const phone = client?.phone?.replace(/\D/g, '') || '';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDownloadPDF = () => {
    const w = window.open('', '_blank', 'width=900,height=1100');
    if (!w) return;
    const LOGO = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/logo.png';
    const FOOTER = 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/footer-banner.png';
    const itemsHtml = items.map(it => `<tr><td style="padding:10px;border-bottom:1px solid #eee">${it.description}</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:center">${it.quantity}</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:right">UGX ${Number(it.unit_price).toLocaleString()}</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:right;font-weight:600">UGX ${Number(it.total).toLocaleString()}</td></tr>`).join('');
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoice?.invoice_number}</title>
      <style>
        @page { size: A4; margin: 15mm }
        @media print { .no-print { display:none } body { padding:0 } }
        body{font-family:'Segoe UI',Arial,sans-serif;padding:30px;color:#333;max-width:800px;margin:0 auto;background:#fff}
        .controls{position:fixed;top:10px;right:10px;background:#fff;padding:8px;border:1px solid #ddd;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.1);z-index:999}
        .controls button{margin:0 4px;padding:6px 12px;background:#5B6ABF;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px}
        .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #5B6ABF;padding-bottom:20px;margin-bottom:24px}
        .brand img{max-width:180px;height:auto;display:block;margin-bottom:8px}
        .brand p{margin:2px 0;font-size:12px;color:#666}
        .invmeta{text-align:right}
        .invmeta h1{color:#5B6ABF;margin:0;font-size:32px;letter-spacing:2px}
        .invmeta p{margin:4px 0;font-size:13px}
        .billto{background:#f4f5fb;padding:16px;border-radius:6px;margin-bottom:20px}
        .billto h3{margin:0 0 8px;font-size:12px;color:#5B6ABF;text-transform:uppercase;letter-spacing:1px}
        table{width:100%;border-collapse:collapse;margin:16px 0;background:#fff}
        thead tr{background:#5B6ABF;color:#fff}
        thead th{padding:10px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.5px}
        .totals{margin-left:auto;width:300px;margin-top:12px}
        .totals tr td{padding:6px 12px;font-size:13px}
        .totals tr.grand td{border-top:2px solid #5B6ABF;font-weight:700;font-size:16px;color:#5B6ABF;padding-top:10px}
        .pay-box{background:#fff8e1;border-left:4px solid #d97706;padding:12px 16px;margin:20px 0;border-radius:4px}
        .footer-banner{margin-top:40px}
        .footer-banner img{width:100%;display:block;border-radius:6px}
        .small{font-size:11px;color:#999;text-align:center;margin-top:12px}
      </style></head><body>
      <div class="controls no-print">
        <button onclick="document.body.style.zoom=(parseFloat(document.body.style.zoom||1)+0.1)">Zoom +</button>
        <button onclick="document.body.style.zoom=(parseFloat(document.body.style.zoom||1)-0.1)">Zoom −</button>
        <button onclick="document.body.style.zoom=1">Reset</button>
        <button onclick="window.print()">🖨 Print / Save PDF</button>
      </div>
      <div class="header">
        <div class="brand">
          <img src="${LOGO}" alt="InnerSpark Africa"/>
          <p><strong>InnerSpark Africa</strong></p>
          <p>Kampala, Uganda</p>
          <p>finance@innersparkafrica.com</p>
          <p>+256 792 085 773</p>
        </div>
        <div class="invmeta">
          <h1>INVOICE</h1>
          <p><strong>${invoice?.invoice_number}</strong></p>
          <p>Issued: ${new Date(invoice?.issue_date).toLocaleDateString('en-UG')}</p>
          <p>Due: ${new Date(invoice?.due_date).toLocaleDateString('en-UG')}</p>
          <p>Status: <strong style="text-transform:uppercase">${invoice?.status?.replace('_',' ')}</strong></p>
        </div>
      </div>
      <div class="billto">
        <h3>Bill To</h3>
        <p style="margin:0;font-weight:600">${client?.company_name || 'N/A'}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#555">${client?.contact_person || ''}${client?.email ? ' • ' + client.email : ''}${client?.phone ? ' • ' + client.phone : ''}</p>
      </div>
      <table><thead><tr><th>Description</th><th style="text-align:center;width:60px">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${itemsHtml || '<tr><td colspan="4" style="padding:20px;text-align:center;color:#999">No items</td></tr>'}</tbody></table>
      <table class="totals">
        <tr><td>Subtotal</td><td style="text-align:right">UGX ${Number(invoice?.subtotal).toLocaleString()}</td></tr>
        ${Number(invoice?.tax_amount) > 0 ? `<tr><td>Tax (${invoice?.tax_rate}%)</td><td style="text-align:right">UGX ${Number(invoice?.tax_amount).toLocaleString()}</td></tr>` : ''}
        <tr class="grand"><td>TOTAL</td><td style="text-align:right">UGX ${Number(invoice?.total_amount).toLocaleString()}</td></tr>
        <tr><td>Paid</td><td style="text-align:right">UGX ${Number(invoice?.amount_paid).toLocaleString()}</td></tr>
        <tr><td style="color:#d97706;font-weight:700">Balance Due</td><td style="text-align:right;color:#d97706;font-weight:700">UGX ${Number(invoice?.balance_due).toLocaleString()}</td></tr>
      </table>
      <div class="pay-box">
        <p style="margin:0 0 4px;font-weight:600;color:#92400e">💳 Payment Instructions</p>
        <p style="margin:0;font-size:13px;line-height:1.5">${(invoice?.payment_instructions || '').replace(/\n/g,'<br/>')}</p>
      </div>
      ${invoice?.notes ? `<p style="font-size:13px;color:#555"><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
      <div class="footer-banner"><img src="${FOOTER}" alt="InnerSpark Africa"/></div>
      <p class="small">Thank you for choosing InnerSpark Africa. www.innersparkafrica.com</p>
      </body></html>`);
    w.document.close();
  };

  if (!invoice) return null;

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice {invoice.invoice_number}</span>
            <StatusBadge status={invoice.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="font-semibold">{client?.company_name || 'No client linked'}</p>
            {client && (
              <p className="text-sm text-muted-foreground">
                {client.contact_person} • {client.email} • {client.phone}
              </p>
            )}
            <p className="text-sm mt-1">
              Issued: {new Date(invoice.issue_date).toLocaleDateString()} • Due: {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Line Items</h3>
              <Button size="sm" variant="outline" onClick={() => setShowAddItem(true)} className="gap-1">
                <Plus className="h-3 w-3" /> Add Item
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-4">No items yet</TableCell></TableRow>
                ) : items.map(it => (
                  <TableRow key={it.id}>
                    <TableCell className="text-xs">{serviceLabels[it.service_type] || it.service_type}</TableCell>
                    <TableCell>{it.description}</TableCell>
                    <TableCell>{it.quantity}</TableCell>
                    <TableCell>UGX {Number(it.unit_price).toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">UGX {Number(it.total).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-destructive h-6 w-6 p-0" onClick={() => handleDeleteItem(it.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="text-right mt-2 space-y-1 text-sm">
              <p>Subtotal: <strong>UGX {Number(invoice.subtotal).toLocaleString()}</strong></p>
              {Number(invoice.tax_amount) > 0 && <p>Tax ({invoice.tax_rate}%): UGX {Number(invoice.tax_amount).toLocaleString()}</p>}
              <p className="text-base">Total: <strong>UGX {Number(invoice.total_amount).toLocaleString()}</strong></p>
              <p>Paid: UGX {Number(invoice.amount_paid).toLocaleString()}</p>
              <p className="text-primary font-bold">Balance Due: UGX {Number(invoice.balance_due).toLocaleString()}</p>
            </div>
          </div>

          {/* Payments */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Payments</h3>
              <Button size="sm" variant="outline" onClick={() => setShowAddPayment(true)} className="gap-1">
                <Plus className="h-3 w-3" /> Record Payment
              </Button>
            </div>
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments recorded</p>
            ) : (
              <div className="space-y-2">
                {payments.map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-muted/50 rounded p-3">
                    <div>
                      <p className="font-medium text-sm">UGX {Number(p.amount).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{p.payment_method} • {new Date(p.payment_date).toLocaleDateString()}</p>
                    </div>
                    {p.reference_number && <p className="text-xs text-muted-foreground">Ref: {p.reference_number}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button variant="outline" className="gap-2" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleSendEmail}>
              <Send className="h-4 w-4" /> Send Email
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleShareWhatsApp}>
              <MessageSquare className="h-4 w-4" /> WhatsApp
            </Button>
          </div>
        </div>

        {showAddItem && (
          <AddItemDialog onSubmit={handleAddItem} onClose={() => setShowAddItem(false)} />
        )}
        {showAddPayment && (
          <AddPaymentDialog onSubmit={handleAddPayment} onClose={() => setShowAddPayment(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

const serviceLabels: Record<string, string> = {
  corporate_training: 'Corporate Training',
  mental_health_screening: 'Mental Health Screening',
  counselling_package: 'Counselling Package',
  other: 'Other',
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
    <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const AddItemDialog = ({ onSubmit, onClose }: { onSubmit: (data: any) => void; onClose: () => void }) => {
  const [form, setForm] = useState({
    service_type: 'counselling_package',
    description: '',
    quantity: 1,
    unit_price: 0,
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Line Item</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Service Type</Label>
            <Select value={form.service_type} onValueChange={v => setForm(f => ({ ...f, service_type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="corporate_training">Corporate Training</SelectItem>
                <SelectItem value="mental_health_screening">Mental Health Screening</SelectItem>
                <SelectItem value="counselling_package">Counselling Package</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description *</Label>
            <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Stress Management Training – 1 Day" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity</Label>
              <Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} />
            </div>
            <div>
              <Label>Unit Price (UGX)</Label>
              <Input type="number" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: Number(e.target.value) }))} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Total: UGX {(form.quantity * form.unit_price).toLocaleString()}</p>
          <Button onClick={() => onSubmit(form)} className="w-full" disabled={!form.description}>Add Item</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddPaymentDialog = ({ onSubmit, onClose }: { onSubmit: (data: any) => void; onClose: () => void }) => {
  const [form, setForm] = useState({
    amount: 0,
    payment_method: 'mobile_money',
    payment_date: new Date().toISOString().split('T')[0],
    reference_number: '',
    notes: '',
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Amount (UGX) *</Label>
            <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Payment Method</Label>
              <Select value={form.payment_method} onValueChange={v => setForm(f => ({ ...f, payment_method: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Reference Number</Label>
            <Input value={form.reference_number} onChange={e => setForm(f => ({ ...f, reference_number: e.target.value }))} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <Button onClick={() => onSubmit(form)} className="w-full" disabled={form.amount <= 0}>Record Payment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailModal;
