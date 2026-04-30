/**
 * /research/[topic]/ — Renders a single research article.
 *
 * The article body is hand-written + structured (lib/research-articles.ts).
 * If a section has a `bucketCallout`, we fetch the live keep-set words in that
 * trend bucket and render them inline with the article.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResearchArticle, getAllResearchArticles } from '@/lib/research-articles';
import { getWordsByTrendStatus, statusLabel, statusTone } from '@/lib/word-trends';
import { getWordBySlug } from '@/lib/db';

const SITE_URL = 'https://vocabwize.com';

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllResearchArticles().map((a) => ({ topic: a.slug }));
}

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const a = getResearchArticle(topic);
  if (!a) return { title: 'Article not found' };
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    alternates: { canonical: `/research/${topic}/` },
    openGraph: {
      title: a.title,
      description: a.metaDescription,
      url: `/research/${topic}/`,
      type: 'article',
      publishedTime: a.publishedDate,
      modifiedTime: a.updatedDate,
    },
  };
}

export default async function ResearchArticlePage({ params }: Props) {
  const { topic } = await params;
  const article = getResearchArticle(topic);
  if (!article) notFound();

  // Pre-fetch any bucket callouts so the page is fully rendered server-side.
  const calloutData = article.sections.map((s) => {
    if (!s.bucketCallout) return null;
    const items = getWordsByTrendStatus(s.bucketCallout.status, s.bucketCallout.limit);
    return items.map(({ slug, trend }) => {
      const w = getWordBySlug(slug);
      return { slug, word: w?.word ?? slug.replace(/-/g, ' '), trend };
    });
  });

  const ldjson = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    author: { '@type': 'Organization', name: 'VocabWize Editorial', url: `${SITE_URL}/about/` },
    publisher: {
      '@type': 'Organization',
      name: 'VocabWize',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/research/${article.slug}/` },
    isPartOf: {
      '@type': 'WebSite',
      name: 'VocabWize',
      url: SITE_URL,
    },
    articleSection: 'Vocabulary Research',
    wordCount: article.sections.reduce(
      (n, s) => n + s.paragraphs.reduce((m, p) => m + p.split(/\s+/).length, 0),
      0,
    ),
  };

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Research', item: `${SITE_URL}/research/` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/research/${article.slug}/` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span> / </span>
        <Link href="/research/" className="hover:underline">Research</Link>
        <span> / </span>
        <span className="text-slate-800 truncate inline-block max-w-[40ch] align-bottom">{article.title}</span>
      </nav>

      <article className="prose prose-slate max-w-3xl">
        <header className="mb-6 not-prose">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-4">
            <span><strong>Published:</strong> {article.publishedDate}</span>
            <span><strong>Updated:</strong> {article.updatedDate}</span>
            <span>{article.readingMinutes} min read</span>
          </div>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed border-l-4 border-blue-300 bg-blue-50 px-4 py-3 rounded-r">
            <strong className="text-blue-900">Abstract.</strong> {article.abstract}
          </p>
        </header>

        {/* Key takeaways */}
        <section className="not-prose mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-base font-bold text-amber-900 mb-2 uppercase tracking-wide">Key Takeaways</h2>
          <ul className="space-y-1.5 list-disc pl-5">
            {article.takeaways.map((t, i) => (
              <li key={i} className="text-sm text-slate-800 leading-relaxed">{t}</li>
            ))}
          </ul>
        </section>

        {/* Body sections */}
        {article.sections.map((s, idx) => {
          const callout = calloutData[idx];
          const tone = s.bucketCallout ? statusTone(s.bucketCallout.status) : null;
          return (
            <section key={idx} className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4 text-base">{p}</p>
              ))}
              {s.bucketCallout && callout && callout.length > 0 && tone && (
                <div className={`not-prose rounded-xl border ${tone.border} ${tone.bg} p-4 sm:p-5 my-5`}>
                  <p className={`text-xs uppercase tracking-wider font-semibold mb-2 ${tone.text}`}>
                    {statusLabel(s.bucketCallout.status)} · {s.bucketCallout.intro}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {callout.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/word/${c.slug}/`}
                        className="text-sm font-semibold text-blue-700 bg-white border border-slate-200 rounded-full px-3 py-1 hover:border-blue-400 hover:shadow-sm transition"
                      >
                        {c.word}
                      </Link>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Source: VocabWize keep-set, classified via Google Books NGram 1800-2019 trend rules.
                    See the <Link href={`/trends/${s.bucketCallout.status}/`} className="text-blue-600 underline">full {statusLabel(s.bucketCallout.status).toLowerCase()} bucket</Link>.
                  </p>
                </div>
              )}
            </section>
          );
        })}

        {/* References */}
        <section className="mt-10 not-prose">
          <h2 className="text-xl font-bold text-slate-900 mb-3">References</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {article.references.map((r, i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>

      {/* Cross-link to other research articles */}
      <section className="mt-10 pt-6 border-t border-slate-200 max-w-3xl">
        <h2 className="text-base font-bold text-slate-700 mb-3">More research</h2>
        <ul className="space-y-2">
          {getAllResearchArticles()
            .filter((a) => a.slug !== article.slug)
            .map((a) => (
              <li key={a.slug}>
                <Link href={`/research/${a.slug}/`} className="text-blue-700 hover:underline text-sm font-medium">
                  → {a.title}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
