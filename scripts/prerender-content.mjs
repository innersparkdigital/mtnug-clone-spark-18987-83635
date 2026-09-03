/**
 * Content used by scripts/prerender.mjs to write real, crawlable HTML into the
 * initial server response of the highest-traffic routes.
 *
 * This mirrors what each React page renders — it is NOT new marketing copy and
 * must stay truthful to the live page. React replaces this markup on mount, so
 * visitors keep the exact same UI and interactivity.
 */

export const SITE = "https://www.innersparkafrica.com";

/** Shared footer-style internal links so every prerendered page has real links. */
export const GLOBAL_LINKS = [
  ["/", "Home"],
  ["/online-therapy", "Online therapy"],
  ["/specialists", "Our therapists"],
  ["/services", "Services"],
  ["/book-therapist", "Book a session"],
  ["/wellbeing-check", "Free WHO-5 wellbeing check"],
  ["/mind-check", "Mental health self-assessments"],
  ["/blog", "Mental health blog"],
  ["/about", "About InnerSpark Africa"],
  ["/contact", "Contact us"],
];

export const ROUTES = [
  {
    path: "/",
    title: "Mental Health Therapy Uganda from UGX 30,000 | InnerSpark",
    description:
      "Talk to a licensed Ugandan therapist by video, voice or chat from UGX 30,000. Private mental health and wellness support across Africa, bookable in 2 minutes.",
    h1: "Africa's Most Accessible Mental Wellness Platform",
    intro:
      "Connect with licensed African therapists via video, voice or chat. Sessions start from UGX 30,000 (about $8) and are available in Uganda, Kenya, Tanzania and beyond — confidential, judgement-free and bookable in about two minutes.",
    sections: [
      {
        h2: "How online therapy with InnerSpark works",
        p: "Take a short mental health check so we understand what you are dealing with, get matched with a licensed therapist who specialises in that area, choose a time that fits your day, then meet by video, voice or chat. Payment is by MTN Mobile Money, Airtel Money or card.",
      },
      {
        h2: "What our therapists help with",
        p: "Depression, anxiety and panic, trauma and PTSD, grief and loss, stress and workplace burnout, relationship and marriage difficulties, teenage and student mental health, addiction, and self-esteem. Every therapist is licensed and clinically supervised.",
      },
      {
        h2: "Mental health support built for Africa",
        p: "Sessions run on low bandwidth, therapists understand the local context and languages, evening and weekend slots are available, and pricing is set for African incomes. Corporate and school wellbeing programmes are available for organisations.",
      },
      {
        h2: "Free tools before you book",
        p: "Use the free WHO-5 wellbeing check for a one-minute snapshot of how you are doing, or the Mind Check self-assessments for depression, anxiety, PTSD, burnout and more. You can also share anonymously through Whisper if you are not ready to talk to a person yet.",
      },
    ],
  },
  {
    path: "/specialists",
    title: "Licensed Mental Health Therapists in Uganda | InnerSpark",
    description:
      "Browse licensed Ugandan mental health therapists for anxiety, depression, trauma and relationships. Video, voice or chat from UGX 30,000. Book in 2 minutes.",
    h1: "Find Your Mental Health Professional",
    intro:
      "Every InnerSpark specialist is a licensed mental health professional. Browse their specialities, experience, languages and availability, then book a private session by video, voice or chat.",
    sections: [
      {
        h2: "Choose by speciality",
        p: "Our specialists cover depression, anxiety and panic disorders, trauma and PTSD, grief, addiction, relationship and marriage counselling, family therapy, child and adolescent mental health, workplace burnout and executive stress.",
      },
      {
        h2: "Verified, licensed and supervised",
        p: "Each therapist is verified against their professional registration before joining the platform, works under clinical supervision, and follows strict confidentiality standards. You can review a therapist's profile before you commit to a session.",
      },
      {
        h2: "Book a session that fits your week",
        p: "Sessions are available on weekdays, evenings and weekends across Uganda, Kenya, Tanzania and the diaspora. Individual sessions start from UGX 30,000 for chat therapy and UGX 75,000 for a full video session.",
      },
    ],
  },
  {
    path: "/services",
    title: "Mental Health & Therapy Services Across Africa | InnerSpark",
    description:
      "Individual, couples, teen and group therapy plus corporate mental wellness programmes. Licensed African therapists by video, voice or chat from UGX 30,000.",
    h1: "Mental Health Services for Individuals, Families and Organisations",
    intro:
      "InnerSpark Africa offers structured therapy and wellbeing services delivered online by licensed African mental health professionals — for individuals, couples, teenagers, support groups and workplaces.",
    sections: [
      {
        h2: "Individual therapy",
        p: "One-to-one sessions for depression, anxiety, trauma, stress, grief and self-esteem. Meet by video, voice or chat with a therapist matched to your concern. From UGX 30,000 for chat and UGX 75,000 for a video session.",
      },
      {
        h2: "Couples and marriage counselling",
        p: "Guided sessions for communication breakdown, conflict, trust and intimacy, parenting disagreements and pre-marital preparation, with therapists trained in relationship work.",
      },
      {
        h2: "Teen and student support",
        p: "Age-appropriate therapy for teenagers and university students dealing with academic pressure, bullying, identity, anxiety and family conflict, with parental consent handled sensitively.",
      },
      {
        h2: "Group therapy and support groups",
        p: "Facilitated small groups for shared experiences such as anxiety, grief and workplace stress, at a lower cost per session than individual therapy.",
      },
      {
        h2: "Corporate and school wellbeing",
        p: "Employee wellbeing screening, staff counselling sessions, mental health training and anonymous organisational reporting for companies, NGOs and schools across East Africa.",
      },
    ],
  },
  {
    path: "/online-therapy",
    title: "Online Therapy in Uganda — Video, Voice & Chat | InnerSpark",
    description:
      "Private online therapy with licensed Ugandan therapists. Video, voice or chat sessions from UGX 30,000, paid by MTN or Airtel Money. Book in 2 minutes.",
    h1: "Online Therapy That Works",
    intro:
      "Therapy you can attend from home, the office or anywhere with a phone. Choose video, voice or chat, meet a licensed therapist who understands your context, and pay with mobile money.",
    sections: [
      {
        h2: "Three ways to meet your therapist",
        p: "Video sessions for face-to-face connection, voice calls when bandwidth or privacy is tight, and text-based chat therapy from UGX 30,000 for people who find writing easier than talking.",
      },
      {
        h2: "Is online therapy as effective as in person?",
        p: "For common concerns such as depression, anxiety, stress and relationship difficulties, research consistently finds online therapy as effective as in-person sessions, with the added benefits of privacy, no travel and easier scheduling.",
      },
      {
        h2: "Private and confidential",
        p: "Sessions are one-to-one and confidential. Nothing is shared with employers, family or insurers, and you can use a first name only if you prefer. Anonymous options are available through our Whisper tool.",
      },
      {
        h2: "Simple, local pricing",
        p: "Chat therapy from UGX 30,000, individual video sessions at UGX 75,000, couples sessions at UGX 120,000 and support groups at UGX 25,000. Pay by MTN Mobile Money, Airtel Money or card.",
      },
    ],
  },
  {
    path: "/book-therapist",
    title: "Book a Therapist Online in Uganda | InnerSpark Africa",
    description:
      "Book a licensed Ugandan therapist in about two minutes. Choose video, voice or chat, pick your time, and pay with MTN or Airtel Money from UGX 30,000.",
    h1: "Book a Therapist Online",
    intro:
      "Booking takes about two minutes. Tell us what you are dealing with, get matched with a licensed therapist, choose a time and confirm with mobile money — your session details arrive by WhatsApp and email.",
    sections: [
      {
        h2: "Step 1 — Share what is going on",
        p: "A short, private pre-session check helps us understand your main concern, how long it has been going on, and how urgent it feels. It takes a few minutes and is never shared outside your therapist.",
      },
      {
        h2: "Step 2 — Get matched with the right therapist",
        p: "We recommend licensed therapists whose speciality matches your concern, and you can also choose a specific therapist yourself from their profile.",
      },
      {
        h2: "Step 3 — Pick a time and session type",
        p: "Choose video, voice or chat and select a weekday, evening or weekend slot. Chat therapy starts from UGX 30,000, individual video sessions are UGX 75,000 and couples sessions are UGX 120,000.",
      },
      {
        h2: "Step 4 — Confirm and pay",
        p: "Pay securely by MTN Mobile Money, Airtel Money or card. You receive a confirmation with your therapist's name, the session time and joining details, plus reminders before the session.",
      },
      {
        h2: "Need urgent support?",
        p: "If you are in crisis or thinking about harming yourself, please use our emergency support page for immediate crisis contacts in Uganda rather than waiting for a booked session.",
      },
    ],
  },
];
