import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWordBySlug, getTopWords, getSimilarWords } from "@/lib/db";

interface Props { params: Promise<{ slug: string }> }

function parseJson(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

export const dynamicParams = true;
export const revalidate = false;

export function generateStaticParams() {
  return getTopWords(3000).map(w => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) return {};
  const shortDef = w.definition.substring(0, 120);
  return {
    title: `${w.word} - Definición, Significado y Uso`,
    description: `${w.word}: ${shortDef}. Aprende la definición, pronunciación, ejemplos y cómo usar "${w.word}" en una oración.`,
    openGraph: { url: `/es/word/${slug}` },
    alternates: {
      canonical: `/es/word/${slug}`,
      languages: { en: `/word/${slug}`, es: `/es/word/${slug}`, "x-default": `/word/${slug}` },
    },
  };
}

export default async function WordPageEs({ params }: Props) {
  const { slug } = await params;
  const w = getWordBySlug(slug);
  if (!w) notFound();

  const similar = getSimilarWords(slug, 8);
  const defs = w.definition.split(';').map(d => d.trim()).filter(Boolean);
  const examples = parseJson(w.examples);
  const synonyms = parseJson(w.synonyms);
  const antonyms = parseJson(w.antonyms);

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/es/" className="hover:underline">Inicio</a> / <a href="/es/word" className="hover:underline">Palabras</a> / <span className="text-slate-800">{w.word}</span>
      </nav>

      <h1 className="text-4xl font-bold mb-1">{w.word}</h1>
      {w.phonetic && <p className="text-lg text-slate-500 mb-1">/{w.phonetic}/</p>}
      {w.pos && <p className="text-sm text-indigo-500 mb-2">{w.pos}</p>}
      <p className="text-xs text-slate-400 mb-6">
        <a href={`/word/${slug}`} className="text-indigo-500 hover:underline">English version</a>
      </p>

      {/* Definición */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Definición</h2>
        <div className="bg-indigo-50 rounded-lg p-6">
          {defs.length > 1 ? (
            <ol className="list-decimal list-inside space-y-2">
              {defs.map((d, i) => (<li key={i} className="text-slate-700">{d}</li>))}
            </ol>
          ) : (
            <p className="text-slate-700">{w.definition}</p>
          )}
        </div>
      </section>

      {/* Ejemplos */}
      {examples.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Ejemplos</h2>
          <div className="space-y-3">
            {examples.slice(0, 4).map((ex, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-indigo-400 font-mono text-sm mt-0.5">{i + 1}.</span>
                <p className="text-slate-700 italic">&ldquo;{ex}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Etimología */}
      {w.etymology && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Etimología</h2>
          <div className="bg-amber-50 border-l-4 border-amber-300 p-4 rounded-r-lg">
            <p className="text-slate-700">{w.etymology}</p>
          </div>
        </section>
      )}

      {/* Sinónimos y Antónimos */}
      {(synonyms.length > 0 || antonyms.length > 0) && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Sinónimos y Antónimos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {synonyms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-600 mb-2">Sinónimos</h3>
                <div className="flex flex-wrap gap-2">
                  {synonyms.map((s, i) => (
                    <a key={i} href={`/es/word/${s.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {antonyms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-600 mb-2">Antónimos</h3>
                <div className="flex flex-wrap gap-2">
                  {antonyms.map((a, i) => (
                    <a key={i} href={`/es/word/${a.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm hover:bg-red-100">
                      {a}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Palabras relacionadas */}
      {similar.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Palabras Relacionadas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {similar.map((s) => (
              <div key={s.slug} className="p-3 border border-slate-200 rounded-lg">
                <a href={`/es/word/${s.slug}`} className="font-medium text-indigo-600 hover:underline">{s.word}</a>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-slate-400 mt-8">Fuente: Base de datos léxica.</p>
    </div>
  );
}
