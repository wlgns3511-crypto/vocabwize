#!/usr/bin/env tsx
/**
 * build-sitemap.ts — Static sitemap XML generator for vocabwize.
 *
 * PRUNING HISTORY (post-HCU March 2026):
 *   Pre-prune: ~165,000 URLs. Dominated by:
 *     → /word/[slug] × 160,521 (full dictionary, 114,470 with frequency=0 are
 *        obscure/archaic words with no real search signal)
 *     → /es/word/[slug] × 160,521 thin Spanish translations, zero GSC clicks
 *   2026-04-22: Option B+ prune for HCU defense. GSC pattern:
 *     → Zero-frequency words = dictionary completeness but HCU-hostile bloat.
 *     → /es/word/ = thin translations, compete with real Spanish dictionaries.
 *     → Real clicks came from top-frequency words + comparisons + guides.
 *
 *   KEEP: 46,051 /word/[slug] with frequency > 0 (real-signal vocabulary)
 *         100 /compare/[slugs] (route statically caps via getTopComparisons(100))
 *         26 /letter/[a-z] + 8 /pos/[pos] + 13 /words-length/[3-15] hubs
 *         3 /insights/[slug] data-journalism articles
 *         All /guide/ and /blog/ editorial content
 *         Static pages (/, /rankings/, /quiz/, /search/, /compare/, /word/, etc.)
 *
 *   DROP: 114,470 zero-frequency /word/[slug] (route stays live via dynamicParams=true)
 *         160,521 /es/word/[slug] thin translations (keep /es/ homepage only)
 *         /rhymes/[slug] — derivative content, route stays live for clicks
 *
 * GROWTH PROTOCOL:
 *   If Tier 1 hits >70% indexation, candidates to whitelist:
 *     1. Zero-freq words that earn GSC impressions > 0
 *     2. Top-500 /rhymes/[slug] for most-searched rhyme queries
 *   Do NOT re-add full 160K. Lesson: quality not cardinality.
 *
 * USAGE:
 *   npx tsx scripts/build-sitemap.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  getTopComparisons,
  getAvailableLengths,
} from '../lib/db';
import { getAllGuides } from '../lib/guides';
import { getAllPosts } from '../lib/blog';
import { getAllInsightArticles } from '../lib/insight-articles';
import { getAllResearchArticles } from '../lib/research-articles';
import { TREND_TYPES } from '../lib/word-trends';
// HCU 2026-04-28: sitemap source MUST match app/word/[slug]/page.tsx generateStaticParams.
// Previously emitted 46K freq>0 words via getTopWords(50000); page only renders 20K via
// wordKeepList. The 26K mismatch was leaking 410 Gone URLs into Google's crawl queue —
// the exact "sitemap promises pages that 410" pattern HCU flags as scaled content abuse.
import wordKeepList from '../lib/generated/word-keep.json';

const SITE_URL = 'https://vocabwize.com';
const NOW = new Date().toISOString().split('T')[0];
const SHARD_SIZE = 40000;
const OUT_DIR = path.resolve(__dirname, '..', 'public');

// POS_LIST hardcoded in app/pos/[pos]/page.tsx — mirror here.
const POS_LIST = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'];

interface Entry { url: string; lastmod?: string; priority?: string; changefreq?: string; }

function urlTag(e: Entry): string {
  return `  <url><loc>${e.url}</loc><lastmod>${e.lastmod ?? NOW}</lastmod><changefreq>${e.changefreq ?? 'monthly'}</changefreq><priority>${e.priority ?? '0.6'}</priority></url>`;
}

function writeShard(id: number, es: Entry[]) {
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    es.map(urlTag).join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(OUT_DIR, `sitemap-${id}.xml`), xml);
}

const seen = new Set<string>();
const entries: Entry[] = [];
function add(e: Entry) { if (!seen.has(e.url)) { seen.add(e.url); entries.push(e); } }

// Static pages + hubs + /es/ home
for (const [p, pr, cf] of [
  ['/', '1.0', 'weekly'],
  ['/es/', '0.5', 'monthly'],
  ['/word/', '0.9', 'weekly'],
  ['/compare/', '0.9', 'monthly'],
  ['/letter/', '0.8', 'monthly'],
  ['/pos/', '0.8', 'monthly'],
  ['/words-length/', '0.8', 'monthly'],
  ['/rankings/', '0.8', 'weekly'],
  ['/quiz/', '0.7', 'monthly'],
  ['/insights/', '0.7', 'monthly'],
  ['/trends/', '0.8', 'weekly'],
  ['/research/', '0.7', 'monthly'],
  ['/guide/', '0.8', 'weekly'],
  ['/blog/', '0.8', 'weekly'],
  ['/search/', '0.5', 'monthly'],
  ['/about/', '0.3', 'yearly'],
  ['/methodology/', '0.4', 'yearly'],
  ['/editorial-policy/', '0.3', 'yearly'],
  ['/corrections-policy/', '0.3', 'yearly'],
  ['/contact/', '0.3', 'yearly'],
  ['/privacy/', '0.2', 'yearly'],
  ['/terms/', '0.2', 'yearly'],
  ['/disclaimer/', '0.2', 'yearly'],
] as [string, string, string][]) {
  add({ url: `${SITE_URL}${p}`, priority: pr, changefreq: cf });
}

// Letter hubs: 26 a-z
for (const letter of 'abcdefghijklmnopqrstuvwxyz'.split('')) {
  add({ url: `${SITE_URL}/letter/${letter}/`, priority: '0.6', changefreq: 'monthly' });
}

// POS hubs: 8 (matches app/pos/[pos] hard list)
for (const pos of POS_LIST) {
  add({ url: `${SITE_URL}/pos/${pos}/`, priority: '0.6', changefreq: 'monthly' });
}

// Length hubs: dynamic from DB (3..15)
for (const len of getAvailableLengths()) {
  add({ url: `${SITE_URL}/words-length/${len}/`, priority: '0.6', changefreq: 'monthly' });
}

// Words: 20K from word-keep.json — single source of truth shared with
// app/word/[slug]/page.tsx generateStaticParams. Anything outside this set
// is intentionally 410 Gone via middleware keep-set; emitting them in the
// sitemap was the structural bug fixed 2026-04-28.
for (const slug of wordKeepList as string[]) {
  add({ url: `${SITE_URL}/word/${slug}/`, priority: '0.7', changefreq: 'monthly' });
}

// Comparisons: hard cap 100 — matches /compare/[slugs] ALLOWED_COMPARISON_SLUGS.
// Route uses dynamicParams=false + top-100 comparisons, so these are the only
// ones that render. 404-safe.
for (const cmp of getTopComparisons(100)) {
  const canonical = [cmp.slugA, cmp.slugB].sort().join('-vs-');
  add({ url: `${SITE_URL}/compare/${canonical}/`, priority: '0.7', changefreq: 'monthly' });
}

// ─── /es/word/[slug] × 160,521 DROPPED 2026-04-22 ─────────────────────────
// Thin Spanish translations, zero GSC signal, competes with real ES dictionaries.
// /es/ homepage kept for language-switch UX.

// ─── /rhymes/[slug] × 5,000 DROPPED 2026-04-22 ────────────────────────────
// Derivative content (list of rhyming words). Route stays live via
// dynamicParams=true; candidates for whitelist if GSC shows rhyme-intent clicks.

// Insights: data-journalism articles (small, editorial)
for (const a of getAllInsightArticles()) {
  add({ url: `${SITE_URL}/insights/${a.slug}/`, priority: '0.7', changefreq: 'monthly' });
}

// Trend cluster pages: 1 hub + 7 status buckets (matches /trends/[type] hardcoded list)
for (const t of TREND_TYPES) {
  add({ url: `${SITE_URL}/trends/${t}/`, priority: '0.7', changefreq: 'weekly' });
}

// Research: data-journalism long-form articles (NGram-based)
for (const a of getAllResearchArticles()) {
  add({ url: `${SITE_URL}/research/${a.slug}/`, priority: '0.7', changefreq: 'monthly' });
}

// Guides
for (const g of getAllGuides()) {
  add({ url: `${SITE_URL}/guide/${g.slug}/`, priority: '0.7', changefreq: 'monthly' });
}

// Blog
for (const post of getAllPosts()) {
  add({ url: `${SITE_URL}/blog/${post.slug}/`, priority: '0.7', changefreq: 'monthly' });
}

// ─── Cardinality guard ────────────────────────────────────────────────────
if (entries.length > 22000 && !process.env.SITEMAP_LARGE_OK) {
  throw new Error(
    `vocabwize sitemap has ${entries.length.toLocaleString()} URLs — page-keep budget is ~20K.\n` +
      `Did the source diverge from word-keep.json again?\n` +
      `Sitemap MUST match app/word/[slug]/page.tsx generateStaticParams source.\n` +
      `Run with SITEMAP_LARGE_OK=1 if you genuinely meant to expand the tier.`,
  );
}

for (const f of fs.readdirSync(OUT_DIR)) {
  if (/^sitemap(-\d+)?\.xml$/.test(f)) fs.unlinkSync(path.join(OUT_DIR, f));
}
const oldDir = path.join(OUT_DIR, 'sitemap');
if (fs.existsSync(oldDir)) fs.rmSync(oldDir, { recursive: true, force: true });

const shardCount = Math.ceil(entries.length / SHARD_SIZE);
if (shardCount <= 1) {
  writeShard(0, entries);
  fs.renameSync(path.join(OUT_DIR, 'sitemap-0.xml'), path.join(OUT_DIR, 'sitemap.xml'));
} else {
  for (let i = 0; i < shardCount; i++) {
    writeShard(i, entries.slice(i * SHARD_SIZE, (i + 1) * SHARD_SIZE));
  }
  const indexXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    Array.from({ length: shardCount }, (_, i) =>
      `  <sitemap><loc>${SITE_URL}/sitemap-${i}.xml</loc><lastmod>${NOW}</lastmod></sitemap>`
    ).join('\n') + '\n</sitemapindex>\n';
  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), indexXml);
}

console.log(`✓ vocabwize sitemap: ${entries.length} unique URLs, ${shardCount || 1} shard(s)`);
