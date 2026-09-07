/**
 * Turns pasted blog text (Word, Google Docs, ChatGPT, plain text) into the
 * InnerSpark house structure: real headings, numbered steps, bullet lists,
 * checklist grids and an extracted FAQ list.
 *
 * Rendering classes used here (blog-callout, blog-crisis, blog-steps,
 * blog-checkgrid) are already styled globally in index.css.
 */

export interface ExtractedFaq {
  question: string;
  answer: string;
}

export interface NormalizedBlog {
  html: string;
  faqs: ExtractedFaq[];
  changed: boolean;
}

const KEEP_CLASSES = ["blog-callout", "blog-crisis", "blog-steps", "blog-checkgrid"];

const BLOCK_KEEP = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6",
  "UL", "OL", "BLOCKQUOTE", "FIGURE", "IMG", "TABLE", "HR", "PRE", "DIV",
]);

const cleanText = (s: string) =>
  s
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Strip Word/Docs junk attributes but keep our own layout classes and links. */
const scrubAttributes = (root: HTMLElement) => {
  root.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName;
    if (tag === "SPAN" || tag === "FONT" || tag === "O:P") {
      el.replaceWith(...Array.from(el.childNodes));
      return;
    }
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name === "href" || name === "src" || name === "alt" || name === "title") return;
      if (name === "class") {
        const kept = attr.value.split(/\s+/).filter((c) => KEEP_CLASSES.includes(c));
        if (kept.length) el.setAttribute("class", kept.join(" "));
        else el.removeAttribute("class");
        return;
      }
      el.removeAttribute(attr.name);
    });
  });
};

/** Inline HTML of an element, with links preserved. */
const inlineHtml = (el: Element) =>
  cleanText(el.innerHTML.replace(/<br\s*\/?>/gi, " "));

type Line = { html: string; text: string };

const isQuestion = (t: string) => t.endsWith("?") && t.length <= 140;
const isNumberedStep = (t: string) => /^(\d{1,2}[.)]\s+|step\s+\d{1,2}[:.)]?\s+)/i.test(t);
const isBullet = (t: string) => /^([-–—•*]|\u2022)\s+/.test(t);
const isSectionHeading = (t: string) => {
  if (t.length > 90 || t.length < 3) return false;
  if (/[.!?]$/.test(t)) return false;
  if (t.endsWith(":")) return true;
  const letters = t.replace(/[^A-Za-z]/g, "");
  if (letters.length >= 4 && letters === letters.toUpperCase()) return true;
  // Title-ish short line with no sentence punctuation and few words
  return /^[A-Z]/.test(t) && t.split(/\s+/).length <= 8 && !/,/.test(t);
};

const stripMarker = (html: string) =>
  html.replace(/^(\d{1,2}[.)]\s+|step\s+\d{1,2}[:.)]?\s+|[-–—•*]\s+|\u2022\s+)/i, "");

/** Split a paragraph that carries multiple lines via <br> into separate lines. */
const paragraphLines = (el: Element): Line[] => {
  const parts = el.innerHTML.split(/<br\s*\/?>/gi);
  return parts
    .map((p) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = p;
      return { html: cleanText(p), text: cleanText(tmp.textContent || "") };
    })
    .filter((l) => l.text.length > 0);
};

