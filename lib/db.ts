import Database from 'better-sqlite3';
import path from 'path';
import { createDbFromInstance } from '../../_shared/vocab-core/db';

export type { Word } from '../../_shared/vocab-core/types';

const DB_PATH = path.join(process.cwd(), 'data', 'vocab.db');
let _db: Database.Database | null = null;
function getDbInstance(): Database.Database {
  if (!_db) _db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  return _db;
}

const db = createDbFromInstance(getDbInstance());

// Re-export all functions from the shared db instance
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

// Legacy aliases
export const countWords = db.getWordCount;
export { getCurrentWeek } from '../../_shared/vocab-core/db';
