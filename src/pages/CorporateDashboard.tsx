import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const CONSENT_VERSION = "corporate-dashboard-v1";
const MIN_GROUP = 5;

type AdminRow = {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  must_change_password: boolean;
  consent_accepted_at: string | null;
  consent_version: string | null;
};

export default function CorporateDashboard() {
  const { user, signIn, signOut, loading: authLoading } = useAuth();
  const [admin, setAdmin] = useState<AdminRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [requestNote, setRequestNote] = useState("");
  const [stats, setStats] = useState<{ enrolled: number; completed: number; avg: number | null; drivers: string[] }>({
    enrolled: 0, completed: 0, avg: null, drivers: [],
  });

  const loadAdmin = async () => {
    if (!user) { setAdmin(null); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("corporate_company_admins" as any)
      .select("id,company_id,full_name,email,must_change_password,consent_accepted_at,consent_version")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();
    if (error) toast.error(error.message);
    setAdmin((data as any) || null);
    setLoading(false);
  };

  useEffect(() => { loadAdmin(); }, [user?.id]);

  useEffect(() => {
    const run = async () => {
      if (!admin?.company_id || !admin.consent_accepted_at) return;
      // Aggregate-only placeholder until company screening tables are fully wired for this workspace.
      // Never show individual employee answers here.
      setStats({ enrolled: 0, completed: 0, avg: null, drivers: [] });
    };
    run();
  }, [admin?.company_id, admin?.consent_accepted_at]);

  const canShowBreakdown = stats.completed >= MIN_GROUP;

  const acceptConsent = async () => {
    if (!admin || !consentChecked) return;
    const { error } = await supabase
      .from("corporate_company_admins" as any)
      .update({ consent_accepted_at: new Date().toISOString(), consent_version: CONSENT_VERSION })
      .eq("id", admin.id);
    if (error) return toast.error(error.message);
    toast.success("Consent recorded");
    loadAdmin();
  };

  const changePassword = async () => {
    if (newPassword.length < 8) return toast.error("Use at least 8 characters");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return toast.error(error.message);
    await supabase.from("corporate_company_admins" as any).update({ must_change_password: false }).eq("id", admin!.id);
    setNewPassword("");
    toast.success("Password updated");
    loadAdmin();
  };

  const submitRequest = async () => {
    if (!requestNote.trim()) return toast.error("Add a short note about what you need");
    await supabase.functions.invoke("notify-chat-event", {
      body: {
        kind: "corporate_service_request",
        source_path: "/corporate-dashboard",
        name: admin?.full_name,
        email: admin?.email,
        message: requestNote.trim(),
      },
    }).catch(() => null);
    toast.success("Request sent to the InnerSpark team");
    setRequestNote("");
  };

  if (authLoading || loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Helmet><title>Corporate Wellbeing Dashboard | InnerSpark</title></Helmet>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Company admin login</CardTitle>
            <CardDescription>Separate from client and therapist portals. Use the temporary password your InnerSpark admin shared.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Work email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button className="w-full" onClick={async () => {
              const { error } = await signIn(email.trim().toLowerCase(), password);
              if (error) toast.error(error.message);
            }}>Sign in</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full"><CardContent className="py-10 text-center space-y-3">
          <p className="font-semibold">No company dashboard is linked to this login.</p>
          <p className="text-sm text-muted-foreground">Ask InnerSpark to create a corporate admin account for your organisation.</p>
          <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
        </CardContent></Card>
      </div>
    );
  }

  if (admin.must_change_password) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full"><CardHeader><CardTitle>Set your permanent password</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button className="w-full" onClick={changePassword}>Save password</Button>
          </CardContent></Card>
      </div>
    );
  }

  if (!admin.consent_accepted_at || admin.consent_version !== CONSENT_VERSION) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Company data-use consent</CardTitle>
            <CardDescription>You must accept this before viewing aggregate wellbeing results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6">
            <p>As a company admin you agree that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You will not attempt to identify individual employees from aggregate data</li>
              <li>You will not use the data punitively against any employee</li>
              <li>Individual employee responses are never shown in this dashboard</li>
              <li>Breakdowns only appear when enough people have responded to protect privacy</li>
            </ul>
            <div className="flex items-start gap-3 rounded-md border p-4">
              <Checkbox checked={consentChecked} onCheckedChange={(v) => setConsentChecked(v === true)} id="corp-consent" />
              <Label htmlFor="corp-consent" className="font-normal">I understand and accept these terms</Label>
            </div>
            <Button disabled={!consentChecked} onClick={acceptConsent}>Continue to dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <Helmet><title>Corporate Wellbeing Dashboard | InnerSpark</title></Helmet>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Corporate wellbeing dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {admin.full_name}. Aggregate-only view for your organisation.</p>
          </div>
          <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Employees enrolled</p><p className="text-3xl font-bold mt-1">{stats.enrolled}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Completed latest screening</p><p className="text-3xl font-bold mt-1">{stats.completed}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Average wellbeing score</p><p className="text-3xl font-bold mt-1">{stats.avg ?? "—"}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Risk distribution</CardTitle><CardDescription>Organisation-wide only. Never individual.</CardDescription></CardHeader>
          <CardContent>
            {canShowBreakdown ? (
              <p className="text-sm text-muted-foreground">Screening results will appear here once connected screening rounds are available for this company.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Not enough responses yet to show this breakdown while protecting individual privacy (minimum {MIN_GROUP} completed responses).</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Key stress drivers</CardTitle></CardHeader>
          <CardContent>
            {canShowBreakdown && stats.drivers.length ? (
              <ul className="list-disc pl-5 text-sm space-y-1">{stats.drivers.map((d) => <li key={d}>{d}</li>)}</ul>
            ) : (
              <p className="text-sm text-muted-foreground">Not enough responses yet to show this breakdown while protecting individual privacy.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Why these results make sense</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            These notes are organisational context only — not a clinical conclusion about any person or team. Seasonal workload, change periods and low participation can all shape aggregate patterns.
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Request a screening or S.P.A.R.K training</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={requestNote} onChange={(e) => setRequestNote(e.target.value)} placeholder="Tell us what you need — new screening round, manager training, EAP access, etc." />
            <Button onClick={submitRequest}>Send request to InnerSpark</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
