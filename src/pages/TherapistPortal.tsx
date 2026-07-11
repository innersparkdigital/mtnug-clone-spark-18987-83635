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
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

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
      toast.success("Welcome back");
    };

    const handleReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!resetEmail) return;
      setResetSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setResetSubmitting(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("If an account exists, a reset link has been sent.");
      setResetOpen(false);
      setResetEmail("");
    };

    return (
      <div className="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 grid place-items-center mb-3">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Therapist Portal</CardTitle>
            <CardDescription>
              Sign in with the credentials sent to your email by InnerSpark admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                <Button type="submit" className="w-full" disabled={signingIn}>
                  {signingIn && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Sign in to portal
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => { setResetEmail(loginEmail); setResetOpen(true); }}
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
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <Label htmlFor="t-reset">Enter your therapist email</Label>
                  <Input
                    id="t-reset"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={resetSubmitting}>
                  {resetSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Send reset link
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setResetOpen(false)}>
                  Back to sign in
                </Button>
              </form>
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
      <header className="border-b bg-background">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">{account.full_name}</div>
              <div className="text-xs text-muted-foreground">
                {account.specialisation || "Therapist"} · InnerSpark Portal
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalmThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <ClientRoster therapistId={account.id} therapistName={account.full_name} />
      </main>
    </CalmThemeRoot>
  );
};

export default TherapistPortal;