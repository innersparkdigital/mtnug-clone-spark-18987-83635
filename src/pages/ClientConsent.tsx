import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, FileCheck2, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import NoIndex from "@/components/seo/NoIndex";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConsentRecord {
  client_name: string;
  therapist_name: string;
  professional_title?: string | null;
  session_type?: string | null;
  session_price_ugx?: number | null;
  consent_signed: boolean;
  consent_signed_at: string | null;
  generated_at?: string | null;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-UG", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Kampala",
      }).format(new Date(value))
    : "—";

const isChatSession = (sessionType?: string | null) => /chat/i.test(sessionType || "");

export default function ClientConsent() {
  const { token } = useParams<{ token: string }>();
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Teletherapy Informed Consent | InnerSpark Africa";
    if (!token || !UUID_PATTERN.test(token)) {
      setError("This consent link is invalid or has expired.");
      setLoading(false);
      return;
    }

    const loadConsent = async () => {
      const { data, error: loadError } = await supabase.rpc("get_client_consent", { _token: token });
      if (loadError || !data) setError("This consent link is invalid or has expired.");
      else setRecord(data as unknown as ConsentRecord);
      setLoading(false);
    };
    loadConsent();
  }, [token]);

  const serviceLabel = useMemo(() => {
    if (!record) return "Individual Therapy";
    if (record.session_type) return record.session_type;
    return "Individual Therapy — Video Session";
  }, [record]);

  const deliveryMode = isChatSession(record?.session_type) ? "chat" : "video";
  const price =
    typeof record?.session_price_ugx === "number"
      ? record.session_price_ugx
      : deliveryMode === "chat"
        ? 30000
        : 75000;

  const confirm = async () => {
    if (!token || !agreed || submitting) return;
    setSubmitting(true);
    setError("");
    const { data, error: confirmError } = await supabase.rpc("confirm_client_consent", { _token: token });
    setSubmitting(false);
    if (confirmError || !data) {
      setError("We could not record your consent. Please try again or contact InnerSpark Africa on WhatsApp +256 792 085 773.");
      return;
    }
    const result = data as unknown as Pick<ConsentRecord, "consent_signed" | "consent_signed_at">;
    setRecord((current) => (current ? { ...current, ...result } : current));
  };

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16">
      <NoIndex />
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-center gap-2 text-primary">
          <ShieldCheck className="h-6 w-6" />
          <span className="font-semibold">InnerSpark Africa</span>
        </div>

        {loading ? (
          <div className="grid min-h-[50vh] place-items-center" aria-live="polite">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : error && !record ? (
          <Card>
            <CardContent className="py-10 text-center">
              <FileCheck2 className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
              <h1 className="text-xl font-semibold">Consent form unavailable</h1>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        ) : record ? (
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">InnerSpark Africa — Teletherapy Informed Consent</CardTitle>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Consent Form for:</span> {record.client_name}</p>
                <p><span className="font-medium text-foreground">Session with:</span> {record.therapist_name}, {record.professional_title || "Licensed mental health professional"}</p>
                <p><span className="font-medium text-foreground">Service:</span> {serviceLabel}</p>
                <p><span className="font-medium text-foreground">Date generated:</span> {formatDate(record.generated_at || new Date().toISOString())}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 text-sm leading-6">
              {record.consent_signed && record.consent_signed_at ? (
                <div className="rounded-md border border-primary/30 bg-primary/5 p-5 text-center" aria-live="polite">
                  <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-primary" />
                  <h2 className="font-semibold">Consent confirmed</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Recorded on {formatDate(record.consent_signed_at)}</p>
                </div>
              ) : (
                <>
                  <p>Please read the information below carefully before confirming. If anything is unclear, you can ask your therapist about it before or during your first session.</p>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">1. Who is providing this service</h2>
                    <p>You are being connected with <strong>{record.therapist_name}</strong>, a licensed mental health professional working with InnerSpark Africa. InnerSpark Africa is a digital mental health platform based in Kampala, Uganda, providing video, chat and voice therapy sessions.</p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">2. What this service is</h2>
                    <p>This is a mental health counselling/therapy session, delivered remotely by <strong>{deliveryMode === "chat" ? "chat" : "video call"}</strong>. Sessions typically run 45–60 minutes. This is <strong>not</strong> a psychiatric or medical service — InnerSpark does not prescribe medication directly, though a referral to a psychiatrist can be arranged separately if needed.</p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">3. Confidentiality</h2>
                    <p>What you share with your therapist is kept confidential between you and them, with the following exceptions grounded in Ugandan professional and legal duties:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>If your therapist believes you are at serious risk of harming yourself or someone else and disclosure is needed to protect life or safety.</li>
                      <li>If there is reasonable concern about the abuse or neglect of a child or vulnerable person, where reporting duties apply under child-protection and related laws.</li>
                      <li>If disclosure is required by a valid court order, summons or other lawful process.</li>
                      <li>Where the Uganda Data Protection and Privacy Act 2019 and related guidance allow or require processing/disclosure for legal obligation, vital interests or public interest, with appropriate safeguards.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">4. Things to know about online therapy specifically</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Online therapy can be as effective as in-person therapy for many people, but it is not the right fit for every situation.</li>
                      <li>Your session depends on a stable internet or phone connection — occasional technical interruptions can happen.</li>
                      <li>If your situation involves a level of risk that online sessions alone cannot safely address, your therapist may recommend additional or different support.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">5. If you are in a mental health emergency</h2>
                    <p>Online therapy is <strong>not</strong> an emergency service. If you are in crisis or in immediate danger:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Message InnerSpark on WhatsApp: <strong>+256 792 085 773</strong></li>
                      <li>Contact local emergency services immediately</li>
                      <li>If available to you, use local hospital emergency care</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">6. Your information and privacy</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Session notes are recorded by your therapist for continuity of care and may be visible to InnerSpark’s clinical oversight team.</li>
                      <li>Your information is stored securely and is not shared outside InnerSpark except as described in Section 3.</li>
                      <li>You can request a copy of your records or ask how your data is stored by emailing <strong>info@innersparkafrica.com</strong>.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">7. Cost and payment</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>This session type ({serviceLabel}) costs <strong>UGX {price.toLocaleString()}</strong>, payable via MTN or Airtel Mobile Money or card where available.</li>
                      <li>Sessions cancelled with less than 24 hours’ notice may be charged in full unless InnerSpark agrees otherwise in writing.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">8. Your rights</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You can choose to stop therapy at any time, for any reason.</li>
                      <li>You can ask to be matched with a different therapist if this pairing is not the right fit.</li>
                      <li>You can ask your therapist questions about their approach, experience or how sessions will work before continuing.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-semibold text-base">9. Your consent</h2>
                    <p>By checking the box below, you confirm that:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You have read and understood the information above</li>
                      <li>You are voluntarily choosing to participate in this therapy session</li>
                      <li>You understand the limits of confidentiality described in Section 3</li>
                      <li>You know what to do in a mental health emergency, as described in Section 5</li>
                    </ul>
                  </section>

                  <div className="flex items-start gap-3 rounded-md border p-4">
                    <Checkbox id="consent-confirmation" checked={agreed} onCheckedChange={(value) => setAgreed(value === true)} />
                    <Label htmlFor="consent-confirmation" className="cursor-pointer text-sm font-normal leading-5">
                      I have read and understood the above, and I consent to proceed with this {deliveryMode} therapy session
                    </Label>
                  </div>

                  {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

                  <Button className="w-full" disabled={!agreed || submitting} onClick={confirm}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm consent
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Your confirmation time will be recorded and shared with your therapist and InnerSpark’s admin team for scheduling.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
