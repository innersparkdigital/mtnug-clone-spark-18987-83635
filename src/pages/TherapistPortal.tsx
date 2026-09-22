import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Stethoscope, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import ClientRoster from "@/components/therapist/ClientRoster";
import { CalmThemeRoot } from "@/contexts/CalmThemeContext";
import CalmThemeToggle from "@/components/CalmThemeToggle";
import ManualResetRequestForm from "@/components/auth/ManualResetRequestForm";

interface TherapistAccount {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  specialisation: string | null;
  is_active: boolean;
  must_change_password: boolean;
}

const TherapistPortal = () => {
  const { user, loading, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [account, setAccount] = useState<TherapistAccount | null>(null);
  const [checking, setChecking] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [temporaryResetId, setTemporaryResetId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setChecking(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("therapist_accounts")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      setAccount(data as TherapistAccount | null);
      setChecking(false);
    })();
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!loginEmail || !loginPassword) return;
      setSigningIn(true);
      const { error } = await signIn(loginEmail.trim().toLowerCase(), loginPassword);
      setSigningIn(false);
      if (error) {
        toast.error(error.message.includes("Invalid") ? "Invalid email or password" : error.message);
        return;
      }
      const { data: resetData, error: resetError } = await supabase.functions.invoke("manual-password-reset", {
        body: { action: "consume_therapist" },
      });
      // Password-reset support is an extra safety check, not a condition for
      // ordinary therapist access. Existing accounts must still sign in while
      // the reset service is being deployed.
      if (resetError || resetData?.error) {
        console.warn("Temporary-password check unavailable", resetError || resetData?.error);
      }
      if (!resetError && !resetData?.error && resetData?.temporary) {
        if (resetData.expired) {
          await signOut();
          toast.error("That temporary password expired. Please request another one.");
          return;
        }
        setTemporaryResetId(resetData.request_id);
      }
      toast.success("Welcome back");
    };

    return (
      <div className="min-h-screen grid place-items-center p-4" style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F8FAFC 40%, #ECFDF5 100%)" }}>
        <Card className="max-w-md w-full shadow-xl border-0 overflow-hidden rounded-3xl">
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#3B4FD4,#2E7D5E)" }} />
          <CardHeader className="text-center pt-8">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center mb-3 shadow-sm">
              <Stethoscope className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">Clinical workspace</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Therapist-only. Sign in with the email and password InnerSpark shared with you.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            {!resetOpen ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="t-email">Email</Label>
                  <Input
                    id="t-email"
                    type="email"
                    autoComplete="username"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="t-password">Password</Label>
                  <Input
                    id="t-password"
                    type="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl" disabled={signingIn}>
                  {signingIn && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Sign in
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setResetOpen(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1 pt-2 border-t">
                  <ShieldCheck className="h-3 w-3" />
                  Clinician-only. No public sign-ups.
                </p>
              </form>
            ) : (
              <ManualResetRequestForm accountType="therapist" onBack={() => setResetOpen(false)} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No therapist account</CardTitle>
            <CardDescription>
              Your login isn't linked to a therapist account. Please contact admin at info@innersparkafrica.com.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => signOut().then(() => navigate("/auth"))}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!account.is_active) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Account disabled</CardTitle>
            <CardDescription>Your therapist account has been deactivated. Contact admin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    const { error: pwErr } = await supabase.auth.updateUser({ password: newPassword });
    if (pwErr) {
      setSaving(false);
      toast.error(pwErr.message);
      return;
    }
    const { error: acctErr } = await supabase
      .from("therapist_accounts")
      .update({ must_change_password: false })
      .eq("id", account.id);
    setSaving(false);
    if (acctErr) {
      toast.error(acctErr.message);
      return;
    }
    await supabase.functions.invoke("manual-password-reset", {
      body: { action: "complete_therapist", request_id: temporaryResetId || undefined },
    });
    setTemporaryResetId(null);
    setAccount({ ...account, must_change_password: false });
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated. Welcome to your dashboard.");
  };

  if (account.must_change_password) {
    return (
      <div className="min-h-screen grid place-items-center p-6 bg-muted/30">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Set your password
            </CardTitle>
            <CardDescription>
              Welcome, {account.full_name}. For your security, please choose a new password before accessing your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>New password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <Button onClick={handleChangePassword} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save and continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CalmThemeRoot className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 grid place-items-center shrink-0">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{account.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {account.specialisation || "Therapist"} · Clinical workspace
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CalmThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="rounded-2xl border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">Today</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Risk-sorted roster below. Open a client for homework, consent and safety flags.
              Session calendars stay with ops — your clinical tools live here.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground self-start">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-primary" />
            Private to you
          </span>
        </div>
        <ClientRoster therapistId={account.id} therapistName={account.full_name} />
      </main>
    </CalmThemeRoot>
  );
};

export default TherapistPortal;