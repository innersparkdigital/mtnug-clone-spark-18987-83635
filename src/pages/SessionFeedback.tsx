import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND = "#3B4FD4";
const WARM = "#F2994A";
const RED = "#E24B4A";

const FIT_OPTIONS = [
  "Very comfortable — felt safe and heard",
  "Comfortable — it went well",
  "Neutral — needs more time",
  "Not the right fit for me",
];
const ADDRESSED_OPTIONS = [
  "Yes, fully",
  "Partially — we're getting there",
  "Not yet — we need more sessions",
  "No — I'd like a different approach",
];
const REBOOK_OPTIONS = [
  "Yes — please book me in",
  "Maybe — I'll think about it",
  "Not right now",
];
const RECOMMEND_OPTIONS = [
  "Definitely yes",
  "Probably yes",
  "Not sure",
  "Probably not",
];
const STAR_LABELS = ["", "Poor", "Could be better", "Good", "Very good", "Excellent"];

const CardChoice = ({
  value,
  selected,
  onClick,
}: {
  value: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "w-full text-left rounded-lg border-2 px-4 py-3 text-sm transition-all",
      selected
        ? "border-[color:var(--brand)] bg-[#EEF0FD] text-[#0C447C] font-medium"
        : "border-gray-200 bg-white hover:border-gray-300 text-gray-700",
    )}
    style={{ ["--brand" as any]: BRAND }}
  >
    {value}
  </button>
);

const SessionFeedback = () => {
  const [params] = useSearchParams();
  const sessionCode = params.get("session") || "";
  const therapistParam = params.get("therapist") || "";
  const clientParam = params.get("client") || "";

  const [therapistName, setTherapistName] = useState(therapistParam);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [fit, setFit] = useState("");
  const [addressed, setAddressed] = useState("");
  const [rebook, setRebook] = useState("");
  const [recommend, setRecommend] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!sessionCode) {
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from("session_feedback")
        .select("id")
        .eq("session_code", sessionCode)
        .maybeSingle();
      if (!mounted) return;
      if (data) setAlreadySubmitted(true);
      setChecking(false);
    })();
    return () => {
      mounted = false;
    };
  }, [sessionCode]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (therapistName.trim().length < 2) e.therapist = "Please enter your therapist's name";
    if (!rating) e.rating = "Please select a star rating";
    if (!fit) e.fit = "Please select an answer to continue";
    if (!addressed) e.addressed = "Please select an answer to continue";
    if (!rebook) e.rebook = "Please select an answer to continue";
    if (!recommend) e.recommend = "Please select an answer to continue";
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const code = sessionCode || `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const { error } = await supabase.from("session_feedback").insert({
      session_code: code,
      therapist_name: therapistName.trim(),
      therapist_slug: params.get("therapist") ? therapistParam : null,
      client_name: clientParam || null,
      star_rating: rating,
      therapist_fit: fit,
      session_addressed: addressed,
      would_rebook: rebook,
      would_recommend: recommend,
      open_comment: comment.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        setAlreadySubmitted(true);
        return;
      }
      setErrors({ submit: error.message || "Something went wrong. Please try again." });
      return;
    }
    setSubmitted(true);
  };

  const showBookCta = useMemo(() => rebook === "Yes — please book me in", [rebook]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Session Feedback | InnerSpark Africa</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="mx-auto w-full max-w-[560px]">
        {/* Hero */}
        <div className="px-5 pt-8 pb-6" style={{ background: BRAND }}>
          <div className="text-white font-bold text-lg tracking-tight mb-4">InnerSpark Africa</div>
          <h1 className="text-white text-2xl font-bold leading-tight">How was your session?</h1>
          <p className="text-white/80 text-sm mt-2">
            InnerSpark Africa · Session feedback · Takes 2 minutes
          </p>
          {clientParam && !submitted && !alreadySubmitted && (
            <p className="text-white text-sm mt-3 font-medium">
              Hi {clientParam}! We'd love to hear from you.
            </p>
          )}
        </div>
        <div style={{ background: WARM, height: 4 }} />

        {/* Body */}
        <div className="bg-white px-5 py-6 min-h-[60vh]">
          {alreadySubmitted ? (
            <div className="text-center py-16">
              <CheckCircle2 className="mx-auto h-12 w-12 mb-4" style={{ color: "#2E7D5E" }} />
              <h2 className="text-xl font-semibold mb-2">Already submitted</h2>
              <p className="text-gray-600">
                You have already submitted feedback for this session. Thank you — we really appreciate it. 💙
              </p>
            </div>
          ) : submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="mx-auto h-12 w-12 mb-4" style={{ color: "#2E7D5E" }} />
              <h2 className="text-xl font-semibold mb-3">
                Thank you — your feedback has been received.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We really appreciate you taking the time to share how your session went. Your response has
                been sent to the InnerSpark team. Take care of yourself. 💙 InnerSpark Africa
              </p>
              {showBookCta && (
                <Link to="/specialists" className="inline-block mt-6">
                  <Button className="text-white" style={{ background: BRAND }}>
                    Book your next session →
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-7">
              {/* Field 1 — therapist */}
              <div id="field-therapist">
                <Label className="text-base font-semibold">Who was your therapist?</Label>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  Enter the full name of the therapist you met with today
                </p>
                <Input
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  placeholder="e.g. Janet Kekiconco"
                  className={cn(errors.therapist && "border-2")}
                  style={errors.therapist ? { borderColor: RED } : undefined}
                />
                {therapistParam && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    We've pre-filled this from your session link — please confirm it's correct.
                  </p>
                )}
                {errors.therapist && (
                  <p className="text-xs mt-1.5" style={{ color: RED }}>{errors.therapist}</p>
                )}
              </div>

              {/* Field 2 — stars */}
              <div id="field-rating">
                <Label className="text-base font-semibold">Overall session experience</Label>
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = (hoverRating || rating) >= n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          className="h-9 w-9 transition-colors"
                          style={{
                            fill: active ? WARM : "transparent",
                            color: active ? WARM : "#D1D5DB",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-1 h-5">
                  {STAR_LABELS[hoverRating || rating] || ""}
                </p>
                {errors.rating && (
                  <p className="text-xs mt-1" style={{ color: RED }}>{errors.rating}</p>
                )}
              </div>

              {/* Fields 3-6 */}
              {(
                [
                  { id: "fit", label: "How did you feel about your therapist?", options: FIT_OPTIONS, value: fit, set: setFit },
                  { id: "addressed", label: "Did the session address what you came for?", options: ADDRESSED_OPTIONS, value: addressed, set: setAddressed },
                  { id: "rebook", label: "Would you book another session?", options: REBOOK_OPTIONS, value: rebook, set: setRebook },
                  { id: "recommend", label: "Would you recommend InnerSpark to someone you know?", options: RECOMMEND_OPTIONS, value: recommend, set: setRecommend },
                ] as const
              ).map((q) => (
                <div key={q.id} id={`field-${q.id}`}>
                  <Label className="text-base font-semibold">{q.label}</Label>
                  <div className="grid gap-2 mt-3">
                    {q.options.map((opt) => (
                      <CardChoice
                        key={opt}
                        value={opt}
                        selected={q.value === opt}
                        onClick={() => q.set(opt)}
                      />
                    ))}
                  </div>
                  {errors[q.id] && (
                    <p className="text-xs mt-1.5" style={{ color: RED }}>{errors[q.id]}</p>
                  )}
                </div>
              ))}

              {/* Field 7 — comment */}
              <div>
                <Label className="text-base font-semibold">Anything else you'd like to share?</Label>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  Your comments help us improve. This is completely private.
                </p>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                  placeholder="Write anything — what helped, what could be better, how you're feeling after the session..."
                  className="min-h-[90px]"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{comment.length} / 1000</p>
              </div>

              {errors.submit && (
                <p className="text-sm" style={{ color: RED }}>{errors.submit}</p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-12 text-white text-base font-semibold rounded-xl"
                style={{ background: BRAND }}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit my feedback"}
              </Button>
              <p className="text-[11px] text-gray-500 text-center">
                Your feedback is completely confidential and is never shared with your employer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionFeedback;