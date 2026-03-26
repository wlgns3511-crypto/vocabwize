import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
const SITE_NAME = "VocabWize";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";
export const metadata: Metadata = {
  title: { default: `${SITE_NAME} - Word Definitions, Meanings & Comparisons`, template: `%s | ${SITE_NAME}` },
  description: "Look up definitions, meanings, and usage for 160,000+ English words. Compare confusing words side by side.",
  metadataBase: new URL(SITE_URL), robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5724806562146685" crossOrigin="anonymous" /></head>
      <body className={`${inter.className} antialiased bg-white text-slate-900 min-h-screen flex flex-col`}>
        <header className="border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-indigo-700">{SITE_NAME}</a>
            <nav className="flex gap-4 text-sm">
              <a href="/word" className="hover:text-indigo-600">Words</a>
              <a href="/compare" className="hover:text-indigo-600">Compare</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500">
            <p className="mb-2">
              <a href="/about" className="hover:text-indigo-600">About</a>
              {" | "}
              <a href="/privacy" className="hover:text-indigo-600">Privacy</a>
              {" | "}
              <a href="/terms" className="hover:text-indigo-600">Terms</a>
              {" | "}
              <a href="/contact" className="hover:text-indigo-600">Contact</a>
            </p>
            <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
