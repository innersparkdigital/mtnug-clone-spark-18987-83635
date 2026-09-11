# Clean Google Search Console exclusions

## Goal
Reduce avoidable “not indexed” reports without deleting useful public pages or removing intentional privacy protections.

## Changes
- Keep private, account, payment, and confirmation pages excluded; these should remain `noindex`.
- Keep old URLs that redirect to a stronger canonical page; redirects are expected exclusions.
- Remove redirecting URLs from sitemap output and make sitemap URLs match their final live form.
- Expand build-time page metadata so public sitemap pages receive self-referencing canonicals instead of inheriting the homepage canonical.
- Regenerate the standard and blog sitemaps using only canonical public URLs.
- Validate sitemap URLs for successful responses, correct canonicals, and accidental `noindex` tags.
- Resubmit the sitemap index once the corrected files are live.

## Important note
Google’s excluded-page report is historical and will not become zero immediately. Valid redirects, alternate hosting URLs, and private pages remain excluded by design; Google clears old entries after recrawling.

## Technical details
- Update the existing sitemap generator rather than replacing its mechanism.
- Preserve the existing `www.innersparkafrica.com` canonical domain.
- Preserve page content and visual design; changes affect crawl signals and generated HTML only.
