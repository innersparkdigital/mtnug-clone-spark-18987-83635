import type { GlobalLandingProps } from "@/components/seo/GlobalLandingPage";

const COMMON_RELATED = [
  { to: "/online-therapy", label: "Online therapy" },
  { to: "/specialists", label: "Our therapists" },
  { to: "/book-therapist", label: "Book a session" },
  { to: "/amani-ai", label: "Chat with Amani AI" },
  { to: "/support-groups", label: "Support groups" },
];

const PAYMENT_SECTION = {
  heading: "How you pay from outside Uganda",
  paragraphs: [
    "Payment is never the blocker. You can pay by international card (Visa or Mastercard), mobile money, or bank transfer — whichever is easiest where you live. Once payment is confirmed you get your therapist's details on WhatsApp and a calendar invite for your slot.",
  ],
  bullets: [
    "Individual session: USD 22 (60 minutes, licensed therapist)",
    "Couples session: USD 35",
    "Chat therapy: from USD 9 per session",
    "Card, mobile money (M-Pesa, MTN, Airtel) or bank transfer accepted",
    "Recurring weekly or fortnightly slots held for returning clients",
  ],
};

function faqPayment(country: string) {
  return {
    q: `Can I pay for therapy from ${country}?`,
    a: `Yes. Clients in ${country} pay by international Visa or Mastercard, mobile money or bank transfer. A 60-minute session with a licensed therapist is USD 22, couples USD 35, and chat therapy starts at USD 9.`,
  };
}

function faqTimezone(country: string) {
  return {
    q: `How do sessions work across time zones from ${country}?`,
    a: `Our therapists hold early-morning, evening and weekend slots, so you can book a time that fits your working day in ${country}. Sessions run on WhatsApp video, voice call, Google Meet or Zoom — you choose.`,
  };
}

const CONFIDENTIAL_FAQ = {
  q: "Is it completely confidential?",
  a: "Yes. Nothing you share is disclosed to your employer, family, insurer, board or government. Senior clients often use voice-only or chat sessions so they never appear on video, and we can sign an NDA on request.",
};

