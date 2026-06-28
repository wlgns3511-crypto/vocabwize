export interface VocabProprietaryMetrics {
  complexityScore: number;
  rarityScore: number;
  utilityScore: number;
  overallGrade: string;
  commentary: string;
}

/**
 * Returns a deterministic commentary paragraph based on word details and slug-based hash
 * to rotate content variation and prevent duplicate content.
 */
function getDeterministicCommentary(
  word: string,
  overallScore: number,
  slug: string
): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 3;

  let key = 'STANDARD_FUNCTIONAL';
  if (overallScore >= 75) {
    key = 'ADVANCED_ACADEMIC';
  } else if (overallScore < 50) {
    key = 'LITERARY_RARE';
  }

  const variations: Record<string, string[]> = {
    ADVANCED_ACADEMIC: [
      `The word "${word}" exhibits a high linguistic footprint, typical of academic literature and professional registers. Mastery of this term significantly boosts writing precision and comprehension of complex texts.`,
      `Positioned as a highly sophisticated lexical unit, "${word}" is frequently utilized in formal and scholarly contexts. Incorporating it into active vocabulary enhances academic literacy and expressive power.`,
      `With a high complexity and utility profile, "${word}" represents a key asset for advanced English learners. Its presence in standard exam syllabi highlights its long-term study value.`
    ],
    STANDARD_FUNCTIONAL: [
      `As a standard functional word, "${word}" forms the backbone of everyday conversation and intermediate reading materials. It offers excellent utility-to-effort efficiency for general communication.`,
      `This word "${word}" is a core component of natural, fluent communication. It provides solid semantic value without excessive phonetic or orthographic complexity, making it highly recommended for active usage.`,
      `Falling into the intermediate vocabulary band, "${word}" is essential for transitioning from basic literacy to expressive fluency. Its frequent appearance in media ensures high real-world relevance.`
    ],
    LITERARY_RARE: [
      `The term "${word}" is a specialized or low-frequency word, often reserved for specific literary, technical, or historical contexts. While less common in daily speech, it adds rich nuance when used correctly.`,
      `Characterized by its rarity, "${word}" offers unique stylistic value for creative writing and precise jargon. Learners should focus on passive recognition before attempting active integration.`,
      `A low-frequency lexical item "${word}" serves as an expressive nuance rather than a daily necessity. Familiarity with this term reflects a highly developed, mature vocabulary.`
    ]
  };

  const list = variations[key] || variations['STANDARD_FUNCTIONAL'];
  return list[index];
}

/**
 * Calculates proprietary vocabulary metrics for VocabWize.
 */
export function calculateProprietaryMetrics(
  word: string,
  slug: string,
  level: string | null,
  frequencyPercentile: number,
  hasSynonyms: boolean,
  hasExamples: boolean
): VocabProprietaryMetrics {
  // 1. Linguistic Complexity Index (15-99)
  let complexityScore = Math.min(45, word.length * 6);
  
  // Unique letter ratio bonus
  const uniqueLetters = new Set(word.toLowerCase().replace(/[^a-z]/g, '')).size;
  const uniqueRatio = word.length > 0 ? uniqueLetters / word.length : 1;
  complexityScore += Math.round(uniqueRatio * 15);

  // Level factor
  const cleanLevel = (level || '').toLowerCase().trim();
  if (cleanLevel === 'basic') {
    complexityScore += 10;
  } else if (cleanLevel === 'intermediate') {
    complexityScore += 25;
  } else if (cleanLevel === 'advanced') {
    complexityScore += 45;
  } else if (cleanLevel === 'academic') {
    complexityScore += 60;
  } else {
    complexityScore += 20;
  }
  complexityScore = Math.max(15, Math.min(99, complexityScore));

  // 2. Rarity Score (12-99) — higher means more rare / less frequent
  const rarityScore = Math.max(12, Math.min(99, Math.round(100 - frequencyPercentile)));

  // 3. Utility Score (30-98)
  let utilityScore = 50;
  if (cleanLevel === 'basic') {
    utilityScore = 80;
  } else if (cleanLevel === 'intermediate') {
    utilityScore = 90;
  } else if (cleanLevel === 'academic') {
    utilityScore = 95;
  } else if (cleanLevel === 'advanced') {
    utilityScore = 75;
  }

  if (hasSynonyms) utilityScore += 8;
  if (hasExamples) utilityScore += 5;
  utilityScore = Math.max(30, Math.min(98, utilityScore));

  // 4. Overall Grade
  const composite = complexityScore * 0.4 + rarityScore * 0.2 + utilityScore * 0.4;

  let overallGrade = 'C';
  if (composite >= 90) overallGrade = 'A+';
  else if (composite >= 85) overallGrade = 'A';
  else if (composite >= 80) overallGrade = 'A-';
  else if (composite >= 75) overallGrade = 'B+';
  else if (composite >= 70) overallGrade = 'B';
  else if (composite >= 65) overallGrade = 'B-';
  else if (composite >= 60) overallGrade = 'C+';
  else if (composite >= 55) overallGrade = 'C';
  else if (composite >= 50) overallGrade = 'C-';
  else if (composite >= 40) overallGrade = 'D';
  else overallGrade = 'F';

  // 5. Commentary
  const commentary = getDeterministicCommentary(word, composite, slug);

  return {
    complexityScore,
    rarityScore,
    utilityScore,
    overallGrade,
    commentary,
  };
}
