import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getTopWords, getTopComparisons, getSimilarWords, getPopularWords, getRandomWords, getMaxFrequency, getWordsBySamePOS, getWordsBySameLevel, getFrequencyPercentile, getWordCountByLevel, getWordCountByPOS, getTranslations } from "@/lib/db";
import wordKeepList from "@/lib/generated/word-keep.json";
import { isHotComparePair } from "@/lib/static-paths";
import { breadcrumbSchema, faqSchema, definedTermSchema, datasetSchema } from "@/lib/schema";
import {
  WORD_VINTAGE,
  REVIEWER_ORG,
  SOURCE_AUTHORITIES,
  PUBLISHER,
} from "@/lib/authorship";
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
import { getAwlSublist, getAwlEntry } from "@/lib/awl";
import { classifyCEFR, cefrLabel } from "@/lib/cefr-tier";
import { getWordInterpretation } from "@/lib/word-interpretation";
import { decodeWordCrosswalk, buildWordP1Title, wordVariableMeasured } from "@/lib/crosswalk-vocabwize";
import { WordInterpretation } from "@/components/upgrades/WordInterpretation";
import { TableOfContents } from "@/components/upgrades/TableOfContents";
import { calculateProprietaryMetrics } from "@/lib/proprietary-metrics";
import { ProprietaryMetricsBlock } from "@/components/upgrades/ProprietaryMetricsBlock";

interface Props { params: Promise<{ slug: string }> }