export const GLOBAL_LANDING_PAGES: Record<string, GlobalLandingProps> = {
  "online-therapy-africa": {
    slug: "online-therapy-africa",
    title: "Online Therapy in Africa — Licensed African Therapists from $22",
    metaDescription:
      "Talk to a licensed African therapist online from anywhere in Africa. Video, voice or chat sessions from USD 22. Confidential, same-week appointments, pay by card or mobile money.",
    keywords:
      "online therapy Africa, African therapist online, therapy in Africa, online counselling Africa, black therapist online, mental health support Africa, therapist who understands African culture",
    h1: "Online Therapy Across Africa — With Therapists Who Understand Your World",
    intro:
      "InnerSpark connects you with licensed African therapists by video, voice call or chat — from Nairobi to Lagos, Accra to Johannesburg, Kigali to Banjul. Culturally grounded care, private, and available this week.",
    areaServed: [
      "Kenya",
      "Nigeria",
      "Ghana",
      "South Africa",
      "Tanzania",
      "Rwanda",
      "Uganda",
      "Zambia",
      "Botswana",
      "Gambia",
      "Ethiopia",
      "Senegal",
    ],
    heroBadge: "Licensed African therapists · Confidential · Africa-wide",
    ctaPrice: "from USD 22",
    serviceName: "Online Therapy and Counselling across Africa",
    bodySections: [
      {
        heading: "Therapy that does not need translating",
        paragraphs: [
          "Most people who look for therapy in Africa end up on platforms built for Western clients — priced in dollars for Western salaries, staffed by clinicians who do not understand extended family obligation, black tax, church and mosque pressure, or what it costs socially to admit you are struggling.",
          "Every InnerSpark therapist is African, licensed, and trained in evidence-based approaches such as CBT, trauma-focused therapy, and couples work. You do not have to explain your context before you can start working on it.",
        ],
        bullets: [
          "Licensed clinicians, verified credentials, supervised practice",
          "Anxiety, depression, burnout, trauma, grief, relationships, addiction",
          "Individual, couples, teen (13+) and group sessions",
          "Sessions in English, Swahili, Luganda and more on request",
        ],
      },
      {
        heading: "Where our clients are",
        paragraphs: [
          "We work with clients across Kenya, Nigeria, Ghana, South Africa, Tanzania, Rwanda, Zambia, Botswana, Gambia, Ethiopia and Senegal — plus Africans living in the United States, United Kingdom, Canada and the Gulf. Because everything runs online, your location only matters for choosing a comfortable time.",
        ],
      },
      PAYMENT_SECTION,
      {
        heading: "Starting is one short form",
        paragraphs: [
          "Press Book a Session, tell us your concern and preferred format, and leave your WhatsApp number. A coordinator replies with two matched therapists and their available slots — usually within a few hours. If you would rather think out loud first, chat with Amani, our AI mental health guide, at any hour.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I get therapy online anywhere in Africa?",
        a: "Yes. InnerSpark is fully online, so you can book from any African country. Sessions run over WhatsApp video, voice call, chat, Google Meet or Zoom, and work on modest bandwidth.",
      },
      faqPayment("your country"),
      faqTimezone("your country"),
      CONFIDENTIAL_FAQ,
      {
        q: "How soon can I start?",
        a: "Most clients are matched the same day and in session within 24 to 72 hours, including evenings and weekends.",
      },
    ],
    relatedLinks: COMMON_RELATED,
  },

  "online-therapy-diaspora": {
    slug: "online-therapy-diaspora",
    title: "Therapy for Africans Abroad — African Therapists Online from $22",
    metaDescription:
      "Therapy for Africans in the USA, UK, Canada and the Gulf with licensed African therapists online. Culturally grounded care, evening and weekend slots, from USD 22 a session.",
    keywords:
      "African therapist in USA, African therapist UK, therapy for African diaspora, black therapist online, therapy for immigrants, Nigerian therapist online, Kenyan therapist online, culturally sensitive therapy",
    h1: "Therapy for Africans Living Abroad",
    intro:
      "If you are African and living in the US, UK, Canada, Europe or the Gulf, you already know how tiring it is to explain your family, your faith and your obligations before therapy can even begin. Our licensed African therapists start where you actually are.",
    areaServed: [
      "United States",
      "United Kingdom",
      "Canada",
      "United Arab Emirates",
      "Qatar",
      "Saudi Arabia",
      "Germany",
      "Australia",
    ],
    heroBadge: "African therapists · Any time zone · Fully confidential",
    ctaPrice: "from USD 22",
    serviceName: "Online Therapy for the African Diaspora",
    bodySections: [
      {
        heading: "What diaspora clients bring to us",
        paragraphs: [
          "Homesickness that never quite resolves. Guilt about the money you send home, or the money you cannot send. Racism and microaggressions at work you have stopped reporting. Marriages stretched across continents. Children who are culturally nothing like you were at their age. Grief for funerals you could not attend.",
          "These are not small problems, and they are not well served by a therapist who has never lived them.",
        ],
        bullets: [
          "Identity, belonging and migration stress",
          "Black tax, remittance pressure and family expectation",
          "Workplace discrimination, imposter syndrome and burnout",
          "Long-distance relationships and cross-cultural parenting",
          "Unprocessed grief and trauma from home",
        ],
      },
      {
        heading: "Sessions that fit a foreign working week",
        paragraphs: [
          "Therapists hold early-morning and late-evening slots so you can meet before work in Toronto or after the children sleep in London. Sessions are 60 minutes over your preferred platform, and your slot can be held weekly so therapy becomes a rhythm rather than a scramble.",
        ],
      },
      PAYMENT_SECTION,
      {
        heading: "Care for your family back home too",
        paragraphs: [
          "Many diaspora clients also pay for a parent, sibling or teenager back home to see one of our therapists. You can cover their sessions from abroad while they attend locally — and we never disclose to them, or to anyone else, what you discuss in your own sessions.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I see an African therapist while living in the United States or UK?",
        a: "Yes. InnerSpark therapists work online with African clients across the US, UK, Canada, Europe, Australia and the Gulf. Sessions run over video, voice or chat at a time that suits your zone.",
      },
      faqPayment("the US, UK, Canada or the Gulf"),
      faqTimezone("abroad"),
      {
        q: "Can I pay for therapy for a relative back in Africa?",
        a: "Yes. Many clients abroad sponsor sessions for a parent, sibling or teenager at home. You pay by card, we match them locally, and your own sessions stay entirely separate and private.",
      },
      CONFIDENTIAL_FAQ,
    ],
    relatedLinks: COMMON_RELATED,
  },

  "therapy-for-executives": {
    slug: "therapy-for-executives",
    title: "Confidential Therapy for Executives, Diplomats & Founders",
    metaDescription:
      "Discreet online therapy for executives, government officials, NGO leaders, founders and high-net-worth families. Licensed clinicians, NDA on request, sessions from USD 22.",
    keywords:
      "executive therapy, confidential therapy for CEOs, therapy for government officials, therapy for NGO leaders, discreet therapy for founders, private counselling for diplomats, therapy for business owners, high net worth mental health",
    h1: "Discreet Therapy for Leaders Who Cannot Be Seen in a Waiting Room",
    intro:
      "For ministers, diplomats, executives, NGO country directors, founders and family-business owners: private online sessions with licensed clinicians, held on your terms, with no visible footprint.",
    areaServed: [
      "Kenya",
      "Nigeria",
      "Ghana",
      "South Africa",
      "United States",
      "United Kingdom",
      "United Arab Emirates",
      "Uganda",
      "Rwanda",
      "Tanzania",
    ],
    heroBadge: "Senior-level discretion · NDA on request · No records shared",
    ctaPrice: "from USD 22",
    serviceName: "Confidential Executive Therapy and Leadership Wellbeing",
    bodySections: [
      {
        heading: "Why senior people delay therapy",
        paragraphs: [
          "It is rarely about cost. It is about exposure — being recognised in a clinic corridor, a diagnosis appearing in a medical file, a board or a constituency hearing that you were struggling. So the drinking increases, the sleep shortens, the marriage strains, and performance quietly erodes.",
          "We built this track for exactly that problem. Sessions happen wherever you are, on a channel you control, with a clinician who has worked with public figures before.",
        ],
        bullets: [
          "Voice-only or chat sessions if video is a risk",
          "Non-disclosure agreement signed on request",
          "No insurer, employer or HR notification, ever",
          "Named account manager, no shared call centre",
          "Bookings under an alias where you prefer",
        ],
      },
      {
        heading: "What we work on",
        paragraphs: [
          "Decision fatigue and chronic overload. Anxiety that only shows up at 3am. Alcohol creeping from occasional to nightly. Loneliness at the top. Marriages held together by logistics. Succession fights and family-business tension. Post-scandal or post-election stress. Trauma from security incidents, threats or displacement.",
        ],
      },
      PAYMENT_SECTION,
      {
        heading: "For your leadership team too",
        paragraphs: [
          "Organisations bring us in for confidential leadership wellbeing programmes, board-level coaching support and staff EAP cover. Individual results are never shared with HR — only anonymous, aggregated trends.",
        ],
      },
    ],
    faqs: [
      CONFIDENTIAL_FAQ,
      {
        q: "Can I have therapy without appearing on video?",
        a: "Yes. Voice-only and chat therapy are fully supported and used by many senior clients. You can also book under an alias.",
      },
      {
        q: "Will you sign an NDA?",
        a: "Yes. We sign a non-disclosure agreement on request before your first session, in addition to the confidentiality our clinicians are already bound by.",
      },
      faqTimezone("your base"),
      {
        q: "Do you work with organisations as well as individuals?",
        a: "Yes. We run confidential leadership wellbeing and staff EAP programmes for companies, NGOs, banks and government agencies, reporting only anonymised aggregate data.",
      },
    ],
    relatedLinks: [
      { to: "/for-business", label: "InnerSpark for Business" },
      ...COMMON_RELATED,
    ],
  },

  "therapy-for-students-africa": {
    slug: "therapy-for-students-africa",
    title: "Therapy for University Students in Africa — from $9 a Session",
    metaDescription:
      "Affordable online therapy for university and college students across Africa. Chat therapy from USD 9, licensed therapists, exam stress, anxiety, depression and relationship support.",
    keywords:
      "therapy for students Africa, student counselling online, university mental health Africa, affordable therapy for students, exam stress help, campus counselling online, therapy for young adults Africa",
    h1: "Therapy for Students Across Africa — Affordable and Private",
    intro:
      "Chat therapy from USD 9 and full sessions from USD 22, with licensed African therapists who work with exam pressure, anxiety, depression, relationships, and the fear of disappointing everyone who paid your fees.",
    areaServed: [
      "Kenya",
      "Nigeria",
      "Ghana",
      "South Africa",
      "Uganda",
      "Tanzania",
      "Rwanda",
      "Zambia",
    ],
    heroBadge: "Student rates · Licensed therapists · Fully private",
    ctaPrice: "from USD 9",
    serviceName: "Online Therapy for Students and Young Adults in Africa",
    bodySections: [
      {
        heading: "What students come to us with",
        paragraphs: [
          "Panic before exams and the blank freeze during them. Losing motivation halfway through a degree you chose to please your parents. Depression that looks like sleeping through lectures. Substance use that started as a coping tool. Toxic relationships, harassment, and pregnancies nobody can know about. Suicidal thoughts you have never said aloud.",
        ],
        bullets: [
          "Exam anxiety, procrastination and concentration problems",
          "Depression, self-harm and suicidal thoughts",
          "Relationship, sexuality and identity concerns",
          "Substance use and gambling",
          "Family pressure and financial stress",
        ],
      },
      {
        heading: "Built for a student budget and a student phone",
        paragraphs: [
          "Chat therapy is text-based with the same licensed clinicians, so it costs less and works on weak campus data. If you can afford a full session, a 60-minute video or voice appointment is USD 22. Free screening tools let you check where you stand before you spend anything.",
        ],
        bullets: [
          "Chat therapy from USD 9 per session",
          "Free anxiety, depression and stress screening tools",
          "Evening and weekend slots around lectures",
          "Anonymous Whisper wall if you are not ready to talk yet",
        ],
      },
      PAYMENT_SECTION,
      {
        heading: "For universities and student bodies",
        paragraphs: [
          "We partner with universities, colleges, student guilds and scholarship programmes to provide subsidised counselling cover, campus screening drives and mental health workshops. Individual student data is never shared with the institution.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is therapy for a student?",
        a: "Chat therapy starts at USD 9 per session and a full 60-minute video or voice session is USD 22. Screening tools on the site are free.",
      },
      {
        q: "Will my parents or university know?",
        a: "No. Sessions are confidential. We do not contact parents, lecturers or the university, including where the institution sponsors the programme.",
      },
      faqPayment("campus"),
      {
        q: "Can I get help urgently before an exam?",
        a: "Yes. Message us on WhatsApp and we will match you with a therapist who has a same-day or next-day slot.",
      },
      {
        q: "Can my university partner with InnerSpark?",
        a: "Yes. We run subsidised counselling cover, screening drives and workshops for universities, colleges and student bodies across Africa.",
      },
    ],
    relatedLinks: [
      { to: "/mind-check", label: "Free screening tools" },
      { to: "/whisper", label: "Anonymous Whisper" },
      ...COMMON_RELATED,
    ],
  },

  "online-therapy-nigeria": {
    slug: "online-therapy-nigeria",
    title: "Online Therapy in Nigeria — Licensed Therapists from $22",
    metaDescription:
      "Online therapy in Nigeria with licensed African therapists. Video, voice or chat sessions from USD 22, evenings and weekends, card and transfer payments accepted.",
    keywords:
      "online therapy Nigeria, therapist in Lagos, counselling Nigeria, psychologist Nigeria online, therapy in Abuja, affordable therapy Nigeria, mental health Nigeria",
    h1: "Online Therapy in Nigeria",
    intro:
      "Book a licensed African therapist from Lagos, Abuja, Port Harcourt, Ibadan or anywhere in Nigeria. Video, voice or chat — confidential, and often same week.",
    areaServed: ["Nigeria"],
    heroBadge: "Licensed therapists · Nigeria-wide · Confidential",
    ctaPrice: "from USD 22",
    serviceName: "Online Therapy and Counselling in Nigeria",
    bodySections: [
      {
        heading: "Care without the clinic queue",
        paragraphs: [
          "Nigeria has a handful of clinicians for tens of millions of people, and the ones who are available are concentrated in Lagos and Abuja. Online therapy removes the geography problem: your therapist joins you from wherever you are, at a time that fits work or school.",
          "Our therapists handle anxiety and panic attacks, depression, burnout, trauma, grief, relationship and marriage strain, and substance use — using evidence-based approaches like CBT and trauma-focused therapy.",
        ],
        bullets: [
          "Individual, couples and teen (13+) sessions",
          "Evening and weekend appointments",
          "Voice-only or chat if you prefer not to be on camera",
          "Free screening tools before you commit",
        ],
      },
      PAYMENT_SECTION,
      {
        heading: "Faith, family and privacy",
        paragraphs: [
          "Many Nigerian clients worry that therapy conflicts with faith, or that family will find out. Therapy is not a replacement for your beliefs — our clinicians work respectfully alongside them. And nothing is shared with your family, church, mosque or employer.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does online therapy cost in Nigeria?",
        a: "A 60-minute session with a licensed therapist is USD 22, couples USD 35, and chat therapy starts at USD 9 — usually well below private clinic rates in Lagos or Abuja.",
      },
      faqPayment("Nigeria"),
      faqTimezone("Nigeria"),
      CONFIDENTIAL_FAQ,
      {
        q: "Can I speak to a therapist today in Nigeria?",
        a: "Often yes. Message us on WhatsApp and we will match you with a clinician who has a same-day or next-day slot.",
      },
    ],
    relatedLinks: COMMON_RELATED,
  },

  "online-therapy-ghana": {
    slug: "online-therapy-ghana",
    title: "Online Therapy in Ghana — Licensed Therapists from $22",
    metaDescription:
      "Online therapy in Ghana with licensed African therapists. Video, voice or chat from USD 22. Accra, Kumasi and nationwide, evenings and weekends, mobile money accepted.",
    keywords:
      "online therapy Ghana, therapist in Accra, counselling Ghana, psychologist Ghana, therapy Kumasi, mental health Ghana, affordable therapy Ghana",
    h1: "Online Therapy in Ghana",
    intro:
      "Talk to a licensed African therapist from Accra, Kumasi, Takoradi or anywhere in Ghana — by video, voice call or chat, with mobile money payment and same-week slots.",
    areaServed: ["Ghana"],
    heroBadge: "Licensed therapists · Ghana-wide · Confidential",
    ctaPrice: "from USD 22",
    serviceName: "Online Therapy and Counselling in Ghana",
    bodySections: [
      {
        heading: "Support that fits your week",
        paragraphs: [
          "You should not have to take a day off and cross a city to be heard. Sessions run on WhatsApp video, voice call, chat, Zoom or Google Meet, including early mornings, evenings and weekends.",
          "Our clinicians work with anxiety, depression, workplace burnout, grief, trauma, relationship and marriage difficulties, and substance use — all with evidence-based methods.",
        ],
        bullets: [
          "Individual, couples and teen (13+) therapy",
          "Mobile money and card payments",
          "Voice-only and chat options for privacy",
          "Free screening tools on the site",
        ],
      },
      PAYMENT_SECTION,
      {
        heading: "Nobody needs to know",
        paragraphs: [
          "There is no clinic to be seen entering and nothing shared with your employer, family or church. Many clients book voice-only sessions from a parked car or a locked room at home.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does therapy cost in Ghana?",
        a: "A 60-minute session with a licensed therapist is USD 22, couples USD 35, and chat therapy starts at USD 9.",
      },
      faqPayment("Ghana"),
      faqTimezone("Ghana"),
      CONFIDENTIAL_FAQ,
      {
        q: "Is online therapy as effective as in person?",
        a: "For most common concerns — anxiety, depression, stress, relationships — research shows online therapy performs comparably to in-person care when delivered by licensed clinicians.",
      },
    ],
    relatedLinks: COMMON_RELATED,
  },

  "online-therapy-south-africa": {
    slug: "online-therapy-south-africa",
    title: "Online Therapy in South Africa — Licensed Therapists from $22",
    metaDescription:
      "Online therapy in South Africa with licensed African therapists. Video, voice or chat sessions from USD 22. Johannesburg, Cape Town, Durban and nationwide.",
    keywords:
      "online therapy South Africa, therapist Johannesburg online, counselling Cape Town online, psychologist South Africa online, affordable therapy South Africa, mental health South Africa",
    h1: "Online Therapy in South Africa",
    intro:
      "Licensed African therapists by video, voice or chat — from Johannesburg, Cape Town, Durban, Pretoria or anywhere in South Africa, at rates well below most private practice fees.",
    areaServed: ["South Africa"],
    heroBadge: "Licensed therapists · Nationwide · Confidential",
    ctaPrice: "from USD 22",
    serviceName: "Online Therapy and Counselling in South Africa",
    bodySections: [
      {
        heading: "Why clients here choose us",
        paragraphs: [
          "Private psychologist rates put consistent therapy out of reach for many South Africans, and medical aid cover usually runs out mid-year. Our sessions are USD 22 for a full 60 minutes, so a weekly rhythm stays affordable without depending on your benefits.",
          "Clinicians work with anxiety and panic, depression, trauma and PTSD, grief, load-shedding-era burnout, retrenchment stress, relationship strain and substance use.",
        ],
        bullets: [
          "No medical aid or referral letter needed",
          "Individual, couples and teen (13+) therapy",
          "Evening and weekend slots",
          "Voice-only or chat for extra privacy",
        ],
      },
      PAYMENT_SECTION,
      {
        heading: "Trauma-informed by default",
        paragraphs: [
          "Many South African clients bring experiences of crime, hijacking, assault or loss. Our clinicians are trained in trauma-focused work and will pace sessions so you are never pushed into retelling more than you are ready for.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is online therapy in South Africa?",
        a: "A 60-minute session with a licensed therapist is USD 22, couples USD 35, and chat therapy starts at USD 9 — typically far less than private practice rates.",
      },
      {
        q: "Do I need medical aid or a referral?",
        a: "No. You can book directly with no referral letter and no medical aid involvement, which also means no claim record.",
      },
      faqPayment("South Africa"),
      faqTimezone("South Africa"),
      CONFIDENTIAL_FAQ,
    ],
    relatedLinks: COMMON_RELATED,
  },
};

export const GLOBAL_LANDING_SLUGS = Object.keys(GLOBAL_LANDING_PAGES);