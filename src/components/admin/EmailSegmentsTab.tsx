import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, Search, Users, Stethoscope, Building2, GraduationCap, UserCheck, ChevronLeft, ChevronRight, Copy } from "lucide-react";

type EmailEntry = {
  email: string;
  name: string;
  segment: string;
  source: string;
  date: string;
};

const SEGMENTS = [
  { value: "all", label: "All Segments", icon: Users },
  { value: "doctors", label: "Doctors", icon: Stethoscope },
  { value: "patients", label: "Patients / Users", icon: UserCheck },
  { value: "corporate", label: "Corporate Clients", icon: Building2 },
  { value: "training", label: "Training Participants", icon: GraduationCap },
] as const;

const segmentColor = (s: string) => {
  switch (s) {
    case "doctors": return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
    case "patients": return "bg-green-500/10 text-green-700 dark:text-green-300";
    case "corporate": return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
    case "training": return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
    default: return "bg-muted text-muted-foreground";
  }
};

const EmailSegmentsTab = () => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchAllEmails = useCallback(async () => {
    setLoading(true);
    const results: EmailEntry[] = [];

    // Doctors
    const { data: doctors } = await supabase.from("doctors").select("email, full_name, created_at");
    (doctors || []).forEach((d: any) => {
      if (d.email) results.push({ email: d.email, name: d.full_name || "", segment: "doctors", source: "Doctor Onboarding", date: d.created_at });
    });

    // Patients - from contact submissions, assessment emails, referral patients
    const { data: contacts } = await supabase.from("contact_submissions").select("email, name, created_at");
    (contacts || []).forEach((c: any) => {
      if (c.email) results.push({ email: c.email, name: c.name || "", segment: "patients", source: "Contact Form", date: c.created_at });
    });

    const { data: assessments } = await supabase.from("assessment_emails").select("email, created_at");
    (assessments || []).forEach((a: any) => {
      if (a.email) results.push({ email: a.email, name: "", segment: "patients", source: "Assessment", date: a.created_at });
    });

    // Corporate
    const { data: corpBookings } = await supabase.from("corporate_screening_bookings").select("contact_email, contact_name, company_name, created_at");
    (corpBookings || []).forEach((c: any) => {
      if (c.contact_email) results.push({ email: c.contact_email, name: `${c.contact_name} (${c.company_name})`, segment: "corporate", source: "Screening Booking", date: c.created_at });
    });

    const { data: corpCompanies } = await supabase.from("corporate_companies").select("contact_email, contact_person, name, created_at");
    (corpCompanies || []).forEach((c: any) => {
      if (c.contact_email) results.push({ email: c.contact_email, name: `${c.contact_person || ""} (${c.name})`, segment: "corporate", source: "Corporate Company", date: c.created_at });
    });

    // Training
    const { data: training } = await supabase.from("training_registrations").select("email, full_name, created_at");
    (training || []).forEach((t: any) => {
      if (t.email) results.push({ email: t.email, name: t.full_name || "", segment: "training", source: "Training Registration", date: t.created_at });
    });

    // Deduplicate by email within each segment (keep latest)
    const deduped = new Map<string, EmailEntry>();
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    results.forEach(e => {
      const key = `${e.email.toLowerCase()}-${e.segment}`;
      if (!deduped.has(key)) deduped.set(key, e);
    });

    setEmails(Array.from(deduped.values()));
    setLoading(false);
  }, []);

  useEffect(() => { fetchAllEmails(); }, [fetchAllEmails]);

  const filtered = useMemo(() => {
    return emails.filter(e => {
      if (segmentFilter !== "all" && e.segment !== segmentFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.email.toLowerCase().includes(q) || e.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [emails, segmentFilter, search]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => { setPage(1); }, [segmentFilter, search]);

  const segmentCounts = useMemo(() => {
    const counts: Record<string, number> = { doctors: 0, patients: 0, corporate: 0, training: 0 };
    // Count unique emails per segment
    const seen: Record<string, Set<string>> = { doctors: new Set(), patients: new Set(), corporate: new Set(), training: new Set() };
    emails.forEach(e => { seen[e.segment]?.add(e.email.toLowerCase()); });
    Object.keys(counts).forEach(k => { counts[k] = seen[k]?.size || 0; });
    return counts;
  }, [emails]);

  const exportCSV = () => {
    const data = filtered;
    const headers = ["Email", "Name", "Segment", "Source", "Date"];
    const rows = data.map(e => [e.email, e.name, e.segment, e.source, new Date(e.date).toLocaleDateString("en-GB")]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-segments-${segmentFilter}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyEmails = () => {
    const emailList = filtered.map(e => e.email).join(", ");
    navigator.clipboard.writeText(emailList);
    toast({ title: `${filtered.length} emails copied to clipboard` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Segment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SEGMENTS.filter(s => s.value !== "all").map(seg => {
          const Icon = seg.icon;
          return (
            <Card key={seg.value} className={`cursor-pointer transition-all ${segmentFilter === seg.value ? "ring-2 ring-primary" : ""}`} onClick={() => setSegmentFilter(seg.value)}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Icon className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">{seg.label}</p>
                    <p className="text-2xl font-bold">{segmentCounts[seg.value] || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Email List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Email Segments</CardTitle>
              <CardDescription>Categorized emails for targeted marketing campaigns</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyEmails} className="gap-2"><Copy className="h-4 w-4" /> Copy Emails</Button>
              <Button variant="outline" onClick={exportCSV} className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search email or name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Segment" /></SelectTrigger>
              <SelectContent>
                {SEGMENTS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No emails found for this segment</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map((e, i) => (
                      <TableRow key={`${e.email}-${e.segment}-${i}`}>
                        <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                        <TableCell className="font-medium">{e.email}</TableCell>
                        <TableCell>{e.name || "—"}</TableCell>
                        <TableCell><Badge className={segmentColor(e.segment)}>{e.segment}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{e.source}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString("en-GB")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} unique emails</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSegmentsTab;