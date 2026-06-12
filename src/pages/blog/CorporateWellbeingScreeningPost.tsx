import { Link } from "react-router-dom";
import BlogPostLayout, { BlogPostData } from "@/components/blog/BlogPostLayout";

const CorporateWellbeingScreeningPost = () => {
  const data: BlogPostData = {
    slug: "corporate-wellbeing-screening-uganda",
    category: "Workplace Wellbeing",
    title: "Corporate Wellbeing Screening in Uganda — UGX 7,500 per Employee with Clinical Safety Cover",
    metaTitle: "Corporate Wellbeing Screening Uganda — UGX 7,500/Employee | Innerspark for Business",
    metaDescription: "Anonymous, clinically-validated workplace mental health screening for Ugandan companies. UGX 7,500 per employee. WHO-5, automated reports, clinical follow-up for at-risk staff.",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    readTime: "9 min read",
    keywords: ["corporate wellbeing screening Uganda", "workplace mental health Kampala", "employee wellbeing programme Uganda", "WHO-5 workplace screening", "EAP Uganda", "HR mental health solution Uganda"],
    heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=75",
    heroAlt: "Diverse Ugandan corporate team in a Kampala office meeting room",
    sections: [
      { title: "Most Ugandan companies have a workplace mental health problem they cannot see", blocks: [
        { type: "lead", text: "Burnout, anxiety, and quiet depression cost Ugandan businesses millions every year — through absenteeism, mistakes, turnover, and lost productivity that no one ever puts on a balance sheet. Most HR teams know it. Very few have a real way to measure it, and even fewer have a clinically safe path for what to do when an employee is genuinely struggling." },
        { type: "callout", label: "The short version:", text: "Innerspark Corporate Wellbeing Screening costs UGX 7,500 per employee. It uses the WHO-5 (the global gold standard), is fully anonymous to staff, gives HR an automated company-wide dashboard, and includes confidential clinical follow-up for any employee flagged as at-risk." },
        { type: "p", text: "Below: exactly what is included, what HR receives, how employee anonymity is protected, and how to roll it out in your company in under two weeks." },
      ]},
      { title: "What is included in UGX 7,500 per employee", blocks: [
        { type: "checkGrid", items: [
          "WHO-5 wellbeing screening for every employee",
          "Optional add-on assessments (anxiety, depression, burnout, sleep)",
          "Branded company portal staff log into with an access code",
          "Fully anonymous data — no employee name attached to results",
          "Real-time HR dashboard with company-wide and team-level insights",
          "Demographic breakdowns (gender, department, level) for fair planning",
          "Confidential one-to-one clinical follow-up for at-risk staff",
          "Aggregated PDF and CSV reports for board and ESG reporting",
          "Retake every 6 months to track real change",
        ]},
      ]},
      { title: "Why anonymous screening actually works", blocks: [
        { type: "p", text: "Employees do not tell HR they are struggling. Not in Uganda, not anywhere. They tell anonymous screening tools — because there is no career risk." },
        { type: "list", items: [
          "Honest responses you cannot get from surveys with names attached",
          "Higher participation rates — typically 70–85% of staff in Uganda",
          "Quiet identification of teams or departments under strain",
          "Catches employees in the \"needs support\" tier before they break down",
          "Builds trust — staff see leadership taking wellbeing seriously",
        ]},
        { type: "quote", text: "We have screened more than 12,000 employees across Ugandan banks, NGOs, manufacturers, and tech companies. In every single one we found employees who were close to burnout — and who had told no one.", cite: "Innerspark Corporate Team" },
      ]},
      { title: "Clinical safety: what happens when someone is flagged at-risk", blocks: [
        { type: "p", text: "This is what separates a real wellbeing programme from a survey. When a screening result indicates an employee is at risk, the system silently triggers a clinically safe follow-up — without HR ever seeing the name." },
        { type: "numberedCards", title: "The clinical pathway", items: [
          "Employee completes the screening privately on their phone or laptop.",
          "If results indicate low wellbeing or high distress, they immediately see a calm, supportive message and an option to request a free callback.",
          "A licensed Innerspark therapist contacts the employee within 24 hours, fully confidentially.",
          "If ongoing care is needed, the employee can book subsidised sessions — covered or co-paid by the employer if you choose.",
          "HR receives only aggregate, anonymised numbers — never names.",
        ]},
        { type: "highlight", title: "The result", text: "Genuinely at-risk staff get help fast. HR gets clear, ethical data. No one falls through the cracks." },
      ]},
      { title: "What HR actually sees on the dashboard", blocks: [
        { type: "iconGrid", items: [
          { icon: "📊", text: "Company-wide WHO-5 score with benchmarks" },
          { icon: "🏢", text: "Team and department breakdowns" },
          { icon: "⚠️", text: "% of staff in \"needs support\" tier" },
          { icon: "👥", text: "Demographic insights (gender, level)" },
          { icon: "📈", text: "6-month trend after retake" },
          { icon: "📄", text: "PDF and CSV exports for the board" },
        ]},
      ]},
      { title: "Why UGX 7,500 per employee is actually cheap", blocks: [
        { type: "p", text: "For context, a single absent day for a Kampala professional typically costs the employer UGX 80,000–200,000 in lost productivity, cover, and rework. One employee retained or recovered pays for screening the entire team." },
        { type: "list", items: [
          "UGX 7,500 per employee, per screening cycle",
          "Retake every 6 months for real trend data",
          "No setup or licence fees",
          "Optional: subsidised therapy sessions for staff (UGX 30,000+ per session)",
          "Optional: manager training on responding to disclosures",
          "Bulk pricing for teams of 200+ — contact us",
        ]},
      ]},
      { title: "How to roll it out in your company in 2 weeks", blocks: [
        { type: "numberedCards", title: "A simple launch plan", items: [
          "Week 1, Day 1: HR signs the agreement and shares a staff list (or just total headcount).",
          "Week 1, Day 3: Your branded screening portal is live, with a company access code.",
          "Week 1, Day 5: Internal launch email — sent by leadership, framing it as a wellbeing initiative.",
          "Week 2, Day 5: Reminder email — typical participation reaches 70–85%.",
          "Week 2, Day 10: HR receives the full dashboard and aggregate PDF report.",
          "Ongoing: At-risk staff are quietly supported by licensed Innerspark therapists.",
        ]},
        { type: "highlight", title: "Want to try it first?", text: <>HR teams can run a quick demo on themselves using our <Link to="/wellbeing-check" className="text-primary hover:underline font-medium">free WHO-5 wellbeing check</Link> before rolling it out. Or jump straight to <Link to="/innerspark-for-business" className="text-primary hover:underline font-medium">Innerspark for Business</Link> to see the full corporate offering.</> },
      ]},
      { title: "Who this is for", blocks: [
        { type: "checkGrid", items: [
          "Banks and financial institutions in Uganda",
          "NGOs and humanitarian organisations",
          "Manufacturing and operational companies",
          "Tech companies and startups",
          "Universities and large schools",
          "Government departments and parastatals",
          "Any employer of 50+ staff serious about retention",
        ]},
      ]},
    ],
    faqs: [
      { q: "How much does corporate wellbeing screening cost in Uganda?", a: "Innerspark charges UGX 7,500 per employee per screening cycle. There are no setup fees. Bulk pricing is available for organisations with 200+ employees. Therapy follow-up for at-risk staff is an optional add-on (UGX 30,000+ per session) that the employer can subsidise." },
      { q: "Is it really anonymous? Can HR see individual results?", a: "Yes, fully anonymous. Individual results are visible only to the employee. HR receives aggregate, anonymised dashboards — company-wide, team-level, and demographic breakdowns. No employee name is ever attached to results in HR reports." },
      { q: "What happens to employees flagged as at-risk?", a: "They are immediately offered a free, confidential callback from a licensed Innerspark therapist within 24 hours. If ongoing care is needed, they can book subsidised sessions — covered or co-paid by the employer if you choose. HR is never notified of who was contacted." },
      { q: "Which assessment do you use?", a: "The WHO-5 Wellbeing Index, the global gold standard developed by the World Health Organization. Optional add-on assessments include anxiety (GAD-7), depression (PHQ-9), burnout, and sleep quality screening." },
      { q: "How long does the rollout take?", a: "Most companies launch within 7–10 working days from agreement. Staff complete screening in under 3 minutes on their phones. HR receives the full dashboard within 2 weeks of launch." },
      { q: "Can we use it just for one team or department?", a: "Yes. Many companies start with a single department (sales, customer service, ops) as a pilot before rolling out company-wide. Pricing remains UGX 7,500 per screened employee." },
    ],
    resources: [
      { label: "WHO-5 Wellbeing Index", url: "https://www.psykiatri-regionh.dk/who-5/Pages/default.aspx" },
      { label: "Innerspark for Business", url: "https://www.innersparkafrica.com/innerspark-for-business" },
      { label: "Innerspark — Free wellbeing check (demo)", url: "https://www.innersparkafrica.com/wellbeing-check" },
    ],
    closing: { headline: "You cannot manage what you cannot measure — and you cannot retain staff you have quietly broken.", primary: "UGX 7,500 per employee is the lowest-cost insurance policy your business can buy this year." },
    cta: { heading: "Bring wellbeing screening to your company", body: "UGX 7,500 per employee. Anonymous WHO-5 screening, HR dashboard, and clinical follow-up for at-risk staff.", whatsappText: "Hi, I'd like to learn about Innerspark Corporate Wellbeing Screening for my company." },
  };
  return <BlogPostLayout data={data} />;
};

export default CorporateWellbeingScreeningPost;