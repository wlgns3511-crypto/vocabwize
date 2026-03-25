import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getTopComparisons } from "@/lib/db";
import { faqSchema } from "@/lib/schema";

interface Props { params: Promise<{ slugs: string }> }
function parseSlugs(s: string): [string, string] | null {
  const m = s.match(/^(.+)-vs-(.+)$/);
  return m ? [m[1], m[2]] : null;
}

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
    title: `${a.word} vs ${b.word} - What's the Difference?`,
    description: `What's the difference between "${a.word}" and "${b.word}"? Compare definitions, usage, and meanings side by side.`,
    alternates: { canonical: `/compare/${slugs}` },
  };
}

export default async function ComparePage({ params }: Props) {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) notFound();
  const a = getWordBySlug(parsed[0]), b = getWordBySlug(parsed[1]);
  if (!a || !b) notFound();

  const faqs = [
    { question: `What is the difference between "${a.word}" and "${b.word}"?`, answer: `"${a.word}" means: ${a.definition.substring(0, 100)}. "${b.word}" means: ${b.definition.substring(0, 100)}.` },
  ];

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/" className="hover:underline">Home</a> / <a href="/compare" className="hover:underline">Compare</a> / <span className="text-slate-800">{a.word} vs {b.word}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-6">{a.word} vs {b.word}</h1>
      <p className="text-lg text-slate-500 mb-8">What&apos;s the difference?</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[a, b].map((w) => (
          <div key={w.slug} className="border border-slate-200 rounded-lg p-6">
            <a href={`/word/${w.slug}`} className="text-2xl font-bold text-indigo-700 hover:underline">{w.word}</a>
            {w.phonetic && <p className="text-sm text-slate-400 mt-1">/{w.phonetic}/</p>}
            {w.pos && <p className="text-xs text-indigo-400 mt-1">{w.pos}</p>}
            <div className="mt-4 text-slate-700">{w.definition}</div>
          </div>
        ))}
      </div>

      <section className="mt-8">
        {faqs.map((faq, i) => (
          <details key={i} className="border border-slate-200 rounded-lg mb-2" open>
            <summary className="p-4 cursor-pointer font-medium">{faq.question}</summary>
            <div className="px-4 pb-4 text-slate-600">{faq.answer}</div>
          </details>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
    </div>
  );
}
