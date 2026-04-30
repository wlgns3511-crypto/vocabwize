import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getTopWords, getTopComparisons, getSimilarWords, getPopularWords, getRandomWords, getMaxFrequency, getWordsBySamePOS, getWordsBySameLevel, getFrequencyPercentile, getWordCountByLevel, getWordCountByPOS, getTranslations } from "@/lib/db";
import wordKeepList from "@/lib/generated/word-keep.json";
import compareKeepList from "@/lib/generated/compare-keep.json";
import { breadcrumbSchema, faqSchema, definedTermSchema } from "@/lib/schema";
import { AdSlot } from "@/components/AdSlot";
import { DataFeedback } from "@/components/DataFeedback";
import { AuthorBox } from "@/components/AuthorBox";
import { EmbedButton } from "@/components/EmbedButton";
import { FrequencyMeter } from "@/components/FrequencyMeter";
import { FreshnessTag } from "@/components/FreshnessTag";
import { EditorNote } from "@/components/EditorNote";
import { DidYouKnow } from "@/components/DidYouKnow";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { CrossSiteLinks } from "@/components/CrossSiteLinks";
import { FeedbackButton } from "@/components/FeedbackButton";
import { RelatedEntities } from "@/components/upgrades/RelatedEntities";
import { InsightCards } from "@/components/InsightCards";
import { TranslationLinks } from "@/components/TranslationLinks";
import { WordLevelChecker } from "@/components/tools/WordLevelChecker";
import { AnswerHero } from "@/components/upgrades/AnswerHero";
import { TrustBlock } from "@/components/upgrades/TrustBlock";
import { InsightBlock } from "@/components/upgrades/InsightBlock";
import { DecisionNext } from "@/components/upgrades/DecisionNext";
import { generateInsights } from "@/lib/insights";
import { generateWordFaqs } from "@/lib/auto-faqs";
import { TableOfContents } from "@/components/upgrades/TableOfContents";
import { WordFrequencyTrend } from "@/components/WordFrequencyTrend";
import { getWordTrend, buildTrendCommentary } from "@/lib/word-trends";

interface Props { params: Promise<{ slug: string }> }

// HCU 2026-04-24: keep-set = top-100 by popularity + GSC evidence union
// (10 URLs earning ≥1 click in 28d window that the 100-cap would drop).
// Single source of truth lives in scripts/build-keep-sets.ts output.
const ALLOWED_COMPARISON_SLUGS = new Set(compareKeepList as string[]);

