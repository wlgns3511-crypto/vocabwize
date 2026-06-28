import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getRhymingWords, getSimilarWords } from "@/lib/db";
import wordKeep from "@/lib/generated/word-keep.json";
import { TrustBlock } from "@/components/upgrades/TrustBlock";
import { InsightBlock } from "@/components/upgrades/InsightBlock";
import { TableOfContents } from "@/components/upgrades/TableOfContents";
import { RelatedEntities } from "@/components/upgrades/RelatedEntities";
import { VocabQuiz as VocabQuizGame } from "@/components/VocabQuiz";
import { FAQ } from "@/components/FAQ";
import { AuthorBox } from "@/components/AuthorBox";
import { TRUST_BLOCK_SOURCES, DB_UPDATED } from "@/lib/authorship";

interface Props { params: Promise<{ slug: string }> }

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  return (wordKeep as string[]).map((slug) => ({ slug }));
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

  const insights = [
    {
      text: `We identified ${rhymes.length} rhyming matches based on phonetic and orthographic similarity.`,
      sentiment: "positive" as const,
    },
    {
      text: `The rhyming search is calibrated to match the phonetic ending suffix of "${w.word}".`,
      sentiment: "neutral" as const,
    },
    {
      text: `The target word "${w.word}" has a frequency score of ${w.frequency || 0} in our general English corpus.`,
      sentiment: "neutral" as const,
    },
  ];

  const faqs = [
    {
      question: `How many words rhyme with ${w.word}?`,
      answer: `There are ${rhymes.length} words in our rhyming dictionary that rhyme with "${w.word}".`,
    },
    {
      question: `What determines if a word rhymes with ${w.word}?`,
      answer: `Rhymes are calculated by matching the trailing phonetic syllables and letter suffixes of words. Pronunciations like /${w.phonetic || ""}/ help ensure rhyming accuracy.`,
    },
    {
      question: `Can I look up definitions of the rhyming words?`,
      answer: `Yes. You can click on any word in the rhyming list to view its complete definition, part of speech, synonyms, and examples of usage.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const similar = getSimilarWords(slug, 6);
  const relatedItems = similar.map((s) => ({
    name: s.word,
    href: `/rhymes/${s.slug}/`,
    stat: `${getRhymingWords(s.slug).length} Rhymes`,
  }));

  const trustSources = TRUST_BLOCK_SOURCES.map((s) => ({
    name: s.name,
    url: s.url,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="text-sm text-slate-500 mb-4">
        <a href="/" className="hover:underline">Home</a> / <a href={`/word/${slug}`} className="hover:underline">{w.word}</a> / <span className="text-slate-800">Rhymes</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Words That Rhyme With {w.word}</h1>
      <p className="text-slate-600 mb-6">{rhymes.length} rhyming words found</p>

      <TrustBlock sources={trustSources} updated={DB_UPDATED} methodologyUrl="/methodology/" label="Verified Pronunciation" />

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

      <TableOfContents />

      <InsightBlock entityName={w.word} insights={insights} />

      <VocabQuizGame />

      <FAQ items={faqs} />

      <RelatedEntities entityName={w.word} items={relatedItems} heading={`Explore Rhyming Words Similar to ${w.word}`} />

      <div className="mt-8 border-t border-slate-200 pt-6">
        <a href={`/word/${slug}`} className="text-indigo-600 hover:underline">&larr; Back to {w.word} definition</a>
      </div>

      <AuthorBox />
    </div>
  );
}
