import { getTopWords } from "@/lib/db";

export async function GET() {
  // Get a pool of words that have definitions
  const allWords = getTopWords(500).filter(
    (w) => w.definition && w.definition.length > 10
  );

  if (allWords.length < 4) {
    return Response.json({ error: "Not enough words" }, { status: 500 });
  }

  // Pick 10 random questions
  const questions = [];
  const used = new Set<string>();

  for (let q = 0; q < 10 && used.size < allWords.length - 3; q++) {
    // Pick a correct answer
    let correctIdx: number;
    do {
      correctIdx = Math.floor(Math.random() * allWords.length);
    } while (used.has(allWords[correctIdx].slug));
    used.add(allWords[correctIdx].slug);

    const correct = allWords[correctIdx];

    // Pick 3 wrong options
    const options = [{ word: correct.word, slug: correct.slug }];
    const wrongUsed = new Set<number>([correctIdx]);
    while (options.length < 4) {
      const idx = Math.floor(Math.random() * allWords.length);
      if (!wrongUsed.has(idx)) {
        wrongUsed.add(idx);
        options.push({ word: allWords[idx].word, slug: allWords[idx].slug });
      }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    questions.push({
      definition: correct.definition,
      pos: correct.pos,
      correctSlug: correct.slug,
      options,
    });
  }

  return Response.json({ questions });
}
