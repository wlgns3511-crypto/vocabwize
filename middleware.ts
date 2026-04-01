import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Block obviously invalid word slugs at edge — saves serverless invocations
const WORD_PATH = '/word/';
const MAX_SLUG_LEN = 45;

// Known bot/spam patterns that never match real words
const BLOCKED_PATTERNS = /\.(php|asp|env|xml|json|txt|cgi|wp-|admin|login|config)/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only check word detail pages
  if (pathname.startsWith(WORD_PATH) && pathname !== WORD_PATH) {
    const slug = pathname.replace(WORD_PATH, '').replace(/\/$/, '');
    
    // Block: too long
    if (slug.length > MAX_SLUG_LEN) {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    // Block: contains file extensions or suspicious patterns
    if (BLOCKED_PATTERNS.test(slug)) {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    // Block: contains multiple consecutive hyphens or numbers-only
    if (/---/.test(slug) || /^\d+$/.test(slug)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Allow root-level static files (ads.txt, verification files, etc.)
  if (/^\/[^/]+\.(txt|xml)$/.test(pathname)) {
    return NextResponse.next();
  }

  // Block common vulnerability probes
  if (BLOCKED_PATTERNS.test(pathname)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/word/:path*', '/((?!_next|api|favicon|icon|opengraph).*)'],
};
