import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const HowToFindPsychologistKampalaPost = () => {
  const data: BlogPostData = {
    slug: "how-to-find-psychologist-in-kampala",
    category: "Therapy in Kampala",
    title: "How to Find a Good Psychologist in Kampala: A Practical 2026 Guide",
    metaTitle: "How to Find a Good Psychologist in Kampala — Vetted, Affordable | Innerspark",
    metaDescription: "A clear, practical guide to finding a vetted psychologist in Kampala — qualifications to check, realistic costs (UGX 30,000–300,000), where to look, red flags, and how to book this week.",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    readTime: "10 min read",
    keywords: ["psychologist in Kampala", "find a psychologist Kampala", "best psychologist Uganda", "licensed therapist Kampala", "affordable psychologist Kampala", "online psychologist Uganda"],
    heroImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Ugandan client meeting a licensed psychologist in a calm Kampala consulting room",
    sections: [
      { title: "Finding the right psychologist in Kampala matters more than people realise", blocks: [
        { type: "lead", text: "Kampala has more qualified psychologists than ever — and more people calling themselves \"therapists\" without proper training. The difference between a good and a bad fit can be the difference between feeling better in 6 weeks and giving up on therapy entirely. This guide shows you exactly how to find someone who actually knows what they are doing." },
        { type: "callout", label: "The short version:", text: "A good psychologist in Kampala is registered with the Uganda Counselling Association or the Allied Health Professionals Council, trained in evidence-based therapy (CBT, ACT, EMDR), transparent about fees (UGX 30,000–300,000 per session), and someone you feel safe with after the first conversation." },
        { type: "p", text: "Below: what to look for, where to actually find them, what they should cost, the red flags that should make you walk away, and a four-step path to booking your first session this week." },
      ]},
      { title: "Psychologist vs counsellor vs psychiatrist — what's the difference?", blocks: [
        { type: "h3", text: "Clinical psychologist" },
        { type: "p", text: "Holds at least a Master's in Clinical Psychology, trained in assessment and evidence-based talk therapy (CBT, ACT, EMDR). Best for anxiety, depression, trauma, relationship issues, life transitions. Cannot prescribe medication." },
        { type: "h3", text: "Counsellor / psychotherapist" },
        { type: "p", text: "Holds a diploma or degree in counselling. Trained in supportive talk therapy and short-term help. Excellent for grief, stress, relationship issues, and life adjustment. Should be registered with the Uganda Counselling Association." },
        { type: "h3", text: "Psychiatrist" },
        { type: "p", text: "A medical doctor with specialist psychiatry training. Can diagnose and prescribe medication. Best when symptoms are severe, you may need medication, or you have a complex condition such as bipolar disorder or psychosis." },
        { type: "p", text: "For most concerns in Kampala, a clinical psychologist or a registered counsellor is the right starting point. You can always be referred to a psychiatrist later if needed." },
      ]},
      { title: "What \"good\" actually looks like", blocks: [
        { type: "numberedCards", title: "Five things that matter most", items: [
          "Proper registration with the Uganda Counselling Association or Allied Health Professionals Council",
          "Specific training in your concern — anxiety, trauma, couples, addiction, child therapy",
          "Transparent, per-session pricing — no surprise fees or pressure to pay for long packages",
          "Availability that fits your life — evenings, weekends, online, or in Kampala in-person",
          "A first conversation that feels safe — fit beats reputation every single time",
        ]},
      ]},
      { title: "Where to actually find a good psychologist in Kampala", blocks: [
        { type: "iconGrid", items: [
          { icon: "🌐", text: "Innerspark Africa — vetted, online + in-person" },
          { icon: "🏥", text: "Hospitals — IHK, Nakasero, AAR outpatient" },
          { icon: "🏢", text: "Private clinics in Kololo, Naguru, Bugolobi" },
          { icon: "🎓", text: "Makerere & Kyambogo university clinics" },
          { icon: "🏛️", text: "Butabika Hospital — free, government-run" },
          { icon: "📞", text: "Uganda Counselling Association directory" },
        ]},
        { type: "p", text: "Each route has trade-offs. Hospitals and private clinics are convenient but expensive. Butabika and university clinics are affordable but often have waiting lists. Online vetted platforms like Innerspark let you start this week from anywhere in the country." },
      ]},
      { title: "What it should cost in Kampala right now", blocks: [
        { type: "list", items: [
          <><strong>Innerspark Africa (online or hybrid):</strong> UGX 30,000 – 75,000 per 60-minute session</>,
          <><strong>Private clinics (Kololo, Naguru, Bugolobi):</strong> UGX 100,000 – 300,000 per session</>,
          <><strong>Hospital outpatient (IHK, Nakasero, AAR):</strong> UGX 150,000 – 400,000 per session</>,
          <><strong>Butabika Hospital:</strong> Free, but expect longer waiting times</>,
          <><strong>University clinics:</strong> Free or subsidised for students</>,
        ]},
        { type: "p", text: "Most people see meaningful progress in 6–12 sessions. A good rule: if a clinic refuses to give you a per-session price upfront, that is a red flag." },
      ]},
      { title: "Red flags — walk away if you see these", blocks: [
        { type: "list", items: [
          "Refuses to confirm qualifications or registration in writing",
          "Promises a \"cure\" in a fixed number of sessions",
          "Pressures you to pay for long packages upfront",
          "Talks more about themselves than they listen to you",
          "Crosses personal or financial boundaries",
          "Tells you to stop medication without consulting your doctor",
          "Mixes therapy with selling supplements, retreats, or coaching upsells",
        ]},
      ]},
      { title: "How to choose in 4 simple steps", blocks: [
        { type: "numberedCards", title: "A low-pressure path", items: [
          "Take a free self-assessment so you can describe what you experience clearly.",
          "Browse 2–3 vetted psychologists and read their specialisations.",
          "Book just one first session — never a long package — and notice how you feel afterwards.",
          "If the fit is not right after 2–3 sessions, ask to switch. It is normal and should be free.",
        ]},
        { type: "highlight", title: "Not sure what kind of help you need?", text: <>Take our free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link> or browse our <Link to="/mind-check" className="text-primary hover:underline font-medium">37 mental health self-assessments</Link>. They help you describe what you are dealing with — and make picking the right psychologist easier.</> },
      ]},
      { title: "What a first session in Kampala actually feels like", blocks: [
        { type: "p", text: "If you have never seen a psychologist before, the unknown is often the scariest part. Here is what really happens." },
        { type: "numberedCards", title: "Your first 3 sessions", items: [
          "Session 1: A 60-minute conversation. You share what is happening. The psychologist listens, asks gentle questions, and agrees a simple plan with you. No homework, no pressure.",
          "Session 2: You begin to map your pattern — triggers, thoughts, body sensations, behaviours. You leave with 1–2 practical techniques you can use immediately.",
          "Session 3: You review what is helping, refine the plan, and start small, paced experiments. Progress, not perfection.",
        ]},
      ]},
    ],
    faqs: [
      { q: "How do I know if a Kampala psychologist is actually qualified?", a: "Ask for their qualification (Master's in Clinical Psychology or registered counselling diploma) and their registration with the Uganda Counselling Association or Allied Health Professionals Council. Any good psychologist will confirm this in writing without hesitation." },
      { q: "How much does a psychologist cost in Kampala?", a: "Online platforms like Innerspark Africa charge UGX 30,000–75,000 per session. Private clinics in Kololo/Naguru charge UGX 100,000–300,000. Hospitals charge UGX 150,000–400,000. Butabika Hospital and university clinics offer free or subsidised care with waiting lists." },
      { q: "Should I see a psychologist, counsellor, or psychiatrist?", a: "Start with a psychologist or counsellor for most concerns. See a psychiatrist if your symptoms are severe, you may need medication, or you have a complex condition such as bipolar disorder or psychosis. Your psychologist can refer you when needed." },
      { q: "Can I see a Kampala psychologist online?", a: "Yes. Innerspark Africa and many private practices now offer secure online sessions over WhatsApp, Zoom, or in-app. Outcomes are the same as in-person for most concerns, and it is significantly more affordable." },
      { q: "How many sessions will I need?", a: "Most people experience meaningful progress in 6–12 sessions. Mild concerns can shift in fewer; long-standing or trauma-related concerns may take more. A good psychologist will agree a plan with you and review it openly." },
      { q: "Can I switch psychologists if it's not the right fit?", a: "Yes — and you should. Fit matters more than reputation. Tell the platform within the first 2–3 sessions and you should be reassigned at no extra cost." },
    ],
    resources: [
      { label: "Uganda Counselling Association", url: "https://www.ucassociation.org/" },
      { label: "Allied Health Professionals Council Uganda", url: "https://ahpc.go.ug/" },
      { label: "Butabika National Referral Hospital", url: "https://butabika.go.ug/" },
      { label: "Innerspark — Browse Kampala psychologists", url: "https://www.innersparkafrica.com/specialists" },
    ],
    closing: { headline: "Finding the right psychologist in Kampala is easier than it has ever been.", primary: "One vetted session this week is worth more than another year of waiting." },
    cta: { heading: "Book a vetted Kampala psychologist", body: "Sessions from UGX 30,000. Online or in-person in Kampala. Paid by Mobile Money, one session at a time.", whatsappText: "Hi, I just read your guide on finding a psychologist in Kampala and would like to book a session." },
  };
  return <BlogPostLayout data={data} />;
};

export default HowToFindPsychologistKampalaPost;