# Scripts

## Sitemap URL Validator

Validates that all URLs in `public/sitemap.xml` return 200 status codes.

### Usage

**Check production site:**
```bash
node scripts/validate-sitemap.js
```

**Check local dev server:**
```bash
# First, start your dev server
npm run dev

# Then in another terminal:
node scripts/validate-sitemap.js --local
```

### What it checks

- ✓ **200 OK** - URL is accessible
- → **Redirects** - URL redirects to another location (may indicate duplicate content issues)
- ✗ **Errors** - 404s, 500s, or network errors

### Fixing Issues

1. **404 Not Found**: 
   - Check if the route exists in `src/App.tsx`
   - Ensure the URL in sitemap matches the actual route path

2. **Redirects**: 
   - Remove redirected URLs from sitemap
   - Only include the final destination URL

3. **Soft 404s** (not detected by this script):
   - These return 200 but show error content
   - Check in Google Search Console for these
