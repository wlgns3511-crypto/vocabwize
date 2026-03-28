import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'vocab.db');
let _db: Database.Database | null = null;
function getDb(): Database.Database {
  if (!_db) _db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  return _db;
}

export interface Word {
  slug: string; word: string; phonetic: string | null;
  definition: string; pos: string | null;
  frequency: number; exchange: string | null;
  examples: string | null; etymology: string | null;
  synonyms: string | null; antonyms: string | null;
  level: string | null; usage_note: string | null;
}

export function getWordBySlug(slug: string): Word | undefined {
  return getDb().prepare('SELECT * FROM words WHERE slug = ?').get(slug) as Word | undefined;
}

export function getAllWords(): Word[] {
  return getDb().prepare('SELECT * FROM words ORDER BY word').all() as Word[];
}

export function getTopWords(limit = 3000): Word[] {
  return getDb().prepare('SELECT * FROM words WHERE frequency > 0 ORDER BY frequency DESC LIMIT ?').all(limit) as Word[];
}

export function getWordCount(): number {
  return (getDb().prepare('SELECT COUNT(*) as c FROM words').get() as { c: number }).c;
}

export function getWordSlugsPage(offset: number, limit: number): { slug: string }[] {
  return getDb().prepare('SELECT slug FROM words ORDER BY frequency DESC, word ASC LIMIT ? OFFSET ?').all(limit, offset) as { slug: string }[];
}

export function getWordsByLetter(letter: string, limit = 500): Word[] {
  return getDb().prepare('SELECT * FROM words WHERE slug LIKE ? ORDER BY frequency DESC, word LIMIT ?').all(letter.toLowerCase() + '%', limit) as Word[];
}

export function getSimilarWords(slug: string, limit = 10): Word[] {
  const prefix = slug.substring(0, 3);
  return getDb().prepare('SELECT * FROM words WHERE slug LIKE ? AND slug != ? ORDER BY frequency DESC LIMIT ?').all(prefix + '%', slug, limit) as Word[];
}

export function getTopComparisons(limit = 500): { slugA: string; slugB: string }[] {
  // Common confusing word pairs
  const confusing = [
    ['affect', 'effect'], ['accept', 'except'], ['than', 'then'],
    ['their', 'there'], ['your', "you-re"], ['its', "it-s"],
    ['lose', 'loose'], ['who', 'whom'], ['lay', 'lie'],
    ['farther', 'further'], ['principle', 'principal'], ['stationary', 'stationery'],
    ['complement', 'compliment'], ['advice', 'advise'], ['ensure', 'insure'],
    ['emigrate', 'immigrate'], ['elicit', 'illicit'], ['allusion', 'illusion'],
    ['desert', 'dessert'], ['discreet', 'discrete'], ['eminent', 'imminent'],
    ['historic', 'historical'], ['imply', 'infer'], ['precede', 'proceed'],
  ];

  const pairs: { slugA: string; slugB: string }[] = confusing.map(([a, b]) => {
    const [x, y] = [a, b].sort();
    return { slugA: x, slugB: y };
  });

  // Also generate pairs from top words
  const top = getDb().prepare('SELECT slug FROM words WHERE frequency > 1000 ORDER BY frequency DESC LIMIT 100').all() as { slug: string }[];
  for (let i = 0; i < top.length && pairs.length < limit; i++) {
    for (let j = i + 1; j < top.length && pairs.length < limit; j++) {
      const [a, b] = [top[i].slug, top[j].slug].sort();
      pairs.push({ slugA: a, slugB: b });
    }
  }
  return pairs.slice(0, limit);
}

export function countWords(): number {
  return (getDb().prepare('SELECT COUNT(*) as c FROM words').get() as { c: number }).c;
}

// --- Word length queries (for Wordle-style searches) ---

export function getWordsByLength(length: number, limit = 200): Word[] {
  return getDb().prepare('SELECT * FROM words WHERE LENGTH(word) = ? ORDER BY frequency DESC LIMIT ?').all(length, limit) as Word[];
}

export function getAvailableLengths(): number[] {
  return (getDb().prepare('SELECT DISTINCT LENGTH(word) as len FROM words WHERE LENGTH(word) BETWEEN 3 AND 15 ORDER BY len').all() as { len: number }[]).map(r => r.len);
}

// --- Rhyming words (simple suffix match) ---

export function getRhymingWords(slug: string, limit = 30): Word[] {
  const word = getWordBySlug(slug);
  if (!word) return [];
  // Get last 3 chars as rhyme pattern
  const w = word.word.toLowerCase();
  const suffix = w.length >= 3 ? w.slice(-3) : w.slice(-2);
  return getDb().prepare('SELECT * FROM words WHERE word LIKE ? AND slug != ? ORDER BY frequency DESC LIMIT ?')
    .all('%' + suffix, slug, limit) as Word[];
}

// --- POS (Part of Speech) queries ---

export function getWordsByPOS(pos: string, limit = 200): Word[] {
  return getDb().prepare('SELECT * FROM words WHERE pos LIKE ? ORDER BY frequency DESC LIMIT ?')
    .all('%' + pos + '%', limit) as Word[];
}

export function getPopularWords(limit = 10): Word[] {
  return getDb().prepare('SELECT * FROM words WHERE frequency > 0 ORDER BY frequency DESC LIMIT ?').all(limit) as Word[];
}
