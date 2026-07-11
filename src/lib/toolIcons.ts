import {
  BookOpen,
  Brain,
  CheckSquare,
  ClipboardList,
  HeartPulse,
  Leaf,
  LifeBuoy,
  NotebookPen,
  Smile,
  Sparkles,
  Sun,
  Target,
  Waves,
  type LucideIcon,
} from "lucide-react";

export const TOOL_ICONS: Record<string, LucideIcon> = {
  "session-reflection": NotebookPen,
  "thought-record": Brain,
  "homework": CheckSquare,
  "emotion-diary": HeartPulse,
  "activity-schedule": ClipboardList,
  "event-scoring": Target,
  "goals": Target,
  "relaxation": Waves,
  "screening-phq9": BookOpen,
  "screening-gad7": BookOpen,
  "gratitude": Leaf,
  "self-care": Sun,
  "safety-checkin": LifeBuoy,
};

export const iconForTool = (key: string): LucideIcon => TOOL_ICONS[key] || Sparkles;

export { Smile };