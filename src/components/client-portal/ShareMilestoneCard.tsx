import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";
import { toast } from "sonner";
import type { Milestone } from "./MilestoneTimeline";

interface Props {
  milestone: Milestone;
  clientFirstName: string;
  onClose: () => void;
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

const ShareMilestoneCard = ({ milestone, onClose }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const generate = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2, logging: false, useCORS: true });
    return await new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
  };

  const download = async () => {
    setBusy(true);
    const blob = await generate();
    setBusy(false);
    if (!blob) return toast.error("Couldn't generate image.");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `innerspark-milestone-${milestone.id}.png`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const share = async () => {
    setBusy(true);
    const blob = await generate();
    setBusy(false);
    if (!blob) return toast.error("Couldn't generate image.");
    const file = new File([blob], `innerspark-milestone.png`, { type: "image/png" });
    if ((navigator as any).canShare?.({ files: [file] })) {
      try { await (navigator as any).share({ files: [file], title: "My healing journey" }); } catch {}
    } else {
      download();
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-background">
        <div className="calm-theme">
          <DialogHeader className="p-4 border-b border-border flex-row items-center justify-between">
            <DialogTitle className="text-base">Share this milestone</DialogTitle>
            <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
          </DialogHeader>
          <div className="p-4">
            <div
              ref={cardRef}
              className="rounded-2xl overflow-hidden shadow-xl"
              style={{ background: "#FFFFFF", width: "100%", maxWidth: 420, margin: "0 auto" }}
            >
              <div style={{ background: "linear-gradient(135deg,#3B4FD4,#0F1035)", padding: "28px 24px", color: "#fff" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", opacity: 0.85, textTransform: "uppercase" }}>Milestone</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{fmt(milestone.date)}</div>
              </div>
              <div style={{ padding: "24px", color: "#1A1A2E" }}>
                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25 }}>{milestone.title}</div>
                <div style={{ fontSize: 14, color: "#555555", marginTop: 12, lineHeight: 1.55 }}>{milestone.detail}</div>
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: "#555555" }}>My healing journey with</div>
                  <div style={{ fontWeight: 700, color: "#3B4FD4" }}>InnerSpark Africa</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={share} disabled={busy} className="flex-1"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
              <Button onClick={download} variant="outline" disabled={busy}><Download className="h-4 w-4 mr-2" /> Save</Button>
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              Only the milestone text and date are shared. Nothing clinical.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMilestoneCard;