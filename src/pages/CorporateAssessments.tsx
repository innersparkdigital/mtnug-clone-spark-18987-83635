import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CreditCard, Link2, FileText, Copy, ShoppingCart, ArrowLeft, ClipboardList } from "lucide-react";

const BLUE = "#3B4FD4";
const WARM = "#F2994A";
const NIGHT = "#1A1A2E";
const GREEN = "#2E7D5E";
const fmt = (n: number) => "UGX " + n.toLocaleString("en-UG");

type Pack = { id: string; name: string; credits: number; price_ugx: number };
type Cat = { id: string; name: string; short_name: string; category: string; description: string; duration_minutes: number; credit_cost: number; unit_price_ugx: number };
type Invite = { id: string; token: string; employee_name: string; status: string; assessment_name: string; created_at: string };
type Order = { id: string; credits: number; amount_ugx: number; status: string; created_at: string };

export default function CorporateAssessments() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [creditsSuspended, setCreditsSuspended] = useState(false);
  const [catalog, setCatalog] = useState<Cat[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"catalog" | "buy" | "invites" | "orders">("catalog");
  const [selPack, setSelPack] = useState("pack-5");
  const [payerPhone, setPayerPhone] = useState("");
  const [payerName, setPayerName] = useState("");
  const [buying, setBuying] = useState(false);
  const [selCat, setSelCat] = useState("workplace-personality");
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empRole, setEmpRole] = useState("");
  const [empDept, setEmpDept] = useState("");
  const [inviting, setInviting] = useState(false);
  const [lastLink, setLastLink] = useState("");

  const load = async (cid: string) => {
    const { data, error } = await supabase.rpc("psych_hr_overview" as any, { _company_id: cid });
    if (error) {
      if (!/does not exist|schema cache/i.test(error.message)) toast.error(error.message);
      return;
    }
    const d = data as any;
    setBalance(d.credit_balance || 0);
    setCreditsSuspended(!!d.credits_suspended);
    setCatalog(d.catalog || []);
    setPacks(d.packs || []);
    setInvites(d.invites || []);
    setOrders(d.orders || []);
  };

  useEffect(() => {
    (async () => {
      if (authLoading) return;
      if (!user) { navigate("/corporate-dashboard"); return; }
      const { data } = await supabase.from("corporate_hr_admins" as any).select("company_id").eq("user_id", user.id).eq("is_active", true).maybeSingle();
      const cid = (data as any)?.company_id;
      if (!cid) { navigate("/corporate-dashboard"); return; }
      setCompanyId(cid);
      await load(cid);
      setLoading(false);
    })();
  }, [user, authLoading]);

  const buy = async () => {
    if (!companyId) return;
    setBuying(true);
    const { data, error } = await supabase.rpc("psych_create_order" as any, {
      _company_id: companyId, _pack_id: selPack, _payer_name: payerName || null, _payer_phone: payerPhone || null,
      _payer_email: user?.email || null, _payment_method: "mobile_money",
    });
    setBuying(false);
    if (error) return toast.error(error.message);
    const o = data as any;
    toast.success("Order created — " + fmt(o.amount_ugx));
    toast.info(`Order ${String(o.order_id).slice(0, 8)} created. Pay via Mobile Money/card, then send your order reference to InnerSpark for verification. Credits appear only after payment is confirmed.`);
    await load(companyId);
    setTab("invites");
  };

  const createInvite = async () => {
    if (!companyId) return;
    if (!empName.trim()) return toast.error("Employee name is required");
    setInviting(true);
    const { data, error } = await supabase.rpc("psych_create_invite" as any, {
      _company_id: companyId, _catalog_id: selCat, _employee_name: empName.trim(),
      _employee_email: empEmail.trim() || null, _employee_role: empRole.trim() || null, _department: empDept.trim() || null,
    });
    setInviting(false);
    if (error) return toast.error(error.message.includes("insufficient") ? "Not enough credits — buy a pack first" : error.message);
    const d = data as any;
    const url = window.location.origin + d.path;
    setLastLink(url);
    setBalance(d.credits_left);
    toast.success("Invite link ready");
    setEmpName("");
    await load(companyId);
  };

  const copy = async (text: string) => { await navigator.clipboard.writeText(text); toast.success("Copied"); };

  if (authLoading || loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-7 w-7 animate-spin" style={{ color: BLUE }} /></div>;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#EEF2FF 0%,#fff 40%,#FFF8F0 100%)" }}>
      <Helmet><title>Psychometric assessments | InnerSpark Corporate</title><meta name="robots" content="noindex" /></Helmet>

      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur-md" style={{ borderColor: "#E6E8FA" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/corporate-dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: BLUE }}>
            <ArrowLeft className="h-4 w-4" /> Wellbeing dashboard
          </Link>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "#EEF0FD", color: BLUE }}>Company HR</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 pb-20 space-y-6">
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e3a5f 100%)" }}
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60 mb-2">Paid seats · private links</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Psychometric assessments</h1>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">
                Buy seats → unique employee link → downloadable development report. Not clinical diagnoses.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-5 py-3 self-start sm:self-auto">
              <p className="text-[11px] uppercase tracking-wide text-white/60">Credit balance</p>
              <p className="text-3xl font-bold tracking-tight">{balance}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["catalog", "buy", "invites", "orders"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className="rounded-full px-4 py-2 text-xs font-semibold border capitalize shadow-sm transition-colors"
              style={{ background: tab === t ? BLUE : "white", color: tab === t ? "white" : NIGHT, borderColor: tab === t ? BLUE : "#E6E8FA" }}>
              {t === "buy" ? "Buy credits" : t}
            </button>
          ))}
        </div>

        {tab === "catalog" && (
          <div className="grid md:grid-cols-2 gap-4">
            {catalog.map((c) => (
              <div key={c.id} className="rounded-3xl border bg-white p-5 shadow-sm" style={{ borderColor: "#E6E8FA" }}>
                <div className="flex justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase" style={{ color: WARM }}>{c.category}</span>
                  <span className="text-xs font-semibold" style={{ color: BLUE }}>{c.credit_cost} cr · {fmt(c.unit_price_ugx)}</span>
                </div>
                <h3 className="font-bold text-lg" style={{ color: NIGHT }}>{c.name}</h3>
                <p className="text-sm mt-2" style={{ color: "#6B7280" }}>{c.description}</p>
                <p className="text-xs mt-3" style={{ color: "#9CA3AF" }}>~{c.duration_minutes} min</p>
                <Button size="sm" className="mt-4 text-white rounded-xl" style={{ background: BLUE }} onClick={() => { setSelCat(c.id); setTab("invites"); }}>Use this</Button>
              </div>
            ))}
            {!catalog.length && <p className="text-sm text-muted-foreground">Run psych SQL migration in Supabase to load catalog.</p>}
          </div>
        )}

        {tab === "buy" && (
          <div className="rounded-3xl border bg-white p-6 space-y-5 shadow-sm" style={{ borderColor: "#E6E8FA" }}>
            <div className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" style={{ color: WARM }} /><h2 className="text-lg font-bold" style={{ color: NIGHT }}>Buy assessment seats</h2></div>
            <p className="text-sm" style={{ color: "#6B7280" }}>Like Testportal / Future Options: pay per seat, send unique links, get reports. Mobile Money or card.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {packs.map((p) => (
                <button key={p.id} type="button" onClick={() => setSelPack(p.id)} className="text-left rounded-2xl border p-4"
                  style={{ borderColor: selPack === p.id ? BLUE : "#E6E8FA", background: selPack === p.id ? "#F8F9FF" : "white" }}>
                  <p className="font-semibold" style={{ color: NIGHT }}>{p.name}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: BLUE }}>{fmt(p.price_ugx)}</p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>{p.credits} credits</p>
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Payer name</Label><Input value={payerName} onChange={(e) => setPayerName(e.target.value)} className="mt-1" /></div>
              <div><Label>Mobile Money phone</Label><Input value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} placeholder="+256…" className="mt-1" /></div>
            </div>
            <Button disabled={buying} className="h-11 text-white rounded-xl" style={{ background: WARM }} onClick={buy}>
              {buying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}Request credits
            </Button>
          </div>
        )}

        {tab === "invites" && (
          <div className="space-y-6">
            <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-4" style={{ borderColor: "#E6E8FA" }}>
              <div className="flex items-center gap-2"><Link2 className="h-5 w-5" style={{ color: BLUE }} /><h2 className="text-lg font-bold" style={{ color: NIGHT }}>Create employee link</h2></div>
              <p className="text-sm" style={{ color: "#6B7280" }}>Uses credits from your balance ({balance} left).</p>
              <div>
                <Label>Assessment</Label>
                <select className="w-full mt-1 h-11 rounded-md border px-3 text-sm bg-white" value={selCat} onChange={(e) => setSelCat(e.target.value)}>
                  {catalog.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.credit_cost} cr)</option>)}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Employee name *</Label><Input value={empName} onChange={(e) => setEmpName(e.target.value)} className="mt-1" /></div>
                <div><Label>Email</Label><Input type="email" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} className="mt-1" /></div>
                <div><Label>Role</Label><Input value={empRole} onChange={(e) => setEmpRole(e.target.value)} className="mt-1" /></div>
                <div><Label>Department</Label><Input value={empDept} onChange={(e) => setEmpDept(e.target.value)} className="mt-1" /></div>
              </div>
              <Button disabled={inviting || balance < 1} className="text-white rounded-xl" style={{ background: BLUE }} onClick={createInvite}>
                {inviting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ClipboardList className="h-4 w-4 mr-2" />}Generate unique link
              </Button>
              {lastLink && (
                <div className="rounded-xl border p-3 flex flex-wrap gap-2 items-center" style={{ borderColor: "#C5CAF5", background: "#F8F9FF" }}>
                  <code className="text-xs break-all flex-1">{lastLink}</code>
                  <Button size="sm" variant="outline" onClick={() => copy(lastLink)}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
                </div>
              )}
            </div>
            <div className="rounded-3xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E6E8FA" }}>
              <h3 className="font-bold mb-4" style={{ color: NIGHT }}>Invites & reports</h3>
              <div className="space-y-3">
                {invites.map((inv) => {
                  const link = window.location.origin + "/assess/" + inv.token;
                  return (
                    <div key={inv.id} className="rounded-2xl border p-4 flex flex-wrap gap-3 justify-between" style={{ borderColor: "#E6E8FA" }}>
                      <div>
                        <p className="font-semibold" style={{ color: NIGHT }}>{inv.employee_name}</p>
                        <p className="text-xs" style={{ color: "#6B7280" }}>{inv.assessment_name} · {inv.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => copy(link)}><Copy className="h-3.5 w-3.5 mr-1" />Link</Button>
                        {inv.status === "completed" && (
                          <Button size="sm" className="text-white" style={{ background: GREEN }} asChild>
                            <Link to={"/corporate-assessments/report/" + inv.token}><FileText className="h-3.5 w-3.5 mr-1" />Report</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {!invites.length && <p className="text-sm text-muted-foreground">No invites yet.</p>}
              </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-3" style={{ borderColor: "#E6E8FA" }}>
            <h3 className="font-bold" style={{ color: NIGHT }}>Billing history</h3>
            {orders.map((o) => (
              <div key={o.id} className="flex justify-between text-sm border-b py-3 last:border-0">
                <div>
                  <p className="font-medium">{o.credits} credits · {fmt(o.amount_ugx)}</p>
                  <p className="text-xs text-muted-foreground">{o.id.slice(0, 8)}… · {new Date(o.created_at).toLocaleString()}</p>
                </div>
                <span className="capitalize text-xs font-semibold" style={{ color: o.status === "paid" ? GREEN : WARM }}>{o.status.replace("_", " ")}</span>
              </div>
            ))}
            {!orders.length && <p className="text-sm text-muted-foreground">No orders yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
