/**
 * /research/ — Hub for VocabWize data-journalism articles.
 *
 * Each article is a substantive analysis of the Google Books NGram trend
 * dataset, written longform with methodology, findings, examples, and
 * references. Distinct from /insights/ which is shorter analytical pieces.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllResearchArticles } from '@/lib/research-articles';

const SITE_URL = 'https://vocabwize.com';

export const metadata: Metadata = {
  title: 'Vocabulary Research — Google Books NGram Analysis | VocabWize',
  description: 'Long-form data-journalism articles based on the VocabWize Google Books NGram 1800-2019 trend dataset. Methodology, findings, and worked examples.',
  alternates: { canonical: '/research/' },
  openGraph: {
    title: 'VocabWize Research — Vocabulary Trend Analysis',
    description: 'Data-driven articles on English vocabulary trends across two centuries.',
    url: '/research/',
  },
};

export default function ResearchHub() {
  const articles = getAllResearchArticles();

  const ldjson = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'VocabWize Research',
    url: `${SITE_URL}/research/`,
    description: 'Long-form data-journalism on English vocabulary trends.',
    isPartOf: { '@type': 'WebSite', name: 'VocabWize', url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.title,
        url: `${SITE_URL}/research/${a.slug}/`,
      })),
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }} />

      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span> / </span>
        <span className="text-slate-800">Research</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">VocabWize Research</h1>
        <p className="text-slate-600 max-w-3xl text-base sm:text-lg leading-relaxed">
          Long-form data-journalism articles built on our Google Books NGram 1800-2019 trend dataset.
          Each piece includes the methodology, the headline findings, worked examples drawn from the
          live VocabWize keep-set, and references to the underlying data sources.
        </p>
      </header>

      <ol className="space-y-5">
        {articles.map((a, i) => (
          <li key={a.slug} className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 hover:shadow-md transition-shadow">
            <Link href={`/research/${a.slug}/`} className="block">
              <div className="flex items-start gap-3">
                <span className="text-2xl font-bold text-slate-300 font-mono mt-0.5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-blue-700 hover:underline mb-2">
                    {a.title}
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">{a.abstract}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>📅 {a.publishedDate}</span>
                    <span>⏱ {a.readingMinutes} min read</span>
                    <span>📚 {a.references.length} references</span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-5 sm:p-7 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-blue-900 mb-2">About this research</h2>
        <p className="mb-2">
          All articles in this section use the same underlying dataset — the Google Books NGram Viewer
          1800-2019 corpus, English 2019 edition, 3-year smoothing — applied to the VocabWize 20,000-word
          keep-set. Methodology details are in each article&rsquo;s opening section.
        </p>
        <p>
          For interactive trend exploration, see the <Link href="/trends/" className="text-blue-700 underline font-semibold">trends hub</Link>.
          For dictionary entries with embedded NGram trend modules, see the
          {' '}<Link href="/word/" className="text-blue-700 underline font-semibold">main dictionary</Link>.
        </p>
      </section>
    </div>
  );
}
