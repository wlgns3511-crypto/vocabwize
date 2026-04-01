import type { Metadata } from "next";
import { searchWords } from "@/lib/db";

export const metadata: Metadata = {
  title: "Search Words",
  description: "Search the English vocabulary database. Find words by name or definition.",
  alternates: { canonical: "/search/" },
  openGraph: { url: "/search/" },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const results = q ? searchWords(q, 50) : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Search Words</h1>
      <p className="text-slate-600 mb-6">Find any word by name or definition</p>

      <form className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Search by word or definition..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Search
          </button>
        </div>
      </form>

      {q && (
        <div>
          <p className="text-sm text-slate-500 mb-4">{results.length} results for &ldquo;{q}&rdquo;</p>
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((r) => (
                <a key={r.slug} href={`/word/${r.slug}`} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <div className="shrink-0">
                    <span className="font-bold text-indigo-600">{r.word}</span>
                    {r.pos && <span className="ml-2 text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded">{r.pos}</span>}
                  </div>
                  <span className="text-sm text-slate-700 flex-1 truncate">{r.definition}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No results found. Try a different search term.</p>
          )}
        </div>
      )}

      {!q && (
        <div className="bg-slate-50 rounded-lg p-6">
          <h2 className="font-bold mb-3">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {["love", "happy", "time", "beautiful", "strong", "knowledge", "freedom", "nature", "wisdom", "peace"].map((term) => (
              <a key={term} href={`/search?q=${term}`} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm hover:border-indigo-300 hover:bg-indigo-50">
                {term}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
