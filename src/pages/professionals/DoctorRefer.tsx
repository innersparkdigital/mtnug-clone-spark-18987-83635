import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Stethoscope, CheckCircle2, LogOut } from "lucide-react";
import { z } from "zod";

type Doctor = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  facility: string | null;
};

const phoneSchema = z.string().trim().min(7, "Enter a valid phone number").max(20);
const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Name is required").max(100);

const DoctorRefer = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Login state (admin onboards doctors; no self-signup)
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Referral form state
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [location, setLocation] = useState("");
  const [concern, setConcern] = useState("");
  const [preferredMode, setPreferredMode] = useState<"virtual" | "physical">("virtual");
  const [consent, setConsent] = useState(false);

  // Load doctor profile when user is logged in
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

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    if (!consent) {
      toast({ title: "Consent required", description: "Please confirm patient consent.", variant: "destructive" });
      return;
    }
    try {
      nameSchema.parse(patientName);
      phoneSchema.parse(patientPhone);
    } catch (err: any) {
      toast({ title: "Invalid input", description: err.errors?.[0]?.message, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        doctor_id: doctor.id,
        doctor_name: doctor.full_name,
        doctor_phone: doctor.phone,
        patient_name: patientName.trim(),
        patient_phone: patientPhone.trim(),
        location: location.trim() || null,
        concern: concern.trim() || null,
        preferred_mode: preferredMode,
        consent_confirmed: consent,
      };
      const { error } = await supabase.from("doctor_referrals").insert(payload);
      if (error) throw error;

      // Fire-and-forget admin notification
      supabase.functions.invoke("notify-doctor-referral", { body: payload }).catch(() => null);

      setSubmitted(true);
      setPatientName("");
      setPatientPhone("");
      setLocation("");
      setConcern("");
      setPreferredMode("virtual");
      setConsent(false);
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setDoctor(null);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Refer a Patient | InnerSpark Africa for Professionals</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Stethoscope className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Refer a Patient</h1>
          <p className="text-muted-foreground">Secure referrals to InnerSpark Africa specialists</p>
        </div>

        {(authLoading || loadingDoctor) && (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        )}

        {!authLoading && !loadingDoctor && !user && (
          <Card>
            <CardHeader>
              <CardTitle>Login or Register to Refer a Client</CardTitle>
              <CardDescription>Phone number is your unique ID</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
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
                </TabsContent>
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="reg-phone">Phone Number *</Label>
                      <Input id="reg-phone" type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+256 700 000 000" required />
                    </div>
                    <div>
                      <Label htmlFor="reg-email">Email *</Label>
                      <Input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                      <p className="text-xs text-muted-foreground mt-1">Used only for password recovery</p>
                    </div>
                    <div>
                      <Label htmlFor="reg-facility">Facility / Organization (optional)</Label>
                      <Input id="reg-facility" value={regFacility} onChange={(e) => setRegFacility(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="reg-pwd">Create Password (min 8 characters)</Label>
                      <Input id="reg-pwd" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {!authLoading && user && !loadingDoctor && !doctor && (
          <Card>
            <CardHeader>
              <CardTitle>Complete your doctor profile</CardTitle>
              <CardDescription>Your account exists but isn't linked to a doctor profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={handleSignOut} className="w-full">
                <LogOut className="w-4 h-4 mr-2" /> Sign out and register
              </Button>
            </CardContent>
          </Card>
        )}

        {doctor && submitted && (
          <Card>
            <CardContent className="pt-8 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold">Thank you, Dr. {doctor.full_name}</h2>
              <p className="text-muted-foreground">Your referral has been received. Our team will contact the patient shortly.</p>
              <div className="flex gap-2 justify-center pt-4">
                <Button onClick={() => setSubmitted(false)}>Submit another referral</Button>
                <Button variant="outline" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" /> Sign out</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {doctor && !submitted && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>New Referral</CardTitle>
                  <CardDescription>Logged in as Dr. {doctor.full_name} ({doctor.phone})</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReferral} className="space-y-4">
                <div>
                  <Label htmlFor="patient-name">Patient Name *</Label>
                  <Input id="patient-name" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="patient-phone">Patient Phone Number *</Label>
                  <Input id="patient-phone" type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, district" />
                </div>
                <div>
                  <Label htmlFor="concern">Condition / Concern</Label>
                  <Textarea id="concern" value={concern} onChange={(e) => setConcern(e.target.value)} placeholder="e.g. anxiety, depression, relationship issues" rows={3} />
                </div>
                <div>
                  <Label>Preferred Mode</Label>
                  <RadioGroup value={preferredMode} onValueChange={(v) => setPreferredMode(v as "virtual" | "physical")} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="virtual" id="mode-virtual" />
                      <Label htmlFor="mode-virtual" className="cursor-pointer">Virtual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="physical" id="mode-physical" />
                      <Label htmlFor="mode-physical" className="cursor-pointer">Physical</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-start gap-2 pt-2">
                  <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                  <Label htmlFor="consent" className="text-sm font-normal cursor-pointer leading-tight">
                    I confirm the patient has consented to be contacted by InnerSpark Africa.
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={submitting || !consent}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Referral"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DoctorRefer;