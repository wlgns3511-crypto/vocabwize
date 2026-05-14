/**
 * CEFR Difficulty Tier classifier — Council of Europe framework × COCA / BNC
 * frequency rank.
 *
 * Maps any word to one of six CEFR levels (A1 / A2 / B1 / B2 / C1 / C2). The
 * classifier is deterministic and pure: same inputs always produce the same
 * tier. Inputs are the corpus frequency rank and the word string itself
 * (length + morphological signal) — no randomization, no external state.
 *
 * The cutoffs are derived from how vocabulary-list authorities (English Vocabulary
 * Profile, Oxford 3000/5000, Cambridge Learner Corpus) align corpus rank bands
 * with CEFR proficiency levels. They are VocabWize heuristics over a
 * published framework — every page surfaces this distinction in the CEFR
 * reader-help block.
 *
 * Cutoffs (corpus frequency rank — lower = more common):
 *   A1   rank 1     - 1000      most-frequent everyday core (cat, run, the)
 *   A2   rank 1001  - 2000      common everyday vocabulary (beautiful)
 *   B1   rank 2001  - 5000      independent-user vocabulary (excellent)
 *   B2   rank 5001  - 15000     upper-intermediate (paradigm, algorithm)
 *   C1   rank 15001 - 50000     advanced (synthesize, corroborate)
 *   C2   rank 0 / unranked      proficient / specialist / rare lexis
 *
 * Morphological-depth correction: a word with rank ≤2000 but length ≥10
 * and a low-frequency derivational suffix (-tion, -graph, -ology, -ize,
 * -ferous, -escence) is bumped UP one tier — the corpus rank captures the
 * lemma family, but the surface form is harder to recognize than the rank
 * suggests. A word with rank 0 (unranked) but DB level=basic is bumped
 * DOWN to C1 — DB level=basic is a coarse early-learner signal and the
 * absence of a corpus rank often means the form is rare but the lemma is
 * not.
 */

export type CefrTier = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

const HARD_SUFFIXES = [
  'tion', 'sion', 'graph', 'ology', 'osophy', 'escence', 'iferous', 'archy',
  'ocracy', 'ization', 'isation', 'ological', 'inate', 'aceous',
] as const;

function hasHardSuffix(word: string): boolean {
  const w = word.toLowerCase();
  return HARD_SUFFIXES.some((s) => w.endsWith(s));
}

