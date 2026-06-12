import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const AffordableOnlineCounsellingPost = () => {
  const data: BlogPostData = {
    slug: "affordable-online-counselling-uganda",
    category: "Online Therapy",
    title: "Affordable Online Counselling in Uganda: Your Complete 2026 Guide",
    metaTitle: "Affordable Online Counselling in Uganda from UGX 30,000 | Innerspark Africa",
    metaDescription: "How to access affordable online counselling in Uganda — real prices, who it works for, how to choose a therapist, and how to start this week. Sessions from UGX 30,000, paid by MTN or Airtel Mobile Money.",
    date: "May 3, 2026",
    isoDate: "2026-05-03",
    readTime: "9 min read",
    keywords: ["affordable online counselling Uganda", "cheap therapy Uganda", "online therapist Kampala", "online counselling UGX 30,000", "WhatsApp therapy Uganda", "Mobile Money therapy"],
    heroImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Young Ugandan woman in a private online counselling session at home on her laptop",
    sections: [
      {
        title: "Therapy in Uganda used to be expensive. Not anymore.",
        blocks: [
          { type: "lead", text: "For a long time, talking to a therapist in Uganda meant a long commute to Kololo, a UGX 200,000 fee, and a waiting room where you might bump into someone you know. That kept most people away from help they badly needed. Online counselling has quietly changed the entire picture — and the prices that come with it." },
          { type: "callout", label: "The short version:", text: "Affordable online counselling in Uganda is here. Sessions at Innerspark Africa start at UGX 30,000, with our standard rate at UGX 75,000 per 60-minute session. No transport, no waiting room, complete privacy." },
          { type: "p", text: "This guide explains exactly what \"affordable\" means in Uganda right now, who online counselling is and isn't suited for, how to make it work on a tight budget, and how to take the first step in under five minutes." },
        ],
      },
      {
        title: "What it actually costs in 2026",
        blocks: [
          { type: "p", text: "Prices vary by therapist seniority and specialisation, but here is the honest landscape across Uganda right now." },
          { type: "h3", text: "Innerspark Africa rates" },
          { type: "list", items: [
            <><strong>Individual therapy:</strong> UGX 30,000 – 75,000 per 60-minute session</>,
            <><strong>Group support sessions:</strong> UGX 25,000 per week</>,
            <><strong>Couples therapy:</strong> UGX 75,000 per session</>,
            <><strong>Teen therapy:</strong> UGX 75,000 per session</>,
            <><strong>Free tools:</strong> WHO-5 wellbeing check and 37+ mind-check assessments at no cost</>,
          ]},
          { type: "h3", text: "How that compares to in-person care" },
          { type: "list", items: [
            "Private clinics in Kololo or Naguru: UGX 100,000 – 300,000 per session",
            "Hospital outpatient (Nakasero, IHK, AAR): UGX 150,000 – 400,000 per session",
            "Government clinics: free, but long waiting lists",
          ]},
          { type: "p", text: "Online sessions are cheaper because the therapist carries no clinic rent, no front-desk staff, and can see more clients in a day. The clinical effectiveness is the same." },
        ],
      },
      {
        title: "Why online counselling fits Ugandan life so well",
        blocks: [
          { type: "iconGrid", items: [
            { icon: "🚗", text: "No bodaboda or fuel costs" },
            { icon: "🕐", text: "Use a lunch break or weekend" },
            { icon: "🔒", text: "Nobody sees you walk into a clinic" },
            { icon: "📱", text: "Works on any smartphone" },
            { icon: "🌍", text: "Same therapist, even when you travel" },
            { icon: "💳", text: "Pay via MTN or Airtel Mobile Money" },
          ]},
          { type: "quote", text: "Most of our clients tell us the privacy of online sessions is what finally let them start. They could not have walked into a clinic — but they can close a bedroom door.", cite: "Innerspark clinical team" },
        ],
      },
      {
        title: "5 ways to make it even more affordable",
        blocks: [
          { type: "numberedCards", title: "Budget-friendly strategies", items: [
            "Start with one session, not a 12-week commitment — most clients pay as they go.",
            "Ask about the entry-level rate (UGX 30,000) — designed for students and tight budgets.",
            "Join a support group at UGX 25,000 per week — same therapist, shared cost.",
            "Use the free wellbeing check and mind-check tools first — clarity before you spend.",
            "Space sessions every 2 weeks instead of weekly if cash flow is tight — still highly effective.",
          ]},
          { type: "highlight", title: "Not sure if you need full therapy yet?", text: <>Take our free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link> or explore our <Link to="/mind-check" className="text-primary hover:underline font-medium">37 mental health self-assessments</Link>. Both are free, private, and give you a clear sense of what to do next.</> },
        ],
      },
      {
        title: "What you actually need to start",
        blocks: [
          { type: "p", text: "Online counselling has a lower bar than people imagine. Here is the realistic minimum." },
          { type: "checkGrid", items: [
            "A smartphone or laptop with a working camera",
            "Stable mobile data — 3G is enough for voice or chat",
            "A private space for 60 minutes (a parked car works)",
            "Headphones if anyone is in the next room",
            "Mobile Money for payment",
            "Willingness to be honest about how you actually feel",
          ]},
          { type: "p", text: "If video feels exposing, you can do your first session by voice or chat instead. Many of our clients only switch on video after a few sessions, once they feel safer with their therapist." },
        ],
      },
      {
        title: "Is online therapy actually effective?",
        blocks: [
          { type: "p", text: "Yes — and the research is now very clear. Multiple meta-analyses since 2015 show online therapy delivers the same outcomes as in-person therapy for anxiety, depression, grief, work stress, relationship issues, and trauma. For some people it works better, because the privacy and convenience mean they actually keep their appointments." },
          { type: "h3", text: "When in-person is still the better choice" },
          { type: "list", items: [
            "Active psychosis or severe mania",
            "Acute suicide risk needing hospitalisation",
            "Court-ordered or forensic assessments",
            "Severe addictions requiring medical detox",
          ]},
          { type: "p", text: <>If any of these apply, please contact our <Link to="/emergency-support" className="text-primary hover:underline">emergency support page</Link> or visit Butabika Hospital directly.</> },
        ],
      },
      {
        title: "How to choose the right online therapist",
        blocks: [
          { type: "p", text: "The single biggest predictor of whether therapy works is the fit between you and your therapist — not their seniority, gender, or price." },
          { type: "h3", text: "Look for" },
          { type: "list", items: [
            "Registration with the Uganda Counselling Association or equivalent body",
            "Clear specialisation in your concern (anxiety, grief, addiction, couples, etc.)",
            "A short intro call or message before booking",
            "Transparent pricing — no surprise fees",
            "Permission to switch therapists if it does not feel right after 2–3 sessions",
          ]},
          { type: "h3", text: "Red flags" },
          { type: "list", items: [
            "Promising a \"cure\" in a few sessions",
            "Pushing expensive packages upfront",
            "Refusing to confirm qualifications in writing",
            "Crossing personal or financial boundaries",
          ]},
        ],
      },
    ],
    faqs: [
      { q: "How much does online counselling cost in Uganda?", a: "Sessions at Innerspark Africa range from UGX 30,000 to UGX 75,000 per 60-minute session. Group support sessions are UGX 25,000 per week. Payment is via MTN or Airtel Mobile Money." },
      { q: "Is online counselling as effective as in-person?", a: "Yes. Research consistently shows online therapy produces the same outcomes as in-person therapy for most concerns — anxiety, depression, stress, grief, relationships. Convenience and privacy often improve attendance, which improves results." },
      { q: "What do I need to start?", a: "A smartphone or laptop, stable internet or mobile data, a private space for 60 minutes, and Mobile Money for payment. That's it." },
      { q: "Are Innerspark therapists actually qualified?", a: "Yes — every therapist is licensed and vetted before joining. We verify qualifications, supervision, and professional registration. You can browse profiles before booking." },
      { q: "Can I switch therapists if it's not the right fit?", a: "Absolutely, and we encourage it. The fit between you and your therapist matters more than anything else. Tell us within 2–3 sessions and we will move you at no extra cost." },
      { q: "Is everything I say confidential?", a: "Yes. Sessions are private between you and your therapist. We do not share details with employers, family, or insurance. The only exception, as required by law worldwide, is if there is risk to your life or someone else's." },
    ],
    resources: [
      { label: "WHO — Mental health and wellbeing", url: "https://www.who.int/health-topics/mental-health" },
      { label: "Uganda Counselling Association", url: "https://www.ucassociation.org/" },
      { label: "Innerspark — Browse online therapists", url: "https://www.innersparkafrica.com/specialists" },
      { label: "Innerspark — Free wellbeing check", url: "https://www.innersparkafrica.com/wellbeing-check" },
    ],
    closing: { headline: "The cost of starting therapy is lower than it has ever been.", primary: "The cost of putting it off is the only one still rising." },
    cta: { heading: "Book your first affordable online session", body: "Sessions from UGX 30,000. Paid by Mobile Money. Private, online, this week.", whatsappText: "Hi, I just read your affordable online counselling article and would like to book a session." },
  };

  return <BlogPostLayout data={data} />;
};

export default AffordableOnlineCounsellingPost;
