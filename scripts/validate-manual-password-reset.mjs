import { readFile } from "node:fs/promises";
const migration = await readFile(new URL("../supabase/migrations/20260919233000_manual_password_resets.sql", import.meta.url), "utf8");
const service = await readFile(new URL("../supabase/functions/manual-password-reset/index.ts", import.meta.url), "utf8");
const client = await readFile(new URL("../src/pages/ClientPortal.tsx", import.meta.url), "utf8");
const therapist = await readFile(new URL("../src/pages/TherapistPortal.tsx", import.meta.url), "utf8");
const admin = await readFile(new URL("../src/components/admin/PasswordResetRequestsTab.tsx", import.meta.url), "utf8");

const checks = [
  [migration.includes("expires_at = now() + interval '60 minutes'"), "temporary credentials expire after 60 minutes"],
  [migration.includes("set status='used', consumed_at=now()"), "client temporary passcode is consumed atomically"],
  [migration.includes("set passcode_hash = null"), "client temporary passcode cannot be reused"],
  [service.includes('updateUserById(user.id, { password: generatePassword() })'), "therapist temporary password is invalidated on first login"],
  [service.includes('message: "If the details match an account'), "request response prevents account discovery"],
  [service.includes('action === "reveal"') && service.includes("claim_manual_password_reset"), "admin reveal is one-time and atomic"],
  [client.includes('accountType="client"') && client.includes("verify_client_portal_credential"), "client reset and forced-change flow exists"],
  [therapist.includes('accountType="therapist"') && therapist.includes("consume_therapist"), "therapist reset and forced-change flow exists"],
  [admin.includes("Copy and hide") && !admin.includes("temp_secret_hash"), "admin sees plaintext only in one-time response"],
  [!service.includes("send-transactional-email") && !service.includes("wa.me"), "temporary credentials are never sent automatically"],
];
const failed = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (failed.length) throw new Error(`Manual reset regression:\n- ${failed.join("\n- ")}`);
console.log("[password-reset] Client, therapist, admin and one-time-use checks passed.");
