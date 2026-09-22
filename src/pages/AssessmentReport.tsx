import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Printer } from "lucide-react";

const BLUE = "#3B4FD4";
const NIGHT = "#1A1A2E";
const WARM = "#F2994A";
const GREEN = "#2E7D5E";

export default function AssessmentReport() {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [meta, setMeta] = useState<{ employee_name: string; assessment_name: string; completed_at: string | null } | null>(null);

  useEffect(() => {
    (async () => {
      if (authLoading || !user || !token) return;
      const { data: admin } = await supabase
        .from("corporate_hr_admins" as any)
        .select("company_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();
      const cid = (admin as any)?.company_id;
      if (!cid) { toast.error("HR access required"); setLoading(false); return; }

      const { data, error } = await supabase.rpc("psych_hr_overview" as any, { _company_id: cid });
      if (error) { toast.error(error.message); setLoading(false); return; }
      const inv = ((data as any)?.invites || []).find((i: any) => i.token === token);
      if (!inv?.report) { toast.error("Report not ready"); setLoading(false); return; }
      setReport(inv.report);
      setMeta({ employee_name: inv.employee_name, assessment_name: inv.assessment_name, completed_at: inv.completed_at });
      setLoading(false);
    })();
  }, [user, authLoading, token]);

  const printReport = () => window.print();

  const downloadTxt = () => {
    if (!report || !meta) return;
    const lines = [
      "InnerSpark Corporate — Psychometric Development Report",
      "=====================================================",
      "Employee: " + meta.employee_name,
      "Assessment: " + meta.assessment_name,
      "Generated: " + (report.generated_at || meta.completed_at || ""),
      "Company: " + (report.company_name || ""),
      "",
      report.disclaimer || "",
      "",
      "Overall index: " + report.overall_pct + "%",
      "",
      "Summary",
      report.summary || "",
      "",
      "Dimension scores",
      ...((report.dimensions || []).map((d: any) => "- " + d.label + ": " + d.pct + "% (" + d.band + ") — " + d.narrative)),
      "",
      "Strengths",
      ...(report.strengths || []).map((s: string) => "- " + s),
      "",
      "Watch-outs / development",
      ...(report.watchouts || []).map((s: string) => "- " + s),
      "",
      "This report is for workplace development only. It is not a clinical or medical diagnosis.",
      "Share with the employee in a supportive conversation.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "innerspark-report-" + (meta.employee_name || "employee").replace(/\s+/g, "-").toLowerCase() + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-7 w-7 animate-spin" style={{ color: BLUE }} /></div>;
  }

  if (!report || !meta) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-center space-y-3">
          <p className="font-semibold" style={{ color: NIGHT }}>Report unavailable</p>
          <Link to="/corporate-assessments" className="text-sm" style={{ color: BLUE }}>Back to assessments</Link>
        </div>
      </div>
    );
  }

  const dims = report.dimensions || [];

  return (
    <div className="min-h-screen" style={{ background: "#F5F6FF" }}>
      <Helmet>
        <title>Report — {meta.employee_name} | InnerSpark</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-16 print:py-4">
        <div className="flex flex-wrap gap-2 mb-6 print:hidden">
          <Button variant="outline" asChild><Link to="/corporate-assessments"><ArrowLeft className="h-4 w-4 mr-1" /> Assessments</Link></Button>
          <Button className="text-white" style={{ background: BLUE }} onClick={printReport}><Printer className="h-4 w-4 mr-1" /> Print / PDF</Button>
          <Button className="text-white" style={{ background: WARM }} onClick={downloadTxt}><Download className="h-4 w-4 mr-1" /> Download</Button>
        </div>

        <article className="rounded-3xl border bg-white p-8 md:p-10 shadow-sm print:shadow-none print:border-0" style={{ borderColor: "#E6E8FA" }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: BLUE }}>InnerSpark Corporate</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: NIGHT }}>Psychometric development report</h1>
          <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
            {meta.employee_name} · {meta.assessment_name}
            {meta.completed_at ? " · " + new Date(meta.completed_at).toLocaleDateString() : ""}
          </p>

          <div className="mt-6 rounded-xl px-4 py-3 text-sm" style={{ background: "#FFF7ED", color: "#9A3412" }}>
            {report.disclaimer || "Development tool only — not a clinical diagnosis. Share supportively with the employee."}
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border p-4" style={{ borderColor: "#E6E8FA" }}>
              <p className="text-xs" style={{ color: "#6B7280" }}>Overall index</p>
              <p className="text-3xl font-bold" style={{ color: BLUE }}>{report.overall_pct}%</p>
            </div>
            <div className="sm:col-span-2 rounded-2xl border p-4" style={{ borderColor: "#E6E8FA" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: NIGHT }}>Summary</p>
              <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>{report.summary}</p>
            </div>
          </div>

          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: NIGHT }}>Dimension scores</h2>
          <div className="space-y-4">
            {dims.map((d: any) => (
              <div key={d.key || d.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold" style={{ color: NIGHT }}>{d.label}</span>
                  <span style={{ color: "#6B7280" }}>{d.pct}% · {d.narrative}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: Math.min(100, d.pct || 0) + "%",
                    background: d.band === "high" ? GREEN : d.band === "low" ? WARM : BLUE,
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            <div className="rounded-2xl border p-5" style={{ borderColor: "#D1FAE5", background: "#ECFDF5" }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: GREEN }}>Strengths</p>
              <ul className="text-sm space-y-2" style={{ color: "#065F46" }}>
                {(report.strengths || []).length ? report.strengths.map((s: string) => <li key={s}>• {s}</li>) : <li>• None flagged high this round</li>}
              </ul>
            </div>
            <div className="rounded-2xl border p-5" style={{ borderColor: "#FED7AA", background: "#FFF7ED" }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: "#C2410C" }}>Development focus</p>
              <ul className="text-sm space-y-2" style={{ color: "#9A3412" }}>
                {(report.watchouts || []).length ? report.watchouts.map((s: string) => <li key={s}>• {s}</li>) : <li>• No major lows — keep coaching light</li>}
              </ul>
            </div>
          </div>

          <p className="text-xs mt-10 text-center" style={{ color: "#9CA3AF" }}>
            Share this report with {meta.employee_name} in a supportive 1:1. Combine with manager observation and role requirements.
            InnerSpark Africa · Confidential HR use
          </p>
        </article>
      </div>
    </div>
  );
}
