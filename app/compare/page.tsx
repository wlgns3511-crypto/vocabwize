import type { Metadata } from "next";
import { getTopComparisons } from "@/lib/db";

const FEATURED_COMPARE_PAIRS = getTopComparisons(24);
const COMPARE_PAIR_COUNT = getTopComparisons(100).length;

export const metadata: Metadata = { title: "Compare Commonly Confused Words", description: "Compare commonly confused English words side by side in a curated editorial selection.", alternates: { canonical: "/compare/" },
  openGraph: { url: "/compare/" },
};
export default function ComparePage() {
  const pairs = FEATURED_COMPARE_PAIRS;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Commonly Confused Words</h1>
      <p className="text-slate-500 mb-6">
        Browse {COMPARE_PAIR_COUNT.toLocaleString()} editorial compare pages covering
        the English word pairs people most often mix up in writing and speech.
      </p>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        {pairs.map(({ slugA, slugB, wordA, wordB }) => { return (
          <a key={`${slugA}-${slugB}`} href={`/compare/${slugA}-vs-${slugB}`} className="p-3 border border-slate-200 rounded-lg hover:bg-indigo-50 text-indigo-600 font-medium">{wordA || slugA} vs {wordB || slugB}</a>
        ); })}
      </div>
    </div>
  );
}