export const normalizeBlogHtml = (input: string): NormalizedBlog => {
  const source = (input || "").trim();
  if (!source) return { html: "", faqs: [], changed: false };

  const doc = new DOMParser().parseFromString(`<div id="root">${source}</div>`, "text/html");
  const root = doc.getElementById("root") as HTMLElement;
  if (!root) return { html: source, faqs: [], changed: false };

  scrubAttributes(root);

  const out: string[] = [];
  let stepBuffer: string[] = [];
  let bulletBuffer: string[] = [];

  const flushSteps = () => {
    if (!stepBuffer.length) return;
    out.push(
      `<div class="blog-steps"><ol>${stepBuffer.map((s) => `<li>${s}</li>`).join("")}</ol></div>`
    );
    stepBuffer = [];
  };
  const flushBullets = () => {
    if (!bulletBuffer.length) return;
    out.push(`<ul>${bulletBuffer.map((s) => `<li>${s}</li>`).join("")}</ul>`);
    bulletBuffer = [];
  };
  const flushAll = () => { flushSteps(); flushBullets(); };

  const pushLine = ({ html, text }: Line) => {
    if (isNumberedStep(text)) {
      flushBullets();
      stepBuffer.push(stripMarker(html));
      return;
    }
    if (isBullet(text)) {
      flushSteps();
      bulletBuffer.push(stripMarker(html));
      return;
    }
    flushAll();
    if (isQuestion(text)) { out.push(`<h3>${html}</h3>`); return; }
    if (isSectionHeading(text)) { out.push(`<h2>${html.replace(/:$/, "")}</h2>`); return; }
    out.push(`<p>${html}</p>`);
  };

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = cleanText(node.textContent || "");
      if (text) pushLine({ html: escapeHtml(text), text });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName;

    if (tag === "P") {
      paragraphLines(el).forEach(pushLine);
      return;
    }
    if (BLOCK_KEEP.has(tag)) {
      flushAll();
      if (tag === "H1") { out.push(`<h2>${inlineHtml(el)}</h2>`); return; }
      if (!cleanText(el.textContent || "") && tag !== "IMG" && tag !== "HR" && !el.querySelector("img")) return;
      out.push(el.outerHTML);
      return;
    }
    // Inline leftovers (b, em, a, text wrappers) treated as a paragraph line.
    const text = cleanText(el.textContent || "");
    if (text) pushLine({ html: inlineHtml(el) || escapeHtml(text), text });
  });
  flushAll();

  // ---- FAQ extraction -------------------------------------------------
  const faqs: ExtractedFaq[] = [];
  const blocks = [...out];
  const isH = (s: string, level: 2 | 3) => new RegExp(`^<h${level}[ >]`, "i").test(s);
  const textOf = (s: string) => {
    const d = document.createElement("div");
    d.innerHTML = s;
    return cleanText(d.textContent || "");
  };

  let faqStart = blocks.findIndex(
    (b) => isH(b, 2) && /faq|frequently asked/i.test(textOf(b))
  );

  if (faqStart === -1) {
    // No FAQ heading: look for a trailing run of question + answer pairs.
    let i = blocks.length;
    let pairs = 0;
    while (i >= 2 && isH(blocks[i - 2], 3) && isQuestion(textOf(blocks[i - 2])) && /^<p[ >]/i.test(blocks[i - 1])) {
      i -= 2;
      pairs += 1;
    }
    if (pairs >= 2) faqStart = i - 1; // keep index semantics below (heading slot)
  }

  if (faqStart !== -1) {
    const from = faqStart + 1;
    const tail = blocks.slice(Math.max(from, 0));
    for (let i = 0; i < tail.length - 1; i++) {
      const q = tail[i];
      const a = tail[i + 1];
      if ((isH(q, 3) || isH(q, 2)) && /^<p[ >]/i.test(a)) {
        const question = textOf(q);
        const answer = textOf(a);
        if (isQuestion(question) && answer) {
          faqs.push({ question, answer });
          i++;
        }
      }
    }
    if (faqs.length >= 2) {
      blocks.splice(Math.max(faqStart, 0));
    } else {
      faqs.length = 0;
    }
  }

  const html = blocks.join("\n");
  return { html, faqs, changed: html !== source };
};

/** Quality checks shown before publishing. Warnings only, never blocking. */
export const auditBlogBody = (html: string, faqCount: number): string[] => {
  const warnings: string[] = [];
  const doc = new DOMParser().parseFromString(`<div id="r">${html || ""}</div>`, "text/html");
  const root = doc.getElementById("r");
  const text = cleanText(root?.textContent || "");
  const headings = root?.querySelectorAll("h2, h3").length || 0;
  const firstPart = html.slice(0, Math.max(900, Math.floor(html.length * 0.3)));

  if (text.split(/\s+/).length < 400) warnings.push("The post is short — aim for 800+ words for search visibility.");
  if (headings < 2) warnings.push("Add at least two section headings so the post is scannable.");
  if (!/\/book-therapist|\/online-therapy|\/mind-check/.test(firstPart))
    warnings.push("No booking link near the top — add one in the first two paragraphs.");
  if (faqCount < 2) warnings.push("Add at least two FAQs so Google can show rich results.");
  return warnings;
};
