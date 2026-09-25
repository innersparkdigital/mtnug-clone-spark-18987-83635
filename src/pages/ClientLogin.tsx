import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LockKeyhole, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import ManualResetRequestForm from "@/components/auth/ManualResetRequestForm";
import { setClientSession } from "@/lib/clientSession";

type LoginResult = { ok: boolean; error?: string; message?: string; session?: string; must_set_passcode?: boolean };
const GENERIC = "We could not sign you in with those details. Check them and try again, or contact InnerSpark support.";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [passcode, setPasscode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [resetSession, setResetSession] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const c = contact.trim();
    if (!c || c.length > 255 || !passcode || passcode.length > 128) return setError(GENERIC);
    setBusy(true);
    const { data, error: rpcErr } = await supabase.rpc("client_login", { _contact: c, _passcode: passcode });
    setBusy(false);
    setPasscode("");
    const r = data as unknown as LoginResult | null;
    if (rpcErr || !r?.ok || !r.session) return setError(r?.message || GENERIC);
    if (r.must_set_passcode) { setResetSession(r.session); return; }
    setClientSession(r.session);
    navigate("/client-dashboard", { replace: true });
  };

  const completeReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPass.length < 6) return setError("Passcode must be at least 6 characters.");
    if (newPass !== confirmPass) return setError("Passcodes don't match.");
    setBusy(true);
    const { data, error: rpcErr } = await supabase.rpc("client_complete_reset", { _session: resetSession!, _new_passcode: newPass });
    setBusy(false);
    const r = data as unknown as LoginResult | null;
    if (rpcErr || !r?.ok || !r.session) {
      if (r?.error === "session") { setResetSession(null); return setError("That step timed out. Please sign in again with your temporary passcode."); }
      return setError(r?.message || "We couldn't save your new passcode. Please try again.");
    }
    setNewPass(""); setConfirmPass(""); setResetSession(null);
    setClientSession(r.session);
    navigate("/client-dashboard", { replace: true });
  };

  return (
    <main className="client-teal min-h-screen bg-background px-4 py-12 grid place-items-center">
      <Helmet><title>Client login | InnerSpark Africa</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <Card className="w-full max-w-md rounded-2xl border-primary/20 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><LockKeyhole className="h-6 w-6" /></div>
          <CardTitle className="text-2xl">{resetSession ? "Choose a new passcode" : "Client login"}</CardTitle>
          <CardDescription>
            {resetSession
              ? "You signed in with a temporary passcode. Set a new one before opening your space."
              : "Sign in with the email or phone number your therapist has on file and your passcode."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resetOpen ? (
            <ManualResetRequestForm accountType="client" onBack={() => setResetOpen(false)} />
          ) : resetSession ? (
            <form onSubmit={completeReset} className="space-y-3">
              <div><Label htmlFor="np">New passcode (min 6 characters)</Label><Input id="np" type="password" autoComplete="new-password" value={newPass} onChange={(e) => setNewPass(e.target.value)} maxLength={128} autoFocus /></div>
              <div><Label htmlFor="cp">Confirm passcode</Label><Input id="cp" type="password" autoComplete="new-password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} maxLength={128} /></div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={busy} className="w-full h-11 rounded-xl">{busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save and continue</Button>
            </form>
          ) : (
            <form onSubmit={signIn} className="space-y-3">
              <div><Label htmlFor="contact">Email or phone number</Label><Input id="contact" autoComplete="username" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={255} placeholder="you@example.com or +256 7…" autoFocus /></div>
              <div><Label htmlFor="pass">Passcode</Label><Input id="pass" type="password" autoComplete="current-password" value={passcode} onChange={(e) => setPasscode(e.target.value)} maxLength={128} /></div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={busy} className="w-full h-11 rounded-xl">{busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Open my space</Button>
              <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => setResetOpen(true)}>Forgot passcode?</button>
              <p className="text-xs text-muted-foreground text-center">New client? Ask your therapist for a one-time setup link. Need help? info@innersparkafrica.com</p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
