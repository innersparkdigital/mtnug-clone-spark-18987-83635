import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Props = { accountType: "client" | "therapist"; onBack: () => void };

const ManualResetRequestForm = ({ accountType, onBack }: Props) => {
  const [identifier, setIdentifier] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!identifier.trim()) return;
    setBusy(true);
    await supabase.functions.invoke("manual-password-reset", {
      body: { action: "request", account_type: accountType, identifier: identifier.trim() },
    });
    setBusy(false);
    setDone(true);
  };

  if (done) return (
    <div className="space-y-4 text-center">
      <p className="font-semibold">Your request has been received.</p>
      <p className="text-sm text-muted-foreground">If the details match an account, an InnerSpark administrator will contact you directly with a temporary password or passcode.</p>
      <Button type="button" variant="outline" className="w-full" onClick={onBack}>Back to sign in</Button>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor={`${accountType}-reset-identifier`}>Registered email or phone number</Label>
        <Input id={`${accountType}-reset-identifier`} value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" required />
      </div>
      <p className="text-xs text-muted-foreground">For your security, InnerSpark staff will review this request and share a temporary credential manually.</p>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Request reset
      </Button>
      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>Back</Button>
    </form>
  );
};

export default ManualResetRequestForm;
