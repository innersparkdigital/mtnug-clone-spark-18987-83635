/**
 * Build-time prerender of every published CMS blog post.
 *
 * Runs after `vite build` (see package.json postbuild). For each published row
 * in blog_posts it writes dist/blog/<slug>/index.html containing the real
 * title, meta description, canonical, og:* tags, Article + FAQPage JSON-LD and
 * the actual article HTML inside #root.
 *
 * React replaces #root on mount, so visitors get the identical interactive UI.
 * Crawlers and AI answer engines that do not execute JavaScript (Google's
 * fallback crawl, Bing, TikTok's link preview, GPTBot, ClaudeBot, Google
 * Extended, PerplexityBot) now receive the full article text.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { SITE, GLOBAL_LINKS } from "./prerender-content.mjs";

const DIST = path.resolve(process.cwd(), "dist");
const MAX_POSTS = 200;

const SEO_OVERRIDES = {
  "how-to-stop-a-panic-attack": {
    title: "How to Stop a Panic Attack Now: 7 Safe Steps | InnerSpark",
    description: "Use seven practical steps to manage a panic attack safely, then book confidential support with a licensed African therapist if attacks continue.",
  },
  "spark-framework-mental-wellbeing": {
    title: "S.P.A.R.K Mental Wellbeing Routine for Ugandans",
    description: "Use InnerSpark Africa's five-step S.P.A.R.K routine to strengthen sleep, purpose, activity, relationships and self-awareness in a realistic Ugandan week.",
  },
  "types-of-therapy": {
    title: "Types of Therapy: Choose the Right Support in Uganda",
    description: "Compare common types of therapy and choose a licensed African therapist for anxiety, trauma, relationships, stress or personal growth.",
  },
  "therapy-cost-uganda": {
    title: "Therapy Cost in Uganda: Video UGX 75,000 | InnerSpark",
    description: "Compare therapy costs in Uganda. InnerSpark video therapy is UGX 75,000 per session and chat therapy is UGX 30,000.",
  },
  "cost-of-therapy-in-kampala-2026": {
    title: "Therapy Cost in Kampala 2026: Prices and Booking",
    description: "Compare therapy prices in Kampala and book a licensed African therapist. Video sessions cost UGX 75,000; chat costs UGX 30,000.",
  },
  "affordable-online-counselling-uganda": {
    title: "Online Counselling Uganda: Video UGX 75,000",
    description: "Book online counselling in Uganda with a licensed African therapist. Video sessions cost UGX 75,000 and chat sessions cost UGX 30,000.",
  },
  "best-therapist-for-anxiety-in-uganda": {
    title: "Anxiety Therapist Uganda: Find and Book Online",
    description: "Find a licensed anxiety therapist in Uganda for confidential video or chat sessions, with local payment options and clear pricing.",
  },
  "how-to-find-psychologist-in-kampala": {
    title: "Psychologist Kampala: How to Find and Book One",
    description: "Find a licensed psychologist in Kampala and compare credentials, session format, pricing and availability before you book.",
  },
  "find-therapist-kampala": {
    title: "Find a Therapist in Kampala and Book Online",
    description: "Find and book a licensed therapist in Kampala for confidential video or chat support with clear local pricing.",
  },
  "find-a-therapist-in-uganda": {
    title: "Find a Therapist in Uganda: Licensed Online Support",
    description: "Choose a licensed therapist in Uganda for confidential online support by video or chat. Compare fit, availability and price before booking.",
  },
  "relationship-counselling-uganda-online": {
    title: "Online Relationship Counselling Uganda | InnerSpark",
    description: "Book confidential online relationship counselling in Uganda with a licensed African therapist who understands local family and cultural context.",
  },
  "online-vs-in-person-therapy-uganda": {
    title: "Online vs In-Person Therapy Uganda: Cost and Fit",
    description: "Compare online and in-person therapy in Uganda by cost, privacy, convenience and therapist access before choosing where to book.",
  },
  "cost-of-therapy-in-kenya": {
    title: "Therapy Cost in Kenya: Online Prices and Booking",
    description: "Compare therapy costs in Kenya and book a licensed African therapist online for confidential support by video or chat.",
  },
  "find-a-therapist-in-nairobi": {
    title: "Find a Therapist in Nairobi and Book Online",
    description: "Find a licensed therapist in Nairobi for confidential online therapy, with clear session options, local context and simple booking.",
  },
  "cost-of-therapy-in-nigeria": {
    title: "Therapy Cost in Nigeria: Online Prices and Booking",
    description: "Compare therapy costs in Nigeria and book confidential online support with a licensed African therapist using card payment.",
  },
  "find-a-therapist-in-lagos": {
    title: "Find a Therapist in Lagos and Book Online",
    description: "Find a licensed therapist in Lagos for confidential online therapy by video or chat, with clear availability and simple booking.",
  },
  "cost-of-therapy-in-ghana": {
    title: "Therapy Cost in Ghana: Online Prices and Booking",
    description: "Compare therapy costs in Ghana and book confidential online support with a licensed African therapist using card payment.",
  },
  "find-a-therapist-in-accra": {
    title: "Find a Therapist in Accra and Book Online",
    description: "Find a licensed therapist in Accra for confidential online therapy by video or chat, with clear availability and simple booking.",
  },
  "mental-health-support-students-uganda": {
    title: "Student Counselling Uganda: Find Support Online",
    description: "Find confidential student counselling in Uganda for study pressure, anxiety, relationships and family difficulties with a licensed therapist.",
  },
  "burnout-kampala-professionals": {
    title: "Burnout Therapy Kampala: Online Support for Work Stress",
    description: "Book confidential burnout therapy in Kampala with a licensed therapist who understands workplace pressure and professional life in Uganda.",
  },
  "men-therapy-uganda": {
    title: "Therapy for Men in Uganda: Confidential Online Support",
    description: "Find confidential therapy for men in Uganda with licensed African therapists and private video or chat sessions.",
  },
  "uganda-workplace-mental-health-crisis": {
    title: "Workplace Mental Health Support Uganda | InnerSpark",
    description: "Get workplace mental health training and confidential employee support in Uganda for stress, burnout and healthier teams.",
  },
  "corporate-wellbeing-screening-uganda": {
    title: "Employee Wellbeing Screening Uganda | InnerSpark",
    description: "Arrange confidential employee wellbeing screening in Uganda to identify stress and support needs before they become bigger workplace problems.",
  },
  "how-to-handle-stress": {
    title: "How to Handle Stress: Practical Steps That Help",
    description: "Try practical ways to handle stress when work, money, family or study pressure feels too heavy, and learn when talking to a therapist may help.",
  },
  "what-is-mental-health": {
    title: "What Is Mental Health? A Clear African Guide",
    description: "Understand what mental health means, what can affect it and how to seek confidential support without shame or clinical jargon.",
  },
  "how-to-deal-with-depression": {
    title: "How to Deal With Depression: Safe First Steps",
    description: "Learn gentle, practical steps for coping with persistent low mood and how to find confidential support from a licensed therapist.",
  },
  "anxiety-symptoms": {
    title: "Anxiety Symptoms: What They Can Feel Like",
    description: "Recognise common emotional and physical anxiety symptoms, understand when they disrupt daily life and learn where to find confidential support.",
  },
  "signs-of-depression": {
    title: "Signs of Depression: When to Seek Support",
    description: "Learn common signs of depression, how they can affect daily life and when to speak privately with a licensed therapist.",
  },
  "how-to-find-a-therapist": {
    title: "How to Find the Right Therapist: 7 Clear Steps",
    description: "Use seven practical checks to choose a licensed therapist who fits your needs, budget, language and preferred session format.",
  },
  "benefits-of-therapy": {
    title: "Benefits of Therapy: What Can Change With Support",
    description: "Understand how therapy can support clearer thinking, healthier relationships and better coping without promising a quick or guaranteed result.",
  },
  "online-therapy-effective-africa": {
    title: "Does Online Therapy Work in Africa? What to Know",
    description: "Learn when online therapy can be a practical option in Africa, what a session involves and how to choose a licensed therapist.",
  },
  "whisper-anonymous-therapy-uganda": {
    title: "Anonymous Mental Health Support Uganda | Whisper",
    description: "Explore a private way to share what is weighing on you in Uganda, then choose confidential therapy when you are ready for ongoing support.",
  },
  "kampala-professionals-online-therapy": {
    title: "Online Therapy for Kampala Professionals",
    description: "Book confidential online therapy around a demanding Kampala workday with licensed African therapists who understand local workplace pressure.",
  },
  "what-is-therapy": {
    title: "What Is Therapy? What Your First Session Is Like",
    description: "Learn what therapy is, what happens in a first session and how confidential video or chat support works with a licensed therapist.",
  },
  "innerspark-africa-review": {
    title: "InnerSpark Africa Review: Price, Therapists and Booking",
    description: "Review InnerSpark Africa's licensed therapists, session formats, clear prices, payment options and booking process before choosing support.",
  },
  "8-signs-you-need-a-therapist-and-why-thats-completely-okay": {
    title: "8 Signs It May Be Time to Talk to a Therapist",
    description: "Read eight everyday signs that extra support may help, without shame, labels or pressure, and see how to book confidential therapy.",
  },
  "exam-stress-and-mental-health-a-guide-for-ugandan-students": {
    title: "Exam Stress Help for Ugandan Students",
    description: "Use practical steps to manage exam stress in Uganda and find confidential student counselling when pressure begins affecting sleep or daily life.",
  },
  "signs-of-burnout-when-stress-becomes-something-more": {
    title: "Signs of Burnout: When Stress Becomes Too Much",
    description: "Recognise signs of burnout in your body, mood and work, then learn practical next steps and where to find confidential support.",
  },
  "is-online-therapy-legit-what-to-expect-before-booking": {
    title: "Is Online Therapy Legit? What to Check Before Booking",
    description: "Check therapist credentials, privacy, pricing and session format before booking legitimate online therapy with confidence.",
  },
  "why-more-ugandan-men-are-quietly-seeking-therapy-online": {
    title: "Why Ugandan Men Are Choosing Online Therapy",
    description: "Learn why more Ugandan men are choosing private online therapy for work, relationships, grief and pressure without public attention.",
  },
  "talk-to-boss-mental-health-uganda": {
    title: "How to Talk to Your Boss About Mental Health in Uganda",
    description: "Prepare a clear, private conversation with your employer about mental health, workload or time for support without oversharing.",
  },
};

const ARTICLE_JOURNEYS = {
  "find-therapist-kampala": { hook: "You do not need to tell your whole story before you know who will listen. Start by checking qualifications, fit, privacy and price.", cta: "Choose a therapist you can speak to honestly", body: "Browse licensed African therapists, compare availability and book confidential video therapy for UGX 75,000 or chat therapy for UGX 30,000.", label: "Find a therapist in Kampala", href: "/book-therapist" },
  "spark-framework-mental-wellbeing": { hook: "When life feels scattered, a small routine can give the day somewhere steady to begin. S.P.A.R.K turns wellbeing into five realistic choices.", cta: "Need more than a routine right now?", body: "A licensed therapist can help you work through what is underneath the stress, privately and without judgement.", label: "Talk to a therapist", href: "/book-therapist" },
  "find-a-therapist-in-uganda": { hook: "Finding the right therapist is not about choosing the first name on a list. It is about feeling safe, understood and clear about what happens next.", cta: "Find licensed support that fits you", body: "Compare therapists who understand local languages and context, then book by video or chat with clear pricing.", label: "Browse licensed therapists", href: "/book-therapist" },
  "corporate-wellbeing-screening-uganda": { hook: "People often keep working while silently running out of strength. Confidential screening helps an organisation notice pressure before it becomes absence, conflict or resignation.", cta: "Understand what your team needs", body: "Request a confidential wellbeing screening programme designed for workplaces in Uganda.", label: "Request workplace support", href: "/corporate/service-request" },
  "how-to-handle-stress": { hook: "Stress can make even simple decisions feel heavy. You do not have to fix your entire life today; one calmer next step is enough.", cta: "You do not have to carry the pressure alone", body: "Talk privately with a licensed African therapist who can help you make sense of what is draining you.", label: "Book confidential support", href: "/book-therapist" },
  "how-to-stop-a-panic-attack": { hook: "A panic attack can feel frightening, but the wave will pass. Focus first on safety, slower breathing and the next minute—not the whole day.", cta: "Get support for recurring panic", body: "If panic keeps returning or changes how you live, a licensed therapist can help you understand the pattern and build practical coping tools.", label: "Talk to a therapist", href: "/book-therapist" },
  "what-is-mental-health": { hook: "Mental health is part of ordinary life: how you carry pressure, connect with people, make decisions and recover when things hurt.", cta: "Start a private conversation", body: "You do not need a perfect explanation. Begin with what has felt difficult lately and a licensed therapist will help you take it from there.", label: "Choose a therapist", href: "/book-therapist" },
  "how-to-deal-with-depression": { hook: "When getting through the day already takes effort, advice can feel like another demand. Begin gently, and do not mistake needing support for weakness.", cta: "Let someone meet you where you are", body: "Book a confidential session with a licensed therapist who will listen without judgement and help you plan manageable next steps.", label: "Book a private session", href: "/book-therapist" },
  "anxiety-symptoms": { hook: "Anxiety does not always look like fear. It can feel like a racing heart, poor sleep, irritability, stomach discomfort or a mind that will not switch off.", cta: "Make sense of what your body is telling you", body: "A licensed therapist can help you understand your symptoms and build coping strategies around your real life.", label: "Talk to an anxiety therapist", href: "/book-therapist" },
  "signs-of-depression": { hook: "Depression can be quiet. Sometimes it looks less like sadness and more like numbness, exhaustion, withdrawal or losing interest in the people and things you love.", cta: "You deserve support before it gets worse", body: "Speak privately with a licensed therapist and take one manageable step toward feeling more like yourself.", label: "Find confidential support", href: "/book-therapist" },
  "how-to-find-a-therapist": { hook: "The right therapist should make it easier to speak honestly—not make you feel judged, rushed or confused about the process.", cta: "Compare therapists before you decide", body: "Review licensed African therapists by experience, language and availability, with clear session prices before booking.", label: "Browse therapists", href: "/book-therapist" },
  "benefits-of-therapy": { hook: "Therapy is not about becoming a different person. It can help you understand your patterns, respond with more choice and feel less alone in what you carry.", cta: "See what support could feel like", body: "Start with one confidential conversation. Video therapy is UGX 75,000 and chat therapy is UGX 30,000.", label: "Book your first session", href: "/book-therapist" },
  "types-of-therapy": { hook: "You do not need to know the name of every therapy approach. You only need to explain what has been difficult and what you hope could change.", cta: "Choose support for your situation", body: "Find a licensed therapist for individual, relationship, teen, student or work-related concerns.", label: "Explore therapist options", href: "/book-therapist" },
  "online-therapy-effective-africa": { hook: "Good support should not depend on traffic, distance or whether a clinic nearby feels safe to visit. Online therapy brings the conversation to a private place you choose.", cta: "Try therapy from where you feel comfortable", body: "Book confidential video or chat support with a licensed African therapist who understands local context.", label: "Book online therapy", href: "/book-therapist" },
  "whisper-anonymous-therapy-uganda": { hook: "Sometimes writing the truth anonymously is the first time it feels possible to say it at all. That first release can help you decide what support you want next.", cta: "Start privately, at your own pace", body: "Use Whisper to share anonymously, or choose a licensed therapist when you are ready for a confidential conversation.", label: "Open Whisper", href: "/whisper" },
  "kampala-professionals-online-therapy": { hook: "You can look capable at work and still feel exhausted, anxious or disconnected inside. Success does not cancel your need for support.", cta: "Fit support around your workday", body: "Book confidential online therapy without crossing Kampala or sitting in a waiting room.", label: "Book online therapy", href: "/book-therapist" },
  "what-is-therapy": { hook: "Therapy is a private conversation with structure and purpose. You bring what is happening; the therapist helps you understand it and decide what to try next.", cta: "See what a first session feels like", body: "Choose a licensed African therapist and book video therapy for UGX 75,000 or chat therapy for UGX 30,000.", label: "Book a first session", href: "/book-therapist" },
  "innerspark-africa-review": { hook: "Before trusting any therapy platform, you should know who you will speak to, what it costs, how privacy works and how quickly you can book.", cta: "Review your options, then choose", body: "Browse licensed therapists, clear prices and available session times before you pay.", label: "Explore InnerSpark therapists", href: "/book-therapist" },
  "relationship-counselling-uganda-online": { hook: "When every conversation becomes an argument—or silence feels safer than honesty—outside support can help both people slow down and hear what is underneath.", cta: "Create space for a different conversation", body: "Book confidential online relationship counselling with a licensed African therapist who understands local family and cultural context.", label: "Book relationship counselling", href: "/book-therapist" },
  "burnout-kampala-professionals": { hook: "Burnout can hide behind productivity until your body, patience or relationships start paying the price. Rest alone may not solve what keeps recreating the pressure.", cta: "Talk before exhaustion becomes your normal", body: "Book confidential support with a therapist who understands demanding work and life in Kampala.", label: "Find burnout support", href: "/book-therapist" },
  "men-therapy-uganda": { hook: "Many men were taught to keep moving, provide and stay quiet. Therapy offers a private place to speak without being reduced to a label or judged for struggling.", cta: "Talk privately, without having to perform", body: "Choose a licensed African therapist for work pressure, grief, relationships, anger or the weight you have kept to yourself.", label: "Find a therapist", href: "/book-therapist" },
  "uganda-workplace-mental-health-crisis": { hook: "A team can meet targets while people quietly burn out. The cost eventually appears in mistakes, absence, conflict and good employees leaving.", cta: "Build a healthier workplace", body: "Request practical mental health training, confidential screening or employee support for your organisation.", label: "Request workplace support", href: "/corporate/service-request" },
  "cost-of-therapy-in-kenya": { hook: "The price of therapy should be clear before you share anything personal. Compare session format, payment and therapist fit—not price alone.", cta: "Book online therapy from Kenya", body: "Choose a licensed African therapist and pay by Visa for confidential video or chat support.", label: "Browse therapists", href: "/book-therapist" },
  "find-a-therapist-in-nairobi": { hook: "You should not have to cross Nairobi or explain your decision to anyone before getting support. Online therapy lets you begin privately.", cta: "Find a therapist who understands your context", body: "Compare licensed African therapists and book a confidential online session from Nairobi.", label: "Find a therapist", href: "/book-therapist" },
  "cost-of-therapy-in-nigeria": { hook: "Clear pricing matters when you are deciding whether therapy can fit your life. Check the format, therapist credentials and payment options before booking.", cta: "Book online support from Nigeria", body: "Choose a licensed African therapist and pay securely by Visa for a confidential session.", label: "Browse therapists", href: "/book-therapist" },
  "find-a-therapist-in-lagos": { hook: "Finding support should not add another long journey to an already difficult week. Online therapy lets you speak from a private place you choose.", cta: "Find a therapist from Lagos", body: "Compare licensed African therapists and book confidential video or chat support online.", label: "Choose a therapist", href: "/book-therapist" },
  "find-a-therapist-in-accra": { hook: "You do not have to wait until things become unbearable before speaking to someone. Private online support can begin wherever you feel safe.", cta: "Find a therapist from Accra", body: "Choose a licensed African therapist for confidential video or chat support and pay by Visa.", label: "Browse therapists", href: "/book-therapist" },
  "cost-of-therapy-in-ghana": { hook: "Therapy is easier to consider when the price and process are clear. Compare the session type, therapist and payment method before deciding.", cta: "Book online therapy from Ghana", body: "Choose a licensed African therapist and pay securely by Visa for confidential support.", label: "View therapist options", href: "/book-therapist" },
  "8-signs-you-need-a-therapist-and-why-thats-completely-okay": { hook: "You do not need a crisis, diagnosis or perfect reason to ask for help. If life feels harder to carry alone, that is enough to start a conversation.", cta: "Take your feelings seriously", body: "Choose a licensed therapist and begin with the part that has been hardest to say out loud.", label: "Talk to a therapist", href: "/book-therapist" },
  "therapy-cost-uganda": { hook: "You should know the exact price before you book. Video therapy costs UGX 75,000 per session; chat therapy costs UGX 30,000.", cta: "Choose the session that fits you", body: "Compare licensed therapists and available times, then pay by Mobile Money or card.", label: "Book therapy in Uganda", href: "/book-therapist" },
  "exam-stress-and-mental-health-a-guide-for-ugandan-students": { hook: "Exam pressure can make your future feel as if it depends on one week. Your wellbeing still matters, even when everyone around you is focused on marks.", cta: "Get support without judgement", body: "Talk privately with a licensed therapist about pressure, sleep, confidence or fear of disappointing people.", label: "Book student counselling", href: "/book-therapist" },
  "signs-of-burnout-when-stress-becomes-something-more": { hook: "Burnout is not laziness. It is what can happen when demand stays high and recovery never catches up.", cta: "Do not wait for your body to force a stop", body: "A licensed therapist can help you understand the pressure, protect your limits and plan realistic changes.", label: "Find burnout support", href: "/book-therapist" },
  "is-online-therapy-legit-what-to-expect-before-booking": { hook: "A professional-looking website is not enough. Legitimate online therapy should make credentials, privacy, pricing and the booking process clear.", cta: "Book with clarity, not guesswork", body: "Review licensed therapists, session formats and exact prices before choosing who to speak with.", label: "Check therapist options", href: "/book-therapist" },
  "why-more-ugandan-men-are-quietly-seeking-therapy-online": { hook: "Privacy makes honesty easier. Online therapy gives men room to talk about pressure, grief, relationships or anger without walking into a public waiting room.", cta: "Speak without having to explain yourself first", body: "Choose a licensed African therapist and start with a private video or chat session.", label: "Find confidential support", href: "/book-therapist" },
  "talk-to-boss-mental-health-uganda": { hook: "You can ask for support at work without sharing every private detail. A clear conversation can focus on what is affecting your work and what adjustment would help.", cta: "Prepare before the conversation", body: "Talk privately with a licensed therapist who can help you organise what to say and protect your boundaries.", label: "Book confidential support", href: "/book-therapist" },
  "mental-health-support-students-uganda": { hook: "University and school pressure can feel lonely when everyone expects you to cope. Support is not a sign that you are failing; it is a way to protect yourself while you continue.", cta: "Talk to someone who will listen", body: "Book confidential student counselling for study pressure, anxiety, relationships or family difficulties.", label: "Find student support", href: "/book-therapist" },
  "affordable-online-counselling-uganda": { hook: "Cost should be clear, and support should still feel human. Choose video when you want face-to-face connection or chat when writing feels easier.", cta: "Choose a clear, affordable starting point", body: "Video therapy costs UGX 75,000. Chat therapy costs UGX 30,000. Pay by Mobile Money or card.", label: "Book online counselling", href: "/book-therapist" },
  "online-vs-in-person-therapy-uganda": { hook: "The best format is the one that lets you attend consistently and speak safely. For some people that is a clinic; for others it is a private room and a phone.", cta: "Choose the format that fits your life", body: "Compare licensed therapists for confidential online video or chat support in Uganda.", label: "Explore online therapy", href: "/book-therapist" },
  "best-therapist-for-anxiety-in-uganda": { hook: "The best anxiety therapist is not simply the person with the longest profile. It is someone qualified who helps you feel safe enough to be honest and practical enough to move forward.", cta: "Find the right anxiety therapist for you", body: "Compare licensed therapists by experience, language and availability before booking.", label: "Browse anxiety therapists", href: "/book-therapist" },
  "how-to-find-psychologist-in-kampala": { hook: "Credentials matter, but so does the feeling that you can speak freely. Check both before committing to ongoing sessions.", cta: "Find qualified support in Kampala", body: "Compare licensed therapists, clear prices and online availability in one place.", label: "Find a psychologist", href: "/book-therapist" },
  "cost-of-therapy-in-kampala-2026": { hook: "Therapy prices in Kampala vary, so ask what the fee includes before booking. InnerSpark video therapy is UGX 75,000 and chat therapy is UGX 30,000.", cta: "Book with the price clear from the start", body: "Choose a licensed therapist, preferred session format and available time before paying.", label: "Book therapy in Kampala", href: "/book-therapist" },
};

// Node does not automatically load Vite's .env file during postbuild.
// Keep the public read-only project details as fallbacks so blog prerendering
// still runs on hosts that expose these values only to the browser bundle.
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://hnjpsvpudwwyzrrwzbpa.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuanBzdnB1ZHd3eXpycnd6YnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDgyODAsImV4cCI6MjA3Nzc4NDI4MH0.2s0TlAxFujnY2FMz0SDbzrjbsMCsgg1eCBHfUiiAGIQ";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const SPARK_PILLARS_SECTION = `<section class="blog-callout">
  <h2>The five S.P.A.R.K wellbeing pillars</h2>
  <h3>S — Sleep</h3><p>Protect a regular sleep window and reduce late-night screen time where your routine allows.</p>
  <h3>P — Purpose</h3><p>Choose one meaningful priority for the week instead of trying to solve everything at once.</p>
  <h3>A — Activity</h3><p>Move your body in a realistic way: walking, stretching, sport or active household work all count.</p>
  <h3>R — Relationships</h3><p>Make time for at least one honest conversation with someone you trust.</p>
  <h3>K — Knowledge</h3><p>Notice patterns in your mood, stress and coping, then seek reliable information or professional support when needed.</p>
</section>`;

const THERAPY_TYPES_SECTION = `<section class="blog-callout">
  <h2>Therapy options available through InnerSpark Africa</h2>
  <p>Choose the kind of support that matches what you want help with. A licensed therapist can explain the best starting point during your first confidential session.</p>
  <h3>Individual therapy</h3><p>One-to-one support for anxiety, depression, grief, trauma, stress, burnout and major life changes.</p>
  <h3>Couples therapy</h3><p>Practical support for communication, conflict, trust and relationship decisions.</p>
  <h3>Teen and student counselling</h3><p>Age-appropriate support for school pressure, family difficulties, confidence and emotional wellbeing.</p>
  <h3>Video and chat therapy</h3><p>Video therapy costs UGX 75,000 per session. Chat therapy costs UGX 30,000 for people who prefer written support.</p>
  <p><a href="/book-therapist">Choose a licensed African therapist and book a session</a>.</p>
</section>`;

const removeLeakedTemplateCode = (input) => {
  let source = String(input ?? "");
  if (/therapyTypes\.map|therapy\.icon|therapy\.name/.test(source)) {
    source = source.replace(/\{therapyTypes\.map\([\s\S]*?(?:\}\)\}|\}\);?)/g, THERAPY_TYPES_SECTION);
    if (!source.includes(THERAPY_TYPES_SECTION)) source += THERAPY_TYPES_SECTION;
  }
  if (/pillars\.map|p\.letter|p\.name|p\.body/.test(source)) {
    source = source.replace(/\{pillars\.map\([\s\S]*?(?:\)\)\}|\}\);?)/g, SPARK_PILLARS_SECTION);
    if (!source.includes(SPARK_PILLARS_SECTION)) source += SPARK_PILLARS_SECTION;
  }
  return source
    .split(/\r?\n/)
    .filter((line) => !/^\s*(?:\{?[A-Za-z_$][\w$]*\.map\(|const\s+Icon\s*=|return\s*\(|\{[A-Za-z_$][\w$]*\.(?:name|description|icon)\}|[)};,]+\s*$)/.test(line))
    .join("\n")
    .replace(/\{(?:therapy|p)\.(?:name|description|icon|letter|body)\}/g, "")
    .replace(/\{[A-Za-z_$][\w$]*\.map\([\s\S]*?\)\)\}/g, "")
    .replace(/\{(?:therapyTypes|pillars)\.map\([^\n]*/g, "")
    .replace(/const\s+[A-Za-z_$][\w$]*\s*=\s*[^;]+;?/g, "")
    .replace(/\{(?:title|desc|description|category|date|readTime)\}/g, "")
    .replace(/(?:Back to Blog\s*){2,}/gi, "Back to Blog ")
    .replace(/<[^>]+>\s*<\/[^>]+>/g, "");
};

