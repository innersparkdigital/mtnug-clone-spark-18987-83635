/**
 * Country / segment landing page content.
 *
 * Plain JS on purpose: this same object powers the React pages
 * (src/lib/globalLandingData.ts) and the build-time prerender
 * (scripts/prerender.mjs), so the raw HTML served to crawlers contains the
 * exact same unique content a visitor sees.
 *
 * Rule for this file: no country page may be another country page with the
 * name swapped. Title, meta description, H1, body sections and FAQs must each
 * speak to that market's own realities (providers, payment rails, prices,
 * cultural pressure, cities).
 */

const COMMON_RELATED = [
  { to: "/online-therapy", label: "Online therapy" },
  { to: "/specialists", label: "Our therapists" },
  { to: "/book-therapist", label: "Book a session" },
  { to: "/amani-ai", label: "Chat with Amani AI" },
  { to: "/support-groups", label: "Support groups" },
];

const CONFIDENTIAL_FAQ = {
  q: "Is it completely confidential?",
  a: "Yes. Nothing you share is disclosed to your employer, family, insurer, board or government. Senior clients often use voice-only or chat sessions so they never appear on video, and we can sign an NDA on request.",
};

function faqTimezone(country) {
  return {
    q: `How do sessions work across time zones from ${country}?`,
    a: `Our therapists hold early-morning, evening and weekend slots, so you can book a time that fits your working day in ${country}. Sessions run on WhatsApp video, voice call, Google Meet or Zoom — you choose.`,
  };
}

/** Shared price facts, expressed in each market's own payment language. */
function paymentSection(heading, paragraphs, bullets) {
  return { heading, paragraphs, bullets };
}

const PRICE_BULLETS = [
  "Individual 60-minute session: USD 22",
  "Couples session: USD 35",
  "Chat therapy: from USD 9 per session",
  "Recurring weekly or fortnightly slots held for returning clients",
];

