import { siteConfig } from '@/site.config';

/**
 * Authorship + freshness vintages for VocabWize.
 *
 * Vintage 4-layer split (Phase 6 v6.2 — caloriewize-style "single sitewide
 * DB_UPDATED" anti-pattern fix):
 *
 *   1. WORD_VINTAGE          — word DB rebuild date (drives /word/<slug>
 *                              dateModified + AuthorBox "Last reviewed").
 *   2. GUIDE_VINTAGE         — editorial guide review date.
 *   3. METHODOLOGY_VINTAGE   — when /methodology/ was last reviewed.
 *   4. LEGAL_VINTAGES        — privacy/terms/disclaimer per-page (not sitewide).
 *
 * SITE_VINTAGE / ABOUT_VINTAGE used for cross-cutting hubs.
 *
 * Authority cross-reference: instead of inventing a named individual reviewer
 * (HCU spam-classifier risk), our underlying word data is sourced from
 * open-source corpora (ECDICT + Princeton WordNet) with frequency calibrated
 * against BNC/COCA. Wiktionary / Merriam-Webster / Oxford English Dictionary
 * are linked from /methodology/ as external cross-reference targets — they
 * are NOT in the schema.org `reviewedBy` array because we do not actually
 * pull data from them at build time. Only verifiable upstream Organizations
 * appear in SOURCE_AUTHORITIES.
 */

export const WORD_VINTAGE = '2026-04-19';
export const GUIDE_VINTAGE = '2026-04-08';
export const METHODOLOGY_VINTAGE = '2026-04-08';
export const ABOUT_VINTAGE = '2026-04-12';
export const SITE_VINTAGE = '2026-05-11';

export const LEGAL_VINTAGES = {
  privacy: '2026-04-22',
  terms: '2026-02-18',
  disclaimer: '2025-11-04',
} as const;

// Backwards compatibility for existing call sites.
export const DB_UPDATED = WORD_VINTAGE;

export const PUBLISHER = {
  name: 'DataPeek Research Network',
  url: 'https://datapeekfacts.com',
  description:
    'A public-data network aggregating open-source and government datasets across US housing, tax, healthcare, and lexical domains.',
};

export const EDITORIAL_TEAM = {
  name: `${siteConfig.name} Editorial Team`,
  url: 'https://datapeekfacts.com/editorial-policy/',
  parentOrganization: PUBLISHER,
};

// Reviewer schema for DefinedTerm/Article entities. Organization (not Person)
// — we don't fabricate fake bylines or named individual lexicographers.
export const REVIEWER_ORG = {
  '@type': 'Organization',
  name: EDITORIAL_TEAM.name,
  url: EDITORIAL_TEAM.url,
  parentOrganization: { '@type': 'Organization', name: PUBLISHER.name, url: PUBLISHER.url },
};

/**
 * SOURCE_AUTHORITIES — actual upstream data sources used to build vocab.db.
 * Used as JSON-LD `isBasedOn` and surfaced visually in the AuthorBox so
 * readers can trace any definition / frequency / level back to the upstream
 * corpus. Only entries we genuinely pull data from at build time.
 *
 * Excluded from this array (intentional): Merriam-Webster and the OED — we
 * link to them from /methodology/ for nuance lookup, but we do not import
 * their data, so they don't belong in `reviewedBy`.
 */
// Compact {name, url} list for above-fold TrustBlock — derived from SOURCE_AUTHORITIES.
// Short labels for visual fit; full schema objects remain in SOURCE_AUTHORITIES.
export const TRUST_BLOCK_SOURCES: ReadonlyArray<{ name: string; url: string }> = [
  { name: 'ECDICT', url: 'https://github.com/skywind3000/ECDICT' },
  { name: 'Princeton WordNet', url: 'https://wordnet.princeton.edu/' },
  { name: 'BNC', url: 'https://www.natcorp.ox.ac.uk/' },
  { name: 'COCA', url: 'https://www.english-corpora.org/coca/' },
  { name: 'AWL', url: 'https://www.eapfoundation.com/vocab/academic/awllists/' },
];

export const SOURCE_AUTHORITIES = [
  {
    '@type': 'CreativeWork',
    name: 'ECDICT (English-Chinese Dictionary)',
    url: 'https://github.com/skywind3000/ECDICT',
    description:
      'Primary lexical corpus. Open-source dictionary database — definitions, IPA phonetics, parts of speech, inflection forms, base frequency.',
    license: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    '@type': 'Organization',
    name: 'Princeton WordNet',
    url: 'https://wordnet.princeton.edu/',
    description:
      'Lexical database used to derive synonym, antonym, and synset relationships layered on top of ECDICT.',
  },
  {
    '@type': 'Organization',
    name: 'British National Corpus (BNC)',
    url: 'https://www.natcorp.ox.ac.uk/',
    description:
      'Reference corpus (100M words, balanced British English) used for word-frequency calibration.',
  },
  {
    '@type': 'Organization',
    name: 'Corpus of Contemporary American English (COCA)',
    url: 'https://www.english-corpora.org/coca/',
    description:
      'Reference corpus (1B+ words, American English, 1990–present) used for word-frequency calibration.',
  },
  {
    '@type': 'CreativeWork',
    name: 'Academic Word List (AWL)',
    url: 'https://www.eapfoundation.com/vocab/academic/awllists/',
    description:
      'Sublist used to classify academic-register vocabulary (Coxhead, 2000) — drives our level=academic flag.',
  },
] as const;
