# SEO architecture
- Derive public static route inventory and literal metadata from the TypeScript syntax tree in scripts/seo-routes.mjs; exclude private and redirect routes so the sitemap cannot advertise protected or duplicate pages.
- Generate raw HTML for every sitemap URL during the production build and fail on missing or duplicate metadata; React still owns the interactive experience.
- Use paginated, published-only CMS reads for blog prerendering and sitemap generation, and fail rather than silently shipping incomplete blog output.
- Sitemap modification dates may use editorial last_updated_at or publication timestamps only; never use generic record updates or generation dates.