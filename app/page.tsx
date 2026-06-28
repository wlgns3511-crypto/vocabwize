import type { Metadata } from "next";
import { getTopWords, countWords, getAvailableLengths, getTopComparisons } from "@/lib/db";
import { VocabQuiz } from "@/components/VocabQuiz";
import { TrustBlock } from "@/components/upgrades/TrustBlock";
import { AuthorBox } from "@/components/AuthorBox";
import { TRUST_BLOCK_SOURCES, WORD_VINTAGE } from "@/lib/authorship";

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
      {/* Data-sovereignty strip — source attribution + coverage above-the-fold (AdSense gate) */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-widest text-slate-500">
        <span>Sources · ECDICT · WordNet · BNC · COCA</span>
        <span className="text-slate-300">|</span>
        <span>Coverage · {total.toLocaleString()} words · {lengths.length} length buckets</span>
        <span className="text-slate-300">|</span>
        <a href="/methodology/" className="hover:text-indigo-600 underline-offset-2 hover:underline">Methodology</a>
      </div>

      <section className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-3">English Word Definitions &amp; Meanings</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Look up <strong className="tabular-nums">{total.toLocaleString()}</strong>+ English words — definitions, pronunciation (IPA), parts of speech, and side-by-side comparisons of commonly confused pairs. Definitions pulled from the open-source <strong>ECDICT</strong> corpus, synonyms from <strong>Princeton WordNet</strong>, frequency rankings calibrated against the <strong>BNC</strong> and <strong>COCA</strong>.
        </p>
      </section>

      {/* Quick stats — surfaces 4 dimensions above-the-fold */}
      <section aria-label="Vocabulary coverage" className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">{total.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Words Indexed</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">{lengths.length}</div>
          <div className="text-xs text-slate-500 mt-1">Length Buckets</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">{topComparisons.length}+</div>
          <div className="text-xs text-slate-500 mt-1">Compare Pairs</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">{TRUST_BLOCK_SOURCES.length}</div>
          <div className="text-xs text-slate-500 mt-1">Upstream Sources</div>
        </div>
      </section>

      <TrustBlock
        sources={[...TRUST_BLOCK_SOURCES]}
        updated={WORD_VINTAGE}
        reviewedBy="VocabWize Editorial Team"
      />

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

      <AuthorBox />
    </div>
  );
}
