import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const TherapyCostUgandaPost = () => {
  const data: BlogPostData = {
    slug: "therapy-cost-uganda",
    category: "Therapy Cost",
    title: "How Much Does Therapy Cost in Uganda? An Honest 2026 Price Guide",
    metaTitle: "Therapy Cost in Uganda 2026: Honest Price Guide | Innerspark Africa",
    metaDescription: "What therapy really costs in Uganda in 2026 — online vs in-person rates, sliding scales, group sessions, hidden costs, and how to make it affordable. From UGX 30,000 per session at Innerspark Africa.",
    date: "February 6, 2026",
    isoDate: "2026-02-06",
    readTime: "8 min read",
    keywords: ["therapy cost Uganda", "how much does therapy cost in Uganda", "affordable therapy Kampala", "online therapy price Uganda", "counselling fees Uganda", "psychologist cost Kampala"],
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Mobile Money payment being made on a phone — paying for affordable online therapy in Uganda",
    sections: [
      {
        title: "The honest 2026 price range for therapy in Uganda",
        blocks: [
          { type: "lead", text: "There is no single \"price of therapy\" in Uganda — rates depend on the therapist's qualifications, the setting, the format, and the city. To save you scrolling through endless WhatsApp groups, here is the realistic range you should expect to see in 2026, with no hidden upsells." },
          { type: "callout", label: "Quick answer:", text: "Most Ugandan therapy sessions cost between UGX 30,000 and UGX 200,000. At Innerspark Africa, sessions start at UGX 30,000 with a standard rate of UGX 75,000 (around $22) per 60-minute session." },
        ],
      },
      {
        title: "The full 2026 price landscape",
        blocks: [
          { type: "h3", text: "Online therapy (the most affordable)" },
          { type: "list", items: [
            <><strong>Entry-level (interns / trainees):</strong> UGX 20,000 – 40,000 per session</>,
            <><strong>Licensed counsellor:</strong> UGX 50,000 – 90,000 per session</>,
            <><strong>Clinical psychologist:</strong> UGX 100,000 – 180,000 per session</>,
            <><strong>Psychiatrist consultation:</strong> UGX 150,000 – 300,000 per visit</>,
          ]},
          { type: "h3", text: "In-person therapy in Kampala" },
          { type: "list", items: [
            "Government referral clinics — free, but long waiting lists",
            "NGO / community clinics — UGX 10,000 – 30,000 per session",
            "Private practices in Kololo, Bugolobi, Naguru — UGX 100,000 – 300,000 per session",
            "Hospital outpatient (Nakasero, IHK, AAR) — UGX 150,000 – 400,000 per session",
          ]},
          { type: "h3", text: "Group therapy and workshops" },
          { type: "list", items: [
            "Innerspark support groups — UGX 25,000 per week",
            "Workshop series — UGX 50,000 – 150,000 for a 4-week programme",
            "Peer-led support groups — usually free, donation-based",
          ]},
        ],
      },
      {
        title: "Why prices vary so much",
        blocks: [
          { type: "p", text: "Two therapists in the same city can charge wildly different fees. Here is what is actually being priced." },
          { type: "numberedCards", title: "What you're paying for", items: [
            "Years of clinical training — a registered clinical psychologist has 6–8+ years; an intern has 1–2",
            "Specialisation — trauma, couples, addictions, child therapy all add depth and cost",
            "Setting — a clinic in Kololo carries rent that gets passed on; online has lower overhead",
            "Insurance and supervision — registered practitioners pay annual fees to professional bodies",
            "Time outside the session — case notes, prep, supervision typically equals 30 minutes per session",
          ]},
          { type: "quote", text: "Expensive does not always mean better — and cheap does not always mean lower quality. The fit between client and therapist matters more than the price tag.", cite: "Innerspark clinical team" },
        ],
      },
      {
        title: "How to make therapy genuinely affordable",
        blocks: [
          { type: "checkGrid", items: [
            "Choose online over in-person — saves transport and time",
            "Ask about sliding-scale rates for students or low income",
            "Start with a single session, not a 12-week commitment",
            "Join a support group at UGX 25,000 per week",
            "Use free tools first — WHO-5 check, self-assessments, podcasts",
            "Check if your employer has a wellbeing programme that covers it",
          ]},
          { type: "highlight", title: "If money is genuinely a barrier", text: <>Start with our free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link> and free <Link to="/mind-check" className="text-primary hover:underline font-medium">mind-check assessments</Link>. They give you a clear picture before you spend a shilling, and our team can match you with the most affordable suitable option.</> },
        ],
      },
      {
        title: "Hidden costs people forget to ask about",
        blocks: [
          { type: "list", items: [
            <><strong>Cancellation fees.</strong> Most private therapists charge for sessions cancelled with less than 24 hours' notice. Always ask.</>,
            <><strong>Assessment fees.</strong> Some clinics charge a one-off intake assessment fee on top of the session rate.</>,
            <><strong>Reports.</strong> Letters for HR, lawyers, or schools often cost extra (UGX 50,000–200,000).</>,
            <><strong>Transport (in-person).</strong> Twice-weekly sessions in Kampala traffic can add UGX 60,000+ a month in fuel or boda fares.</>,
            <><strong>Time off work.</strong> Often the biggest hidden cost — which is why most Ugandans now choose online sessions in their lunch break.</>,
          ]},
        ],
      },
      {
        title: "Innerspark Africa pricing in plain English",
        blocks: [
          { type: "iconGrid", items: [
            { icon: "💬", text: "Individual therapy — UGX 30,000–75,000 / session" },
            { icon: "👥", text: "Group support — UGX 25,000 / week" },
            { icon: "💑", text: "Couples therapy — UGX 75,000 / session" },
            { icon: "🧒", text: "Teen therapy — UGX 75,000 / session" },
            { icon: "📱", text: "Pay via MTN or Airtel Mobile Money" },
            { icon: "🆓", text: "Free wellbeing check before you book" },
          ]},
          { type: "p", text: <>All sessions are 60 minutes, conducted on WhatsApp video, voice, or chat — whichever you prefer. <Link to="/specialists" className="text-primary hover:underline">Browse therapists and book</Link> in under two minutes.</> },
        ],
      },
    ],
    faqs: [
      { q: "What is the cheapest legitimate therapy option in Uganda?", a: "Group support sessions at UGX 25,000 per week are the most affordable structured option. Free WHO-5 wellbeing checks and self-assessments are available before that. Government hospitals and NGO clinics offer free care but typically have long waiting lists." },
      { q: "Does insurance cover therapy in Uganda?", a: "A growing number of insurers (UAP, ICEA, AAR, Jubilee) now include mental health benefits for premium plans, often with a session cap per year. Always confirm with your provider before booking." },
      { q: "Why is online therapy cheaper than in-person?", a: "Lower overhead — no clinic rent, no traffic time, the therapist can see more clients in a day. The clinical effectiveness is the same for most concerns." },
      { q: "Can I pay per session or do I commit to a package?", a: "At Innerspark you pay per session — no packages, no long-term commitments. Many clients start with one session to test fit." },
      { q: "Is UGX 30,000 too cheap to be good?", a: "No — entry-level rates support clients who genuinely cannot afford full fees, and our entire team is supervised and qualified. We believe price should not be the reason someone goes without support." },
    ],
    resources: [
      { label: "Uganda Counselling Association — Find a registered counsellor", url: "https://www.ucassociation.org/" },
      { label: "WHO — Mental health financing report", url: "https://www.who.int/teams/mental-health-and-substance-use" },
      { label: "Innerspark — Pricing and booking", url: "https://www.innersparkafrica.com/specialists" },
    ],
    closing: { headline: "Therapy in Uganda is more affordable than most people think.", primary: "The cost of doing nothing is almost always higher." },
    cta: { heading: "Start with a session that fits your budget", body: "From UGX 30,000 per session. Pay by Mobile Money. Cancel anytime.", whatsappText: "Hi, I just read your therapy cost guide and would like to book an affordable session." },
  };

  return <BlogPostLayout data={data} />;
};

export default TherapyCostUgandaPost;
