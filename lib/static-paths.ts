import compareKeepList from "./generated/compare-keep.json";

/**
 * HCU 2026-06-01 crawl-budget: single source of truth for "does this compare
 * pair have a static page?".
 *
 * app/compare/[slugs]/page.tsx sets `dynamicParams = false` and derives its
 * generateStaticParams() from lib/generated/compare-keep.json
 * (= top-100 by popularity_score ∪ GSC evidence union). Any /compare/{a}-vs-{b}/
 * link to a pair NOT in that set 404s and burns crawl budget.
 *
 * This helper is sourced from the SAME compare-keep.json the route prerenders
 * from, so `isHotComparePair(a, b)` is true iff a static page exists. Guard any
 * link whose pair comes from an arbitrary list (synonyms / same-POS / similar)
 * with it before emitting the href.
 */
const COMPARE_KEEP_SLUGS: string[] = compareKeepList as string[];

function pairKey(slugA: string, slugB: string): string {
  return slugA < slugB ? `${slugA}::${slugB}` : `${slugB}::${slugA}`;
}

function parseComparePair(slugs: string): { slugA: string; slugB: string } | null {
  const m = slugs.match(/^(.+)-vs-(.+)$/);
  if (!m) return null;
  return m[1] < m[2] ? { slugA: m[1], slugB: m[2] } : { slugA: m[2], slugB: m[1] };
}

const HOT_COMPARE_PAIRS = COMPARE_KEEP_SLUGS
  .map(parseComparePair)
  .filter((pair): pair is { slugA: string; slugB: string } => pair !== null);
const HOT_COMPARE_KEYS = new Set(HOT_COMPARE_PAIRS.map((pair) => pairKey(pair.slugA, pair.slugB)));

export function getHotComparePairs() {
  return HOT_COMPARE_PAIRS;
}

export function isHotComparePair(slugA: string, slugB: string) {
  return HOT_COMPARE_KEYS.has(pairKey(slugA, slugB));
}
