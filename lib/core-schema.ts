export function breadcrumbSchema(siteUrl: string, items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {};
}

export function definedTermSchema(word: string, definition: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word,
    description: definition,
  };
}
