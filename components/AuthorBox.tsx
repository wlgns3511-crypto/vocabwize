import { siteConfig } from "@/site.config";
import {
  EDITORIAL_TEAM,
  PUBLISHER,
  SOURCE_AUTHORITIES,
  WORD_VINTAGE,
} from "@/lib/authorship";

const SOURCE_LABELS: Record<string, string> = {
  "ECDICT (English-Chinese Dictionary)": "ECDICT",
  "Princeton WordNet": "WordNet",
  "British National Corpus (BNC)": "BNC",
  "Corpus of Contemporary American English (COCA)": "COCA",
  "Academic Word List (AWL)": "AWL",
};

type AuthorBoxProps = {
  /** Per-page reviewed/updated date (ISO YYYY-MM-DD). Defaults to WORD_VINTAGE. */
  vintage?: string;
  /** Per-page data-source label override. Defaults to siteConfig.dataVintage. */
  source?: string;
};

export function AuthorBox({ vintage, source }: AuthorBoxProps = {}) {
  const reviewedAt = vintage ?? WORD_VINTAGE;
  const dataVintage = source ?? siteConfig.dataVintage ?? String(siteConfig.dataSource.year);

  return (
    <div className="mt-10 p-5 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900 text-sm">
            Reviewed by {EDITORIAL_TEAM.name}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Part of the <a href={PUBLISHER.url} className="text-slate-700 hover:underline" rel="noopener">{PUBLISHER.name}</a>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mb-3">
        Definitions, parts of speech, and inflection forms on {siteConfig.name} are pulled from{" "}
        <strong>ECDICT</strong> (CC-BY-licensed open-source dictionary). Synonym and antonym
        relationships layer in <strong>Princeton WordNet</strong>. Word-frequency rankings are
        calibrated against the <strong>British National Corpus (BNC)</strong> and the{" "}
        <strong>Corpus of Contemporary American English (COCA)</strong>; academic-register
        flags use the <strong>Academic Word List (AWL)</strong>. Our editorial team audits
        the build pipeline and publishes review dates per page.
      </p>
      <div className="mb-3">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1.5 font-semibold">
          Verified against upstream sources
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SOURCE_AUTHORITIES.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener nofollow"
              title={s.name}
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
            >
              {SOURCE_LABELS[s.name] ?? s.name}
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>Last reviewed: <time dateTime={reviewedAt}>{reviewedAt}</time></span>
        <span className="text-slate-300">·</span>
        <span>Data vintage: {dataVintage}</span>
        <span className="text-slate-300">·</span>
        <a href="https://datapeekfacts.com/editorial-policy/" className="underline underline-offset-2 hover:text-slate-900" rel="noopener">Editorial policy</a>
        <span className="text-slate-300">·</span>
        <a href="/methodology/" className="underline underline-offset-2 hover:text-slate-900">Methodology</a>
        <span className="text-slate-300">·</span>
        <a href="/contact/" className="underline underline-offset-2 hover:text-slate-900">Send a correction</a>
      </div>
    </div>
  );
}
