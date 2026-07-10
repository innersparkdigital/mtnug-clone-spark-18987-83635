import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Stethoscope, LogOut } from "lucide-react";
import { toast } from "sonner";
import ClientRoster from "@/components/therapist/ClientRoster";

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
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [account, setAccount] = useState<TherapistAccount | null>(null);
  const [checking, setChecking] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
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

  if (!user) return <Navigate to="/auth?redirect=/therapist" replace />;

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
    <div className="min-h-screen bg-muted/20">
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
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <ClientRoster therapistId={account.id} therapistName={account.full_name} />
      </main>
    </div>
  );
};

export default TherapistPortal;