import ConditionLandingPage from "@/components/seo/ConditionLandingPage";

export default function CounsellingServicesUganda() {
  return (
    <ConditionLandingPage
      slug="counselling-services-uganda"
      title="Counselling Services in Uganda — Book Today from UGX 30,000"
      metaDescription="Professional counselling services in Uganda. Licensed Ugandan counsellors by video, voice or chat from UGX 30,000. Pay by MTN or Airtel Money, book in 2 minutes."
      keywords="counselling services Uganda, counsellor Uganda, professional counselling Kampala, online counselling Uganda, counselling in Uganda prices, family counselling Uganda, grief counselling Uganda, workplace counselling Uganda"
      serviceName="Counselling Services in Uganda"
      h1="Counselling Services in Uganda — Private, Online, Affordable"
      intro="Professional counselling in Uganda without the clinic visit. InnerSpark gives you a licensed Ugandan counsellor over WhatsApp video, voice or chat — individual, couples, teen, family, grief and workplace counselling, from UGX 30,000 a session."
      bodySections={[
        {
          heading: "The counselling services we offer",
          paragraphs: [
            "Whatever you are carrying, there is a counselling format that fits your life and your budget. Every client begins with a short assessment so we can match you to the counsellor best suited to your concern rather than the first available name.",
          ],
          bullets: [
            "Individual counselling — 60 minutes, UGX 75,000 (about USD 22)",
            "Couples and marriage counselling — 60 minutes, UGX 120,000",
            "Teen counselling (13+) — 60 minutes, UGX 75,000, with parental consent",
            "Chat-based counselling — 1 hour, UGX 30,000 (about USD 9)",
            "Facilitated support groups — UGX 25,000 (about USD 7)",
            "Workplace and corporate counselling programmes for Ugandan employers",
          ],
        },
        {
          heading: "What people come to counselling for",
          paragraphs: [
            "The most common reasons Ugandans book with us are anxiety and constant worry, depression and low mood, relationship and marriage strain, grief and loss, trauma, exam and career pressure, workplace burnout, alcohol and substance concerns, and parenting stress.",
            "You do not need a diagnosis or a referral to start. If something is heavy enough to be affecting your sleep, work, studies or relationships, that is reason enough.",
          ],
        },
        {
          heading: "How to book counselling in Uganda",
          paragraphs: [
            "Booking takes about two minutes. Choose your format, tell us your concern, pick a time, and pay by MTN Mobile Money, Airtel Money or online card. Your counsellor's details arrive on WhatsApp and your session happens wherever you are — Kampala, Entebbe, Gulu, Mbarara, Jinja or abroad.",
          ],
        },
      ]}
      faqs={[
        { q: "How much do counselling services cost in Uganda?", a: "Chat-based counselling starts at UGX 30,000 (about USD 9) per hour. A full 60-minute individual session is UGX 75,000 (about USD 22), couples counselling is UGX 120,000, and facilitated support groups are UGX 25,000." },
        { q: "Are your counsellors licensed in Uganda?", a: "Yes. Every InnerSpark counsellor is a licensed, vetted Ugandan or East African mental health professional. You can see their profiles, specialties and experience before you book." },
        { q: "Can I get counselling without visiting an office?", a: "Yes — all sessions are online over WhatsApp video, voice call or chat. Nothing to download, low bandwidth friendly, and available anywhere in Uganda." },
        { q: "Do you offer counselling for families and teenagers?", a: "Yes. We offer family counselling and dedicated teen counselling from age 13 with parental consent, covering exam stress, bullying, anxiety, depression and family conflict." },
        { q: "How do I pay for counselling?", a: "Pay by MTN Mobile Money, Airtel Money (0740 616 404, InnerSpark Recovery Ltd) or securely online by card. Your session is confirmed on WhatsApp within minutes." },
      ]}
    />
  );
}