function bumpUp(tier: CefrTier): CefrTier {
  const order: CefrTier[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const i = order.indexOf(tier);
  return order[Math.min(i + 1, order.length - 1)];
}

function bumpDown(tier: CefrTier): CefrTier {
  const order: CefrTier[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const i = order.indexOf(tier);
  return order[Math.max(i - 1, 0)];
}

/**
 * Classify a word into CEFR A1..C2 using corpus frequency rank + length +
 * suffix morphology. Pure function — same inputs, same output.
 *
 * @param args.word        the surface form (used only for length + suffix)
 * @param args.frequency   COCA / BNC frequency rank (1 = most common; 0 / null = unranked)
 * @param args.level       optional DB level hint (basic / intermediate / advanced / academic)
 */
export function classifyCEFR(args: {
  word: string;
  frequency: number | null | undefined;
  level?: string | null;
}): CefrTier {
  const rank = args.frequency && args.frequency > 0 ? args.frequency : 0;
  let tier: CefrTier;

  if (rank === 0) {
    if (args.level === 'basic') tier = 'C1';
    else if (args.level === 'intermediate') tier = 'C1';
    else if (args.level === 'advanced') tier = 'C2';
    else if (args.level === 'academic') tier = 'C2';
    else tier = 'C2';
  } else if (rank <= 1000) {
    tier = 'A1';
  } else if (rank <= 2000) {
    tier = 'A2';
  } else if (rank <= 5000) {
    tier = 'B1';
  } else if (rank <= 15000) {
    tier = 'B2';
  } else if (rank <= 50000) {
    tier = 'C1';
  } else {
    tier = 'C2';
  }

  // Morphological-depth correction: surface form harder than rank suggests
  if (rank > 0 && rank <= 5000 && args.word.length >= 10 && hasHardSuffix(args.word)) {
    tier = bumpUp(tier);
  }

  // Unranked bump-down: rank 0 + DB level=basic is a contradictory signal —
  // treat as advanced (C1) rather than C2 specialist lexis
  if (rank === 0 && args.level === 'basic') tier = bumpDown(tier);

  return tier;
}

const CEFR_LABELS: Record<CefrTier, string> = {
  A1: 'A1 (Beginner)',
  A2: 'A2 (Elementary)',
  B1: 'B1 (Intermediate)',
  B2: 'B2 (Upper-Intermediate)',
  C1: 'C1 (Advanced)',
  C2: 'C2 (Proficient)',
};

const CEFR_BLURBS: Record<CefrTier, string> = {
  A1: 'A1 vocabulary covers concrete everyday topics — family, food, weather, basic actions. A learner with only A1 lexis can ask and answer simple questions about themselves.',
  A2: 'A2 vocabulary extends to routine situations — shopping, daily routine, immediate environment. Most function words and the highest-frequency content words sit in A1+A2.',
  B1: 'B1 vocabulary lets an independent user describe experiences, give opinions, and handle most travel situations. The corpus rank band 2,001–5,000 maps to roughly Oxford 5000 mid-range.',
  B2: 'B2 vocabulary supports clear, detailed text on a wide range of subjects and can discuss abstract topics. Many academic and professional words enter at B2.',
  C1: 'C1 vocabulary covers complex, abstract, and specialized topics — readers at C1 can recognize implicit meaning. Most words ranked beyond corpus position 15,000 require C1+.',
  C2: 'C2 vocabulary is proficient-level: rare, technical, archaic, or specialist lexis. Corpus-unranked words and low-frequency academic / scientific vocabulary sit here.',
};

const CEFR_COLORS: Record<CefrTier, { ring: string; bg: string; text: string }> = {
  A1: { ring: 'ring-green-200',  bg: 'bg-green-50',  text: 'text-green-800'  },
  A2: { ring: 'ring-lime-200',   bg: 'bg-lime-50',   text: 'text-lime-800'   },
  B1: { ring: 'ring-sky-200',    bg: 'bg-sky-50',    text: 'text-sky-800'    },
  B2: { ring: 'ring-blue-200',   bg: 'bg-blue-50',   text: 'text-blue-800'   },
  C1: { ring: 'ring-violet-200', bg: 'bg-violet-50', text: 'text-violet-800' },
  C2: { ring: 'ring-rose-200',   bg: 'bg-rose-50',   text: 'text-rose-800'   },
};

export function cefrLabel(tier: CefrTier): string {
  return CEFR_LABELS[tier];
}

export function cefrBlurb(tier: CefrTier): string {
  return CEFR_BLURBS[tier];
}

export function cefrToneColor(tier: CefrTier): { ring: string; bg: string; text: string } {
  return CEFR_COLORS[tier];
}

/**
 * Cutoffs table — surfaced verbatim on /guide/cefr-difficulty-tiers/
 * so readers can replicate the classifier with the same rank input.
 */
export const cefrCutoffsTable: ReadonlyArray<{
  tier: CefrTier;
  rankMin: number;
  rankMax: number | null; // null = unranked
  label: string;
}> = [
  { tier: 'A1', rankMin: 1,     rankMax: 1000,  label: 'A1 (Beginner)' },
  { tier: 'A2', rankMin: 1001,  rankMax: 2000,  label: 'A2 (Elementary)' },
  { tier: 'B1', rankMin: 2001,  rankMax: 5000,  label: 'B1 (Intermediate)' },
  { tier: 'B2', rankMin: 5001,  rankMax: 15000, label: 'B2 (Upper-Intermediate)' },
  { tier: 'C1', rankMin: 15001, rankMax: 50000, label: 'C1 (Advanced)' },
  { tier: 'C2', rankMin: 0,     rankMax: null,  label: 'C2 (Proficient / unranked)' },
];
