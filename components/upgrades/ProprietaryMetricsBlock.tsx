import { JSX } from "react";

interface ProprietaryMetricsBlockProps {
  complexityScore: number;
  rarityScore: number;
  utilityScore: number;
  overallGrade: string;
  commentary: string;
}

function getComplexityLevel(score: number): { label: string; color: string; ringColor: string; bg: string } {
  if (score >= 75) {
    return { label: "High Complexity", color: "text-indigo-700", ringColor: "stroke-indigo-500", bg: "bg-indigo-50" };
  }
  if (score >= 45) {
    return { label: "Moderate Complexity", color: "text-blue-700", ringColor: "stroke-blue-500", bg: "bg-blue-50" };
  }
  return { label: "Low Complexity", color: "text-green-700", ringColor: "stroke-green-500", bg: "bg-green-50" };
}

function getRarityLevel(score: number): { label: string; color: string; ringColor: string; bg: string } {
  if (score >= 75) {
    return { label: "Rare / Specialized", color: "text-purple-700", ringColor: "stroke-purple-500", bg: "bg-purple-50" };
  }
  if (score >= 40) {
    return { label: "Common Usage", color: "text-slate-600", ringColor: "stroke-slate-400", bg: "bg-slate-50" };
  }
  return { label: "Core Vocabulary", color: "text-emerald-700", ringColor: "stroke-emerald-500", bg: "bg-emerald-50" };
}

function getUtilityLevel(score: number): { label: string; color: string; ringColor: string; bg: string } {
  if (score >= 85) {
    return { label: "High Utility", color: "text-teal-700", ringColor: "stroke-teal-500", bg: "bg-teal-50" };
  }
  if (score >= 60) {
    return { label: "Moderate Utility", color: "text-amber-700", ringColor: "stroke-amber-500", bg: "bg-amber-50" };
  }
  return { label: "Selective Utility", color: "text-rose-700", ringColor: "stroke-rose-500", bg: "bg-rose-50" };
}

function getGradeStyles(grade: string): { badge: string; border: string; bg: string } {
  const cleanGrade = grade.charAt(0);
  switch (cleanGrade) {
    case "A":
      return { badge: "text-emerald-800 bg-emerald-100", border: "border-emerald-200", bg: "bg-emerald-50/30" };
    case "B":
      return { badge: "text-indigo-800 bg-indigo-100", border: "border-indigo-200", bg: "bg-indigo-50/30" };
    case "C":
      return { badge: "text-teal-900 bg-teal-100/70", border: "border-teal-100", bg: "bg-teal-50/20" };
    case "D":
    case "F":
    default:
      return { badge: "text-rose-800 bg-rose-100", border: "border-rose-200", bg: "bg-rose-50/30" };
  }
}

export function ProprietaryMetricsBlock({
  complexityScore,
  rarityScore,
  utilityScore,
  overallGrade,
  commentary,
}: ProprietaryMetricsBlockProps): JSX.Element {
  const complexity = getComplexityLevel(complexityScore);
  const rarity = getRarityLevel(rarityScore);
  const utility = getUtilityLevel(utilityScore);
  const gradeStyles = getGradeStyles(overallGrade);

  // SVG Circle parameters for progress gauge
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const complexityDashoffset = circumference - (complexityScore / 100) * circumference;
  const rarityDashoffset = circumference - (rarityScore / 100) * circumference;
  const utilityDashoffset = circumference - (utilityScore / 100) * circumference;

  return (
    <section
      data-upgrade="proprietary-metrics"
      aria-label="VocabWize Proprietary Lexical Ratings and Analysis"
      className="not-prose my-8 rounded-xl border border-indigo-100 bg-white p-5 shadow-sm"
    >
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
        <svg
          aria-hidden="true"
          className="h-4.5 w-4.5 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
          />
        </svg>
        VocabWize Lexical Value Index
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Metric Gauges Row */}
        <div className="flex flex-row items-center gap-6 flex-shrink-0">
          {/* Complexity Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                {/* Background Ring */}
                <circle
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
                {/* Active Ring */}
                <circle
                  className={`${complexity.ringColor} transition-all duration-500`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={complexityDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
              </svg>
              {/* Score Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{complexityScore}</span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider text-center max-w-[50px] leading-tight font-sans">Complexity</span>
              </div>
            </div>
            <span className={`text-xs font-bold mt-2 ${complexity.color}`}>{complexity.label}</span>
          </div>

          {/* Rarity Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                {/* Background Ring */}
                <circle
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
                {/* Active Ring */}
                <circle
                  className={`${rarity.ringColor} transition-all duration-500`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={rarityDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
              </svg>
              {/* Score Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{rarityScore}</span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider text-center max-w-[50px] leading-tight font-sans">Rarity</span>
              </div>
            </div>
            <span className={`text-xs font-bold mt-2 ${rarity.color}`}>{rarity.label}</span>
          </div>

          {/* Utility Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                {/* Background Ring */}
                <circle
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
                {/* Active Ring */}
                <circle
                  className={`${utility.ringColor} transition-all duration-500`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={utilityDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
              </svg>
              {/* Score Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{utilityScore}</span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider text-center max-w-[50px] leading-tight font-sans">Utility ROI</span>
              </div>
            </div>
            <span className={`text-xs font-bold mt-2 ${utility.color}`}>{utility.label}</span>
          </div>
        </div>

        {/* Grade Badge and Editorial Review Section */}
        <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 w-full">
          {/* Grade Badge Card */}
          <div className={`flex flex-col items-center justify-center border ${gradeStyles.border} ${gradeStyles.bg} rounded-xl px-5 py-4 w-28 text-center flex-shrink-0`}>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1 font-sans">Lexical Grade</span>
            <span className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none my-1">{overallGrade}</span>
            <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 ${gradeStyles.badge}`}>
              Calibrated
            </span>
          </div>

          {/* Expert Dynamic Commentary */}
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1 font-sans">VocabWize Analysis</span>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {commentary}
            </p>
            <div className="flex items-center gap-1 mt-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-[9px] text-slate-400 font-medium">BNC/COCA Frequency &amp; CEFR Calibrated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
