import jsPDF from "jspdf";

export interface ConsentPdfData {
  clientName: string;
  therapistName: string;
  professionalTitle?: string | null;
  sessionType?: string | null;
  sessionPriceUgx?: number | null;
  sessionMinutes?: number | null;
  consentSignedAt: string;
  generatedAt?: string | null;
  isMinor?: boolean;
  dateOfBirth?: string | null;
  age?: number | null;
  parentName?: string | null;
  parentRelationship?: string | null;
  parentContact?: string | null;
  parentEmail?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone?: string | null;
}

const LOGO_URL = "/innerspark-logo.webp";
let logoCache: string | null | undefined;

async function loadLogo(): Promise<string | null> {
  if (logoCache !== undefined) return logoCache;
  try {
    const res = await fetch(LOGO_URL);
    const blob = await res.blob();
    logoCache = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch {
    logoCache = null;
  }
  return logoCache;
}

const fmt = (iso?: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-UG", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Kampala",
      }).format(new Date(iso))
    : "—";

const money = (n?: number | null) =>
  typeof n === "number" ? `UGX ${Math.round(n).toLocaleString()}` : "As agreed";

const isChat = (sessionType?: string | null) => /chat/i.test(sessionType || "");

/** Builds archive PDF — adult counselling agreement or parent informed consent for minors. */
export async function buildConsentPdf(d: ConsentPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const maxW = pageW - margin * 2;
  let y = 16;
  const parentForm = !!d.isMinor;

  const ensureSpace = (need = 12) => {
    if (y + need > pageH - 18) {
      doc.addPage();
      y = 16;
    }
  };

  const heading = (text: string) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text(text, margin, y);
    y += 6;
  };

  const para = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);
    const lines = doc.splitTextToSize(text, maxW);
    ensureSpace(lines.length * 4.4 + 3);
    doc.text(lines, margin, y);
    y += lines.length * 4.4 + 3;
  };

  const bullet = (items: string[]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(`•  ${item}`, maxW - 2);
      ensureSpace(lines.length * 4.4 + 1.5);
      doc.text(lines, margin + 2, y);
      y += lines.length * 4.4 + 1.5;
    });
    y += 1.5;
  };

  const row = (label: string, value: string) => {
    ensureSpace(7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(label, margin, y);
    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "bold");
    const lines = doc.splitTextToSize(value || "—", maxW * 0.58);
    doc.text(lines, pageW - margin, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += Math.max(6, lines.length * 4.2);
  };

  doc.setFillColor(74, 144, 164);
  doc.rect(0, 0, pageW, 28, "F");
  const logo = await loadLogo();
  if (logo) {
    try {
      doc.addImage(logo, "PNG", margin, 6, 12, 12);
    } catch {
      /* ignore */
    }
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("InnerSpark Africa", logo ? margin + 16 : margin, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    parentForm
      ? "Parent Informed Consent for Psychological Services · 2026"
      : "Counselling Informed Consent and Service Agreement · 2026",
    logo ? margin + 16 : margin,
    19,
  );
  doc.setFontSize(8);
  doc.text("Archive copy for clinical records", logo ? margin + 16 : margin, 24);

  y = 36;

  const deliveryMode = isChat(d.sessionType) ? "chat" : "video";
  const minutes = d.sessionMinutes ?? (deliveryMode === "chat" ? 45 : 60);
  const price =
    typeof d.sessionPriceUgx === "number"
      ? d.sessionPriceUgx
      : deliveryMode === "chat"
        ? 30000
        : 75000;
  const service = d.sessionType || "Individual counselling — video session";
  const title = d.professionalTitle || "Licensed mental health professional";

  heading("Parties");
  row("Therapist / counsellor", d.therapistName);
  row("Professional title", title);
  row("Practice", "InnerSpark Africa");
  row("Contact", "WhatsApp +256 792 085 773 · info@innersparkafrica.com");
  row(parentForm ? "Minor (client)" : "Client", d.clientName);
  if (parentForm) {
    if (d.dateOfBirth) row("Date of birth", String(d.dateOfBirth));
    if (d.age != null) row("Age", String(d.age));
    row("Parent / guardian", d.parentName || "—");
    if (d.parentRelationship) row("Relationship", d.parentRelationship);
    if (d.parentContact) row("Parent contact", d.parentContact);
    if (d.parentEmail) row("Parent email", d.parentEmail);
    if (d.emergencyContactName) {
      row(
        "Emergency contact",
        `${d.emergencyContactName}${d.emergencyContactRelationship ? ` (${d.emergencyContactRelationship})` : ""}${d.emergencyContactPhone ? ` · ${d.emergencyContactPhone}` : ""}`,
      );
    }
  }
  row("Service", service);
  row("Session fee", money(price));
  row("Session length", `${minutes} minutes`);
  row("Agreement generated", fmt(d.generatedAt));
  row("Electronically signed", fmt(d.consentSignedAt));
  y += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  if (parentForm) {
    heading("1. Purpose and nature of services");
    para(
      "Psychological services are provided to support the child's emotional, behavioural, psychological, social, academic, and/or family concerns. Services may include clinical interviewing, assessment, counselling/psychotherapy, psychoeducation, coping-skills development, parent consultation, and/or appropriate collaboration with other professionals. Treatment usually involves progress over time and results may vary.",
    );
    heading("2. Session length");
    para(
      `Each session will normally last approximately ${minutes} minutes (one hour). Late arrival may reduce available time. The full fee may remain payable.`,
    );
    heading("3. Voluntary participation");
    para(
      "Participation is voluntary, subject to applicable law and professional requirements. The parent/guardian may ask questions or discuss concerns about treatment at any time and may request discontinuation of services, subject to applicable legal, ethical, safeguarding, or clinical requirements.",
    );
    heading("4. Confidentiality and privacy");
    para(
      "Information shared during sessions will generally remain confidential and will be handled according to applicable law and professional standards. Confidentiality may be limited when disclosure is required or permitted by law, including serious safety concerns, suspected abuse or neglect, legal requirements, or other safeguarding circumstances.",
    );
    para(
      "Because the client is a minor, the clinician will balance parental rights with the child's developing privacy and autonomy. The clinician may provide general information about treatment progress, recommendations, and significant safety concerns without unnecessarily disclosing private session details. Specific arrangements regarding confidentiality and parental communication will be discussed with the parent and adolescent where appropriate.",
    );
    heading("5. Risks, benefits and safety");
    para(
      "Psychological services may help improve coping, emotional awareness, communication, relationships, and well-being. Discussing difficult experiences may temporarily cause distress or discomfort. If there is an immediate risk of serious harm to the child or another person, appropriate emergency, medical, safeguarding, or other professional services may be contacted as required or permitted by law.",
    );
    para(
      `Emergency / crisis support coordination: WhatsApp +256 792 085 773. This is not a substitute for local emergency services.${d.emergencyContactName ? ` Named emergency contact on file: ${d.emergencyContactName}.` : ""}`,
    );
    heading("6. Records and information sharing");
    para(
      "Appropriate clinical records will be maintained and securely handled according to applicable law and professional standards, including the Uganda Data Protection and Privacy Act 2019 where it applies. Information may be shared with another professional, school, healthcare provider, or organisation only with appropriate authorisation or when otherwise permitted/required by law.",
    );
    heading("7. Fees");
    bullet([
      `Session fee for this service (${service}): ${money(price)}, payable as arranged (including insurer cover where applicable).`,
      `Session length: approximately ${minutes} minutes.`,
      "Please give at least 24 hours' notice to cancel or reschedule. Late cancellations or missed sessions may be charged in full unless InnerSpark Africa agrees otherwise in writing.",
    ]);
    heading("8. Consent");
    para("By confirming electronically, the parent/guardian confirmed that:");
    bullet([
      "They had the opportunity to ask questions and understand the purpose and nature of the proposed psychological services, confidentiality and its limits, potential benefits and risks, and applicable communication arrangements",
      `They are the parent/legal guardian of ${d.clientName}`,
      `They consent to psychological services being provided to their child by ${d.therapistName} through InnerSpark Africa, subject to applicable law and professional standards`,
      "Consent may be withdrawn at any time, subject to applicable legal and clinical requirements",
    ]);

    ensureSpace(36);
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
    y += 8;
    heading("Electronic signature record");
    para(
      `Parent/guardian: ${d.parentName || "—"}. On behalf of minor: ${d.clientName}. Electronic confirmation recorded on ${fmt(d.consentSignedAt)} (Africa/Kampala). This PDF is an archive copy of the parent informed consent presented on the InnerSpark Africa consent link at the time of signing.`,
    );
    para("Clinician: " + d.therapistName + (title ? ` · ${title}` : ""));
    para("Practice: InnerSpark Africa · www.innersparkafrica.com · info@innersparkafrica.com");

    const totalP = doc.getNumberOfPages();
    for (let i = 1; i <= totalP; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`InnerSpark Africa · Parent consent archive · Page ${i} of ${totalP}`, pageW / 2, pageH - 8, {
        align: "center",
      });
    }

    const safeNameP =
      (d.parentName || d.clientName).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "parent";
    const dateStampP = (d.consentSignedAt || new Date().toISOString()).slice(0, 10);
    return { doc, filename: `innerspark-parent-consent-${safeNameP}-${dateStampP}.pdf` };
  }

  heading("1. Purpose of counselling");
  para(
    "Counselling is a confidential and collaborative process to explore concerns, improve emotional wellbeing, develop coping strategies, and work toward personally meaningful goals. Counselling does not guarantee a particular result and is not a substitute for emergency or specialist medical care when such care is required.",
  );

  heading("2. Session length and expected number of sessions");
  para(
    `Each counselling session will normally last approximately ${minutes} minutes. This includes time for discussion, assessment, interventions, and planning. Late arrival may reduce the available session time, and the full fee may remain payable.`,
  );
  para(
    "The initial counselling plan is typically for a small block of sessions (often about 4–6), scheduled weekly or fortnightly as agreed. This is an estimate rather than a fixed commitment. The actual number of sessions may change depending on needs, progress, goals, availability, and clinical recommendations.",
  );
  para("Progress and goals will be reviewed after the first few sessions and periodically thereafter. Following review, the parties may agree to:");
  bullet([
    "Continue for additional sessions",
    "Change the frequency or focus of counselling",
    "Conclude counselling and develop a follow-up plan",
    "Arrange referral or additional support where appropriate",
  ]);
  para("The client may request a review or end counselling at any time. Any extension will be discussed and agreed before additional sessions begin.");

  heading("3. Voluntary participation");
  para(
    "Participation is voluntary. The client may ask questions, decline to answer questions, discuss concerns about therapy, request a referral, or end counselling at any time. The client is encouraged to attend punctually, participate as comfortable, practise agreed strategies, and communicate relevant concerns or changes.",
  );

  heading("4. Confidentiality");
  para(
    "Information shared during counselling will remain confidential except where disclosure is required or permitted by law or professional ethical standards, including:",
  );
  bullet([
    "A serious and foreseeable risk of harm to the client or another person",
    "Abuse, neglect, exploitation, or safeguarding concerns where mandatory reporting applies",
    "A court order or other legal obligation",
    "An emergency requiring information to be shared to protect safety",
    "Limited professional consultation or supervision where legally and ethically permitted",
  ]);
  para(
    "Where possible, the therapist will discuss the limits of confidentiality with the client before disclosure and will share only information reasonably necessary for the relevant purpose.",
  );

  heading("5. Records and privacy");
  para(
    "The therapist may keep clinical and administrative records as required by law, professional standards, or insurance requirements. Records are handled with reasonable privacy and security measures and retained for the period required by applicable law, including the Uganda Data Protection and Privacy Act 2019 where it applies. The client may request access to or correction of their information, subject to lawful limitations, by emailing info@innersparkafrica.com.",
  );
  para(
    "Electronic communications may not be completely secure and are not monitored continuously. The client should avoid sending highly sensitive information by ordinary email or text message.",
  );

  heading("6. Therapist responsibilities");
  para(
    "The therapist will provide respectful, ethical, professional, and culturally responsive care; maintain appropriate boundaries; protect privacy; collaborate on goals; use evidence-informed interventions; review progress; and recommend referral or additional support when appropriate.",
  );

  heading("7. Appointments, fees, and cancellation");
  bullet([
    `The session fee for this service (${service}) is ${money(price)}, payable via MTN or Airtel Mobile Money, or card where available, before or as arranged for the session.`,
    "Please give at least 24 hours' notice to cancel or reschedule.",
    "Sessions cancelled with less than 24 hours' notice, or missed without notice, may be charged in full unless InnerSpark Africa agrees otherwise in writing.",
    "Any changes to fees or policies will be communicated in advance where reasonably practicable.",
  ]);

  heading("8. Online counselling");
  para("For video, voice, or chat sessions, the client agrees to:");
  bullet([
    "Attend from a private location",
    "Use a secure connection where possible",
    "Inform the therapist if anyone else is present",
    "Not record the session without prior agreement",
  ]);
  para("Technical disruptions may occur.");
  para(
    "Reconnection procedure: if the call drops, stay available on the same device and wait for the therapist to reconnect, or message InnerSpark on WhatsApp +256 792 085 773. If connection cannot be restored within a reasonable time, the session may be rescheduled.",
  );
  para(
    "At the start of each online session, the therapist may ask the client to confirm their current location for safety and continuity of care.",
  );

  heading("9. Risks, benefits, and emergencies");
  para(
    "Potential benefits may include improved emotional understanding, coping skills, self-awareness, problem-solving, relationships, and resilience. Possible risks include temporary emotional discomfort when discussing difficult experiences or making changes.",
  );
  para("Counselling is not an emergency service. If the client is in immediate danger or at risk of serious harm:");
  bullet([
    "Contact local emergency services or attend the nearest emergency department",
    "Contact an appropriate crisis service available in the area",
    "Message InnerSpark Africa on WhatsApp +256 792 085 773 (support and coordination; not a substitute for emergency services)",
  ]);

  heading("10. Boundaries, concerns, and ending therapy");
  para(
    "The therapeutic relationship is professional. The therapist will maintain appropriate boundaries. Contact outside sessions should generally be limited to appointments, administration, or safety matters. The client is encouraged to raise concerns directly with the therapist.",
  );
  para(
    "The therapist may end or pause counselling where it is clinically inappropriate, safety requires it, boundaries cannot be maintained, or another lawful and ethical reason applies. Appropriate referral will be considered where possible.",
  );

  heading("11. Consent and agreement");
  para("By confirming electronically, the client confirmed that:");
  bullet([
    "The counselling process, session length, estimated number of sessions, review process, fees, risks, benefits, alternatives, and confidentiality limits were explained in this agreement",
    "Questions could be asked of the therapist before continuing",
    "Participation is voluntary",
    "Counselling is not an emergency service",
    `The client agreed to this Agreement and consented to begin counselling with ${d.therapistName}`,
    "Consent may be withdrawn at any time",
  ]);

  ensureSpace(36);
  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  heading("Electronic signature record");
  para(
    `Client: ${d.clientName}. Electronic confirmation recorded on ${fmt(d.consentSignedAt)} (Africa/Kampala). This PDF is an archive copy of the agreement presented on the InnerSpark Africa consent link at the time of signing.`,
  );
  para("Therapist / counsellor: " + d.therapistName);
  para("Practice: InnerSpark Africa · www.innersparkafrica.com · info@innersparkafrica.com");

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`InnerSpark Africa · Consent archive · Page ${i} of ${total}`, pageW / 2, pageH - 8, {
      align: "center",
    });
  }

  const safeName = d.clientName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "client";
  const dateStamp = (d.consentSignedAt || new Date().toISOString()).slice(0, 10);
  return { doc, filename: `innerspark-consent-${safeName}-${dateStamp}.pdf` };
}

export async function downloadConsentPdf(d: ConsentPdfData) {
  const { doc, filename } = await buildConsentPdf(d);
  doc.save(filename);
  return filename;
}
