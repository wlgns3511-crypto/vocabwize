import type { Metadata } from "next";
import { getTopWords } from "@/lib/db";

export const metadata: Metadata = {
  title: "VocabWize - Definiciones y Significados de Palabras en Inglés",
  description: "Busca definiciones, significados y uso de más de 160,000 palabras en inglés. Compara palabras confusas lado a lado.",
  alternates: {
    canonical: "/es/",
    languages: { en: "/", es: "/es/", "x-default": "/" },
  },
  openGraph: { url: "/es/" },
};

export default function HomeEs() {
  const popular = getTopWords(30);

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Definiciones y Significados de Palabras en Inglés
      </h1>
      <p className="text-slate-600 mb-2">
        Busca definiciones, significados y uso de más de 160,000 palabras en inglés.
      </p>
      <p className="text-xs text-slate-400 mb-8">
        <a href="/" className="text-indigo-500 hover:underline">English version</a>
      </p>

      <section>
        <h2 className="text-xl font-bold mb-4">Palabras Populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popular.map((w) => (
            <a
              key={w.slug}
              href={`/es/word/${w.slug}`}
              className="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-center"
            >
              <div className="font-medium text-sm">{w.word}</div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
