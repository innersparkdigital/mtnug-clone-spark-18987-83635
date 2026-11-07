import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { canonicalUrl, routeInventory } from './seo-routes.mjs';

const urls = [];
for (const file of ['sitemap.xml', 'sitemap-blogs.xml']) {
  const xml = await readFile(path.resolve('dist', file), 'utf8');
  urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
}
const inventory = new Map(routeInventory().map(r => [r.path, r]));
const titles = new Set();
const descriptions = new Set();
const seen = new Set();
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const route = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  if (url !== canonicalUrl(route) || /[:*]/.test(route) || inventory.get(route)?.private || inventory.get(route)?.redirect || seen.has(url)) throw new Error(`Invalid sitemap URL: ${url}`);
  seen.add(url);
  const html = await readFile(path.resolve('dist', `.${pathname}`, 'index.html'), 'utf8');
  const $ = load(html);
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim();
  if (!title || !description || titles.has(title) || descriptions.has(description)) throw new Error(`Missing or duplicate metadata: ${url}`);
  if ($('link[rel="canonical"]').length !== 1 || $('link[rel="canonical"]').attr('href') !== url || $('meta[property="og:url"]').attr('content') !== url) throw new Error(`Incorrect canonical/OG URL: ${url}`);
  if (!$('h1').text().trim()) throw new Error(`No readable page heading: ${url}`);
  titles.add(title); descriptions.add(description);
}
console.log(`[seo-output] ${urls.length} public URLs passed raw HTML metadata and sitemap checks.`);