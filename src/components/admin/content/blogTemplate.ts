/**
 * The house blog structure, benchmarked on /blog/depression-uganda.
 * Inserted into the editor so every post we publish reads the same way and
 * carries the same callout boxes, steps, checklist grid, FAQ and CTA.
 *
 * The class names below (blog-callout, blog-crisis, blog-steps, blog-checkgrid)
 * are styled globally, so keep them on the wrapper divs.
 */
export const BLOG_BODY_TEMPLATE = `
<h2>Quick answer</h2>
<p>Open with two or three sentences that answer the search question directly. Mention the main keyword naturally, then link to <a href="/book-therapist">book a session with a licensed therapist</a>.</p>

<div class="blog-callout"><p><strong>What you'll learn:</strong> one short paragraph summarising the key takeaways of this post.</p></div>

<h2>What this actually means</h2>
<p>Define the topic in plain language. Avoid jargon; write for someone reading on a phone at 11pm.</p>

<h3>Emotional signs</h3>
<ul><li>Point one</li><li>Point two</li></ul>

<h3>Physical signs</h3>
<ul><li>Point one</li><li>Point two</li></ul>

<h3>Behavioural signs</h3>
<ul><li>Point one</li><li>Point two</li></ul>

<h2>The numbers</h2>
<p>Add two or three credible statistics with sources (WHO, Ministry of Health, APA, NIMH) and link out to them.</p>
<blockquote><p>Stat + source goes here.</p></blockquote>

<div class="blog-crisis"><p><strong>If you are in crisis:</strong> if you are thinking about harming yourself, please reach out now. Visit our <a href="/emergency-support">urgent support page</a> or contact Butabika National Referral Mental Hospital in Kampala. You do not have to wait for an appointment.</p></div>

<h2>What you can do today — step by step</h2>
<div class="blog-steps">
  <ol>
    <li>First step the reader can act on immediately.</li>
    <li>Second step — keep it practical and specific.</li>
    <li>Third step — build towards professional support.</li>
    <li>Fourth step — a habit or routine they can repeat.</li>
    <li>Talk to a professional — sessions are private and run over video, voice or chat. <a href="/book-therapist">Book a session</a> or take a free <a href="/mind-check">Mind Check screening</a> first.</li>
  </ol>
</div>

<h2>What therapy with InnerSpark looks like</h2>
<div class="blog-checkgrid">
  <ul>
    <li>Sessions on WhatsApp video, voice or chat</li>
    <li>Licensed Ugandan therapists</li>
    <li>From UGX 30,000 per session</li>
    <li>Pay by MTN or Airtel Mobile Money</li>
    <li>Private and confidential</li>
    <li>Book in about two minutes</li>
  </ul>
</div>

<h2>A note from our clinical team</h2>
<p>One short expert paragraph — what a therapist would add or warn about.</p>

<h2>How InnerSpark can help</h2>
<p>Explain the relevant service in two sentences and link to it — for example <a href="/online-therapy">online therapy</a>, <a href="/support-groups">support groups</a> or <a href="/specialists">our specialists</a>.</p>

<h2>Frequently asked questions</h2>
<p>Leave this section empty here — add the questions in the FAQ builder below so Google can show them as rich results.</p>
`.trim()

/** Individual building blocks the editor can drop in one at a time. */
export const BLOG_SECTION_BLOCKS: { label: string; html: string }[] = [
  {
    label: "Quick answer",
    html: `<h2>Quick answer</h2><p>Answer the search question directly in two or three sentences, then link to <a href="/book-therapist">book a session with a licensed therapist</a>.</p>`,
  },
  {
    label: "What you'll learn",
    html: `<div class="blog-callout"><p><strong>What you'll learn:</strong> one short paragraph summarising the key takeaways.</p></div>`,
  },
  {
    label: "Signs list",
    html: `<h2>Signs to look out for</h2><h3>Emotional signs</h3><ul><li>Point one</li><li>Point two</li></ul><h3>Physical signs</h3><ul><li>Point one</li><li>Point two</li></ul>`,
  },
  {
    label: "Statistic + source",
    html: `<h2>The numbers</h2><blockquote><p>Statistic here — <a href="https://www.who.int/" rel="nofollow">source (WHO)</a>.</p></blockquote>`,
  },
  {
    label: "Crisis box",
    html: `<div class="blog-crisis"><p><strong>If you are in crisis:</strong> if you are thinking about harming yourself, please reach out now. Visit our <a href="/emergency-support">urgent support page</a> or contact Butabika National Referral Mental Hospital in Kampala.</p></div>`,
  },
  {
    label: "Step-by-step",
    html: `<h2>What you can do today — step by step</h2><div class="blog-steps"><ol><li>First practical step.</li><li>Second step.</li><li>Third step.</li><li>Talk to a professional — <a href="/book-therapist">book a session</a>.</li></ol></div>`,
  },
  {
    label: "What therapy looks like",
    html: `<h2>What therapy with InnerSpark looks like</h2><div class="blog-checkgrid"><ul><li>Sessions on video, voice or chat</li><li>Licensed Ugandan therapists</li><li>From UGX 30,000 per session</li><li>Pay by MTN or Airtel Money</li><li>Private and confidential</li><li>Book in about two minutes</li></ul></div>`,
  },
  {
    label: "Note from clinical team",
    html: `<h2>A note from our clinical team</h2><p>One short expert paragraph — what a therapist would add or warn about.</p>`,
  },
  {
    label: "FAQ heading",
    html: `<h2>Frequently asked questions</h2><h3>Your question here?</h3><p>Short, factual answer.</p>`,
  },
  {
    label: "Booking box",
    html: `<h2>How InnerSpark can help</h2><p>Explain the relevant service in two sentences and link to it — for example <a href="/online-therapy">online therapy</a> or <a href="/support-groups">support groups</a>.</p>`,
  },
];
