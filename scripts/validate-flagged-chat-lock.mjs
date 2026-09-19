import { readFile } from "node:fs/promises";

const server = await readFile(new URL("../supabase/functions/ai-chat/index.ts", import.meta.url), "utf8");
const client = await readFile(new URL("../src/components/AIChatWidget.tsx", import.meta.url), "utf8");
const queue = await readFile(new URL("../src/components/admin/CrisisReviewQueueTab.tsx", import.meta.url), "utf8");

const lockAt = server.indexOf("if (sessionWasFlagged)");
const directoryAt = server.indexOf("INNERSPARK THERAPIST DIRECTORY");
const modelAt = server.indexOf("const baseMessages");

const checks = [
  [lockAt >= 0, "server has a persistent flagged-session lock"],
  [lockAt < directoryAt, "flagged sessions return before therapist matching"],
  [lockAt < modelAt, "flagged sessions return before the AI model"],
  [server.includes('human_handoff: true'), "handoff status is returned to the browser"],
  [server.includes('event_type: "flagged_handoff_repeated"'), "continued flagged messages are visible to staff"],
  [client.includes("showChips && !highRisk"), "therapist and booking chips are hidden after a flag"],
  [client.includes("activeForm && !highRisk"), "specific booking forms are disabled after a flag"],
  [client.includes("sessionStorage.setItem(FLAGGED_KEY"), "the browser preserves the flag for the session"],
  [queue.includes('label: "Awaiting staff"'), "staff see an awaiting-handoff status"],
];

const failed = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (failed.length) {
  throw new Error(`Flagged-session regression:\n- ${failed.join("\n- ")}`);
}

console.log("[amani-safety] Persistent crisis handoff lock passed all checks.");
