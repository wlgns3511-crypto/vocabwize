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
 * HCU 2026-04-24 cleanup — 410 Gone for pruned /word/, /es/, and /compare/ URLs.
 *
 * Pre-prune: words table has 160,521 rows; /word/ prior-pass capped at 20K
 * by frequency. That cap killed 8 of the 10 /word/ GSC earners — obscure
 * words like xvx/kreel/hemingwayesque earn clicks precisely because low
 * competition on long-tail. GSC evidence union rescues them.
 *
 * /es/* is fully retired. Keep it crawlable in robots.txt so Googlebot can
 * see 410 and age out the old Spanish URL inventory.
 *
 * /compare/ capped at 100 from 2,515-row comparisons table; 10 GSC compare
 * earners don't exist in comparisons table (historical artifacts) but all
 * word halves exist, so page renders once in keep-set.
 *
 * 410 instead of notFound()'s 404 signals intentional deletion →
 * faster deindex vs. Google's month-long 404 recrawl dance.
 */
/**
 * Returns the canonical (alphabetically sorted) `-vs-` slug if `slugs`
 * matches any keep-set entry under either direction. Returns `null` if
 * the URL is not in the keep-set.
 *
 * Why canonical-form return (not just boolean):
 *   `generateStaticParams` in app/compare/[slugs]/page.tsx pre-renders
 *   BOTH `X-vs-Y` AND `Y-vs-X` so internal/external links land on a
 *   real page. The page body calls `redirect()` for the reverse case,
 *   BUT — per Next.js 16 docs — `redirect()` inside an SSG streaming
 *   context emits a client-side meta-tag, NOT an HTTP 308. Crawlers
 *   read 200 + canonical-link-tag and bucket the reverse URL into
 *   GSC's "alternate page (canonical)" report (~38K URLs as of
 *   2026-05-14). Returning the canonical here lets middleware emit
 *   a real edge-level 308 BEFORE the page renders, which crawlers do
 *   follow → flushes that bucket.
 */
function findCanonicalCompare(slugs: string): string | null {
  if (COMPARE_KEEP_SET.has(slugs)) return slugs;
  const marker = '-vs-';
  let idx = slugs.indexOf(marker);
  while (idx !== -1) {
    const a = slugs.slice(0, idx);
    const b = slugs.slice(idx + marker.length);
    const sorted = [a, b].sort().join(marker);
    if (COMPARE_KEEP_SET.has(sorted)) return sorted;
    idx = slugs.indexOf(marker, idx + 1);
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /es/* is intentionally gone. Do not robots-block it; let Googlebot see 410.
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    return new NextResponse('Gone', { status: 410 });
  }

  // /word/<slug>/ — 410 if not in 20K + GSC keep-set
  const wordMatch = pathname.match(/^\/word\/([^/]+)\/?$/);
  if (wordMatch) {
    const slug = wordMatch[1];
    if (slug && !WORD_KEEP_SET.has(slug)) {
      return new NextResponse('Gone', { status: 410 });
    }
  }

  // /compare/<slugs>/ — 410 if not in keep-set; 308 if reverse-direction.
  // The 308 is critical: page.tsx's `redirect()` in SSG streaming context
  // only emits an in-HTML NEXT_REDIRECT signal that crawlers ignore.
  // Edge middleware gives a true HTTP 308 BEFORE render. See
  // findCanonicalCompare() docstring.
  if (pathname.startsWith('/compare/')) {
    const raw = pathname.slice(9).replace(/\/$/, '');
    if (raw && !raw.includes('/') && raw.includes('-vs-')) {
      const canonical = findCanonicalCompare(raw);
      if (!canonical) {
        return new NextResponse('Gone', { status: 410 });
      }
      if (raw !== canonical) {
        const url = request.nextUrl.clone();
        url.pathname = `/compare/${canonical}/`;
        return NextResponse.redirect(url, 308);
      }
    }
  }

  // /rhymes/* — 410 (thin pages, Google classified as Soft 404 per 2026-05-14
  // GSC export — 10% of Soft 404 9,807 bucket. Sitemap already excludes
  // /rhymes/ as of 2026-04-19. Same retire pattern as /es/, /trends/,
  // /research/. Internal links removed in app/page.tsx + app/word/[slug]/page.tsx.
  if (pathname.startsWith('/rhymes/') || pathname === '/rhymes') {
    return new NextResponse('Gone', { status: 410 });
  }

  // /trends/* and /research/* — 410 (reverted 2026-05-01). Layer 1++ NGram
  // feature shipped in f3ff924 had a data-mismatch bug (rank-form fetch built
  // against pre-fix DESC SQL pulled the rarest 1,700 words; keep-set is the
  // most-common 20K → ∩ = 0). 410 deindexes the briefly-listed sitemap URLs
  // pending NGram re-fetch against the keep-set.
  if (pathname.startsWith('/trends/') || pathname.startsWith('/research/')) {
    return new NextResponse('Gone', { status: 410 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // /search/ with ?q= param — noindex (parameterized variants found in GSC
  // alt-canonical bucket as /search/?q=happy, /search/?q=nature etc.).
  // Page still renders for users; only block indexing of query-string variants.
  // Base /search/ landing page stays indexable.
  if ((pathname === '/search' || pathname === '/search/') &&
      request.nextUrl.searchParams.has('q')) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml|api).*)'],
};
