import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, KeyRound, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ResetRow = {
  id: string;
  account_type: "client" | "therapist";
  account_id?: string | null;
  identifier_masked: string;
  status: "pending" | "processing" | "ready" | "sent" | "used" | "completed" | "expired" | "cancelled";
  requested_at: string;
  expires_at: string | null;
  admin_notified_at?: string | null;
  admin_notification_error?: string | null;
  match_found?: boolean | null;
};

const statusLabel: Record<ResetRow["status"], string> = {
  pending: "Pending — awaiting admin action",
  processing: "Being generated",
  ready: "Copied — confirm after sharing",
  sent: "Sent — awaiting user login",
  used: "Used — awaiting new password",
  completed: "Completed",
  expired: "Expired",
  cancelled: "Cancelled",
};

const NIL = "00000000-0000-0000-0000-000000000000";

const PasswordResetRequestsTab = () => {
  const [rows, setRows] = useState<ResetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealing, setRevealing] = useState<string | null>(null);
  const [secret, setSecret] = useState<{ requestId: string; value: string } | null>(null);
  const [loadNote, setLoadNote] = useState<string | null>(null);

  const loadFromTable = async (): Promise<ResetRow[]> => {
    const { data, error } = await supabase
      .from("manual_password_reset_requests" as never)
      .select(
        "id,account_type,account_id,identifier_masked,status,requested_at,expires_at,admin_notified_at,admin_notification_error,match_found",
      )
      .order("requested_at", { ascending: false })
      .limit(200);
    if (!error) return (data || []) as unknown as ResetRow[];

    const { data: basic, error: e2 } = await supabase
      .from("manual_password_reset_requests" as never)
      .select("id,account_type,account_id,identifier_masked,status,requested_at,expires_at")
      .order("requested_at", { ascending: false })
      .limit(200);
    if (e2) throw e2;
    return (basic || []) as unknown as ResetRow[];
  };

  const load = useCallback(async () => {
    setLoading(true);
    setLoadNote(null);
    try {
      const { data, error } = await supabase.functions.invoke("manual-password-reset", {
        body: { action: "list" },
      });
      if (!error && !data?.error && Array.isArray(data?.requests)) {
        setRows(data.requests);
        return;
      }
      const tableRows = await loadFromTable();
      setRows(tableRows);
      setLoadNote("Loaded from database (edge list unavailable). Deploy manual-password-reset when you can.");
    } catch {
      try {
        setRows(await loadFromTable());
        setLoadNote("Loaded from database directly.");
      } catch (e2) {
        toast.error(e2 instanceof Error ? e2.message : "Could not load requests");
        setRows([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reveal = async (id: string) => {
    setRevealing(id);
    const { data, error } = await supabase.functions.invoke("manual-password-reset", {
      body: { action: "reveal", request_id: id },
    });
    setRevealing(null);
    if (error || data?.error) {
      const raw = String(data?.error || error?.message || "Could not generate password");
      return toast.error(
        /non-2xx|Edge Function/i.test(raw)
          ? "Could not generate the temporary password. Deploy the function and try again."
          : raw,
      );
    }
    setSecret({ requestId: id, value: data.temporary_password });
    load();
  };

  const copyOnce = async () => {
    if (!secret) return;
    await navigator.clipboard.writeText(secret.value);
    setSecret(null);
    toast.success("Copied and hidden. Share it manually, then mark as sent.");
    load();
  };

  const retryNotification = async (id: string) => {
    const { data, error } = await supabase.functions.invoke("manual-password-reset", {
      body: { action: "retry_notification", request_id: id },
    });
    if (error || data?.error) return toast.error(data?.error || error?.message || "Could not alert staff");
    toast.success("Staff alert accepted for delivery");
    await load();
  };

  const markSent = async (id: string) => {
    const { data, error } = await supabase.functions.invoke("manual-password-reset", {
      body: { action: "mark_sent", request_id: id },
    });
    if (error || data?.error) return toast.error(data?.error || error?.message || "Could not update request");
    toast.success("Marked as shared with the user.");
    load();
  };

  const unmatched = (row: ResetRow) =>
    row.match_found === false || !row.account_id || row.account_id === NIL;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" /> Password reset requests
            </CardTitle>
            <CardDescription>
              Generate once, copy once, share manually. Nothing is emailed to the client automatically.
            </CardDescription>
            {loadNote && <p className="text-xs text-amber-700 mt-2">{loadNote}</p>}
          </div>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {secret && (
          <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4 text-amber-950">
            <p className="font-semibold">Copy this temporary password now</p>
            <p className="my-3 font-mono text-xl tracking-wider">{secret.value}</p>
            <p className="text-xs mb-3">Expires in 60 minutes. Hidden after copy.</p>
            <Button onClick={copyOnce}>
              <Copy className="h-4 w-4 mr-2" />
              Copy and hide
            </Button>
          </div>
        )}
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No requests yet. Client Login → Forgot password creates a row here after the function is deployed.
          </p>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium capitalize">{row.account_type}</span>
                  <Badge variant="outline">{statusLabel[row.status]}</Badge>
                  {unmatched(row) && (
                    <Badge variant="destructive" className="text-[10px]">
                      No account match
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {row.identifier_masked} · {new Date(row.requested_at).toLocaleString()}
                </p>
                {row.status === "pending" && (
                  <p className={`text-xs mt-1 ${row.admin_notified_at ? "text-emerald-700" : "text-amber-700"}`}>
                    {row.admin_notified_at
                      ? "Staff email accepted for delivery"
                      : row.admin_notification_error
                        ? `Staff email issue: ${row.admin_notification_error}`
                        : "In queue — use Generate below even if email did not arrive"}
                  </p>
                )}
                {unmatched(row) && row.status === "pending" && (
                  <p className="text-xs text-destructive mt-1">
                    Phone/email did not match a saved client. Check Therapist → clients, or ask them to resubmit with the
                    registered contact.
                  </p>
                )}
              </div>
              {row.status === "pending" && (
                <div className="flex flex-wrap gap-2">
                  {!row.admin_notified_at && (
                    <Button variant="outline" onClick={() => retryNotification(row.id)}>
                      Retry staff alert
                    </Button>
                  )}
                  <Button onClick={() => reveal(row.id)} disabled={!!revealing || !!secret || unmatched(row)}>
                    {revealing === row.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {unmatched(row) ? "Match client first" : "Generate and view once"}
                  </Button>
                </div>
              )}
              {row.status === "ready" && (
                <Button variant="outline" onClick={() => markSent(row.id)}>
                  Mark as sent
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordResetRequestsTab;
