import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import QuietFooter from "@/components/client-portal/QuietFooter";
import SessionReflectionTool from "@/components/client-portal/SessionReflectionTool";
import SafetyCheckInTool from "@/components/client-portal/SafetyCheckInTool";
import ToolStub from "@/components/client-portal/ToolStub";
import { getTool } from "@/lib/wellbeingToolsCatalog";

interface Snapshot {
  client: { id: string; full_name: string; has_passcode: boolean };
  therapist: { full_name: string };
  assignment: null | {
    id: string;
    personal_note: string | null;
    tools: Array<{
      id: string;
      tool_key: string;
      title: string | null;
      therapist_note: string | null;
      due_date: string | null;
      config: any;
      status: string;
      latest_submission?: any;
    }>;
  };
  has_red_alert?: boolean;
}

const IDLE_MS = 30 * 60 * 1000;

const ClientPortal = () => {
  const { token } = useParams<{ token: string }>();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const { data, error } = await supabase.rpc("client_snapshot", { _token: token });
    if (error) console.error(error);
    setSnapshot((data as unknown as Snapshot) ?? null);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!unlocked) return;
    let last = Date.now();
    const bump = () => { last = Date.now(); };
    const timer = window.setInterval(() => {
      if (Date.now() - last > IDLE_MS) {
        setUnlocked(false);
        setPasscode("");
        toast.info("Locked after 30 minutes of quiet.");
      }
    }, 60000);
    window.addEventListener("click", bump);
    window.addEventListener("keydown", bump);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("click", bump);
      window.removeEventListener("keydown", bump);
    };
  }, [unlocked]);

  const setPasscodeFn = async () => {
    if (passcode.length < 6) return toast.error("Passcode must be at least 6 characters.");
    if (passcode !== confirmPasscode) return toast.error("Passcodes don't match.");
    setBusy(true);
    const { data, error } = await supabase.rpc("set_client_passcode", { _token: token!, _passcode: passcode });
    setBusy(false);
    if (error || !data) return toast.error(error?.message || "Could not set passcode.");
    setUnlocked(true);
    await load();
  };

  const verifyPasscodeFn = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("verify_client_passcode", { _token: token!, _passcode: passcode });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data) return toast.error("That passcode doesn't match.");
    setUnlocked(true);
  };

  const activeTool = useMemo(
    () => snapshot?.assignment?.tools.find((t) => t.id === activeToolId) || null,
    [snapshot, activeToolId],
  );

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>This link isn't valid</CardTitle>
            <CardDescription>
              This private space couldn't be found. Please check the link your therapist sent you, or contact info@innersparkafrica.com.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const firstName = snapshot.client.full_name.split(" ")[0];

  if (!unlocked) {
    return (
      <div className="fixed inset-0 overflow-y-auto bg-gradient-to-b from-primary/5 to-background p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="min-h-full flex items-center justify-center py-8">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 grid place-items-center mb-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Hi {firstName} 💙</CardTitle>
              <CardDescription>
                {snapshot.client.has_passcode
                  ? "This is your private space. Please enter your passcode."
                  : "This is your private space. Set a passcode so only you can open it."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>{snapshot.client.has_passcode ? "Passcode" : "Choose a passcode (min 6 characters)"}</Label>
                <Input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} autoFocus />
              </div>
              {!snapshot.client.has_passcode && (
                <div>
                  <Label>Confirm passcode</Label>
                  <Input type="password" value={confirmPasscode} onChange={(e) => setConfirmPasscode(e.target.value)} />
                </div>
              )}
              <Button
                onClick={snapshot.client.has_passcode ? verifyPasscodeFn : setPasscodeFn}
                disabled={busy}
                className="w-full"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {snapshot.client.has_passcode ? "Open my space" : "Set passcode & continue"}
              </Button>
              <QuietFooter />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderActiveTool = () => {
    if (!activeTool) return null;
    const meta = getTool(activeTool.tool_key);
    if (activeTool.tool_key === "session-reflection") {
      return (
        <SessionReflectionTool
          token={token!}
          assignmentToolId={activeTool.id}
          initial={activeTool.latest_submission?.payload}
          onDone={() => { setActiveToolId(null); load(); }}
          onBack={() => setActiveToolId(null)}
        />
      );
    }
    if (activeTool.tool_key === "safety-checkin") {
      return (
        <SafetyCheckInTool
          token={token!}
          assignmentToolId={activeTool.id}
          onDone={() => { setActiveToolId(null); load(); }}
          onBack={() => setActiveToolId(null)}
        />
      );
    }
    return (
      <ToolStub
        toolName={activeTool.title || meta?.name || activeTool.tool_key}
        description={meta?.description || ""}
        onBack={() => setActiveToolId(null)}
      />
    );
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-b from-primary/5 to-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground">Welcome back,</div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{firstName} 💙</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your space, put together by {snapshot.therapist.full_name}.
          </p>
        </div>

        {snapshot.has_red_alert && !activeTool && (
          <Card className="border-destructive bg-destructive/5 mb-4">
            <CardContent className="p-4 text-sm">
              Your therapist has been alerted and is reaching out to you. If you need someone right now, please call{" "}
              <a href="tel:0800212121" className="text-destructive font-semibold underline">0800 212 121</a> — free, 24/7.
              You matter. 💙
            </CardContent>
          </Card>
        )}

        {activeTool ? (
          renderActiveTool()
        ) : (
          <>
            {snapshot.assignment?.personal_note && (
              <Card className="mb-4 border-l-4 border-l-primary bg-primary/5">
                <CardContent className="p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    A note from {snapshot.therapist.full_name}
                  </div>
                  <p className="text-sm italic leading-relaxed">{snapshot.assignment.personal_note}</p>
                </CardContent>
              </Card>
            )}

            {!snapshot.assignment || snapshot.assignment.tools.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Nothing to do right now</CardTitle>
                  <CardDescription>
                    Your therapist hasn't set any exercises yet. They'll appear here after your next session.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="space-y-3">
                {snapshot.assignment.tools.map((t) => {
                  const meta = getTool(t.tool_key);
                  const done = t.status === "completed";
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveToolId(t.id)}
                      className="w-full text-left"
                    >
                      <Card className="hover:border-primary/40 transition-colors">
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                            {done ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <span className="text-primary font-semibold text-sm">→</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="font-medium">{t.title || meta?.name || t.tool_key}</div>
                              {done && <span className="text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Completed</span>}
                              {t.due_date && !done && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                  Due {new Date(t.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {t.therapist_note || meta?.short || ""}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                        </CardContent>
                      </Card>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        <QuietFooter />
      </div>
    </div>
  );
};

export default ClientPortal;