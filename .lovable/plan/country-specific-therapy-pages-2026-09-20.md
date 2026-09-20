# Country-specific therapy pages

## Goal
Extend the Kenya conversion pattern to Nigeria, Tanzania, The Gambia, Ghana, and the United States while keeping each page useful, locally relevant, and discoverable.

## Build
- Replace the current brief country pages with a richer shared page structure customized per market.
- Give every market unique messaging for local pressures, major cities, currency, estimated session prices, payment context, trust points, FAQs, and search metadata.
- Add a reusable country detector that uses browser locale and timezone signals, while avoiding ambiguous automatic redirects.
- Show a country-specific homepage invitation only to detected visitors, linking them to their local page; preserve Kenya behavior.
- Keep all country routes public, linked in “Where we work,” and included in the sitemap so search engines can discover them globally.

## Technical details
- Country detection remains privacy-friendly and browser-based; no location data is stored.
- Country pages will use existing booking and wellbeing-check flows.
- Raw prerendered HTML will retain unique country titles, descriptions, headings, and substantive copy for indexing.
- Local prices will be clearly marked as estimates where payment conversion determines the final amount.

## Validation
- Check each route on desktop and mobile for layout, booking actions, metadata, and country copy.
- Confirm homepage invitation selection for representative country locale/timezone combinations.
- Confirm all five routes remain in the sitemap and prerender configuration.
