import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Phone, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

type Answer = "no" | "passed" | "still";

interface Props {
  token: string;
  assignmentToolId: string;
  onDone: () => void;
  onBack: () => void;
}

const SafetyCheckInTool = ({ token, assignmentToolId, onDone, onBack }: Props) => {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (a: Answer) => {
    setAnswer(a);
    setSubmitting(true);
    const severity: "low" | "medium" | "red" = a === "no" ? "low" : a === "passed" ? "medium" : "red";
    const safety_flag = a !== "no";
    const payload = {
      question: "In the last 24 hours, have you had any thoughts of harming yourself or not wanting to be here?",
      answer: a,
      severity,
      crisis_message_shown: a === "still",
    };
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: payload,
      _final: true,
      _safety_flag: safety_flag,
      _mood_score: null,
      _screening_score: null,
      _screening_severity: severity,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      setAnswer(null);
      return;
    }
  };

  if (answer === "no") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thank you for checking in 💙</CardTitle>
          <CardDescription>
            Your therapist has been notified that you checked in today. You do not have to carry this alone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you ever need to talk to someone right now, the Uganda Crisis Line is free and available 24/7.
          </p>
          <a href="tel:0800212121" className="inline-flex items-center gap-2 mt-3 text-primary hover:underline text-sm">
            <Phone className="h-4 w-4" /> 0800 212 121
          </a>
          <div className="mt-6"><Button onClick={onDone}>Back to my space</Button></div>
        </CardContent>
      </Card>
    );
  }

  if (answer === "passed") {
    return (
      <Card className="border-amber-300 bg-amber-50/40">
        <CardHeader>
          <CardTitle>Thank you for telling us</CardTitle>
          <CardDescription>Those thoughts are heavy to carry, even when they pass. We're glad you shared this.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-white border p-4">
            <div className="text-sm font-medium mb-1">If they come back, please reach out immediately</div>
            <a href="tel:0800212121" className="inline-flex items-center gap-2 text-primary text-lg font-semibold">
              <Phone className="h-5 w-5" /> 0800 212 121
            </a>
            <p className="text-xs text-muted-foreground mt-1">Uganda Crisis Line — free, confidential, 24/7</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Your therapist has been notified and will follow up with you. You matter. 💙
          </p>
          <Button onClick={onDone} className="w-full">Back to my space</Button>
        </CardContent>
      </Card>
    );
  }

  if (answer === "still") {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-destructive mt-1" />
            <div>
              <CardTitle>Thank you for telling us. That took courage.</CardTitle>
              <CardDescription className="mt-2">
                Please reach out right now. You do not have to face this alone.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <a
            href="tel:0800212121"
            className="block rounded-xl bg-destructive text-destructive-foreground text-center p-6 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              <Phone className="h-5 w-5" /> Call 0800 212 121 now
            </div>
            <div className="text-sm opacity-90 mt-1">Uganda Crisis Line — free, confidential, available now</div>
          </a>
          <div className="text-sm space-y-2 bg-white rounded-lg border p-4">
            <p>Your therapist and the InnerSpark clinical team have been notified and will reach out to you personally.</p>
            <p className="font-medium">You matter. Please stay with us. 💙</p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Your space will unlock again once your therapist has connected with you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>We noticed you're having a hard time</CardTitle>
        <CardDescription>
          We just want to check in with you for a moment. This helps your therapist understand how to support you best.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium leading-relaxed">
          In the last 24 hours, have you had any thoughts of harming yourself or not wanting to be here?
        </p>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start h-auto py-3 whitespace-normal text-left" onClick={() => submit("no")} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} No
          </Button>
          <Button variant="outline" className="w-full justify-start h-auto py-3 whitespace-normal text-left" onClick={() => submit("passed")} disabled={submitting}>
            Yes, but they passed
          </Button>
          <Button variant="outline" className="w-full justify-start h-auto py-3 whitespace-normal text-left border-destructive/40 text-destructive hover:bg-destructive/5" onClick={() => submit("still")} disabled={submitting}>
            Yes, I am still having these thoughts
          </Button>
        </div>
        <div className="pt-2">
          <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyCheckInTool;