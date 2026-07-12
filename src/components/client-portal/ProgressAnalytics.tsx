import { useEffect, useMemo, useRef } from "react";

interface Tool {
  id: string;
  tool_key: string;
  completed_dates?: string[];
  latest_submission?: any;
}

interface Props {
  tools: Tool[];
  clientFirstName: string;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

const ProgressAnalytics = ({ tools, clientFirstName }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const moodPoints = useMemo(() => {
    const points: { date: string; mood: number }[] = [];
    tools.forEach((t) => {
      const s = t.latest_submission;
      if (s?.mood_score != null && s?.submitted_at) {
        points.push({ date: iso(new Date(s.submitted_at)), mood: Number(s.mood_score) });
      }
    });
    const byDate: Record<string, number[]> = {};
    points.forEach((p) => { (byDate[p.date] ||= []).push(p.mood); });
    const days: { date: string; mood: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = iso(d);
      const arr = byDate[k];
      days.push({ date: k, mood: arr ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN });
    }
    return days;
  }, [tools]);

  const ring = useMemo(() => {
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - 6);
    const target = tools.length * 7 || 1;
    let done = 0;
    tools.forEach((t) => {
      (t.completed_dates || []).forEach((d) => {
        if (new Date(d) >= cutoff) done += 1;
      });
    });
    return { pct: Math.min(100, Math.round((done / target) * 100)), done, target };
  }, [tools]);

  const checkInsThisMonth = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    let n = 0;
    tools.forEach((t) => {
      (t.completed_dates || []).forEach((d) => {
        if (new Date(d) >= start) n += 1;
      });
    });
    return n;
  }, [tools]);

  const phq = tools.find((t) => t.tool_key === "screening-phq9")?.latest_submission;
  const gad = tools.find((t) => t.tool_key === "screening-gad7")?.latest_submission;

  const moodValid = moodPoints.filter((p) => !Number.isNaN(p.mood));
  const moodTrendLine = (() => {
    if (moodValid.length < 4) return null;
    const first = moodValid.slice(0, Math.max(3, Math.floor(moodValid.length / 3)));
    const last = moodValid.slice(-Math.max(3, Math.floor(moodValid.length / 3)));
    const avg = (arr: typeof moodValid) => arr.reduce((a, b) => a + b.mood, 0) / arr.length;
    const diff = avg(last) - avg(first);
    if (diff > 0.5) return "Your mood has been trending upward recently. 💙";
    if (diff < -0.5) return "It's been a heavier stretch. Being here still counts.";
    return "You've had more stable days recently. Keep going.";
  })();

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const values = moodPoints.map((p) => p.mood);
    const validVals = values.filter((v) => !Number.isNaN(v));
    if (validVals.length < 2) {
      ctx.fillStyle = "hsl(0 0% 55%)";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Your mood chart will fill in as you check in.", w / 2, h / 2);
      return;
    }
    const min = Math.min(...validVals), max = Math.max(...validVals);
    const range = max - min || 1;
    const step = w / (values.length - 1);
    const y = (v: number) => h - 12 - ((v - min) / range) * (h - 24);

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(59, 79, 212, 0.35)");
    grad.addColorStop(1, "rgba(59, 79, 212, 0)");

    let lastVal = validVals[0];
    ctx.beginPath();
    values.forEach((v, i) => {
      const val = Number.isNaN(v) ? lastVal : v;
      lastVal = val;
      const x = i * step;
      if (i === 0) ctx.moveTo(x, y(val));
      else ctx.lineTo(x, y(val));
    });
    ctx.strokeStyle = "hsl(232 65% 53%)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }, [moodPoints]);

  const ringCirc = 2 * Math.PI * 42;
  const dash = (ring.pct / 100) * ringCirc;

  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">My progress</h2>

      <div className="card-calm">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Mood over 30 days</div>
          <div className="text-[11px] text-muted-foreground">daily check-ins</div>
        </div>
        <div className="relative h-32">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
        {moodTrendLine && (
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{moodTrendLine}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="card-calm flex items-center gap-4">
          <svg width={100} height={100} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={42} stroke="hsl(var(--muted))" strokeWidth={8} fill="none" />
            <circle
              cx={50} cy={50} r={42} fill="none"
              stroke="hsl(var(--primary))" strokeWidth={8} strokeLinecap="round"
              strokeDasharray={`${dash} ${ringCirc}`}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.22,1,0.36,1)" }}
            />
            <text x={50} y={54} textAnchor="middle" fontSize={20} fontWeight={600} fill="hsl(var(--foreground))">
              {ring.pct}%
            </text>
          </svg>
          <div>
            <div className="font-medium">This week</div>
            <div className="text-sm text-muted-foreground">{ring.done} of {ring.target} completed</div>
            <div className="text-xs text-muted-foreground mt-1">Every check-in matters.</div>
          </div>
        </div>

        <div className="card-calm">
          <div className="font-medium">Check-ins this month</div>
          <div className="text-3xl font-semibold mt-2">{checkInsThisMonth}</div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            You've checked in {checkInsThisMonth} time{checkInsThisMonth === 1 ? "" : "s"} this month. Every one of them counts. 💙
          </p>
        </div>
      </div>

      {(phq || gad) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {phq && <ScoreCard title="Wellbeing (PHQ-9)" score={phq.payload?.score ?? phq.screening_score} severity={phq.payload?.severity || phq.screening_severity} />}
          {gad && <ScoreCard title="Anxiety (GAD-7)"   score={gad.payload?.score ?? gad.screening_score} severity={gad.payload?.severity || gad.screening_severity} />}
        </div>
      )}
    </section>
  );
};

const ScoreCard = ({ title, score, severity }: { title: string; score: any; severity: any }) => (
  <div className="card-calm">
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
    <div className="text-2xl font-semibold mt-1">{score ?? "—"}</div>
    {severity && (
      <div className="text-xs text-muted-foreground mt-1 capitalize">
        {String(severity).replace(/_/g, " ")}
      </div>
    )}
    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
      This is a reflection of a moment, not a label. Progress is often quiet.
    </p>
  </div>
);

export default ProgressAnalytics;