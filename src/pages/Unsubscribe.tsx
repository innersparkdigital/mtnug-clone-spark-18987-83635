import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "already" | "invalid" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    const validate = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        const data = await res.json();
        if (res.ok && data.valid) setStatus("valid");
        else if (data.reason === "already_unsubscribed") setStatus("already");
        else setStatus("invalid");
      } catch { setStatus("invalid"); }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      setStatus(data?.success ? "success" : "error");
    } catch { setStatus("error"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-4">
        {status === "loading" && <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />}
        {status === "valid" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Unsubscribe</h1>
            <p className="text-muted-foreground">Are you sure you want to unsubscribe from our emails?</p>
            <Button onClick={handleUnsubscribe}>Confirm Unsubscribe</Button>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Unsubscribed</h1>
            <p className="text-muted-foreground">You've been successfully unsubscribed.</p>
          </>
        )}
        {status === "already" && (
          <>
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Already Unsubscribed</h1>
            <p className="text-muted-foreground">You've already been unsubscribed from our emails.</p>
          </>
        )}
        {(status === "invalid" || status === "error") && (
          <>
            <XCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Invalid Link</h1>
            <p className="text-muted-foreground">This unsubscribe link is invalid or has expired.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
