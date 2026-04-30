import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getRhymingWords, getTopWords } from "@/lib/db";

interface Props { params: Promise<{ slug: string }> }

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getTopWords(5000).map(w => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) return {};
  const count = getRhymingWords(slug).length;
  return {
    title: `${count}+ Words That Rhyme With ${w.word}`,
    description: `Discover ${count} words that rhyme with "${w.word}". Complete rhyming dictionary with pronunciation — perfect for poetry, rap, and songwriting.`,
    openGraph: { url: `/rhymes/${slug}/` },
    alternates: { canonical: `/rhymes/${slug}/` },
  };
}

export default async function RhymePage({ params }: Props) {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) notFound();

  const rhymes = getRhymingWords(slug);

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/" className="hover:underline">Home</a> / <a href={`/word/${slug}`} className="hover:underline">{w.word}</a> / <span className="text-slate-800">Rhymes</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Words That Rhyme With {w.word}</h1>
      <p className="text-slate-600 mb-6">{rhymes.length} rhyming words found</p>

      {rhymes.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {rhymes.map((r) => (
            <a key={r.slug} href={`/word/${r.slug}`}
              className="p-3 border border-slate-100 rounded-lg hover:bg-indigo-50">
              <div className="font-medium">{r.word}</div>
              {r.phonetic && <div className="text-xs text-slate-400">/{r.phonetic}/</div>}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No rhyming words found for &quot;{w.word}&quot;.</p>
      )}

      <div className="mt-8">
        <a href={`/word/${slug}`} className="text-indigo-600 hover:underline">&larr; Back to {w.word} definition</a>
      </div>
    </div>
  );
}
