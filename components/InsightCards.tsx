interface InsightCardsProps {
  word: string;
  frequency: number;
  frequencyPercentile: number;
  level: string | null;
  levelCount: number;
  pos: string | null;
  posCount: number;
  synonymCount: number;
  antonymCount: number;
}

function getFrequencyTier(percentile: number) {
  const top = 100 - percentile;
  if (top <= 10) return { label: "Essential", desc: "daily", border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" };
  if (top <= 30) return { label: "Common", desc: "academic", border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" };
  return { label: "Specialized", desc: "specialized", border: "border-red-200", bg: "bg-red-50", text: "text-red-700" };
}

function getLevelStyle(level: string | null) {
  switch (level) {
    case "basic": return { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" };
    case "intermediate": return { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" };
    case "advanced": return { border: "border-orange-200", bg: "bg-orange-50", text: "text-orange-700" };
    case "academic": return { border: "border-red-200", bg: "bg-red-50", text: "text-red-700" };
    default: return { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" };
  }
}

export function InsightCards({ word, frequency, frequencyPercentile, level, levelCount, pos, posCount, synonymCount, antonymCount }: InsightCardsProps) {
  const top = 100 - frequencyPercentile;
  const freqTier = getFrequencyTier(frequencyPercentile);
  const levelStyle = getLevelStyle(level);
  const levelDisplay = level ? level.charAt(0).toUpperCase() + level.slice(1) : "General";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className={`rounded-xl border p-4 ${freqTier.border} ${freqTier.bg}`}>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Usage Frequency</div>
        <div className={`text-2xl font-bold ${freqTier.text} mb-1`}>Top {Math.max(1, top)}%</div>
        <p className="text-sm text-slate-600 leading-snug">
          Top {Math.max(1, top)}% most used English word. Essential for {freqTier.desc} use.
        </p>
      </div>

      <div className={`rounded-xl border p-4 ${levelStyle.border} ${levelStyle.bg}`}>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Proficiency Level</div>
        <div className={`text-2xl font-bold ${levelStyle.text} mb-1`}>{levelDisplay}</div>
        <p className="text-sm text-slate-600 leading-snug">
          {levelDisplay} level. {levelCount > 0 ? `1 of ${levelCount.toLocaleString()} words at this level.` : ""}
        </p>
      </div>

      <div className="rounded-xl border p-4 border-blue-200 bg-blue-50">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Word Family</div>
        <div className="text-2xl font-bold text-blue-700 mb-1">{synonymCount + antonymCount} links</div>
        <p className="text-sm text-slate-600 leading-snug">
          {synonymCount} synonyms, {antonymCount} antonyms.{pos ? ` Part of speech: ${pos} (${posCount.toLocaleString()} ${pos} in database).` : ""}
        </p>
      </div>
    </div>
  );
}
