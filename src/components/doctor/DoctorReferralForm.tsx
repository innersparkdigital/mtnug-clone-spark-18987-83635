import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const phoneSchema = z.string().trim().min(7, "Enter a valid phone number").max(20);
const nameSchema = z.string().trim().min(2, "Name is required").max(100);

type Doctor = { id: string; full_name: string; phone: string };

interface Props {
  doctor: Doctor;
  onBack: () => void;
  onSubmitted: () => void;
}

const DoctorReferralForm = ({ doctor, onBack, onSubmitted }: Props) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [location, setLocation] = useState("");
  const [concern, setConcern] = useState("");
  const [preferredMode, setPreferredMode] = useState<"virtual" | "physical">("virtual");
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      supabase.functions.invoke("notify-doctor-referral", { body: payload }).catch(() => null);
      setSubmitted(true);
      onSubmitted();
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-8 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
          <h2 className="text-2xl font-bold">Referral submitted</h2>
          <p className="text-muted-foreground">Our team will contact the patient shortly.</p>
          <div className="flex gap-2 justify-center pt-2">
            <Button onClick={() => { setSubmitted(false); setPatientName(""); setPatientPhone(""); setLocation(""); setConcern(""); setPreferredMode("virtual"); setConsent(false); }}>
              Submit another
            </Button>
            <Button variant="outline" onClick={onBack}>Back to dashboard</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>New Referral</CardTitle>
            <CardDescription>Logged in as Dr. {doctor.full_name}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Textarea id="concern" value={concern} onChange={(e) => setConcern(e.target.value)} rows={3} />
          </div>
          <div>
            <Label>Preferred Mode</Label>
            <RadioGroup value={preferredMode} onValueChange={(v) => setPreferredMode(v as any)} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="m-v" />
                <Label htmlFor="m-v" className="cursor-pointer">Virtual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="physical" id="m-p" />
                <Label htmlFor="m-p" className="cursor-pointer">Physical</Label>
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
  );
};

export default DoctorReferralForm;
