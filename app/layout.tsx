import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UpgradeAnalytics } from "@/components/upgrades/UpgradeAnalytics";
const inter = Inter({ subsets: ["latin"], display: "swap" });
const SITE_NAME = "VocabWize";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";
const SITE_DESCRIPTION = "Look up definitions, meanings, and usage for 160,000+ English words. Compare confusing words side by side.";
const SITE_LANGUAGE = "en";
export const metadata: Metadata = {
  title: { default: `${SITE_NAME} - Word Definitions, Meanings & Comparisons`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL), robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  alternates: {
    languages: {
      'en': 'https://vocabwize.com',
      'fr': 'https://vocablibre.com',
      'pt': 'https://dicionariowize.com',
      'ar': 'https://kalimawize.com',
      'de': 'https://wortwize.com',
      'ja': 'https://kotobapeek.com',
      'x-default': 'https://vocabwize.com',
    },
  },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
  other: { "google-adsense-account": "ca-pub-5724806562146685" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchAction = {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  };
  const schemaGraph = [
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: SITE_LANGUAGE,
      potentialAction: searchAction,
    },
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
              "parentOrganization": {
                "@type": "Organization",
                "name": "DataPeek Research Network",
                "url": "https://datapeekfacts.com"
              }
            },
  ];
  return (
    <html lang={SITE_LANGUAGE}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KGNDY9231R" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KGNDY9231R');` }} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5724806562146685" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': schemaGraph.filter(Boolean),
        }) }} />
      </head>
      <body className={`${inter.className} antialiased bg-white text-slate-900 min-h-screen flex flex-col`}>
        <UpgradeAnalytics />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:border focus:rounded">Skip to content</a>
        <header className="border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-indigo-700">{SITE_NAME}</a>
            <nav className="flex gap-4 text-sm">
              <a href="/word/" className="hover:text-indigo-600">Words</a>
              <a href="/compare/" className="hover:text-indigo-600">Compare</a>
              <a href="/insights/" className="hover:text-indigo-600">Insights</a>
              <a href="/guide/" className="hover:text-indigo-600">Guides</a>
              <a href="/blog/" className="hover:text-indigo-600">Articles</a>
              <a href="/pos/" className="hover:text-indigo-600">POS</a>
              <a href="/rankings/" className="hover:text-indigo-600">Rankings</a>
              <a href="/quiz/" className="hover:text-indigo-600">Quiz</a>
              <a href="/es/" className="text-slate-400 hover:text-indigo-600 text-xs">ES</a>
            </nav>
          </div>
        </header>
        <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500">
            <p className="mb-2">
              <a href="/about/" className="hover:text-indigo-600">About</a>
              {" | "}
              <a href="/privacy/" className="hover:text-indigo-600">Privacy</a>
              {" | "}
              <a href="/terms/" className="hover:text-indigo-600">Terms</a>
              {" | "}
              <a href="/disclaimer/" className="hover:text-indigo-600">Disclaimer</a>
              {" | "}
              <a href="/contact/" className="hover:text-indigo-600">Contact</a>
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Discover More</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <a href="https://nameblooms.com" className="hover:text-indigo-600" rel="nofollow noopener">Baby Names</a>
                <a href="https://degreewize.com" className="hover:text-indigo-600" rel="nofollow noopener">Colleges</a>
                <a href="https://calcpeek.com" className="hover:text-indigo-600" rel="nofollow noopener">Calculators</a>
              </div>
            </div>
            <p className="mt-3 text-xs italic text-slate-400">Building better vocabulary, one word at a time.</p>
            <p>&copy; {new Date().getFullYear()} {SITE_NAME}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
