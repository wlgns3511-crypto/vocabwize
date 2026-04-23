import { breadcrumbSchema as _breadcrumb, faqSchema, definedTermSchema } from './core-schema';
import { PUBLISHER, EDITORIAL_TEAM } from './authorship';

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

export { faqSchema, definedTermSchema };
