# Making every blog come out structured — even when you just paste text

## Why the new posts look messy

The house design already exists (hero, "What you'll learn" box, numbered steps, checklist grid, crisis box, FAQ, booking box). The problem is the **body text you paste**.

When you paste from Word, Google Docs or ChatGPT, everything arrives as one long run of plain paragraphs. Your screenshot shows exactly that: the FAQ questions ("How is burnout different from just being tired?") land as ordinary paragraphs instead of proper question headings, so the page reads like a wall of text.

So the fix is not a new design — it is making the paste **become** the structure automatically.

## What I propose

### 1. Smart paste clean-up
When you paste into the blog editor, the text is automatically tidied:
- Short lines that end in a question mark become question headings
- Lines like "1." / "Step 2" become proper numbered steps
- Lines starting with a dash or bullet become bullet lists
- Section names in ALL CAPS or ending in a colon become section headings
- Word/Docs junk (stray fonts, colours, empty paragraphs, smart-quote noise) is stripped

### 2. A one-click "Structure this post" button
Sits above the editor. Runs the same clean-up on content already saved, so the posts published in the last weeks can be fixed one by one without retyping them.

### 3. Guided section blocks in the editor
Instead of one big blank box, buttons to drop in ready-made blocks:
Quick answer · What you'll learn · Signs list · Statistics with source · Crisis box · Step-by-step · What therapy looks like · Note from our clinical team · FAQ · Booking box.
You then just replace the placeholder words with your text — impossible to end up disorganised.

### 4. Automatic FAQ pick-up
Any question-and-answer pairs left at the bottom of the body get moved into the FAQ builder automatically, so they show as a proper accordion and can win Google rich results.

### 5. A publish check
Before a post can be published, a short checklist warns if it is missing: an intro answer, at least two section headings, a booking link in the first part, or FAQs. Warning only — it never blocks you.

### 6. Fix the posts already live
Run the clean-up across the recently published posts (starting with the burnout one in your screenshot) and confirm each one renders with headings, steps and a real FAQ block.

## Technical notes
- Paste normaliser: new `src/lib/blogContentNormalizer.ts` — HTML in, structured HTML out, using the existing `blog-callout` / `blog-crisis` / `blog-steps` / `blog-checkgrid` classes already styled in `index.css`.
- Hooked into the rich-text editor's paste handler in `BlogsManager.tsx`, plus a manual "Structure this post" action.
- Section-block inserter extends the existing `BLOG_BODY_TEMPLATE` into individual snippets.
- FAQ extraction writes into the existing `faqs` column so `FaqSection` and FAQPage schema keep working.
- No change to `BlogPostLayout` / `CmsBlogPost` rendering or the site design.

## Order of work
1. Normaliser + paste hook + "Structure this post" button
2. Section blocks and publish checklist
3. FAQ auto-extraction
4. Clean up the already-published posts and verify in the preview
