import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Stethoscope, LogOut } from "lucide-react";
import { z } from "zod";
import DoctorDashboard from "@/components/doctor/DoctorDashboard";
import DoctorReferralForm from "@/components/doctor/DoctorReferralForm";

type Doctor = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  facility: string | null;
};

const phoneSchema = z.string().trim().min(7, "Enter a valid phone number").max(20);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

const DoctorRefer = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<"dashboard" | "new-referral">("dashboard");

  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      if (!user) {
        setDoctor(null);
        return;
      }
      setLoadingDoctor(true);
      const { data } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setDoctor(data as Doctor | null);
      setLoadingDoctor(false);
    };
    loadDoctor();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      phoneSchema.parse(loginPhone);
      passwordSchema.parse(loginPassword);
    } catch (err: any) {
      toast({ title: "Invalid input", description: err.errors?.[0]?.message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data: emailRes, error: rpcError } = await supabase.rpc("get_doctor_email_by_phone", { _phone: loginPhone.trim() });
      if (rpcError) throw rpcError;
      if (!emailRes) {
        toast({
          title: "Phone not registered",
          description: "Contact InnerSpark Africa admin to get an account.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: emailRes as string,
        password: loginPassword,
      });
      if (signInError) throw signInError;
      toast({ title: "Welcome back" });
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setDoctor(null);
    setView("dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Doctor Portal | InnerSpark Africa for Professionals</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {(authLoading || loadingDoctor) && (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        )}

        {!authLoading && !loadingDoctor && !user && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Doctor Portal</h1>
              <p className="text-muted-foreground">Refer patients & track commissions</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Doctor Login</CardTitle>
                <CardDescription>
                  Use the phone number and password issued to you by InnerSpark Africa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-phone">Phone Number</Label>
                    <Input id="login-phone" type="tel" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder="+256 700 000 000" required />
                  </div>
                  <div>
                    <Label htmlFor="login-pwd">Password</Label>
                    <Input id="login-pwd" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Don't have an account? Email{" "}
                  <a href="mailto:info@innersparkafrica.com" className="text-primary hover:underline">
                    info@innersparkafrica.com
                  </a>{" "}
                  to be onboarded.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!authLoading && user && !loadingDoctor && !doctor && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Account not linked</CardTitle>
                <CardDescription>Your account isn't linked to a doctor profile. Please contact admin.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={handleSignOut} className="w-full">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {doctor && (
          <>
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" /> Sign out
              </Button>
            </div>
            {view === "dashboard" ? (
              <DoctorDashboard doctor={doctor} onNewReferral={() => setView("new-referral")} />
            ) : (
              <DoctorReferralForm doctor={doctor} onBack={() => setView("dashboard")} onSubmitted={() => { /* dashboard refreshes via realtime */ }} />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DoctorRefer;
