import type { TranslationEntry } from "@/lib/db";

const FLAG: Record<string, string> = {
  en: "\uD83C\uDDFA\uD83C\uDDF8",
  fr: "\uD83C\uDDEB\uD83C\uDDF7",
  de: "\uD83C\uDDE9\uD83C\uDDEA",
  pt: "\uD83C\uDDE7\uD83C\uDDF7",
  ar: "\uD83C\uDDF8\uD83C\uDDE6",
  ja: "\uD83C\uDDEF\uD83C\uDDF5",
};

interface Props {
  word: string;
  translations: Record<string, TranslationEntry>;
  color?: string;
}

export function TranslationLinks({ word, translations, color = "indigo" }: Props) {
  const langs = Object.entries(translations);
  if (langs.length === 0) return null;

  return (
    <section className="my-8">
      <h2 className={`text-lg font-bold text-${color}-900 mb-3 flex items-center gap-2`}>
        <span className="text-xl" aria-hidden="true">{"\uD83C\uDF10"}</span>
        {`"${word}" in Other Languages`}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {langs.map(([lang, entry]) => (
          <a
            key={lang}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-lg border border-${color}-100 bg-${color}-50/30 hover:bg-${color}-50 transition-colors group`}
          >
            <span className="text-2xl" aria-hidden="true">{FLAG[lang] || "\uD83C\uDF10"}</span>
            <div className="min-w-0">
              <span className="text-xs text-slate-500 block">{entry.lang_name}</span>
              <span className={`font-semibold text-${color}-700 group-hover:underline truncate block`}>
                {entry.slug}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
