import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { getScale } from "@/lib/screeningScales";
import { getTool } from "@/lib/wellbeingToolsCatalog";

/** Lets a therapist see exactly what the client will be asked before assigning. */
const ToolPreviewDialog = ({ toolKey }: { toolKey: string }) => {
  const scale = getScale(toolKey);
  const tool = getTool(toolKey);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="gap-1 text-xs shrink-0">
          <Eye className="h-3.5 w-3.5" /> Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{scale?.name || tool?.name || toolKey}</DialogTitle>
          <DialogDescription>
            {scale?.instructions || tool?.description || "This is what your client will see."}
          </DialogDescription>
        </DialogHeader>

        {scale ? (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-muted">{scale.items.length} questions</span>
              <span className="px-2 py-0.5 rounded bg-muted">{scale.timeframe}</span>
              <span className="px-2 py-0.5 rounded bg-muted">Max score {scale.maxScore}{scale.percentage ? "%" : ""}</span>
            </div>

            <div className="rounded-lg border divide-y">
              {scale.items.map((item, i) => {
                const opts = item.options ?? scale.options;
                return (
                  <div key={i} className="p-3">
                    <div className="font-medium">{i + 1}. {item.text}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {opts.map((o) => (
                        <span key={o.value} className="text-[11px] px-2 py-0.5 rounded border bg-background">
                          {o.label} <span className="text-muted-foreground">({o.value})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {scale.followUp && (
              <div className="rounded-lg border p-3 bg-muted/40">
                <div className="font-medium">Functional impairment question</div>
                <div className="mt-1">{scale.followUp.text}</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {scale.followUp.options.map((o) => (
                    <span key={o.value} className="text-[11px] px-2 py-0.5 rounded border bg-background">{o.label}</span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Recorded for context — not added to the total score.</p>
              </div>
            )}

            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
              <div className="font-medium mb-1">Scoring and interpretation</div>
              <p className="text-muted-foreground">{scale.interpretation}</p>
              <p className="text-muted-foreground mt-1">Best for: {scale.bestFor}</p>
              {scale.safetyItemIndex !== undefined && (
                <p className="text-destructive text-xs mt-2">
                  Item {scale.safetyItemIndex + 1} raises an immediate safety alert to you if answered above "Not at all".
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">{tool?.description}</p>
            {tool?.bestFor && <p className="text-muted-foreground italic">Best for: {tool.bestFor}</p>}
            <p className="text-xs text-muted-foreground">
              This tool uses a guided worksheet rather than a fixed question list, so the client writes in their own words.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ToolPreviewDialog;
