import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getTopWords, getSimilarWords } from "@/lib/db";
import { breadcrumbSchema, faqSchema, definedTermSchema } from "@/lib/schema";
import { DataFeedback } from "@/components/DataFeedback";
import { EmbedButton } from "@/components/EmbedButton";
import { FreshnessTag } from "@/components/FreshnessTag";

interface Props { params: Promise<{ slug: string }> }

function parseJson(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

const levelColors: Record<string, string> = {
  basic: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-orange-100 text-orange-700",
  academic: "bg-purple-100 text-purple-700",
};

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
    description: `${w.word}: ${shortDef}. Learn the definition, pronunciation, examples, etymology, and how to use "${w.word}" in a sentence.`,
    alternates: { canonical: `/word/${slug}` },
  };
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) notFound();

  const similar = getSimilarWords(slug, 12);
  const defs = w.definition.split(';').map(d => d.trim()).filter(Boolean);
  const examples = parseJson(w.examples);
  const synonyms = parseJson(w.synonyms);
  const antonyms = parseJson(w.antonyms);

  const faqs = [
    { question: `What does "${w.word}" mean?`, answer: defs[0] || w.definition },
    ...(w.phonetic ? [{ question: `How do you pronounce "${w.word}"?`, answer: `"${w.word}" is pronounced /${w.phonetic}/. ${w.pos ? `It is commonly used as ${w.pos}.` : ""}` }] : []),
    ...(w.pos ? [{ question: `What part of speech is "${w.word}"?`, answer: `"${w.word}" can be used as: ${w.pos}. ${w.usage_note ? w.usage_note.split('.')[0] + '.' : ""}` }] : []),
    ...(examples.length > 0 ? [{ question: `How do you use "${w.word}" in a sentence?`, answer: examples.slice(0, 2).join(" Also: ") }] : []),
    ...(w.etymology ? [{ question: `What is the origin of "${w.word}"?`, answer: w.etymology }] : []),
    ...(synonyms.length > 0 ? [{ question: `What are synonyms of "${w.word}"?`, answer: `Common synonyms include: ${synonyms.join(", ")}. ${antonyms.length > 0 ? `Antonyms include: ${antonyms.join(", ")}.` : ""}` }] : []),
    ...(w.level ? [{ question: `What level is the word "${w.word}"?`, answer: `"${w.word}" is classified as ${w.level} level vocabulary. ${w.level === "academic" ? "It is commonly found in academic texts, standardized tests like GRE/TOEFL." : w.level === "advanced" ? "It is typically encountered in advanced reading and professional contexts." : w.level === "basic" ? "It is one of the most commonly used English words." : "It is commonly used in everyday English conversation and writing."}` }] : []),
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

      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-4xl font-bold">{w.word}</h1>
        {w.level && (
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${levelColors[w.level] || "bg-slate-100 text-slate-600"}`}>
            {w.level.charAt(0).toUpperCase() + w.level.slice(1)}
          </span>
        )}
      </div>
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

      {examples.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Examples</h2>
          <div className="space-y-3">
            {examples.map((ex, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-indigo-400 font-mono text-sm mt-0.5">{i + 1}.</span>
                <p className="text-slate-700 italic">&ldquo;{ex}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {w.etymology && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Etymology</h2>
          <div className="bg-amber-50 border-l-4 border-amber-300 p-4 rounded-r-lg">
            <p className="text-slate-700">{w.etymology}</p>
          </div>
        </section>
      )}

      {(synonyms.length > 0 || antonyms.length > 0) && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Synonyms & Antonyms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {synonyms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-600 mb-2">Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {synonyms.map((s, i) => (
                    <a key={i} href={`/word/${s.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {antonyms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-600 mb-2">Antonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {antonyms.map((a, i) => (
                    <a key={i} href={`/word/${a.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm hover:bg-red-100 transition-colors">
                      {a}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {w.usage_note && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Usage Tips</h2>
          <div className="bg-sky-50 border-l-4 border-sky-300 p-4 rounded-r-lg">
            <p className="text-slate-700">{w.usage_note}</p>
          </div>
        </section>
      )}

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
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="border border-slate-200 rounded-lg mb-2" open={i === 0}>
            <summary className="p-4 cursor-pointer font-medium">{faq.question}</summary>
            <div className="px-4 pb-4 text-slate-600">{faq.answer}</div>
          </details>
        ))}
      </section>

      <FreshnessTag source="Lexical Database" />

          <EmbedButton url="https://vocabwize.com" title="Data from VocabWize" site="VocabWize" siteUrl="https://vocabwize.com" />

          <DataFeedback />

          <section className="mt-8 p-6 bg-teal-50 rounded-xl border border-teal-100">
        <h3 className="text-lg font-semibold text-teal-900 mb-3">Improve Your English Skills</h3>
        <p className="text-teal-800 text-sm leading-relaxed">
          Start a free online English course, prepare for TOEFL or IELTS exams, or find a private tutor to accelerate your language learning journey.
          Explore <a href="https://degreewize.com" className="underline font-medium">top university programs</a> for international students.
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema(w.word, w.definition)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
    </div>
  );
}
