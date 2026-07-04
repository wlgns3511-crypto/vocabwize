#!/usr/bin/env tsx
/**
 * build-keep-sets.ts — HCU 2026-04-24 (vocabwize)
 *
 * Emits two JSON files consumed by BOTH middleware (Edge runtime, no
 * better-sqlite3) and page.tsx (SSG generateStaticParams):
 *   - lib/generated/word-keep.json     — top-20K by frequency + GSC evidence
 *   - lib/generated/compare-keep.json  — top-100 by popularity + GSC evidence
 *
 * Scope choice:
 *   /word/ 160,521 rows in DB but only 46,051 have frequency > 0. Prior HCU
 *   pass capped prerender at 20K top-frequency. That cap killed 8 of the 10
 *   /word/ GSC earners (vixen rank 24262, xvx rank 46051 both out of 20K).
 *   Union with GSC evidence rescues those earners without expanding the cap.
 *
 *   /compare/ has only 2,515 rows in DB. Prior cap of 100 in page.tsx means
 *   we kept just 4% of the table. None of the 10 GSC compare pairs exist in
 *   the comparisons table — they're historical artifacts. BUT both word
 *   halves exist in the words table, and the /compare/ page renders from
 *   words (it only uses the comparisons table as a whitelist gate). So
 *   adding them to the keep-set lets the page render successfully.
 *
 * Routes intentionally NOT managed here (left as-is with dynamicParams=false):
 *   /[entity]/, /letter/, /pos/, /rankings/, /rhymes/, /words-length/ —
 *   small prerender counts, low GSC signal, not worth cleanup investment.
 */
import * as fs from 'fs';
import * as path from 'path';
import { getTopWords, getTopComparisons, getWordBySlug } from '../lib/db';

const WORD_CAP = 2000;
const COMPARE_CAP = 100;

// HCU 2026-05-04 — Bing impressions auto-union (separate index from Google).
const BING_JSON_DIR = path.resolve(__dirname, '..', '..', '_shared', 'data', 'bing_analyze');
const BING_DOMAIN = 'vocabwize.com';
const BING_MIN_IMP = 1;

