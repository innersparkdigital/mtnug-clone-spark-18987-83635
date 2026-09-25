import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LockKeyhole } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Do not enable a login form until server-side access checks, sessions and
// revocation of the old permanent link are deployed and verified together.
export default function ClientLogin() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 grid place-items-center">
      <Helmet><title>Client login | InnerSpark Africa</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <Card className="w-full max-w-md rounded-2xl border-primary/20 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><LockKeyhole className="h-6 w-6" /></div>
          <CardTitle className="text-2xl">Client login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">We’re improving how clients enter their private space. The new login is not ready yet; please contact your therapist for help accessing your dashboard.</p>
          <Button asChild variant="outline" className="w-full"><Link to="/">Back to InnerSpark</Link></Button>
          <p className="text-xs text-muted-foreground">Need help? info@innersparkafrica.com</p>
        </CardContent>
      </Card>
    </main>
  );
}
