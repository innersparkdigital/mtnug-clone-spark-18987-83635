import { Link } from "react-router-dom";

/**
 * Long-form SEO content for /wellbeing-check targeting Uganda WHO-5 queries.
 * Rendered below the interactive check so crawlers index 1,200+ words of
 * topical content without disrupting the conversion flow.
 */
const WellbeingUgandaGuide = () => {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 prose prose-slate">
      <article>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          The WHO-5 Wellbeing Index in Uganda: A Complete Guide
        </h2>
        <p className="text-gray-700">
          Mental wellbeing in Uganda is finally getting the attention it deserves.
          With the Ministry of Health estimating that <strong>1 in 4 Ugandans</strong>{" "}
          experiences a mental health condition in their lifetime — and only{" "}
          <strong>fewer than 5%</strong> ever receive professional support — having a
          quick, private way to check in on your mental health has never been more
          important. That is exactly what the WHO-5 Wellbeing Index was designed for.
        </p>
        <p className="text-gray-700">
          On this page you can <Link to="/wellbeing-check" className="text-primary underline">take the free WHO-5 check</Link>{" "}
          in under two minutes. Below, we explain what the score means for Ugandans,
          how it compares to clinical tools like PHQ-9 and GAD-7, and what to do next
          — whether you're in Kampala, Entebbe, Jinja, Mbarara, Gulu, or anywhere else
          in the country.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-3">What is the WHO-5 Wellbeing Index?</h3>
        <p className="text-gray-700">
          The WHO-5 is a five-item questionnaire developed by the World Health
          Organization Regional Office for Europe in 1998. It measures{" "}
          <em>subjective psychological wellbeing</em> over the previous two weeks
          using simple, positively-worded statements such as <em>"I have felt cheerful
          and in good spirits"</em>. Each item is rated on a 6-point scale from 0 (at
          no time) to 5 (all of the time). The raw score (0–25) is multiplied by 4 to
          produce a percentage between 0 and 100.
        </p>
        <p className="text-gray-700">
          Despite its brevity, the WHO-5 has been validated in more than 30 countries
          and 200 published studies. A 2015 systematic review in <em>Psychotherapy and
          Psychosomatics</em> concluded that it has adequate validity as a screening
          tool for depression and as an outcome measure in clinical trials. It is now
          used by primary care clinics, NGOs, and employers across East Africa —
          including several partners we work with at InnerSpark Africa.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-3">What do the scores mean?</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>
            <strong>0–28% — Low wellbeing.</strong> A score in this range strongly
            suggests it would help to speak with a licensed therapist. It does not
            mean you have depression, but research shows scores below 28% have a
            sensitivity of over 0.86 for major depressive disorder.
          </li>
          <li>
            <strong>29–50% — Below average.</strong> You may be coping with persistent
            stress, burnout, low motivation, or sleep disruption. Many Ugandan
            professionals fall here during high-pressure seasons.
          </li>
          <li>
            <strong>51–75% — Moderate wellbeing.</strong> Most days are okay, but
            you have noticeable dips. Preventative tools — journaling, the{" "}
            <Link to="/meditations" className="text-primary underline">InnerSpark meditations library</Link>,
            and a wellbeing check every 4 weeks — help you stay in this band.
          </li>
          <li>
            <strong>76–100% — Good wellbeing.</strong> You're flourishing. Keep
            doing what you're doing and re-check monthly.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-3">Why the WHO-5 matters in Uganda</h3>
        <p className="text-gray-700">
          Uganda has one of the youngest populations in the world — a median age of
          just 16.7. Young Ugandans face a unique combination of pressures: youth
          unemployment over 13%, climate-driven displacement in northern districts,
          academic stress in universities like Makerere and Kyambogo, and the ongoing
          economic ripples of the COVID-19 pandemic. Yet the entire country has only{" "}
          <strong>around 50 practising psychiatrists</strong>, most of them based in
          Kampala.
        </p>
        <p className="text-gray-700">
          That gap is exactly why a free, anonymous, two-minute screen matters. The
          WHO-5 doesn't require a clinic visit, doesn't go on a medical record, and
          gives you immediate guidance. For many Ugandans it is the first time they
          have ever put a number on how they actually feel — and that number is often
          the nudge needed to{" "}
          <Link to="/find-therapist" className="text-primary underline">book a licensed therapist</Link>{" "}
          or join a <Link to="/support-groups" className="text-primary underline">peer support group</Link>.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-3">WHO-5 vs PHQ-9 vs GAD-7: which should you use?</h3>
        <p className="text-gray-700">
          The WHO-5 is a <em>wellbeing</em> measure — it captures the positive end of
          the mental health spectrum. PHQ-9 (depression) and GAD-7 (anxiety) measure
          symptoms of specific disorders. We recommend the WHO-5 as your monthly
          check-in because it is short, non-stigmatising, and works even when you
          don't think anything is wrong. If your WHO-5 score is below 50%, the next
          step is usually a targeted screen: the{" "}
          <Link to="/tests/depression-test" className="text-primary underline">PHQ-9 depression test</Link>{" "}
          or the{" "}
          <Link to="/tests/anxiety-test" className="text-primary underline">GAD-7 anxiety test</Link>{" "}
          from our <Link to="/mind-check" className="text-primary underline">Mind Check library</Link>.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-3">How to take a meaningful wellbeing check</h3>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li><strong>Find a quiet moment.</strong> The questionnaire only takes two minutes, but answers are more honest when you're not multitasking.</li>
          <li><strong>Think about the last two weeks, not today.</strong> A bad morning is normal; a bad fortnight is the signal we're looking for.</li>
          <li><strong>Be honest, not aspirational.</strong> The score is private — no one sees it but you.</li>
          <li><strong>Save or share the result.</strong> If a friend, partner, or HR officer needs to understand how you're doing, the percentage is an easy starting point.</li>
          <li><strong>Repeat every 4 weeks.</strong> Trends matter more than any single score.</li>
        </ol>

        <h3 className="text-2xl font-semibold mt-10 mb-3">What to do if your score is low</h3>
        <p className="text-gray-700">
          A low score is not a diagnosis — it's a flag. Three concrete next steps for
          anyone in Uganda:
        </p>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>
            <strong>Talk to a licensed Ugandan therapist.</strong> InnerSpark sessions
            start from <strong>UGX 30,000</strong>. Browse{" "}
            <Link to="/specialists" className="text-primary underline">our therapists</Link>{" "}
            or read about{" "}
            <Link to="/therapy-in-uganda" className="text-primary underline">therapy in Uganda</Link>{" "}
            and{" "}
            <Link to="/therapy-in-kampala" className="text-primary underline">therapy in Kampala</Link>.
          </li>
          <li>
            <strong>If you're in crisis, get help now.</strong> Call Uganda's{" "}
            <strong>Toll-free Mental Health Helpline 0800 21 21 21</strong> or visit{" "}
            <Link to="/emergency-support" className="text-primary underline">our emergency support page</Link>.
          </li>
          <li>
            <strong>Start small daily habits.</strong> Sleep before midnight, 20
            minutes of walking, and one guided breathing exercise from the{" "}
            <Link to="/meditations" className="text-primary underline">InnerSpark library</Link>{" "}
            can move a WHO-5 score by 8–12 points in four weeks.
          </li>
        </ol>

        <h3 className="text-2xl font-semibold mt-10 mb-3">Frequently asked questions</h3>
        <div className="space-y-5">
          <div>
            <h4 className="font-semibold text-gray-900">Is the WHO-5 wellbeing check really free in Uganda?</h4>
            <p className="text-gray-700">Yes. The check is 100% free, anonymous, and requires no account. You only pay if you choose to book a follow-up therapy session.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Is the WHO-5 a diagnosis of depression?</h4>
            <p className="text-gray-700">No. The WHO-5 is a screening tool that indicates the likelihood of low wellbeing or depression. Only a licensed mental health professional can diagnose depression.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">How accurate is the WHO-5 for Ugandans?</h4>
            <p className="text-gray-700">The WHO-5 has been validated across more than 30 countries, including studies in sub-Saharan Africa. While no screen is perfect, it is one of the most widely validated wellbeing instruments in the world.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">How often should I take the wellbeing check?</h4>
            <p className="text-gray-700">Every 4 weeks is ideal. Trends across multiple checks are far more meaningful than a single score.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Will my results be shared with anyone?</h4>
            <p className="text-gray-700">No. Your results are private to you. We only store anonymised, aggregated statistics to improve the service — never your personal identity or score.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">What does therapy cost in Uganda through InnerSpark?</h4>
            <p className="text-gray-700">Therapy sessions start from <strong>UGX 30,000</strong>, with the standard 60-minute session at UGX 75,000 (~$22). Payment is via Mobile Money, card, or bank transfer through PesaPal.</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-orange-50 rounded-xl border border-orange-100">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Ready for the next step?</h4>
          <p className="text-gray-700 mb-4">If your wellbeing score is below 50%, talking to a therapist is the highest-impact action you can take. InnerSpark therapists are licensed in Uganda, speak English and Luganda, and are available online from anywhere in the country.</p>
          <Link to="/book-therapist" className="inline-flex font-medium text-white rounded-lg px-6 py-3 bg-primary hover:opacity-90">
            Book a Ugandan therapist →
          </Link>
        </div>
      </article>
    </section>
  );
};

export default WellbeingUgandaGuide;