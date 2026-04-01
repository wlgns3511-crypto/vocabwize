import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordsByLetter } from "@/lib/db";
interface Props { params: Promise<{ letter: string }> }
export function generateStaticParams() { return "abcdefghijklmnopqrstuvwxyz".split("").map((l) => ({ letter: l })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { letter } = await params;
  return { title: `Words Starting With ${letter.toUpperCase()}`, description: `Browse English words starting with ${letter.toUpperCase()}. Definitions and meanings.`, openGraph: { url: `/letter/${letter}` }, alternates: { canonical: `/letter/${letter}` } };
}
export default async function LetterPage({ params }: Props) {
  const { letter } = await params;
  if (!/^[a-z]$/.test(letter)) notFound();
  const words = getWordsByLetter(letter);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Words Starting With {letter.toUpperCase()}</h1>
      <p className="text-slate-600 mb-6">{words.length} words</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        {words.map((w) => (
          <a key={w.slug} href={`/word/${w.slug}`} className="p-2 border border-slate-100 rounded hover:bg-indigo-50">
            <span className="font-medium">{w.word}</span>
            {w.phonetic && <span className="text-slate-400 ml-2 text-xs">/{w.phonetic}/</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
