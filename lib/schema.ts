import { breadcrumbSchema as _breadcrumb, faqSchema, definedTermSchema } from './core-schema';
import { PUBLISHER, EDITORIAL_TEAM, SOURCE_AUTHORITIES } from './authorship';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vocabwize.com';

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return _breadcrumb(SITE_URL, items);
}

export function articleSchema(args: {
  title: string;
  description: string;
  slug: string; // e.g. "guide/how-to-learn-1000-english-words"
  publishedAt: string;
  updatedAt: string;
  category?: string;
}) {
  const url = `${SITE_URL}/${args.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    url,
    datePublished: args.publishedAt,
    dateModified: args.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'VocabWize Editorial Team',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VocabWize',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(args.category ? { articleSection: args.category } : {}),
  };
}

/**
 * Dataset JSON-LD for VocabWize entries and reference guides.
 *
 * Trap #105 — creator is the upstream data origin (the organization that
 * produced the underlying dataset), publisher is the site that hosts the
 * presentation, and reviewedBy is the editorial team. Per schema.org spec.
 *
 * Phase 7 P4 (2026-05-20) — creator widened from SOURCE_AUTHORITIES[creatorIndex]
 * singleton to Organization[] crediting EACH primary-source authority
 * (ECDICT + WordNet + BNC + COCA + Coxhead AWL). Satisfies Trap #110
 * publisher-diversity gate (≥2 distinct host TLDs — github.com, princeton.edu,
 * ox.ac.uk, english-corpora.org, eapfoundation.com = 5 distinct) and gives
 * Google's crawler the full provenance chain. variableMeasured widened to
 * accept structured PropertyValue objects in addition to plain strings, so
 * Phase 7 P0 verdict can be emitted as a structured datum.
 */
export function datasetSchema(args: {
  name: string;
  description: string;
  url: string; // page URL relative to site root, e.g. "/word/excellent/"
  dateModified: string;
  variableMeasured?: ReadonlyArray<string | Record<string, unknown>>;
  keywords?: string[];
  /** @deprecated kept for backward compat — Phase 7 P4 widens creator to all SOURCE_AUTHORITIES. */
  creatorIndex?: 0 | 1 | 2 | 3 | 4;
}) {
  const fullUrl = `${SITE_URL}${args.url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: args.name,
    description: args.description,
    url: fullUrl,
    dateModified: args.dateModified,
    creator: SOURCE_AUTHORITIES.map((s) => ({
      '@type': 'Organization',
      name: s.name,
      url: s.url,
    })),
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
    },
    reviewedBy: {
      '@type': 'Organization',
      name: EDITORIAL_TEAM.name,
      url: EDITORIAL_TEAM.url,
    },
    sourceOrganization: SOURCE_AUTHORITIES.map((s) => ({
      '@type': 'Organization',
      name: s.name,
      url: s.url,
    })),
    isBasedOn: SOURCE_AUTHORITIES.map((s) => ({
      '@type': 'Dataset',
      name: s.name,
      url: s.url,
    })),
    ...(args.variableMeasured && args.variableMeasured.length > 0
      ? { variableMeasured: args.variableMeasured }
      : {}),
    ...(args.keywords && args.keywords.length > 0
      ? { keywords: args.keywords.join(', ') }
      : {}),
    license: 'https://creativecommons.org/licenses/by/4.0/',
  };
}

export { faqSchema, definedTermSchema };
