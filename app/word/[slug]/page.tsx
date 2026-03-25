import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getTopWords, getSimilarWords } from "@/lib/db";
import { breadcrumbSchema, faqSchema, definedTermSchema } from "@/lib/schema";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getTopWords(3000).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) return {};
  const shortDef = w.definition.substring(0, 120);
  return {
    title: `${w.word} - Definition, Meaning & Usage`,
    description: `${w.word}: ${shortDef}. Learn the definition, pronunciation, and how to use "${w.word}" in a sentence.`,
    alternates: { canonical: `/word/${slug}` },
  };
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) notFound();

  const similar = getSimilarWords(slug, 12);
  const defs = w.definition.split(';').map(d => d.trim()).filter(Boolean);

  const faqs = [
    { question: `What does "${w.word}" mean?`, answer: defs[0] || w.definition },
    ...(w.phonetic ? [{ question: `How do you pronounce "${w.word}"?`, answer: `"${w.word}" is pronounced /${w.phonetic}/.` }] : []),
    ...(w.pos ? [{ question: `What part of speech is "${w.word}"?`, answer: `"${w.word}" can be used as: ${w.pos}.` }] : []),
  ];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: w.word[0].toUpperCase(), url: `/letter/${w.word[0].toLowerCase()}` },
    { name: w.word, url: `/word/${slug}` },
  ];

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        {breadcrumbs.map((b, i) => (<span key={i}>{i > 0 && " / "}{i < 2 ? <a href={b.url} className="hover:underline">{b.name}</a> : <span className="text-slate-800">{b.name}</span>}</span>))}
      </nav>

      <h1 className="text-4xl font-bold mb-1">{w.word}</h1>
      {w.phonetic && <p className="text-lg text-slate-500 mb-1">/{w.phonetic}/</p>}
      {w.pos && <p className="text-sm text-indigo-500 mb-6">{w.pos}</p>}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Definition</h2>
        <div className="bg-indigo-50 rounded-lg p-6">
          {defs.length > 1 ? (
            <ol className="list-decimal list-inside space-y-2">
              {defs.map((d, i) => (<li key={i} className="text-slate-700">{d}</li>))}
            </ol>
          ) : (
            <p className="text-slate-700">{w.definition}</p>
          )}
        </div>
      </section>

      <div className="flex gap-3 mb-8">
        <a href={`/rhymes/${slug}`} className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm">
          Words that rhyme with {w.word}
        </a>
        <a href={`/words-length/${w.word.length}`} className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm">
          {w.word.length}-letter words
        </a>
      </div>

      {similar.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Related Words</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {similar.map((s) => {
              const [a, b] = [slug, s.slug].sort();
              return (
                <div key={s.slug} className="p-3 border border-slate-200 rounded-lg">
                  <a href={`/word/${s.slug}`} className="font-medium text-indigo-600 hover:underline">{s.word}</a>
                  <div className="mt-1"><a href={`/compare/${a}-vs-${b}`} className="text-xs text-slate-400 hover:underline">Compare</a></div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">FAQ</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="border border-slate-200 rounded-lg mb-2" open={i === 0}>
            <summary className="p-4 cursor-pointer font-medium">{faq.question}</summary>
            <div className="px-4 pb-4 text-slate-600">{faq.answer}</div>
          </details>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema(w.word, w.definition)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
    </div>
  );
}
