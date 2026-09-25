import { useState } from "react";
import { KeyRound, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { copyToClipboard } from "@/lib/copyToClipboard";

/** Staff-only: creates a one-time 48h setup link and shows it exactly once. Sends nothing automatically. */
export default function ClientSetupInviteButton({ clientId, clientName, size = "sm" }: { clientId: string; clientName: string; size?: "sm" | "default" }) {
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [expires, setExpires] = useState<string | null>(null);

  const create = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Create a one-time setup link for ${clientName}? Any earlier unused link for this client stops working.`)) return;
    setBusy(true);
    const { data, error } = await supabase.rpc("issue_client_invite", { _client_id: clientId });
    setBusy(false);
    if (error) {
      return toast.error(/already has a passcode/i.test(error.message)
        ? "This client already has a passcode. Use the passcode reset instead."
        : "Could not create the setup link.");
    }
    const r = data as unknown as { invite: string; expires_at: string };
    setLink(`${window.location.origin}/client-invite/${r.invite}`);
    setExpires(r.expires_at);
  };

  const close = () => { setLink(null); setExpires(null); };

  return (
    <>
      <Button type="button" size={size} variant="outline" disabled={busy} onClick={create}>
        {busy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <KeyRound className="h-4 w-4 mr-1" />}
        Create one-time setup invite
      </Button>
      <Dialog open={!!link} onOpenChange={(o) => { if (!o) close(); }}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Setup link for {clientName}</DialogTitle>
            <DialogDescription>
              Copy it now — it is shown only once. It works one time and expires {expires ? new Date(expires).toLocaleString("en-UG") : "in 48 hours"}. Share it privately with the client.
            </DialogDescription>
          </DialogHeader>
          <Input readOnly value={link || ""} onFocus={(e) => e.currentTarget.select()} />
          <Button onClick={async () => { if (link && (await copyToClipboard(link))) toast.success("Setup link copied"); else toast.error("Couldn't copy — select and copy manually."); }}>
            <Copy className="h-4 w-4 mr-2" /> Copy link
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
