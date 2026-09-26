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
    document.title = "Counselling Informed Consent and Service Agreement | InnerSpark Africa";
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
    if (!record) return "Individual counselling";
    if (record.session_type) return record.session_type;
    return "Individual counselling — video session";
  }, [record]);

  const deliveryMode = isChatSession(record?.session_type) ? "chat" : "video";
  const price =
    typeof record?.session_price_ugx === "number"
      ? record.session_price_ugx
      : deliveryMode === "chat"
        ? 30000
        : 75000;

  const therapistTitle = record?.professional_title || "Licensed mental health professional";
  const sessionMinutes = deliveryMode === "chat" ? 45 : 50;

  const confirm = async () => {
    if (!token || !agreed || submitting) return;
    setSubmitting(true);
    setError("");
    const { data, error: confirmError } = await supabase.rpc("confirm_client_consent", { _token: token });
    setSubmitting(false);
    if (confirmError || !data) {
      setError(
        "We could not record your consent. Please try again or contact InnerSpark Africa on WhatsApp +256 792 085 773.",
      );
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
              <CardTitle className="text-xl sm:text-2xl">
                Counselling Informed Consent and Service Agreement
              </CardTitle>
              <p className="text-sm text-muted-foreground">2026 · InnerSpark Africa</p>
              <div className="mt-4 grid gap-3 rounded-md border bg-muted/40 p-4 text-sm sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Therapist / counsellor</p>
                  <p className="font-medium text-foreground">{record.therapist_name}</p>
                  <p className="text-muted-foreground">{therapistTitle}</p>
                  <p className="text-muted-foreground">Practice: InnerSpark Africa</p>
                  <p className="text-muted-foreground">WhatsApp / phone: +256 792 085 773</p>
                  <p className="text-muted-foreground">Email: info@innersparkafrica.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client</p>
                  <p className="font-medium text-foreground">{record.client_name}</p>
                  <p className="text-muted-foreground">Service: {serviceLabel}</p>
                  <p className="text-muted-foreground">
                    Session fee: <strong className="text-foreground">UGX {price.toLocaleString()}</strong>
                  </p>
                  <p className="text-muted-foreground">Agreement date: {formatDate(record.generated_at || new Date().toISOString())}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 text-sm leading-6">
              {record.consent_signed && record.consent_signed_at ? (
                <div className="rounded-md border border-primary/30 bg-primary/5 p-5 text-center" aria-live="polite">
                  <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-primary" />
                  <h2 className="font-semibold">Consent confirmed</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Recorded on {formatDate(record.consent_signed_at)} for {record.client_name}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Your therapist and InnerSpark’s admin team can see that this agreement is signed.
                  </p>
                </div>
              ) : (
                <>
                  <p>
                    Please read this agreement carefully before confirming. If anything is unclear, ask{" "}
                    <strong>{record.therapist_name}</strong> before or during your first session. Confirming below is
                    your electronic signature for this agreement.
                  </p>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">1. Purpose of counselling</h2>
                    <p>
                      Counselling is a confidential and collaborative process to explore concerns, improve emotional
                      wellbeing, develop coping strategies, and work toward personally meaningful goals. Counselling does
                      not guarantee a particular result and is not a substitute for emergency or specialist medical care
                      when such care is required.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">2. Session length and expected number of sessions</h2>
                    <p>
                      Each counselling session will normally last approximately <strong>{sessionMinutes} minutes</strong>.
                      This includes time for discussion, assessment, interventions, and planning. Late arrival may reduce
                      the available session time, and the full fee may remain payable.
                    </p>
                    <p>
                      The initial counselling plan is typically for a small block of sessions (often about 4–6), scheduled
                      weekly or fortnightly as you and your therapist agree. This is an estimate rather than a fixed
                      commitment. The actual number of sessions may change depending on your needs, progress, goals,
                      availability, and clinical recommendations.
                    </p>
                    <p>
                      Progress and goals will be reviewed after the first few sessions and periodically thereafter.
                      Following review, you and your therapist may agree to:
                    </p>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Continue for additional sessions</li>
                      <li>Change the frequency or focus of counselling</li>
                      <li>Conclude counselling and develop a follow-up plan</li>
                      <li>Arrange referral or additional support where appropriate</li>
                    </ul>
                    <p>
                      You may request a review or end counselling at any time. Any extension will be discussed and agreed
                      before additional sessions begin.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">3. Voluntary participation</h2>
                    <p>
                      Participation is voluntary. You may ask questions, decline to answer questions, discuss concerns
                      about therapy, request a referral, or end counselling at any time. You are encouraged to attend
                      punctually, participate as comfortable, practise agreed strategies, and communicate relevant
                      concerns or changes.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">4. Confidentiality</h2>
                    <p>
                      Information shared during counselling will remain confidential except where disclosure is required
                      or permitted by law or professional ethical standards, including:
                    </p>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>A serious and foreseeable risk of harm to you or another person</li>
                      <li>Abuse, neglect, exploitation, or safeguarding concerns where mandatory reporting applies</li>
                      <li>A court order or other legal obligation</li>
                      <li>An emergency requiring information to be shared to protect safety</li>
                      <li>Limited professional consultation or supervision where legally and ethically permitted</li>
                    </ul>
                    <p>
                      Where possible, your therapist will discuss the limits of confidentiality with you before disclosure
                      and will share only information reasonably necessary for the relevant purpose.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">5. Records and privacy</h2>
                    <p>
                      Your therapist may keep clinical and administrative records as required by law, professional
                      standards, or insurance requirements. Records are handled with reasonable privacy and security
                      measures and retained for the period required by applicable law, including the Uganda Data Protection
                      and Privacy Act 2019 where it applies. You may request access to or correction of your information,
                      subject to lawful limitations, by emailing <strong>info@innersparkafrica.com</strong>.
                    </p>
                    <p>
                      Electronic communications may not be completely secure and are not monitored continuously. Please
                      avoid sending highly sensitive information by ordinary email or text message.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">6. Therapist responsibilities</h2>
                    <p>
                      Your therapist will provide respectful, ethical, professional, and culturally responsive care;
                      maintain appropriate boundaries; protect privacy; collaborate on goals; use evidence-informed
                      interventions; review progress; and recommend referral or additional support when appropriate.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">7. Appointments, fees, and cancellation</h2>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>
                        The session fee for this service ({serviceLabel}) is{" "}
                        <strong>UGX {price.toLocaleString()}</strong>, payable via MTN or Airtel Mobile Money, or card where
                        available, before or as arranged for the session.
                      </li>
                      <li>
                        Please give at least <strong>24 hours’ notice</strong> to cancel or reschedule.
                      </li>
                      <li>
                        Sessions cancelled with less than 24 hours’ notice, or missed without notice, may be charged in
                        full unless InnerSpark Africa agrees otherwise in writing.
                      </li>
                      <li>Any changes to fees or policies will be communicated in advance where reasonably practicable.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">8. Online counselling</h2>
                    <p>For video, voice, or chat sessions, you agree to:</p>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Attend from a private location</li>
                      <li>Use a secure connection where possible</li>
                      <li>Inform your therapist if anyone else is present</li>
                      <li>Not record the session without prior agreement</li>
                    </ul>
                    <p>Technical disruptions may occur.</p>
                    <p>
                      <strong>Reconnection procedure:</strong> if the call drops, stay available on the same device and
                      wait for your therapist to reconnect, or message InnerSpark on WhatsApp{" "}
                      <strong>+256 792 085 773</strong>. If connection cannot be restored within a reasonable time, the
                      session may be rescheduled.
                    </p>
                    <p>
                      At the start of each online session, your therapist may ask you to confirm your current location for
                      safety and continuity of care.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">9. Risks, benefits, and emergencies</h2>
                    <p>
                      Potential benefits may include improved emotional understanding, coping skills, self-awareness,
                      problem-solving, relationships, and resilience. Possible risks include temporary emotional discomfort
                      when discussing difficult experiences or making changes.
                    </p>
                    <p>
                      Counselling is <strong>not an emergency service</strong>. If you are in immediate danger or at risk of
                      serious harm:
                    </p>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Contact local emergency services or attend the nearest emergency department</li>
                      <li>Contact an appropriate crisis service available in your area</li>
                      <li>
                        Message InnerSpark Africa on WhatsApp: <strong>+256 792 085 773</strong> (support and coordination;
                        not a substitute for emergency services)
                      </li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">10. Boundaries, concerns, and ending therapy</h2>
                    <p>
                      The therapeutic relationship is professional. Your therapist will maintain appropriate boundaries.
                      Contact outside sessions should generally be limited to appointments, administration, or safety
                      matters. You are encouraged to raise concerns directly with your therapist.
                    </p>
                    <p>
                      Your therapist may end or pause counselling where it is clinically inappropriate, safety requires it,
                      boundaries cannot be maintained, or another lawful and ethical reason applies. Appropriate referral
                      will be considered where possible.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold">11. Consent and agreement</h2>
                    <p>By checking the box below and confirming, you confirm that:</p>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>
                        The counselling process, session length, estimated number of sessions, review process, fees, risks,
                        benefits, alternatives, and confidentiality limits have been explained in this agreement
                      </li>
                      <li>You have had a chance to ask questions, or know you can ask your therapist before continuing</li>
                      <li>Participation is voluntary</li>
                      <li>You understand that counselling is not an emergency service</li>
                      <li>You agree to this Agreement and consent to begin counselling with {record.therapist_name}</li>
                      <li>Consent may be withdrawn at any time</li>
                    </ul>
                    <p className="text-xs text-muted-foreground">
                      If you are under 18, a parent, guardian, or authorised decision-maker should also review this
                      agreement and arrange consent with InnerSpark before sessions begin.
                    </p>
                  </section>

                  <div className="flex items-start gap-3 rounded-md border p-4">
                    <Checkbox
                      id="consent-confirmation"
                      checked={agreed}
                      onCheckedChange={(value) => setAgreed(value === true)}
                    />
                    <Label htmlFor="consent-confirmation" className="cursor-pointer text-sm font-normal leading-5">
                      I, {record.client_name}, have read and understood this Counselling Informed Consent and Service
                      Agreement, and I consent to proceed with counselling / therapy sessions with{" "}
                      {record.therapist_name} through InnerSpark Africa.
                    </Label>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}

                  <Button className="w-full" disabled={!agreed || submitting} onClick={confirm}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm and sign agreement
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Your confirmation time is recorded as your electronic signature and shared with your therapist and
                    InnerSpark’s admin team.
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
