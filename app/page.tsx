import type { Metadata } from "next";
import { getTopWords, countWords, getAvailableLengths, getTopComparisons } from "@/lib/db";
import { VocabQuiz } from "@/components/VocabQuiz";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  const topWords = getTopWords(50);
  const topComparisons = getTopComparisons(10);
  const total = countWords();
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const lengths = getAvailableLengths();

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3">English Word Definitions & Meanings</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Look up {total.toLocaleString()}+ English words. Definitions, pronunciation, and word comparisons.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-center">Browse by Letter</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {letters.map((l) => (
            <a key={l} href={`/letter/${l.toLowerCase()}`}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 font-semibold text-sm">{l}</a>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-center">Words by Length</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {lengths.map((l) => (
            <a key={l} href={`/words-length/${l}`}
              className="px-3 py-1 rounded-full text-sm border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300">{l} letters</a>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-center">Find Rhyming Words</h2>
        <p className="text-sm text-slate-600 text-center mb-3">Pick a word to find words that rhyme with it.</p>
        <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-2 text-sm">
          {topWords.slice(0, 20).map((w) => (
            <a key={w.slug} href={`/rhymes/${w.slug}`}
              className="p-2 border border-slate-100 rounded hover:bg-indigo-50 text-center text-indigo-600">
              {w.word}
            </a>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Most Common Words</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {topWords.map((w) => (
            <a key={w.slug} href={`/word/${w.slug}`}
              className="p-2 border border-slate-100 rounded hover:bg-indigo-50">
              <span className="font-medium">{w.word}</span>
              {w.phonetic && <span className="text-slate-400 ml-2 text-xs">/{w.phonetic}/</span>}
            </a>
          ))}
        </div>
      </section>

      <VocabQuiz />

      <section>
        <h2 className="text-xl font-bold mb-4">Commonly Confused Words</h2>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {topComparisons.map(({ slugA, slugB, wordA, wordB }) => {
            return (<a key={`${slugA}-${slugB}`} href={`/compare/${slugA}-vs-${slugB}`} className="p-3 border border-slate-200 rounded-lg hover:bg-indigo-50 text-indigo-600">{wordA || slugA} vs {wordB || slugB}</a>);
          })}
        </div>
      </section>
    </div>
  );
}
