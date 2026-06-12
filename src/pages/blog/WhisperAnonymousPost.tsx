import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const WhisperAnonymousPost = () => {
  const data: BlogPostData = {
    slug: "whisper-anonymous-therapy-uganda",
    category: "Innerspark Products",
    title: "Too Heavy to Type? Try Whisper — Anonymous, Free Therapist Replies in Uganda",
    metaTitle: "Whisper — Free Anonymous Therapist Replies for Ugandans | Innerspark",
    metaDescription: "Whisper lets you send one fully anonymous message to an InnerSpark therapist in Uganda and get a real, human reply within 48 hours. No name, no payment, no judgement.",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    readTime: "8 min read",
    keywords: ["anonymous therapy Uganda", "free therapist reply Uganda", "anonymous mental health Uganda", "Whisper Innerspark", "anonymous counselling Kampala", "free emotional support Uganda"],
    heroImage: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Ugandan woman quietly writing on her phone late at night, sending an anonymous message",
    sections: [
      { title: "Some things are too heavy to say out loud — even to a therapist", blocks: [
        { type: "lead", text: "There are thoughts you have never told anyone. A shame, a fear, a memory, a question. The idea of saying them in a video session feels impossible. So you carry them silently — for years. Whisper exists for those exact thoughts." },
        { type: "callout", label: "The short version:", text: "Whisper lets you send one fully anonymous message to a licensed Innerspark therapist in Uganda. No name, no phone number, no payment. A real human therapist reads it and writes you a personal, thoughtful reply within 48 hours." },
        { type: "p", text: "Below: what Whisper is, who it is for, how it is different from chatting with an AI, how your anonymity is protected, and how to send your first message in under two minutes." },
      ]},
      { title: "What Whisper actually is", blocks: [
        { type: "iconGrid", items: [
          { icon: "✉️", text: "One anonymous message you write at your own pace" },
          { icon: "👤", text: "A real, licensed Ugandan therapist replies" },
          { icon: "⏱️", text: "Reply within 48 hours" },
          { icon: "🔒", text: "Fully anonymous — no name, no login" },
          { icon: "💸", text: "Free — no payment ever requested" },
          { icon: "🇺🇬", text: "Built and staffed in Uganda" },
        ]},
        { type: "p", text: "Whisper is not a chatbot. The reply you get is written by a human being who has been trained to hold heavy stories with care." },
      ]},
      { title: "Who Whisper is built for", blocks: [
        { type: "checkGrid", items: [
          "People carrying something they have never told anyone",
          "Survivors of abuse, assault, or trauma not ready to speak yet",
          "Anyone struggling with shame around identity, sexuality, or relationships",
          "Those who think they cannot afford therapy",
          "People who tried therapy once and were not ready",
          "Young Ugandans afraid family will find out",
          "Anyone testing whether they can trust a therapist with what they really feel",
        ]},
      ]},
      { title: "How Whisper is different from AI like Amani", blocks: [
        { type: "p", text: "Both are free. Both are anonymous. They serve different needs." },
        { type: "h3", text: "Amani (AI companion)" },
        { type: "list", items: [
          "Instant back-and-forth chat, any time of day",
          "Best for in-the-moment overwhelm and coping tools",
          "AI-powered, not a human therapist",
        ]},
        { type: "h3", text: "Whisper (human therapist reply)" },
        { type: "list", items: [
          "One written message in, one written reply back",
          "Best for the things you have never said out loud",
          "A real licensed therapist reads and responds personally",
          "Reply within 48 hours, not instant — but it is a human",
        ]},
        { type: "quote", text: "Whisper users often say the same thing — typing what they have carried for years was the hardest part. Once they sent it, something quietly shifted, even before the reply arrived.", cite: "Innerspark Whisper team" },
      ]},
      { title: "What a Whisper reply looks like", blocks: [
        { type: "p", text: "A typical Whisper reply is 200–400 words. It is personal, written specifically for your message, and follows a calm structure." },
        { type: "numberedCards", title: "What you'll receive", items: [
          "An acknowledgement of what you have shared — without judgement or shock.",
          "A reflection that helps you see the situation more clearly.",
          "One or two practical, gentle next steps you can try this week.",
          "An invitation to take a free self-assessment or speak to a human therapist if you want more support.",
        ]},
      ]},
      { title: "How your anonymity is protected", blocks: [
        { type: "list", items: [
          "No name, phone number, or email required to send a Whisper",
          "Your message is encrypted in transit and at rest",
          "Only the assigned therapist and one senior reviewer read your message",
          "We never share or sell data with employers, family, or third parties",
          "You can request deletion of your message at any time",
          "Replies are delivered back to you privately, on the device you sent from",
        ]},
        { type: "highlight", title: "Want zero trace?", text: "Send your Whisper from your browser's private/incognito mode. Nothing about your visit is stored on your device." },
      ]},
      { title: "What Whisper is NOT", blocks: [
        { type: "list", items: [
          "Not a substitute for ongoing therapy when you genuinely need it",
          "Not a crisis service — for emergencies, visit our emergency support page or contact Butabika",
          "Not a way to receive a clinical diagnosis",
          "Not a place to message back and forth — it is one message, one reply",
        ]},
        { type: "p", text: <>If you are in immediate crisis, please visit our <Link to="/emergency-support" className="text-primary hover:underline font-medium">emergency support page</Link>.</> },
      ]},
      { title: "How to send your first Whisper", blocks: [
        { type: "numberedCards", title: "Three steps, no payment", items: [
          "Open the Whisper page on Innerspark Africa.",
          "Type your message — short or long, raw or polished, however it comes out.",
          "Submit anonymously. A licensed Ugandan therapist will reply within 48 hours.",
        ]},
        { type: "highlight", title: "Need more than one reply?", text: <>If you want an ongoing conversation, the natural next step is a licensed Innerspark therapy session from UGX 30,000. Start with our free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link> to find the right fit.</> },
      ]},
    ],
    faqs: [
      { q: "Is Whisper really free and anonymous?", a: "Yes. There is no payment, no sign-up, no name, no phone number. You write a message anonymously and a licensed Ugandan therapist replies within 48 hours." },
      { q: "Is it a real human or an AI replying?", a: "A real, licensed Ugandan therapist reads your message and writes a personal reply. It is not an AI. (If you want an instant AI chat, use Amani instead — also free.)" },
      { q: "How long does a Whisper reply take?", a: "Up to 48 hours. Most replies arrive within 24 hours. If your situation is urgent or involves immediate risk, please contact our emergency support page or Butabika Hospital directly — Whisper is not a crisis service." },
      { q: "Can I send more than one Whisper?", a: "Yes. Each Whisper is treated as a single message and a single reply. If you want an ongoing conversation, the natural next step is a licensed therapy session." },
      { q: "What if I want to identify myself in the reply later?", a: "You can choose to. Many users start Whisper completely anonymously and later decide to book a full therapy session with the same therapist if they feel a good fit." },
      { q: "Is Whisper safe for survivors of abuse or assault?", a: "Yes. Whisper was specifically designed for sensitive disclosures. Replies come from therapists trained in trauma-informed care. Your message is read only by your assigned therapist and one senior reviewer, both bound by professional confidentiality." },
    ],
    resources: [
      { label: "Innerspark — Send a Whisper", url: "https://www.innersparkafrica.com/" },
      { label: "WHO — Mental health and wellbeing", url: "https://www.who.int/health-topics/mental-health" },
      { label: "Butabika National Referral Hospital", url: "https://butabika.go.ug/" },
      { label: "Innerspark — Browse licensed therapists", url: "https://www.innersparkafrica.com/specialists" },
    ],
    closing: { headline: "You do not have to say the heavy thing out loud to start letting it go.", primary: "Whisper it. A real human will hear you within 48 hours." },
    cta: { heading: "Send your first Whisper — anonymously and free", body: "No name. No payment. A licensed Ugandan therapist replies personally within 48 hours.", whatsappText: "Hi, I'd like to learn more about Whisper and Innerspark." },
  };
  return <BlogPostLayout data={data} />;
};

export default WhisperAnonymousPost;