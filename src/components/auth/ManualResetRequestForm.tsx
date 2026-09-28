import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = { accountType: "client" | "therapist"; onBack: () => void };

const SUPPORT =
  "https://wa.me/256792085773?text=" +
  encodeURIComponent("Hi InnerSpark, I need help resetting my password.");

const friendlyError = (raw?: string | null) => {
  if (!raw) return "We couldn't submit your request. Please try again or message us on WhatsApp.";
  if (/non-2xx|failed to send|FunctionsHttpError|Edge Function/i.test(raw)) {
    return "We couldn't reach the reset service just now. Please try again in a moment, or WhatsApp +256 792 085 773.";
  }
  return raw;
};

const ManualResetRequestForm = ({ accountType, onBack }: Props) => {
  const [identifier, setIdentifier] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!identifier.trim()) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("manual-password-reset", {
        body: { action: "request", account_type: accountType, identifier: identifier.trim() },
      });

      // Prefer body.ok even when the gateway wraps a soft failure
      if (data?.ok) {
        setDone(true);
        return;
      }

      // Some gateway failures still leave a usable message in data.error
      if (data?.error) {
        toast.error(friendlyError(String(data.error)));
        return;
      }

      if (error) {
        // Last resort: still treat empty-body 2xx-ish ambiguity as success-shaped
        // only when the function is known to return ok:true on request.
        toast.error(friendlyError(error.message));
        return;
      }

      // No error object and no ok — show success path to avoid locking users out
      // (request action is designed to always ack).
      setDone(true);
    } catch (e) {
      toast.error(friendlyError(e instanceof Error ? e.message : null));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="font-semibold">Your request has been received.</p>
        <p className="text-sm text-muted-foreground">
          If the details match an account, InnerSpark staff will review it and contact you. No passcode is sent
          automatically.
        </p>
        <a
          href={SUPPORT}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-primary hover:underline"
        >
          Need it faster? WhatsApp +256 792 085 773
        </a>
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor={`${accountType}-reset-identifier`}>Registered email or phone number</Label>
        <Input
          id={`${accountType}-reset-identifier`}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          required
          maxLength={255}
          placeholder="you@example.com or +256 7…"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        For your security, InnerSpark staff review this request and share a temporary credential manually.
      </p>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Request reset
      </Button>
      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        Back
      </Button>
    </form>
  );
};

export default ManualResetRequestForm;
