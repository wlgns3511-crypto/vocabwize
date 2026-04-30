/**
 * content-helpers.ts — Deterministic per-slug variant selection for Layer 2
 * commentary across vocabwize. Same input → same output across builds, so
 * cached/edge HTML stays stable. No randomness.
 *
 * Used by `lib/word-trends.ts`, `lib/insight-articles.ts` (potentially), and
 * any per-slug copy block that wants ≥3 textual variants without RNG.
 */

/**
 * djb2-style 32-bit hash. Fast, no crypto dep, stable across V8 versions.
 * Returns a non-negative integer.
 */
export function slugHash(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/**
 * Deterministically pick one variant from a list, keyed off `seed`.
 *
 *   pickVariant('apple:headline', ['A','B','C']) // → 'A' | 'B' | 'C'
 *
 * Use a colon-prefixed namespace per call site (`':h'`, `':f'`, `':c'`, `':i'`)
 * so the four sentences for one word do not all collapse to the same index.
 */
export function pickVariant<T>(seed: string, variants: readonly T[]): T {
  if (!variants.length) {
    throw new Error('pickVariant: empty variants list');
  }
  const idx = slugHash(seed) % variants.length;
  return variants[idx];
}

/**
 * Deterministic shuffle — useful when ordering related-words rails.
 * Returns a new array; original is not mutated.
 */
export function seededShuffle<T>(seed: string, items: readonly T[]): T[] {
  const arr = items.slice();
  let h = slugHash(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) | 0;
    const j = (h >>> 0) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
