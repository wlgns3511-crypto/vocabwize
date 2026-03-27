import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getTopComparisons } from "@/lib/db";
import { faqSchema } from "@/lib/schema";

interface Props { params: Promise<{ slugs: string }> }

function parseSlugs(s: string): [string, string] | null {
  const m = s.match(/^(.+)-vs-(.+)$/);
  return m ? [m[1], m[2]] : null;
}

function parseJson(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return getTopComparisons(500).map((p) => {
    const [a, b] = [p.slugA, p.slugB].sort();
    return { slugs: `${a}-vs-${b}` };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) return {};
  const a = getWordBySlug(parsed[0]), b = getWordBySlug(parsed[1]);
  if (!a || !b) return {};
  return {
    title: `${a.word} vs ${b.word} — What's the Difference?`,
    description: `What's the difference between "${a.word}" and "${b.word}"? Compare definitions, examples, usage, and learn when to use each word.`,
    alternates: { canonical: `/compare/${slugs}` },
  };
}

export default async function ComparePage({ params }: Props) {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) notFound();
  const a = getWordBySlug(parsed[0]), b = getWordBySlug(parsed[1]);
  if (!a || !b) notFound();

  const exA = parseJson(a.examples);
  const exB = parseJson(b.examples);
  const synA = parseJson(a.synonyms);
  const synB = parseJson(b.synonyms);

  const hasRichData = !!(a.usage_note || b.usage_note || a.etymology || b.etymology);

  const faqs = [
    {
      question: `What is the difference between "${a.word}" and "${b.word}"?`,
      answer: `"${a.word}" means: ${a.definition.substring(0, 150)}. "${b.word}" means: ${b.definition.substring(0, 150)}.${a.usage_note ? ` Tip: ${a.usage_note.split('.')[0]}.` : ""}`,
    },
    ...(a.pos && b.pos ? [{
      question: `Are "${a.word}" and "${b.word}" the same part of speech?`,
      answer: `"${a.word}" is used as ${a.pos}. "${b.word}" is used as ${b.pos}. ${a.pos === b.pos ? "They share the same grammatical role but differ in meaning." : "They serve different grammatical functions."}`,
    }] : []),
    ...(exA.length > 0 && exB.length > 0 ? [{
      question: `Can you give examples of "${a.word}" and "${b.word}" in sentences?`,
      answer: `${a.word}: "${exA[0]}" — ${b.word}: "${exB[0]}"`,
    }] : []),
    ...(synA.length > 0 || synB.length > 0 ? [{
      question: `What are synonyms of "${a.word}" and "${b.word}"?`,
      answer: `${synA.length > 0 ? `Synonyms of "${a.word}": ${synA.join(", ")}.` : ""} ${synB.length > 0 ? `Synonyms of "${b.word}": ${synB.join(", ")}.` : ""}`.trim(),
    }] : []),
    {
      question: `When should I use "${a.word}" vs "${b.word}"?`,
      answer: `Use "${a.word}" when you mean: ${a.definition.substring(0, 80)}. Use "${b.word}" when you mean: ${b.definition.substring(0, 80)}.`,
    },
  ];

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/" className="hover:underline">Home</a> / <a href="/compare" className="hover:underline">Compare</a> / <span className="text-slate-800">{a.word} vs {b.word}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{a.word} vs {b.word}</h1>
      <p className="text-lg text-slate-500 mb-8">What&apos;s the difference? Learn when to use each word.</p>

      {/* Quick Answer */}
      {hasRichData && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Quick Answer</h2>
          <div className="bg-indigo-50 rounded-lg p-6">
            <p className="text-slate-700">
              <strong>{a.word}</strong> ({a.pos || "—"}) means {a.definition.substring(0, 100)}.{" "}
              <strong>{b.word}</strong> ({b.pos || "—"}) means {b.definition.substring(0, 100)}.
              {a.usage_note ? ` ${a.usage_note.split('.')[0]}.` : ""}
            </p>
          </div>
        </section>
      )}

      {/* Side by Side */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Side-by-Side Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 text-left text-sm font-semibold text-slate-600 border border-slate-200 w-1/4"></th>
                <th className="p-3 text-left text-sm font-semibold text-indigo-600 border border-slate-200">{a.word}</th>
                <th className="p-3 text-left text-sm font-semibold text-indigo-600 border border-slate-200">{b.word}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Definition</td>
                <td className="p-3 text-slate-700 border border-slate-200">{a.definition.substring(0, 120)}</td>
                <td className="p-3 text-slate-700 border border-slate-200">{b.definition.substring(0, 120)}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Part of Speech</td>
                <td className="p-3 text-slate-700 border border-slate-200">{a.pos || "—"}</td>
                <td className="p-3 text-slate-700 border border-slate-200">{b.pos || "—"}</td>
              </tr>
              {a.phonetic || b.phonetic ? (
                <tr>
                  <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Pronunciation</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{a.phonetic ? `/${a.phonetic}/` : "—"}</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{b.phonetic ? `/${b.phonetic}/` : "—"}</td>
                </tr>
              ) : null}
              {a.level || b.level ? (
                <tr>
                  <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Level</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{a.level || "—"}</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{b.level || "—"}</td>
                </tr>
              ) : null}
              {exA.length > 0 || exB.length > 0 ? (
                <tr>
                  <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Example</td>
                  <td className="p-3 text-slate-700 border border-slate-200 italic">{exA[0] ? `"${exA[0]}"` : "—"}</td>
                  <td className="p-3 text-slate-700 border border-slate-200 italic">{exB[0] ? `"${exB[0]}"` : "—"}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {/* Etymology Comparison */}
      {(a.etymology || b.etymology) && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Origin & Etymology</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[a, b].map((w) => (
              <div key={w.slug} className="bg-amber-50 border-l-4 border-amber-300 p-4 rounded-r-lg">
                <h3 className="font-semibold text-amber-800 mb-1">{w.word}</h3>
                <p className="text-slate-700 text-sm">{w.etymology || "Etymology information not available."}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Usage Tips */}
      {(a.usage_note || b.usage_note) && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">When to Use Each</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[a, b].map((w) => (
              <div key={w.slug} className="bg-sky-50 border-l-4 border-sky-300 p-4 rounded-r-lg">
                <h3 className="font-semibold text-sky-800 mb-1">Use &ldquo;{w.word}&rdquo; when...</h3>
                <p className="text-slate-700 text-sm">{w.usage_note || w.definition.substring(0, 100)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="border border-slate-200 rounded-lg mb-2" open={i === 0}>
            <summary className="p-4 cursor-pointer font-medium">{faq.question}</summary>
            <div className="px-4 pb-4 text-slate-600">{faq.answer}</div>
          </details>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
    </div>
  );
}
