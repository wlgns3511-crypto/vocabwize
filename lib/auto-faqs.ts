import type { Word } from "./db";

export interface FaqItem {
  question: string;
  answer: string;
}

function parseJson(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

/**
 * Generate 5-6 data-driven FAQ items for an English word page.
 * Questions mirror real search patterns ("What does X mean?").
 */
export function generateWordFaqs(w: Word): FaqItem[] {
  return [];
}
