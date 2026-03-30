import Database from 'better-sqlite3';
import path from 'path';

export interface Word {
  slug: string;
  word: string;
  phonetic: string | null;
  definition: string;
  pos: string | null;
  frequency: number;
  exchange: string | null;
  examples: string | null;
  etymology: string | null;
  synonyms: string | null;
  antonyms: string | null;
  level: string | null;
  usage_note: string | null;
}

const DB_PATH = path.join(process.cwd(), 'data', 'vocab.db');
let _db: Database.Database | null = null;
function getDbInstance(): Database.Database {
  if (!_db) _db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  return _db;
}

export function getCurrentWeek(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil((diff / oneWeek + start.getDay() + 1) / 7);
}

function createDb(db: Database.Database) {
  function getWordBySlug(slug: string): Word | undefined {
    return db.prepare('SELECT * FROM words WHERE slug = ?').get(slug) as Word | undefined;
  }
  function getAllWords(): Word[] {
    return db.prepare('SELECT * FROM words ORDER BY word').all() as Word[];
  }
  function getTopWords(limit = 3000): Word[] {
    return db.prepare('SELECT * FROM words WHERE frequency > 0 ORDER BY frequency DESC LIMIT ?').all(limit) as Word[];
  }
  function getWordCount(): number {
    return (db.prepare('SELECT COUNT(*) as c FROM words').get() as { c: number }).c;
  }
  function getWordSlugsPage(offset: number, limit: number): { slug: string }[] {
    return db.prepare('SELECT slug FROM words ORDER BY frequency DESC, word ASC LIMIT ? OFFSET ?').all(Number(limit), Number(offset)) as { slug: string }[];
  }
  function getWordsByLetter(letter: string, limit = 500): Word[] {
    return db.prepare('SELECT * FROM words WHERE slug LIKE ? ORDER BY frequency DESC, word LIMIT ?').all(letter.toLowerCase() + '%', limit) as Word[];
  }
  function getSimilarWords(slug: string, limit = 10): Word[] {
    const prefix = slug.substring(0, 3);
    return db.prepare('SELECT * FROM words WHERE slug LIKE ? AND slug != ? ORDER BY frequency DESC LIMIT ?').all(prefix + '%', slug, limit) as Word[];
  }
  function getTopComparisons(limit = 500): { slugA: string; slugB: string }[] {
    const top = db.prepare('SELECT slug FROM words WHERE frequency > 1000 ORDER BY frequency DESC LIMIT 100').all() as { slug: string }[];
    const pairs: { slugA: string; slugB: string }[] = [];
    for (let i = 0; i < top.length && pairs.length < limit; i++) {
      for (let j = i + 1; j < top.length && pairs.length < limit; j++) {
        const [a, b] = [top[i].slug, top[j].slug].sort();
        pairs.push({ slugA: a, slugB: b });
      }
    }
    return pairs.slice(0, limit);
  }
  function getWordsByLength(length: number, limit = 200): Word[] {
    return db.prepare('SELECT * FROM words WHERE LENGTH(word) = ? ORDER BY frequency DESC LIMIT ?').all(length, limit) as Word[];
  }
  function getAvailableLengths(): number[] {
    return (db.prepare('SELECT DISTINCT LENGTH(word) as len FROM words WHERE LENGTH(word) BETWEEN 3 AND 15 ORDER BY len').all() as { len: number }[]).map(r => r.len);
  }
  function getRhymingWords(slug: string, limit = 30): Word[] {
    const word = getWordBySlug(slug);
    if (!word) return [];
    const w = word.word.toLowerCase();
    const suffix = w.length >= 3 ? w.slice(-3) : w.slice(-2);
    return db.prepare('SELECT * FROM words WHERE word LIKE ? AND slug != ? ORDER BY frequency DESC LIMIT ?')
      .all('%' + suffix, slug, limit) as Word[];
  }
  function getWordsByPOS(pos: string, limit = 200): Word[] {
    return db.prepare('SELECT * FROM words WHERE pos LIKE ? ORDER BY frequency DESC LIMIT ?')
      .all('%' + pos + '%', limit) as Word[];
  }
  function getPopularWords(limit = 10): Word[] {
    return db.prepare('SELECT * FROM words WHERE frequency > 0 ORDER BY frequency DESC LIMIT ?').all(limit) as Word[];
  }
  function getWordsBySamePOS(pos: string | null, excludeSlug: string, limit = 6): Word[] {
    if (!pos) return [];
    return db.prepare('SELECT * FROM words WHERE pos = ? AND slug != ? ORDER BY frequency DESC LIMIT ?')
      .all(pos, excludeSlug, limit) as Word[];
  }
  function getWordsBySameLevel(level: string | null, excludeSlug: string, limit = 6): Word[] {
    if (!level) return [];
    return db.prepare('SELECT * FROM words WHERE level = ? AND slug != ? ORDER BY frequency DESC LIMIT ?')
      .all(level, excludeSlug, limit) as Word[];
  }
  function getRandomWords(limit = 20): Word[] {
    return db.prepare('SELECT * FROM words ORDER BY RANDOM() LIMIT ?').all(limit) as Word[];
  }
  function searchWords(query: string, limit = 50): Word[] {
    const q = `%${query}%`;
    return db.prepare('SELECT * FROM words WHERE word LIKE ? OR definition LIKE ? ORDER BY frequency DESC LIMIT ?')
      .all(q, q, limit) as Word[];
  }
  function getRotatingComparisons(limit = 2000): { slugA: string; slugB: string }[] {
    const week = getCurrentWeek();
    const offset = ((week - 1) % 50) * limit;
    const top = db.prepare('SELECT slug FROM words WHERE frequency > 0 ORDER BY frequency DESC LIMIT ? OFFSET ?')
      .all(200, offset % 160000) as { slug: string }[];
    const pairs: { slugA: string; slugB: string }[] = [];
    for (let i = 0; i < top.length && pairs.length < limit; i++) {
      for (let j = i + 1; j < top.length && pairs.length < limit; j++) {
        const [a, b] = [top[i].slug, top[j].slug].sort();
        pairs.push({ slugA: a, slugB: b });
      }
    }
    return pairs;
  }
  return {
    getWordBySlug, getAllWords, getTopWords, getWordCount, getWordSlugsPage,
    getWordsByLetter, getSimilarWords, getTopComparisons, getWordsByLength,
    getAvailableLengths, getRhymingWords, getWordsByPOS, getPopularWords,
    getWordsBySamePOS, getWordsBySameLevel, getRandomWords, getRotatingComparisons,
    searchWords,
    getLongestWords,
    getShortestWords,
  };
  function getLongestWords(limit = 50): Word[] {
    return db.prepare('SELECT * FROM words ORDER BY LENGTH(word) DESC LIMIT ?').all(limit) as Word[];
  }
  function getShortestWords(limit = 50): Word[] {
    return db.prepare('SELECT * FROM words WHERE LENGTH(word) >= 2 ORDER BY LENGTH(word) ASC, frequency DESC LIMIT ?').all(limit) as Word[];
  }
}

const db = createDb(getDbInstance());

export const getWordBySlug = db.getWordBySlug;
export const getAllWords = db.getAllWords;
export const getTopWords = db.getTopWords;
export const getWordCount = db.getWordCount;
export const getWordSlugsPage = db.getWordSlugsPage;
export const getWordsByLetter = db.getWordsByLetter;
export const getSimilarWords = db.getSimilarWords;
export const getTopComparisons = db.getTopComparisons;
export const getWordsByLength = db.getWordsByLength;
export const getAvailableLengths = db.getAvailableLengths;
export const getRhymingWords = db.getRhymingWords;
export const getWordsByPOS = db.getWordsByPOS;
export const getPopularWords = db.getPopularWords;
export const getWordsBySamePOS = db.getWordsBySamePOS;
export const getWordsBySameLevel = db.getWordsBySameLevel;
export const getRandomWords = db.getRandomWords;
export const getRotatingComparisons = db.getRotatingComparisons;
export const countWords = db.getWordCount;
export const searchWords = db.searchWords;
export const getLongestWords = db.getLongestWords;
export const getShortestWords = db.getShortestWords;
