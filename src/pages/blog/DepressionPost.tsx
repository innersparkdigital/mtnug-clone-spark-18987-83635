import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const DepressionPost = () => {
  const data: BlogPostData = {
    slug: "depression-uganda-understanding-and-healing",
    category: "Depression",
    title: "Depression in Uganda: How to Spot It, Understand It, and Begin Healing",
    metaTitle: "Depression in Uganda: Signs, Causes & How to Heal | Innerspark Africa",
    metaDescription: "An honest, expert-backed guide to depression in Uganda — the quiet signs people miss, why it shows up the way it does here, and a step-by-step path back to yourself with online therapy from UGX 30,000.",
    date: "January 22, 2026",
    isoDate: "2026-01-22",
    readTime: "10 min read",
    keywords: ["depression Uganda", "signs of depression", "depression therapy Kampala", "online therapy Uganda", "mental health Africa", "how to heal depression"],
    heroImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Pensive young African man sitting by a window in soft natural light, reflecting on his mental health",
    sections: [
      {
        title: "Depression in Uganda is more common than people admit",
        blocks: [
          { type: "lead", text: "Depression in Uganda often hides behind a smile, a long workday, or the polite answer \"I'm okay, thanks.\" The WHO estimates that around 1 in 14 Ugandans live with depression at any given time — yet most never reach a therapist. This guide is for the person quietly wondering: am I just tired, or is something more going on?" },
          { type: "callout", label: "What you'll learn:", text: "How depression actually looks day-to-day in Uganda, why it's not laziness or weakness, what makes it lift, and how to get help that fits your budget and privacy needs." },
        ],
      },
      {
        title: "What depression really looks like (it's not always sadness)",
        blocks: [
          { type: "p", text: "Many people miss their own depression because they expect to feel sad all day. In reality, the more common signal is a flat, heavy numbness — like the colour has been turned down on life." },
          { type: "h3", text: "Emotional signs" },
          { type: "list", items: [
            "Persistent low mood, emptiness, or irritability lasting two weeks or more",
            "Loss of interest in things you used to enjoy — music, friends, food, sex",
            "Feeling guilty, worthless, or like a burden to others",
            "Hopelessness about the future",
          ]},
          { type: "h3", text: "Physical signs" },
          { type: "list", items: [
            "Sleeping much more or much less than usual",
            "Appetite changes — eating too much or having no interest in food",
            "Constant fatigue, even small tasks feel exhausting",
            "Unexplained aches, headaches, or digestive issues",
            "Slowed thinking or movement",
          ]},
          { type: "h3", text: "Behavioural signs" },
          { type: "list", items: [
            "Pulling away from family, friends, or church",
            "Falling behind at work or school",
            "Drinking more, or using sex / shopping / scrolling to numb out",
            "Thoughts of self-harm or that life is not worth living — this is a medical emergency",
          ]},
          { type: "callout", label: "If you are in crisis right now:", text: <>Please call our <Link to="/emergency-support" className="text-primary hover:underline font-medium">emergency support page</Link> or reach out to Butabika Hospital. You deserve immediate help.</> },
        ],
      },
      {
        title: "Why depression is rising in Uganda — and why it's not your fault",
        blocks: [
          { type: "p", text: "Depression is not a character flaw. It is a real biological and psychological condition triggered by a mix of life events, body chemistry, and unspoken stress. In Uganda, certain pressures stack up in particular ways." },
          { type: "list", items: [
            <><strong>Loss and grief.</strong> Many Ugandans carry untreated grief from a parent, sibling, or close friend lost in childhood.</>,
            <><strong>Economic squeeze.</strong> Carrying financial responsibility for an extended family while your own dreams sit on hold.</>,
            <><strong>Trauma history.</strong> Childhood violence, conflict-zone experiences, or sexual trauma that was never safely processed.</>,
            <><strong>Chronic stress.</strong> Long commutes, demanding bosses, exam pressure, an unsupportive marriage.</>,
            <><strong>Postnatal changes.</strong> Up to 1 in 5 Ugandan mothers experience postnatal depression. It is real and treatable.</>,
            <><strong>Hidden medical causes.</strong> Thyroid issues, anaemia, vitamin D deficiency, chronic pain — always worth ruling out.</>,
          ]},
          { type: "quote", text: "Depression is your mind doing the best it can with too much weight and not enough support. The work of therapy is to share the weight.", cite: "Innerspark clinical team" },
        ],
      },
      {
        title: "The 4-step path back to yourself",
        blocks: [
          { type: "p", text: "Healing from depression is rarely a single dramatic moment. It is a sequence of small, repeated steps that add up. Here is the order that works for most people." },
          { type: "numberedCards", title: "Step-by-step path", items: [
            "Name it honestly. \"This is depression\" is more powerful than \"I'm just tired.\" Naming gives you permission to act.",
            "Get one anchor habit. Pick one — a daily walk, a fixed bedtime, or eating breakfast. Repeat for two weeks.",
            "Talk to one safe person. A trusted friend, a pastor, or a therapist. Saying it out loud breaks the isolation that feeds depression.",
            "Build a treatment plan. Therapy is the most effective long-term treatment. For moderate to severe cases, medication may be added — your choice, your timeline.",
          ]},
          { type: "highlight", title: "If you only do one thing this week", text: <>Take our free <Link to="/tests/depression" className="text-primary hover:underline font-medium">depression self-assessment</Link>. It takes 5 minutes and gives you a clear severity score plus a recommended next step. No login required.</> },
        ],
      },
      {
        title: "How therapy actually treats depression",
        blocks: [
          { type: "p", text: "Good therapy is not just \"talking about your feelings.\" It is structured work that retrains how your brain interprets the world. Three approaches have the strongest evidence for depression." },
          { type: "h3", text: "Cognitive Behavioural Therapy (CBT)" },
          { type: "p", text: "Identifies the thought patterns that keep depression alive — \"I'm a failure,\" \"nothing will change\" — and replaces them with more accurate, kinder responses. Typically 12–20 sessions." },
          { type: "h3", text: "Behavioural Activation" },
          { type: "p", text: "Depression makes you withdraw, which makes depression worse. Behavioural activation deliberately schedules small pleasant or meaningful activities back into your week, even before motivation returns. Powerful and practical." },
          { type: "h3", text: "Interpersonal Therapy (IPT)" },
          { type: "p", text: "Focuses on the relationships and roles that are draining you — grief, conflict, life transitions. Best when depression is tied to a specific life event." },
          { type: "checkGrid", items: [
            "Sessions on WhatsApp video or in person — your choice",
            "Sliding scale available for students and low-income clients",
            "Female and male therapists across multiple languages",
            "Evening and weekend slots for working professionals",
            "Complete confidentiality, no insurance forms",
            "Optional psychiatrist referral for medication review",
          ]},
        ],
      },
      {
        title: "What helps every day — small habits, real impact",
        blocks: [
          { type: "p", text: "These are not magic cures, but research shows they meaningfully reduce depression symptoms over weeks." },
          { type: "iconGrid", items: [
            { icon: "🌞", text: "10 minutes of morning sunlight" },
            { icon: "🚶", text: "20-minute walk, 5 days a week" },
            { icon: "😴", text: "Same wake-up time daily" },
            { icon: "🥗", text: "Protein and vegetables at one meal" },
            { icon: "📵", text: "Phone out of the bedroom" },
            { icon: "🙏", text: "One small connection per day — call, prayer, text" },
          ]},
        ],
      },
      {
        title: "Supporting a loved one who is depressed",
        blocks: [
          { type: "p", text: "If someone you love is struggling, what you say matters less than how you show up. A few principles from our clinical team:" },
          { type: "list", items: [
            "Believe them the first time they tell you",
            "Do not say \"snap out of it\" or \"others have it worse\"",
            "Offer specific help — \"I'm bringing lunch on Saturday\" — instead of \"let me know if you need anything\"",
            "Encourage professional help; offer to sit with them while they book it",
            "Look after yourself too — supporting someone with depression is heavy",
          ]},
        ],
      },
    ],
    faqs: [
      { q: "What's the difference between sadness and depression?", a: "Sadness comes and goes with circumstance. Depression is persistent — most of the day, most days, for two weeks or more — and it affects your sleep, appetite, energy, and ability to function." },
      { q: "Can depression go away without treatment?", a: "Mild episodes sometimes lift on their own with lifestyle changes and social support. Moderate to severe depression rarely does — and untreated episodes get longer and harder each time. Early treatment makes a big difference." },
      { q: "How much does depression therapy cost in Uganda?", a: "At Innerspark, sessions start at UGX 30,000 with our standard rate at UGX 75,000 per 60 minutes. Group support sessions are UGX 25,000 per week. Payable via MTN or Airtel Mobile Money." },
      { q: "Do I have to take medication?", a: "No. Therapy alone is highly effective for mild and moderate depression. For severe cases, your therapist may suggest a psychiatrist consultation — the choice is always yours." },
      { q: "Is online therapy effective for depression?", a: "Yes. Multiple studies show online therapy is as effective as in-person for depression, with the added bonus of removing transport and privacy barriers." },
    ],
    resources: [
      { label: "WHO — Depression fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/depression" },
      { label: "NIMH — Depression overview", url: "https://www.nimh.nih.gov/health/topics/depression" },
      { label: "Mind UK — Self-care for depression", url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/depression/self-care/" },
      { label: "Innerspark — Free depression self-check", url: "https://www.innersparkafrica.com/tests/depression" },
    ],
    closing: { headline: "Depression lies. It says nothing will change.", primary: "It already is — the moment you read this far." },
    cta: { heading: "Talk to a depression specialist this week", body: "Private, licensed, online or in-person. Sessions from UGX 30,000.", whatsappText: "Hi, I just read your depression article and would like to book a therapy session." },
  };

  return <BlogPostLayout data={data} />;
};

export default DepressionPost;
