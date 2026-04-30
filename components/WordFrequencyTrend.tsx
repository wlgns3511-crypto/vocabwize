/**
 * WordFrequencyTrend — Renders the Google Books NGram 1800-2019 historical
 * frequency trace for a single word, plus a Layer 2 commentary box explaining
 * what the trend means for modern usage.
 *
 * Pure SSR / static — no client JS needed. SVG sparkline + Tailwind stat cards.
 *
 * Inputs: pre-built WordTrend object (`lib/word-trends.ts → getWordTrend`) and
 * pre-built TrendCommentary (`buildTrendCommentary`). Both are computed at
 * build time and embedded in the static HTML; no runtime fetches.
 */
import type { WordTrend, TrendCommentary } from '@/lib/word-trends';
import { statusLabel, statusTone } from '@/lib/word-trends';

const DECADE_LABELS = [
  '1800', '1810', '1820', '1830', '1840', '1850', '1860', '1870', '1880', '1890', '1900',
  '1910', '1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010',
];

function buildPath(values: number[], width: number, height: number, padding = 4): string {
  if (!values.length) return '';
  const max = Math.max(...values, 1e-15);
  const step = (width - padding * 2) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = padding + i * step;
      const y = padding + (height - padding * 2) * (1 - v / max);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

function buildAreaPath(values: number[], width: number, height: number, padding = 4): string {
  if (!values.length) return '';
  const line = buildPath(values, width, height, padding);
  const lastX = padding + (width - padding * 2);
  const baseY = height - padding;
  return `${line} L${lastX.toFixed(2)},${baseY.toFixed(2)} L${padding.toFixed(2)},${baseY.toFixed(2)} Z`;
}

function fmtFreq(v: number | undefined): string {
  if (v == null || !Number.isFinite(v) || v <= 0) return '—';
  if (v >= 1e-4) return `${(v * 100).toFixed(3)}%`;
  if (v >= 1e-6) return `${(v * 1e6).toFixed(2)} ppm`;
  if (v >= 1e-8) return `${(v * 1e8).toFixed(2)} per 100M`;
  return v.toExponential(2);
}

function pctOfPeak(current?: number, peak?: number): string {
  if (current == null || peak == null || peak <= 0) return '—';
  const pct = (current / peak) * 100;
  if (pct >= 1) return `${pct.toFixed(0)}%`;
  return `${pct.toFixed(1)}%`;
}

export function WordFrequencyTrend({
  trend,
  commentary,
  word,
}: {
  trend: WordTrend;
  commentary: TrendCommentary;
  word: string;
}) {
  const tone = statusTone(trend.status);
  const buckets = trend.decade_buckets ?? [];

  // SVG geometry
  const W = 720;
  const H = 140;
  const linePath = buildPath(buckets, W, H);
  const areaPath = buildAreaPath(buckets, W, H);

  // Find indices for peak + current to draw markers
  const max = buckets.length ? Math.max(...buckets) : 0;
  const peakIdx = buckets.findIndex((v) => v === max);
  const peakDecadeLabel = peakIdx >= 0 ? DECADE_LABELS[peakIdx] + 's' : '—';

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      {/* Header — status pill + headline */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${tone.bg} ${tone.text} ${tone.border}`}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {statusLabel(trend.status)}
        </span>
        <span className="text-xs text-slate-500">Google Books NGram · 1800-2019 · en-2019 corpus</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
        Historical usage trend for <span className="text-blue-700">&ldquo;{word}&rdquo;</span>
      </h2>
      <p className="text-sm text-slate-600 mb-5">{commentary.headline}</p>

      {/* Sparkline */}
      {buckets.length === 22 && max > 0 ? (
        <div className="mb-5">
          <svg
            role="img"
            aria-label={`Decade-by-decade frequency of "${word}" from 1800 through 2019. ${commentary.headline}.`}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`grad-${trend.status}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <g className={tone.text}>
              {/* horizontal grid */}
              {[0.25, 0.5, 0.75].map((p) => (
                <line
                  key={p}
                  x1={4}
                  x2={W - 4}
                  y1={4 + (H - 8) * p}
                  y2={4 + (H - 8) * p}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="2 4"
                />
              ))}
              {/* area fill */}
              <path d={areaPath} fill={`url(#grad-${trend.status})`} />
              {/* line */}
              <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {/* peak marker */}
              {peakIdx >= 0 && (() => {
                const padding = 4;
                const step = (W - padding * 2) / (buckets.length - 1);
                const cx = padding + peakIdx * step;
                const cy = padding + (H - padding * 2) * (1 - buckets[peakIdx] / max);
                return <circle cx={cx} cy={cy} r="4" fill="currentColor" stroke="white" strokeWidth="1.5" />;
              })()}
            </g>
          </svg>

          {/* x-axis decade labels — show every 4th to avoid crowding */}
          <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-mono px-1">
            {DECADE_LABELS.filter((_, i) => i % 4 === 0).map((d) => (
              <span key={d}>{d}s</span>
            ))}
            <span>2010s</span>
          </div>
        </div>
      ) : (
        <div className="mb-5 py-8 text-center text-sm text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          Insufficient corpus signal to plot a trend curve for &ldquo;{word}&rdquo;.
        </div>
      )}

      {/* Stat grid — 4 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="First attested" value={trend.first_year ? String(trend.first_year) : '—'} />
        <StatCard label="Peak decade" value={peakDecadeLabel} />
        <StatCard
          label="Peak frequency"
          value={fmtFreq(trend.peak_freq)}
          subtext={trend.peak_year ? `in ${trend.peak_year}` : undefined}
        />
        <StatCard
          label="Current vs peak"
          value={pctOfPeak(trend.current_freq, trend.peak_freq)}
          subtext="2019 reading"
        />
      </div>

      {/* Layer 2 commentary block */}
      <div className={`rounded-xl border ${tone.border} ${tone.bg} p-4 sm:p-5`}>
        <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">What the trend tells us</h3>
        <p className="text-sm text-slate-800 mb-3 leading-relaxed">
          <span className="font-semibold">Reading: </span>{commentary.fact}
        </p>
        <p className="text-sm text-slate-700 mb-3 leading-relaxed">
          <span className="font-semibold">Why it matters: </span>{commentary.context}
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          <span className="font-semibold">For your writing: </span>{commentary.implication}
        </p>
      </div>

      {/* Methodology footer */}
      <p className="mt-4 text-[11px] text-slate-400">
        Trend computed from the Google Books NGram Viewer, English 2019 corpus, 3-year smoothing,
        averaged into 22 decade buckets. The classification (rising / declining / Victorian peak / etc.) is rule-based on the
        ratio between the 2000-2019 average and the early-period average. Source data is Google&rsquo;s public NGram JSON endpoint.
      </p>
    </section>
  );
}

function StatCard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">{label}</div>
      <div className="text-lg font-bold text-slate-900 leading-tight">{value}</div>
      {subtext ? <div className="text-[10px] text-slate-500 mt-0.5">{subtext}</div> : null}
    </div>
  );
}
