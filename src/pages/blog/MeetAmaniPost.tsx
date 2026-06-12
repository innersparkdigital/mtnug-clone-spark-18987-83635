import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const MeetAmaniPost = () => {
  const data: BlogPostData = {
    slug: "meet-amani-ai-mental-wellness-uganda",
    category: "Innerspark Products",
    title: "Meet Amani: The Free AI Mental Wellness Companion Built for Uganda",
    metaTitle: "Meet Amani — Free AI Mental Wellness Companion for Uganda | Innerspark",
    metaDescription: "Amani is Innerspark's free AI mental wellness companion built for Uganda. Available 24/7, fully private, trained on local context — and ready to listen, anytime, in plain English.",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    readTime: "8 min read",
    keywords: ["Amani AI Uganda", "free AI therapist Uganda", "mental wellness chatbot Uganda", "free mental health support Uganda", "AI companion Innerspark", "AI counsellor Africa"],
    heroImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Young Ugandan woman using her phone late at night to chat with the Amani wellness companion",
    sections: [
      { title: "Sometimes you just need someone to listen at 2am", blocks: [
        { type: "lead", text: "It is the middle of the night. You cannot sleep. The thoughts are loud. Calling a friend feels too much, booking a therapist feels like a step too far. This is exactly the gap Amani was built to fill — a calm, private, always-available wellness companion who is ready to listen the moment you open your phone." },
        { type: "callout", label: "The short version:", text: "Amani is Innerspark's free AI mental wellness companion built for Uganda. It listens, asks gentle questions, helps you name what you are feeling, and points you to the right next step — a self-assessment, a breathing exercise, or a real human therapist when you need one." },
        { type: "p", text: "Below: what Amani is, what it is not, who it is for, how your privacy is protected, and how to start talking to it for free, right now." },
      ]},
      { title: "What Amani is", blocks: [
        { type: "iconGrid", items: [
          { icon: "💬", text: "A free, text-based wellness companion" },
          { icon: "🕐", text: "Available 24/7 — including 2am" },
          { icon: "🇺🇬", text: "Trained on Ugandan context, language and life" },
          { icon: "🔒", text: "Anonymous — no name or login required" },
          { icon: "🧠", text: "Built on evidence-based wellbeing approaches" },
          { icon: "🤝", text: "Connected to real human Innerspark therapists" },
        ]},
        { type: "p", text: "Amani is your first calm friend in the middle of a hard moment. It does not judge, does not get tired, and does not run out of patience." },
      ]},
      { title: "What Amani is NOT", blocks: [
        { type: "p", text: "Being honest about this matters. Amani is a wellness companion — not a replacement for human therapy or emergency care." },
        { type: "list", items: [
          "Not a licensed therapist or psychiatrist",
          "Not a crisis service — for emergencies, contact Butabika or our emergency support page",
          "Not a diagnosis tool — it cannot tell you what condition you have",
          "Not a medication prescriber — only a doctor can do that",
          "Not a substitute for ongoing therapy when you genuinely need it",
        ]},
        { type: "p", text: <>If you are in immediate crisis, please visit our <Link to="/emergency-support" className="text-primary hover:underline font-medium">emergency support page</Link> or call Butabika Hospital directly.</> },
      ]},
      { title: "Who Amani is built for", blocks: [
        { type: "checkGrid", items: [
          "Anyone feeling overwhelmed at an inconvenient hour",
          "Students who are not ready to book a therapist yet",
          "Professionals between meetings who need to decompress",
          "Parents who cannot leave the house for a session",
          "People who want to test the water before therapy",
          "Anyone who just needs to be heard without judgement",
        ]},
      ]},
      { title: "What Amani actually does in a conversation", blocks: [
        { type: "numberedCards", title: "A typical chat", items: [
          "You type how you are feeling — even a single sentence is enough.",
          "Amani reflects back what it is hearing, in plain English, without judgement.",
          "It asks gentle, open questions to help you understand the feeling better.",
          "It offers small, evidence-based tools — a breathing exercise, a grounding technique, a thought reframe.",
          "If your situation is heavier, it gently suggests a self-assessment, a real therapist, or our emergency support page.",
        ]},
        { type: "quote", text: "Users tell us they did not realise how much they needed to be listened to until Amani gave them the space. For most, it is the bridge to finally seeing a human therapist.", cite: "Innerspark product team" },
      ]},
      { title: "How your privacy is protected", blocks: [
        { type: "list", items: [
          "No name, phone number, or email required to start",
          "Conversations are encrypted in transit",
          "We never sell or share data with employers, family, or third parties",
          "You can delete your chat history any time",
          "Aggregate, anonymised patterns are used to improve Amani — never individual messages",
        ]},
        { type: "highlight", title: "If you want zero trace at all", text: "Use Amani in your browser's private/incognito mode. Nothing about your visit is stored on your device." },
      ]},
      { title: "When to move from Amani to a human therapist", blocks: [
        { type: "p", text: "Amani is excellent for the moment. A human therapist is essential for sustained change. Reach out for a human session if:" },
        { type: "list", items: [
          "Low mood, anxiety, or panic has lasted more than two weeks",
          "You are struggling to function at work, school, or in relationships",
          "You are using alcohol, weed, or other substances to cope",
          "You are processing trauma, loss, or assault",
          "You ever have thoughts of self-harm or suicide",
          "You just want a structured plan over weeks, not a one-off chat",
        ]},
        { type: "highlight", title: "Ready for a human?", text: <>Start with our free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link>, then book a licensed Innerspark therapist from UGX 30,000 per session.</> },
      ]},
      { title: "How to start chatting with Amani", blocks: [
        { type: "numberedCards", title: "Three steps to your first chat", items: [
          "Open Innerspark Africa on your phone or laptop.",
          "Tap the Amani button in the app or website — no sign-up needed.",
          "Start typing. Even a single sentence is enough to begin.",
        ]},
        { type: "p", text: "There is no time limit. Use Amani for 30 seconds or 30 minutes. It is here whenever you need it — and it is free." },
      ]},
    ],
    faqs: [
      { q: "Is Amani really free to use in Uganda?", a: "Yes. Amani is completely free. No sign-up, no payment, no hidden fees. It is part of Innerspark's commitment to making basic mental wellness accessible to every Ugandan." },
      { q: "Is Amani a replacement for a real therapist?", a: "No. Amani is a wellness companion designed to listen, help you name feelings, and offer evidence-based coping tools. For ongoing care, diagnosis, or treatment, a licensed Innerspark therapist is the right next step." },
      { q: "Is Amani private and confidential?", a: "Yes. No name or login is required, conversations are encrypted, and we never share or sell your messages. Aggregate, anonymised patterns are used to improve the product — never individual messages." },
      { q: "Can Amani help in a crisis or with thoughts of self-harm?", a: "Amani is not a crisis service. If you are in immediate crisis or having thoughts of self-harm, please visit our emergency support page, call Butabika Hospital, or contact a trusted person right away. Amani will always gently redirect you to these resources." },
      { q: "What language does Amani speak?", a: "Currently English, with awareness of common Luganda and Swahili phrases. Future versions will expand local language support." },
      { q: "Will Amani work on a basic smartphone?", a: "Yes. Amani is text-based and very light — it works on a basic smartphone with 3G data, in the Innerspark app or directly on our website." },
    ],
    resources: [
      { label: "Innerspark — Open Amani", url: "https://www.innersparkafrica.com/" },
      { label: "WHO — Mental health and wellbeing", url: "https://www.who.int/health-topics/mental-health" },
      { label: "Butabika National Referral Hospital", url: "https://butabika.go.ug/" },
      { label: "Innerspark — Browse licensed therapists", url: "https://www.innersparkafrica.com/specialists" },
    ],
    closing: { headline: "Some moments are too heavy to carry alone — and too small to call a friend about.", primary: "Amani is here for those moments. Free, private, anytime." },
    cta: { heading: "Try Amani right now — it's free", body: "No sign-up. No login. Just open Innerspark and start chatting. When you're ready for a human, a licensed therapist is one click away.", whatsappText: "Hi, I'd like to learn more about Amani and Innerspark." },
  };
  return <BlogPostLayout data={data} />;
};

export default MeetAmaniPost;