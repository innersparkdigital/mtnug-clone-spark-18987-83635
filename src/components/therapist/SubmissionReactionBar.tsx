import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const EMOJIS = ["💙", "⭐", "💪", "🌟", "🙏"];

interface Props {
  submissionId: string;
}

const SubmissionReactionBar = ({ submissionId }: Props) => {
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const react = async (emoji: string) => {
    setPicked(emoji);
  };

  const send = async () => {
    if (!picked) return toast.error("Pick an emoji first.");
    setSaving(true);
    const { error } = await supabase.rpc("add_submission_reaction", {
      _submission_id: submissionId,
      _emoji: picked,
      _note: note.slice(0, 100),
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setSaved(true);
    toast.success("Reaction sent to your client. 💙");
  };

  if (saved) {
    return (
      <div className="text-xs text-primary/80 mt-2">
        You reacted {picked} {note ? `— "${note}"` : ""}
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">React:</span>
        {EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => react(e)}
            className={`h-8 w-8 rounded-full grid place-items-center text-base border transition ${
              picked === e ? "bg-primary/10 border-primary" : "border-border hover:bg-accent"
            }`}
            aria-label={`React ${e}`}
          >
            {e}
          </button>
        ))}
      </div>
      {picked && (
        <div className="flex gap-2">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 100))}
            placeholder="Add a short note (optional, 100 chars)"
            className="text-xs h-8"
          />
          <button
            onClick={send}
            disabled={saving}
            className="text-xs px-3 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionReactionBar;