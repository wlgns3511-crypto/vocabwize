"use client";

interface WordLevelCheckerProps {
  word: string;
  frequency: number | null;
  pos: string | null;
  level: string | null;
}

const LEVEL_CONFIG: Record<string, { label: string; cefr: string; color: string; barPct: number; exams: string[] }> = {
  basic:        { label: "Basic",        cefr: "A1-A2", color: "emerald", barPct: 20,  exams: ["TOEFL (foundation)", "IELTS 3-4"] },
  intermediate: { label: "Intermediate", cefr: "B1-B2", color: "blue",    barPct: 45,  exams: ["TOEFL iBT 60-90", "IELTS 5-6", "Cambridge FCE"] },
  advanced:     { label: "Advanced",     cefr: "B2-C1", color: "orange",  barPct: 70,  exams: ["TOEFL iBT 90+", "IELTS 7+", "GRE Verbal", "Cambridge CAE"] },
  academic:     { label: "Academic",     cefr: "C1-C2", color: "purple",  barPct: 90,  exams: ["GRE Verbal (high)", "TOEFL iBT 100+", "IELTS 8+", "Cambridge CPE"] },
};

function inferLevelFromFrequency(frequency: number | null): string {
  if (!frequency) return "intermediate";
  if (frequency <= 1000) return "basic";
  if (frequency <= 3000) return "intermediate";
  if (frequency <= 6000) return "advanced";
  return "academic";
}

export function WordLevelChecker({ word, frequency, pos, level }: WordLevelCheckerProps) {
  const effectiveLevel = level || inferLevelFromFrequency(frequency);
  const config = LEVEL_CONFIG[effectiveLevel] || LEVEL_CONFIG.intermediate;

  const colorMap: Record<string, { bg: string; text: string; bar: string; badge: string; border: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800", border: "border-emerald-200" },
    blue:    { bg: "bg-blue-50",    text: "text-blue-700",    bar: "bg-blue-500",    badge: "bg-blue-100 text-blue-800",    border: "border-blue-200" },
    orange:  { bg: "bg-orange-50",  text: "text-orange-700",  bar: "bg-orange-500",  badge: "bg-orange-100 text-orange-800",  border: "border-orange-200" },
    purple:  { bg: "bg-purple-50",  text: "text-purple-700",  bar: "bg-purple-500",  badge: "bg-purple-100 text-purple-800",  border: "border-purple-200" },
  };
  const c = colorMap[config.color] || colorMap.blue;

  const priority =
    effectiveLevel === "basic" ? "Essential — learn first" :
    effectiveLevel === "intermediate" ? "High priority for everyday fluency" :
    effectiveLevel === "advanced" ? "Valuable for professional English" :
    "Specialized — exam & academic contexts";

  return (
    <section className={`${c.bg} border ${c.border} rounded-xl p-5 mb-8`}>
      <h2 className="text-lg font-bold text-slate-800 mb-1">Word Level Checker</h2>
      <p className="text-xs text-slate-500 mb-4">
        Difficulty assessment and exam relevance for &ldquo;{word}&rdquo;
      </p>

      {/* Badge + CEFR */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${c.badge}`}>
          {config.cefr}
        </span>
        <span className={`text-sm font-semibold ${c.text}`}>
          {config.label}
        </span>
        {pos && (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
            {pos}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>A1 Beginner</span>
          <span>C2 Mastery</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 relative">
          <div
            className={`${c.bar} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${config.barPct}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-400 rounded-full shadow"
            style={{ left: `calc(${config.barPct}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Common</span>
          <span>Rare</span>
        </div>
      </div>

      {/* Exam relevance */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Exam Relevance
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {config.exams.map((exam) => (
            <span
              key={exam}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
            >
              {exam}
            </span>
          ))}
        </div>
      </div>

      {/* Learning priority */}
      <div className={`rounded-lg p-3 ${c.bg}`}>
        <p className="text-sm">
          <strong className={c.text}>Learning priority:</strong>{" "}
          <span className="text-slate-700">{priority}</span>
        </p>
        {frequency && (
          <p className="text-xs text-slate-500 mt-1">
            Frequency rank: ~{frequency.toLocaleString()} (
            {frequency <= 1000
              ? "top 1,000 — core vocabulary"
              : frequency <= 3000
              ? "top 3,000 — TOEFL range"
              : frequency <= 6000
              ? "top 6,000 — GRE range"
              : "beyond 6,000 — specialized"}
            )
          </p>
        )}
      </div>
    </section>
  );
}