function parseJson(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

const levelColors: Record<string, string> = {
  basic: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-orange-100 text-orange-700",
  academic: "bg-purple-100 text-purple-700",
};

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  // HCU 2026-04-24: top-20K by frequency + 10 GSC evidence (8 of which fall
  // outside the 20K by frequency rank — vixen 24262, xvx 46051 etc.).
  // Single source of truth = scripts/build-keep-sets.ts output.
  return (wordKeepList as string[]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) return {};
  const defsCount = w.definition.split(';').map(d => d.trim()).filter(Boolean).length;
  const exCount = (() => { try { return w.examples ? (JSON.parse(w.examples) as unknown[]).length : 0; } catch { return 0; } })();
  const synCount = (() => { try { return w.synonyms ? (JSON.parse(w.synonyms) as unknown[]).length : 0; } catch { return 0; } })();
  const firstDef = w.definition.split(';')[0].trim().slice(0, 60);
  const pos = w.pos || '';
  const title = `${w.word}: ${defsCount} definitions, ${pos}, ${exCount} examples, ${synCount} synonyms`;
  const description = `${w.word} (${pos}) — ${firstDef}. Definitions: ${defsCount}. Examples: ${exCount}. Synonyms: ${synCount}. Level: ${w.level || 'standard'}. English dictionary.`;
  return {
    title,
    description,
    openGraph: { url: `/word/${slug}/` },
    alternates: {
      canonical: `/word/${slug}/`,
      languages: (() => {
        const t = getTranslations(slug);
        const langs: Record<string, string> = {
          'en': `https://vocabwize.com/word/${slug}/`,
          'x-default': `https://vocabwize.com/word/${slug}/`,
        };
        if (t?.fr) langs['fr'] = t.fr.url;
        if (t?.de) langs['de'] = t.de.url;
        if (t?.pt) langs['pt'] = t.pt.url;
        if (t?.ar) langs['ar'] = t.ar.url;
        if (t?.ja) langs['ja'] = t.ja.url;
        return langs;
      })(),
    },
  };
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) notFound();

  const similar = getSimilarWords(slug, 12);
  const translations = getTranslations(slug);
  const defs = w.definition.split(';').map(d => d.trim()).filter(Boolean);
  const examples = parseJson(w.examples);
  const synonyms = parseJson(w.synonyms);
  const antonyms = parseJson(w.antonyms);
  const maxFreq = getMaxFrequency();
  const frequencyPercentile = w.frequency > 0 ? getFrequencyPercentile(w.frequency) : 50;
  const levelCount = w.level ? getWordCountByLevel(w.level) : 0;
  const posCount = w.pos ? getWordCountByPOS(w.pos) : 0;
  const compareTargetSlug = synonyms[0]?.toLowerCase().replace(/\s+/g, "-") ?? null;
  const compareTargetPair = compareTargetSlug ? [slug, compareTargetSlug].sort().join("-vs-") : null;
  const canShowCompareCard = compareTargetPair ? ALLOWED_COMPARISON_SLUGS.has(compareTargetPair) : false;

  const faqs = generateWordFaqs(w);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: w.word[0].toUpperCase(), url: `/letter/${w.word[0].toLowerCase()}/` },
    { name: w.word, url: `/word/${slug}/` },
  ];

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        {breadcrumbs.map((b, i) => (<span key={i}>{i > 0 && " / "}{i < 2 ? <a href={b.url} className="hover:underline">{b.name}</a> : <span className="text-slate-800">{b.name}</span>}</span>))}
      </nav>

      <AnswerHero
        title={w.word}
        subtitle={w.phonetic ? `/${w.phonetic}/` : null}
        tagline={(w.definition.split(";")[0] || w.definition).trim()}
        badges={[
          ...(w.pos ? [{ label: w.pos, tone: "indigo" as const }] : []),
          ...(w.level
            ? [{ label: w.level.charAt(0).toUpperCase() + w.level.slice(1), tone: "slate" as const }]
            : []),
        ]}
        alternatives={similar.slice(0, 3).map((alt) => ({
          label: alt.word,
          href: `/word/${alt.slug}/`,
          sublabel: alt.pos || undefined,
        }))}
      />

      <TrustBlock
        sources={[
          { name: "ECDICT", url: "https://github.com/skywind3000/ECDICT" },
          { name: "BNC Corpus", url: "https://www.natcorp.ox.ac.uk/" },
          { name: "COCA", url: "https://www.english-corpora.org/coca/" },
          { name: "Wiktionary", url: "https://en.wiktionary.org/wiki/" + encodeURIComponent(w.word) },
          { name: "Merriam-Webster", url: "https://www.merriam-webster.com/dictionary/" + encodeURIComponent(w.word) },
        ]}
        updated="Latest corpus review"
      />

      <InsightBlock
        entityName={w.word}
        insights={generateInsights({
          word: w.word,
          frequency: w.frequency,
          level: w.level,
          pos: w.pos,
          etymology: w.etymology,
          usage_note: w.usage_note,
          synonymCount: synonyms.length,
          antonymCount: antonyms.length,
          frequencyPercentile,
        })}
      />

      <TableOfContents />

      {/* Legacy level pill kept as accessible anchor */}
      {w.level && (
        <p className="sr-only">
          <span className={levelColors[w.level] || ""}>{w.level}</span>
        </p>
      )}

      <EditorNote note={
        w.level === "academic" ? `"${w.word}" is in the top tier of academic vocabulary — commonly tested on GRE, TOEFL, and IELTS.` :
        w.level === "advanced" ? `"${w.word}" is an advanced word — mastering it will elevate your writing and speaking.` :
        w.frequency && w.frequency > 0 && w.frequency <= 5000 ? `"${w.word}" ranks in the top ${Math.max(1, 100 - getFrequencyPercentile(w.frequency))}% by usage frequency.` :
        `"${w.word}" is a commonly used English word${w.pos ? ` (${w.pos})` : ""} worth adding to your active vocabulary.`
      } />

      <FrequencyMeter frequency={w.frequency} maxFrequency={maxFreq} />

      <WordLevelChecker word={w.word} frequency={w.frequency} pos={w.pos} level={w.level} />

      {/* Google Books NGram 1800-2019 historical trend (Layer 1++ unique data) */}
      {(() => {
        const trend = getWordTrend(slug);
        if (!trend || trend.status === 'no-data') return null;
        return (
          <WordFrequencyTrend
            trend={trend}
            commentary={buildTrendCommentary(slug, w.word, trend)}
            word={w.word}
          />
        );
      })()}

      {/* Word Insights */}
      <section className="bg-blue-50 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold mb-2">Word Insights</h2>
        <ul className="space-y-1 text-sm text-slate-700">
          {w.frequency && maxFreq > 0 && <li>This word ranks in the <strong>top {Math.max(1, Math.round((w.frequency / maxFreq) * 100))}%</strong> of most frequently used English words.</li>}
          {w.word.length < 5 && <li>At <strong>{w.word.length} letters</strong>, this is a relatively short word — easy to remember and commonly used in everyday speech.</li>}
          {w.word.length >= 5 && w.word.length <= 8 && <li>At <strong>{w.word.length} letters</strong>, this is an average-length word commonly found in both casual and formal writing.</li>}
          {w.word.length > 8 && <li>At <strong>{w.word.length} letters</strong>, this is a longer word — often used in academic or formal contexts.</li>}
          {w.level === 'basic' && <li>This is a <strong>basic-level</strong> word — essential for everyday communication.</li>}
          {w.level === 'intermediate' && <li>This is an <strong>intermediate-level</strong> word — commonly encountered in news articles and professional communication.</li>}
          {w.level === 'advanced' && <li>This is an <strong>advanced-level</strong> word — typically found in academic texts, literature, or specialized fields.</li>}
          {w.level === 'academic' && <li>This is an <strong>academic-level</strong> word — used primarily in scholarly writing and research.</li>}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Definition</h2>
        <div className="bg-indigo-50 rounded-lg p-6">
          {defs.length > 1 ? (
            <ol className="list-decimal list-inside space-y-2">
              {defs.map((d, i) => (<li key={i} className="text-slate-700">{d}</li>))}
            </ol>
          ) : (
            <p className="text-slate-700">{w.definition}</p>
          )}
        </div>
      </section>

      {/* Why this word matters — US learner context */}
      <section className="mb-8" data-upgrade="why-it-matters">
        <h2 className="text-xl font-bold mb-3">Why &ldquo;{w.word}&rdquo; matters</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-700 leading-relaxed space-y-3">
          {(() => {
            const isShort = w.word.length <= 5;
            const isLong = w.word.length >= 10;
            const highFreq = frequencyPercentile >= 80;
            const midFreq = frequencyPercentile >= 40 && frequencyPercentile < 80;

            // Level-driven primary framing (US context)
            const primary =
              w.level === "basic"
                ? `In American English, "${w.word}" is core everyday vocabulary. You will hear it in casual conversation, see it in emails and news headlines, and meet it on standardized tests like the ACT and TOEFL. Students building a foundation in English should be comfortable using it actively, not just recognizing it.`
                : w.level === "intermediate"
                ? `"${w.word}" sits in the mid-tier of English usage — comfortable in news articles, business writing, and classroom discussion. U.S. middle-school and high-school readers encounter it regularly, and it frequently appears on the SAT and ACT verbal sections as part of tested vocabulary.`
                : w.level === "advanced"
                ? `"${w.word}" is a college-level word in the United States. It turns up on SAT/ACT reading passages, AP-level writing, and editorial journalism. Using it correctly in an essay or cover letter signals a strong command of written English.`
                : w.level === "academic"
                ? `"${w.word}" is an academic register word, the kind found on the Academic Word List used to build GRE, GMAT, and TOEFL preparation material. Expect to see it in scholarly articles, legal briefs, and technical reports rather than casual speech.`
                : `"${w.word}" appears across contemporary American English at a level that makes it worth knowing for both reading comprehension and careful writing.`;

            // Frequency context (secondary, US-framed)
            const freqContext = highFreq
              ? `Its high corpus frequency means you will actually run into it — not a word you can afford to skim past.`
              : midFreq
              ? `It is common enough that you will meet it regularly, but uncommon enough that recognizing it on a test or in a professional setting carries weight.`
              : `Because it is rarer, misusing it is more visible than misusing a common word — worth learning the nuances before relying on it in writing.`;

            // POS context
            const posContext =
              w.pos === "noun"
                ? `As a noun, pay attention to whether it is countable (takes "a/an") or uncountable, and to the adjectives that typically appear alongside it.`
                : w.pos === "verb"
                ? `As a verb, the thing to watch is which prepositions it takes and whether its meaning shifts between literal and figurative uses.`
                : w.pos === "adjective"
                ? `As an adjective, note its register — some adjectives with similar meanings sound natural in speech, others only in writing.`
                : w.pos === "adverb"
                ? `As an adverb, consider where it sits in the sentence — English adverb position changes emphasis.`
                : null;

            // Length-based study tip
            const studyTip = isLong
              ? `At ${w.word.length} letters, "${w.word}" is easier to spell and remember if you break it into recognizable roots or syllables.`
              : isShort
              ? `Although "${w.word}" is only ${w.word.length} letters, short English words often carry multiple senses — check the examples below to see which one applies in your context.`
              : null;

            return (
              <>
                <p>{primary}</p>
                <p>{freqContext}</p>
                {posContext && <p>{posContext}</p>}
                {studyTip && <p className="text-sm text-slate-500">{studyTip}</p>}
              </>
            );
          })()}
        </div>
      </section>

      <DidYouKnow fact={
        w.etymology ? `The word "${w.word}" has roots in ${w.etymology.split('.')[0].replace(/^From\s+/i, '')}.` :
        synonyms.length > 3 ? `"${w.word}" has ${synonyms.length} synonyms — versatile words like this appear in the top 10% of English vocabulary.` :
        `"${w.word}" has ${w.word.length} letters and ${w.word.split(/[aeiou]/i).length - 1} vowel groups — ${w.word.length > 8 ? "longer words tend to be more specific in meaning" : "short words tend to be among the most frequently used"}.`
      } />

      {translations && <TranslationLinks word={w.word} translations={translations} color="indigo" />}

      <AdSlot id="word-after-def" />

      <InsightCards
        word={w.word}
        frequency={w.frequency}
        frequencyPercentile={frequencyPercentile}
        level={w.level}
        levelCount={levelCount}
        pos={w.pos}
        posCount={posCount}
        synonymCount={synonyms.length}
        antonymCount={antonyms.length}
      />

      {examples.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Examples</h2>
          <div className="space-y-3">
            {examples.map((ex, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-indigo-400 font-mono text-sm mt-0.5">{i + 1}.</span>
                <p className="text-slate-700 italic">&ldquo;{ex}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>
      )}


      {w.etymology && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Etymology</h2>
          <div className="bg-amber-50 border-l-4 border-amber-300 p-4 rounded-r-lg">
            <p className="text-slate-700">{w.etymology}</p>
          </div>
        </section>
      )}

      {(synonyms.length > 0 || antonyms.length > 0) && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Synonyms & Antonyms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {synonyms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-600 mb-2">Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {synonyms.map((s, i) => (
                    <a key={i} href={`/word/${s.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {antonyms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-600 mb-2">Antonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {antonyms.map((a, i) => (
                    <a key={i} href={`/word/${a.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm hover:bg-red-100 transition-colors">
                      {a}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {w.usage_note && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Usage Tips</h2>
          <div className="bg-sky-50 border-l-4 border-sky-300 p-4 rounded-r-lg">
            <p className="text-slate-700">{w.usage_note}</p>
          </div>
        </section>
      )}

      <div className="flex gap-3 mb-8">
        <a href={`/rhymes/${slug}`} className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm">
          Words that rhyme with {w.word}
        </a>
        <a href={`/words-length/${w.word.length}`} className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm">
          {w.word.length}-letter words
        </a>
      </div>

      <AdSlot id="word-before-related" />

      {similar.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Related Words</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {similar.map((s) => {
              const [a, b] = [slug, s.slug].sort();
              return (
                <div key={s.slug} className="p-3 border border-slate-200 rounded-lg">
                  <a href={`/word/${s.slug}`} className="font-medium text-indigo-600 hover:underline">{s.word}</a>
                  <div className="mt-1"><a href={`/word/${b}/`} className="text-xs text-slate-400 hover:underline">Compare</a></div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Synonym/Antonym comparisons */}
      {(() => {
        const syns: string[] = w.synonyms ? (() => { try { return JSON.parse(w.synonyms); } catch { return []; } })() : [];
        const ants: string[] = w.antonyms ? (() => { try { return JSON.parse(w.antonyms); } catch { return []; } })() : [];
        const popular = getPopularWords(6).filter(p => p.slug !== slug);
        return (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">Compare &ldquo;{w.word}&rdquo;</h2>
            {syns.length > 0 && (
              <>
                <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">vs Synonyms</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {syns.slice(0, 5).map(syn => {
                    const synSlug = syn.toLowerCase().replace(/\s+/g, '-');
                    const [x, y] = [slug, synSlug].sort();
                    return (
                      <a key={syn} href={`/word/${y}/`}
                        className="text-sm px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full">
                        vs {syn}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
            {ants.length > 0 && (
              <>
                <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">vs Antonyms</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ants.slice(0, 5).map(ant => {
                    const antSlug = ant.toLowerCase().replace(/\s+/g, '-');
                    const [x, y] = [slug, antSlug].sort();
                    return (
                      <a key={ant} href={`/word/${y}/`}
                        className="text-sm px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full">
                        vs {ant}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">vs Common Words</h3>
            <div className="flex flex-wrap gap-2">
              {popular.map(p => {
                const [x, y] = [slug, p.slug].sort();
                return (
                  <a key={p.slug} href={`/word/${y}/`}
                    className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-indigo-700 rounded-full">
                    vs {p.word}
                  </a>
                );
              })}
            </div>
          </section>
        );
      })()}

      <RelatedEntities
        entityName={w.word}
        items={similar.slice(0, 8).map(s => ({
          name: s.word,
          href: `/word/${s.slug}/`,
          stat: s.pos || (s.frequency ? `freq ${s.frequency}` : undefined),
        }))}
        heading={`Similar to ${w.word}`}
        statLabel="Part of speech"
      />

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="border border-slate-200 rounded-lg mb-2" open={i === 0}>
            <summary className="p-4 cursor-pointer font-medium">{faq.question}</summary>
            <div className="px-4 pb-4 text-slate-600">{faq.answer}</div>
          </details>
        ))}
      </section>

      <FreshnessTag source="ECDICT open-source dictionary + BNC/COCA corpus frequency data" />

          <EmbedButton url="https://vocabwize.com" title="Data from VocabWize" site="VocabWize" siteUrl="https://vocabwize.com" />

          {/* Related Data Resources */}
          <section className="mt-8 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-semibold text-slate-500 mb-2">Related Data Resources</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="https://nameblooms.com" className="text-indigo-600 hover:underline">NameBlooms - Baby name meanings &rarr;</a>
              <a href="https://degreewize.com" className="text-indigo-600 hover:underline">DegreeWize - College data &rarr;</a>
              <a href="https://vocablibre.com" className="text-indigo-600 hover:underline">VocabLibre - Dictionnaire Français &rarr;</a>
              <a href="https://dicionariowize.com" className="text-indigo-600 hover:underline">DicionarioWize - Dicionário Português &rarr;</a>
              <a href="https://kalimawize.com" className="text-indigo-600 hover:underline">KalimaWize - قاموس عربي &rarr;</a>
              <a href="https://wortwize.com" className="text-indigo-600 hover:underline">WortWize - Deutsches Wörterbuch &rarr;</a>
              <a href="https://kotobapeek.com" className="text-indigo-600 hover:underline">KotobaPeek - 日本語辞典 &rarr;</a>
            </div>
          </section>

          <DataFeedback />

          <AuthorBox />

          <section className="mt-8 p-6 bg-teal-50 rounded-xl border border-teal-100">
        <h3 className="text-lg font-semibold text-teal-900 mb-3">Improve Your English Skills</h3>
        <p className="text-teal-800 text-sm leading-relaxed">
          Start a free online English course, prepare for TOEFL or IELTS exams, or find a private tutor to accelerate your language learning journey.
          Explore <a href="https://degreewize.com" className="underline font-medium">top university programs</a> for international students.
        </p>
      </section>

      {/* Words at Same Level */}
      {(() => {
        const sameLevel = getWordsBySameLevel(w.level, slug, 8);
        if (!sameLevel.length) return null;
        return (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">{w.level ? `${w.level.charAt(0).toUpperCase() + w.level.slice(1)}-Level` : ''} Words</h2>
            <div className="flex flex-wrap gap-2">
              {sameLevel.map(s => (
                <a key={s.slug} href={`/word/${s.slug}/`} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors">
                  {s.word}
                </a>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Compare with Same Part of Speech */}
      {(() => {
        const samePOS = getWordsBySamePOS(w.pos, slug, 6);
        if (!samePOS.length) return null;
        return (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">Compare with Other {w.pos ? w.pos.charAt(0).toUpperCase() + w.pos.slice(1) + 's' : 'Words'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {samePOS.map(s => {
                const [a, b] = [slug, s.slug].sort();
                return (
                  <a key={s.slug} href={`/word/${b}/`} className="p-3 border rounded-lg hover:bg-indigo-50 text-indigo-600 text-sm text-center transition-colors">
                    {w.word} vs {s.word}
                  </a>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* Discover more words */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">Discover More Words</h2>
        <div className="flex flex-wrap gap-2">
          {getRandomWords(20)
            .filter(rw => rw.slug !== slug)
            .map(rw => (
                <a key={rw.slug} href={`/word/${rw.slug}/`}
                  className="text-sm px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors">
                  {rw.word}
                </a>
            ))}
        </div>
      </section>

      <FeedbackButton pageId={slug} />

      <DataSourceBadge sources={[
        { name: "ECDICT", url: "https://github.com/skywind3000/ECDICT" },
        { name: "BNC Corpus", url: "https://www.natcorp.ox.ac.uk/" },
        { name: "COCA", url: "https://www.english-corpora.org/coca/" },
        { name: "Wiktionary (cross-ref)", url: `https://en.wiktionary.org/wiki/${encodeURIComponent(w.word)}/` },
        { name: "Merriam-Webster (cross-ref)", url: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(w.word)}/` },
      ]} />

      <DecisionNext
        cards={[
          ...(synonyms.length > 0 && canShowCompareCard
            ? [
                {
                  title: `Compare vs ${synonyms[0]}`,
                  blurb: `See how "${w.word}" differs in tone and usage from its closest synonym.`,
                  href: `/compare/${compareTargetPair}/`,
                  cta: "Open comparison",
                  tone: "indigo" as const,
                },
              ]
            : [
                {
                  title: `${w.word[0].toUpperCase()}-words`,
                  blurb: `Browse other words starting with "${w.word[0].toUpperCase()}" from the same family of letters.`,
                  href: `/letter/${w.word[0].toLowerCase()}/`,
                  cta: "Browse letter",
                  tone: "indigo" as const,
                },
              ]),
          {
            title: `${w.level ? w.level.charAt(0).toUpperCase() + w.level.slice(1) + "-level" : "Similar-level"} vocabulary`,
            blurb: `Continue building words at the same difficulty. Great for steady progress.`,
            href: `/letter/${w.word[0].toLowerCase()}/`,
            cta: "See more words",
            tone: "emerald" as const,
          },
          {
            title: `Rhymes with ${w.word}`,
            blurb: `Find words that rhyme — useful for writing, mnemonics, and memory.`,
            href: `/rhymes/${slug}/`,
            cta: "View rhymes",
            tone: "amber" as const,
          },
        ]}
      />

      <CrossSiteLinks current="VocabWize" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...definedTermSchema(w.word, w.definition), author: { "@type": "Organization", name: "DataPeek" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />}
    </div>
  );
}
