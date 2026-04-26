import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [unlinkedNotice, setUnlinkedNotice] = useState(false);

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
      let doc = data as Doctor | null;
      // Fallback: match by email (for Google sign-in where user_id wasn't pre-linked)
      if (!doc && user.email) {
        const { data: byEmail } = await supabase
          .from("doctors")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();
        doc = byEmail as Doctor | null;
      }
      setDoctor(doc);
      if (!doc) {
        // Doctor record not found — sign out and notify
        setUnlinkedNotice(true);
        await supabase.auth.signOut();
        toast({
          title: "No doctor account found",
          description: "This Google email is not registered as a doctor. Contact admin to be onboarded.",
          variant: "destructive",
        });
      } else {
        setUnlinkedNotice(false);
      }
      setLoadingDoctor(false);
    };
    loadDoctor();
  }, [user]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/for-professionals/refer",
      });
      if (result.error) {
        toast({ title: "Google sign-in failed", description: "Please try again.", variant: "destructive" });
        return;
      }
      if (result.redirected) return;
    } catch {
      toast({ title: "Google sign-in failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setGoogleLoading(false);
    }
  };

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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 mb-4"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  Continue with Google
                </Button>
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
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
