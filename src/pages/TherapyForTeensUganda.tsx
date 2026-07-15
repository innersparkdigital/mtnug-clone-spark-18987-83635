import ConditionLandingPage from "@/components/seo/ConditionLandingPage";

export default function TherapyForTeensUganda() {
  return (
    <ConditionLandingPage
      slug="therapy-for-teens-uganda"
      title="Therapy for Teens in Uganda | Adolescent Counselling Online | InnerSpark Africa"
      metaDescription="Online therapy for teenagers in Uganda with licensed adolescent counsellors. Confidential support for anxiety, depression, school stress and family issues. From UGX 75,000."
      keywords="teen therapy Uganda, therapy for teenagers Kampala, adolescent counselling Uganda, child counselling services near me, youth mental health Uganda, therapist for teens Kampala, school stress therapy Uganda, teenage depression Uganda"
      serviceName="Adolescent & Teen Therapy in Uganda"
      h1="Therapy for Teenagers in Uganda"
      intro="If your teen has been withdrawn, angry, anxious, struggling at school, or hiding on their phone, you are not overreacting. Our licensed therapists work with teenagers aged 13–19 across Uganda, offering private online sessions that meet young people where they are — on their phone, in their own language."
      bodySections={[
        {
          heading: "What we help teens with",
          paragraphs: [
            "Teenagers today are navigating pressures their parents never faced — social media comparison, exam pressure, family expectations, identity questions, and the after-effects of COVID-era isolation. Many of them cannot name what they feel, only that 'something is wrong.'",
          ],
          bullets: [
            "Anxiety, worry, and panic attacks",
            "Depression, sadness, and self-harm",
            "School stress, exam anxiety, and burnout",
            "Bullying (in person and online)",
            "Family conflict and parent–teen tension",
            "Identity, self-esteem, and confidence",
            "Grief and trauma",
          ],
        },
        {
          heading: "How teen therapy works on InnerSpark",
          paragraphs: [
            "Our adolescent therapists are trained specifically to work with young people — using tools like CBT, art-based approaches, and short, focused sessions that suit shorter attention spans. Teens can join sessions over WhatsApp video, voice, or chat, whichever feels least intimidating.",
            "Parents are involved with the teen's consent — we'll agree on what stays private (their feelings, their processing) and what is shared with parents (safety concerns, general progress). This is what makes teens open up.",
          ],
        },
        {
          heading: "A note for Ugandan parents",
          paragraphs: [
            "It is often hard to know if your teen is 'just being a teenager' or genuinely struggling. If you have noticed changes lasting more than 2–3 weeks — sleep, appetite, withdrawal, drop in school performance, or self-harm — it is worth booking a single consultation to check in.",
          ],
        },
      ]}
      faqs={[
        { q: "What age teenagers do you work with?", a: "Our teen therapy service is for young people aged 13–19. For children under 13, we offer child-focused sessions with parent involvement." },
        { q: "How much does teen therapy cost in Uganda?", a: "Adolescent therapy on InnerSpark Africa is UGX 75,000 per session with a licensed therapist trained in working with young people. Pay via MTN Mobile Money or Airtel Money." },
        { q: "Do I need my parents' permission?", a: "For teens under 18, we ask for a parent or guardian to give consent to the first session. After that, what you share with your therapist is confidential — with the standard exception of serious safety concerns." },
        { q: "Will my parents know what I say in therapy?", a: "No. Your therapist will not share the content of your sessions with your parents. The only exceptions are safety issues (like risk of self-harm or someone harming you). Everything else stays between you and your therapist." },
        { q: "Is online therapy suitable for teenagers?", a: "Yes — often more than in-person. Teens are more comfortable on video and chat, and they can attend from a private space at home. Our therapists use age-appropriate tools that work well over video." },
      ]}
    />
  );
}