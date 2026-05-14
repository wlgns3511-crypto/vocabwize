/**
 * Word Interpretation Strip — deterministic editorial composition over
 * CEFR Tier × Coxhead AWL Sublist × corpus frequency rank.
 *
 * The strip is composed by editorial rules in source code at build time.
 * Same word + same corpus frequency rank + same AWL membership always
 * produce byte-identical output, so the strip is auditable cell-by-cell
 * against the published Coxhead 2000 AWL list and the COCA / BNC rank
 * the page already surfaces.
 *
 * 1-line verdict + 4 paragraphs:
 *   verdict             a one-line read combining CEFR, AWL, corpus rank
 *   difficulty          what the CEFR tier means for learning sequence
 *   academicContext     what the AWL sublist (or non-AWL status) means
 *   morphologicalView   suffix / length / etymology hooks for the surface form
 *   crossReference      how to use synonyms / related forms productively
 */

import type { CefrTier } from './cefr-tier';
import { cefrBlurb, cefrLabel } from './cefr-tier';

export interface WordInterpretation {
  verdict: string;
  difficulty: string;
  academicContext: string;
  morphologicalView: string;
  crossReference: string;
}

export interface WordInterpretationInput {
  word: string;
  cefr: CefrTier;
  awlSublist: number | null;
  awlFamilyHead: string | null;
  frequencyRank: number | null | undefined;
  pos: string | null | undefined;
  synonyms: readonly string[];
}

const HARD_SUFFIX_INDEX: Array<{ suffix: string; label: string; origin: string }> = [
  { suffix: 'tion',    label: 'noun-forming -tion',    origin: 'Latin -tionem'  },
  { suffix: 'sion',    label: 'noun-forming -sion',    origin: 'Latin -sionem'  },
  { suffix: 'ize',     label: 'verb-forming -ize',     origin: 'Greek -izein'    },
  { suffix: 'ise',     label: 'verb-forming -ise',     origin: 'Greek -izein (Br.)' },
  { suffix: 'graph',   label: 'combining form -graph', origin: 'Greek graphos'   },
  { suffix: 'ology',   label: 'combining form -ology', origin: 'Greek -logia'    },
  { suffix: 'osophy',  label: 'combining form -osophy',origin: 'Greek sophia'    },
  { suffix: 'archy',   label: 'combining form -archy', origin: 'Greek arkhia'    },
  { suffix: 'ocracy',  label: 'combining form -ocracy',origin: 'Greek -kratia'   },
  { suffix: 'escence', label: 'state-forming -escence',origin: 'Latin -escentia' },
  { suffix: 'iferous', label: 'adjective -iferous',    origin: 'Latin -fer-'     },
  { suffix: 'aceous',  label: 'adjective -aceous',     origin: 'Latin -aceus'    },
  { suffix: 'logical', label: 'adjective -logical',    origin: 'Greek -logikos'  },
  { suffix: 'ity',     label: 'noun-forming -ity',     origin: 'Latin -itas'     },
  { suffix: 'ment',    label: 'noun-forming -ment',    origin: 'Latin -mentum'   },
  { suffix: 'able',    label: 'adjective -able',       origin: 'Latin -abilis'   },
  { suffix: 'ible',    label: 'adjective -ible',       origin: 'Latin -ibilis'   },
  { suffix: 'ous',     label: 'adjective -ous',        origin: 'Latin -osus'     },
  { suffix: 'ful',     label: 'adjective -ful',        origin: 'Old English -full'},
  { suffix: 'less',    label: 'adjective -less',       origin: 'Old English -leas'},
  { suffix: 'ness',    label: 'noun-forming -ness',    origin: 'Old English -nes'},
  { suffix: 'ly',      label: 'adverb -ly',            origin: 'Old English -lic' },
];

function detectSuffix(word: string): { suffix: string; label: string; origin: string } | null {
  const w = word.toLowerCase();
  for (const entry of HARD_SUFFIX_INDEX) {
    if (w.endsWith(entry.suffix) && w.length > entry.suffix.length + 1) return entry;
  }
  return null;
}

function rankString(rank: number | null | undefined): string {
  if (!rank || rank <= 0) return 'unranked';
  return `#${rank.toLocaleString('en-US')}`;
}

