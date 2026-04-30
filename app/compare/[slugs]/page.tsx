import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getTopComparisons, getSimilarWords, getWordsBySamePOS, getRandomWords } from "@/lib/db";
import compareKeepList from "@/lib/generated/compare-keep.json";
import { AdSlot } from "@/components/AdSlot";
import { ComparisonBar } from "@/components/ComparisonBar";
import { faqSchema } from "@/lib/schema";

interface Props { params: Promise<{ slugs: string }> }

// HCU 2026-04-24: source of truth = scripts/build-keep-sets.ts output.
// top-100 by popularity_score + GSC evidence union (10 URLs earning ≥1
// click in 28d window whose pairs don't exist in comparisons table but
// whose word halves exist in words table — page renders fine).
const ALLOWED_COMPARISON_SLUGS = new Set(compareKeepList as string[]);

function parseSlugs(s: string): [string, string] | null {
  const m = s.match(/^(.+)-vs-(.+)$/);
  return m ? [m[1], m[2]] : null;
}

function toCanonicalComparisonSlug(slugs: string): string | null {
  const parsed = parseSlugs(slugs);
  if (!parsed) return null;
  return [parsed[0], parsed[1]].sort().join("-vs-");
}

function parseJson(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  const params: { slugs: string }[] = [];
  for (const canonicalSlugs of ALLOWED_COMPARISON_SLUGS) {
    params.push({ slugs: canonicalSlugs });
    const parsed = parseSlugs(canonicalSlugs);
    if (!parsed) continue;
    const reverseSlugs = `${parsed[1]}-vs-${parsed[0]}`;
    if (reverseSlugs !== canonicalSlugs) params.push({ slugs: reverseSlugs });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const canonicalSlugs = toCanonicalComparisonSlug(slugs);
  const parsed = parseSlugs(slugs);
  if (!parsed || !canonicalSlugs || !ALLOWED_COMPARISON_SLUGS.has(canonicalSlugs)) return {};
  const a = getWordBySlug(parsed[0]), b = getWordBySlug(parsed[1]);
  if (!a || !b) return {};
  return {
    title: `${a.word} vs ${b.word} — What's the Difference?`,
    description: `${a.word} means "${a.definition.substring(0, 60)}..." while ${b.word} means "${b.definition.substring(0, 60)}..." Compare side by side with examples.`,
    openGraph: { url: `/compare/${canonicalSlugs}/` },
    alternates: { canonical: `/compare/${canonicalSlugs}/` },
  };
}

export default async function ComparePage({ params }: Props) {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) notFound();
  const canonical = [parsed[0], parsed[1]].sort().join("-vs-");
  if (!ALLOWED_COMPARISON_SLUGS.has(canonical)) notFound();
  if (slugs !== canonical) redirect(`/compare/${canonical}/`);
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
        <a href="/" className="hover:underline">Home</a> / <a href="/compare/" className="hover:underline">Compare</a> / <span className="text-slate-800">{a.word} vs {b.word}</span>
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

      {(a.frequency != null || b.frequency != null) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "24px 0" }}>
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Word Frequency</h3>
            <ComparisonBar
              bars={[
                ...(a.frequency != null ? [{ label: a.word, value: a.frequency }] : []),
                ...(b.frequency != null ? [{ label: b.word, value: b.frequency }] : []),
              ]}
              format={(v) => v.toLocaleString()}
            />
          </div>
        </div>
      )}

      <AdSlot id="compare-mid" />

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

      {/* Etymology Comparison */}
      {(a.etymology || b.etymology) && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Etymology Comparison</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-1">{a.word} — Origin</h3>
              <p className="text-slate-700 text-sm">{a.etymology || "Etymology not available"}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-1">{b.word} — Origin</h3>
              <p className="text-slate-700 text-sm">{b.etymology || "Etymology not available"}</p>
            </div>
          </div>
        </section>
      )}

      {/* Usage in Context */}
      {(exA.length > 0 || exB.length > 0) && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Usage in Context</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">{a.word} examples</h3>
              {exA.length > 0 ? (
                <ul className="space-y-2">
                  {exA.map((ex, i) => (
                    <li key={i} className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg italic">&ldquo;{ex}&rdquo;</li>
                  ))}
                </ul>
              ) : <p className="text-slate-400 text-sm">No examples available</p>}
            </div>
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">{b.word} examples</h3>
              {exB.length > 0 ? (
                <ul className="space-y-2">
                  {exB.map((ex, i) => (
                    <li key={i} className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg italic">&ldquo;{ex}&rdquo;</li>
                  ))}
                </ul>
              ) : <p className="text-slate-400 text-sm">No examples available</p>}
            </div>
          </div>
        </section>
      )}

      {/* Word Properties */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Word Properties</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 text-left font-semibold text-slate-600 border border-slate-200">Property</th>
                <th className="p-3 text-left font-semibold text-indigo-600 border border-slate-200">{a.word}</th>
                <th className="p-3 text-left font-semibold text-indigo-600 border border-slate-200">{b.word}</th>
              </tr>
            </thead>
            <tbody>
              {(a.level || b.level) && (
                <tr>
                  <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Level</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{a.level || "—"}</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{b.level || "—"}</td>
                </tr>
              )}
              <tr>
                <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Syllables</td>
                <td className="p-3 text-slate-700 border border-slate-200">{(a as any).syllables ?? "—"}</td>
                <td className="p-3 text-slate-700 border border-slate-200">{(b as any).syllables ?? "—"}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Length</td>
                <td className="p-3 text-slate-700 border border-slate-200">{a.word.length} chars</td>
                <td className="p-3 text-slate-700 border border-slate-200">{b.word.length} chars</td>
              </tr>
              {(a.frequency != null || b.frequency != null) && (
                <tr>
                  <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Frequency</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{a.frequency != null ? a.frequency.toLocaleString() : "—"}</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{b.frequency != null ? b.frequency.toLocaleString() : "—"}</td>
                </tr>
              )}
              {(a.pos || b.pos) && (
                <tr>
                  <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Part of Speech</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{a.pos || "—"}</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{b.pos || "—"}</td>
                </tr>
              )}
              {(a.phonetic || b.phonetic) && (
                <tr>
                  <td className="p-3 font-medium text-slate-600 border border-slate-200 bg-slate-50">Pronunciation</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{a.phonetic ? `/${a.phonetic}/` : "—"}</td>
                  <td className="p-3 text-slate-700 border border-slate-200">{b.phonetic ? `/${b.phonetic}/` : "—"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Smart related comparisons */}
      {(() => {
        const similarA = getSimilarWords(a.slug, 4).filter(w => w.slug !== b.slug);
        const samePOS = a.pos ? getWordsBySamePOS(a.pos, a.slug, 4).filter(w => w.slug !== b.slug && !similarA.find(s => s.slug === w.slug)) : [];
        const synA = parseJson(a.synonyms).slice(0, 3);
        const synB = parseJson(b.synonyms).slice(0, 3);
        return (
          <section className="mt-8 mb-4">
            <h2 className="text-lg font-bold mb-3">Related Comparisons</h2>
            {similarA.length > 0 && (
              <>
                <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Similar to &ldquo;{a.word}&rdquo;</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {similarA.map(w => {
                    const [x, y] = [a.slug, w.slug].sort();
                    return (
                      <a key={w.slug} href={`/word/${y}/`}
                        className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-indigo-700 rounded-full">
                        {a.word} vs {w.word}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
            {synA.length > 0 && (
              <>
                <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Synonym comparisons</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {synA.map(syn => {
                    const [x, y] = [b.slug, syn.toLowerCase().replace(/\s+/g, '-')].sort();
                    return (
                      <a key={syn} href={`/word/${y}/`}
                        className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-indigo-700 rounded-full">
                        {b.word} vs {syn}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
            {samePOS.length > 0 && (
              <>
                <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">More {a.pos} comparisons</h3>
                <div className="flex flex-wrap gap-2">
                  {samePOS.map(w => {
                    const [x, y] = [a.slug, w.slug].sort();
                    return (
                      <a key={w.slug} href={`/word/${y}/`}
                        className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-full">
                        {a.word} vs {w.word}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        );
      })()}

      {/* Discover more words */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">Discover More Words</h2>
        <div className="flex flex-wrap gap-2">
          {getRandomWords(15).map(rw => (
            <a key={rw.slug} href={`/word/${rw.slug}/`}
              className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-indigo-700 rounded-full transition-colors">
              {rw.word}
            </a>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: a.word,
        description: a.definition,
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: b.word,
        description: b.definition,
      }) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />}
    </div>
  );
}
