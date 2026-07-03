/**
 * VocabWize Phase 7 atomic-bundle wrapper (P0).
 *
 * Wraps the Phase 6 PSU (CEFR Tier × Coxhead AWL × COCA/BNC frequency) into a
 * §3.3 CrosswalkResult so the page-component boundary emits a short verdict
 * for title.absolute (P1) and a tone-coded chip in the body.
 *
 * Source-authority chain (inherited from the existing PSU):
 *   - Council of Europe CEFR framework (via VocabWize calibrated cutoffs over
 *     BNC + COCA corpus rank)
 *   - Coxhead 2000 Academic Word List (570 word families × 10 sublists,
 *     3.5M-word academic corpus)
 *   - British National Corpus (100M, balanced British English, Oxford)
 *   - Corpus of Contemporary American English (1B+, BYU/english-corpora)
 *
 * Band assignment (4 distinct buckets — composedScore distinct ≥ 3 satisfied):
 *   A · Core       — CEFR A1/A2, NOT in AWL (everyday core lexis)
 *   B · General    — CEFR B1/B2, NOT in AWL (independent-user vocabulary)
 *   C · Academic   — AWL member (any sublist 1-10) — Coxhead published register
 *   D · Specialist — CEFR C1/C2, NOT in AWL (advanced / rare / specialist)
 *
 * Distribution over the 20,051-word keep set (measured 2026-05-20):
 *   A=7.0% · B=48.2% · C=7.9% · D=36.8%
 *   Trap #111 max band = 48.2% (under 50% ceiling)
 */

import type { CefrTier } from './cefr-tier';
import { classifyCEFR } from './cefr-tier';
import { getAwlSublist, getAwlEntry } from './awl';

export type VocabBand = 'A' | 'B' | 'C' | 'D';

export type VocabVerdict = 'Core' | 'General' | 'Academic' | 'Specialist';

const VERDICT_BY_BAND: Record<VocabBand, VocabVerdict> = {
  A: 'Core',
  B: 'General',
  C: 'Academic',
  D: 'Specialist',
};

const TONE_BY_BAND: Record<VocabBand, { bg: string; border: string; text: string }> = {
  A: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900' },
  B: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-900' },
  C: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900' },
  D: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-900' },
};

const BLURB_BY_BAND: Record<VocabBand, string> = {
  A: 'Everyday core lexis — CEFR A1/A2, ranked among the highest-frequency English vocabulary in BNC/COCA.',
  B: 'Independent-user vocabulary — CEFR B1/B2, common in general written and spoken English but outside the published Coxhead academic register.',
  C: 'Academic register — published in the Coxhead 2000 Academic Word List, the reference TOEFL/IELTS/GRE materials cite.',
  D: 'Specialist or rare lexis — CEFR C1/C2 with low corpus rank, neither everyday nor Coxhead-academic.',
};

export interface CrosswalkWordResult {
  /** Tier band A/B/C/D. */
  band: VocabBand;
  /** Short verdict label (≤10 chars) — safe for title.absolute. */
  verdict: VocabVerdict;
  /** CEFR tier (A1..C2) — surfaced as part of the tier tag. */
  cefr: CefrTier;
  /** AWL sublist (1-10) if member, else null. */
  awlSublist: number | null;
  /** AWL family head word if member (e.g., 'abandon'), else null. */
  awlFamilyHead: string | null;
  /** Frequency rank in the BNC/COCA calibration (1 = most common; null if unranked). */
  frequencyRank: number | null;
  /** Short tier tag for in-title parenthetical (e.g., "CEFR A1", "AWL Sublist 7"). */
  tierTag: string;
  /** Tone classes for body chip rendering. */
  tone: { bg: string; border: string; text: string };
  /** 1-line gloss for body chip. */
  blurb: string;
}

/**
 * Decode a /word/[slug]/ entry into a CrosswalkResult. Caller provides the
 * already-fetched DB row so this stays pure (no I/O).
 */