export function getWordInterpretation(input: WordInterpretationInput): WordInterpretation {
  const { word, cefr, awlSublist, awlFamilyHead, frequencyRank, pos, synonyms } = input;
  const suffix = detectSuffix(word);

  // ── 1-line verdict ──────────────────────────────────────────────
  const verdictParts: string[] = [];
  verdictParts.push(`CEFR ${cefr}`);
  if (awlSublist) verdictParts.push(`AWL Sublist ${awlSublist}`);
  verdictParts.push(`COCA rank ${rankString(frequencyRank)}`);
  if (suffix) verdictParts.push(`${suffix.origin.split(' ')[0]}-derived ${suffix.suffix}`);
  const verdict = `"${word}" — ${verdictParts.join(' · ')}`;

  // ── Paragraph 1: difficulty (CEFR-branched) ─────────────────────
  const difficulty = `${cefrLabel(cefr)}. ${cefrBlurb(cefr)} ${
    cefr === 'A1' || cefr === 'A2'
      ? 'A learner at this stage should aim for active production: recognize, retrieve, and use the word in writing — not just identify it on a flashcard.'
      : cefr === 'B1' || cefr === 'B2'
      ? 'A learner at this stage should focus on collocation and register — knowing the word in the abstract is less useful than knowing which adjectives, prepositions, and contexts it pairs with naturally.'
      : 'A learner at this stage should treat the word as advanced lexis: encounter it through extensive reading, log its register and collocations, and produce it sparingly until the surrounding grammar and register match.'
  }`;

  // ── Paragraph 2: academic context (AWL-branched) ────────────────
  let academicContext: string;
  if (awlSublist && awlFamilyHead) {
    const sublistFreq =
      awlSublist <= 3
        ? 'high-frequency academic vocabulary — appearing in nearly every academic register from social-science abstracts to law-review notes'
        : awlSublist <= 6
        ? 'mid-frequency academic vocabulary — common in formal writing but less so in everyday speech'
        : 'lower-frequency academic vocabulary — useful for advanced reading and writing tasks but not core to spoken register';
    academicContext = `Belongs to the ${awlFamilyHead} family in Coxhead Sublist ${awlSublist} of 10. The Academic Word List (Averil Coxhead, 2000) is derived from a 3.5-million-word corpus of academic prose across arts, commerce, law, and science. Sublist ${awlSublist} is ${sublistFreq}. Inclusion in the AWL is the strongest single signal that the word will appear on TOEFL, IELTS, GRE, and university-level academic reading lists — the AWL is the published reference these test-prep authorities cite.`;
  } else {
    academicContext = `Not in the Coxhead Academic Word List. AWL inclusion is a strict published criterion (570 word families, frequency ≥ 100 in the 3.5M-word academic corpus and minimum dispersion across all four sub-corpora); most everyday English vocabulary, idioms, and lower-frequency content words sit outside the AWL. Absence from the AWL is not a quality judgment — it simply means this word is unlikely to be flagged as "academic register" by test-prep materials that follow the Coxhead list.`;
  }

  // ── Paragraph 3: morphological breakdown ────────────────────────
  let morphologicalView: string;
  if (suffix) {
    morphologicalView = `Surface form ends in ${suffix.label} (from ${suffix.origin}). The suffix carries grammatical function — readers can infer part-of-speech (${pos || 'see POS tag'}) from the suffix alone, and inflection follows the standard pattern for the suffix class. Identifying productive suffixes is how readers chunk unfamiliar long words into known parts; the published reference list of English derivational suffixes is documented in Plag (2018) "Word-Formation in English" and is the basis for our morphological-depth correction in the CEFR classifier.`;
  } else if (word.length <= 5) {
    morphologicalView = `Short surface form (${word.length} letters) without an overt derivational suffix. Short words tend to be Germanic core vocabulary or unsuffixed Latin roots — they carry meaning by stem alone, and their inflection (if any) is irregular or null. Length under six letters is a strong predictor of A1/A2 inclusion in published learner-vocabulary lists.`;
  } else {
    morphologicalView = `Surface form is ${word.length} letters without a high-frequency derivational suffix. Longer unsuffixed words usually come from a Latin or Greek stem borrowed wholesale (rather than derived via productive English suffixation). For learners, this means the surface form is the lemma — there are no shorter base-forms to memorize separately, but inflection (if any) follows the irregular Latin / Greek pattern rather than the productive English suffix table.`;
  }

  // ── Paragraph 4: cross-reference / synonyms ─────────────────────
  let crossReference: string;
  if (synonyms.length >= 3) {
    const top = synonyms.slice(0, 3).join(', ');
    crossReference = `Productive use of "${word}" is easier when paired with its WordNet synset members: ${top}${synonyms.length > 3 ? ` (plus ${synonyms.length - 3} more)` : ''}. Synonyms are not interchangeable — each carries a different register (formal vs informal) and a different collocation profile (which adjectives or prepositions it accepts). The WordNet synonym layer is descriptive (it records sense-overlap, not stylistic equivalence); to swap one for another in writing, check the register and the surrounding noun-phrase first.`;
  } else if (synonyms.length > 0) {
    crossReference = `WordNet records ${synonyms.length} sense-overlap synonym${synonyms.length === 1 ? '' : 's'}: ${synonyms.join(', ')}. WordNet synonymy is descriptive — it captures sense overlap in published lexicographic data, not stylistic equivalence. For writing, treat a WordNet synonym as a candidate, not an interchangeable swap; check the register and the surrounding noun-phrase before substituting.`;
  } else {
    crossReference = `WordNet records no sense-overlap synonym for "${word}" in our extracted synset slice. Absence of synonyms in WordNet usually means the word is a closed-class function word (article, preposition, conjunction), a proper-noun-derived form, or sufficiently specialized that the WordNet sense-network has no published peer for it. Cross-reference through the morphological family or the AWL family (above) instead.`;
  }

  return { verdict, difficulty, academicContext, morphologicalView, crossReference };
}
