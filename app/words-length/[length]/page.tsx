import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordsByLength, getAvailableLengths } from "@/lib/db";

interface Props { params: Promise<{ length: string }> }

export const dynamicParams = false;

export function generateStaticParams() {
  return getAvailableLengths().map((l) => ({ length: l.toString() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { length } = await params;
  return {
    title: `${length} Letter Words - Complete List`,
    description: `Browse ${length} letter words. Perfect for word games, Wordle, Scrabble, and crossword puzzles.`,
    openGraph: { url: `/words-length/${length}/` },
    alternates: { canonical: `/words-length/${length}/` },
  };
}

export default async function LengthPage({ params }: Props) {
  const { length: lenStr } = await params;
  const length = parseInt(lenStr);
  if (isNaN(length) || length < 3 || length > 15) notFound();

  const words = getWordsByLength(length);
  const lengths = getAvailableLengths();

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/" className="hover:underline">Home</a> / <span className="text-slate-800">{length} Letter Words</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{length} Letter Words</h1>
      <p className="text-slate-600 mb-6">{words.length} words found. Great for Wordle, Scrabble, and crosswords.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {lengths.map((l) => (
          <a key={l} href={`/words-length/${l}`}
            className={`px-3 py-1 rounded-full text-sm border ${l === length ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 hover:bg-indigo-50'}`}>
            {l} letters
          </a>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
        {words.map((w) => (
          <a key={w.slug} href={`/word/${w.slug}`}
            className="p-2 border border-slate-100 rounded hover:bg-indigo-50 font-mono">
            {w.word}
          </a>
        ))}
      </div>
    </div>
  );
}
