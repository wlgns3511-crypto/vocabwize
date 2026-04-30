"use client";

export function FrequencyMeter({ frequency, maxFrequency = 50000 }: { frequency: number | null; maxFrequency?: number }) {
  if (frequency === null || frequency === 0) return null;

  // Rank-form: frequency=1 is the most common word, frequency=maxFrequency
  // the least common. Convert rank → commonness pct (rank 1 → 100, max → 0).
  const commonness = Math.max(0, 1 - (frequency - 1) / Math.max(maxFrequency - 1, 1));
  const pct = Math.round(commonness * 100);

  const label = pct >= 75 ? "Very Common" : pct >= 50 ? "Common" : pct >= 25 ? "Uncommon" : "Rare";
  const color = pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : pct >= 25 ? "bg-orange-500" : "bg-red-500";
  const textColor = pct >= 75 ? "text-green-700" : pct >= 50 ? "text-yellow-700" : pct >= 25 ? "text-orange-700" : "text-red-700";

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-600">Word Frequency</span>
        <span className={`text-sm font-semibold ${textColor}`}>{label}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
    </div>
  );
}
