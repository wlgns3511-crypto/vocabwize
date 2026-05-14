/**
 * Academic Word List (AWL) classifier — Coxhead 2000.
 *
 * Maps any word form to one of the 10 Coxhead sublists (1 = most frequent in
 * academic prose, 10 = least). Returns null if the word is not in the AWL.
 *
 * Why this is separate from the DB `level='academic'` flag:
 *   The vocab.db `level` column is heuristic (mostly Latin/scientific noise);
 *   the AWL is a fixed published artefact (Averil Coxhead, 2000) of 570 word
 *   families × 10 sublists, derived from a 3.5M-word academic corpus. We
 *   surface AWL sublist membership as an independent signal — it is the
 *   authoritative source for "academic register" claims and is what TOEFL/
 *   IELTS preparation materials cite.
 */
import data from './generated/awl-sublist.json';

export const AWL_FAMILY_COUNT = 570;
export const AWL_SUBLIST_COUNT = 10;

type SublistKey =
  | 'sublist1' | 'sublist2' | 'sublist3' | 'sublist4' | 'sublist5'
  | 'sublist6' | 'sublist7' | 'sublist8' | 'sublist9' | 'sublist10';

type AwlEntry = {
  sublist: number;
  head: string;
  family: readonly string[];
};

const SUBLIST_KEYS: SublistKey[] = [
  'sublist1', 'sublist2', 'sublist3', 'sublist4', 'sublist5',
  'sublist6', 'sublist7', 'sublist8', 'sublist9', 'sublist10',
];

const INDEX: Map<string, AwlEntry> = (() => {
  const m = new Map<string, AwlEntry>();
  for (let i = 0; i < SUBLIST_KEYS.length; i++) {
    const key = SUBLIST_KEYS[i];
    const sublist = i + 1;
    const lines = (data as unknown as Record<string, string[]>)[key] || [];
    for (const line of lines) {
      const tokens = line.split(/\s+/).filter(Boolean);
      if (!tokens.length) continue;
      const head = tokens[0];
      const family = tokens;
      const entry: AwlEntry = { sublist, head, family };
      for (const t of tokens) {
        const norm = t.toLowerCase();
        if (!m.has(norm)) m.set(norm, entry);
      }
    }
  }
  return m;
})();

/** Returns the AWL sublist (1..10) for the given word, or null if not in AWL. */
export function getAwlSublist(word: string): number | null {
  if (!word) return null;
  const e = INDEX.get(word.toLowerCase());
  return e ? e.sublist : null;
}

/** Returns the AWL headword and family for the given word, or null if not in AWL. */
export function getAwlEntry(word: string): AwlEntry | null {
  if (!word) return null;
  return INDEX.get(word.toLowerCase()) ?? null;
}

/** Count of distinct family members per sublist — for the methodology guide. */
export function getAwlSublistFamilyCount(sublist: number): number {
  if (sublist < 1 || sublist > 10) return 0;
  const key = SUBLIST_KEYS[sublist - 1];
  const lines = (data as unknown as Record<string, string[]>)[key] || [];
  return lines.length;
}

/**
 * Human-readable interpretation of an AWL sublist position.
 * Sublist 1 = most common in academic texts, Sublist 10 = rarest.
 */
export function describeAwlSublist(sublist: number): string {
  if (sublist === 1) return 'most frequent academic register (Coxhead 2000 Sublist 1)';
  if (sublist === 2) return 'high-frequency academic register (Sublist 2)';
  if (sublist === 3) return 'high-frequency academic register (Sublist 3)';
  if (sublist <= 5) return `mid-frequency academic register (Sublist ${sublist})`;
  if (sublist <= 8) return `lower-frequency academic register (Sublist ${sublist})`;
  return `rare academic register (Sublist ${sublist})`;
}
