import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { setClientSession } from "@/lib/clientSession";

type InviteResult = { ok: boolean; error?: string; message?: string; session?: string; needs_contact?: boolean };

export default function ClientInvite() {
  const { invite } = useParams<{ invite: string }>();
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dead, setDead] = useState(!invite || !/^[a-f0-9]{64}$/i.test(invite));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pass.length < 6) return setError("Passcode must be at least 6 characters.");
    if (pass !== confirm) return setError("Passcodes don't match.");
    setBusy(true);
    const { data, error: rpcErr } = await supabase.rpc("client_accept_invite", { _invite: invite!, _new_passcode: pass });
    setBusy(false);
    const r = data as unknown as InviteResult | null;
    if (rpcErr || !r?.ok || !r.session) {
      if (r?.error === "weak") return setError(r.message || "Passcode must be at least 6 characters.");
      setPass(""); setConfirm("");
      return setDead(true);
    }
    setClientSession(r.session);
    if (r.needs_contact) toast.info("Please ask your therapist to add your email or phone so you can sign in next time.", { duration: 8000 });
    navigate("/client-dashboard", { replace: true });
  };

  return (
    <main className="client-teal min-h-screen bg-background px-4 py-12 grid place-items-center">
      <Helmet><title>Set up your private space | InnerSpark Africa</title><meta name="robots" content="noindex,nofollow" /><meta name="referrer" content="no-referrer" /></Helmet>
      <Card className="w-full max-w-md rounded-2xl border-primary/20 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><KeyRound className="h-6 w-6" /></div>
          <CardTitle className="text-2xl">{dead ? "This link can't be used" : "Set up your private space"}</CardTitle>
          <CardDescription>
            {dead
              ? "This setup link is not valid, was already used, or is older than 48 hours. Ask your therapist for a new one."
              : "Choose a passcode. You'll use it with your email or phone number to sign in."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dead ? (
            <Button asChild variant="outline" className="w-full"><Link to="/client-login">Go to client login</Link></Button>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div><Label htmlFor="p1">Passcode (min 6 characters)</Label><Input id="p1" type="password" autoComplete="new-password" maxLength={128} value={pass} onChange={(e) => setPass(e.target.value)} autoFocus /></div>
              <div><Label htmlFor="p2">Confirm passcode</Label><Input id="p2" type="password" autoComplete="new-password" maxLength={128} value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={busy} className="w-full h-11 rounded-xl">{busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save passcode and continue</Button>
              <p className="text-xs text-muted-foreground text-center">This link works once. Need help? info@innersparkafrica.com</p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
