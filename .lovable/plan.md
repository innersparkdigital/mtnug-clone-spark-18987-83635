# Migrate all built-in blog articles into the CMS

## Goal
Move every hardcoded blog page (currently 27 articles in `src/pages/blog/` plus the static list in `src/pages/Blog.tsx`) into the `blog_posts` table so the admin dashboard can edit, publish, unpublish, and delete them.

## Steps

1. **Inventory**
   - List every route in `src/App.tsx` that points to a `src/pages/blog/*.tsx` component.
   - Map each route to its slug, title, excerpt, category, hero image, read time, and published date.

2. **Extract article bodies**
   - Read each `src/pages/blog/*.tsx` file and pull the rendered HTML/article content.
   - Convert JSX content into clean HTML suitable for the CMS `content` column.
   - Preserve headings, lists, links, images, FAQ sections, and internal `/book-therapist` CTAs.

3. **Prepare SEO metadata for each post**
   - Derive `meta_title`, `meta_description`, `meta_keywords`, `canonical_url`, `og_title`, `og_description`, `og_image_url`, and `schema_type` from existing Helmet data or generate sensible defaults.

4. **Insert into `blog_posts`**
   - Build a single Edge Function or migration SQL script that inserts all 27 posts with status `published`.
   - Avoid duplicates: skip any slug that already exists in `blog_posts`.

5. **Update routing**
   - In `src/App.tsx`, replace the 27 individual blog component routes with one dynamic route `/blog/:slug` that renders `CmsBlogPost.tsx`.
   - Add redirect rules for any old blog slugs that changed.

6. **Update the blog listing**
   - Ensure `src/pages/Blog.tsx` still shows all posts by reading from `blog_posts` only.
   - Remove the hardcoded `blogPosts` array once migration is confirmed.

7. **Update sitemap generation**
   - Ensure `scripts/generate-blog-sitemap.mjs` and `public/sitemap-blogs.xml` include the migrated posts.

8. **Validate**
   - Run TypeScript check.
   - Spot-check 3–5 migrated posts in the preview for correct layout, images, FAQ, and booking CTAs.
   - Confirm the admin dashboard now lists all posts (expected ~38 total).

## Acceptance criteria
- Admin dashboard blog manager shows every article currently on the live `/blog` page.
- Each migrated article opens correctly at `/blog/{slug}` using the CMS layout.
- No 404s for previously working blog URLs.
- TypeScript passes and the preview builds.
