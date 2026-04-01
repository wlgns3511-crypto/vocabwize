import { getTopWords, countWords } from "@/lib/db";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "All Words", description: "Browse 160,000+ English word definitions.", alternates: { canonical: "/word/" },
  openGraph: { url: "/word/" },
};
export default function WordsPage() {
  const words = getTopWords(200);
  const total = countWords();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">All Words</h1>
      <p className="text-slate-600 mb-6">{total.toLocaleString()} words available</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        {words.map((w) => (
          <a key={w.slug} href={`/word/${w.slug}`} className="p-2 border border-slate-100 rounded hover:bg-indigo-50">
            <span className="font-medium">{w.word}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
