import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, KeyRound, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ResetRow = {
  id: string; account_type: "client" | "therapist"; identifier_masked: string;
  status: "pending" | "sent" | "used" | "completed" | "expired" | "cancelled";
  requested_at: string; expires_at: string | null;
};

const statusLabel: Record<ResetRow["status"], string> = {
  pending: "Pending — awaiting admin action",
  sent: "Sent — awaiting user login",
  used: "Used — awaiting new password",
  completed: "Completed",
  expired: "Expired",
  cancelled: "Cancelled",
};

const PasswordResetRequestsTab = () => {
  const [rows, setRows] = useState<ResetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealing, setRevealing] = useState<string | null>(null);
  const [secret, setSecret] = useState<{ requestId: string; value: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("manual-password-reset", { body: { action: "list" } });
    setLoading(false);
    if (error || data?.error) return toast.error(data?.error || error?.message || "Could not load requests");
    setRows(data.requests || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const reveal = async (id: string) => {
    setRevealing(id);
    const { data, error } = await supabase.functions.invoke("manual-password-reset", { body: { action: "reveal", request_id: id } });
    setRevealing(null);
    if (error || data?.error) return toast.error(data?.error || error?.message || "Could not generate password");
    setSecret({ requestId: id, value: data.temporary_password });
    load();
  };

  const copyOnce = async () => {
    if (!secret) return;
    await navigator.clipboard.writeText(secret.value);
    setSecret(null);
    toast.success("Copied. The temporary password is now hidden and cannot be viewed again.");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div><CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Password reset requests</CardTitle>
          <CardDescription>Generate once, copy once, then share manually. Nothing is sent automatically.</CardDescription></div>
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {secret && (
          <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4 text-amber-950">
            <p className="font-semibold">Copy this temporary password now</p>
            <p className="my-3 font-mono text-xl tracking-wider">{secret.value}</p>
            <p className="text-xs mb-3">It expires in 60 minutes. After copying, it will be hidden permanently.</p>
            <Button onClick={copyOnce}><Copy className="h-4 w-4 mr-2" />Copy and hide</Button>
          </div>
        )}
        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No password reset requests.</p>
        ) : rows.map((row) => (
          <div key={row.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4">
            <div>
              <div className="flex items-center gap-2"><span className="font-medium capitalize">{row.account_type}</span><Badge variant="outline">{statusLabel[row.status]}</Badge></div>
              <p className="text-sm text-muted-foreground mt-1">{row.identifier_masked} · {new Date(row.requested_at).toLocaleString()}</p>
              {row.expires_at && row.status === "sent" && <p className="text-xs text-amber-700 mt-1">Expires {new Date(row.expires_at).toLocaleString()}</p>}
            </div>
            {row.status === "pending" && (
              <Button onClick={() => reveal(row.id)} disabled={!!revealing || !!secret}>
                {revealing === row.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Generate and view once
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
export default PasswordResetRequestsTab;