function loadBingSlugs(routeRe: RegExp): string[] {
  if (!fs.existsSync(BING_JSON_DIR)) return [];
  // 2026-05-15 patch: scan files newest-first, pick first that has THIS domain.
  // Some snapshots are partial (only N sites refreshed that day) — picking
  // the absolute-latest file would yield 0 Bing slugs for sites not in it.
  const files = fs.readdirSync(BING_JSON_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .reverse();
  for (const fname of files) {
    try {
      const json = JSON.parse(fs.readFileSync(path.join(BING_JSON_DIR, fname), 'utf8'));
      const site = json[BING_DOMAIN];
      if (!site || !Array.isArray(site.pages)) continue;
      const out = new Map<string, number>();
      for (const pg of site.pages) {
        const url = String(pg.url || '');
        const pathOnly = url.replace(/^https?:\/\/[^/]+/, '');
        const m = routeRe.exec(pathOnly);
        if (!m) continue;
        const slug = decodeURIComponent(m[1]);
        const imp = Number(pg.impressions) || 0;
        out.set(slug, (out.get(slug) || 0) + imp);
      }
      return [...out.entries()].filter(([, i]) => i >= BING_MIN_IMP).map(([s]) => s);
    } catch {
      // try next file
    }
  }
  return [];
}

// GSC evidence — /word/ URLs earning ≥1 click in 28d window (2026-03-24 ~
// 2026-04-21). 8 of 10 below frequency rank 20000 → killed without union.
const GSC_EVIDENCE_WORDS = [
  'vixen',         // rank 24262 — 2 clicks (0 clicks on hemingway-esque alt)
  'expanded',      // rank 38799 — 1 click
  'false',         // rank 43977 — 1 click
  'hemingwayesque',// rank 46051 (freq 0) — 1 click
  'implement',     // rank 44175 — 1 click
  'keyes',         // rank 8157 — 1 click (in top-20K already, redundant)
  'kreel',         // rank 46051 — 1 click
  'noticing',      // rank 5621 — 1 click (in top-20K already, redundant)
  'ok',            // rank 42965 — 1 click
  'xvx',           // rank 46051 — 1 click (196 imp, interesting)
];

// Market evidence — 2026-07-03 Bing GetRelatedKeywords mining. These are
// high-volume search MARKETS (semiannual Bing impressions, NOT our own page
// impressions — we serve 410 so we never appear, which is exactly why the
// Bing-pages union above can't catch them). All are DB-backed with real
// WordNet definitions; keep-add makes them 200-eligible for the trial.
// See vault/50-Audit/2026-07-03-dict-sibling-mining.md.
const MARKET_EVIDENCE_WORDS = [
  'serendipity',    // ~130,000 impr
  'synergy',        //  ~90,000
  'demure',         //  ~63,000 (2024 slang revival)
  'purview',        //  ~61,000
  'pertinent',      //  ~50,000
  'erroneous',      //  ~35,000
  'amenable',       //  ~33,000
  'acumen',         //  ~29,000 (definition fixed 2026-07-03 to lead with the modern sense)
  'aforementioned', //  ~28,000
];

// GSC evidence — /compare/ URLs earning ≥1 click in 28d window. None exist
// in comparisons table (historical artifacts), but all word halves exist in
// words table → page renders successfully once in keep-set.
const GSC_EVIDENCE_COMPARES: [string, string][] = [
  ['casing', 'cassino'],       // 2 clicks
  ['carcinogen', 'caruso'],    // 1 click
  ['abyss', 'abyssinia'],      // 1 click
  ['allocated', 'allottee'],   // 1 click
  ['amor', 'amour'],           // 1 click
  ['amputate', 'anathematising'],
  ['androgynous', 'andromeda'],
  ['arabesque', 'arabian'],
  ['balloonist', 'balsamous'],
  ['bani', 'banyan'],
];

const OUT_DIR = path.resolve(__dirname, '..', 'lib', 'generated');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── /word/ keep-set ──────────────────────────────────────────────────
const wordBase = getTopWords(WORD_CAP).map((w) => w.slug);
const wordSet = new Set<string>(wordBase);
let wordAdded = 0;
let wordSkipped = 0;
for (const slug of [...GSC_EVIDENCE_WORDS, ...MARKET_EVIDENCE_WORDS]) {
  if (!getWordBySlug(slug)) {
    wordSkipped++;
    continue;
  }
  if (!wordSet.has(slug)) wordAdded++;
  wordSet.add(slug);
}
// Bing union — only DB-backed words. /rhymes/[slug] also uses word-keep.json
// (page.tsx imports it), so union both routes' Bing impressions.
const bingWords = loadBingSlugs(/^\/word\/([^/]+)\/?$/);
const bingRhymes = loadBingSlugs(/^\/rhymes\/([^/]+)\/?$/);
let wordBingAdded = 0;
for (const slug of [...bingWords, ...bingRhymes]) {
  if (wordSet.has(slug)) continue;
  if (getWordBySlug(slug)) { wordSet.add(slug); wordBingAdded++; }
}
// 2026-05-15: no-regression contract — carry over existing keep-set so the
// new build never SHRINKS the index. Pass --reset to opt out.
const WORD_KEEP_PATH = path.join(OUT_DIR, 'word-keep.json');
const RESET = process.argv.includes('--reset');
let wordCarryAdded = 0;
if (!RESET && fs.existsSync(WORD_KEEP_PATH)) {
  try {
    const prior = JSON.parse(fs.readFileSync(WORD_KEEP_PATH, 'utf8')) as string[];
    for (const slug of prior) {
      if (wordSet.has(slug)) continue;
      if (getWordBySlug(slug)) { wordSet.add(slug); wordCarryAdded++; }
    }
  } catch { /* ignore */ }
}
fs.writeFileSync(
  WORD_KEEP_PATH,
  JSON.stringify(Array.from(wordSet).sort()),
);

// ─── /compare/ keep-set ───────────────────────────────────────────────
const compareBase = getTopComparisons(COMPARE_CAP).map((p) =>
  [p.slugA, p.slugB].sort().join('-vs-'),
);
const compareSet = new Set<string>(compareBase);
let compareAdded = 0;
let compareSkipped = 0;
for (const [a, b] of GSC_EVIDENCE_COMPARES) {
  if (!getWordBySlug(a) || !getWordBySlug(b)) {
    compareSkipped++;
    continue;
  }
  const canonical = [a, b].sort().join('-vs-');
  if (!compareSet.has(canonical)) compareAdded++;
  compareSet.add(canonical);
}
// no-regression carry for compares too
const COMPARE_KEEP_PATH = path.join(OUT_DIR, 'compare-keep.json');
let compareCarryAdded = 0;
if (!RESET && fs.existsSync(COMPARE_KEEP_PATH)) {
  try {
    const prior = JSON.parse(fs.readFileSync(COMPARE_KEEP_PATH, 'utf8')) as string[];
    for (const canonical of prior) {
      if (compareSet.has(canonical)) continue;
      const m = canonical.match(/^(.+)-vs-(.+)$/);
      if (!m) continue;
      if (!getWordBySlug(m[1]) || !getWordBySlug(m[2])) continue;
      compareSet.add(canonical);
      compareCarryAdded++;
    }
  } catch { /* ignore */ }
}
fs.writeFileSync(
  COMPARE_KEEP_PATH,
  JSON.stringify(Array.from(compareSet).sort()),
);

console.log(
  `✓ word-keep.json: ${wordSet.size} words (${wordBase.length} base + ${wordAdded} GSC + ${wordBingAdded} Bing + ${wordCarryAdded} carry, ${wordSkipped} skipped)`,
);
console.log(
  `✓ compare-keep.json: ${compareSet.size} compares (${compareBase.length} base + ${compareAdded} GSC new + ${compareCarryAdded} carry, ${compareSkipped} skipped)`,
);
