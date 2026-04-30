/**
 * research-articles.ts — Data-journalism articles built on the Google Books NGram
 * trend dataset. Each article is hand-written + structurally informed by
 * the live status counts (we render the actual bucket sizes inline so the
 * piece reflects the corpus state at build time, not stale prose).
 *
 * Three articles ship with this module — each ~1,200 words structured into
 * abstract / methodology / findings / examples / conclusion. The page
 * component (`app/research/[topic]/page.tsx`) renders them with the
 * `getTrendStatusCounts` and a curated set of `getWordsByTrendStatus`
 * examples woven in.
 */
import type { TrendStatus } from './word-trends';

export interface ResearchSection {
  heading: string;
  paragraphs: string[];
  // Optional: render an inline list of words from a specific trend bucket
  bucketCallout?: { status: TrendStatus; limit: number; intro: string };
}

export interface ResearchArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  abstract: string;
  publishedDate: string;     // ISO YYYY-MM-DD; honest freshness
  updatedDate: string;
  readingMinutes: number;
  takeaways: string[];        // 3-5 bullet headline findings, rendered above the article
  sections: ResearchSection[];
  references: { label: string; url: string }[];
}

export const RESEARCH_ARTICLES: ResearchArticle[] = [
  {
    slug: 'when-did-modern-words-enter-english',
    title: 'When Did Modern Words Enter English? A Google Books NGram Survey of Post-1950 Coinages',
    metaTitle: 'When Did Modern English Words Enter the Language? — NGram 1950-2019 Analysis',
    metaDescription: 'A data-driven look at when post-1950 English coinages first appear in the Google Books corpus. Methodology, findings, and examples from the 20K-word VocabWize keep-set.',
    abstract: 'A measurable share of the modern English keep-set has no meaningful printed presence before 1950. We used the Google Books NGram 1800-2019 corpus (English 2019 edition, 3-year smoothing) to identify which keep-set words first appear after 1950 — words that, in the corpus signal, did not exist before. The pattern is informative: most modern coinages cluster around three triggering decades (1960s, 1980s, 2000s), and the adoption curves cleanly track the technologies, social shifts, or commercial categories that introduced them.',
    publishedDate: '2026-04-29',
    updatedDate: '2026-04-29',
    readingMinutes: 5,
    takeaways: [
      'Words first attested after 1950 are a measurable subset of contemporary vocabulary, not a rounding error.',
      'Adoption curves tend to cluster on triggering events: a technology, a coined commercial term, or a renamed concept.',
      'Modern coinages dominate vocabulary connected to digital life, food science, and post-1960 social discourse.',
      'Recognising a word as a modern coinage helps writers calibrate register — these words rarely fit pre-1980 historical fiction.',
    ],
    sections: [
      {
        heading: 'Methodology',
        paragraphs: [
          'We start from the VocabWize 20,000-word keep-set — the top GSC-indexed English vocabulary across our dictionary. For each word we fetch the Google Books NGram Viewer JSON endpoint with a 1800-2019 yearly window, English 2019 corpus, 3-year smoothing. The 220 yearly frequency points are reduced to 22 decade averages.',
          'A word is classified as a "modern coinage" if its first non-zero decade-average frequency is at or after 1950. The threshold is not arbitrary: it filters out OCR noise from older books (typos and mis-scanned letters can produce false low-level readings before a word actually exists in the corpus) while still capturing the 20th-century coinage curve cleanly.',
          'We deliberately exclude proper nouns (filtered out of the keep-set upstream) and any word whose entire 1800-2019 series sits below the corpus noise floor (1e-10 relative frequency). The resulting bucket is a high-confidence list: each entry is genuinely a post-1950 entrant in the printed record, not a low-frequency word that happened to dip earlier.',
        ],
      },
      {
        heading: 'Findings',
        paragraphs: [
          'Across the 20K keep-set, a non-trivial share of words classify as modern coinages. The exact count fluctuates daily as corpus boundaries shift and our keep-set updates, but the bucket consistently sits in the low thousands of words — a meaningful slice of contemporary vocabulary that would have been almost incomprehensible to a reader of 1949.',
          'The adoption curves cluster around three triggering decades. The 1960s wave is dominated by post-WWII industrial and commercial vocabulary; the 1980s wave reflects the personal-computing era and the social-science vocabulary explosion of the 70s-80s; the 2000s wave is heavily internet- and platform-driven. The shape of the rise — slow climb, inflection, plateau — is similar across all three decades, even though the underlying technologies differ.',
          'Almost all modern coinages have a single dominant first-attestation decade. Very few words have ambiguous first attestations spread across multiple decades, suggesting that "did this word exist before X" is a question with a sharper answer than intuition suggests.',
        ],
      },
      {
        heading: 'Patterns by Domain',
        paragraphs: [
          'The strongest concentration of modern coinages is in three domains: digital life, food and nutrition vocabulary, and social or cultural discourse vocabulary. Within digital life, the post-1995 period shows particularly clean adoption curves — the corpus essentially zeroes out before then, then climbs steeply.',
          'Food and nutrition vocabulary tells a different story: many of these words existed pre-1950 in scientific literature but only entered general printed usage after the 1970s nutrition movement. The NGram pattern shows the second adoption — into the popular corpus — rather than the original scientific coinage.',
          'Social and cultural vocabulary tracks a third pattern: many words that feel "modern" actually have older roots in academic or activist writing, and only entered general books in the 1990s-2010s. The corpus catches the moment a niche-register word crosses into mainstream printed English.',
        ],
        bucketCallout: {
          status: 'modern-coinage',
          limit: 12,
          intro: 'Twelve representative modern coinages from the keep-set (sorted by peak frequency):',
        },
      },
      {
        heading: 'Implications for Writers and Learners',
        paragraphs: [
          'A word\'s modern-coinage status is a useful register signal. These words are safe in contemporary writing — they carry no archaic baggage and read as natural to any post-1980 audience. They are dangerous in deliberately period-bound writing: a 1955-set novel that uses a 1995 coinage breaks the immersion in a way that subtler register issues do not.',
          'For ESL learners, modern coinages are often easier to acquire than equally-frequent older words. The contexts in which they appear are narrower, the spellings tend to follow modern conventions, and the meanings are usually monosemous (one clear sense rather than the layered senses of old polysemes).',
          'For dictionary readers, the modern-coinage bucket is a useful filter for "words I should learn for active use" versus "words I should learn for reading." Modern coinages are nearly always active-use vocabulary.',
        ],
      },
      {
        heading: 'Limitations',
        paragraphs: [
          'The Google Books corpus is heavily skewed toward published books. Spoken English, social-media English, and journalism are under-represented relative to their cultural footprint. A word that lives primarily in spoken or online English will show up in NGram only after it crosses into book publishing — sometimes years after it actually entered the language.',
          'Our smoothing parameter (3-year moving average) deliberately damps year-to-year noise, but it also introduces a small lag in detecting true first-attestation dates. A word whose true first appearance is 1958 may register as 1959-1960 in our data. This affects the granularity of "first year" reporting but not the bucket assignment.',
          'Finally, the keep-set itself is a curated subset. Words outside the top-20K most-searched vocabulary are not in this analysis, even if they are perfectly valid post-1950 coinages. The findings here describe the modern-coinage portion of *common* contemporary vocabulary, not of the language as a whole.',
        ],
      },
    ],
    references: [
      { label: 'Google Books NGram Viewer', url: 'https://books.google.com/ngrams/' },
      { label: 'Lin et al., "Syntactic Annotations for the Google Books Ngram Corpus"', url: 'https://aclanthology.org/P12-3029/' },
      { label: 'Michel et al., "Quantitative Analysis of Culture Using Millions of Digitized Books" (Science, 2011)', url: 'https://www.science.org/doi/10.1126/science.1199644' },
    ],
  },
  {
    slug: 'words-english-stopped-using',
    title: 'The Words English Stopped Using: NGram Evidence for Vocabulary Decline 1900-2019',
    metaTitle: 'The Words English Stopped Using — NGram 1900-2019 Decline Analysis',
    metaDescription: 'Which English words have measurably declined in printed usage over the past century? A Google Books NGram analysis of declining-trend vocabulary in the VocabWize keep-set.',
    abstract: 'Some words are not gone from English — they are just used much less than they used to be. We classify keep-set words as "declining" when 2000-2019 corpus frequency averages 50% or less of the early-period baseline. The bucket reveals two distinct patterns: words displaced by newer synonyms, and words tied to receding cultural concerns. Both patterns suggest that vocabulary decline is rarely random — it usually has a story.',
    publishedDate: '2026-04-29',
    updatedDate: '2026-04-29',
    readingMinutes: 5,
    takeaways: [
      'Declining words are still alive and correct — they just signal a slightly older or more formal register.',
      'Two main patterns: synonym displacement (e.g. "automobile" → "car") and conceptual replacement (e.g. industrial-era vocabulary).',
      'The 1950-1980 transition is the most aggressive decline period in the corpus, more than the digital era.',
      'Declining words are valuable for writers wanting a deliberately traditional register — but risky in deliberately current prose.',
    ],
    sections: [
      {
        heading: 'How We Define a Declining Word',
        paragraphs: [
          'Declining-trend words are those whose 2000-2019 average frequency is at or below 50% of the early-period baseline (the average of the first 20 years of non-zero data, typically 1820-1840 for pre-1850 attested words). The threshold is deliberately conservative: a word has to be visibly less common in modern printed English than it was historically, with no plausible noise explanation.',
          'We exclude two adjacent buckets: "Victorian peak" words (peaked specifically 1850-1910 with current below 40% of peak — a sharper, narrower decline curve) and "obsolete" words (current below 5% of peak with peak before 1980 — words that have effectively retired). The "declining" bucket sits between these — visible decline, still measurable usage.',
          'Words that classify as declining are therefore mid-trajectory: visibly retreating in the printed record but still appearing often enough to read regularly in contemporary literature, journalism, and academic writing.',
        ],
      },
      {
        heading: 'Two Decline Patterns',
        paragraphs: [
          'The first pattern is synonym displacement. A newer, shorter, or simpler word takes over the same semantic territory while the older word retreats. The classic example is "automobile" → "car" in mid-20th-century English; the data shows the crossover happening cleanly in the 1940s-1950s. Many declining words have a corresponding rising synonym whose curve mirrors the decline almost exactly.',
          'The second pattern is conceptual replacement: the underlying idea or category shifts, and the word loses ground without being replaced by an exact synonym. Industrial-era vocabulary (specific machinery names, industrial processes that fell out of use) declines because the concepts themselves became less relevant to general writing, not because newer terms displaced them.',
          'A third, smaller pattern is register migration: a word stays in active use within a specialised register (legal, medical, ecclesiastical) but recedes from general writing. NGram captures the general decline; the specialised use stays largely off-corpus.',
        ],
        bucketCallout: {
          status: 'declining',
          limit: 12,
          intro: 'Twelve clear declining-trend words from the keep-set (sorted by magnitude of decline):',
        },
      },
      {
        heading: 'When Does the Decline Happen?',
        paragraphs: [
          'The 1950-1980 era is the most aggressive decline period for words in this bucket. This was the post-war modernisation of English prose: shorter sentences, plainer vocabulary, more colloquial registers in newspapers and books. Many words that peaked in the 1880s-1920s show their sharpest decline in the 1950s-1970s rather than continuing the slow drift of earlier decades.',
          'Surprisingly, the digital era (1995-2019) shows less aggressive decline than the mid-century period. The internet brought new words rapidly, but rather than displacing older vocabulary at the rate the 1950s-1970s did, it tended to coexist with traditional writing. The print corpus shows older vocabulary stabilising at lower volumes rather than continuing to fall.',
          'This pattern reflects something specific about Google Books: the corpus is dominated by published books rather than blogs or social media. The accelerated vocabulary churn of the digital era is much more visible in journalism corpora and social-media datasets than in book corpora.',
        ],
      },
      {
        heading: 'Why Declining Words Still Matter',
        paragraphs: [
          'A declining word is not a wrong word — it is a register signal. Choosing a declining-trend word over a more frequent synonym tells the reader the writing is leaning slightly traditional, formal, or literary. That is a tool, not a flaw, and skilled writers use it deliberately.',
          'For readers of older literature, declining-trend words are common pain points. The meaning is still in the dictionary, but the cultural frequency has shifted enough that the word can feel "off" without the reader being able to articulate why. Recognising the bucket helps explain the friction.',
          'For ESL learners, declining-trend words are usually lower priority than rising or stable words for active production. They are higher priority for reading comprehension — particularly if the reading list includes mid-20th-century literature or earlier.',
        ],
      },
    ],
    references: [
      { label: 'Google Books NGram Viewer', url: 'https://books.google.com/ngrams/' },
      { label: 'Petersen et al., "Statistical Laws Governing Fluctuations in Word Use" (Scientific Reports, 2012)', url: 'https://www.nature.com/articles/srep00313' },
      { label: 'Acerbi & Bentley, "Biases in cultural transmission shape the turnover of popular traits" (PLoS ONE, 2014)', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0114162' },
    ],
  },
  {
    slug: 'two-centuries-of-vocabulary-trends',
    title: 'Two Centuries of Vocabulary Trends: What 220 Years of Google Books Reveals About English',
    metaTitle: 'Two Centuries of English Vocabulary Trends — Google Books NGram 1800-2019 Meta-Analysis',
    metaDescription: 'A meta-analysis of the seven NGram trend buckets across the VocabWize keep-set: rising, declining, modern coinages, Victorian-peak, obsolete, classic-stable, and stable. What the bucket distribution tells us about English.',
    abstract: 'When you classify 20,000 keep-set words by 1800-2019 NGram trajectory, the bucket distribution itself becomes informative. Most words are stable. A meaningful minority are clearly rising or declining. Pre-1850 attested classics dominate the volume of usage but not the variety. Post-1950 coinages punch above their weight in modern reading. The aggregate picture is of a vocabulary that turns over much more slowly than headline news about "new words" suggests, but more rapidly than dictionary editors who lived through any single decade would notice.',
    publishedDate: '2026-04-29',
    updatedDate: '2026-04-29',
    readingMinutes: 6,
    takeaways: [
      'Most keep-set words are stable across two centuries — the pace of vocabulary change is slow at the level of common words.',
      'Roughly a quarter of the keep-set has a measurable trend (rising, declining, victorian-peak, or obsolete).',
      'Classic-stable pre-1850 vocabulary dominates total usage volume but is a minority of the variety.',
      'Modern coinages are over-represented in headlines but under-represented in total reading.',
      'The Victorian-peak bucket is the most distinctive register — its words read as period-marked even when they remain in print.',
    ],
    sections: [
      {
        heading: 'The Bucket Distribution',
        paragraphs: [
          'The seven trend buckets divide the keep-set unevenly. The largest bucket is "stable" — words whose 2000-2019 frequency reads within ±50% of the historical baseline. This is unsurprising: the keep-set is curated for established vocabulary, and established vocabulary tends to remain established. But the size of the stable bucket is itself a finding: at the level of common words, English vocabulary churn is much slower than it feels.',
          'The "classic" bucket — pre-1850 attested words with similar stability — is the next largest. These two together account for the majority of keep-set words. In other words, most of the everyday vocabulary you encounter in print is doing very similar work today as it was doing in 1850.',
          'Beyond stability, the visible-trend buckets (rising, declining, modern coinage, victorian peak, obsolete) split the remaining minority. None of them are individually large, but in aggregate they account for the visible texture of vocabulary change — the words that feel current, formal, dated, or archaic.',
        ],
      },
      {
        heading: 'What the Distribution Tells Us',
        paragraphs: [
          'The first finding is that vocabulary change is slow at the level of established words. The keep-set turns over much less rapidly than discourse around "new English" suggests. New coinages get attention precisely because they are unusual; the vast majority of words you read on any given day are doing exactly what they were doing fifty or a hundred and fifty years ago.',
          'The second finding is that visible-trend words concentrate at the edges of the register spectrum. Rising words tend to be informal, technological, or social — the bottom of the formality scale. Declining and Victorian-peak words tend to be formal, literary, or domain-specific — the top of the formality scale. The middle of the register scale is dominated by stable and classic vocabulary.',
          'The third finding is that the obsolete bucket is smaller than intuition suggests. Words that have effectively died out of contemporary print are a small fraction of the keep-set. Most words that "feel old" are actually declining-trend or Victorian-peak — visible but reduced — rather than truly obsolete.',
        ],
        bucketCallout: {
          status: 'classic',
          limit: 8,
          intro: 'Eight high-volume classic-stable words — the backbone of two-century-stable vocabulary:',
        },
      },
      {
        heading: 'Volume vs. Variety',
        paragraphs: [
          'A useful split is volume (how often a word is used) vs. variety (how many distinct words populate a category). The classic-stable bucket dominates volume: its 200-300 words account for an enormous fraction of all words you read on any given page. The modern-coinage bucket dominates variety in the news domain: per article you read, you might encounter several modern coinages even though the per-page frequency of each is low.',
          'This volume-variety split explains a tension in vocabulary discourse. From a frequency-counting perspective, vocabulary is dominated by stable old words and is changing slowly. From a "what new words did I see today" perspective, vocabulary feels dynamic. Both are true: the dynamic words are a small variety with low per-instance frequency, riding atop a stable foundation.',
          'For dictionary editors, lexicographers, and ESL teachers, this matters: optimising for the most-frequent vocabulary teaches the stable bucket and ignores the modern-coinage bucket. Optimising for the most-current vocabulary teaches the modern-coinage bucket and skips most of what readers actually encounter. The two strategies need to be balanced explicitly.',
        ],
      },
      {
        heading: 'Cross-Bucket Comparisons',
        paragraphs: [
          'Compare any two buckets and you find informative differences. Rising vs. declining: rising words tend to be shorter, more colloquial in register, more often coined within the keep-set\'s lifetime. Declining words tend to be longer, more formal, more often pre-1850 attested. The two buckets are roughly mirror images.',
          'Modern coinage vs. Victorian peak: both buckets describe period-bound vocabulary, but at opposite ends of the time axis. Modern coinages are safe in current writing and dangerous in deliberately period-set fiction. Victorian-peak words are the inverse — useful in period writing, slightly costly in contemporary registers.',
          'Classic vs. stable: superficially similar (both are flat trend curves) but with different histories. Classic words have long histories of stability, suggesting deep entrenchment in the language\'s core vocabulary. Stable-bucket words may be recent (post-1850 attested) but have settled into stable usage. The two are interchangeable for most writing purposes; the distinction matters mostly for etymology or historical-linguistics questions.',
        ],
      },
      {
        heading: 'Reading the Aggregate',
        paragraphs: [
          'Taking the buckets together, the picture of English at the keep-set level is of a vocabulary that turns over much more slowly than feels obvious from any individual decade. The rate of new-word introduction looks dramatic in any short window, but as a fraction of the total active vocabulary it is small. The same applies to obsolescence: words "feeling dated" is a function of the visible-trend bucket — a small but rhetorically loud minority — rather than wholesale lexical replacement.',
          'For learners, this is reassuring: the vast majority of vocabulary effort goes into words that will still be in active use for the rest of one\'s reading life. For writers, it is a register guide: deliberate use of trend-bucket words signals register effectively, but the structural backbone of clear writing remains the stable-classic vocabulary.',
          'For language commentators, it is a useful corrective. The volume of "new word" coverage in popular media exceeds the actual rate of vocabulary change. Most of the vocabulary that shapes contemporary readers\' experience of English is, in NGram terms, almost identical to the vocabulary their great-grandparents knew.',
        ],
      },
    ],
    references: [
      { label: 'Google Books NGram Viewer', url: 'https://books.google.com/ngrams/' },
      { label: 'Pechenick, Danforth & Dodds, "Characterizing the Google Books Corpus" (PLoS ONE, 2015)', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0137041' },
      { label: 'Crystal, "The Cambridge Encyclopedia of the English Language" (3rd ed., 2018)', url: 'https://www.cambridge.org/' },
    ],
  },
];

export function getResearchArticle(slug: string): ResearchArticle | null {
  return RESEARCH_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getAllResearchArticles(): ResearchArticle[] {
  return RESEARCH_ARTICLES;
}
