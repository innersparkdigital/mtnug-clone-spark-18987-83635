import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertOctagon } from "lucide-react";

interface Props {
  clientId: string | null;
  onClose: () => void;
}

interface Detail {
  client: { full_name: string; email: string | null; phone: string | null; presenting_concern: string | null; created_at: string; last_seen_at: string | null };
  therapist: { full_name: string; email: string; phone: string | null };
  assignments: any[];
  submissions: any[];
  safety_alerts: any[];
  session_logs: any[];
}

const AdminClientDetailDialog = ({ clientId, onClose }: Props) => {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId) { setDetail(null); return; }
    setLoading(true);
    (async () => {
      const { data } = await supabase.rpc("admin_client_detail" as any, { _client_id: clientId });
      setDetail(data as Detail);
      setLoading(false);
    })();
  }, [clientId]);

  return (
    <Dialog open={!!clientId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client detail (read-only)</DialogTitle>
        </DialogHeader>
        {loading || !detail ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-5 text-sm">
            <section className="grid grid-cols-2 gap-3">
              <Info k="Client" v={detail.client.full_name} />
              <Info k="Therapist" v={detail.therapist.full_name} />
              <Info k="Email" v={detail.client.email || "—"} />
              <Info k="Phone" v={detail.client.phone || "—"} />
              <Info k="Concern" v={detail.client.presenting_concern || "—"} />
              <Info k="Created" v={new Date(detail.client.created_at).toLocaleDateString()} />
              <Info k="Last seen" v={detail.client.last_seen_at ? new Date(detail.client.last_seen_at).toLocaleString() : "Never"} />
            </section>

            {detail.safety_alerts.filter((a) => !a.resolved).length > 0 && (
              <section className="p-3 rounded-lg border border-red-500/40 bg-red-500/5">
                <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4" />
                  {detail.safety_alerts.filter((a) => !a.resolved).length} open safety alert(s)
                </p>
              </section>
            )}

            <section>
              <h3 className="font-semibold mb-2">Active assignments ({detail.assignments.length})</h3>
              <div className="space-y-2">
                {detail.assignments.slice(0, 5).map((a) => (
                  <div key={a.id} className="p-3 rounded-lg border">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{new Date(a.created_at).toLocaleDateString()}</span>
                      <Badge variant={a.is_active ? "default" : "outline"}>{a.is_active ? "Active" : "Ended"}</Badge>
                    </div>
                    {a.personal_note && <p className="text-sm mb-2 italic">"{a.personal_note}"</p>}
                    <div className="flex flex-wrap gap-1">
                      {(a.tools || []).map((t: any) => (
                        <Badge key={t.id} variant="secondary" className="text-xs">
                          {t.title || t.tool_key} · {t.status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Session logs ({detail.session_logs.length})</h3>
              <div className="space-y-2">
                {detail.session_logs.slice(0, 6).map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{s.session_date} · {s.service_delivered}</span>
                      <Badge variant="outline">{s.progress_status}</Badge>
                    </div>
                    {s.notes && <p className="text-muted-foreground">{s.notes}</p>}
                  </div>
                ))}
                {detail.session_logs.length === 0 && <p className="text-muted-foreground text-xs">No sessions logged yet.</p>}
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Recent submissions ({detail.submissions.length})</h3>
              <div className="space-y-1">
                {detail.submissions.slice(0, 8).map((s) => (
                  <div key={s.id} className="flex justify-between text-xs p-2 rounded bg-muted/40">
                    <span>{s.title || s.tool_key}</span>
                    <span className="text-muted-foreground">{new Date(s.submitted_at).toLocaleDateString()}</span>
                  </div>
                ))}
                {detail.submissions.length === 0 && <p className="text-muted-foreground text-xs">No submissions yet.</p>}
              </div>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Info = ({ k, v }: { k: string; v: string }) => (
  <div><p className="text-xs text-muted-foreground">{k}</p><p className="font-medium">{v}</p></div>
);

export default AdminClientDetailDialog;