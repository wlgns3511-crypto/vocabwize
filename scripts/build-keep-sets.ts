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

const WORD_CAP = 20000;
const COMPARE_CAP = 100;

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
for (const slug of GSC_EVIDENCE_WORDS) {
  if (!getWordBySlug(slug)) {
    wordSkipped++;
    continue;
  }
  if (!wordSet.has(slug)) wordAdded++;
  wordSet.add(slug);
}
fs.writeFileSync(
  path.join(OUT_DIR, 'word-keep.json'),
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
fs.writeFileSync(
  path.join(OUT_DIR, 'compare-keep.json'),
  JSON.stringify(Array.from(compareSet).sort()),
);

console.log(
  `✓ word-keep.json: ${wordSet.size} words (${wordBase.length} base + ${wordAdded} GSC new, ${wordSkipped} skipped)`,
);
console.log(
  `✓ compare-keep.json: ${compareSet.size} compares (${compareBase.length} base + ${compareAdded} GSC new, ${compareSkipped} skipped)`,
);
