import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const StudentTherapyUgandaPost = () => {
  const data: BlogPostData = {
    slug: "student-therapy-uganda",
    category: "Students & University",
    title: "Student Mental Health in Uganda: Real Support for University Life",
    metaTitle: "Student Mental Health Uganda — Affordable Therapy for University Students | Innerspark",
    metaDescription: "Practical mental health support for Ugandan university students — coping with exams, hostel life, family pressure, and where to find affordable therapy from UGX 30,000.",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    readTime: "10 min read",
    keywords: ["student mental health Uganda", "university therapy Uganda", "student counselling Kampala", "Makerere mental health", "exam stress Uganda", "young adult therapy Kampala"],
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Ugandan university student studying in a quiet campus library in Kampala",
    sections: [
      { title: "Being a student in Uganda is harder than people admit", blocks: [
        { type: "lead", text: "Exams every few weeks. Family expectations heavier than the textbooks. Rent, transport, data, food — all on a budget that never quite stretches. Add relationships, hostel drama, and the quiet question of \"what next?\" and it is no surprise that more Ugandan students than ever are reaching out for help. The good news: affordable, confidential therapy is finally within reach." },
        { type: "callout", label: "The short version:", text: "Therapy is no longer a luxury for Ugandan students. Innerspark offers sessions from UGX 30,000, group support from UGX 25,000 per week, and 37+ free self-assessments. All online, all private, no parent or lecturer ever knows." },
        { type: "p", text: "Below: the most common mental health struggles for Ugandan students, when to actually seek help, what therapy looks like at this stage of life, and how to start this week — even on a student budget." },
      ]},
      { title: "What students in Uganda are really dealing with", blocks: [
        { type: "checkGrid", items: [
          "Exam pressure and constant academic anxiety",
          "Imposter feelings — \"do I even belong here?\"",
          "Family expectations and being the \"first to study\"",
          "Money stress and skipping meals",
          "Relationship and dating struggles",
          "Loneliness despite being surrounded by people",
          "Hostel conflict and lack of privacy",
          "Heavy use of alcohol, weed, or social media to cope",
        ]},
        { type: "p", text: "None of these mean something is wrong with you. They mean you are a human being in a high-pressure stage of life that very few people prepared you for." },
      ]},
      { title: "Signs it is time to talk to someone", blocks: [
        { type: "p", text: "Therapy is not just for crisis. But these signs are a clear nudge to reach out." },
        { type: "list", items: [
          "Low mood or hopelessness that lasts more than two weeks",
          "Anxiety or panic that interferes with classes or sleep",
          "Skipping lectures, tests, or social plans you used to enjoy",
          "Sleeping too much or too little",
          "Drinking or smoking to numb how you feel",
          "Thoughts of self-harm or that life is not worth it",
          "Any major life event — bereavement, breakup, illness, assault — you have not processed",
        ]},
        { type: "p", text: <>If you are in immediate crisis, please visit our <Link to="/emergency-support" className="text-primary hover:underline font-medium">emergency support page</Link> or call Butabika Hospital directly.</> },
      ]},
      { title: "Why most students avoid therapy — and why those reasons no longer hold", blocks: [
        { type: "quote", text: "Students do not avoid therapy because they do not need it. They avoid it because of cost, stigma, and the fear that a parent or lecturer will find out. Online therapy quietly solves all three.", cite: "Innerspark student wellbeing team" },
        { type: "iconGrid", items: [
          { icon: "💳", text: "From UGX 30,000 — less than a night out" },
          { icon: "🔒", text: "No one sees you walk into a clinic" },
          { icon: "📱", text: "Done from your phone, hostel or library" },
          { icon: "🕐", text: "Evenings, weekends, between lectures" },
          { icon: "🌍", text: "Same therapist when you go home for holidays" },
          { icon: "🤝", text: "Group support from UGX 25,000 per week" },
        ]},
      ]},
      { title: "What student-friendly therapy actually looks like", blocks: [
        { type: "numberedCards", title: "Your first 3 sessions", items: [
          "Session 1: A 60-minute conversation. You share what is happening. Your therapist listens, asks gentle questions, and agrees a simple plan with you.",
          "Session 2: Map your patterns — exam triggers, sleep, social anxiety, relationships. You leave with one or two tools you can use this week.",
          "Session 3: Review what is helping. Add small, practical experiments to keep the momentum going. Progress, not perfection.",
        ]},
      ]},
      { title: "Free tools every Ugandan student should try first", blocks: [
        { type: "highlight", title: "Start here — no payment needed", text: <>Take the free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link> or any of the <Link to="/mind-check" className="text-primary hover:underline font-medium">37 mental health self-assessments</Link> — including anxiety, depression, burnout, and sleep. They are private, take a few minutes, and give you a clear sense of what to do next.</> },
        { type: "p", text: <>You can also chat anonymously with <Link to="/meet-amani" className="text-primary hover:underline font-medium">Amani</Link>, our free AI wellness companion, any time of day.</> },
      ]},
      { title: "Budgeting therapy as a student", blocks: [
        { type: "numberedCards", title: "5 ways to make it affordable", items: [
          "Use the free self-assessments and Amani first to clarify your concerns.",
          "Start at the entry rate of UGX 30,000 — designed for students.",
          "Join a support group at UGX 25,000 per week — same therapist, shared cost.",
          "Space sessions every 2 weeks instead of weekly during exam terms.",
          "Ask if your university clinic offers subsidised referrals for ongoing care.",
        ]},
      ]},
      { title: "What you can talk about with a therapist", blocks: [
        { type: "checkGrid", items: [
          "Academic anxiety, procrastination, and exam panic",
          "Family pressure and being misunderstood at home",
          "Relationships, breakups, and dating safely",
          "Sexuality, identity, and self-image",
          "Loss, trauma, or assault you have not spoken about",
          "Alcohol, weed, or social media patterns that feel out of control",
          "Hopelessness and thoughts of self-harm",
          "Just feeling lost — and wanting a clearer plan",
        ]},
      ]},
    ],
    faqs: [
      { q: "Will my parents or lecturers find out if I see a therapist?", a: "No. Sessions are completely confidential. We do not share information with parents, lecturers, or your university unless there is immediate risk to life — the same rule applied worldwide. Many students even pay with their own Mobile Money to stay fully private." },
      { q: "How much does therapy cost for a Ugandan student?", a: "Innerspark Africa sessions start at UGX 30,000. Group support is UGX 25,000 per week. We also offer 37+ free self-assessments and Amani, our free AI wellness companion, so you can get value without spending anything." },
      { q: "Can I do therapy from my hostel?", a: "Yes. All you need is a phone, headphones, mobile data, and 60 minutes in a private space. If your hostel feels crowded, sessions can be done by voice or chat instead of video." },
      { q: "Is there free or subsidised support at universities in Uganda?", a: "Yes — Makerere, Kyambogo, Mbarara, and several private universities now have wellness or counselling units. Innerspark also partners with universities for subsidised care. Ask your dean of students." },
      { q: "I just need someone to talk to — is that worth therapy?", a: "Absolutely. You do not need a diagnosis to deserve support. Many of our student clients come in just wanting clarity about life, family, or relationships — and leave with practical tools and a calmer mind." },
      { q: "Can I switch therapists if it doesn't feel right?", a: "Yes — and you should. Tell us within the first 2–3 sessions and we will reassign you at no extra cost. Fit matters more than reputation." },
    ],
    resources: [
      { label: "WHO — Adolescent and youth mental health", url: "https://www.who.int/health-topics/adolescent-health" },
      { label: "Makerere University Counselling and Guidance Centre", url: "https://www.mak.ac.ug/" },
      { label: "Innerspark — Browse student-friendly therapists", url: "https://www.innersparkafrica.com/specialists" },
      { label: "Innerspark — Free wellbeing check", url: "https://www.innersparkafrica.com/wellbeing-check" },
    ],
    closing: { headline: "Being a student in Uganda is heavy. You are not weak for finding it heavy.", primary: "One good session can change the next four years of your life." },
    cta: { heading: "Start with one student-friendly session", body: "Sessions from UGX 30,000. Group support from UGX 25,000 per week. Paid by Mobile Money, fully confidential.", whatsappText: "Hi, I'm a student in Uganda and would like to book my first therapy session." },
  };
  return <BlogPostLayout data={data} />;
};

export default StudentTherapyUgandaPost;