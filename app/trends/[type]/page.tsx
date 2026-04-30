/**
 * /trends/[type]/ — One page per NGram trend status.
 *
 * Renders the top 25 words in the given bucket (sorted by trend strength),
 * each with their decade-bucket sparkline, key stats, and a link to the
 * full dictionary entry. Editorial hook + outro come from TREND_PROFILES.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWordBySlug } from '@/lib/db';
import {
  TREND_TYPES,
  TREND_PROFILES,
  getTrendProfile,
  getWordsByTrendStatus,
  statusLabel,
  statusTone,
  buildTrendCommentary,
  type TrendStatus,
  type WordTrend,
} from '@/lib/word-trends';

const SITE_URL = 'https://vocabwize.com';

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return TREND_TYPES.map((t) => ({ type: t }));
}

interface Props {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const profile = getTrendProfile(type as TrendStatus);
  if (!profile) return { title: 'Trend not found' };
  return {
    title: profile.metaTitle,
    description: profile.metaDescription,
    alternates: { canonical: `/trends/${type}/` },
    openGraph: { title: profile.metaTitle, description: profile.metaDescription, url: `/trends/${type}/` },
  };
}

function MiniSparkline({ buckets, status }: { buckets?: number[]; status: TrendStatus }) {
  if (!buckets || buckets.length !== 22) return null;
  const max = Math.max(...buckets, 1e-15);
  if (max === 0) return null;
  const W = 200;
  const H = 36;
  const pad = 2;
  const step = (W - pad * 2) / (buckets.length - 1);
  const linePath = buckets
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + (H - pad * 2) * (1 - v / max);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const areaPath = `${linePath} L${W - pad},${H - pad} L${pad},${H - pad} Z`;
  const tone = statusTone(status);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full h-9 ${tone.text}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={areaPath} fill="currentColor" fillOpacity="0.18" />
      <path d={linePath} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function fmtChange(p: number | null | undefined): string {
  if (p == null || !Number.isFinite(p)) return '';
  if (Math.abs(p) < 5) return '~flat';
  if (p > 0) return `+${Math.round(p)}%`;
  return `${Math.round(p)}%`;
}

export default async function TrendBucketPage({ params }: Props) {
  const { type } = await params;
  const status = type as TrendStatus;
  const profile = getTrendProfile(status);
  if (!profile) notFound();

  const items = getWordsByTrendStatus(status, 25);
  const tone = statusTone(status);

  // For each item, look up the canonical word string from vocab.db
  const enriched = items.map(({ slug, trend }) => {
    const w = getWordBySlug(slug);
    return { slug, trend, word: w?.word ?? slug.replace(/-/g, ' '), pos: w?.pos ?? null, level: w?.level ?? null };
  });

  const ldjson = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: profile.title,
    description: profile.metaDescription,
    url: `${SITE_URL}/trends/${status}/`,
    numberOfItems: enriched.length,
    itemListElement: enriched.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.word,
      url: `${SITE_URL}/word/${e.slug}/`,
    })),
  };

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Trends', item: `${SITE_URL}/trends/` },
      { '@type': 'ListItem', position: 3, name: statusLabel(status), item: `${SITE_URL}/trends/${status}/` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span> / </span>
        <Link href="/trends/" className="hover:underline">Trends</Link>
        <span> / </span>
        <span className="text-slate-800">{statusLabel(status)}</span>
      </nav>

      <header className="mb-6">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border mb-3 ${tone.bg} ${tone.text} ${tone.border}`}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {statusLabel(status)} · {enriched.length} words
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{profile.title}</h1>
        <p className="text-slate-600 text-base leading-relaxed max-w-3xl">{profile.blurb}</p>
      </header>

      {/* Editorial hook */}
      <section className={`rounded-xl border ${tone.border} ${tone.bg} p-5 sm:p-7 mb-8`}>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{profile.hookHeadline}</h2>
        <p className="text-sm text-slate-700 leading-relaxed">{profile.hook}</p>
      </section>

      {/* Word list */}
      {enriched.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 mb-8">
          <p className="text-base">
            Trend data for &ldquo;{statusLabel(status)}&rdquo; is still indexing. Check back shortly — the historical
            corpus build runs on a daily cadence.
          </p>
        </div>
      ) : (
        <ol className="space-y-3 mb-10">
          {enriched.map((e, i) => {
            const t = e.trend;
            const change = fmtChange(t.change_pct);
            const peakDecade = t.peak_year ? `${Math.floor(t.peak_year / 10) * 10}s` : '—';
            const commentary = buildTrendCommentary(e.slug, e.word, t);
            return (
              <li key={e.slug}>
                <Link
                  href={`/word/${e.slug}/`}
                  className="group flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex sm:flex-col items-center sm:justify-center sm:w-14 sm:flex-shrink-0">
                    <span className="text-2xl font-bold text-slate-300 font-mono">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h3 className="text-xl font-bold text-blue-700 group-hover:underline">{e.word}</h3>
                      {e.pos && <span className="text-xs text-slate-500 italic">{e.pos}</span>}
                      {e.level && (
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          {e.level}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2 line-clamp-2">
                      {commentary.fact}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>Peak: <strong className="text-slate-700">{peakDecade}</strong></span>
                      {change && <span className={tone.text + ' font-semibold'}>2000s vs early: {change}</span>}
                      <span>First: <strong className="text-slate-700">{t.first_year ?? '—'}</strong></span>
                    </div>
                  </div>
                  <div className="sm:w-48 flex-shrink-0">
                    <MiniSparkline buckets={t.decade_buckets} status={status} />
                    <div className="flex justify-between mt-0.5 text-[9px] text-slate-400 font-mono">
                      <span>1800s</span>
                      <span>2010s</span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      {/* Editorial outro */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-2">How to use this list</h2>
        <p className="text-sm text-slate-700 leading-relaxed">{profile.outro}</p>
      </section>

      {/* Cross-links to other buckets */}
      <section className="border-t border-slate-200 pt-6 mb-6">
        <h2 className="text-base font-bold text-slate-700 mb-3">Browse other trend buckets</h2>
        <div className="flex flex-wrap gap-2">
          {TREND_TYPES.filter((t) => t !== status).map((t) => {
            const tt = statusTone(t);
            return (
              <Link
                key={t}
                href={`/trends/${t}/`}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${tt.border} ${tt.bg} ${tt.text} hover:shadow-sm transition`}
              >
                {statusLabel(t)} →
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
