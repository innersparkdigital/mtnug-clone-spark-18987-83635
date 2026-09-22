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
    title: "Book Online Therapy Nigeria | Licensed from ~NGN 27,500",
    description: "For Nigerian professionals ready to pay for confidential care. Book a licensed African therapist — video about NGN 27,500 · chat about NGN 11,000. Visa accepted.",
    h1: "Book licensed online therapy in Nigeria.",
    h1Line2: "Clear price. Private. Visa ready.",
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
      { q: "How much does therapy cost in Nigeria on InnerSpark?", a: "Video therapy is about NGN 27,500 per session and chat therapy about NGN 11,000. Your card confirms the final naira amount." },
      { q: "Who is this for?", a: "Adults and professionals who can pay for confidential care — a deliberate investment, not a free crisis line." },
      { q: "How do I pay from Nigeria?", a: "By Visa or international card. Confirm on WhatsApp after payment if we request your receipt." },
      { q: "Will my employer find out?", a: "No. Sessions are one-to-one and private. We do not contact employers." },
      { q: "What happens after I book?", a: "WhatsApp confirmation, session time and join details. Message +256 792 085 773 if anything is unclear — we follow up." },
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
    title: "Book Online Therapy Tanzania | Licensed from ~TZS 52,000",
    description: "For Tanzanian professionals ready to pay for private care. Book a licensed African therapist — video about TZS 52,000 · chat about TZS 21,000. Visa accepted.",
    h1: "Book licensed online therapy in Tanzania.",
    h1Line2: "Clear price. Private. Visa ready.",
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
      { q: "How much does online therapy cost in Tanzania?", a: "Video is about TZS 52,000 and chat about TZS 21,000 per session." },
      { q: "Who should book?", a: "People ready to pay for licensed care — professionals and adults who want confidentiality." },
      { q: "Can I request Swahili?", a: "Yes. Share your language preference at booking." },
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
    title: "Book Online Therapy Ghana | Licensed from ~GHS 235",
    description: "For Ghanaian professionals ready to pay for confidential care. Book a licensed African therapist — video about GHS 235 · chat about GHS 95. Visa accepted.",
    h1: "Book licensed online therapy in Ghana.",
    h1Line2: "Clear price. Private. Visa ready.",
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
      { q: "How much does therapy cost in Ghana on InnerSpark?", a: "Video is about GHS 235 and chat about GHS 95 per session." },
      { q: "Can therapy respect my faith?", a: "Yes. Tell us faith matters and we aim to match accordingly while keeping professional care." },
      { q: "Who is this for?", a: "Adults ready to pay for licensed confidential care — not free helplines." },
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
    title: "Book Online Therapy Gambia | Licensed from ~GMD 1,500",
    description: "For professionals in The Gambia ready to pay for private care. Book a licensed African therapist — video about GMD 1,500 · chat about GMD 600. Visa accepted.",
    h1: "Book licensed online therapy in The Gambia.",
    h1Line2: "Clear price. Private. Visa ready.",
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
      { q: "How much is online therapy in The Gambia?", a: "Video about GMD 1,500 and chat about GMD 600 per session." },
      { q: "Why online instead of local only?", a: "A wider licensed African network plus privacy in a close-knit setting." },
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
    citiesLine: "African immigrants, students and diaspora professionals across the United States",
    title: "Book Online Therapy for Africans in the USA | from ~USD 22",
    description: "For African professionals in the USA ready to pay for culturally grounded care. Licensed African therapists — video about USD 22 · chat about USD 9. Visa accepted.",
    h1: "Book therapy with an African therapist in the USA.",
    h1Line2: "Clear price. Cultural fit. Visa ready.",
    introLine1: "For diaspora professionals ready to invest in confidential care.",
    introLine2: "From about USD 22 · Pay by Visa · Book in about 2 minutes.",
    paymentLabel: "Visa / card",
    paymentAccepted: ["Visa", "Card"],
    trustPayment: "Visa accepted",
    problemHeadline: "You should not spend half the session translating culture, family duty or home to someone who has never lived it.",
    problemSource: "Paid cultural fit for Africans who can invest in care",
    problemBody: [
      "US directories can be excellent — and still miss migration stress, family obligations back home, or the pressure to look fine on paper.",
      "InnerSpark connects you with licensed African therapists at a clear USD rate. You book, pay and meet on WhatsApp video or chat.",
    ],
    howHeadline: "From any US city — therapy with cultural fit in 3 steps.",
    howSteps: ["Choose your therapist", "Book and pay by Visa", "Connect on WhatsApp"],
    howBodies: [
      "Licensed African therapists who understand diaspora life, family duty and living between cultures.",
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
    offerCompare: "A clear USD price for licensed African therapists — without rebuilding your whole cultural context every week.",
    concerns: ["Diaspora identity and belonging", "Homesickness and adjustment", "Family obligations back home", "International student stress", "Relationships across cultures", "Workplace and racial stress"],
    cities: [
      { id: "nyc", city: "New York", body: "African professionals and students in NYC — culturally fluent therapist, clear USD rate.", kw: "African therapist New York" },
      { id: "houston", city: "Houston", body: "Private WhatsApp video for diaspora clients who want African context.", kw: "Therapy for Africans Houston" },
      { id: "atlanta", city: "Atlanta", body: "Licensed African therapists online. Pay by Visa. Join after work from home.", kw: "African counsellor Atlanta" },
      { id: "dc", city: "Washington DC", body: "Confidential care for professionals balancing career, family abroad and identity.", kw: "Diaspora therapy DC" },
      { id: "chicago", city: "Chicago", body: "Students and professionals — clear pricing, cultural fit, private sessions.", kw: "African therapist Chicago" },
      { id: "nationwide", city: "Across the USA", body: "If you can pay for confidential care and want an African therapist, book this week.", kw: "Online therapy Africans USA" },
    ],
    testimonials: [
      { quote: "I stopped paying to educate my therapist about African family duty. Here they already knew the terrain.", who: "Professional, New York" },
      { quote: "Clear USD price. WhatsApp video after work. It felt serious, not like a free chatbot.", who: "Graduate student, Texas" },
      { quote: "I wanted cultural fit and a real booking path. That is exactly what I got.", who: "Client, Georgia" },
    ],
    faqs: [
      { q: "How much does InnerSpark cost in the USA?", a: "Video about USD 22 and chat about USD 9 per session." },
      { q: "Is this a US emergency or insurance service?", a: "No. Cross-border support with African therapists. For crisis in the US, call or text 988." },
      { q: "Who is this for?", a: "African immigrants, diaspora professionals and students ready to pay for culturally grounded licensed care." },
      { q: "Will you follow up after I book?", a: "Yes. WhatsApp +256 792 085 773 for payment and scheduling confirmation." },
    ],
    related: [
      { to: "/online-therapy-diaspora", label: "Therapy for Africans abroad", tag: "Diaspora", blurb: "Why cultural fit changes the first session." },
      { to: "/specialists", label: "Meet African therapists", tag: "Therapists", blurb: "Licensed profiles before you pay." },
    ],
    finalCta: "Book my first session — from USD 22",
    whatsappPrefill: "Hi InnerSpark, I am in the USA and want to book a licensed African therapist. Please confirm price and time zones.",
    schemaCities: ["New York", "Houston", "Atlanta"],
  },
};
