import type { Metadata } from "next";
import Link from "next/link";
import { getWordsByPOS } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";

const POS_LIST = ["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection"];

export const metadata: Metadata = {
  title: "Browse Words by Part of Speech",
  description: "Explore English words organized by part of speech: nouns, verbs, adjectives, adverbs, and more.",
  alternates: { canonical: `${SITE_URL}/pos/` },
  openGraph: { url: "/pos/" },
};

export default function POSListPage() {
  const posData = POS_LIST.map((pos) => {
    const words = getWordsByPOS(pos, 200);
    return { pos, count: words.length };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-800 mb-2">Browse by Part of Speech</h1>
      <p className="text-slate-600 mb-8">Explore words organized by their grammatical category.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {posData.map(({ pos, count }) => (
          <Link
            key={pos}
            href={`/pos/${encodeURIComponent(pos)}/`}
            className="block p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white"
          >
            <h2 className="text-lg font-semibold text-indigo-700 capitalize mb-1">{pos}</h2>
            <p className="text-sm text-slate-500">{count}+ words</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