export function decodeWordCrosswalk(input: {
  word: string;
  frequency: number | null | undefined;
  level: string | null | undefined;
}): CrosswalkWordResult {
  const cefr = classifyCEFR({
    word: input.word,
    frequency: input.frequency,
    level: input.level,
  });
  const awlSublist = getAwlSublist(input.word);
  const awlEntry = awlSublist ? getAwlEntry(input.word) : null;

  let band: VocabBand;
  if (awlSublist) {
    band = 'C';
  } else if (cefr === 'A1' || cefr === 'A2') {
    band = 'A';
  } else if (cefr === 'B1' || cefr === 'B2') {
    band = 'B';
  } else {
    band = 'D';
  }

  const tierTag = awlSublist ? `AWL Sublist ${awlSublist}` : `CEFR ${cefr}`;

  return {
    band,
    verdict: VERDICT_BY_BAND[band],
    cefr,
    awlSublist,
    awlFamilyHead: awlEntry?.head ?? null,
    frequencyRank: input.frequency && input.frequency > 0 ? input.frequency : null,
    tierTag,
    tone: TONE_BY_BAND[band],
    blurb: BLURB_BY_BAND[band],
  };
}

/**
 * Build the absolute title for /word/[slug]/ pages.
 *
 * Format: `{word} — {Verdict} ({TierTag})` — drops the legacy
 * " | VocabWize" suffix via title.absolute (suffix is 12c, falls in the
 * §4.0 9-12 sub-band; longest_word 20c + longest_body 25c puts the
 * with-suffix total at the 58c boundary, so title.absolute is the safe
 * call per the playbook table).
 *
 * Worst-case length (measured 2026-05-20 over 20,051-word keep set):
 *   "disproportionately — Academic (AWL Sublist 3)" → 45c (15c margin)
 *   "uncharacteristically — Specialist (CEFR C1)"  → 43c (17c margin)
 *
 * Returns null when length > 58c (honest-skip per §4.5 — caller falls back
 * to the diversified original-title path). Guard provides headroom for any
 * future keep-set extension.
 */
export function buildWordP1Title(word: string, result: CrosswalkWordResult): string | null {
  // 2026-07-03 Bing CTR fix: searchers type «{word} meaning» — the
  // verdict-only title earned pos 7-10 impressions with zero clicks
  // (dicionariowize «significado» precedent). Intent word first, verdict
  // kept as the differentiator.
  const title = `${word}: meaning — ${result.verdict} (${result.tierTag})`;
  if (title.length > 58) return null;
  return title;
}

/**
 * Map a CrosswalkWordResult into structured variableMeasured PropertyValue
 * entries for Dataset JSON-LD (P4 emission).
 */
export function wordVariableMeasured(result: CrosswalkWordResult): Record<string, unknown>[] {
  const pvs: Record<string, unknown>[] = [
    {
      '@type': 'PropertyValue',
      name: 'VocabularyVerdict',
      value: result.verdict,
      description: `Crosswalk verdict band ${result.band} — ${result.blurb}`,
    },
    {
      '@type': 'PropertyValue',
      name: 'CEFRTier',
      value: result.cefr,
    },
    {
      '@type': 'PropertyValue',
      name: 'AWLMember',
      value: result.awlSublist !== null,
    },
  ];
  if (result.awlSublist !== null) {
    pvs.push({
      '@type': 'PropertyValue',
      name: 'AWLSublist',
      value: result.awlSublist,
      maxValue: 10,
    });
  }
  if (result.frequencyRank !== null) {
    pvs.push({
      '@type': 'PropertyValue',
      name: 'CorpusFrequencyRank',
      value: result.frequencyRank,
      description: 'BNC/COCA-calibrated frequency rank (1 = most common)',
    });
  }
  return pvs;
}

/**
 * Verdict band cutoff table — exposed so the methodology page can render the
 * cutoff in the same shape used by other portfolio sites.
 */
export const VOCAB_BAND_TABLE: { band: VocabBand; verdict: VocabVerdict; criterion: string; example: string }[] = [
  { band: 'A', verdict: 'Core', criterion: 'CEFR A1/A2, NOT in AWL', example: 'run, cat, about' },
  { band: 'B', verdict: 'General', criterion: 'CEFR B1/B2, NOT in AWL', example: 'excellent, beautiful, paradigm (in B for non-AWL forms)' },
  { band: 'C', verdict: 'Academic', criterion: 'Coxhead 2000 AWL member (any sublist)', example: 'analyze, paradigm, corroborate' },
  { band: 'D', verdict: 'Specialist', criterion: 'CEFR C1/C2, NOT in AWL', example: 'abbey, abbot, uncharacteristically' },
];
