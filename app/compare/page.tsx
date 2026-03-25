import type { Metadata } from "next";
export const metadata: Metadata = { title: "Compare Words", description: "Compare confusing English words side by side." };
export default function ComparePage() {
  const pairs = [['affect','effect'],['than','then'],['their','there'],['lose','loose'],['who','whom'],['lay','lie'],['farther','further'],['advice','advise'],['complement','compliment'],['ensure','insure'],['principle','principal'],['stationary','stationery'],['eminent','imminent'],['imply','infer'],['precede','proceed'],['accept','except'],['desert','dessert'],['elicit','illicit'],['allusion','illusion'],['discreet','discrete']];
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Commonly Confused Words</h1>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        {pairs.map(([a,b]) => { const [x,y] = [a,b].sort(); return (
          <a key={a+b} href={`/compare/${x}-vs-${y}`} className="p-3 border border-slate-200 rounded-lg hover:bg-indigo-50 text-indigo-600 font-medium">{a} vs {b}</a>
        ); })}
      </div>
    </div>
  );
}
