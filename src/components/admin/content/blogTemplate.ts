/**
 * The house blog structure, benchmarked on /blog/what-is-mental-health.
 * Inserted into the editor so every post we publish reads the same way and
 * carries the same internal links, stats, steps, expert note, FAQ and CTA.
 */
export const BLOG_BODY_TEMPLATE = `
<h2>Quick answer</h2>
<p>Open with two or three sentences that answer the search question directly. Mention the main keyword naturally, then link to <a href="/book-therapist">book a session with a licensed therapist</a>.</p>

<h2>What this actually means</h2>
<p>Define the topic in plain language. Avoid jargon; write for someone reading on a phone at 11pm.</p>
<ul>
  <li>Key point one</li>
  <li>Key point two</li>
  <li>Key point three</li>
</ul>

<h2>The numbers</h2>
<p>Add two or three credible statistics with sources (WHO, Ministry of Health, APA, NIMH) and link out to them.</p>
<blockquote><p>Stat + source goes here.</p></blockquote>

<h2>What you can do today — step by step</h2>
<h3>1. First step</h3>
<p>One short paragraph the reader can act on immediately.</p>
<h3>2. Second step</h3>
<p>Keep each step practical and specific.</p>
<h3>3. Third step</h3>
<p>Build towards professional support.</p>
<h3>4. Fourth step</h3>
<p>Include a habit or routine they can repeat.</p>
<h3>5. Talk to a professional</h3>
<p>Sessions are private and run over video, voice or chat. <a href="/book-therapist">Book a session</a> or take a free <a href="/mind-check">Mind Check screening</a> first.</p>

<h2>A note from our clinical team</h2>
<p>One short expert paragraph — what a therapist would add or warn about.</p>

<h2>When to get help urgently</h2>
<p>Name the red flags, then point to <a href="/emergency-support">urgent support</a>.</p>

<h2>How InnerSpark can help</h2>
<p>Explain the relevant service in two sentences and link to it — for example <a href="/online-therapy">online therapy</a>, <a href="/support-groups">support groups</a> or <a href="/specialists">our specialists</a>.</p>

<h2>Frequently asked questions</h2>
<p>Leave this section empty here — add the questions in the FAQ builder below so Google can show them as rich results.</p>
`.trim()
