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
    title: "Amani AI: Free Mental Wellness Chat Uganda | InnerSpark",
    description:
      "Amani is InnerSpark’s free AI mental wellness guide for stress, sleep and anxiety in Uganda. Not a therapist. Video therapy UGX 75,000; chat UGX 30,000.",
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
    title: "Online Therapy in Tanzania — Private, African Care",
    description: "Private online therapy in Tanzania with licensed African therapists. Video from about TZS 52,000 and chat from TZS 21,000.",
    h1: "Private therapy that travels less than you do",
    intro: "Speak with a licensed African therapist from Dar es Salaam, Arusha, Mwanza or wherever you feel safe.",
    sections: [{ h2: "Care without a long journey", p: "Distance, limited therapist choice outside major cities and concern about being recognised can delay support. Online therapy gives you more choice while keeping sessions private." }, { h2: "Support grounded in East African life", p: "Talk about work pressure, family responsibilities, relationship strain, grief, student stress or difficult life changes." }, { h2: "Clear prices in Tanzanian shillings", p: "Video therapy is about TZS 52,000 and chat therapy about TZS 21,000. Your Visa provider confirms the final conversion." }, { h2: "English and Swahili preferences", p: "Share your language preference during booking and InnerSpark will match it where a suitable therapist is available." }, { h2: "Start privately", p: "Choose a therapist and format, then receive your payment guidance and session confirmation by WhatsApp." }],
  },
  {
    path: "/nigeria",
    title: "Online Therapy in Nigeria — Private African Support",
    description: "Avoid traffic and talk privately with a licensed African therapist in Nigeria. Video from about NGN 27,500 and chat from NGN 11,000.",
    h1: "Therapy without Lagos traffic or a waiting room",
    intro: "Talk privately with a licensed African therapist who understands the pressure to keep performing, providing and appearing fine.",
    sections: [{ h2: "Support that fits Nigerian life", p: "Traffic, long workdays, rising living costs and concern about being seen at a clinic can make care difficult to begin." }, { h2: "Concerns you can bring", p: "Get support for career pressure, burnout, anxiety, relationships, grief, family expectations or relocation." }, { h2: "Clear naira estimates", p: "Video therapy is about NGN 27,500 and chat therapy about NGN 11,000. Your Visa provider confirms the final conversion." }, { h2: "Available beyond Lagos", p: "Join privately from Abuja, Port Harcourt or anywhere in Nigeria with a suitable internet connection." }, { h2: "Book without over-explaining", p: "Share your needs and therapist preferences, then receive private confirmation by WhatsApp." }],
  },
  {
    path: "/ghana",
    title: "Online Therapy in Ghana — Confidential African Care",
    description: "Confidential online therapy in Ghana with licensed African therapists. Video from about GHS 235 and chat from GHS 95.",
    h1: "Therapy that respects faith, family and your privacy",
    intro: "Talk with a licensed African therapist from Accra, Kumasi, Takoradi or wherever you feel comfortable.",
    sections: [{ h2: "Culturally relevant support beyond Accra", p: "Finding private support outside major cities can take time, while fear of judgement may stop people from trying." }, { h2: "Bring your whole context", p: "Talk about work, study, relationships, grief, faith, family expectations and the pressure to appear resilient." }, { h2: "Clear cedi estimates", p: "Video therapy is about GHS 235 and chat therapy about GHS 95. Your Visa provider confirms the final conversion." }, { h2: "Private from home", p: "Join from Kumasi, Takoradi or anywhere in Ghana without travelling to a public waiting room." }, { h2: "Choose how you talk", p: "Select video for a live conversation or lower-cost written chat when that feels easier." }],
  },
  {
    path: "/gambia",
    title: "Online Therapy in The Gambia | InnerSpark Africa",
    description: "Private online therapy in The Gambia with licensed African therapists. Video from about GMD 1,500 and chat from GMD 600.",
    h1: "More therapist choice, without giving up privacy",
    intro: "Connect with a licensed African therapist from Banjul, Kanifing, Brikama or anywhere you can speak safely.",
    sections: [{ h2: "A wider network for a close-knit country", p: "Privacy concerns and a limited local provider network can make asking for help feel exposed. Online therapy widens your options." }, { h2: "Concerns you can discuss", p: "Get support for family expectations, migration, work pressure, grief, relationships, anxiety or loneliness." }, { h2: "Clear dalasi estimates", p: "Video therapy is about GMD 1,500 and chat therapy about GMD 600. Your bank confirms the final conversion." }, { h2: "No public waiting room", p: "Choose a private place in Banjul, Kanifing, Brikama or elsewhere and attend online." }, { h2: "Choose your therapist", p: "Review profiles and share preferences about gender, language, concern and communication style." }],
  },
  {
    path: "/usa",
    title: "Online Therapy for Africans in the USA | InnerSpark",
    description: "Online support for Africans in the USA with therapists who understand diaspora identity, adjustment and family expectations. From about USD 9.",
    h1: "You should not have to translate your whole life in therapy",
    intro: "Speak with an African therapist who understands migration, family obligations and living between cultures.",
    sections: [{ h2: "The parts of diaspora life others can miss", p: "Homesickness, immigration stress, racial pressure and family expectations back home can overlap." }, { h2: "Support for living between cultures", p: "Talk about adjustment, identity, relationships, grief across distance, student life or workplace stress." }, { h2: "Clear dollar estimates", p: "Video therapy is about USD 22 and chat therapy about USD 9. The final amount is confirmed during payment." }, { h2: "Across US time zones", p: "Share your location and availability so InnerSpark can identify a practical session time." }, { h2: "Important care boundary", p: "InnerSpark is not a US emergency service. If you are in immediate danger, call or text 988 or contact local emergency services." }],
  },
  {
    path: "/whisper",
    title: "Whisper: Private Mental Health Voice Note Uganda | InnerSpark",
    description: "Send a free private mental health voice note when typing feels hard. Not emergency care. Licensed video therapy UGX 75,000; chat UGX 30,000.",
    h1: "Whisper — private mental health voice notes",
    intro: "Record what you are carrying without a public post. InnerSpark reviews private Whispers. For crisis, WhatsApp +256 792 085 773.",
    sections: [
      { h2: "When Whisper helps", p: "Use Whisper when writing feels impossible and you want a private first step before or instead of a full session." },
      { h2: "What it is not", p: "Whisper is not crisis care, diagnosis or ongoing therapy. Book a licensed therapist for video or chat when you want structured support." },
    ],
  },
  {
    path: "/wellbeing-check",
    title: "Free WHO-5 Mental Wellbeing Check Uganda | InnerSpark",
    description: "Free two-minute WHO-5 wellbeing check. Private score, no account, not a diagnosis. Next steps include licensed therapy from UGX 30,000 chat or UGX 75,000 video.",
    h1: "Free WHO-5 mental wellbeing check",
    intro: "Answer five short questions for a private wellbeing snapshot. No account required. Results are a guide, not a medical diagnosis.",
    sections: [
      { h2: "What the score means", p: "Lower scores suggest it may help to talk with a licensed therapist. Higher scores can still benefit from support during stressful seasons." },
      { h2: "What to do next", p: "Book confidential video therapy for UGX 75,000 or chat therapy for UGX 30,000, or WhatsApp InnerSpark on +256 792 085 773." },
    ],
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
