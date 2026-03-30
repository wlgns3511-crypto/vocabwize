import type { Metadata } from "next";
import Link from "next/link";
import { getTopWords, getLongestWords, getShortestWords } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";

export const metadata: Metadata = {
  title: "Word Rankings - Most Common, Longest & Shortest English Words",
  description: "Discover the most common, longest, and shortest English words ranked by frequency and length.",
  alternates: { canonical: `${SITE_URL}/rankings/` },
};

export default function RankingsPage() {
  const common = getTopWords(100);
  const longest = getLongestWords(50);
  const shortest = getShortestWords(50);

  const sections = [
    { title: "Most Common Words", words: common },
    { title: "Longest Words", words: longest },
    { title: "Shortest Words", words: shortest },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-800 mb-2">Word Rankings</h1>
      <p className="text-slate-600 mb-8">English words ranked by frequency and length.</p>
      {sections.map((section) => (
        <section key={section.title} className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">{section.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {section.words.map((w, i) => (
              <Link
                key={w.slug}
                href={`/word/${w.slug}/`}
                className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all bg-white"
              >
                <span className="text-xs font-mono text-slate-400 w-6 text-right">{i + 1}</span>
                <span className="font-medium text-indigo-700 text-sm truncate">{w.word}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
