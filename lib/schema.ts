import { breadcrumbSchema as _breadcrumb, faqSchema, definedTermSchema } from './core-schema';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vocabwize.com';

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return _breadcrumb(SITE_URL, items);
}

export { faqSchema, definedTermSchema };
