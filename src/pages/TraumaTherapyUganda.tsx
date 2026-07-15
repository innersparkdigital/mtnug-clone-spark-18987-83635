import ConditionLandingPage from "@/components/seo/ConditionLandingPage";

export default function TraumaTherapyUganda() {
  return (
    <ConditionLandingPage
      slug="trauma-therapy-uganda"
      title="Trauma Therapy in Uganda | PTSD Counselling Online | InnerSpark Africa"
      metaDescription="Trauma and PTSD therapy in Uganda with trauma-informed African therapists. Private online sessions for accidents, abuse, grief, and post-conflict trauma. From UGX 75,000."
      keywords="trauma therapy Uganda, PTSD therapy Uganda, trauma counsellor Kampala, trauma-informed therapist Uganda, post-conflict trauma Gulu, abuse recovery Uganda, therapist for trauma Uganda, EMDR Uganda"
      serviceName="Trauma & PTSD Therapy in Uganda"
      h1="Trauma Therapy in Uganda — Trauma-Informed Care, Fully Online"
      intro="Trauma can come from a single event — an accident, an assault, the sudden loss of someone — or from years of experiences like abuse, conflict, or difficult childhoods. Our licensed Ugandan therapists are trained in trauma-informed care and work at your pace, in a way that keeps you safe."
      bodySections={[
        {
          heading: "The kinds of trauma we work with",
          paragraphs: [
            "Every trauma is valid. You do not need to have 'the worst' story to deserve support — if something has left a mark on how you feel, sleep, trust, or move through the world, therapy can help.",
          ],
          bullets: [
            "Post-Traumatic Stress Disorder (PTSD)",
            "Childhood abuse and neglect",
            "Sexual and gender-based violence",
            "Post-conflict and war-related trauma (northern Uganda, South Sudan)",
            "Accidents, medical trauma, and near-death experiences",
            "Grief, loss, and complicated bereavement",
            "Complex trauma (C-PTSD) and repeated relational hurt",
          ],
        },
        {
          heading: "How trauma therapy works with us",
          paragraphs: [
            "Trauma therapy is not about re-living everything from day one. Our therapists start by helping you feel safe and stabilised — building coping skills, understanding your body's stress responses, and only moving into processing when you are ready.",
            "Approaches used include trauma-focused CBT, EMDR-informed techniques, somatic grounding, and narrative therapy. Sessions run over WhatsApp video, voice or chat — whichever feels most contained for you.",
          ],
        },
        {
          heading: "For northern Uganda and post-conflict regions",
          paragraphs: [
            "Our team includes therapists who understand the specific context of post-conflict trauma in Gulu, Kitgum, Lira, and the wider Acholi sub-region — including intergenerational trauma, grief, and the pressure to 'move on' when the pain is still present. Sessions are available in English and Luo.",
          ],
        },
      ]}
      faqs={[
        { q: "How much does trauma therapy cost in Uganda?", a: "Trauma therapy on InnerSpark Africa is UGX 75,000 per session with a licensed, trauma-trained therapist. Pay via MTN Mobile Money or Airtel Money. Payment plans are available on request for sustained work." },
        { q: "Do I have to talk about the trauma in detail?", a: "No — not until you are ready. Trauma therapy prioritises safety and stabilisation first. Your therapist will help you build coping skills before any processing work, and you will always be in control of what you share and when." },
        { q: "Is online trauma therapy effective?", a: "Yes. A growing body of research shows online trauma therapy is as effective as in-person for most people — and it has the added benefit of letting you stay in a familiar, safe environment during difficult work." },
        { q: "Do you offer trauma therapy in Luo or other local languages?", a: "Yes. We have therapists who work in English, Luganda, Luo and other local languages on request. Please mention your preferred language when booking." },
        { q: "Is trauma therapy confidential in Uganda?", a: "Completely. Nothing you share is disclosed to family, employers, community members, or insurers. Our therapists follow strict clinical confidentiality." },
      ]}
    />
  );
}