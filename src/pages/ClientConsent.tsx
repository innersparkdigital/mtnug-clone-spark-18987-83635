import { useEffect, useState } from "react";
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
  consent_signed: boolean;
  consent_signed_at: string | null;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const formatSignedAt = (value: string) =>
  new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));

export default function ClientConsent() {
  const { token } = useParams<{ token: string }>();
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Client Consent | InnerSpark Africa";
    if (!token || !UUID_PATTERN.test(token)) {
      setError("This consent link is invalid or has expired.");
      setLoading(false);
      return;
    }

    const loadConsent = async () => {
      const { data, error: loadError } = await supabase.rpc("get_client_consent", { _token: token });
      if (loadError || !data) {
        setError("This consent link is invalid or has expired.");
      } else {
        setRecord(data as unknown as ConsentRecord);
      }
      setLoading(false);
    };
    loadConsent();
  }, [token]);

  const confirm = async () => {
    if (!token || !agreed || submitting) return;
    setSubmitting(true);
    setError("");
    const { data, error: confirmError } = await supabase.rpc("confirm_client_consent", { _token: token });
    setSubmitting(false);
    if (confirmError || !data) {
      setError("We could not record your consent. Please try again or contact InnerSpark Africa.");
      return;
    }
    const result = data as unknown as Pick<ConsentRecord, "consent_signed" | "consent_signed_at">;
    setRecord((current) => current ? { ...current, ...result } : current);
  };

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16">
      <NoIndex />
      <div className="mx-auto max-w-2xl">
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
                Consent Form for {record.client_name} — Session with {record.therapist_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Please read the information below before confirming.</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {record.consent_signed && record.consent_signed_at ? (
                <div className="rounded-md border border-primary/30 bg-primary/5 p-5 text-center" aria-live="polite">
                  <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-primary" />
                  <h2 className="font-semibold">Consent confirmed</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Recorded on {formatSignedAt(record.consent_signed_at)}
                  </p>
                </div>
              ) : (
                <>
                  <section className="rounded-md border border-dashed border-destructive/50 bg-destructive/5 p-5">
                    <p className="text-xs font-semibold uppercase text-destructive">Placeholder text — not approved for client use</p>
                    <h2 className="mt-3 font-semibold">Clinical consent wording will appear here</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      InnerSpark Africa’s clinical and compliance lead must provide and approve the complete informed-consent language before this page is used with clients. This placeholder does not constitute legal or clinical consent wording.
                    </p>
                  </section>

                  <div className="flex items-start gap-3 rounded-md border p-4">
                    <Checkbox id="consent-confirmation" checked={agreed} onCheckedChange={(value) => setAgreed(value === true)} />
                    <Label htmlFor="consent-confirmation" className="cursor-pointer text-sm font-normal leading-5">
                      I have read and understood the above, and I consent to proceed
                    </Label>
                  </div>

                  {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

                  <Button className="w-full" disabled={!agreed || submitting} onClick={confirm}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm consent
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Your confirmation time will be recorded securely when you select Confirm.
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