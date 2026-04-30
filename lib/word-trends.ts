/**
 * word-trends.ts — Google Books NGram 1800-2019 frequency time-series for the
 * top-20K keep-set, classified into 7 trend buckets with Layer 2 commentary
 * generated via slug-hash deterministic variant selection.
 *
 * Data source: Google Books NGram Viewer JSON endpoint, en-2019 corpus.
 * Smoothing 3 (3-year moving average), 220 yearly points reduced to 22 decade
 * buckets per word.
 *
 * Status taxonomy:
 *   modern-coinage    First non-zero year ≥ 1950 (recent invention)
 *   victorian-peak    Peak 1850-1910, current < 40% of peak (period-specific)
 *   obsolete          Current < 5% of peak (post-1980), active in print pre-1980
 *   rising            2000-2019 avg > 1.5× early-period avg (climbing usage)
 *   declining         2000-2019 avg < 0.5× early-period avg (falling usage)
 *   classic           Pre-1850 first attestation, ±50% stable across centuries
 *   stable            Default — within ±50% across history
 *   no-data           Word not in corpus or insufficient signal
 */

import * as fs from 'fs';
import * as path from 'path';
import { pickVariant } from './content-helpers';

export type TrendStatus =
  | 'modern-coinage'
  | 'victorian-peak'
  | 'obsolete'
  | 'rising'
  | 'declining'
  | 'classic'
  | 'stable'
  | 'no-data';

export interface WordTrend {
  status: TrendStatus;
  first_year?: number;
  peak_year?: number;
  peak_freq?: number;
  current_freq?: number;
  recent_avg?: number;
  early_avg?: number;
  change_pct?: number | null;
  decade_buckets?: number[];   // 22 values, 1800s through 2010s decade averages
}

let _cache: Record<string, WordTrend> | null = null;

function loadTrends(): Record<string, WordTrend> {
  if (_cache) return _cache;
  const p = path.join(process.cwd(), 'data', 'ngram-trends.json');
  if (!fs.existsSync(p)) {
    _cache = {};
    return _cache;
  }
  try {
    const raw = fs.readFileSync(p, 'utf-8');
    _cache = JSON.parse(raw);
  } catch {
    _cache = {};
  }
  return _cache!;
}

export function getWordTrend(slug: string): WordTrend | null {
  const all = loadTrends();
  return all[slug] ?? null;
}

export function getAllTrends(): Record<string, WordTrend> {
  return loadTrends();
}

export function trendCount(): number {
  return Object.keys(loadTrends()).length;
}

// ─── Layer 2 — slug-hash commentary helpers ───────────────────────────────

const STATUS_LABELS: Record<TrendStatus, string> = {
  'modern-coinage': 'Modern coinage',
  'victorian-peak': 'Victorian peak',
  'obsolete': 'Largely obsolete',
  'rising': 'Rising usage',
  'declining': 'Declining usage',
  'classic': 'Classic / stable',
  'stable': 'Stable usage',
  'no-data': 'No corpus data',
};

