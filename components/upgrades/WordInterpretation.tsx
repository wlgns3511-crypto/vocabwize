import type { WordInterpretation as WI } from "@/lib/word-interpretation";
import type { CefrTier } from "@/lib/cefr-tier";
import { cefrToneColor, cefrLabel } from "@/lib/cefr-tier";

interface Props {
  strip: WI;
  cefr: CefrTier;
  awlSublist: number | null;
}

export function WordInterpretation({ strip, cefr, awlSublist }: Props) {
  const tone = cefrToneColor(cefr);
  return (
    <section
      data-upgrade="word-interpretation-strip"
      className={`mt-6 mb-6 p-5 rounded-lg ring-1 ${tone.ring} ${tone.bg}`}
    >
      <div className="flex flex-wrap items-baseline gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${tone.bg} ${tone.text} ring-1 ${tone.ring}`}>
          {cefrLabel(cefr)}
        </span>
        {awlSublist !== null && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200">
            AWL Sublist {awlSublist}
          </span>
        )}
        <h2 className={`text-base font-semibold ${tone.text}`}>
          Reader verdict
        </h2>
      </div>

      <p className={`text-sm leading-relaxed ${tone.text} mb-4 font-medium`}>
        {strip.verdict}
      </p>

      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          <strong className="text-slate-900">Difficulty.</strong> {strip.difficulty}
        </p>
        <p>
          <strong className="text-slate-900">Academic register.</strong> {strip.academicContext}
        </p>
        <p>
          <strong className="text-slate-900">Morphology.</strong> {strip.morphologicalView}
        </p>
        <p>
          <strong className="text-slate-900">Cross-reference.</strong> {strip.crossReference}
        </p>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        The strip is composed deterministically from the COCA/BNC frequency rank, the Coxhead 2000 AWL membership, and the surface form — same inputs always produce the same verdict.{" "}
        <a href="/guide/cefr-difficulty-tiers/" className="underline hover:text-slate-700">
          CEFR cutoffs
        </a>
        {" · "}
        <a href="/guide/awl-academic-word-list-sublists/" className="underline hover:text-slate-700">
          AWL Sublist reference
        </a>
      </p>
    </section>
  );
}