// HCU 2026-04-24: keep-set = top-100 by popularity + GSC evidence union
// (10 URLs earning ≥1 click in 28d window that the 100-cap would drop).
// Single source of truth lives in scripts/build-keep-sets.ts output; the
// /compare/ keep-set is wrapped by isHotComparePair() in lib/static-paths.ts.

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
  // Phase 7 P1 — verdict-in-title via §3.3 CrosswalkResult wrapper.
  // Layout suffix " | VocabWize" is 12c (9-12 sub-band per playbook §4.0
  // table). Longest entity (20c "uncharacteristically") + longest verdict body
  // (~25c "Academic (AWL Sublist 10)") = 45c; with suffix = 57c, 3c off the
  // 60c cap — so title.absolute is the safer call. Worst measured 45c gives
  // 15c margin without the suffix.
  const crosswalk = decodeWordCrosswalk({ word: w.word, frequency: w.frequency, level: w.level });
  const verdictTitle = buildWordP1Title(w.word, crosswalk);
  const fallbackTitle = pos
    ? `${w.word} — Meaning, ${pos} · ${crosswalk.tierTag}`
    : `${w.word} — Meaning · ${crosswalk.tierTag}`;
  const absoluteTitle = verdictTitle ?? fallbackTitle;

  const frequencyPercentile = w.frequency > 0 ? getFrequencyPercentile(w.frequency) : 50;
  const metrics = calculateProprietaryMetrics(
    w.word,
    slug,
    w.level,
    frequencyPercentile,
    synCount > 0,
    exCount > 0
  );

  const description = `[Lexical Value: Complexity ${metrics.complexityScore}/100, Grade ${metrics.overallGrade}] ${w.word} (${pos}) — ${firstDef}. ${crosswalk.verdict} (${crosswalk.tierTag}). ${defsCount} definitions, ${exCount} examples, ${synCount} synonyms. English dictionary.`;
  return {
    title: { absolute: absoluteTitle },
    description,
    openGraph: { title: absoluteTitle, description, url: `/word/${slug}/` },
    twitter: { title: absoluteTitle, description },
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
  // Guard via the shared keep-set helper: synonyms[0] is an arbitrary pair, so
  // only link it when a static /compare/ page actually exists (dynamicParams=false).
  const canShowCompareCard = compareTargetSlug ? isHotComparePair(slug, compareTargetSlug) : false;

  const faqs = generateWordFaqs(w);

  // PSU lever — Coxhead 2000 AWL sublist (1..10) deterministic lookup.
  // 570 family static mapping in lib/generated/awl-sublist.json. null if not AWL.
  const awlSublist = getAwlSublist(w.word);
  const awlEntry = awlSublist ? getAwlEntry(w.word) : null;

  // PSU 1차 lever — CEFR Difficulty Tier (A1..C2) deterministic classifier.
  // Composed with AWL into the Word Interpretation Strip.
  const cefr = classifyCEFR({ word: w.word, frequency: w.frequency, level: w.level });

  // Phase 7 P0 — §3.3 CrosswalkResult wrapping CEFR × AWL × frequency into a
  // single 4-band verdict (Core / General / Academic / Specialist). The
  // verdict also drives title.absolute (P1) and Dataset.variableMeasured (P4).
  const crosswalk = decodeWordCrosswalk({ word: w.word, frequency: w.frequency, level: w.level });
  const interpretation = getWordInterpretation({
    word: w.word,
    cefr,
    awlSublist,
    awlFamilyHead: awlEntry?.head ?? null,
    frequencyRank: w.frequency,
    pos: w.pos,
    synonyms,
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: w.word[0].toUpperCase(), url: `/letter/${w.word[0].toLowerCase()}/` },
    { name: w.word, url: `/word/${slug}/` },
  ];

  const metrics = calculateProprietaryMetrics(
    w.word,
    slug,
    w.level,
    frequencyPercentile,
    synonyms.length > 0,
    examples.length > 0
  );

  return (
    <article data-toc-root>
      <nav className="text-sm text-slate-500 mb-4 font-sans">
        {breadcrumbs.map((b, i) => (<span key={i}>{i > 0 && " / "}{i < 2 ? <a href={b.url} className="hover:underline">{b.name}</a> : <span className="text-slate-800">{b.name}</span>}</span>))}
      </nav>

      {/* HCU 2026-05-05: Unique-dimension badges surface our calibrated
          interpretation — frequency band (BNC/COCA percentile) + AWL register
          flag — visible to readers, not just buried in JSON-LD. */}
      <div className={`mb-6 inline-flex items-start gap-3 rounded-lg border ${crosswalk.tone.border} ${crosswalk.tone.bg} px-4 py-2.5`}>
        <span className={`text-xs font-bold uppercase tracking-wide ${crosswalk.tone.text}`}>
          Band {crosswalk.band} · {crosswalk.verdict} ({crosswalk.tierTag})
        </span>
        <span className="text-xs text-slate-700 leading-snug">{crosswalk.blurb}</span>
      </div>

      <AnswerHero
        title={w.word}
        subtitle={w.phonetic ? `/${w.phonetic}/` : null}
        tagline={(w.definition.split(";")[0] || w.definition).trim()}
        badges={[
          ...(w.pos ? [{ label: w.pos, tone: "indigo" as const }] : []),
          ...(w.level
            ? [{ label: w.level.charAt(0).toUpperCase() + w.level.slice(1), tone: "slate" as const }]
            : []),
          ...(w.frequency > 0
            ? (() => {
                const topPct = Math.max(1, 100 - frequencyPercentile);
                const label =
                  topPct <= 1 ? "Top 1% (BNC/COCA)" :
                  topPct <= 5 ? "Top 5% (BNC/COCA)" :
                  topPct <= 10 ? "Top 10% (BNC/COCA)" :
                  topPct <= 25 ? "Top 25% (BNC/COCA)" :
                  null;
                return label ? [{ label, tone: "amber" as const }] : [];
              })()
            : []),
          ...(awlSublist
            ? [{ label: `AWL Sublist ${awlSublist}`, tone: "emerald" as const }]
            : []),
          { label: `CEFR ${cefr}`, tone: "indigo" as const },
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

      <ProprietaryMetricsBlock {...metrics} />

      <WordInterpretation
        strip={interpretation}
        cefr={cefr}
        awlSublist={awlSublist}
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

      {awlSublist && awlEntry && (
        <section className="mt-6 mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h2 className="text-base font-semibold text-emerald-900 mb-2">
            Coxhead Academic Word List — Sublist {awlSublist} of 10
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>{w.word}</strong> belongs to the <strong>{awlEntry.head}</strong> word family in Sublist {awlSublist}
            {" "}of the <a href="https://www.eapfoundation.com/vocab/academic/awllists/" className="underline" rel="noopener nofollow">Academic Word List</a>
            {" "}(Averil Coxhead, 2000). The AWL contains 570 word families derived from a 3.5-million-word corpus
            of academic writing across arts, commerce, law, and science, and covers roughly 10% of all words in
            academic texts. Sublist 1 collects the most frequent academic vocabulary; Sublist 10 the least frequent.
            {awlSublist <= 3
              ? " This family is among the highest-frequency academic vocabulary — appearing in nearly every academic register."
              : awlSublist <= 6
              ? " This family is a mid-frequency academic word — common in formal writing but less so in everyday speech."
              : " This family is a lower-frequency academic word — useful for advanced reading and writing tasks."}
          </p>
          <details className="mt-3 text-xs text-slate-600">
            <summary className="cursor-pointer hover:text-slate-900">
              View the full {awlEntry.head} word family ({awlEntry.family.length} forms)
            </summary>
            <p className="mt-2 leading-relaxed">{awlEntry.family.join(", ")}</p>
          </details>
        </section>
      )}

      <TableOfContents />

      {/* Legacy level pill kept as accessible anchor */}
      {w.level && (
        <p className="sr-only">
          <span className={levelColors[w.level] || ""}>{w.level}</span>
        </p>
      )}

      {(() => {
        // HCU 2026-05-14: keep only AWL/frequency data-backed notes.
        // Generic encouragement branches are intentionally omitted.
        const note = awlSublist
          ? `"${w.word}" is in the Coxhead AWL Sublist ${awlSublist} of 10 — formal academic vocabulary commonly tested on TOEFL, IELTS, and the GRE.`
          : (w.frequency && w.frequency > 0 && w.frequency <= 5000)
          ? `"${w.word}" ranks in the top ${Math.max(1, 100 - getFrequencyPercentile(w.frequency))}% by usage frequency.`
          : null;
        return note ? <EditorNote note={note} /> : null;
      })()}

      <FrequencyMeter frequency={w.frequency} maxFrequency={maxFreq} />

      <WordLevelChecker word={w.word} frequency={w.frequency} pos={w.pos} level={w.level} />

      {/* Word Insights — HCU 2026-05-14: remove length-based generic prose.
          Keep frequency rank and ECDICT level to AWL cross-reference only. */}
      <section className="bg-blue-50 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold mb-2">Word Insights</h2>
        <ul className="space-y-1 text-sm text-slate-700">
          {w.frequency && maxFreq > 0 && <li>This word ranks in the <strong>top {Math.max(1, Math.round((w.frequency / maxFreq) * 100))}%</strong> of most frequently used English words.</li>}
          {w.level === 'academic' && <li>ECDICT&apos;s heuristic level tag puts this in the <strong>academic</strong> tier (~19,000 entries, including specialist medical Latin). The authoritative academic-register signal is Coxhead AWL membership: {awlSublist ? <>this word is in <strong>AWL Sublist {awlSublist}</strong> (Coxhead 2000).</> : <>this word is <strong>not</strong> in the Coxhead 2000 AWL, so the academic-register claim is the ECDICT heuristic, not a published reference. See <a href="/methodology/" className="text-indigo-600 hover:underline">methodology</a> for the two-tier distinction.</>}</li>}
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

      {/* HCU 2026-05-14: removed the repeated explanatory section.
          Data-backed surfaces above cover AWL, CEFR, frequency, and interpretation. */}

      {/* HCU 2026-05-14: render DidYouKnow only for etymology-backed facts. */}
      {w.etymology && (
        <DidYouKnow fact={`The word "${w.word}" has roots in ${w.etymology.split('.')[0].replace(/^From\s+/i, '')}.`} />
      )}

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

          <AuthorBox vintage={WORD_VINTAGE} source="ECDICT + WordNet, BNC/COCA-calibrated" />

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
        ]}
      />

      <CrossSiteLinks current="VocabWize" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        ...definedTermSchema(w.word, w.definition),
        author: { "@type": "Organization", name: PUBLISHER.name, url: PUBLISHER.url },
        publisher: { "@type": "Organization", name: PUBLISHER.name, url: PUBLISHER.url },
        reviewedBy: REVIEWER_ORG,
        isBasedOn: SOURCE_AUTHORITIES,
        dateModified: WORD_VINTAGE,
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema({
        name: `${w.word} — English dictionary entry data`,
        description: `Lexical data for the English word "${w.word}": COCA/BNC frequency rank, Coxhead 2000 AWL membership, CEFR difficulty tier derived from corpus-frequency cutoffs, part of speech, IPA phonetic, Princeton WordNet synonym/antonym graph, and ECDICT base definition. Pure deterministic derivation from open lexical corpora — no editorial paraphrase.`,
        url: `/word/${slug}/`,
        dateModified: WORD_VINTAGE,
        variableMeasured: [
          ...wordVariableMeasured(crosswalk),
          "Princeton WordNet synonyms",
          "Princeton WordNet antonyms",
          "ECDICT inflection forms",
          "IPA phonetic transcription",
        ],
        keywords: [w.word, "english dictionary", "CEFR", "AWL", "COCA", "WordNet"],
      })) }} />
    </article>
  );
}
