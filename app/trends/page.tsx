/**
 * /trends/ — Hub for the Google Books NGram-based trend taxonomy.
 *
 * Surfaces seven status buckets (rising / declining / modern coinage /
 * Victorian peak / obsolete / classic / stable) with live keep-set counts
 * and entry links. The data is sourced from `data/ngram-trends.json`
 * built by `scripts/fetch-ngram-trends.py` (Google Books NGram en-2019 corpus,
 * 1800-2019, 3-yr smoothing).
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TREND_TYPES,
  TREND_PROFILES,
  getTrendStatusCounts,
  trendCount,
  statusLabel,
  statusTone,
  type TrendStatus,
} from '@/lib/word-trends';

type ActiveTrend = Exclude<TrendStatus, 'no-data'>;

const SITE_URL = 'https://vocabwize.com';

export const metadata: Metadata = {
  title: 'English Word Frequency Trends — Rising, Declining & Classic Vocabulary (Google Books NGram 1800-2019)',
  description: 'Browse English vocabulary by Google Books NGram 1800-2019 historical trend: rising, declining, modern coinages, Victorian-peak words, classic-stable, and obsolete vocabulary. 20,000-word keep-set classified into 7 buckets.',
  alternates: { canonical: '/trends/' },
  openGraph: {
    title: 'English Word Frequency Trends — Google Books NGram 1800-2019',
    description: 'Vocabulary classified by historical usage trajectory across 220 years of printed English.',
    url: '/trends/',
  },
};

export const revalidate = 86400;

export default function TrendsHub() {
  const counts = getTrendStatusCounts();
  const total = trendCount();

  const ldjson = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'English Word Frequency Trends',
    url: `${SITE_URL}/trends/`,
    description: 'Vocabulary classified by Google Books NGram 1800-2019 trend trajectory.',
    isPartOf: { '@type': 'WebSite', name: 'VocabWize', url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: TREND_TYPES.length,
      itemListElement: TREND_TYPES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: TREND_PROFILES[s as ActiveTrend].title,
        url: `${SITE_URL}/trends/${s}/`,
      })),
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }} />

      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span> / </span>
        <span className="text-slate-800">Word Frequency Trends</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          English Word Frequency Trends
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          We ran the top {total > 0 ? total.toLocaleString() : '20,000'} most-searched English words through the
          Google Books NGram 1800-2019 corpus and classified each into one of seven historical trend
          buckets. Browse the buckets below to see which words climbed, faded, or held steady across 220
          years of printed English.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-4 mb-10">
        {TREND_TYPES.map((s) => {
          const profile = TREND_PROFILES[s as ActiveTrend];
          const count = counts[s] ?? 0;
          const tone = statusTone(s);
          return (
            <Link
              key={s}
              href={`/trends/${s}/`}
              className={`group block rounded-xl border-2 ${tone.border} ${tone.bg} p-5 hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className={`text-lg font-bold ${tone.text} group-hover:underline`}>
                  {statusLabel(s)}
                </h2>
                <span className={`text-xs font-mono ${tone.text} opacity-70`}>
                  {count.toLocaleString()} word{count === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">{profile.blurb}</p>
              <p className={`text-xs font-medium ${tone.text} opacity-80`}>
                Browse top 25 →
              </p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-7 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">How the trend buckets are computed</h2>
        <p className="text-sm text-slate-700 leading-relaxed mb-3">
          For each keep-set word we fetch the full 1800-2019 yearly frequency curve from
          Google Books NGram (English 2019 corpus, 3-year smoothing). The 220 yearly points are reduced to
          22 decade-level averages. Status assignment follows a deterministic rule chain:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 mb-4">
          <li><strong>Modern coinage</strong> — first non-zero appearance is in 1950 or later.</li>
          <li><strong>Victorian peak</strong> — peak decade falls 1850-1910 and current usage is below 40% of that peak.</li>
          <li><strong>Largely obsolete</strong> — current frequency is below 5% of the historical peak (peak before 1980).</li>
          <li><strong>Rising</strong> — 2000-2019 average is at least 1.5× the early-period (first-20-year) baseline.</li>
          <li><strong>Declining</strong> — 2000-2019 average is at most 0.5× the early-period baseline.</li>
          <li><strong>Classic</strong> — first attested before 1850, current within ±50% of baseline.</li>
          <li><strong>Stable</strong> — none of the above; usage holds within typical variance.</li>
        </ul>
        <p className="text-xs text-slate-500 leading-relaxed">
          The classification is signal-based, not editorial: every word in the keep-set runs through the
          same rule chain on the same corpus. We deliberately exclude words that fall below the corpus
          noise floor (no reliable trend can be inferred from missing data).
        </p>
      </section>

      <section className="rounded-xl border border-blue-100 bg-blue-50 p-5 sm:p-7 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-blue-900 mb-2">Why historical trend matters for vocabulary learning</h2>
        <p className="mb-2">
          A word&rsquo;s dictionary entry tells you what it means. Its NGram trajectory tells you whether using
          it will sound contemporary, slightly formal, or distinctly archaic. For ESL learners and
          writers, that register signal is often more useful than the headline frequency rank.
        </p>
        <p>
          A &ldquo;rising&rdquo; word is a high-yield investment — it appears more often each year. A &ldquo;declining&rdquo;
          word still works, but tilts the register slightly older. An &ldquo;obsolete&rdquo; word is a reading-only tool
          for historical texts. Each bucket page below ranks the 25 clearest examples and links to the
          full dictionary entry with usage notes, examples, and pronunciation.
        </p>
      </section>
    </div>
  );
}
