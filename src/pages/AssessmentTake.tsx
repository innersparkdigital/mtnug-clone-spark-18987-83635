import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ASSESSMENT_DEFS, LIKERT_LABELS, buildReportPayload } from "@/lib/psychometricEngine";

const BLUE = "#3B4FD4";
const NIGHT = "#1A1A2E";
const WARM = "#F2994A";

export default function AssessmentTake() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const def = useMemo(() => (meta?.catalog_id ? ASSESSMENT_DEFS[meta.catalog_id] : null), [meta]);
  const questions = def?.questions || [];
  const q = questions[step];

  useEffect(() => {
    (async () => {
      if (!token) return;
      const { data, error } = await supabase.rpc("psych_get_invite_public" as any, { _token: token });
      if (error) toast.error(error.message);
      setMeta(data);
      setLoading(false);
    })();
  }, [token]);

  const setAns = (val: number) => {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  };

  const next = async () => {
    if (!q || answers[q.id] == null) return toast.error("Please choose an answer");
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    if (!def || !token || !meta) return;
    setSubmitting(true);
    const report = buildReportPayload(def, meta.employee_name, meta.company_name, answers);
    const { error } = await supabase.rpc("psych_submit_response" as any, {
      _token: token,
      _answers: answers,
      _scores: report.scores,
      _report: report,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Submitted — thank you");
    navigate("/assess/" + token + "/done", { replace: true });
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-7 w-7 animate-spin" style={{ color: BLUE }} /></div>;

  if (!meta || meta.status === "expired" || meta.status === "completed") {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-bold" style={{ color: NIGHT }}>{meta?.status === "completed" ? "Already completed" : "Link unavailable"}</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>{meta?.message || "This assessment link is not valid."}</p>
        </div>
      </div>
    );
  }

  if (!def) {
    return <div className="min-h-screen grid place-items-center p-6 text-sm">Assessment definition missing for {meta.catalog_id}</div>;
  }

  const progress = Math.round(((step + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#F5F6FF,#fff)" }}>
      <Helmet><title>{meta.assessment_name} | InnerSpark</title><meta name="robots" content="noindex" /></Helmet>
      <div className="max-w-xl mx-auto px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: BLUE }}>{meta.company_name}</p>
        <h1 className="text-2xl font-bold" style={{ color: NIGHT }}>{meta.assessment_name}</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Hi {meta.employee_name}. ~{meta.duration_minutes} min. Your answers go to HR as a development report — not a medical diagnosis.</p>

        <div className="mt-6 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: progress + "%", background: BLUE }} />
        </div>
        <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>Question {step + 1} of {questions.length}</p>

        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E6E8FA" }}>
          <p className="font-semibold text-lg leading-snug" style={{ color: NIGHT }}>{q.text}</p>
          <div className="mt-5 space-y-2">
            {q.scale === "likert5"
              ? LIKERT_LABELS.map((label, i) => {
                  const val = i + 1;
                  const active = answers[q.id] === val;
                  return (
                    <button key={label} type="button" onClick={() => setAns(val)}
                      className="w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition"
                      style={{ borderColor: active ? BLUE : "#E6E8FA", background: active ? "#EEF0FD" : "white", color: NIGHT }}>
                      {label}
                    </button>
                  );
                })
              : q.options.map((opt, i) => {
                  const active = answers[q.id] === i;
                  return (
                    <button key={opt} type="button" onClick={() => setAns(i)}
                      className="w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition"
                      style={{ borderColor: active ? BLUE : "#E6E8FA", background: active ? "#EEF0FD" : "white", color: NIGHT }}>
                      {opt}
                    </button>
                  );
                })}
          </div>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
            <Button className="flex-1 text-white" style={{ background: step === questions.length - 1 ? WARM : BLUE }} disabled={submitting} onClick={next}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {step === questions.length - 1 ? "Submit assessment" : "Next"}
            </Button>
          </div>
        </div>
        <p className="text-xs text-center mt-6" style={{ color: "#9CA3AF" }}>{def.disclaimer}</p>
      </div>
    </div>
  );
}
