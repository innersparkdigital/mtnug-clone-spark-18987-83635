import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";
import { FunctionsHttpError } from "@supabase/supabase-js";

async function readInvokeError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const text = await error.context.text();
      try {
        const j = JSON.parse(text);
        return j.error || j.message || text || error.message;
      } catch {
        return text || error.message;
      }
    } catch {
      return error.message;
    }
  }
  return (error as any)?.message || "Request failed";
}

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
type Overview = {
  startDate: string;
  endDate: string;
  siteUrl: string;
  queries: Row[];
  pages: Row[];
  totals: Row | null;
};

const DEFAULT_SITE = "https://www.innersparkafrica.com/";

function fmtPct(n: number) { return `${(n * 100).toFixed(1)}%`; }
function fmtPos(n: number) { return n.toFixed(1); }

export default function SearchConsoleTab() {
  const today = new Date();
  const defaultEnd = new Date(today.getTime() - 2 * 86400000).toISOString().slice(0, 10);
  const defaultStart = new Date(today.getTime() - 30 * 86400000).toISOString().slice(0, 10);

  const [siteUrl, setSiteUrl] = useState(DEFAULT_SITE);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [inspecting, setInspecting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data: res, error } = await supabase.functions.invoke("gsc-data", {
        body: { action: "overview", siteUrl, startDate, endDate, rowLimit: 25 },
      });
      if (error) {
        const msg = await readInvokeError(error);
        throw new Error(msg);
      }
      if ((res as any)?.error) throw new Error((res as any).error);
      setData(res as Overview);
    } catch (e: any) {
      setErr(e?.message || "Failed to load Search Console data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const requestIndexing = async (url: string) => {
    setInspecting(url);
    try {
      const { data: res, error } = await supabase.functions.invoke("gsc-data", {
        body: { action: "inspect", url, siteUrl },
      });
      if (error) {
        const msg = await readInvokeError(error);
        throw new Error(msg);
      }
      const status = (res as any)?.inspectionResult?.indexStatusResult?.verdict || "Inspection complete";
      const coverage = (res as any)?.inspectionResult?.indexStatusResult?.coverageState || "";
      toast.success(`${status}${coverage ? ` — ${coverage}` : ""}`);
    } catch (e: any) {
      toast.error(e?.message || "Inspection failed");
    } finally {
      setInspecting(null);
    }
  };

  const totals = data?.totals;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Google Search Console</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div className="md:col-span-2">
              <Label>Site URL</Label>
              <Input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://www.innersparkafrica.com/" />
            </div>
            <div>
              <Label>Start date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>End date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
          {err && (
            <p className="text-sm text-destructive mt-3">
              {err}. If the connector isn't linked yet, connect Google Search Console in Lovable Cloud settings.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Totals */}
      {totals && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Clicks</p><p className="text-2xl font-bold">{totals.clicks.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Impressions</p><p className="text-2xl font-bold">{totals.impressions.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">CTR</p><p className="text-2xl font-bold">{fmtPct(totals.ctr)}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Avg position</p><p className="text-2xl font-bold">{fmtPos(totals.position)}</p></CardContent></Card>
        </div>
      )}

      {/* Top Queries */}
      <Card>
        <CardHeader><CardTitle>Top 25 queries</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Pos.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.queries || []).map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{r.keys?.[0]}</TableCell>
                    <TableCell className="text-right">{r.clicks}</TableCell>
                    <TableCell className="text-right">{r.impressions}</TableCell>
                    <TableCell className="text-right">{fmtPct(r.ctr)}</TableCell>
                    <TableCell className="text-right">{fmtPos(r.position)}</TableCell>
                  </TableRow>
                ))}
                {!loading && (!data?.queries || data.queries.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">No data yet for this range.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card>
        <CardHeader><CardTitle>Top 25 pages</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Pos.</TableHead>
                  <TableHead className="text-right">Indexing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.pages || []).map((r, i) => {
                  const url = r.keys?.[0] || "";
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="max-w-md">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 break-all">
                          {url.replace(siteUrl, "/") || url}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell className="text-right">{r.clicks}</TableCell>
                      <TableCell className="text-right">{r.impressions}</TableCell>
                      <TableCell className="text-right">{fmtPct(r.ctr)}</TableCell>
                      <TableCell className="text-right">{fmtPos(r.position)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" disabled={inspecting === url} onClick={() => requestIndexing(url)}>
                          {inspecting === url ? <Loader2 className="h-3 w-3 animate-spin" /> : "Inspect"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!loading && (!data?.pages || data.pages.length === 0) && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">No data yet for this range.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            "Inspect" checks the current indexing status. To submit a URL for re-crawl, open Search Console → URL Inspection → Request Indexing (Google requires a manual click for this action).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}