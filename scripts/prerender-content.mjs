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
  {
    path: "/for-business",
    title: "Corporate Mental Health & EAP | InnerSpark",
    description: "Employee wellbeing screening, confidential counselling and practical workplace mental health training for employers in Uganda, Kenya and Tanzania.",
    h1: "Corporate mental health support for East African teams",
    intro: "InnerSpark Africa helps employers understand wellbeing needs and give employees confidential access to licensed therapists.",
    sections: [
      { h2: "Employee wellbeing screening", p: "Use confidential wellbeing checks to identify pressure and support needs at team level without exposing individual responses." },
      { h2: "Confidential employee counselling", p: "Give employees access to licensed African therapists by video or chat, with support that understands local workplace and family context." },
      { h2: "Mental health training", p: "Equip managers and teams with practical ways to recognise stress, respond appropriately and build healthier work routines." },
    ],
  },
  {
    path: "/amani-ai",
    title: "Amani AI Uganda — Free Mental Wellness Chat | InnerSpark",
    description:
      "Chat with Amani, InnerSpark Africa's free AI wellness guide for stress, sleep, anxiety and relationships. Amani is not a therapist or emergency service.",
    h1: "Meet Amani — your free AI mental wellness guide",
    intro:
      "Use Amani to talk through stress, anxiety, burnout, sleep or relationship concerns and find a practical next step. Amani is an AI guide, not a therapist or emergency service.",
    sections: [
      {
        h2: "What Amani can help with",
        p: "Amani can listen, share general coping ideas, suggest a free wellbeing check and help you find a licensed InnerSpark therapist when you want professional support.",
      },
      {
        h2: "Know the limits before you chat",
        p: "Amani cannot diagnose, prescribe treatment or replace a licensed therapist. Avoid sharing passwords, payment details or other sensitive identifying information.",
      },
      {
        h2: "If you feel unsafe or may harm yourself",
        p: "Amani is not an emergency service. If you may harm yourself or feel unsafe, send an urgent WhatsApp message to InnerSpark on +256 792 085 773.",
      },
      {
        h2: "Move from chat to licensed support",
        p: "When you are ready, Amani can guide you to licensed African therapists. Video therapy costs UGX 75,000 per session and chat therapy costs UGX 30,000.",
      },
    ],
  },
  {
    path: "/tanzania",
    title: "Online Therapy in Tanzania | InnerSpark Africa",
    description: "Confidential online therapy in Tanzania with licensed African therapists. Video sessions about TZS 52,000; chat about TZS 21,000.",
    h1: "Online therapy in Tanzania with African therapists",
    intro: "Speak privately by video or chat from Dar es Salaam, Arusha, Mwanza or anywhere with internet.",
    sections: [{ h2: "Support without the journey", p: "Choose a licensed African therapist for work pressure, relationships, grief, student stress or family concerns." }, { h2: "Clear local estimate", p: "Video therapy is about TZS 52,000 and chat therapy about TZS 21,000. Your Visa provider confirms the final conversion." }],
  },
  {
    path: "/nigeria",
    title: "Online Therapy in Nigeria | InnerSpark Africa",
    description: "Confidential online therapy in Nigeria with licensed African therapists. Video about NGN 27,500; chat about NGN 11,000.",
    h1: "Online therapy in Nigeria without traffic or waiting rooms",
    intro: "Talk to an African therapist from Lagos, Abuja, Port Harcourt or elsewhere in Nigeria.",
    sections: [{ h2: "Therapy that understands African life", p: "Get support for career pressure, burnout, relationships, grief, family expectations or relocation." }, { h2: "Clear local estimate", p: "Video therapy is about NGN 27,500 and chat therapy about NGN 11,000. Your Visa provider confirms the final conversion." }],
  },
  {
    path: "/ghana",
    title: "Online Therapy in Ghana | InnerSpark Africa",
    description: "Confidential online therapy in Ghana with licensed African therapists. Video about GHS 235; chat about GHS 95.",
    h1: "Online therapy in Ghana with licensed African therapists",
    intro: "Book private video or chat support from Accra, Kumasi, Takoradi or anywhere in Ghana.",
    sections: [{ h2: "Private support that fits your context", p: "Talk about work, study, relationships, grief, faith or family life without having to over-explain your culture." }, { h2: "Clear local estimate", p: "Video therapy is about GHS 235 and chat therapy about GHS 95. Your Visa provider confirms the final conversion." }],
  },
  {
    path: "/gambia",
    title: "Online Therapy in The Gambia | InnerSpark Africa",
    description: "Confidential online therapy in The Gambia with licensed African therapists by video or chat, payable securely by Visa.",
    h1: "Private online therapy in The Gambia",
    intro: "Choose from a wider network of licensed African therapists while speaking from a private place in Banjul, Kanifing, Brikama or elsewhere.",
    sections: [{ h2: "More choice without losing local understanding", p: "Get confidential support for family, work, migration, grief or relationship pressures." }, { h2: "Clear payment", p: "Video therapy is UGX 75,000 and chat therapy UGX 30,000, converted into dalasi by your Visa provider." }],
  },
  {
    path: "/usa",
    title: "Online Therapy for Africans in the USA | InnerSpark",
    description: "Online therapy for Africans in the United States with therapists who understand diaspora identity, family expectations and life between cultures.",
    h1: "An African therapist who understands life between two worlds",
    intro: "Private online support for African immigrants, students and diaspora families in the United States.",
    sections: [{ h2: "You should not have to translate your whole life", p: "Talk about adjustment, relationships, grief, identity, family expectations or work stress with an African therapist." }, { h2: "Clear local estimate", p: "Video therapy is about USD 21 and chat therapy about USD 8. Your Visa provider confirms the final conversion." }],
  },
  {
    path: "/kenya",
    title: "Online Therapy in Kenya | InnerSpark Africa",
    description:
      "Online therapy in Kenya with licensed African therapists. Video, voice or chat from KES 2,600, paid via M-Pesa. Book in 2 minutes, fully private.",
    h1: "Therapy That Understands Your World — From Anywhere in Kenya",
    intro:
      "Book a licensed African therapist by video, voice or chat from KES 2,600. Pay via M-Pesa and complete your booking in about two minutes.",
    sections: [
      {
        h2: "Online therapy across Kenya",
        p: "Meet from Nairobi, Mombasa, Kisumu, Nakuru, Eldoret or rural Kenya using low-bandwidth video, voice or chat. Therapists understand East African family, work and cultural contexts.",
      },
      {
        h2: "Simple M-Pesa payment",
        p: "Single online sessions start from KES 2,600. Pay through M-Pesa, then receive the session confirmation and joining details by WhatsApp.",
      },
      {
        h2: "Choose a licensed therapist",
        p: "Browse therapist profiles by speciality, language and availability, or ask InnerSpark to recommend a match for individual, couples, teen or family support.",
      },
    ],
  },
];
