#!/usr/bin/env node

/**
 * Sitemap URL Validator
 * 
 * This script checks all URLs in the sitemap.xml file and reports:
 * - Which URLs return 200 (OK)
 * - Which URLs return non-200 status codes (errors)
 * 
 * Usage: node scripts/validate-sitemap.js
 * 
 * Note: Run this against your production site after deploying.
 * For local testing, start your dev server first.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const BASE_URL = process.env.BASE_URL || 'https://innerspark.africa';
const LOCAL_URL = 'http://localhost:8080';
const USE_LOCAL = process.argv.includes('--local');

// ANSI colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Extract URLs from sitemap XML
function extractUrlsFromSitemap(sitemapContent) {
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  
  while ((match = urlRegex.exec(sitemapContent)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

// Check a single URL
async function checkUrl(url) {
  const testUrl = USE_LOCAL 
    ? url.replace(BASE_URL, LOCAL_URL)
    : url;
    
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(testUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow'
    });
    
    clearTimeout(timeoutId);
    
    return {
      url,
      testUrl,
      status: response.status,
      ok: response.ok,
      redirected: response.redirected,
      finalUrl: response.url
    };
  } catch (error) {
    return {
      url,
      testUrl,
      status: 'ERROR',
      ok: false,
      error: error.message
    };
  }
}

// Main validation function
async function validateSitemap() {
  console.log(`\n${colors.bold}${colors.blue}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}       Sitemap URL Validator${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════${colors.reset}\n`);
  
  // Read sitemap
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`${colors.red}Error: Sitemap not found at ${SITEMAP_PATH}${colors.reset}`);
    process.exit(1);
  }
  
  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = extractUrlsFromSitemap(sitemapContent);
  
  console.log(`${colors.blue}Testing ${urls.length} URLs from sitemap...${colors.reset}`);
  console.log(`${colors.blue}Mode: ${USE_LOCAL ? 'Local (localhost:8080)' : 'Production'}${colors.reset}\n`);
  
  const results = {
    success: [],
    redirects: [],
    errors: []
  };
  
  // Check all URLs
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await checkUrl(url);
    
    const progress = `[${i + 1}/${urls.length}]`;
    
    if (result.ok && !result.redirected) {
      results.success.push(result);
      console.log(`${colors.green}✓${colors.reset} ${progress} ${result.status} ${url.replace(BASE_URL, '')}`);
    } else if (result.redirected) {
      results.redirects.push(result);
      console.log(`${colors.yellow}→${colors.reset} ${progress} ${result.status} ${url.replace(BASE_URL, '')} → ${result.finalUrl}`);
    } else {
      results.errors.push(result);
      console.log(`${colors.red}✗${colors.reset} ${progress} ${result.status} ${url.replace(BASE_URL, '')} ${result.error || ''}`);
    }
  }
  
  // Summary
  console.log(`\n${colors.bold}${colors.blue}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}                 SUMMARY${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════${colors.reset}\n`);
  
  console.log(`${colors.green}✓ Successful (200):${colors.reset} ${results.success.length}`);
  console.log(`${colors.yellow}→ Redirects:${colors.reset}        ${results.redirects.length}`);
  console.log(`${colors.red}✗ Errors:${colors.reset}           ${results.errors.length}`);
  console.log(`${colors.blue}─────────────────────${colors.reset}`);
  console.log(`  Total URLs:       ${urls.length}\n`);
  
  // Report errors in detail
  if (results.errors.length > 0) {
    console.log(`${colors.bold}${colors.red}URLs with Errors:${colors.reset}\n`);
    results.errors.forEach(err => {
      console.log(`  ${colors.red}•${colors.reset} ${err.url}`);
      console.log(`    Status: ${err.status}${err.error ? ` - ${err.error}` : ''}\n`);
    });
  }
  
  // Report redirects
  if (results.redirects.length > 0) {
    console.log(`${colors.bold}${colors.yellow}Redirected URLs:${colors.reset}\n`);
    results.redirects.forEach(redir => {
      console.log(`  ${colors.yellow}•${colors.reset} ${redir.url}`);
      console.log(`    → ${redir.finalUrl}\n`);
    });
  }
  
  // Exit code based on errors
  if (results.errors.length > 0) {
    console.log(`${colors.red}${colors.bold}Validation failed with ${results.errors.length} error(s)${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}All URLs validated successfully!${colors.reset}\n`);
    process.exit(0);
  }
}

// Run validation
validateSitemap().catch(err => {
  console.error(`${colors.red}Validation failed:${colors.reset}`, err);
  process.exit(1);
});
