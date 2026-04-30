import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import wordKeepList from './lib/generated/word-keep.json';
import compareKeepList from './lib/generated/compare-keep.json';

// Prebuilt O(1) lookup sets — dumped at build time by scripts/build-keep-sets.ts
// so Edge Runtime middleware never touches SQLite. ~20K word slugs + ~110
// compare slugs is well under Edge bundle size limits.
const WORD_KEEP_SET: Set<string> = new Set(wordKeepList as string[]);
const COMPARE_KEEP_SET: Set<string> = new Set(compareKeepList as string[]);

/**
 * HCU 2026-04-24 cleanup — 410 Gone for pruned /word/ and /compare/ URLs.
 *
 * Pre-prune: words table has 160,521 rows; /word/ prior-pass capped at 20K
 * by frequency. That cap killed 8 of the 10 /word/ GSC earners — obscure
 * words like xvx/kreel/hemingwayesque earn clicks precisely because low
 * competition on long-tail. GSC evidence union rescues them.
 *
 * /compare/ capped at 100 from 2,515-row comparisons table; 10 GSC compare
 * earners don't exist in comparisons table (historical artifacts) but all
 * word halves exist, so page renders once in keep-set.
 *
 * 410 instead of notFound()'s 404 signals intentional deletion →
 * faster deindex vs. Google's month-long 404 recrawl dance.
 */
function isComparePathKept(slugs: string): boolean {
  if (COMPARE_KEEP_SET.has(slugs)) return true;
  const marker = '-vs-';
  let idx = slugs.indexOf(marker);
  while (idx !== -1) {
    const a = slugs.slice(0, idx);
    const b = slugs.slice(idx + marker.length);
    if (COMPARE_KEEP_SET.has([a, b].sort().join(marker))) return true;
    idx = slugs.indexOf(marker, idx + 1);
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /word/<slug>/ and /es/word/<slug>/ — 410 if not in 20K + GSC keep-set
  const wordMatch = pathname.match(/^\/(?:es\/)?word\/([^/]+)\/?$/);
  if (wordMatch) {
    const slug = wordMatch[1];
    if (slug && !WORD_KEEP_SET.has(slug)) {
      return new NextResponse('Gone', { status: 410 });
    }
  }

  // /compare/<slugs>/ — 410 if not in keep-set (either ordering)
  if (pathname.startsWith('/compare/')) {
    const raw = pathname.slice(9).replace(/\/$/, '');
    if (raw && !raw.includes('/') && raw.includes('-vs-')) {
      if (!isComparePathKept(raw)) {
        return new NextResponse('Gone', { status: 410 });
      }
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml|api).*)'],
};
