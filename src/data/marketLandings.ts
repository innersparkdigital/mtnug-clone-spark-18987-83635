export type MarketCity = { id: string; city: string; body: string; kw: string };

export type MarketLanding = {
  slug: string;
  countryLabel: string;
  code: string;
  flag: string;
  currency: string;
  videoPrice: string;
  videoAmount: number;
  chatPrice: string;
  monthlyPrice: string;
  monthlyNote: string;
  ugxNote: string;
  citiesLine: string;
  title: string;
  description: string;
  h1: string;
  h1Line2: string;
  introLine1: string;
  introLine2: string;
  paymentLabel: string;
  paymentAccepted: string[];
  trustPayment: string;
  problemHeadline: string;
  problemSource: string;
  problemBody: [string, string];
  howHeadline: string;
  howSteps: [string, string, string];
  howBodies: [string, string, string];
  paymentHowTitle: string;
  paymentHowSteps: string[];
  paymentTip: string;
  offerCompare: string;
  concerns: string[];
  cities: MarketCity[];
  testimonials: { quote: string; who: string }[];
  faqs: { q: string; a: string }[];
  related: { to: string; label: string; tag: string; blurb: string }[];
  finalCta: string;
  whatsappPrefill: string;
  schemaCities: string[];
  /** Optional overrides used when a segment page reuses this layout. */
  canonicalUrl?: string;
  keywords?: string;
  extraSections?: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const MARKET_LANDINGS: Record<string, MarketLanding> = {
  nigeria: {
    slug: "nigeria",
    countryLabel: "Nigeria",
    code: "NG",
    flag: "NG",
    currency: "NGN",
    videoPrice: "NGN 27,500",
    videoAmount: 27500,
    chatPrice: "NGN 11,000",
    monthlyPrice: "NGN 102,000",
    monthlyNote: "4 sessions · about NGN 25,500 each",
    ugxNote: "~UGX 75,000 · ~$22",
    citiesLine: "Lagos, Abuja, Port Harcourt and across Nigeria",
    title: "Book Online Therapy Nigeria | Therapist Lagos & Abuja from ~NGN 27,500",
    description: "How much does a therapist cost in Nigeria? Book online — video ~NGN 27,500 · chat ~NGN 11,000. Licensed therapists in Lagos, Abuja, Port Harcourt. Visa. WhatsApp +256 792 085 773.",
    h1: "Book a therapist online in Nigeria. From ~NGN 27,500.",
    h1Line2: "Lagos · Abuja · Port Harcourt. Private. Visa ready.",
    introLine1: "For professionals earning enough to invest in confidential care.",
    introLine2: "From about NGN 27,500 · Pay by Visa · Book in about 2 minutes.",
    paymentLabel: "Visa / card",
    paymentAccepted: ["Visa", "Card"],
    trustPayment: "Visa accepted",
    problemHeadline: "High performers in Lagos and Abuja keep pushing — until the cost of not talking is higher than one session.",
    problemSource: "Built for people who can pay for real care, not free helplines",
    problemBody: [
      "Traffic, long workdays, family expectations and fear of being seen at a clinic keep high earners stuck. You do not need another free tip — you need a licensed therapist, a clear price and a private way to start.",
      "InnerSpark is for professionals ready to book and pay for confidential video or chat therapy with African therapists who already understand the context.",
    ],
    howHeadline: "From Lagos to Abuja — therapy from your phone in 3 steps.",
    howSteps: ["Choose your therapist", "Book and pay by Visa", "Connect on WhatsApp"],
    howBodies: [
      "Browse licensed African therapists. Filter by specialisation, gender and language. Pick who feels right — no clinic queue.",
      "Video about NGN 27,500 or chat about NGN 11,000. Your bank confirms the final naira conversion.",
      "Your therapist sends a WhatsApp video or voice link. No new app. Join from a private room.",
    ],
    paymentHowTitle: "How payment works in Nigeria",
    paymentHowSteps: [
      "Choose video (~NGN 27,500) or chat (~NGN 11,000) when you book",
      "Pay by Visa / international card on the secure payment page",
      "Your bank shows the final naira conversion before you confirm",
      "Keep your receipt and message WhatsApp if we need to match payment",
    ],
    paymentTip: "Prefer a lower-cost paid start? Begin with chat at about NGN 11,000, then move to video.",
    offerCompare: "One video session costs less than many private consultations in Lagos — without traffic, a waiting room or being recognised.",
    concerns: ["Work stress and burnout", "Relationship and marriage strain", "Anxiety and overthinking", "Relocation and career pressure", "Grief and family expectations", "Low mood while still functioning"],
    cities: [
      { id: "lagos", city: "Lagos", body: "Skip traffic and clinic queues. Book from Lekki, Ikoyi, VI, Ikeja or anywhere in Lagos — evenings included.", kw: "Therapist in Lagos" },
      { id: "abuja", city: "Abuja", body: "Confidential online sessions for professionals in Maitama, Asokoro, Wuse and beyond.", kw: "Counsellor in Abuja" },
      { id: "port-harcourt", city: "Port Harcourt", body: "Private support without a public waiting room. Book online, pay by Visa, meet on WhatsApp.", kw: "Therapy in Port Harcourt" },
      { id: "ibadan", city: "Ibadan", body: "University and professional clients get discreet licensed care online.", kw: "Therapist in Ibadan" },
      { id: "kano", city: "Kano", body: "Discreet online therapy with African therapists who understand local and family context.", kw: "Counselling in Kano" },
      { id: "nationwide", city: "Across Nigeria", body: "If you have a phone and data, you can book this week at a clear naira price.", kw: "Online therapy Nigeria" },
    ],
    testimonials: [
      { quote: "I stopped waiting for a free option and booked a real session. My therapist understood the pressure to keep performing.", who: "Professional, Lagos" },
      { quote: "Clear price, Visa payment, WhatsApp session. No clinic, no awkward waiting room.", who: "Business owner, Abuja" },
      { quote: "I wanted someone who gets Nigerian family expectations. Booking took minutes and felt private and serious.", who: "Manager, Port Harcourt" },
    ],
    faqs: [
      { q: "How much does a therapist cost in Nigeria?", a: "On InnerSpark, video therapy is about NGN 27,500 per session and chat therapy about NGN 11,000. That is 1 hour of licensed care — your card confirms the final naira amount." },
      { q: "Where can I get a therapist in Lagos or Abuja?", a: "Book online with InnerSpark. You get a licensed African therapist by video or chat — no Lagos traffic, no clinic waiting room. Available from Lekki, Ikeja, VI, Maitama, Asokoro and beyond." },
      { q: "How much is 1 hour of therapy?", a: "About NGN 27,500 for a video session (~50 minutes) or NGN 11,000 for chat therapy. Couples sessions are priced separately." },
      { q: "How do I know if I need therapy?", a: "If stress, low mood, relationship strain or burnout keep showing up and free tips are not enough, a licensed session is a practical next step. You can also take our free wellbeing check first." },
      { q: "How do I pay from Nigeria?", a: "By Visa or international card. Confirm on WhatsApp after payment if we request your receipt." },
      { q: "Will my employer find out?", a: "No. Sessions are one-to-one and private. We do not contact employers." },
      { q: "Is this emergency care?", a: "No. If you are in immediate danger, contact local emergency services." },
    ],
    related: [
      { to: "/blog/cost-of-therapy-in-nigeria", label: "How much does therapy cost in Nigeria?", tag: "Therapy costs", blurb: "Private clinic fees vs clear online rates." },
      { to: "/blog/find-a-therapist-in-lagos", label: "How to find a therapist in Lagos", tag: "Finding help", blurb: "Licensing, fit and privacy before you pay." },
    ],
    finalCta: "Book my first session — from NGN 27,500",
    whatsappPrefill: "Hi InnerSpark, I want to book licensed therapy in Nigeria. Please confirm price and a therapist.",
    schemaCities: ["Lagos", "Abuja", "Port Harcourt"],
  },
  tanzania: {
    slug: "tanzania",
    countryLabel: "Tanzania",
    code: "TZ",
    flag: "TZ",
    currency: "TZS",
    videoPrice: "TZS 52,000",
    videoAmount: 52000,
    chatPrice: "TZS 21,000",
    monthlyPrice: "TZS 192,000",
    monthlyNote: "4 sessions · about TZS 48,000 each",
    ugxNote: "~UGX 75,000 · ~$22",
    citiesLine: "Dar es Salaam, Arusha, Mwanza and across Tanzania",
    title: "Book Online Therapy Tanzania | Dar es Salaam from ~TZS 52,000",
    description: "How much is online therapy in Tanzania? Video ~TZS 52,000 · chat ~TZS 21,000. Licensed therapists — Dar es Salaam, Arusha, Mwanza. Swahili preference. Visa. WhatsApp +256 792 085 773.",
    h1: "Book online therapy in Tanzania. From ~TZS 52,000.",
    h1Line2: "Dar · Arusha · Mwanza. Private. Visa ready.",
    introLine1: "For professionals ready to invest in confidential care.",
    introLine2: "From about TZS 52,000 · Pay by Visa · Book in about 2 minutes.",
    paymentLabel: "Visa / card",
    paymentAccepted: ["Visa", "Card"],
    trustPayment: "Visa accepted",
    problemHeadline: "Distance, limited local choice and privacy worries stop people who could already afford care from ever booking.",
    problemSource: "For earners ready to pay — not free advice loops",
    problemBody: [
      "Outside a few cities, finding a private licensed therapist is hard. Inside cities, being recognised still worries people. Free content will not fix that.",
      "InnerSpark connects you with licensed African therapists. You pay a transparent rate, confirm on WhatsApp and start without a public waiting room.",
    ],
    howHeadline: "From Dar to Arusha — therapy from your phone in 3 steps.",
    howSteps: ["Choose your therapist", "Book and pay by Visa", "Connect on WhatsApp"],
    howBodies: [
      "Browse licensed African therapists. Share language preference (English or Swahili where available).",
      "Video about TZS 52,000 or chat about TZS 21,000. Your card confirms the final shilling conversion.",
      "Join by WhatsApp video or voice. No clinic trip. Private from home or a quiet office.",
    ],
    paymentHowTitle: "How payment works in Tanzania",
    paymentHowSteps: [
      "Select video (~TZS 52,000) or chat (~TZS 21,000)",
      "Pay by Visa / card on the secure page",
      "Confirm the converted amount with your bank",
      "Message WhatsApp if you need booking confirmation",
    ],
    paymentTip: "Need lower commitment first? Start with chat at about TZS 21,000, then move to video.",
    offerCompare: "One private video session can cost less than the time and travel of hunting for the right clinic.",
    concerns: ["Work and business pressure", "Family responsibilities", "Relationship concerns", "Student and exam stress", "Grief and life changes", "Anxiety and low mood"],
    cities: [
      { id: "dar", city: "Dar es Salaam", body: "Private online sessions for professionals in Masaki, Mikocheni, CBD and beyond.", kw: "Therapist in Dar es Salaam" },
      { id: "arusha", city: "Arusha", body: "Confidential care without travelling to a public waiting room.", kw: "Counsellor in Arusha" },
      { id: "mwanza", city: "Mwanza", body: "Licensed African therapists online. Book, pay by Visa, meet on WhatsApp.", kw: "Therapy in Mwanza" },
      { id: "dodoma", city: "Dodoma", body: "Discreet support for people who want real therapy, not free tip sheets.", kw: "Therapist in Dodoma" },
      { id: "zanzibar", city: "Zanzibar", body: "Private online sessions when local options feel limited or too public.", kw: "Counselling in Zanzibar" },
      { id: "nationwide", city: "Across Tanzania", body: "If you have a phone and a private space, you can book this week.", kw: "Online therapy Tanzania" },
    ],
    testimonials: [
      { quote: "I wanted a real therapist, not a free chat. The price was clear in shillings and the session stayed private.", who: "Professional, Dar es Salaam" },
      { quote: "Booking took minutes. WhatsApp video worked from home. No one at work needed to know.", who: "Business owner, Arusha" },
      { quote: "I asked for Swahili preference and got someone who understood family pressure.", who: "Client, Mwanza" },
    ],
    faqs: [
      { q: "How much does online therapy cost in Tanzania?", a: "Video is about TZS 52,000 and chat about TZS 21,000 per session. Your bank confirms the final shilling amount." },
      { q: "Can I get a therapist in Dar es Salaam online?", a: "Yes. Book a licensed African therapist by video or WhatsApp — no clinic trip from Masaki, Mikocheni or CBD." },
      { q: "Can I request a Swahili-speaking therapist?", a: "Yes. Share your language preference at booking and we match where a suitable therapist is available." },
      { q: "Do I need to travel to the city for counselling?", a: "No. Sessions are online — video, voice or chat from any private room with a phone connection." },
      { q: "What if I book and hear nothing?", a: "Message WhatsApp +256 792 085 773. We follow up on payments and session times." },
      { q: "Is this emergency care?", a: "No. Contact local emergency services if you are in immediate danger." },
    ],
    related: [
      { to: "/online-therapy-africa", label: "Online therapy across Africa", tag: "Coverage", blurb: "How online sessions work beyond one city." },
      { to: "/specialists", label: "Browse African therapists", tag: "Therapists", blurb: "Licensed profiles before you pay." },
    ],
    finalCta: "Book my first session — from TZS 52,000",
    whatsappPrefill: "Hi InnerSpark, I want to book licensed therapy in Tanzania. Please confirm price and availability.",
    schemaCities: ["Dar es Salaam", "Arusha", "Mwanza"],
  },
  ghana: {
    slug: "ghana",
    countryLabel: "Ghana",
    code: "GH",
    flag: "GH",
    currency: "GHS",
    videoPrice: "GHS 235",
    videoAmount: 235,
    chatPrice: "GHS 95",
    monthlyPrice: "GHS 880",
    monthlyNote: "4 sessions · about GHS 220 each",
    ugxNote: "~UGX 75,000 · ~$22",
    citiesLine: "Accra, Kumasi, Takoradi and across Ghana",
    title: "Book Online Therapy Ghana | Therapist Accra from ~GHS 235",
    description: "How much does therapy cost in Ghana? Video ~GHS 235 · chat ~GHS 95. Book a licensed therapist in Accra, Kumasi or online. Visa. WhatsApp +256 792 085 773.",
    h1: "Book online therapy in Ghana. From ~GHS 235.",
    h1Line2: "Accra · Kumasi · Takoradi. Private. Visa ready.",
    introLine1: "For professionals ready to invest in confidential care.",
    introLine2: "From about GHS 235 · Pay by Visa · Book in about 2 minutes.",
    paymentLabel: "Visa / card",
    paymentAccepted: ["Visa", "Card"],
    trustPayment: "Visa accepted",
    problemHeadline: "Faith, family and professional image matter — so many delay care until silence costs more than a session.",
    problemSource: "Paid, licensed support for people who can afford to start",
    problemBody: [
      "You may already know free tips. What you need is a private licensed therapist, a cedi price you can plan for, and a booking path that does not expose you at a clinic.",
      "InnerSpark is for adults ready to pay for video or chat therapy with African therapists who respect faith, family and privacy.",
    ],
    howHeadline: "From Accra to Kumasi — therapy from your phone in 3 steps.",
    howSteps: ["Choose your therapist", "Book and pay by Visa", "Connect on WhatsApp"],
    howBodies: [
      "Browse licensed African therapists. Share if faith-aware care matters.",
      "Video about GHS 235 or chat about GHS 95. Your card confirms the final cedi conversion.",
      "Join by WhatsApp video or voice from a private room.",
    ],
    paymentHowTitle: "How payment works in Ghana",
    paymentHowSteps: [
      "Choose video (~GHS 235) or chat (~GHS 95)",
      "Pay by Visa / card",
      "Confirm conversion with your bank",
      "WhatsApp us if you need receipt matching",
    ],
    paymentTip: "Chat at about GHS 95 is a lower-cost paid start; video is for deeper face-to-face work.",
    offerCompare: "A clear cedi price for licensed care — without public waiting rooms or vague contact-us pricing.",
    concerns: ["Work stress and burnout", "University and exam pressure", "Faith and emotional wellbeing", "Relationship concerns", "Grief and family change", "Anxiety and low mood"],
    cities: [
      { id: "accra", city: "Accra", body: "Private sessions for professionals across Accra. Clear pricing. WhatsApp video.", kw: "Therapist in Accra" },
      { id: "kumasi", city: "Kumasi", body: "Licensed online therapy without a clinic trip.", kw: "Counsellor in Kumasi" },
      { id: "takoradi", city: "Takoradi", body: "Confidential care for coastal professionals who want real therapy, not free chat.", kw: "Therapy in Takoradi" },
      { id: "tema", city: "Tema", body: "Book online, pay a clear cedi rate, join from home after work.", kw: "Therapist in Tema" },
      { id: "cape-coast", city: "Cape Coast", body: "Student and professional support with licensed African therapists online.", kw: "Counselling in Cape Coast" },
      { id: "nationwide", city: "Across Ghana", body: "If you can pay for confidential care and have a private space, start this week.", kw: "Online therapy Ghana" },
    ],
    testimonials: [
      { quote: "I wanted someone who respects faith without replacing professional therapy. Clear GHS price.", who: "Professional, Accra" },
      { quote: "No clinic visit. Visa payment. WhatsApp video. That combination finally made booking feel doable.", who: "Entrepreneur, Kumasi" },
      { quote: "I was tired of free advice. Paying for a real therapist felt like taking myself seriously.", who: "Client, Takoradi" },
    ],
    faqs: [
      { q: "How much does therapy cost in Ghana?", a: "On InnerSpark, video is about GHS 235 and chat about GHS 95 per session (about one hour of licensed care)." },
      { q: "How do I find a therapist in Accra or Kumasi?", a: "Book online with InnerSpark. Licensed African therapists by video or chat — no clinic queue. Available from Accra, Kumasi, Takoradi and beyond." },
      { q: "How much is 1 hour of therapy?", a: "About GHS 235 for video or GHS 95 for chat therapy." },
      { q: "Can therapy respect my faith and family?", a: "Yes. Tell us faith matters and we aim to match accordingly while keeping professional, confidential care." },
      { q: "Is online counselling private in Ghana?", a: "Yes. Sessions are one-to-one. We do not contact employers or family." },
      { q: "What if I need a follow-up after paying?", a: "WhatsApp +256 792 085 773. We confirm payments and session times." },
      { q: "Is this emergency care?", a: "No. Contact local emergency services if you are in immediate danger." },
    ],
    related: [
      { to: "/blog/cost-of-therapy-in-ghana", label: "Cost of therapy in Ghana", tag: "Therapy costs", blurb: "What to expect before you book a paid session." },
      { to: "/blog/find-a-therapist-in-accra", label: "Find a therapist in Accra", tag: "Finding help", blurb: "Licensing, fit and privacy checks." },
    ],
    finalCta: "Book my first session — from GHS 235",
    whatsappPrefill: "Hi InnerSpark, I want to book licensed therapy in Ghana. Please confirm price and a therapist.",
    schemaCities: ["Accra", "Kumasi", "Takoradi"],
  },
  gambia: {
    slug: "gambia",
    countryLabel: "The Gambia",
    code: "GM",
    flag: "GM",
    currency: "GMD",
    videoPrice: "GMD 1,500",
    videoAmount: 1500,
    chatPrice: "GMD 600",
    monthlyPrice: "GMD 5,600",
    monthlyNote: "4 sessions · about GMD 1,400 each",
    ugxNote: "~UGX 75,000 · ~$22",
    citiesLine: "Banjul, Kanifing, Brikama and across The Gambia",
    title: "Book Online Therapy Gambia | Banjul from ~GMD 1,500",
    description: "How much is online therapy in The Gambia? Video ~GMD 1,500 · chat ~GMD 600. Licensed African therapists — Banjul, Kanifing, Brikama. Private. Visa. WhatsApp +256 792 085 773.",
    h1: "Book online therapy in The Gambia. From ~GMD 1,500.",
    h1Line2: "Banjul · Kanifing · Brikama. Private. Visa ready.",
    introLine1: "For people ready to invest in confidential care.",
    introLine2: "From about GMD 1,500 · Pay by Visa · Book in about 2 minutes.",
    paymentLabel: "Visa / card",
    paymentAccepted: ["Visa", "Card"],
    trustPayment: "Visa accepted",
    problemHeadline: "In a close-knit country, privacy is the product — limited local choice should not block people who can pay.",
    problemSource: "Wider African therapist network · clear dalasi pricing",
    problemBody: [
      "When everyone knows everyone, walking into a clinic can feel impossible. Free hotlines do not solve that.",
      "InnerSpark gives you a wider licensed network, a clear price and WhatsApp access — without a public waiting room.",
    ],
    howHeadline: "From Banjul to Brikama — therapy from your phone in 3 steps.",
    howSteps: ["Choose your therapist", "Book and pay by Visa", "Connect on WhatsApp"],
    howBodies: [
      "Access a wider African licensed network than local walk-in options alone.",
      "Video about GMD 1,500 or chat about GMD 600. Your bank confirms conversion.",
      "Private video or voice from a room you choose. No clinic exposure.",
    ],
    paymentHowTitle: "How payment works in The Gambia",
    paymentHowSteps: [
      "Choose video (~GMD 1,500) or chat (~GMD 600)",
      "Pay by Visa / card",
      "Confirm dalasi conversion with your bank",
      "WhatsApp us for booking confirmation if needed",
    ],
    paymentTip: "Chat at about GMD 600 is a paid, private first step when video feels like too much on day one.",
    offerCompare: "More therapist choice than a small local directory — with privacy and a price you can plan for.",
    concerns: ["Family and relationship pressure", "Migration and separation", "Grief and loss", "Work and money stress", "Anxiety and loneliness", "Confidential personal support"],
    cities: [
      { id: "banjul", city: "Banjul", body: "Private online therapy without being seen at a local clinic.", kw: "Therapist in Banjul" },
      { id: "kanifing", city: "Kanifing", body: "Licensed African therapists online. Book, pay by Visa, meet on WhatsApp.", kw: "Counsellor in Kanifing" },
      { id: "brikama", city: "Brikama", body: "Confidential care when local options feel too public or limited.", kw: "Therapy in Brikama" },
      { id: "serekunda", city: "Serekunda", body: "Discreet paid support for adults ready to invest in real sessions.", kw: "Therapist near Serekunda" },
      { id: "brusubi", city: "Brusubi", body: "Join from home. Licensed therapists. Clear price.", kw: "Online counselling Brusubi" },
      { id: "nationwide", city: "Across The Gambia", body: "If you can pay for private care and have a quiet room, start this week.", kw: "Online therapy Gambia" },
    ],
    testimonials: [
      { quote: "Privacy mattered more than anything. Online booking with a clear price finally felt safe.", who: "Professional, Banjul" },
      { quote: "I did not want a free chat line. I wanted a licensed therapist.", who: "Client, Kanifing" },
      { quote: "WhatsApp session, Visa payment, no waiting room. Simple and serious.", who: "Business owner, Brikama" },
    ],
    faqs: [
      { q: "How much is online therapy in The Gambia?", a: "Video about GMD 1,500 and chat about GMD 600 per session with a licensed African therapist." },
      { q: "Where can I find a therapist in Banjul without a public clinic?", a: "Book InnerSpark online. Join by WhatsApp video from a private room — no waiting room exposure." },
      { q: "Why online instead of local only?", a: "A wider licensed African network plus privacy in a close-knit setting." },
      { q: "How do I book and pay?", a: "Book in about two minutes, pay by Visa/card, then receive session details on WhatsApp." },
      { q: "What if nobody follows up after I pay?", a: "Message +256 792 085 773. We confirm payments and session times." },
      { q: "Is this emergency care?", a: "No. Use local emergency services if you are in immediate danger." },
    ],
    related: [
      { to: "/online-therapy-africa", label: "Online therapy across Africa", tag: "Coverage", blurb: "How cross-border private sessions work." },
      { to: "/specialists", label: "Meet our therapists", tag: "Therapists", blurb: "Licensed profiles before you book." },
    ],
    finalCta: "Book my first session — from GMD 1,500",
    whatsappPrefill: "Hi InnerSpark, I want to book licensed therapy in The Gambia. Please confirm price and availability.",
    schemaCities: ["Banjul", "Kanifing", "Brikama"],
  },
  usa: {
    slug: "usa",
    countryLabel: "United States",
    code: "US",
    flag: "US",
    currency: "USD",
    videoPrice: "USD 22",
    videoAmount: 22,
    chatPrice: "USD 9",
    monthlyPrice: "USD 80",
    monthlyNote: "4 sessions · about USD 20 each",
    ugxNote: "~UGX 75,000 video · UGX 30,000 chat",
    citiesLine: "Adults, students and families of every background across the United States",
    title: "Book Online Therapy USA | Licensed African Therapists from ~USD 22",
    description: "Online therapy in the USA open to everyone, with licensed African therapists. Video ~USD 22 · chat ~USD 9. Every race, culture and nationality welcome. Visa. WhatsApp +256 792 085 773.",
    h1: "Book online therapy in the USA. From ~USD 22.",
    h1Line2: "Open to everyone. Licensed African therapists. Visa ready.",
    introLine1: "Confidential care for adults of every race, background, culture and nationality.",
    introLine2: "From about USD 22 · Pay by Visa · Book in about 2 minutes.",
    paymentLabel: "Visa / card",
    paymentAccepted: ["Visa", "Card"],
    trustPayment: "Visa accepted",
    problemHeadline: "Whatever you are carrying, you should not have to face it alone.",
    problemSource: "Professional care open to every background",
    problemBody: [
      "You can talk about anxiety, depression, relationships, work pressure, grief, identity or major life changes. Migration stress, family obligations and living between cultures are welcome too, but you do not need to be African to belong here.",
      "InnerSpark connects clients of every race and nationality with licensed African therapists at a clear USD rate. You book, pay and meet on WhatsApp video or chat.",
    ],
    howHeadline: "From any US city — confidential therapy in 3 steps.",
    howSteps: ["Choose your therapist", "Book and pay by Visa", "Connect on WhatsApp"],
    howBodies: [
      "Choose from licensed African therapists who welcome every background and understand diaspora life, family duty and living between cultures.",
      "Video about USD 22 or chat about USD 9. Transparent pricing before you commit.",
      "Join by video or voice on an app you already use. Private from home after work.",
    ],
    paymentHowTitle: "How payment works in the USA",
    paymentHowSteps: [
      "Choose video (~USD 22) or chat (~USD 9)",
      "Pay by Visa / card",
      "Receive WhatsApp confirmation and session time",
      "Message us if anything needs follow-up",
    ],
    paymentTip: "This is cross-border wellbeing support with African therapists — not a US emergency or insurance product.",
    offerCompare: "A clear USD price for professional care with licensed African therapists — open to every client, whatever your background.",
    concerns: ["Anxiety and depression", "Identity and belonging", "Relationships and family pressure", "Workplace stress and burnout", "Grief and life changes", "Migration and cultural adjustment"],
    cities: [
      { id: "nyc", city: "New York", body: "Private online therapy for adults of every background in NYC, with a clear USD rate.", kw: "Online therapy New York" },
      { id: "houston", city: "Houston", body: "Private WhatsApp video for every client, with African cultural understanding available.", kw: "Online therapy Houston" },
      { id: "atlanta", city: "Atlanta", body: "Licensed African therapists online. Pay by Visa. Join after work from home.", kw: "Online counsellor Atlanta" },
      { id: "dc", city: "Washington DC", body: "Confidential care for professionals balancing career, family, identity and life changes.", kw: "Online therapy Washington DC" },
      { id: "chicago", city: "Chicago", body: "Students and professionals of every background — clear pricing and private sessions.", kw: "Online therapy Chicago" },
      { id: "nationwide", city: "Across the USA", body: "Whatever your race, nationality or background, you can book confidential online therapy this week.", kw: "Online therapy USA" },
    ],
    testimonials: [
      { quote: "I stopped paying to educate my therapist about African family duty. Here they already knew the terrain.", who: "Professional, New York" },
      { quote: "Clear USD price. WhatsApp video after work. It felt serious, not like a free chatbot.", who: "Graduate student, Texas" },
      { quote: "I wanted cultural fit and a real booking path. That is exactly what I got.", who: "Client, Georgia" },
    ],
    faqs: [
      { q: "How much does InnerSpark cost in the USA?", a: "Video about USD 22 and chat about USD 9 per session." },
      { q: "Is this a US emergency or insurance service?", a: "No. Cross-border support with African therapists. For crisis in the US, call or text 988." },
      { q: "Who can book?", a: "Everyone. You do not need to be African or part of the diaspora. We welcome clients of every race, including white clients, and every nationality, culture and background." },
      { q: "Will you follow up after I book?", a: "Yes. WhatsApp +256 792 085 773 for payment and scheduling confirmation." },
    ],
    related: [
      { to: "/online-therapy-diaspora", label: "Online therapy with African therapists", tag: "Diaspora", blurb: "Professional care open to every background." },
      { to: "/specialists", label: "Meet African therapists", tag: "Therapists", blurb: "Licensed profiles before you pay." },
    ],
    finalCta: "Book my first session — from USD 22",
    whatsappPrefill: "Hi InnerSpark, I am in the USA and want to book licensed online therapy. Please confirm price and time zones.",
    schemaCities: ["New York", "Houston", "Atlanta"],
  },
  rwanda: {
    "slug": "rwanda",
    "countryLabel": "Rwanda",
    "code": "RW",
    "flag": "RW",
    "currency": "RWF",
    "videoPrice": "RWF 31,000",
    "videoAmount": 31000,
    "chatPrice": "RWF 12,500",
    "monthlyPrice": "RWF 115,000",
    "monthlyNote": "4 sessions · about RWF 28,750 each",
    "ugxNote": "~UGX 75,000 · ~$22",
    "citiesLine": "Kigali, Huye, Musanze, Rubavu and across Rwanda",
    "title": "Book Online Therapy Rwanda | Therapist in Kigali from ~RWF 31,000",
    "description": "Online therapy in Rwanda: licensed therapists for trauma, grief, anxiety, depression and relationships. Video ~RWF 31,000 · chat ~RWF 12,500. Kigali and nationwide. WhatsApp +256 792 085 773.",
    "h1": "Book a therapist online in Rwanda. From ~RWF 31,000.",
    "h1Line2": "Kigali · Huye · Musanze. Trauma-informed. Private.",
    "introLine1": "For people ready to invest in confidential, licensed care.",
    "introLine2": "From about RWF 31,000 · Pay by Visa / card · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Grief, trauma and the pressure to stay strong can sit quietly for years — even in a busy, high-achieving life in Kigali.",
    "problemSource": "Common reasons people in Rwanda reach out",
    "problemBody": [
      "Many people carry loss, family trauma or relationship strain while working hard, studying or raising a family. Speaking to someone outside your circle can feel safer.",
      "InnerSpark connects you with licensed, trauma-informed African therapists by video or chat, at a clear price and without a public waiting room."
    ],
    "howHeadline": "From anywhere in Rwanda — therapy from your phone in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language. Pick who feels right.",
      "Video about RWF 31,000 or chat about RWF 12,500. Your card confirms the final RWF conversion.",
      "Your therapist sends a WhatsApp video or voice link. No new app, no waiting room."
    ],
    "paymentHowTitle": "How payment works in Rwanda",
    "paymentHowSteps": [
      "Choose video (~RWF 31,000) or chat (~RWF 12,500) when you book",
      "Pay by Visa / international card on the secure payment page",
      "Your bank shows the final RWF amount before you confirm",
      "Keep your receipt and message WhatsApp if we need to match payment"
    ],
    "paymentTip": "Prefer a lower-cost start? Begin with chat at about RWF 12,500, then move to video.",
    "offerCompare": "One clear price for a licensed therapist — no travel, no queue and no one seeing you walk into a clinic.",
    "concerns": [
      "Trauma and painful memories",
      "Grief and loss",
      "Anxiety and overthinking",
      "Depression and low mood",
      "Relationship and family conflict",
      "Work and study pressure"
    ],
    "cities": [
      {
        "id": "kigali",
        "city": "Kigali",
        "body": "Private sessions from Kimihurura, Kacyiru, Nyarutarama or anywhere in Kigali — evenings included.",
        "kw": "Therapist in Kigali"
      },
      {
        "id": "huye",
        "city": "Huye",
        "body": "Students and staff can book discreet licensed care online.",
        "kw": "Counselling in Huye"
      },
      {
        "id": "musanze",
        "city": "Musanze",
        "body": "Licensed therapy without travelling to Kigali.",
        "kw": "Therapy in Musanze"
      },
      {
        "id": "across-rwanda",
        "city": "Across Rwanda",
        "body": "If you have a phone and data, you can book this week.",
        "kw": "Online therapy Rwanda"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does therapy cost in Rwanda?",
        "a": "On InnerSpark, video therapy is about RWF 31,000 per session and chat therapy about RWF 12,500. Your card confirms the final amount."
      },
      {
        "q": "Do you offer trauma-informed therapy?",
        "a": "Yes. You can choose a therapist experienced in trauma, grief and loss, and share your preferences when you book."
      },
      {
        "q": "Can I find a therapist in Kigali online?",
        "a": "Yes. Book online and meet your therapist by WhatsApp video or chat from anywhere in Kigali or Rwanda."
      },
      {
        "q": "Is it confidential?",
        "a": "Yes. Sessions are one-to-one and private. We never contact employers or family."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. InnerSpark is not emergency care. If you are in immediate danger, contact local emergency services."
      }
    ],
    "related": [
      {
        "to": "/specialists",
        "label": "Meet our licensed therapists",
        "tag": "Therapists",
        "blurb": "See profiles before you pay."
      },
      {
        "to": "/wellbeing-check",
        "label": "Free 2-minute wellbeing check",
        "tag": "Self-check",
        "blurb": "A private snapshot before you book."
      }
    ],
    "finalCta": "Book my first session — from RWF 31,000",
    "whatsappPrefill": "Hi InnerSpark, I am in Rwanda and want to book licensed therapy. Please confirm price and a therapist.",
    "schemaCities": [
      "Kigali",
      "Huye",
      "Musanze"
    ]
  },
  botswana: {
    "slug": "botswana",
    "countryLabel": "Botswana",
    "code": "BW",
    "flag": "BW",
    "currency": "BWP",
    "videoPrice": "BWP 300",
    "videoAmount": 300,
    "chatPrice": "BWP 120",
    "monthlyPrice": "BWP 1,100",
    "monthlyNote": "4 sessions · about BWP 275 each",
    "ugxNote": "~UGX 75,000 · ~$22",
    "citiesLine": "Gaborone, Francistown, Maun and across Botswana",
    "title": "Book Online Therapy Botswana | Counsellor in Gaborone from ~BWP 300",
    "description": "Online counselling in Botswana for relationships, grief, depression, stress and alcohol worries. Video ~BWP 300 · chat ~BWP 120. Licensed therapists. WhatsApp +256 792 085 773.",
    "h1": "Book a counsellor online in Botswana. From ~BWP 300.",
    "h1Line2": "Gaborone · Francistown · Maun. Private. Visa ready.",
    "introLine1": "For people ready to invest in confidential, licensed care.",
    "introLine2": "From about BWP 300 · Pay by Visa / card · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Relationship strain, grief and the pressure to meet family expectations can feel lonely when everyone seems to know everyone.",
    "problemSource": "Common reasons people in Botswana reach out",
    "problemBody": [
      "Loneliness, money pressure, family breakdown and drinking worries often stay hidden. Many people want help but not from someone in their own community.",
      "InnerSpark gives you a licensed African therapist outside your circle, by video or chat, at a clear pula price."
    ],
    "howHeadline": "From anywhere in Botswana — therapy from your phone in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language. Pick who feels right.",
      "Video about BWP 300 or chat about BWP 120. Your card confirms the final BWP conversion.",
      "Your therapist sends a WhatsApp video or voice link. No new app, no waiting room."
    ],
    "paymentHowTitle": "How payment works in Botswana",
    "paymentHowSteps": [
      "Choose video (~BWP 300) or chat (~BWP 120) when you book",
      "Pay by Visa / international card on the secure payment page",
      "Your bank shows the final BWP amount before you confirm",
      "Keep your receipt and message WhatsApp if we need to match payment"
    ],
    "paymentTip": "Prefer a lower-cost start? Begin with chat at about BWP 120, then move to video.",
    "offerCompare": "One clear price for a licensed therapist — no travel, no queue and no one seeing you walk into a clinic.",
    "concerns": [
      "Relationship and marriage difficulties",
      "Grief and bereavement",
      "Depression and loneliness",
      "Stress and anxiety",
      "Alcohol and substance worries",
      "Parenting challenges"
    ],
    "cities": [
      {
        "id": "gaborone",
        "city": "Gaborone",
        "body": "Private sessions from home or office anywhere in Gaborone — evenings included.",
        "kw": "Counsellor in Gaborone"
      },
      {
        "id": "francistown",
        "city": "Francistown",
        "body": "Licensed therapy without a long trip or a public waiting room.",
        "kw": "Therapist in Francistown"
      },
      {
        "id": "maun",
        "city": "Maun",
        "body": "Discreet online support wherever you are.",
        "kw": "Counselling in Maun"
      },
      {
        "id": "across-botswana",
        "city": "Across Botswana",
        "body": "If you have a phone and data, you can book this week.",
        "kw": "Online therapy Botswana"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does counselling cost in Botswana?",
        "a": "On InnerSpark, video therapy is about BWP 300 per session and chat therapy about BWP 120. Your card confirms the final amount."
      },
      {
        "q": "Do you offer couples counselling?",
        "a": "Yes. Couples sessions are available by video; we confirm the price when you book."
      },
      {
        "q": "Can you help with alcohol worries?",
        "a": "Our therapists can support you with stress, low mood and drinking habits, and suggest local services when more specialised care is needed."
      },
      {
        "q": "Is it confidential?",
        "a": "Yes. Sessions are private and one-to-one."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. InnerSpark is not emergency care. If you are in immediate danger, contact local emergency services."
      }
    ],
    "related": [
      {
        "to": "/specialists",
        "label": "Meet our licensed therapists",
        "tag": "Therapists",
        "blurb": "See profiles before you pay."
      },
      {
        "to": "/wellbeing-check",
        "label": "Free 2-minute wellbeing check",
        "tag": "Self-check",
        "blurb": "A private snapshot before you book."
      }
    ],
    "finalCta": "Book my first session — from BWP 300",
    "whatsappPrefill": "Hi InnerSpark, I am in Botswana and want to book licensed therapy. Please confirm price and a therapist.",
    "schemaCities": [
      "Gaborone",
      "Francistown",
      "Maun"
    ]
  },
  namibia: {
    "slug": "namibia",
    "countryLabel": "Namibia",
    "code": "NA",
    "flag": "NA",
    "currency": "NAD",
    "videoPrice": "NAD 400",
    "videoAmount": 400,
    "chatPrice": "NAD 160",
    "monthlyPrice": "NAD 1,480",
    "monthlyNote": "4 sessions · about NAD 370 each",
    "ugxNote": "~UGX 75,000 · ~$22",
    "citiesLine": "Windhoek, Walvis Bay, Swakopmund, Oshakati and across Namibia",
    "title": "Book Online Therapy Namibia | Therapist in Windhoek from ~NAD 400",
    "description": "Online therapy in Namibia for depression, anxiety, grief, burnout and relationships. Video ~NAD 400 · chat ~NAD 160. Licensed therapists, Windhoek and remote towns. WhatsApp +256 792 085 773.",
    "h1": "Book a therapist online in Namibia. From ~NAD 400.",
    "h1Line2": "Windhoek · Walvis Bay · Oshakati. Private. Visa ready.",
    "introLine1": "For people ready to invest in confidential, licensed care.",
    "introLine2": "From about NAD 400 · Pay by Visa / card · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Long distances and few local therapists mean many people in Namibia carry stress, grief or low mood alone.",
    "problemSource": "Common reasons people in Namibia reach out",
    "problemBody": [
      "Outside Windhoek, finding a private therapist can mean hours of travel. Economic pressure, family conflict and isolation make it harder still.",
      "InnerSpark brings licensed African therapists to your phone by video or chat, at a clear Namibian dollar price."
    ],
    "howHeadline": "From anywhere in Namibia — therapy from your phone in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language. Pick who feels right.",
      "Video about NAD 400 or chat about NAD 160. Your card confirms the final NAD conversion.",
      "Your therapist sends a WhatsApp video or voice link. No new app, no waiting room."
    ],
    "paymentHowTitle": "How payment works in Namibia",
    "paymentHowSteps": [
      "Choose video (~NAD 400) or chat (~NAD 160) when you book",
      "Pay by Visa / international card on the secure payment page",
      "Your bank shows the final NAD amount before you confirm",
      "Keep your receipt and message WhatsApp if we need to match payment"
    ],
    "paymentTip": "Prefer a lower-cost start? Begin with chat at about NAD 160, then move to video.",
    "offerCompare": "One clear price for a licensed therapist — no travel, no queue and no one seeing you walk into a clinic.",
    "concerns": [
      "Depression and anxiety",
      "Stress and burnout",
      "Grief and loss",
      "Relationship difficulties",
      "Family conflict",
      "Loneliness and adjustment"
    ],
    "cities": [
      {
        "id": "windhoek",
        "city": "Windhoek",
        "body": "Private sessions from Klein Windhoek, Eros, Olympia or anywhere in the capital.",
        "kw": "Therapist in Windhoek"
      },
      {
        "id": "walvis-bay",
        "city": "Walvis Bay",
        "body": "Licensed therapy online — no trip to Windhoek needed.",
        "kw": "Counselling in Walvis Bay"
      },
      {
        "id": "oshakati",
        "city": "Oshakati",
        "body": "Discreet support for the north without long travel.",
        "kw": "Therapy in Oshakati"
      },
      {
        "id": "across-namibia",
        "city": "Across Namibia",
        "body": "If you have a phone and data, you can book this week.",
        "kw": "Online therapy Namibia"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does therapy cost in Namibia?",
        "a": "On InnerSpark, video therapy is about NAD 400 per session and chat therapy about NAD 160. Your card confirms the final amount."
      },
      {
        "q": "Can I get therapy outside Windhoek?",
        "a": "Yes. Sessions are online, so you can join from any town with a phone and data."
      },
      {
        "q": "What can I talk about?",
        "a": "Depression, anxiety, burnout, grief, relationships, family conflict and more."
      },
      {
        "q": "Is it confidential?",
        "a": "Yes. Sessions are private and one-to-one."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. InnerSpark is not emergency care. If you are in immediate danger, contact local emergency services."
      }
    ],
    "related": [
      {
        "to": "/specialists",
        "label": "Meet our licensed therapists",
        "tag": "Therapists",
        "blurb": "See profiles before you pay."
      },
      {
        "to": "/wellbeing-check",
        "label": "Free 2-minute wellbeing check",
        "tag": "Self-check",
        "blurb": "A private snapshot before you book."
      }
    ],
    "finalCta": "Book my first session — from NAD 400",
    "whatsappPrefill": "Hi InnerSpark, I am in Namibia and want to book licensed therapy. Please confirm price and a therapist.",
    "schemaCities": [
      "Windhoek",
      "Walvis Bay",
      "Oshakati"
    ]
  },
  "canada": {
    "slug": "canada",
    "countryLabel": "Canada",
    "code": "CA",
    "flag": "CA",
    "currency": "CAD",
    "videoPrice": "CAD 30",
    "videoAmount": 30,
    "chatPrice": "CAD 12",
    "monthlyPrice": "CAD 111",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Toronto, Calgary, Vancouver and across Canada",
    "title": "Online Therapy in Canada | Toronto from ~CAD 30",
    "description": "Licensed African therapists welcome clients of every background in Canada: anxiety and depression, loneliness and isolation, relationship problems, immigration and cultural adjustment. Video ~CAD 30 · chat ~CAD 12. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Canada. From ~CAD 30.",
    "h1Line2": "Toronto · Calgary · Vancouver. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about CAD 30 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Canada can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Canada seek therapy",
    "problemBody": [
      "People in Canada most often seek therapy for anxiety and depression, loneliness and isolation, relationship problems, immigration and cultural adjustment. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear CAD price, by video or chat."
    ],
    "howHeadline": "From anywhere in Canada — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about CAD 30 or chat about CAD 12. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Canada",
    "paymentHowSteps": [
      "Choose video (~CAD 30) or chat (~CAD 12)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Canada emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Loneliness and isolation",
      "Relationship problems",
      "Immigration and cultural adjustment",
      "Workplace stress",
      "Grief and bereavement"
    ],
    "cities": [
      {
        "id": "toronto",
        "city": "Toronto",
        "body": "Private online sessions with a licensed African therapist from anywhere in Toronto — evenings included.",
        "kw": "African therapist Toronto"
      },
      {
        "id": "calgary",
        "city": "Calgary",
        "body": "Private online sessions with a licensed African therapist from anywhere in Calgary — evenings included.",
        "kw": "African therapist Calgary"
      },
      {
        "id": "vancouver",
        "city": "Vancouver",
        "body": "Private online sessions with a licensed African therapist from anywhere in Vancouver — evenings included.",
        "kw": "African therapist Vancouver"
      },
      {
        "id": "ottawa",
        "city": "Ottawa",
        "body": "Private online sessions with a licensed African therapist from anywhere in Ottawa — evenings included.",
        "kw": "African therapist Ottawa"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Canada?",
        "a": "Video therapy is about CAD 30 and chat therapy about CAD 12 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Loneliness and isolation, Relationship problems, Immigration and cultural adjustment, Workplace stress, Grief and bereavement."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Canada."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Canada, call or text 988."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from CAD 30",
    "whatsappPrefill": "Hi InnerSpark, I am in Canada and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Toronto",
      "Calgary",
      "Vancouver"
    ]
  },
  "uk": {
    "slug": "uk",
    "countryLabel": "United Kingdom",
    "code": "GB",
    "flag": "GB",
    "currency": "GBP",
    "videoPrice": "GBP 18",
    "videoAmount": 18,
    "chatPrice": "GBP 7",
    "monthlyPrice": "GBP 67",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in London, Manchester, Birmingham and across the United Kingdom",
    "title": "Online Therapy in the UK | London from ~GBP 18",
    "description": "Licensed African therapists welcome clients of every background in the United Kingdom: anxiety and depression, relationship and marriage problems, workplace burnout, childhood trauma. Video ~GBP 18 · chat ~GBP 7. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in the United Kingdom. From ~GBP 18.",
    "h1Line2": "London · Manchester · Birmingham. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about GBP 18 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in the United Kingdom can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in the United Kingdom seek therapy",
    "problemBody": [
      "People in the United Kingdom most often seek therapy for anxiety and depression, relationship and marriage problems, workplace burnout, childhood trauma. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear GBP price, by video or chat."
    ],
    "howHeadline": "From anywhere in the United Kingdom — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about GBP 18 or chat about GBP 7. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in the United Kingdom",
    "paymentHowSteps": [
      "Choose video (~GBP 18) or chat (~GBP 7)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a United Kingdom emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Relationship and marriage problems",
      "Workplace burnout",
      "Childhood trauma",
      "Grief and bereavement",
      "Low self-esteem"
    ],
    "cities": [
      {
        "id": "london",
        "city": "London",
        "body": "Private online sessions with a licensed African therapist from anywhere in London — evenings included.",
        "kw": "African therapist London"
      },
      {
        "id": "manchester",
        "city": "Manchester",
        "body": "Private online sessions with a licensed African therapist from anywhere in Manchester — evenings included.",
        "kw": "African therapist Manchester"
      },
      {
        "id": "birmingham",
        "city": "Birmingham",
        "body": "Private online sessions with a licensed African therapist from anywhere in Birmingham — evenings included.",
        "kw": "African therapist Birmingham"
      },
      {
        "id": "leeds",
        "city": "Leeds",
        "body": "Private online sessions with a licensed African therapist from anywhere in Leeds — evenings included.",
        "kw": "African therapist Leeds"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in the United Kingdom?",
        "a": "Video therapy is about GBP 18 and chat therapy about GBP 7 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Relationship and marriage problems, Workplace burnout, Childhood trauma, Grief and bereavement, Low self-esteem."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in the United Kingdom."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in the United Kingdom, call 999 or Samaritans on 116 123."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from GBP 18",
    "whatsappPrefill": "Hi InnerSpark, I am in United Kingdom and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "London",
      "Manchester",
      "Birmingham"
    ]
  },
  "ireland": {
    "slug": "ireland",
    "countryLabel": "Ireland",
    "code": "IE",
    "flag": "IE",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Dublin, Cork, Galway and across Ireland",
    "title": "Online Therapy in Ireland | Dublin from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in Ireland: anxiety and depression, relationship difficulties, loneliness, grief. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Ireland. From ~EUR 20.",
    "h1Line2": "Dublin · Cork · Galway. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Ireland can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Ireland seek therapy",
    "problemBody": [
      "People in Ireland most often seek therapy for anxiety and depression, relationship difficulties, loneliness, grief. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in Ireland — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Ireland",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Ireland emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Relationship difficulties",
      "Loneliness",
      "Grief",
      "Family conflict",
      "Alcohol-related difficulties"
    ],
    "cities": [
      {
        "id": "dublin",
        "city": "Dublin",
        "body": "Private online sessions with a licensed African therapist from anywhere in Dublin — evenings included.",
        "kw": "African therapist Dublin"
      },
      {
        "id": "cork",
        "city": "Cork",
        "body": "Private online sessions with a licensed African therapist from anywhere in Cork — evenings included.",
        "kw": "African therapist Cork"
      },
      {
        "id": "galway",
        "city": "Galway",
        "body": "Private online sessions with a licensed African therapist from anywhere in Galway — evenings included.",
        "kw": "African therapist Galway"
      },
      {
        "id": "limerick",
        "city": "Limerick",
        "body": "Private online sessions with a licensed African therapist from anywhere in Limerick — evenings included.",
        "kw": "African therapist Limerick"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Ireland?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Relationship difficulties, Loneliness, Grief, Family conflict, Alcohol-related difficulties."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Ireland."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Ireland, call 112 or 999."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Ireland and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Dublin",
      "Cork",
      "Galway"
    ]
  },
  "germany": {
    "slug": "germany",
    "countryLabel": "Germany",
    "code": "DE",
    "flag": "DE",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Berlin, Hamburg, Frankfurt and across Germany",
    "title": "Online Therapy in Germany | Berlin from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in Germany: depression, anxiety disorders, workplace burnout, social anxiety. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Germany. From ~EUR 20.",
    "h1Line2": "Berlin · Hamburg · Frankfurt. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Germany can be good on paper — and still leave you carrying depression alone.",
    "problemSource": "Common reasons people in Germany seek therapy",
    "problemBody": [
      "People in Germany most often seek therapy for depression, anxiety disorders, workplace burnout, social anxiety. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in Germany — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Germany",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Germany emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Depression",
      "Anxiety disorders",
      "Workplace burnout",
      "Social anxiety",
      "Relationship problems",
      "Trauma and PTSD"
    ],
    "cities": [
      {
        "id": "berlin",
        "city": "Berlin",
        "body": "Private online sessions with a licensed African therapist from anywhere in Berlin — evenings included.",
        "kw": "African therapist Berlin"
      },
      {
        "id": "hamburg",
        "city": "Hamburg",
        "body": "Private online sessions with a licensed African therapist from anywhere in Hamburg — evenings included.",
        "kw": "African therapist Hamburg"
      },
      {
        "id": "frankfurt",
        "city": "Frankfurt",
        "body": "Private online sessions with a licensed African therapist from anywhere in Frankfurt — evenings included.",
        "kw": "African therapist Frankfurt"
      },
      {
        "id": "munich",
        "city": "Munich",
        "body": "Private online sessions with a licensed African therapist from anywhere in Munich — evenings included.",
        "kw": "African therapist Munich"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Germany?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Depression, Anxiety disorders, Workplace burnout, Social anxiety, Relationship problems, Trauma and PTSD."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Germany."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Germany, call 112."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Germany and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Berlin",
      "Hamburg",
      "Frankfurt"
    ]
  },
  "france": {
    "slug": "france",
    "countryLabel": "France",
    "code": "FR",
    "flag": "FR",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Paris, Lyon, Marseille and across France",
    "title": "Online Therapy in France | Paris from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in France: depression and anxiety, relationship difficulties, family conflict, workplace stress. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in France. From ~EUR 20.",
    "h1Line2": "Paris · Lyon · Marseille. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in France can be good on paper — and still leave you carrying depression and anxiety alone.",
    "problemSource": "Common reasons people in France seek therapy",
    "problemBody": [
      "People in France most often seek therapy for depression and anxiety, relationship difficulties, family conflict, workplace stress. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in France — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in France",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a France emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Depression and anxiety",
      "Relationship difficulties",
      "Family conflict",
      "Workplace stress",
      "Emotional dissatisfaction",
      "Grief"
    ],
    "cities": [
      {
        "id": "paris",
        "city": "Paris",
        "body": "Private online sessions with a licensed African therapist from anywhere in Paris — evenings included.",
        "kw": "African therapist Paris"
      },
      {
        "id": "lyon",
        "city": "Lyon",
        "body": "Private online sessions with a licensed African therapist from anywhere in Lyon — evenings included.",
        "kw": "African therapist Lyon"
      },
      {
        "id": "marseille",
        "city": "Marseille",
        "body": "Private online sessions with a licensed African therapist from anywhere in Marseille — evenings included.",
        "kw": "African therapist Marseille"
      },
      {
        "id": "lille",
        "city": "Lille",
        "body": "Private online sessions with a licensed African therapist from anywhere in Lille — evenings included.",
        "kw": "African therapist Lille"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in France?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Depression and anxiety, Relationship difficulties, Family conflict, Workplace stress, Emotional dissatisfaction, Grief."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in France."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in France, call 112 or 3114."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in France and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Paris",
      "Lyon",
      "Marseille"
    ]
  },
  "netherlands": {
    "slug": "netherlands",
    "countryLabel": "Netherlands",
    "code": "NL",
    "flag": "NL",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Amsterdam, Rotterdam, The Hague and across the Netherlands",
    "title": "Online Therapy in Netherlands | Amsterdam from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in the Netherlands: anxiety and depression, burnout, relationship problems, loneliness. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in the Netherlands. From ~EUR 20.",
    "h1Line2": "Amsterdam · Rotterdam · The Hague. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in the Netherlands can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in the Netherlands seek therapy",
    "problemBody": [
      "People in the Netherlands most often seek therapy for anxiety and depression, burnout, relationship problems, loneliness. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in the Netherlands — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in the Netherlands",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Netherlands emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Burnout",
      "Relationship problems",
      "Loneliness",
      "Social anxiety",
      "Work-related stress"
    ],
    "cities": [
      {
        "id": "amsterdam",
        "city": "Amsterdam",
        "body": "Private online sessions with a licensed African therapist from anywhere in Amsterdam — evenings included.",
        "kw": "African therapist Amsterdam"
      },
      {
        "id": "rotterdam",
        "city": "Rotterdam",
        "body": "Private online sessions with a licensed African therapist from anywhere in Rotterdam — evenings included.",
        "kw": "African therapist Rotterdam"
      },
      {
        "id": "the-hague",
        "city": "The Hague",
        "body": "Private online sessions with a licensed African therapist from anywhere in The Hague — evenings included.",
        "kw": "African therapist The Hague"
      },
      {
        "id": "utrecht",
        "city": "Utrecht",
        "body": "Private online sessions with a licensed African therapist from anywhere in Utrecht — evenings included.",
        "kw": "African therapist Utrecht"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in the Netherlands?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Burnout, Relationship problems, Loneliness, Social anxiety, Work-related stress."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in the Netherlands."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in the Netherlands, call 112 or 113."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Netherlands and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Amsterdam",
      "Rotterdam",
      "The Hague"
    ]
  },
  "switzerland": {
    "slug": "switzerland",
    "countryLabel": "Switzerland",
    "code": "CH",
    "flag": "CH",
    "currency": "CHF",
    "videoPrice": "CHF 20",
    "videoAmount": 20,
    "chatPrice": "CHF 8",
    "monthlyPrice": "CHF 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Zurich, Geneva, Basel and across Switzerland",
    "title": "Online Therapy in Switzerland | Zurich from ~CHF 20",
    "description": "Licensed African therapists welcome clients of every background in Switzerland: anxiety and depression, workplace stress, perfectionism, relationship difficulties. Video ~CHF 20 · chat ~CHF 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Switzerland. From ~CHF 20.",
    "h1Line2": "Zurich · Geneva · Basel. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about CHF 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Switzerland can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Switzerland seek therapy",
    "problemBody": [
      "People in Switzerland most often seek therapy for anxiety and depression, workplace stress, perfectionism, relationship difficulties. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear CHF price, by video or chat."
    ],
    "howHeadline": "From anywhere in Switzerland — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about CHF 20 or chat about CHF 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Switzerland",
    "paymentHowSteps": [
      "Choose video (~CHF 20) or chat (~CHF 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Switzerland emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Workplace stress",
      "Perfectionism",
      "Relationship difficulties",
      "Loneliness",
      "Emotional exhaustion"
    ],
    "cities": [
      {
        "id": "zurich",
        "city": "Zurich",
        "body": "Private online sessions with a licensed African therapist from anywhere in Zurich — evenings included.",
        "kw": "African therapist Zurich"
      },
      {
        "id": "geneva",
        "city": "Geneva",
        "body": "Private online sessions with a licensed African therapist from anywhere in Geneva — evenings included.",
        "kw": "African therapist Geneva"
      },
      {
        "id": "basel",
        "city": "Basel",
        "body": "Private online sessions with a licensed African therapist from anywhere in Basel — evenings included.",
        "kw": "African therapist Basel"
      },
      {
        "id": "lausanne",
        "city": "Lausanne",
        "body": "Private online sessions with a licensed African therapist from anywhere in Lausanne — evenings included.",
        "kw": "African therapist Lausanne"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Switzerland?",
        "a": "Video therapy is about CHF 20 and chat therapy about CHF 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Workplace stress, Perfectionism, Relationship difficulties, Loneliness, Emotional exhaustion."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Switzerland."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Switzerland, call 112 or 143."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from CHF 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Switzerland and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Zurich",
      "Geneva",
      "Basel"
    ]
  },
  "belgium": {
    "slug": "belgium",
    "countryLabel": "Belgium",
    "code": "BE",
    "flag": "BE",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Brussels, Antwerp, Ghent and across Belgium",
    "title": "Online Therapy in Belgium | Brussels from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in Belgium: depression and anxiety, relationship difficulties, family conflict, workplace burnout. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Belgium. From ~EUR 20.",
    "h1Line2": "Brussels · Antwerp · Ghent. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Belgium can be good on paper — and still leave you carrying depression and anxiety alone.",
    "problemSource": "Common reasons people in Belgium seek therapy",
    "problemBody": [
      "People in Belgium most often seek therapy for depression and anxiety, relationship difficulties, family conflict, workplace burnout. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in Belgium — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Belgium",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Belgium emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Depression and anxiety",
      "Relationship difficulties",
      "Family conflict",
      "Workplace burnout",
      "Trauma and grief",
      "Social isolation"
    ],
    "cities": [
      {
        "id": "brussels",
        "city": "Brussels",
        "body": "Private online sessions with a licensed African therapist from anywhere in Brussels — evenings included.",
        "kw": "African therapist Brussels"
      },
      {
        "id": "antwerp",
        "city": "Antwerp",
        "body": "Private online sessions with a licensed African therapist from anywhere in Antwerp — evenings included.",
        "kw": "African therapist Antwerp"
      },
      {
        "id": "ghent",
        "city": "Ghent",
        "body": "Private online sessions with a licensed African therapist from anywhere in Ghent — evenings included.",
        "kw": "African therapist Ghent"
      },
      {
        "id": "liege",
        "city": "Liège",
        "body": "Private online sessions with a licensed African therapist from anywhere in Liège — evenings included.",
        "kw": "African therapist Liège"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Belgium?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Depression and anxiety, Relationship difficulties, Family conflict, Workplace burnout, Trauma and grief, Social isolation."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Belgium."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Belgium, call 112."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Belgium and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Brussels",
      "Antwerp",
      "Ghent"
    ]
  },
  "spain": {
    "slug": "spain",
    "countryLabel": "Spain",
    "code": "ES",
    "flag": "ES",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Madrid, Barcelona, Valencia and across Spain",
    "title": "Online Therapy in Spain | Madrid from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in Spain: anxiety and depression, relationship and marital problems, family conflict, low self-esteem. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Spain. From ~EUR 20.",
    "h1Line2": "Madrid · Barcelona · Valencia. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Spain can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Spain seek therapy",
    "problemBody": [
      "People in Spain most often seek therapy for anxiety and depression, relationship and marital problems, family conflict, low self-esteem. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in Spain — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Spain",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Spain emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Relationship and marital problems",
      "Family conflict",
      "Low self-esteem",
      "Loneliness",
      "Work-related stress"
    ],
    "cities": [
      {
        "id": "madrid",
        "city": "Madrid",
        "body": "Private online sessions with a licensed African therapist from anywhere in Madrid — evenings included.",
        "kw": "African therapist Madrid"
      },
      {
        "id": "barcelona",
        "city": "Barcelona",
        "body": "Private online sessions with a licensed African therapist from anywhere in Barcelona — evenings included.",
        "kw": "African therapist Barcelona"
      },
      {
        "id": "valencia",
        "city": "Valencia",
        "body": "Private online sessions with a licensed African therapist from anywhere in Valencia — evenings included.",
        "kw": "African therapist Valencia"
      },
      {
        "id": "seville",
        "city": "Seville",
        "body": "Private online sessions with a licensed African therapist from anywhere in Seville — evenings included.",
        "kw": "African therapist Seville"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Spain?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Relationship and marital problems, Family conflict, Low self-esteem, Loneliness, Work-related stress."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Spain."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Spain, call 112 or 024."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Spain and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Madrid",
      "Barcelona",
      "Valencia"
    ]
  },
  "portugal": {
    "slug": "portugal",
    "countryLabel": "Portugal",
    "code": "PT",
    "flag": "PT",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Lisbon, Porto, Faro and across Portugal",
    "title": "Online Therapy in Portugal | Lisbon from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in Portugal: anxiety and depression, loneliness, relationship difficulties, workplace stress. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Portugal. From ~EUR 20.",
    "h1Line2": "Lisbon · Porto · Faro. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Portugal can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Portugal seek therapy",
    "problemBody": [
      "People in Portugal most often seek therapy for anxiety and depression, loneliness, relationship difficulties, workplace stress. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in Portugal — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Portugal",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Portugal emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Loneliness",
      "Relationship difficulties",
      "Workplace stress",
      "Grief",
      "Family conflict"
    ],
    "cities": [
      {
        "id": "lisbon",
        "city": "Lisbon",
        "body": "Private online sessions with a licensed African therapist from anywhere in Lisbon — evenings included.",
        "kw": "African therapist Lisbon"
      },
      {
        "id": "porto",
        "city": "Porto",
        "body": "Private online sessions with a licensed African therapist from anywhere in Porto — evenings included.",
        "kw": "African therapist Porto"
      },
      {
        "id": "faro",
        "city": "Faro",
        "body": "Private online sessions with a licensed African therapist from anywhere in Faro — evenings included.",
        "kw": "African therapist Faro"
      },
      {
        "id": "braga",
        "city": "Braga",
        "body": "Private online sessions with a licensed African therapist from anywhere in Braga — evenings included.",
        "kw": "African therapist Braga"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Portugal?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Loneliness, Relationship difficulties, Workplace stress, Grief, Family conflict."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Portugal."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Portugal, call 112."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Portugal and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Lisbon",
      "Porto",
      "Faro"
    ]
  },
  "italy": {
    "slug": "italy",
    "countryLabel": "Italy",
    "code": "IT",
    "flag": "IT",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Rome, Milan, Turin and across Italy",
    "title": "Online Therapy in Italy | Rome from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in Italy: anxiety and depression, relationship and marriage problems, family conflict, emotional distress. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Italy. From ~EUR 20.",
    "h1Line2": "Rome · Milan · Turin. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Italy can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Italy seek therapy",
    "problemBody": [
      "People in Italy most often seek therapy for anxiety and depression, relationship and marriage problems, family conflict, emotional distress. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in Italy — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Italy",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Italy emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Relationship and marriage problems",
      "Family conflict",
      "Emotional distress",
      "Work-related stress",
      "Grief and bereavement"
    ],
    "cities": [
      {
        "id": "rome",
        "city": "Rome",
        "body": "Private online sessions with a licensed African therapist from anywhere in Rome — evenings included.",
        "kw": "African therapist Rome"
      },
      {
        "id": "milan",
        "city": "Milan",
        "body": "Private online sessions with a licensed African therapist from anywhere in Milan — evenings included.",
        "kw": "African therapist Milan"
      },
      {
        "id": "turin",
        "city": "Turin",
        "body": "Private online sessions with a licensed African therapist from anywhere in Turin — evenings included.",
        "kw": "African therapist Turin"
      },
      {
        "id": "naples",
        "city": "Naples",
        "body": "Private online sessions with a licensed African therapist from anywhere in Naples — evenings included.",
        "kw": "African therapist Naples"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Italy?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Relationship and marriage problems, Family conflict, Emotional distress, Work-related stress, Grief and bereavement."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Italy."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Italy, call 112."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Italy and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Rome",
      "Milan",
      "Turin"
    ]
  },
  "norway": {
    "slug": "norway",
    "countryLabel": "Norway",
    "code": "NO",
    "flag": "NO",
    "currency": "NOK",
    "videoPrice": "NOK 240",
    "videoAmount": 240,
    "chatPrice": "NOK 95",
    "monthlyPrice": "NOK 888",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Oslo, Bergen, Trondheim and across Norway",
    "title": "Online Therapy in Norway | Oslo from ~NOK 240",
    "description": "Licensed African therapists welcome clients of every background in Norway: depression and anxiety, loneliness, seasonal emotional difficulties, relationship problems. Video ~NOK 240 · chat ~NOK 95. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Norway. From ~NOK 240.",
    "h1Line2": "Oslo · Bergen · Trondheim. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about NOK 240 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Norway can be good on paper — and still leave you carrying depression and anxiety alone.",
    "problemSource": "Common reasons people in Norway seek therapy",
    "problemBody": [
      "People in Norway most often seek therapy for depression and anxiety, loneliness, seasonal emotional difficulties, relationship problems. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear NOK price, by video or chat."
    ],
    "howHeadline": "From anywhere in Norway — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about NOK 240 or chat about NOK 95. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Norway",
    "paymentHowSteps": [
      "Choose video (~NOK 240) or chat (~NOK 95)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Norway emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Depression and anxiety",
      "Loneliness",
      "Seasonal emotional difficulties",
      "Relationship problems",
      "Workplace stress",
      "Family conflict"
    ],
    "cities": [
      {
        "id": "oslo",
        "city": "Oslo",
        "body": "Private online sessions with a licensed African therapist from anywhere in Oslo — evenings included.",
        "kw": "African therapist Oslo"
      },
      {
        "id": "bergen",
        "city": "Bergen",
        "body": "Private online sessions with a licensed African therapist from anywhere in Bergen — evenings included.",
        "kw": "African therapist Bergen"
      },
      {
        "id": "trondheim",
        "city": "Trondheim",
        "body": "Private online sessions with a licensed African therapist from anywhere in Trondheim — evenings included.",
        "kw": "African therapist Trondheim"
      },
      {
        "id": "stavanger",
        "city": "Stavanger",
        "body": "Private online sessions with a licensed African therapist from anywhere in Stavanger — evenings included.",
        "kw": "African therapist Stavanger"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Norway?",
        "a": "Video therapy is about NOK 240 and chat therapy about NOK 95 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Depression and anxiety, Loneliness, Seasonal emotional difficulties, Relationship problems, Workplace stress, Family conflict."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Norway."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Norway, call 113."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from NOK 240",
    "whatsappPrefill": "Hi InnerSpark, I am in Norway and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Oslo",
      "Bergen",
      "Trondheim"
    ]
  },
  "sweden": {
    "slug": "sweden",
    "countryLabel": "Sweden",
    "code": "SE",
    "flag": "SE",
    "currency": "SEK",
    "videoPrice": "SEK 235",
    "videoAmount": 235,
    "chatPrice": "SEK 95",
    "monthlyPrice": "SEK 870",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Stockholm, Gothenburg, Malmö and across Sweden",
    "title": "Online Therapy in Sweden | Stockholm from ~SEK 235",
    "description": "Licensed African therapists welcome clients of every background in Sweden: anxiety and depression, social isolation, relationship difficulties, workplace burnout. Video ~SEK 235 · chat ~SEK 95. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Sweden. From ~SEK 235.",
    "h1Line2": "Stockholm · Gothenburg · Malmö. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about SEK 235 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Sweden can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Sweden seek therapy",
    "problemBody": [
      "People in Sweden most often seek therapy for anxiety and depression, social isolation, relationship difficulties, workplace burnout. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear SEK price, by video or chat."
    ],
    "howHeadline": "From anywhere in Sweden — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about SEK 235 or chat about SEK 95. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Sweden",
    "paymentHowSteps": [
      "Choose video (~SEK 235) or chat (~SEK 95)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Sweden emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Social isolation",
      "Relationship difficulties",
      "Workplace burnout",
      "Family problems",
      "Trauma"
    ],
    "cities": [
      {
        "id": "stockholm",
        "city": "Stockholm",
        "body": "Private online sessions with a licensed African therapist from anywhere in Stockholm — evenings included.",
        "kw": "African therapist Stockholm"
      },
      {
        "id": "gothenburg",
        "city": "Gothenburg",
        "body": "Private online sessions with a licensed African therapist from anywhere in Gothenburg — evenings included.",
        "kw": "African therapist Gothenburg"
      },
      {
        "id": "malmö",
        "city": "Malmö",
        "body": "Private online sessions with a licensed African therapist from anywhere in Malmö — evenings included.",
        "kw": "African therapist Malmö"
      },
      {
        "id": "uppsala",
        "city": "Uppsala",
        "body": "Private online sessions with a licensed African therapist from anywhere in Uppsala — evenings included.",
        "kw": "African therapist Uppsala"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Sweden?",
        "a": "Video therapy is about SEK 235 and chat therapy about SEK 95 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Social isolation, Relationship difficulties, Workplace burnout, Family problems, Trauma."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Sweden."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Sweden, call 112."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from SEK 235",
    "whatsappPrefill": "Hi InnerSpark, I am in Sweden and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Stockholm",
      "Gothenburg",
      "Malmö"
    ]
  },
  "denmark": {
    "slug": "denmark",
    "countryLabel": "Denmark",
    "code": "DK",
    "flag": "DK",
    "currency": "DKK",
    "videoPrice": "DKK 150",
    "videoAmount": 150,
    "chatPrice": "DKK 60",
    "monthlyPrice": "DKK 555",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Copenhagen, Aarhus, Odense and across Denmark",
    "title": "Online Therapy in Denmark | Copenhagen from ~DKK 150",
    "description": "Licensed African therapists welcome clients of every background in Denmark: anxiety and depression, work stress, relationship problems, parenting challenges. Video ~DKK 150 · chat ~DKK 60. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Denmark. From ~DKK 150.",
    "h1Line2": "Copenhagen · Aarhus · Odense. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about DKK 150 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Denmark can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Denmark seek therapy",
    "problemBody": [
      "People in Denmark most often seek therapy for anxiety and depression, work stress, relationship problems, parenting challenges. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear DKK price, by video or chat."
    ],
    "howHeadline": "From anywhere in Denmark — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about DKK 150 or chat about DKK 60. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Denmark",
    "paymentHowSteps": [
      "Choose video (~DKK 150) or chat (~DKK 60)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Denmark emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Work stress",
      "Relationship problems",
      "Parenting challenges",
      "Loneliness",
      "Grief and loss"
    ],
    "cities": [
      {
        "id": "copenhagen",
        "city": "Copenhagen",
        "body": "Private online sessions with a licensed African therapist from anywhere in Copenhagen — evenings included.",
        "kw": "African therapist Copenhagen"
      },
      {
        "id": "aarhus",
        "city": "Aarhus",
        "body": "Private online sessions with a licensed African therapist from anywhere in Aarhus — evenings included.",
        "kw": "African therapist Aarhus"
      },
      {
        "id": "odense",
        "city": "Odense",
        "body": "Private online sessions with a licensed African therapist from anywhere in Odense — evenings included.",
        "kw": "African therapist Odense"
      },
      {
        "id": "aalborg",
        "city": "Aalborg",
        "body": "Private online sessions with a licensed African therapist from anywhere in Aalborg — evenings included.",
        "kw": "African therapist Aalborg"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Denmark?",
        "a": "Video therapy is about DKK 150 and chat therapy about DKK 60 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Work stress, Relationship problems, Parenting challenges, Loneliness, Grief and loss."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Denmark."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Denmark, call 112."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from DKK 150",
    "whatsappPrefill": "Hi InnerSpark, I am in Denmark and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Copenhagen",
      "Aarhus",
      "Odense"
    ]
  },
  "finland": {
    "slug": "finland",
    "countryLabel": "Finland",
    "code": "FI",
    "flag": "FI",
    "currency": "EUR",
    "videoPrice": "EUR 20",
    "videoAmount": 20,
    "chatPrice": "EUR 8",
    "monthlyPrice": "EUR 74",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Helsinki, Espoo, Tampere and across Finland",
    "title": "Online Therapy in Finland | Helsinki from ~EUR 20",
    "description": "Licensed African therapists welcome clients of every background in Finland: depression, anxiety, loneliness, social anxiety. Video ~EUR 20 · chat ~EUR 8. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Finland. From ~EUR 20.",
    "h1Line2": "Helsinki · Espoo · Tampere. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about EUR 20 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Finland can be good on paper — and still leave you carrying depression alone.",
    "problemSource": "Common reasons people in Finland seek therapy",
    "problemBody": [
      "People in Finland most often seek therapy for depression, anxiety, loneliness, social anxiety. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear EUR price, by video or chat."
    ],
    "howHeadline": "From anywhere in Finland — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about EUR 20 or chat about EUR 8. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Finland",
    "paymentHowSteps": [
      "Choose video (~EUR 20) or chat (~EUR 8)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Finland emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Depression",
      "Anxiety",
      "Loneliness",
      "Social anxiety",
      "Family conflict",
      "Substance-use difficulties"
    ],
    "cities": [
      {
        "id": "helsinki",
        "city": "Helsinki",
        "body": "Private online sessions with a licensed African therapist from anywhere in Helsinki — evenings included.",
        "kw": "African therapist Helsinki"
      },
      {
        "id": "espoo",
        "city": "Espoo",
        "body": "Private online sessions with a licensed African therapist from anywhere in Espoo — evenings included.",
        "kw": "African therapist Espoo"
      },
      {
        "id": "tampere",
        "city": "Tampere",
        "body": "Private online sessions with a licensed African therapist from anywhere in Tampere — evenings included.",
        "kw": "African therapist Tampere"
      },
      {
        "id": "turku",
        "city": "Turku",
        "body": "Private online sessions with a licensed African therapist from anywhere in Turku — evenings included.",
        "kw": "African therapist Turku"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Finland?",
        "a": "Video therapy is about EUR 20 and chat therapy about EUR 8 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Depression, Anxiety, Loneliness, Social anxiety, Family conflict, Substance-use difficulties."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Finland."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Finland, call 112."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from EUR 20",
    "whatsappPrefill": "Hi InnerSpark, I am in Finland and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Helsinki",
      "Espoo",
      "Tampere"
    ]
  },
  "australia": {
    "slug": "australia",
    "countryLabel": "Australia",
    "code": "AU",
    "flag": "AU",
    "currency": "AUD",
    "videoPrice": "AUD 34",
    "videoAmount": 34,
    "chatPrice": "AUD 14",
    "monthlyPrice": "AUD 126",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Sydney, Melbourne, Brisbane and across Australia",
    "title": "Online Therapy in Australia | Sydney from ~AUD 34",
    "description": "Licensed African therapists welcome clients of every background in Australia: anxiety and depression, relationship and marriage difficulties, workplace burnout, childhood trauma. Video ~AUD 34 · chat ~AUD 14. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in Australia. From ~AUD 34.",
    "h1Line2": "Sydney · Melbourne · Brisbane. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about AUD 34 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in Australia can be good on paper — and still leave you carrying anxiety and depression alone.",
    "problemSource": "Common reasons people in Australia seek therapy",
    "problemBody": [
      "People in Australia most often seek therapy for anxiety and depression, relationship and marriage difficulties, workplace burnout, childhood trauma. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear AUD price, by video or chat."
    ],
    "howHeadline": "From anywhere in Australia — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about AUD 34 or chat about AUD 14. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in Australia",
    "paymentHowSteps": [
      "Choose video (~AUD 34) or chat (~AUD 14)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a Australia emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Anxiety and depression",
      "Relationship and marriage difficulties",
      "Workplace burnout",
      "Childhood trauma",
      "Grief",
      "Low self-esteem"
    ],
    "cities": [
      {
        "id": "sydney",
        "city": "Sydney",
        "body": "Private online sessions with a licensed African therapist from anywhere in Sydney — evenings included.",
        "kw": "African therapist Sydney"
      },
      {
        "id": "melbourne",
        "city": "Melbourne",
        "body": "Private online sessions with a licensed African therapist from anywhere in Melbourne — evenings included.",
        "kw": "African therapist Melbourne"
      },
      {
        "id": "brisbane",
        "city": "Brisbane",
        "body": "Private online sessions with a licensed African therapist from anywhere in Brisbane — evenings included.",
        "kw": "African therapist Brisbane"
      },
      {
        "id": "perth",
        "city": "Perth",
        "body": "Private online sessions with a licensed African therapist from anywhere in Perth — evenings included.",
        "kw": "African therapist Perth"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in Australia?",
        "a": "Video therapy is about AUD 34 and chat therapy about AUD 14 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Anxiety and depression, Relationship and marriage difficulties, Workplace burnout, Childhood trauma, Grief, Low self-esteem."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in Australia."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in Australia, call 000 or Lifeline on 13 11 14."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from AUD 34",
    "whatsappPrefill": "Hi InnerSpark, I am in Australia and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Sydney",
      "Melbourne",
      "Brisbane"
    ]
  },
  "new-zealand": {
    "slug": "new-zealand",
    "countryLabel": "New Zealand",
    "code": "NZ",
    "flag": "NZ",
    "currency": "NZD",
    "videoPrice": "NZD 37",
    "videoAmount": 37,
    "chatPrice": "NZD 15",
    "monthlyPrice": "NZD 137",
    "monthlyNote": "4 sessions · small bundle saving",
    "ugxNote": "~UGX 75,000 · ~USD 22",
    "citiesLine": "Adults, students and families in Auckland, Wellington, Christchurch and across New Zealand",
    "title": "Online Therapy in New Zealand | Auckland from ~NZD 37",
    "description": "Licensed African therapists welcome clients of every background in New Zealand: depression and anxiety, relationship problems, grief, loneliness. Video ~NZD 37 · chat ~NZD 15. Open to everyone, private, WhatsApp +256 792 085 773.",
    "h1": "Book online therapy in New Zealand. From ~NZD 37.",
    "h1Line2": "Auckland · Wellington · Christchurch. Open to everyone. Visa ready.",
    "introLine1": "Confidential online therapy for adults of every race, background, culture and nationality.",
    "introLine2": "From about NZD 37 · Pay by Visa · Book in about 2 minutes.",
    "paymentLabel": "Visa / card",
    "paymentAccepted": [
      "Visa",
      "Card"
    ],
    "trustPayment": "Visa accepted",
    "problemHeadline": "Life in New Zealand can be good on paper — and still leave you carrying depression and anxiety alone.",
    "problemSource": "Common reasons people in New Zealand seek therapy",
    "problemBody": [
      "People in New Zealand most often seek therapy for depression and anxiety, relationship problems, grief, loneliness. Whatever your background, you can bring anxiety, relationships, work pressure, grief or major life changes into a private, judgement-free session.",
      "InnerSpark connects you with licensed African therapists who welcome clients of every background, at a clear NZD price, by video or chat."
    ],
    "howHeadline": "From anywhere in New Zealand — confidential therapy in 3 steps.",
    "howSteps": [
      "Choose your therapist",
      "Book and pay by Visa",
      "Connect on WhatsApp"
    ],
    "howBodies": [
      "Browse licensed African therapists. Filter by concern, gender and language.",
      "Video about NZD 37 or chat about NZD 15. Your card confirms the final amount.",
      "Join by WhatsApp video or voice after work, from home. No new app."
    ],
    "paymentHowTitle": "How payment works in New Zealand",
    "paymentHowSteps": [
      "Choose video (~NZD 37) or chat (~NZD 15)",
      "Pay by Visa / international card",
      "Receive WhatsApp confirmation and your session time",
      "Message us if anything needs follow-up"
    ],
    "paymentTip": "This is cross-border support with African therapists — not a New Zealand emergency or insurance service.",
    "offerCompare": "A clear price for professional, culturally responsive care — open to every client, whatever your background.",
    "concerns": [
      "Depression and anxiety",
      "Relationship problems",
      "Grief",
      "Loneliness",
      "Workplace stress",
      "Trauma"
    ],
    "cities": [
      {
        "id": "auckland",
        "city": "Auckland",
        "body": "Private online sessions with a licensed African therapist from anywhere in Auckland — evenings included.",
        "kw": "African therapist Auckland"
      },
      {
        "id": "wellington",
        "city": "Wellington",
        "body": "Private online sessions with a licensed African therapist from anywhere in Wellington — evenings included.",
        "kw": "African therapist Wellington"
      },
      {
        "id": "christchurch",
        "city": "Christchurch",
        "body": "Private online sessions with a licensed African therapist from anywhere in Christchurch — evenings included.",
        "kw": "African therapist Christchurch"
      },
      {
        "id": "hamilton",
        "city": "Hamilton",
        "body": "Private online sessions with a licensed African therapist from anywhere in Hamilton — evenings included.",
        "kw": "African therapist Hamilton"
      }
    ],
    "testimonials": [],
    "faqs": [
      {
        "q": "How much does InnerSpark cost in New Zealand?",
        "a": "Video therapy is about NZD 37 and chat therapy about NZD 15 per session. Your card confirms the final amount."
      },
      {
        "q": "Can anyone book, even if they are not African?",
        "a": "Yes. InnerSpark welcomes clients of every race, including white clients, and every nationality, culture and background. Our therapists are licensed African professionals; you do not need to be African to book."
      },
      {
        "q": "What can I get help with?",
        "a": "Depression and anxiety, Relationship problems, Grief, Loneliness, Workplace stress, Trauma."
      },
      {
        "q": "How do sessions work across time zones?",
        "a": "Share your city and availability when you book, and we match you to a practical time in New Zealand."
      },
      {
        "q": "Is this emergency care?",
        "a": "No. If you are in immediate danger in New Zealand, call 111 or text 1737."
      }
    ],
    "related": [
      {
        "to": "/online-therapy-diaspora",
        "label": "Online therapy with African therapists",
        "tag": "Diaspora",
        "blurb": "Professional care open to every background."
      },
      {
        "to": "/specialists",
        "label": "Meet African therapists",
        "tag": "Therapists",
        "blurb": "Licensed profiles before you pay."
      }
    ],
    "finalCta": "Book my first session — from NZD 37",
    "whatsappPrefill": "Hi InnerSpark, I am in New Zealand and want to book a licensed African therapist. Please confirm price and time zones.",
    "schemaCities": [
      "Auckland",
      "Wellington",
      "Christchurch"
    ]
  },
};
