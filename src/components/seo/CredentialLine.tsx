import { BadgeCheck, AlertCircle } from "lucide-react";

/**
 * Surfaces a therapist's genuine registration / professional-body credential.
 * Nothing is invented: it only reads what is stored on the specialist record.
 * When no registration or qualification is on file, we say so plainly instead
 * of implying credentials that we cannot evidence.
 */
const REGISTRATION_RE =
  /(licens|registered|registration|board|association|member|council|society|chartered)/i;

interface Props {
  type?: string | null;
  education?: string | null;
  certifications?: string[] | null;
  experienceYears?: number | null;
  className?: string;
}

export const buildCredentialText = ({
  type,
  education,
  certifications,
  experienceYears,
}: Props): { text: string; verified: boolean } => {
  const certs = (certifications || []).flatMap((c) =>
    String(c)
      .split(/\n|;/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const registration = certs.find((c) => REGISTRATION_RE.test(c));
  const topQualification = (education || "")
    .split(/;|\n/)
    .map((s) => s.trim())
    .filter(Boolean)[0];

  const parts: string[] = [];
  if (type) parts.push(type.charAt(0).toUpperCase() + type.slice(1));
  if (topQualification) parts.push(topQualification);
  if (registration) parts.push(registration);
  if (experienceYears) parts.push(`${experienceYears} years of practice`);

  if (!topQualification && !registration) {
    return {
      text: "Registration details are being verified by our clinical team — qualification records not yet published.",
      verified: false,
    };
  }
  return { text: parts.join(" · "), verified: Boolean(registration) };
};

/** Visible credential / registration line for a specialist profile. */
export default function CredentialLine(props: Props) {
  const { text, verified } = buildCredentialText(props);
  const Icon = verified ? BadgeCheck : AlertCircle;
  return (
    <p
      className={`flex items-start gap-2 text-sm text-muted-foreground ${props.className || ""}`}
    >
      <Icon
        className={`w-4 h-4 mt-0.5 shrink-0 ${verified ? "text-primary" : "text-amber-500"}`}
        aria-hidden="true"
      />
      <span>
        <span className="font-medium text-foreground">Credentials: </span>
        {text}
      </span>
    </p>
  );
}