/** Keep the article markup but drop anything executable. */
const sanitize = (html) =>
  removeLeakedTemplateCode(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<h1([^>]*)>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<[^>]+>\s*(?:Back to Blog|desc|\{title\})\s*<\/[^>]+>/gi, "")
    .replace(/browse 20\+ licensed therapists/gi, "browse licensed therapists")
    .replace(/start with a free consultation/gi, "start by choosing a therapist")
    .replace(/free initial consultations?/gi, "an introductory conversation where available")
    .replace(/free consultation/gi, "therapist matching support")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/video, voice or chat from UGX 30,000/gi, "video therapy at UGX 75,000 or chat therapy at UGX 30,000")
    .replace(/online therapy starting from UGX 30,000 per session/gi, "video therapy at UGX 75,000 per session and chat therapy at UGX 30,000")
    .replace(/therapy starting from UGX 30,000 per session/gi, "video therapy at UGX 75,000 per session and chat therapy at UGX 30,000")
    .replace(/video sessions? (?:start at|costs?) UGX 30,000/gi, "video sessions cost UGX 75,000")
    .replace(/sessions? from UGX 30,000/gi, "video sessions at UGX 75,000 or chat sessions at UGX 30,000")
    .replace(/UGX 30,000\s*[–-]\s*75,000 per session/gi, "UGX 75,000 for video or UGX 30,000 for chat per session");

