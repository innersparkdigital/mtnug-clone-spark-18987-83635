import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const TalkToBossMentalHealthPost = () => {
  const data: BlogPostData = {
    slug: "talk-to-boss-mental-health-uganda",
    category: "Workplace Wellbeing",
    title: "How to Talk to Your Boss About Mental Health in Uganda: A Real, Practical Script",
    metaTitle: "How to Tell Your Boss About Mental Health in Uganda — Script & Rights | Innerspark",
    metaDescription: "A calm, practical guide for Ugandan employees on how to talk to your boss about mental health — what to say, what to share, your legal rights, sample script, and how to ask for time off without losing your job.",
    date: "May 31, 2026",
    isoDate: "2026-05-31",
    readTime: "10 min read",
    keywords: [
      "talk to boss about mental health Uganda",
      "mental health at work Uganda",
      "request mental health leave Uganda",
      "workplace stress Kampala",
      "burnout time off Uganda",
      "employee mental health rights Uganda",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=75",
    heroAlt:
      "Ugandan professional in a calm 1:1 conversation with her manager in a Kampala office",
    sections: [
      {
        title: "The conversation almost no one in Uganda wants to have",
        blocks: [
          { type: "lead", text: "Telling your boss you are struggling with your mental health in Uganda can feel like risking your job. For most people it is the hardest conversation of their career. But done well — with the right words, the right amount of information, and a clear ask — it almost always goes better than you fear. This guide gives you the exact script." },
          { type: "callout", label: "The short version:", text: "You do not have to disclose a diagnosis. You only have to name the impact on your work and ask for something specific — reduced hours, time off, a deadline shift, or a quiet check-in. Most Ugandan managers respond well when the request is calm, professional, and concrete." },
          { type: "p", text: "Below: when (and when not) to tell your boss, exactly what to say, your rights as a Ugandan employee, a copy-paste script and email template, and how to handle a boss who reacts badly." },
        ],
      },
      {
        title: "First — do you actually need to tell your boss?",
        blocks: [
          { type: "p", text: "You are not obliged to share a diagnosis with your employer. The real question is whether your mental health is starting to affect your work — because if it is, your boss is already noticing, and silence is the riskier choice." },
          { type: "h3", text: "Tell your boss if any of these are true" },
          { type: "checkGrid", items: [
            "You are missing deadlines you would normally meet",
            "You need time off (even half a day) for a therapist or doctor",
            "You need a temporary change — fewer hours, lighter load, no travel",
            "You are using sick days repeatedly without explaining why",
            "Colleagues are noticing changes in your mood, focus, or energy",
            "You are at risk of burning out completely if nothing changes",
          ]},
          { type: "h3", text: "You probably do not need to tell your boss if" },
          { type: "list", items: [
            "You are managing well and your work is unaffected",
            "You can attend therapy outside working hours",
            "Your symptoms are short-lived and not impacting your team",
          ]},
        ],
      },
      {
        title: "What you actually need to say (and what you don't)",
        blocks: [
          { type: "p", text: "The trick is to be clear about impact and ask, without oversharing private medical detail. A good disclosure has three parts." },
          { type: "numberedCards", title: "The three-part formula", items: [
            "Name it gently — \"I have been dealing with a health issue\" or \"I am working through something personal\". You do not need to say depression, anxiety, or a specific diagnosis.",
            "Name the impact — be honest about what is affected at work (focus, deadlines, energy, meetings) for the next few weeks.",
            "Make a clear ask — one specific thing your boss can actually do (time off, a deadline shift, reduced hours for a month, flexibility on remote days).",
          ]},
          { type: "quote", text: "Bosses do not panic at words like depression. They panic at vague, open-ended problems. Give them a clear ask and most will say yes.", cite: "Innerspark workplace team" },
        ],
      },
      {
        title: "A real, copy-paste script for the conversation",
        blocks: [
          { type: "highlight", title: "Sample 1:1 script", text: <>\"Thanks for making time. I want to be upfront with you — over the past few weeks I have been dealing with a health issue that is affecting my focus and energy. I am already getting professional support for it. Over the next [4–6] weeks I would like to [work from home two days a week / shift the deadline on Project X by 10 days / take Thursday afternoons off for appointments]. I will keep delivering on [these priorities] and will let you know immediately if anything else changes.\"</> },
          { type: "p", text: "Notice what this script does:" },
          { type: "list", items: [
            "Names the impact without naming a diagnosis",
            "Shows you are already taking action (\"already getting professional support\")",
            "Makes one clear, time-bound ask",
            "Reassures the boss that core priorities will still be met",
            "Invites continued conversation without committing to weekly updates",
          ]},
        ],
      },
      {
        title: "An email template (if a face-to-face feels too hard)",
        blocks: [
          { type: "highlight", title: "Sample email", text: <><strong>Subject:</strong> Quick check-in — request for short-term flexibility<br/><br/>Hi [Manager],<br/><br/>I would like to flag something privately. I have been managing a health issue for a few weeks and am actively getting support. To stay on top of my work I would like to request [specific ask] for the next [time period].<br/><br/>I will continue to prioritise [key deliverables] and am happy to discuss further when you have 15 minutes this week.<br/><br/>Thank you,<br/>[Your name]</> },
        ],
      },
      {
        title: "Your rights as an employee in Uganda",
        blocks: [
          { type: "p", text: "Ugandan employment law does not have the same explicit \"reasonable accommodation\" wording as the UK or US, but you still have meaningful protections — and most large employers go beyond the legal minimum." },
          { type: "list", items: [
            <><strong>Sick leave:</strong> The Employment Act 2006 entitles you to up to one month of full pay sick leave per year if signed off by a medical practitioner.</>,
            <><strong>Medical certification:</strong> A signed letter from a licensed psychologist, psychiatrist, or registered counsellor counts as medical certification for sick leave.</>,
            <><strong>Confidentiality:</strong> Your HR team cannot share the nature of your illness with colleagues without your consent.</>,
            <><strong>Discrimination:</strong> The Employment Act prohibits termination on grounds of illness when you are actively receiving treatment.</>,
            <><strong>Annual leave:</strong> You can use accrued annual leave for therapy or recovery without giving a medical reason.</>,
          ]},
          { type: "p", text: "If you are unsure where you stand, the Ministry of Gender, Labour and Social Development has a labour office in each district that gives free guidance." },
        ],
      },
      {
        title: "How to prepare for the conversation",
        blocks: [
          { type: "numberedCards", title: "Five steps in the week before", items: [
            "Decide what you will share and what you will keep private — write the two lists down.",
            "Decide one clear ask. Time off? Reduced hours? A deadline shift? Remote days?",
            "Pick a time when your boss is not stressed — early in the week, not Friday afternoon.",
            "Ask for a private 1:1, in person or on a confidential video call. Avoid Slack or WhatsApp for the disclosure itself.",
            "Practise the script out loud — even once. Saying it makes the real conversation feel half as scary.",
          ]},
          { type: "highlight", title: "Not sure how serious things are?", text: <>Take our free <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">3-minute wellbeing check</Link> or the <Link to="/mind-check/job-burnout" className="text-primary hover:underline font-medium">burnout self-assessment</Link>. Both give you a clear sense of severity — and make your ask easier to justify.</> },
        ],
      },
      {
        title: "What to do if your boss reacts badly",
        blocks: [
          { type: "p", text: "Most bosses respond better than you expect. But not all. If your manager dismisses you, pressures you, or threatens your job, here is your playbook." },
          { type: "list", items: [
            "Stay calm in the meeting. Do not argue or over-explain. End the conversation politely.",
            "Write down what was said as soon as possible — date, time, exact words.",
            "Escalate to HR or a more senior manager, in writing, with your written ask attached.",
            "Get a signed letter from your therapist or doctor confirming the need for accommodation.",
            "Contact the Ministry of Gender, Labour and Social Development labour office if you believe your rights have been violated.",
            "If the workplace is genuinely unsafe for your mental health, your therapist can help you plan a careful exit.",
          ]},
        ],
      },
      {
        title: "What good Ugandan workplaces are already doing",
        blocks: [
          { type: "p", text: "The conversation has shifted faster than most employees realise. In the past three years we have worked with banks, NGOs, tech companies, and government partners in Uganda who now offer:" },
          { type: "checkGrid", items: [
            "Subsidised therapy sessions for staff",
            "Mental-health days separate from sick leave",
            "Confidential employee assistance programmes",
            "Manager training on responding to disclosures",
            "Anonymous wellbeing screening every 6 months",
            "Flexible hours during recovery periods",
          ]},
          { type: "p", text: <>If your employer has none of these, ask HR whether they have considered an <Link to="/innerspark-for-business" className="text-primary hover:underline font-medium">employer mental wellbeing programme</Link>. It costs less than people imagine.</> },
        ],
      },
    ],
    faqs: [
      { q: "Do I have to tell my boss about my mental health diagnosis in Uganda?", a: "No. You are not legally required to disclose a specific diagnosis. You only need to share the impact on your work and a clear ask — for example, time off or a deadline shift. A letter from your therapist or doctor is enough to justify sick leave or reduced hours." },
      { q: "Can I be fired in Uganda for having a mental health condition?", a: "No. The Employment Act 2006 prohibits termination on grounds of illness when you are actively receiving treatment. If this happens, escalate to HR in writing and contact the Ministry of Gender, Labour and Social Development labour office." },
      { q: "How much sick leave am I entitled to in Uganda?", a: "Under the Employment Act 2006, you are entitled to up to one month of full pay sick leave per year, provided you have certification from a licensed medical practitioner — including a registered psychologist, psychiatrist, or counsellor." },
      { q: "Should I tell my boss in person or by email?", a: "If the relationship is good and you can speak calmly, in-person is usually better. If face-to-face feels too overwhelming, a short, professional email is completely acceptable. Avoid Slack or WhatsApp for the disclosure itself." },
      { q: "What if my boss says yes but nothing changes?", a: "Put the agreed accommodation in writing — a short follow-up email after the conversation. If nothing changes within 2 weeks, escalate gently to HR, attaching the original email." },
      { q: "Can my therapist write a letter to my employer?", a: "Yes. Innerspark therapists can provide a confidential letter confirming you are in active treatment and recommending specific accommodations, without disclosing your diagnosis." },
    ],
    resources: [
      { label: "Uganda Employment Act 2006", url: "https://www.ilo.org/dyn/natlex/natlex4.detail?p_lang=en&p_isn=75566" },
      { label: "Ministry of Gender, Labour and Social Development", url: "https://mglsd.go.ug/" },
      { label: "Innerspark — Browse therapists", url: "https://www.innersparkafrica.com/specialists" },
      { label: "Innerspark — For employers", url: "https://www.innersparkafrica.com/innerspark-for-business" },
    ],
    closing: { headline: "The fear of having this conversation is almost always bigger than the conversation itself.", primary: "Name it, ask for one specific thing, and let your work — and your boss — surprise you." },
    cta: { heading: "Get support before the conversation", body: "Talk to a licensed Ugandan therapist who can also provide a confidential letter for your employer. Sessions from UGX 30,000.", whatsappText: "Hi, I just read your article on talking to my boss about mental health and would like to book a session." },
  };

  return <BlogPostLayout data={data} />;
};

export default TalkToBossMentalHealthPost;