export const GLOBAL_LANDING_PAGES = {
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
      paymentSection(
        "One price list, many payment rails",
        [
          "Whatever your country uses, we can take it: M-Pesa in Kenya and Tanzania, bank transfer or card in Nigeria, MTN and Telecel mobile money in Ghana, instant EFT or card in South Africa, MTN and Airtel money in Uganda. Once payment lands you get your therapist's name and slot on WhatsApp.",
        ],
        PRICE_BULLETS,
      ),
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
      {
        q: "What does a session cost across Africa?",
        a: "A 60-minute individual session is USD 22, couples USD 35, and chat therapy starts at USD 9 — the same price wherever you are, paid in your local rail or by card.",
      },
      faqTimezone("your country"),
      CONFIDENTIAL_FAQ,
      {
        q: "How soon can I start?",
        a: "Most clients are matched the same day and in session within 24 to 72 hours, including evenings and weekends.",
      },
    ],
    relatedLinks: [
      { to: "/kenya", label: "Therapy in Kenya" },
      { to: "/online-therapy-nigeria", label: "Therapy in Nigeria" },
      { to: "/online-therapy-ghana", label: "Therapy in Ghana" },
      { to: "/online-therapy-south-africa", label: "Therapy in South Africa" },
      ...COMMON_RELATED,
    ],
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
      paymentSection(
        "Paying from abroad, and paying for family at home",
        [
          "You pay by international Visa or Mastercard in USD. Because the price is set for African practice and not London or New York rates, most clients find weekly therapy affordable for the first time — and many also cover sessions for a parent or sibling back home on the same card.",
        ],
        PRICE_BULLETS,
      ),
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
      {
        q: "How much is a session if I pay from abroad?",
        a: "USD 22 for a 60-minute individual session, USD 35 for couples and from USD 9 for chat therapy, charged to an international Visa or Mastercard.",
      },
      faqTimezone("abroad"),
      {
        q: "Can I pay for therapy for a relative back in Africa?",
        a: "Yes. Many clients abroad sponsor sessions for a parent, sibling or teenager at home. You pay by card, we match them locally, and your own sessions stay entirely separate and private.",
      },
      CONFIDENTIAL_FAQ,
    ],
    relatedLinks: [
      { to: "/online-therapy-africa", label: "Online therapy across Africa" },
      ...COMMON_RELATED,
    ],
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
      paymentSection(
        "Billing that leaves no trail you did not choose",
        [
          "Sessions are paid by card or transfer with no insurer and no medical-aid claim, so nothing enters a benefits record. Invoices can be issued to you personally rather than to a company, and blocks of sessions can be prepaid so there is no recurring transaction each week.",
        ],
        PRICE_BULLETS,
      ),
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
      paymentSection(
        "Paying without a salary",
        [
          "Students pay per session rather than by subscription, using mobile money, a parent's card or a friend's account — whatever is available that week. There is no lock-in, no cancellation fee, and you can move from chat therapy up to full sessions when money allows.",
        ],
        PRICE_BULLETS,
      ),
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
      {
        q: "Can I pay per session instead of subscribing?",
        a: "Yes. Every session is paid for on its own by mobile money or card, so you can book only in the weeks you can afford it.",
      },
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
    title: "Therapist in Nigeria Online — Lagos & Abuja Sessions from $22",
    metaDescription:
      "See a licensed therapist online in Nigeria without joining a Lagos clinic waiting list. Video, voice or chat from $22, paid by transfer or card, evenings and weekends.",
    keywords:
      "online therapy Nigeria, therapist in Lagos, counselling Nigeria, psychologist Nigeria online, therapy in Abuja, affordable therapy Nigeria, mental health Nigeria",
    h1: "See a Therapist in Nigeria Without Joining a Clinic Waiting List",
    intro:
      "Nigeria has roughly 250 psychiatrists for more than 200 million people, nearly all of them in Lagos, Abuja and a few teaching hospitals. InnerSpark puts a licensed therapist on your phone instead — video, voice or chat, from Lagos to Maiduguri.",
    areaServed: ["Nigeria"],
    heroBadge: "Licensed therapists · Nigeria-wide · Confidential",
    ctaPrice: "from USD 22",
    serviceName: "Online Therapy and Counselling in Nigeria",
    bodySections: [
      {
        heading: "The provider gap, and what to do about it",
        paragraphs: [
          "If you have tried to book privately in Lagos you already know the pattern: a two- to six-week wait, a fee between ₦25,000 and ₦60,000 a session, and a clinic on the other side of third-mainland traffic. Federal Neuro-Psychiatric Hospital Yaba and the teaching hospitals in Ibadan, Enugu and Kano are cheaper but heavily oversubscribed.",
          "Online therapy takes geography and traffic out of the equation. You keep the same clinician week after week regardless of whether you are in Lekki, Wuse, Port Harcourt or a posting upcountry — which matters, because continuity is what actually produces change.",
        ],
        bullets: [
          "No waiting list — most clients are matched within 24 hours",
          "Anxiety and panic, depression, trauma, grief, marital strain, substance use",
          "Individual, couples and teen (13+) sessions",
          "Voice-only or chat if you would rather not be on camera",
        ],
      },
      {
        heading: "Work stress in a country that never switches off",
        paragraphs: [
          "A large share of our Nigerian clients are working professionals: bank staff on 7am-to-9pm rotations, tech workers on foreign contracts and Lagos time, NYSC members, doctors doing back-to-back calls, and business owners absorbing every naira shock personally. The presenting problem is usually 'stress', and what we find underneath is untreated anxiety, insomnia and burnout that has been running for years.",
          "Sessions are scheduled around that reality — 6am before the commute, 9pm after the children sleep, or Saturday morning.",
        ],
      },
      paymentSection(
        "Paying from a Nigerian account",
        [
          "You can pay by naira bank transfer or by Visa, Mastercard or Verve card. There is no dollar subscription to maintain and no international card requirement, and each session is paid for individually so you are never locked into a plan while the exchange rate moves.",
        ],
        [
          "Individual 60-minute session: USD 22 (payable by naira transfer or card)",
          "Couples session: USD 35",
          "Chat therapy: from USD 9 per session",
          "No subscription, no cancellation fee, no referral letter needed",
        ],
      ),
      {
        heading: "Faith, family and the fear of being talked about",
        paragraphs: [
          "Many Nigerian clients have been told to pray harder, or that therapy is a foreign idea. Our clinicians do not ask you to set your faith aside — several work explicitly alongside it, and you can request a therapist who shares your religious background.",
          "Nothing reaches your family, your church or mosque, your employer or an insurer. There is no clinic anyone can see you entering, and you may book using a first name only.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does online therapy cost in Nigeria?",
        a: "A 60-minute session with a licensed therapist is USD 22, couples USD 35, and chat therapy starts at USD 9 — usually below the ₦25,000 to ₦60,000 charged by private clinics in Lagos and Abuja.",
      },
      {
        q: "Can I pay in naira by bank transfer?",
        a: "Yes. Nigerian clients pay by naira bank transfer or by Visa, Mastercard or Verve card. You do not need a domiciliary account or an international card.",
      },
      faqTimezone("Nigeria"),
      CONFIDENTIAL_FAQ,
      {
        q: "Can I speak to a therapist today in Nigeria?",
        a: "Often yes. Message us on WhatsApp and we will match you with a clinician who has a same-day or next-day slot, including evenings.",
      },
      {
        q: "Do I need a referral or a diagnosis first?",
        a: "No. You can book directly. Your therapist will do a short assessment in the first session and tell you honestly if you need psychiatric care rather than talk therapy.",
      },
    ],
    relatedLinks: [
      { to: "/blog/cost-of-therapy-in-nigeria", label: "What therapy really costs in Nigeria" },
      { to: "/blog/find-a-therapist-in-lagos", label: "How to find a therapist in Lagos" },
      { to: "/online-therapy-africa", label: "Online therapy across Africa" },
      ...COMMON_RELATED,
    ],
  },

  "online-therapy-ghana": {
    slug: "online-therapy-ghana",
    title: "Online Counselling in Ghana — Accra & Kumasi Sessions from $22",
    metaDescription:
      "Licensed online counselling in Ghana by video, voice or chat from $22 a session. Pay with MTN or Telecel mobile money, book evenings and weekends, nothing shared with anyone.",
    keywords:
      "online therapy Ghana, therapist in Accra, counselling Ghana, psychologist Ghana, therapy Kumasi, mental health Ghana, affordable therapy Ghana",
    h1: "Online Counselling in Ghana, Paid With Mobile Money",
    intro:
      "Ghana has fewer than 100 practising clinical psychologists for over 30 million people, and most sit in Accra. InnerSpark gives you a licensed therapist on WhatsApp instead — from Accra, Kumasi, Takoradi, Tamale or a village with one bar of signal.",
    areaServed: ["Ghana"],
    heroBadge: "Licensed therapists · Ghana-wide · Confidential",
    ctaPrice: "from USD 22",
    serviceName: "Online Therapy and Counselling in Ghana",
    bodySections: [
      {
        heading: "What is actually available in Ghana today",
        paragraphs: [
          "Public mental health care runs through Accra Psychiatric Hospital, Pantang, Ankaful and the regional hospitals, and it is stretched thin — long queues, short consultations and a strong bias toward medication over talking therapy. Private psychologists in East Legon or Airport Residential typically charge GH₵300 to GH₵800 a session, before transport.",
          "What is missing in between is affordable, consistent talk therapy. That is the gap we fill: the same licensed clinician every week, met from wherever you are, at a price a working Ghanaian can keep up for months rather than twice.",
        ],
        bullets: [
          "Anxiety and panic, depression, trauma, grief, relationship and marriage work",
          "Individual, couples and teen (13+) sessions",
          "Video, voice call or text-based chat therapy",
          "Free anxiety, depression and stress screening before you spend anything",
        ],
      },
      {
        heading: "Sessions built for Ghanaian bandwidth and Ghanaian hours",
        paragraphs: [
          "Most clients meet on WhatsApp video or a plain voice call, which holds up on mobile data far better than a video platform. Chat therapy is fully text-based, so it works during a shift, in a shared room, or when data is short. Slots run from 6am through 9pm including Saturdays, so nobody has to explain a midday absence at work.",
        ],
      },
      paymentSection(
        "Pay with MTN or Telecel mobile money",
        [
          "Payment is by MTN Mobile Money, Telecel Cash, AT Money or card — no bank visit and no international card required. Each session is paid separately, so there is nothing running in the background if you take a month off.",
        ],
        [
          "Individual 60-minute session: USD 22 (payable by MTN or Telecel mobile money)",
          "Couples session: USD 35",
          "Chat therapy: from USD 9 per session",
          "No subscription and no cancellation fee",
        ],
      ),
      {
        heading: "Nobody needs to know",
        paragraphs: [
          "There is no clinic to be seen entering and nothing shared with your employer, family or church. Many clients book voice-only sessions from a parked car, a locked room at home, or the office after everyone leaves. If someone else pays for your sessions, they still receive nothing about what you discuss.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does therapy cost in Ghana?",
        a: "A 60-minute session with a licensed therapist is USD 22, couples USD 35, and chat therapy starts at USD 9 — generally below the GH₵300 to GH₵800 charged by private practices in Accra.",
      },
      {
        q: "Can I pay with MTN Mobile Money or Telecel Cash?",
        a: "Yes. Ghanaian clients pay by MTN Mobile Money, Telecel Cash, AT Money or card. You do not need a bank account or an international card.",
      },
      faqTimezone("Ghana"),
      CONFIDENTIAL_FAQ,
      {
        q: "Is online therapy as effective as in person?",
        a: "For most common concerns — anxiety, depression, stress, relationships — research shows online therapy performs comparably to in-person care when delivered by licensed clinicians.",
      },
      {
        q: "Can I have sessions in Twi or another local language?",
        a: "Sessions run in English by default. Tell us your preferred language when booking and we will tell you honestly whether a therapist on the panel can hold the session in it.",
      },
    ],
    relatedLinks: [
      { to: "/blog/cost-of-therapy-in-ghana", label: "What therapy really costs in Ghana" },
      { to: "/blog/find-a-therapist-in-accra", label: "How to find a therapist in Accra" },
      { to: "/online-therapy-africa", label: "Online therapy across Africa" },
      ...COMMON_RELATED,
    ],
  },

  "online-therapy-south-africa": {
    slug: "online-therapy-south-africa",
    title: "Online Therapy South Africa — No Medical Aid Needed, from $22",
    metaDescription:
      "Online therapy in South Africa without medical aid, a referral or a claim record. Licensed therapists by video, voice or chat from $22 — far below private psychologist rates.",
    keywords:
      "online therapy South Africa, therapist Johannesburg online, counselling Cape Town online, psychologist South Africa online, affordable therapy South Africa, therapy without medical aid",
    h1: "Online Therapy in South Africa — Without Medical Aid or a Claim Record",
    intro:
      "Private psychologists here charge R900 to R1,600 a session and most medical aid mental health benefits run dry by mid-year. InnerSpark sessions are USD 22 for a full 60 minutes, paid directly, with no scheme, no referral and no record on your benefits.",
    areaServed: ["South Africa"],
    heroBadge: "Licensed therapists · Nationwide · No medical aid needed",
    ctaPrice: "from USD 22",
    serviceName: "Online Therapy and Counselling in South Africa",
    bodySections: [
      {
        heading: "Why the benefit runs out before the work is done",
        paragraphs: [
          "Most schemes fund a limited number of psychology sessions a year from a savings or PMB allocation. Meaningful therapy for depression, PTSD or a marriage in trouble usually takes longer than that, so people stop mid-course — not because they improved, but because the allocation ended.",
          "Paying USD 22 directly changes the arithmetic. A weekly session costs less than most single private consultations, so the work can run to its natural end. And because no claim is submitted, no diagnosis code enters your scheme or future underwriting record.",
        ],
        bullets: [
          "No medical aid, gap cover or referral letter required",
          "No claim, so no diagnosis on your benefits history",
          "Anxiety and panic, depression, PTSD, grief, retrenchment stress, substance use",
          "Individual, couples and teen (13+) therapy",
        ],
      },
      {
        heading: "Trauma-informed by default",
        paragraphs: [
          "Many South African clients bring hijacking, armed robbery, assault, farm or township violence, or the sudden loss of someone close. Our clinicians are trained in trauma-focused work and will pace sessions so you are never pushed into retelling more than you are ready for — grounding and stabilisation first, processing only when you say you are ready.",
          "Others come with retrenchment and financial fear, emigration grief as friends leave, or the flat exhaustion of years of load-shedding and logistics failure. All of it is legitimate clinical material.",
        ],
      },
      paymentSection(
        "Paying without a scheme",
        [
          "Pay by card or instant EFT, session by session. Nothing is claimed, nothing is pre-authorised, and there is no monthly subscription — so a month off costs you nothing and does not close your file.",
        ],
        [
          "Individual 60-minute session: USD 22 (card or instant EFT)",
          "Couples session: USD 35",
          "Chat therapy: from USD 9 per session",
          "Evening and Saturday slots across all provinces",
        ],
      ),
      {
        heading: "From any province, in your own time zone",
        paragraphs: [
          "Clients join from Johannesburg, Cape Town, Durban, Pretoria, Port Elizabeth, Bloemfontein and small towns with no psychologist for a hundred kilometres. Sessions run on video, voice or chat, all within SAST, including after work and on Saturday mornings.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is online therapy in South Africa?",
        a: "A 60-minute session with a licensed therapist is USD 22, couples USD 35, and chat therapy starts at USD 9 — typically well below the R900 to R1,600 charged in private practice.",
      },
      {
        q: "Do I need medical aid or a referral?",
        a: "No. You can book directly with no referral letter and no medical aid involvement, which also means no claim and no diagnosis code on your benefits record.",
      },
      {
        q: "How do I pay from South Africa?",
        a: "By card or instant EFT, one session at a time. There is no subscription and no scheme pre-authorisation.",
      },
      faqTimezone("South Africa"),
      CONFIDENTIAL_FAQ,
    ],
    relatedLinks: [
      { to: "/online-therapy-africa", label: "Online therapy across Africa" },
      { to: "/therapy-for-executives", label: "Confidential therapy for executives" },
      ...COMMON_RELATED,
    ],
  },
};