function upsert(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function buildHead(shell, post) {
  const defaultUrl = `${SITE}/blog/${post.slug}/`;
  const configuredUrl = post.canonical_url?.trim();
  const url = configuredUrl
    ? configuredUrl.endsWith("/") ? configuredUrl : `${configuredUrl}/`
    : defaultUrl;
  const override = SEO_OVERRIDES[post.slug];
  const title = override?.title || post.meta_title?.trim() || `${post.title} | InnerSpark Africa`;
  const description = override?.description || post.meta_description || post.excerpt || post.title;
  const image = post.og_image_url?.trim() || post.hero_image_url || `${SITE}/og-image.jpg`;
  const published = post.published_at || post.created_at;
  const modified = post.last_updated_at || published;

  let out = shell;
  out = upsert(out, /<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  out = upsert(
    out,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${esc(description)}" />`,
  );
  out = upsert(out, /<link\s+rel="canonical"[\s\S]*?\/?>/i, `<link rel="canonical" href="${esc(url)}" />`);
  out = upsert(
    out,
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${esc(post.og_title?.trim() || post.title)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${esc(post.og_description?.trim() || description)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${esc(url)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image" content="${esc(image)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:type" content="article" />`,
  );

  const faqs = Array.isArray(post.faqs) ? post.faqs.filter((f) => f?.question && f?.answer) : [];
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": post.schema_type === "HowTo" ? "HowTo" : "Article",
      headline: post.title,
      description,
      image,
      datePublished: published,
      dateModified: modified,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Person", name: post.author || "InnerSpark Africa Clinical Team" },
      publisher: {
        "@type": "Organization",
        name: "InnerSpark Africa",
        logo: { "@type": "ImageObject", url: `${SITE}/innerspark-logo.webp` },
      },
    },
  ];
  if (faqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  const ld = schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join("\n    ");
  return out.replace("</head>", `    ${ld}\n  </head>`);
}

function buildBody(post) {
  const journey = ARTICLE_JOURNEYS[post.slug];
  const faqs = Array.isArray(post.faqs) ? post.faqs.filter((f) => f?.question && f?.answer) : [];
  const published = post.published_at || post.created_at;
  const date = new Date(published).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const faqHtml = faqs.length
    ? `<section class="mb-10"><h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>${faqs
        .map(
          (f) =>
            `<div class="mb-4"><h3 class="text-lg font-semibold">${esc(f.question)}</h3><p class="text-foreground/80">${esc(
              f.answer,
            )}</p></div>`,
        )
        .join("")}</section>`
    : "";

  const links = GLOBAL_LINKS.map(
    ([href, label]) =>
      `<li><a class="text-primary underline underline-offset-4" href="${href}">${esc(label)}</a></li>`,
  ).join("");

  return `
    <div data-prerendered-seo="true" class="min-h-screen bg-[#F7F3EA] text-[#111827]">
      <main>
        <header class="border-b border-[#D9D0BF]">
          <div class="container mx-auto px-4 py-12 max-w-5xl">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">${esc(post.category || "Mental health")}</p>
            <h1 class="font-serif text-4xl md:text-6xl font-semibold leading-tight mb-5">${esc(post.title)}</h1>
            ${post.excerpt ? `<p class="text-xl leading-relaxed text-[#4B5563] mb-6 max-w-3xl">${esc(post.excerpt)}</p>` : ""}
            <p class="text-sm text-[#4B5563]">${esc(date)}${post.read_time ? ` &middot; ${esc(post.read_time)}` : ""} &middot; By ${esc(
              post.author || "InnerSpark Africa Clinical Team",
            )}</p>
            <div class="mt-8 rounded-2xl bg-white border border-[#D9D0BF] p-5 max-w-2xl">
              <p class="font-bold mb-1">Video therapy: UGX 75,000 per session</p>
              <p class="text-[#4B5563]">Chat therapy: UGX 30,000. Pay by Mobile Money or card.</p>
            </div>
          </div>
        </header>
        <article class="container mx-auto px-4 py-12 max-w-3xl">
          ${journey ? `<aside class="mb-10 rounded-3xl bg-white border border-[#D9D0BF] p-6 md:p-8"><p class="text-xl leading-relaxed text-[#374151]">${esc(journey.hook)}</p></aside>` : ""}
          <div class="blog-body prose prose-lg max-w-none mb-10">${sanitize(post.content)}</div>
          ${faqHtml}
          ${journey ? `<aside class="my-10 rounded-3xl bg-[#0F172A] text-white p-7 md:p-9"><h2 class="font-serif text-2xl md:text-3xl font-semibold mb-3">${esc(journey.cta)}</h2><p class="text-white/80 leading-relaxed mb-6">${esc(journey.body)}</p><a class="inline-flex rounded-full bg-[#F59E0B] px-6 py-3 font-bold text-[#111827]" href="${journey.href}">${esc(journey.label)}</a></aside>` : `<p class="mb-6"><a class="text-primary font-semibold underline underline-offset-4" href="/book-therapist">Book video therapy with a licensed African therapist</a></p>`}
          <nav aria-label="Site sections">
            <h2 class="text-xl font-bold mb-3">Explore InnerSpark Africa</h2>
            <ul class="grid gap-2 sm:grid-cols-2">${links}</ul>
          </nav>
        </article>
      </main>
    </div>`;
}

function buildListingBody(posts) {
  const links = GLOBAL_LINKS.map(
    ([href, label]) =>
      `<li><a class="text-primary underline underline-offset-4" href="${href}">${esc(label)}</a></li>`,
  ).join("");

  const items = posts
    .map((post) => {
      const published = post.published_at || post.created_at;
      const date = new Date(published).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const url = `/blog/${post.slug}/`;
      return `
        <article class="mb-8">
          <h2 class="text-xl font-bold mb-1"><a class="text-primary underline underline-offset-4" href="${url}">${esc(post.title)}</a></h2>
          <p class="text-sm text-foreground/60 mb-2">${esc(date)}${post.read_time ? ` &middot; ${esc(post.read_time)}` : ""}</p>
          ${post.excerpt ? `<p class="text-foreground/80">${esc(post.excerpt)}</p>` : ""}
        </article>`;
    })
    .join("");

  return `
    <div data-prerendered-seo="true" class="min-h-screen bg-background text-foreground">
      <main class="container mx-auto px-4 py-12 max-w-3xl">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">Mental Health Blog Uganda | InnerSpark Africa</h1>
        <p class="text-lg leading-relaxed text-foreground/80 mb-10">Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today.</p>
        ${items}
        <nav aria-label="Site sections" class="mt-12">
          <h2 class="text-xl font-bold mb-3">Explore InnerSpark Africa</h2>
          <ul class="grid gap-2 sm:grid-cols-2">${links}</ul>
        </nav>
      </main>
    </div>`;
}

const ROOT_RE = /<div id="root">\s*<\/div>/;

async function fetchPosts() {
  const url =
    `${SUPABASE_URL}/rest/v1/blog_posts?status=eq.published&select=*&order=published_at.desc&limit=${MAX_POSTS}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`[prerender-blogs] blog fetch failed: ${res.status} ${await res.text()}`);
  }
  const posts = await res.json();
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("[prerender-blogs] no published blog posts returned; refusing to ship homepage fallbacks for blog URLs");
  }
  return posts;
}

async function run() {
  // prerender.mjs writes a clean SPA shell for us; fall back to dist/index.html.
  const templatePath = path.join(DIST, "index.template.html");
  const fallbackPath = path.join(DIST, "index.html");
  let shell;
  try {
    shell = await readFile(templatePath, "utf8");
  } catch {
    try {
      shell = await readFile(fallbackPath, "utf8");
    } catch {
      console.warn("[prerender-blogs] dist/index.template.html not found — skipping.");
      return;
    }
  }
  if (!ROOT_RE.test(shell)) {
    console.warn("[prerender-blogs] #root placeholder not found in shell — skipping.");
    return;
  }

  const posts = await fetchPosts();
  let count = 0;
  for (const post of posts) {
    if (!post?.slug) continue;
    const html = buildHead(shell, post).replace(ROOT_RE, `<div id="root">${buildBody(post)}</div>`);
    const outPath = path.join(DIST, "blog", post.slug, "index.html");
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    count += 1;
  }

  // Prerender the /blog listing page so crawlers see all article links.
  const listingHead = buildHead(shell, {
    slug: "blog",
    title: "Mental Health Blog Uganda | InnerSpark Africa",
    excerpt: "Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today.",
    meta_title: "Mental Health Blog Uganda | InnerSpark Africa",
    meta_description: "Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today.",
    canonical_url: `${SITE}/blog/`,
    og_title: "Mental Health Blog Uganda | InnerSpark Africa",
    og_description: "Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today.",
    og_image_url: `${SITE}/og-image.jpg`,
    schema_type: "CollectionPage",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
    author: "InnerSpark Africa",
  });
  const listingHtml = listingHead.replace(ROOT_RE, `<div id="root">${buildListingBody(posts)}</div>`);
  await mkdir(path.join(DIST, "blog"), { recursive: true });
  await writeFile(path.join(DIST, "blog", "index.html"), listingHtml, "utf8");

  console.log(`[prerender-blogs] ${count} blog post(s) + listing prerendered.`);
}

run().catch((err) => {
  console.error("[prerender-blogs] failed:", err);
});
