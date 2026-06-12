import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const OnlineVsInPersonTherapyUgandaPost = () => {
  const data: BlogPostData = {
    slug: "online-vs-in-person-therapy-uganda",
    category: "Therapy in Uganda",
    title: "Online vs In-Person Therapy in Uganda: Which Is Right for You?",
    metaTitle: "Online vs In-Person Therapy in Uganda — Which Is Right? | Innerspark Africa",
    metaDescription: "Honest 2026 comparison of online and in-person therapy in Uganda — cost (UGX 30,000 vs 200,000+), privacy, effectiveness, who each one fits, and how to decide this week.",
    date: "May 24, 2026",
    isoDate: "2026-05-24",
    readTime: "10 min read",
    keywords: [
      "online vs in-person therapy Uganda",
      "online therapy Uganda",
      "in-person therapy Kampala",
      "therapy cost Uganda",
      "virtual counselling Uganda",
      "best therapy option Uganda",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=75",
    heroAlt:
      "Ugandan woman weighing two therapy options on her laptop at home in Kampala",
    sections: [
      {
        title: "The real question is not which is better — it is which fits you",
        blocks: [
          { type: "lead", text: "If you have decided to start therapy in Uganda, the next question is almost always the same: should I do it online or sit in a clinic in Kampala? The honest answer is that both work — but they fit very different lives, budgets, and situations. This guide helps you choose without wasting a single session." },
          { type: "callout", label: "The short version:", text: "Online therapy in Uganda is cheaper (UGX 30,000–75,000), more private, more flexible, and clinically as effective for most concerns. In-person therapy (UGX 100,000–400,000 per session) is the better choice when you need close monitoring, hands-on assessment, or simply have no private space at home." },
          { type: "p", text: "Below: a head-to-head comparison, the situations where each one wins, what they actually cost in Uganda right now, and how to decide in under five minutes." },
        ],
      },
      {
        title: "Quick side-by-side comparison",
        blocks: [
          { type: "h3", text: "Online therapy" },
          { type: "list", items: [
            <><strong>Cost:</strong> UGX 30,000 – 75,000 per 60-minute session at Innerspark Africa</>,
            <><strong>Where:</strong> Anywhere with mobile data — home, parked car, hotel room</>,
            <><strong>Privacy:</strong> Maximum — no clinic waiting room, no one sees you arrive</>,
            <><strong>Time cost:</strong> Just the 60-minute session, no travel</>,
            <><strong>Therapist choice:</strong> Wider — not limited by what is near you</>,
            <><strong>Best for:</strong> Working professionals, students, parents, anyone outside Kampala</>,
          ]},
          { type: "h3", text: "In-person therapy" },
          { type: "list", items: [
            <><strong>Cost:</strong> UGX 100,000 – 400,000 per session at most Kampala clinics</>,
            <><strong>Where:</strong> A consulting room, usually in Kololo, Naguru, Bugolobi, or a hospital</>,
            <><strong>Privacy:</strong> Lower — someone may see you walk in or out</>,
            <><strong>Time cost:</strong> Session plus 1–3 hours of Kampala traffic</>,
            <><strong>Therapist choice:</strong> Limited to who is geographically near you</>,
            <><strong>Best for:</strong> Severe symptoms, no private space at home, hands-on assessment</>,
          ]},
          { type: "quote", text: "We have clients who tried for years to start in-person therapy and never did. Their first online session was the first time they actually showed up. That difference is everything.", cite: "Innerspark clinical team" },
        ],
      },
      {
        title: "Are they equally effective?",
        blocks: [
          { type: "p", text: "Yes — for almost every common concern. Since 2015 multiple large meta-analyses have compared the two formats and the pattern is clear." },
          { type: "list", items: [
            "Equal outcomes for anxiety, depression, PTSD, stress, grief, and relationship issues",
            "Online therapy often has higher attendance — fewer missed sessions because of traffic, work, or transport money",
            "The therapeutic relationship (the strongest predictor of progress) is just as strong over video",
            "Drop-out rates are lower online, especially for professionals and parents",
          ]},
          { type: "p", text: "In other words, choosing online does not mean choosing less. For most Ugandans it actually means showing up more consistently — which is what makes therapy work." },
        ],
      },
      {
        title: "Choose ONLINE if any of these apply",
        blocks: [
          { type: "checkGrid", items: [
            "You are dealing with anxiety, depression, stress, burnout, grief, or relationship issues",
            "You live outside Kampala or far from a qualified therapist",
            "You work full-time and cannot lose 3 hours to traffic",
            "Privacy matters — you do not want anyone seeing you walk into a clinic",
            "Your budget is tight or you want pay-per-session flexibility",
            "You travel often and need consistent care from anywhere",
            "You are a student or a parent of young children",
          ]},
        ],
      },
      {
        title: "Choose IN-PERSON if any of these apply",
        blocks: [
          { type: "checkGrid", items: [
            "You have active psychosis, severe mania, or symptoms needing close monitoring",
            "You are at acute suicide risk and may need hospital-linked care",
            "You have a severe addiction and may need medical detox",
            "Your home offers no private space at all for 60 minutes",
            "A court has ordered therapy as part of a legal process",
            "You strongly prefer being in the same room as another person",
          ]},
          { type: "p", text: <>If any of these apply, please visit our <Link to="/emergency-support" className="text-primary hover:underline font-medium">emergency support page</Link> or go to Butabika Hospital for immediate help.</> },
        ],
      },
      {
        title: "What each option really costs in Uganda",
        blocks: [
          { type: "h3", text: "Online therapy (per session)" },
          { type: "list", items: [
            "Innerspark Africa: UGX 30,000 – 75,000",
            "Group support online: UGX 25,000 per week",
            "Couples online: UGX 75,000",
          ]},
          { type: "h3", text: "In-person therapy (per session)" },
          { type: "list", items: [
            "Private clinics (Kololo, Naguru, Bugolobi): UGX 100,000 – 300,000",
            "Hospital outpatient (IHK, Nakasero, AAR): UGX 150,000 – 400,000",
            "Government clinics (Butabika, regional): free, but waiting lists are long",
          ]},
          { type: "p", text: "Add transport, time off work, and parking, and a single in-person session in Kampala often costs the equivalent of three to five online sessions. For most people, the same money in online therapy goes much further." },
        ],
      },
      {
        title: "A simple way to decide in 5 minutes",
        blocks: [
          { type: "numberedCards", title: "Three honest questions", items: [
            "Are your symptoms severe enough to need close monitoring or possible medication? If yes, in-person or a referral first. If no, online is fine.",
            "Do you have any private space at home or in a car for 60 minutes a week? If yes, online unlocks consistency. If no, in-person is safer.",
            "Is cost or time the bigger barrier for you right now? If yes, online removes both. If no, choose whichever feels right.",
          ]},
          { type: "highlight", title: "Not sure where you stand?", text: <>Take our free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link> or any of the <Link to="/mind-check" className="text-primary hover:underline font-medium">37 mental health self-assessments</Link>. They give you a clear sense of severity — and therefore which format fits.</> },
        ],
      },
      {
        title: "Can I mix the two?",
        blocks: [
          { type: "p", text: "Yes — and many of our clients do. A common pattern works very well in Uganda:" },
          { type: "list", items: [
            "Start with one in-person assessment if you want to meet your therapist face-to-face",
            "Switch to weekly online sessions once the relationship is built",
            "Go back in-person if something major shifts and you need closer support",
          ]},
          { type: "p", text: "Your therapist will not be offended either way. Their job is to help you progress in the format that lets you keep showing up." },
        ],
      },
      {
        title: "What about the therapist — does the format change quality?",
        blocks: [
          { type: "p", text: "Not at Innerspark Africa. Every therapist on the platform is licensed and vetted, regardless of whether they see you online or in-person. Look for the same things in either format:" },
          { type: "checkGrid", items: [
            "Registration with the Uganda Counselling Association or equivalent",
            "Clear specialisation in your concern (anxiety, grief, couples, addiction, etc.)",
            "Transparent, per-session pricing — no surprise fees",
            "A first conversation that feels safe and unhurried",
            "Permission to switch therapists if the fit is wrong after 2–3 sessions",
            "Clarity about confidentiality and the few legal exceptions",
          ]},
        ],
      },
    ],
    faqs: [
      { q: "Is online therapy as effective as in-person therapy in Uganda?", a: "Yes. Research consistently shows online therapy produces the same outcomes as in-person care for anxiety, depression, stress, grief, trauma, and relationship issues. Attendance is often higher online because there are fewer barriers to showing up." },
      { q: "How much cheaper is online therapy in Uganda?", a: "At Innerspark Africa, online sessions are UGX 30,000–75,000. Comparable in-person sessions in Kampala clinics range from UGX 100,000 to UGX 400,000. Once you add transport, time off work, and parking, online therapy is usually 3–5x cheaper per session." },
      { q: "When should I choose in-person therapy instead?", a: "Choose in-person if you are dealing with active psychosis, severe mania, acute suicide risk, severe addiction needing medical detox, court-ordered therapy, or simply have no private space at home for an online session." },
      { q: "Can I switch from online to in-person (or vice versa)?", a: "Yes. Many clients mix formats — for example, one in-person assessment followed by weekly online sessions. Just tell your therapist what works for you." },
      { q: "Is online therapy private and confidential in Uganda?", a: "Yes. Sessions are encrypted and not recorded. Therapists are bound by Uganda Counselling Association ethics. We never share details with employers, family, or insurance unless there is immediate risk to life." },
      { q: "What if I do not have stable internet?", a: "Voice or chat sessions need very little bandwidth — 3G is enough. If your data is unreliable, we can also arrange phone-call sessions over MTN or Airtel." },
    ],
    resources: [
      { label: "WHO — Mental health and wellbeing", url: "https://www.who.int/health-topics/mental-health" },
      { label: "Uganda Counselling Association", url: "https://www.ucassociation.org/" },
      { label: "Innerspark — Browse therapists", url: "https://www.innersparkafrica.com/specialists" },
      { label: "Innerspark — Free wellbeing check", url: "https://www.innersparkafrica.com/wellbeing-check" },
    ],
    closing: { headline: "There is no \"better\" format. There is only the one you will actually keep showing up to.", primary: "Pick the one that removes your biggest barrier — and start this week." },
    cta: { heading: "Start with the format that fits your life", body: "Online from UGX 30,000 or in-person in Kampala. Paid by Mobile Money, one session at a time.", whatsappText: "Hi, I just read your online vs in-person therapy article and would like help choosing and booking." },
  };

  return <BlogPostLayout data={data} />;
};

export default OnlineVsInPersonTherapyUgandaPost;