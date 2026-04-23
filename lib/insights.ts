export interface Insight {
  text: string;
  sentiment?: "positive" | "negative" | "neutral";
}

interface WordData {
  word: string;
  frequency: number;
  level: string | null;
  pos: string | null;
  etymology: string | null;
  usage_note: string | null;
  synonymCount: number;
  antonymCount: number;
  frequencyPercentile: number;
}

export function generateInsights(data: WordData): Insight[] {
  const insights: Insight[] = [];
  const top = Math.max(1, 100 - data.frequencyPercentile);

  // 1. Frequency rank insight
  if (data.frequency > 0) {
    if (top <= 5) {
      insights.push({
        text: `"${data.word}" is in the top ${top}% of English by usage frequency — one of the most common words you will encounter daily.`,
        sentiment: "positive",
      });
    } else if (top <= 20) {
      insights.push({
        text: `"${data.word}" ranks in the top ${top}% by frequency. You will see it regularly in news, books, and conversation.`,
        sentiment: "positive",
      });
    } else {
      insights.push({
        text: `"${data.word}" is a less common word (top ${top}% by frequency). Knowing it gives you an edge in formal and academic contexts.`,
        sentiment: "neutral",
      });
    }
  }

  // 2. Proficiency level context
  if (data.level) {
    const levelMap: Record<string, { label: string; exams: string; sentiment: Insight["sentiment"] }> = {
      basic: { label: "Basic", exams: "TOEFL iBT 30-60, IELTS 3-4", sentiment: "positive" },
      intermediate: { label: "Intermediate", exams: "TOEFL iBT 60-90, IELTS 5-6, SAT verbal", sentiment: "neutral" },
      advanced: { label: "Advanced", exams: "TOEFL iBT 90+, IELTS 7+, GRE verbal", sentiment: "neutral" },
      academic: { label: "Academic", exams: "GRE, GMAT, graduate-level reading", sentiment: "negative" },
    };
    const info = levelMap[data.level];
    if (info) {
      insights.push({
        text: `${info.label}-level vocabulary — typically tested at ${info.exams}. ${data.level === "basic" ? "Master this word early." : "Invest time learning its nuances."}`,
        sentiment: info.sentiment,
      });
    }
  }

  // 3. Etymology origin hint
  if (data.etymology) {
    const origin = data.etymology.toLowerCase();
    const lang = origin.includes("latin") ? "Latin"
      : origin.includes("greek") ? "Greek"
      : origin.includes("french") ? "French"
      : origin.includes("german") || origin.includes("germanic") ? "Germanic"
      : origin.includes("old english") ? "Old English"
      : null;
    if (lang) {
      insights.push({
        text: `Rooted in ${lang}. Words with ${lang} origins often share patterns — learning the root helps you decode related words.`,
        sentiment: "positive",
      });
    }
  }

  // 4. Usage tip based on POS
  if (data.pos) {
    const posTips: Record<string, string> = {
      noun: "As a noun, pay attention to countability (a/an vs. uncountable) and common collocations.",
      verb: "As a verb, check which prepositions it pairs with and whether meaning shifts between literal and figurative use.",
      adjective: "As an adjective, note whether it sounds natural in speech or belongs to written register only.",
      adverb: "As an adverb, placement in the sentence changes emphasis — experiment with position.",
    };
    const tip = posTips[data.pos.toLowerCase()];
    if (tip) {
      insights.push({ text: tip, sentiment: "neutral" });
    }
  }

  // 5. Synonym/antonym network size
  const total = data.synonymCount + data.antonymCount;
  if (total >= 6) {
    insights.push({
      text: `Rich word family: ${data.synonymCount} synonyms and ${data.antonymCount} antonyms. Words with large networks are easier to remember through association.`,
      sentiment: "positive",
    });
  } else if (total > 0) {
    insights.push({
      text: `${data.synonymCount} synonym${data.synonymCount !== 1 ? "s" : ""} and ${data.antonymCount} antonym${data.antonymCount !== 1 ? "s" : ""} — learn them together for stronger retention.`,
      sentiment: "neutral",
    });
  }

  return insights.slice(0, 5);
}