const STATUS_TONE: Record<TrendStatus, { bg: string; text: string; border: string }> = {
  'modern-coinage': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'victorian-peak': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'obsolete':       { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  'rising':         { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  'declining':      { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  'classic':        { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  'stable':         { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  'no-data':        { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
};

export function statusLabel(s: TrendStatus): string { return STATUS_LABELS[s]; }
export function statusTone(s: TrendStatus): { bg: string; text: string; border: string } { return STATUS_TONE[s]; }

export interface TrendCommentary {
  headline: string;
  fact: string;
  context: string;
  implication: string;
}

const HEADLINE_VARIANTS: Record<TrendStatus, string[]> = {
  'modern-coinage': [
    'A 20th-century word with no Victorian-era footprint',
    'Coined in living memory — and the Google Books record proves it',
    'Born after 1950: a word younger than most of its readers',
  ],
  'victorian-peak': [
    'Peak usage in the Victorian era — quieter today',
    'A word the 19th century used far more than we do',
    'Most popular when Dickens was writing, less so now',
  ],
  'obsolete': [
    'Once active in print, now rarely seen',
    'A word the corpus shows fading toward zero',
    'Mostly retired from contemporary writing',
  ],
  'rising': [
    'Climbing the frequency charts since 2000',
    'A word with measurable upward momentum',
    'Modern English is using this more, not less',
  ],
  'declining': [
    'Steadily losing ground in contemporary writing',
    'A word the data shows we use less every decade',
    'Falling out of fashion, but still alive in print',
  ],
  'classic': [
    'A core-vocabulary word that has barely moved in two centuries',
    'The kind of word every generation uses about the same way',
    'Anchored in English since before the 1800s',
  ],
  'stable': [
    'Holding steady across the historical record',
    'Usage hasn’t shifted dramatically in either direction',
    'A word that earns its keep in every era',
  ],
  'no-data': [
    'Below the Google Books NGram corpus signal floor',
    'Too rare in the printed record for trend analysis',
    'Outside the measurable range of the historical corpus',
  ],
};

function fmtPct(p: number | null | undefined): string {
  if (p == null || !Number.isFinite(p)) return 'data unavailable';
  if (Math.abs(p) < 5) return 'roughly flat';
  if (p > 0) return `up about ${Math.round(p)}%`;
  return `down about ${Math.round(Math.abs(p))}%`;
}

function decadesSpan(first?: number): string {
  if (!first) return 'across the modern record';
  const decades = Math.max(1, Math.floor((2019 - first) / 10));
  return `${decades} decade${decades === 1 ? '' : 's'} of printed evidence`;
}

function factVariants(slug: string, word: string, t: WordTrend): string[] {
  const peak: string | number = t.peak_year ?? '—';
  const first: string | number = t.first_year ?? '—';
  const firstNum: number | undefined = t.first_year;
  const change = fmtPct(t.change_pct);
  switch (t.status) {
    case 'modern-coinage':
      return [
        `"${word}" first appears in the Google Books corpus around ${first} — a 20th-century coinage with no meaningful 19th-century usage.`,
        `The earliest reliable print attestation of "${word}" sits near ${first}, classifying it as a modern-era word in the Google Books NGram record.`,
        `Across two centuries of printed English, "${word}" begins registering near ${first} — making it among the newer entries in the language.`,
      ];
    case 'victorian-peak':
      return [
        `Usage of "${word}" peaked around ${peak}, then drifted: 2000-2019 averages are ${change} versus its early-period baseline.`,
        `"${word}" reached its corpus high in ${peak}; the modern (2000-2019) decade reads ${change} of that earlier rate.`,
        `Peak printed frequency for "${word}" was around ${peak}. Current readings show 2000-2019 ${change} compared with the 1800s baseline.`,
      ];
    case 'obsolete':
      return [
        `Modern (2000-2019) frequency for "${word}" is below 5% of its historical peak in ${peak} — the corpus signal has nearly faded.`,
        `"${word}" peaked around ${peak} and has since fallen ${change}: contemporary writing rarely uses it.`,
        `The Google Books record shows "${word}" most active around ${peak}, with current usage tailing off into the noise floor.`,
      ];
    case 'rising':
      return [
        `2000-2019 usage of "${word}" averages ${change} versus its early-period baseline — measurable upward momentum.`,
        `"${word}" is on a clear climb: recent (2000-2019) frequency is ${change} from its earliest decade in the corpus.`,
        `The historical record shows "${word}" gaining ground: current usage is ${change} compared with its first-recorded decade.`,
      ];
    case 'declining':
      return [
        `2000-2019 usage of "${word}" averages ${change} versus the 1800s baseline — a measurable retreat in the printed record.`,
        `"${word}" shows clear downward drift: contemporary frequency is ${change} from its early-period peak (${peak}).`,
        `Once more common, "${word}" now reads ${change} compared with its earlier corpus baseline.`,
      ];
    case 'classic':
      return [
        `"${word}" is a pre-1850 entry that has held steady for ${decadesSpan(firstNum)} — the corpus shows little net movement.`,
        `Across two centuries of English print, "${word}" has barely shifted: 2000-2019 reads ${change} versus the 1800s baseline.`,
        `A long-anchored word: "${word}" first appears ${first ? `around ${first}` : 'pre-corpus'} and has stayed within typical bounds since.`,
      ];
    case 'stable':
      return [
        `Across ${decadesSpan(firstNum)}, the corpus shows "${word}" within typical year-over-year variance — neither rising nor falling decisively.`,
        `"${word}" has held a relatively steady position in the printed record: 2000-2019 reads ${change} versus its early-period baseline.`,
        `Usage of "${word}" oscillates within historical norms; no sustained trend in either direction.`,
      ];
    default:
      return [
        `"${word}" is too infrequent in the Google Books corpus for reliable trend analysis.`,
        `The historical NGram signal for "${word}" sits below our reporting threshold.`,
        `Too thin a print record to classify "${word}" by trend.`,
      ];
  }
}

function contextVariants(slug: string, word: string, t: WordTrend): string[] {
  switch (t.status) {
    case 'modern-coinage':
      return [
        `Words with first attestation after 1950 are typically tied to a specific cultural, scientific, or commercial event of the era. Tracking the rise from zero baseline often reveals the moment the word entered general use.`,
        `Late-20th-century coinages tend to follow a distinct pattern: rapid rise after a triggering event, then either consolidation into mainstream usage or fade-out within a decade or two.`,
        `For words that did not exist before 1950, the corpus offers a near-perfect record of their adoption curve — useful for learners trying to understand whether a word is "established" or "still novel."`,
      ];
    case 'victorian-peak':
      return [
        `Many Victorian-peak words reflect the moral, scientific, or industrial concerns of the 19th century. Their decline often signals a shift in social vocabulary rather than the loss of the underlying concept.`,
        `Words peaking 1850-1910 often have replacements that took over in the 20th century — same idea, newer label.`,
        `A Victorian peak does not mean obsolescence: many of these words remain readable today, just less common in casual writing than they were a century ago.`,
      ];
    case 'obsolete':
      return [
        `Words that have fallen below 5% of their historical peak rarely return to mainstream usage. They survive in specialized domains, archaic registers, and historical reading.`,
        `Obsolescence in the corpus is a useful filter for learners: a word in this bucket is more useful for reading older texts than for modern writing.`,
        `Many words in this bucket have been displaced by newer synonyms — the corpus shows the replacement decade if you compare related terms side-by-side.`,
      ];
    case 'rising':
      return [
        `Sustained upward trends 2000-2019 typically map to either (a) new technology vocabulary, (b) emergent cultural concepts, or (c) registers that grew alongside the internet (informal speech, social media, mental-health discourse).`,
        `Rising words are valuable for writers who want their prose to feel current — but the 2010s rise rate sometimes overstates how established a word feels in formal registers.`,
        `For ESL learners, rising-trend words are high-priority: they appear in news, social media, and casual professional writing more often than their corpus rank suggests.`,
      ];
    case 'declining':
      return [
        `Declining-trend words are still alive in print, just at lower volume than a century ago. They are often replaced by simpler, shorter, or more vivid alternatives.`,
        `For readers of older literature, declining-trend words are common pain points — their meaning is intact, but the cultural frequency has shifted.`,
        `Many declining-trend words remain perfectly correct in modern writing; they signal a more formal or older register rather than awkwardness.`,
      ];
    case 'classic':
      return [
        `Classic-stable words form the backbone of the language: pre-1850 attestation plus minimal net change since means they have survived every register, register-shift, and slang wave of the modern era.`,
        `These are the words that translate well across centuries — readable in 19th-century novels and contemporary writing without friction.`,
        `Classic words are the safest bets in formal prose: they carry no era-specific connotation and rarely sound "dated" or "trendy."`,
      ];
    case 'stable':
      return [
        `Stable words occupy the middle of the corpus — too active to be obsolete, too settled to count as rising or declining. They are the workhorses of contemporary written English.`,
        `For writers, stable words are reliable: they neither date your prose nor signal a particular era-bound register.`,
        `Stable trends often hide micro-cycles inside themselves (a 1920s dip, a 1980s bump, etc.) — the headline number masks the texture.`,
      ];
    default:
      return [
        `When the historical signal is too thin to classify, definitions and synonym data are the more reliable references — trend analysis adds little.`,
        `Below the corpus threshold, individual word usage is best inferred from contemporary sources and dictionary frequency labels rather than NGram data.`,
        `Words in this bucket may still be in regular use; they are simply too rare in the digitized print corpus to register a clean trend.`,
      ];
  }
}

function implicationVariants(slug: string, word: string, t: WordTrend): string[] {
  switch (t.status) {
    case 'modern-coinage':
      return [
        `Use this word freely in contemporary writing — it carries no archaic baggage. In formal academic prose, brace for the possibility that older readers will encounter it for the first time.`,
        `Safe in modern registers; verify acceptance in formal style guides if you are writing for older audiences who may not yet treat it as standard.`,
        `Modern coinages travel well in journalism, technology writing, and casual prose. They tend to look out of place in pre-1980 historical fiction or period dialogue.`,
      ];
    case 'victorian-peak':
      return [
        `Useful for reading 19th-century literature; in modern prose it can feel slightly formal or dated. Pick a contemporary synonym if you want a register-neutral feel.`,
        `Effective in deliberately literary or period-tinged writing; risky in journalism or marketing where registers tilt modern.`,
        `A Victorian-peak word can elevate prose deliberately — or unintentionally signal "old-fashioned." Use with awareness of audience.`,
      ];
    case 'obsolete':
      return [
        `Treat as a reading-only word for most modern contexts. If you do use it actively, expect to be the only person in the conversation who does.`,
        `Best reserved for historical reading or deliberately archaic style. Modern equivalents will read more naturally to almost any audience.`,
        `Recognise it in older texts, but reach for a current synonym in your own writing unless the archaic register is the point.`,
      ];
    case 'rising':
      return [
        `Adopt with confidence in contemporary writing — the data shows it is gaining mainstream acceptance. Watch for register: rising words sometimes carry casual or technology-tinged connotations.`,
        `A growing-frequency word is a low-risk addition to journalism, marketing, and informal professional writing. In academic prose, double-check whether the rise has reached scholarly registers yet.`,
        `Rising words are good vocabulary investments — they’re increasingly common, so practising recognition pays off across reading domains.`,
      ];
    case 'declining':
      return [
        `Still correct, just less common. If you want your writing to feel current, a more frequent synonym may serve better; if you want a slightly elevated register, a declining word can do useful work.`,
        `Use deliberately when you want a more traditional or formal register — the lower frequency is itself a stylistic signal.`,
        `Declining words remain perfectly readable; they simply carry less of the "of-our-time" feel that high-frequency contemporary words convey.`,
      ];
    case 'classic':
      return [
        `Safe in any register, any era, any audience. Classic-stable words are the safest vocabulary investment — they will read naturally in 50 years just as they did 50 years ago.`,
        `These words rarely cause friction. Use them as the foundation of clear prose; reach for the rising or rare alternatives only when the rhetorical effect is worth the extra reader effort.`,
        `Classic vocabulary is the backbone of accessible writing — it generalises across decades and registers more reliably than newer or rarer choices.`,
      ];
    case 'stable':
      return [
        `Use without concern for register fashion. Stable-trend words sit in the readable centre of contemporary English.`,
        `A solid choice for almost any audience. Stable words rarely date prose in either direction.`,
        `Reliable, ordinary, effective — stable words are the default register for writing that needs to age well.`,
      ];
    default:
      return [
        `Use the dictionary definition and modern usage examples on this page as the primary reference; trend data is unavailable for guidance.`,
        `The trend module cannot help here — lean on definition, level, and usage notes for your decision.`,
        `Without enough corpus signal, treat the word as you would any rare-vocabulary entry: useful for precision, sparingly for register.`,
      ];
  }
}

export function buildTrendCommentary(slug: string, word: string, t: WordTrend): TrendCommentary {
  return {
    headline: pickVariant(slug + ':h', HEADLINE_VARIANTS[t.status]),
    fact: pickVariant(slug + ':f', factVariants(slug, word, t)),
    context: pickVariant(slug + ':c', contextVariants(slug, word, t)),
    implication: pickVariant(slug + ':i', implicationVariants(slug, word, t)),
  };
}

// ─── Layer 3 — cluster page query helpers ───────────────────────────────

export const TREND_TYPES: TrendStatus[] = ['rising', 'declining', 'modern-coinage', 'victorian-peak', 'obsolete', 'classic', 'stable'];

export interface TrendListProfile {
  status: TrendStatus;
  title: string;
  metaTitle: string;
  metaDescription: string;
  blurb: string;
  hookHeadline: string;
  hook: string;
  outro: string;
}

export const TREND_PROFILES: Record<Exclude<TrendStatus, 'no-data'>, TrendListProfile> = {
  'rising': {
    status: 'rising',
    title: 'Rising English Words — Climbing the Google Books NGram Charts Since 2000',
    metaTitle: 'Rising English Words 2000-2019 — NGram Trend Top 25',
    metaDescription: 'The 25 most clearly rising English words by Google Books NGram 2000-2019 frequency vs. their 1800s baseline. Each card explains the trend and what it means for modern writing.',
    blurb: 'Words whose 2000-2019 corpus frequency averages at least 1.5× their early-period baseline — measurable, sustained upward momentum.',
    hookHeadline: 'What rising words tell us about contemporary English',
    hook: 'A word climbing the Google Books NGram chart 2000-2019 is doing one of three things: capturing a new technology, naming an emerging cultural concept, or filling a register that grew alongside the internet (informal speech, mental-health discourse, social-media voice). The 25 below are filtered to only the cleanest signals — words whose modern frequency is at least 1.5× the early-corpus baseline, with a positive trajectory across multiple decades.',
    outro: 'Rising words are high-yield vocabulary investments for active writers. They are increasingly common in journalism, casual professional writing, and online discourse — but you may still want to verify acceptance in formal academic prose before committing to one in a thesis or grant application. The dictionary entries linked below include the modern register notes plus pronunciation and usage detail.',
  },
  'declining': {
    status: 'declining',
    title: 'Declining English Words — Falling Out of Fashion in the Modern Corpus',
    metaTitle: 'Declining English Words 2000-2019 — NGram Trend Top 25',
    metaDescription: 'The 25 most clearly declining English words by Google Books NGram 2000-2019 frequency. Each entry shows how far the modern usage has fallen from its 19th-century peak.',
    blurb: 'Words whose 2000-2019 corpus frequency averages 50% or less of their early-period baseline — visible retreat in the printed record.',
    hookHeadline: 'Declining ≠ obsolete: still useful, just less common',
    hook: 'These words are alive and correct in modern English — just used less often than they were a century ago. The decline usually reflects a register shift (formal writing yielded to plainer style) or a competing newer synonym taking over (e.g. "automobile" → "car"). The 25 below are filtered to clean negative trajectories: 2000-2019 corpus frequency at half or less of the 1800s baseline.',
    outro: 'A declining-trend word is not a wrong choice — it is a register signal. Picking one over a more frequent synonym tells the reader the writing is leaning slightly traditional or formal. Read each entry’s commentary box to gauge how strongly the decline reads.',
  },
  'modern-coinage': {
    status: 'modern-coinage',
    title: 'Modern English Coinages — Words Born After 1950',
    metaTitle: 'Modern English Coinages — Words First Attested After 1950',
    metaDescription: 'The 25 keep-set English words whose first reliable attestation in the Google Books corpus falls after 1950 — born in living memory.',
    blurb: 'Words whose first non-zero appearance in the Google Books NGram corpus dates from 1950 or later — born in living memory.',
    hookHeadline: 'Coined in living memory — and the corpus shows it',
    hook: 'A modern coinage in this list is defined narrowly: the Google Books corpus shows essentially zero printed usage before 1950, then a non-trivial appearance after. These words usually map to mid-to-late-20th-century technology, social phenomena, or scientific developments — and their adoption curves are some of the cleanest signals in the entire historical record.',
    outro: 'Modern coinages are safe in current writing but can read out-of-place in pre-1980 period dialogue or fiction. Each entry below links to the full dictionary page with usage examples plus the NGram trend module showing the post-1950 emergence curve.',
  },
  'victorian-peak': {
    status: 'victorian-peak',
    title: 'Victorian-Peak Words — Most Popular 1850-1910, Quieter Today',
    metaTitle: 'Victorian-Peak English Words — Peak 1850-1910 in the Google Books Corpus',
    metaDescription: 'The 25 keep-set English words whose Google Books NGram frequency peaked 1850-1910 and now reads at less than 40% of that peak.',
    blurb: 'Words whose corpus frequency peaked 1850-1910 and now sits below 40% of that high-water mark — period-specific vocabulary still in active reading rotation.',
    hookHeadline: 'The 19th-century vocabulary that aged with the era',
    hook: 'Many Victorian-peak words reflect the moral, scientific, or industrial concerns of the 19th century — and their decline since usually signals that the underlying concept got renamed (e.g. "wireless" → "radio") rather than abandoned. Reading 19th-century literature is the highest-value use case for this bucket; you’ll meet these words constantly in Dickens, Eliot, Trollope, or the period’s scientific journals.',
    outro: 'Victorian-peak words remain perfectly readable today. They simply carry a slight formal-or-period flavour that some writers want and others don’t. The dictionary pages below include the full historical etymology plus modern usage notes.',
  },
  'obsolete': {
    status: 'obsolete',
    title: 'Largely Obsolete English Words — Below 5% of Their Historical Peak',
    metaTitle: 'Largely Obsolete English Words — Below 5% of Peak in the Google Books Corpus',
    metaDescription: 'The 25 keep-set English words whose modern (2000-2019) Google Books NGram frequency is below 5% of their historical peak — visible in the corpus, mostly retired from current writing.',
    blurb: 'Words whose modern (2000-2019) corpus frequency is below 5% of their pre-1980 peak — visible in the historical record, but largely retired from current writing.',
    hookHeadline: 'Words the corpus shows fading toward zero',
    hook: 'A word in this bucket is not gone from the language — it is gone from contemporary print at scale. You will still encounter it in historical fiction, in specialised registers, or in older non-fiction; you are unlikely to see it in modern journalism. The Google Books NGram timeseries makes the retirement visible: a clear peak before 1980 followed by a long decline to under 5% of that earlier rate.',
    outro: 'Reach for one of these only when the archaic register is the rhetorical point. For ordinary modern writing, the corpus is telling you a more frequent synonym is available. Each linked dictionary page suggests modern equivalents in its synonym list.',
  },
  'classic': {
    status: 'classic',
    title: 'Classic-Stable English Words — Two Centuries of Steady Usage',
    metaTitle: 'Classic-Stable English Words — Pre-1850, Steady Across the Corpus',
    metaDescription: 'The 25 keep-set English words first attested before 1850 whose Google Books NGram frequency has held within ±50% of baseline across the historical record.',
    blurb: 'Pre-1850 attested words whose corpus frequency has held within ±50% of baseline across two centuries of printed English.',
    hookHeadline: 'The vocabulary that earns its keep in every era',
    hook: 'Classic-stable words form the backbone of the language: they were active in 1820, active today, and have not undergone any dramatic register shift in between. These are the words that translate seamlessly across centuries of reading — Dickens, Hemingway, and contemporary journalism use them in roughly the same ways.',
    outro: 'Classic vocabulary is the safest possible writing investment: no era-specific connotation, no risk of dating prose. Use these as the structural backbone of clear writing; reach for rising or declining words only when the register signal is the point.',
  },
  'stable': {
    status: 'stable',
    title: 'Stable-Trend English Words — Holding Steady Across the Modern Record',
    metaTitle: 'Stable-Trend English Words — Within ±50% Across the Corpus',
    metaDescription: 'The 25 keep-set English words whose 2000-2019 Google Books NGram frequency reads within ±50% of their historical baseline — neither rising nor declining decisively.',
    blurb: 'Words whose modern (2000-2019) corpus frequency reads within ±50% of the historical baseline — no decisive direction in either direction.',
    hookHeadline: 'The reliable middle of the corpus',
    hook: 'Stable words are too active to be obsolete and too settled to count as rising or declining. They are the workhorses of contemporary written English — words you encounter constantly across genre and register without them ever drawing attention to themselves. The 25 below are filtered to the clearest examples of long-run stability: minimal net change across two centuries, modest year-over-year variance.',
    outro: 'Stable-trend words rarely date prose in either direction. They are reliable, ordinary, and effective — the default register for writing that needs to age well. The linked dictionary pages add definition, level, and usage detail.',
  },
};

export function getTrendProfile(s: TrendStatus): TrendListProfile | null {
  return (TREND_PROFILES as Record<string, TrendListProfile>)[s] ?? null;
}

export function getWordsByTrendStatus(status: TrendStatus, limit = 25): { slug: string; trend: WordTrend }[] {
  const all = loadTrends();
  const filtered = Object.entries(all)
    .filter(([_, t]) => t.status === status);

  // Sort by trend strength: for rising/declining use abs(change_pct), for others use peak_freq
  const sorted = filtered.sort(([_a, ta], [_b, tb]) => {
    if (status === 'rising' || status === 'declining') {
      return Math.abs(tb.change_pct ?? 0) - Math.abs(ta.change_pct ?? 0);
    }
    return (tb.peak_freq ?? 0) - (ta.peak_freq ?? 0);
  });

  return sorted.slice(0, limit).map(([slug, trend]) => ({ slug, trend }));
}

export function getTrendStatusCounts(): Record<TrendStatus, number> {
  const all = loadTrends();
  const out: Record<TrendStatus, number> = {
    'modern-coinage': 0, 'victorian-peak': 0, 'obsolete': 0,
    'rising': 0, 'declining': 0, 'classic': 0, 'stable': 0, 'no-data': 0,
  };
  for (const t of Object.values(all)) {
    out[t.status] = (out[t.status] ?? 0) + 1;
  }
  return out;
}
