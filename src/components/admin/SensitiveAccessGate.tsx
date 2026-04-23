import { useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  pageKey: string;
  pageLabel: string;
  children: ReactNode;
  /** Minutes before re-auth is required again. Default: 30 */
  ttlMinutes?: number;
}

/**
 * Wraps sensitive admin pages and requires the user to re-enter their password
 * before unlocking. The unlock token is cached in sessionStorage with a TTL.
 */
const SensitiveAccessGate = ({ pageKey, pageLabel, children, ttlMinutes = 30 }: Props) => {
  const { user } = useAuth();
  const storageKey = `sensitive_unlock_${pageKey}`;
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      const expires = Number(raw);
      if (Number.isFinite(expires) && expires > Date.now()) {
        setUnlocked(true);
      } else {
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: user.email, password });
    setLoading(false);
    if (error) {
      toast.error("Incorrect password");
      return;
    }
    const expires = Date.now() + ttlMinutes * 60 * 1000;
    sessionStorage.setItem(storageKey, String(expires));
    setPassword("");
    setUnlocked(true);
    toast.success(`${pageLabel} unlocked`);
  };

  if (unlocked) return <>{children}</>;

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-4 w-4 text-primary" />
            <DialogTitle>Confirm your password</DialogTitle>
          </div>
          <DialogDescription>
            <span className="font-medium text-foreground">{pageLabel}</span> contains sensitive data. Re-enter your password to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={verify} className="space-y-4">
          <div>
            <Label htmlFor="confirm-password">Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !password} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
              Unlock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SensitiveAccessGate;