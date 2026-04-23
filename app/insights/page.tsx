import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllInsightArticles } from '@/lib/insight-articles';

const SITE_URL = 'https://vocabwize.com';

export const metadata: Metadata = {
  title: 'Vocabulary Insights — Data-Driven Language Analysis',
  description: 'Expert analysis of English vocabulary trends, most-searched words, spelling difficulty data, and vocabulary size research. Based on real dictionary lookup data.',
  alternates: { canonical: '/insights/' },
  openGraph: { title: 'Vocabulary Insights', description: 'Data-driven English vocabulary and language trend analysis.', url: '/insights/' },
};

export default function InsightsIndex() {
  const articles = getAllInsightArticles();

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'VocabWize Insights',
            url: `${SITE_URL}/insights/`,
            numberOfItems: articles.length,
            itemListElement: articles.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: a.title,
              url: `${SITE_URL}/insights/${a.slug}/`,
            })),
          }),
        }}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vocabulary Insights</h1>
        <p className="text-slate-600 max-w-3xl">
          Data-driven analysis of the English language — which words people search most, how vocabulary
          grows with age, and what makes certain words persistently difficult. Based on real lookup data
          from our dictionary of 160,000+ words.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/insights/${a.slug}/`}
            className="block rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 p-5 transition-colors"
          >
            <div className="text-xs text-slate-400 mb-1">
              <time dateTime={a.date}>{a.date}</time>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">{a.title}</h2>
            <p className="text-sm text-slate-600">{a.summary}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 p-6 rounded-xl bg-slate-50 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Explore the data yourself</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/rankings/" className="text-indigo-700 hover:underline font-medium">Word frequency rankings</Link>
            <span className="text-slate-500"> — the most common English words by usage</span>
          </li>
          <li>
            <Link href="/compare/" className="text-indigo-700 hover:underline font-medium">Compare confusing words</Link>
            <span className="text-slate-500"> — side-by-side definitions and usage</span>
          </li>
          <li>
            <Link href="/quiz/" className="text-indigo-700 hover:underline font-medium">Test your vocabulary</Link>
            <span className="text-slate-500"> — interactive quiz with instant feedback</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
