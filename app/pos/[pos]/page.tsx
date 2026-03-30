import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWordsByPOS } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";

const POS_LIST = ["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection"];

export function generateStaticParams() {
  return POS_LIST.map((pos) => ({ pos }));
}

export function generateMetadata({ params }: { params: { pos: string } }): Metadata {
  const pos = decodeURIComponent(params.pos);
  if (!POS_LIST.includes(pos)) return {};
  return {
    title: `${pos.charAt(0).toUpperCase() + pos.slice(1)} Words - English ${pos} List`,
    description: `Browse top ${pos} words in English with definitions and usage examples.`,
    alternates: { canonical: `${SITE_URL}/pos/${encodeURIComponent(pos)}/` },
  };
}

export default function POSDetailPage({ params }: { params: { pos: string } }) {
  const pos = decodeURIComponent(params.pos);
  if (!POS_LIST.includes(pos)) notFound();

  const words = getWordsByPOS(pos, 200);

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/pos/" className="hover:text-indigo-600">Parts of Speech</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700 capitalize">{pos}</span>
      </nav>
      <h1 className="text-3xl font-bold text-indigo-800 mb-2 capitalize">{pos} Words</h1>
      <p className="text-slate-600 mb-8">Top {words.length} English {pos} words by frequency.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {words.map((w) => (
          <Link
            key={w.slug}
            href={`/word/${w.slug}/`}
            className="block p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all bg-white"
          >
            <span className="font-medium text-indigo-700">{w.word}</span>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{w.definition?.slice(0, 50)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
