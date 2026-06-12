import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const FindTherapistUgandaPost = () => {
  const data: BlogPostData = {
    slug: "find-a-therapist-in-uganda",
    category: "Therapy in Uganda",
    title: "How to Find a Licensed Therapist in Uganda — A 2026 Guide",
    metaTitle: "How to Find a Licensed Therapist in Uganda — Vetted, Affordable | Innerspark",
    metaDescription: "A clear 2026 guide to finding a licensed therapist anywhere in Uganda — what licensing actually means, where to look, realistic costs (UGX 30,000–400,000), red flags, and how to book this week.",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    readTime: "10 min read",
    keywords: ["find a therapist in Uganda", "licensed therapist Uganda", "best therapist Kampala", "online therapist Uganda", "counsellor Uganda", "psychologist Uganda"],
    heroImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Ugandan client and licensed therapist in a calm, professional therapy session",
    sections: [
      { title: "Finding a licensed therapist in Uganda is finally easier — but you still need to know what to look for", blocks: [
        { type: "lead", text: "More Ugandans are reaching out for therapy than at any point in our history. The supply of professional help has grown to meet that demand — but so has the number of people calling themselves \"therapists\" without proper training. This guide shows you exactly how to tell the difference, where to find a genuinely licensed therapist, and how to start safely this week." },
        { type: "callout", label: "The short version:", text: "A licensed therapist in Uganda is registered with the Uganda Counselling Association or the Allied Health Professionals Council, trained in evidence-based therapy (CBT, ACT, EMDR), transparent about fees (UGX 30,000–400,000 per session), and someone you feel safe with after the first conversation." },
        { type: "p", text: "Below: what \"licensed\" actually means in Uganda, where to look, what to ask, red flags to walk away from, and a four-step path to booking your first session." },
      ]},
      { title: "What \"licensed\" actually means in Uganda", blocks: [
        { type: "p", text: "Uganda has clear professional bodies. A genuinely licensed therapist will hold one or more of the following — and will confirm it in writing without hesitation." },
        { type: "h3", text: "The recognised bodies" },
        { type: "list", items: [
          <><strong>Uganda Counselling Association (UCA):</strong> Counsellors and psychotherapists.</>,
          <><strong>Allied Health Professionals Council (AHPC):</strong> Clinical psychologists and allied mental health professionals.</>,
          <><strong>Uganda Medical & Dental Practitioners Council:</strong> Psychiatrists (medical doctors with specialist mental health training).</>,
          <><strong>Uganda Christian Counsellors Association / Pastoral bodies:</strong> Faith-based counsellors with formal training.</>,
        ]},
        { type: "p", text: "If a therapist cannot point you to which of these they are registered with, they are not licensed — full stop. That does not always mean they are unsafe, but you have no recourse if something goes wrong." },
      ]},
      { title: "What kind of therapist do you actually need?", blocks: [
        { type: "h3", text: "Counsellor / psychotherapist" },
        { type: "p", text: "Trained in supportive talk therapy and short-term help. Excellent for grief, stress, relationship issues, and life transitions. Registered with UCA." },
        { type: "h3", text: "Clinical psychologist" },
        { type: "p", text: "Holds at least a Master's in Clinical Psychology, trained in assessment and evidence-based therapy (CBT, ACT, EMDR). Best for anxiety, depression, trauma, complex relationship patterns. Registered with AHPC. Cannot prescribe medication." },
        { type: "h3", text: "Psychiatrist" },
        { type: "p", text: "A medical doctor with specialist psychiatry training. Can diagnose and prescribe medication. Best when symptoms are severe or you may need medication." },
        { type: "p", text: "For most concerns, a counsellor or clinical psychologist is the right starting point. You can always be referred to a psychiatrist later if needed." },
      ]},
      { title: "Where to find a licensed therapist in Uganda right now", blocks: [
        { type: "iconGrid", items: [
          { icon: "🌐", text: "Innerspark Africa — vetted, online + in-person" },
          { icon: "🏥", text: "Hospitals — IHK, Nakasero, AAR outpatient" },
          { icon: "🏢", text: "Private clinics in Kampala (Kololo, Naguru)" },
          { icon: "🎓", text: "University clinics (Makerere, Kyambogo, Mbarara)" },
          { icon: "🏛️", text: "Butabika National Referral Hospital" },
          { icon: "📞", text: "Uganda Counselling Association directory" },
        ]},
        { type: "p", text: "Each route has trade-offs. Hospitals and private clinics are convenient but expensive. Butabika and university clinics are affordable but often have waiting lists. Vetted online platforms like Innerspark let you start this week from anywhere in the country — including outside Kampala." },
      ]},
      { title: "What it should cost in Uganda right now", blocks: [
        { type: "list", items: [
          <><strong>Innerspark Africa (online or hybrid):</strong> UGX 30,000 – 75,000 per session</>,
          <><strong>Private clinics in Kampala:</strong> UGX 100,000 – 300,000 per session</>,
          <><strong>Hospitals (IHK, Nakasero, AAR):</strong> UGX 150,000 – 400,000 per session</>,
          <><strong>Butabika Hospital:</strong> Free, expect a waiting list</>,
          <><strong>University clinics:</strong> Free or subsidised for students</>,
        ]},
        { type: "p", text: "Most people see meaningful progress in 6–12 sessions. If a clinic refuses to give you a per-session price upfront, that is a red flag." },
      ]},
      { title: "Green flags: what a great licensed therapist does", blocks: [
        { type: "checkGrid", items: [
          "Confirms registration and qualifications in writing on request",
          "Explains their approach in plain language, not jargon",
          "Agrees clear, gentle goals with you in the first 1–2 sessions",
          "Gives you small things to try between sessions",
          "Welcomes questions about fees, confidentiality, and methods",
          "Refers you on if you need medication or a different specialism",
        ]},
      ]},
      { title: "Red flags — walk away if you see these", blocks: [
        { type: "list", items: [
          "Refuses to confirm qualifications or registration in writing",
          "Promises a \"cure\" in a fixed number of sessions",
          "Pressures you to pay for long packages upfront",
          "Crosses personal or financial boundaries",
          "Tells you to stop medication without consulting your doctor",
          "Mixes therapy with selling supplements, retreats, or coaching upsells",
          "Talks about other clients in ways that breach confidentiality",
        ]},
      ]},
      { title: "How to choose your therapist in 4 steps", blocks: [
        { type: "numberedCards", title: "A simple, low-pressure path", items: [
          "Take a free self-assessment so you can describe what you experience.",
          "Browse 2–3 vetted licensed therapists on Innerspark and read their specialisations.",
          "Book one first session — never a long package — and notice how you feel afterwards.",
          "If the fit is not right after 2–3 sessions, ask to switch. It is normal and free.",
        ]},
        { type: "highlight", title: "Need help picking?", text: <>Take our free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link> or one of the <Link to="/mind-check" className="text-primary hover:underline font-medium">37 mental health self-assessments</Link>. They make it easier to describe what you are dealing with — and to pick a therapist whose specialism actually fits.</> },
      ]},
    ],
    faqs: [
      { q: "How do I know if a therapist in Uganda is licensed?", a: "Ask them which professional body they are registered with — Uganda Counselling Association (counsellors), Allied Health Professionals Council (psychologists), or Uganda Medical & Dental Practitioners Council (psychiatrists). A licensed therapist will confirm this in writing without hesitation." },
      { q: "How much does a licensed therapist cost in Uganda?", a: "Vetted online platforms like Innerspark charge UGX 30,000–75,000 per session. Private clinics in Kampala charge UGX 100,000–300,000. Hospitals charge UGX 150,000–400,000. Butabika Hospital and university clinics offer free or subsidised care with waiting lists." },
      { q: "Can I see a licensed Ugandan therapist online?", a: "Yes. Innerspark and many private practices offer secure online sessions via WhatsApp, Zoom, or in-app. Outcomes are the same as in-person for most concerns, and it is much cheaper. You can also see your therapist consistently if you travel or relocate." },
      { q: "Counsellor, psychologist or psychiatrist — which one do I need?", a: "Start with a counsellor or clinical psychologist for most concerns. See a psychiatrist if symptoms are severe, you may need medication, or you have a complex condition such as bipolar disorder or psychosis. Your therapist can refer you when needed." },
      { q: "How many sessions will I need?", a: "Most people experience meaningful progress in 6–12 sessions. Mild concerns can shift in fewer; long-standing or trauma-related concerns may take more. A good therapist will agree the plan with you and review it openly." },
      { q: "Can I switch therapists if it's not the right fit?", a: "Yes — and you should. Fit matters more than reputation. Tell us within the first 2–3 sessions and we will reassign you at no extra cost." },
    ],
    resources: [
      { label: "Uganda Counselling Association", url: "https://www.ucassociation.org/" },
      { label: "Allied Health Professionals Council Uganda", url: "https://ahpc.go.ug/" },
      { label: "Butabika National Referral Hospital", url: "https://butabika.go.ug/" },
      { label: "Innerspark — Browse licensed therapists", url: "https://www.innersparkafrica.com/specialists" },
    ],
    closing: { headline: "Finding a licensed therapist in Uganda used to take months. It now takes a single afternoon.", primary: "One vetted session this week is worth more than another year of waiting." },
    cta: { heading: "Book a licensed Ugandan therapist", body: "Sessions from UGX 30,000. Online or in-person. Paid by Mobile Money, one session at a time.", whatsappText: "Hi, I just read your guide on finding a licensed therapist in Uganda and would like to book." },
  };
  return <BlogPostLayout data={data} />;
};

export default FindTherapistUgandaPost;