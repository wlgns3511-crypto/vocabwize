import type { MetadataRoute } from "next";
import { getWordCount, getWordSlugsPage, getTopComparisons, getAvailableLengths } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";
const URLS_PER_SITEMAP = 40000; // 50K 제한에 여유

/**
 * Next.js sitemap index: /sitemap/0.xml, /sitemap/1.xml, ...
 * 구글은 자동으로 /sitemap.xml을 sitemap index로 인식
 */
export async function generateSitemaps() {
  const totalWords = getWordCount();
  const wordSitemapCount = Math.ceil(totalWords / URLS_PER_SITEMAP);
  // id 0 = static + comparisons + rhymes + lengths
  // id 1..N = word pages (paginated)
  const ids = [{ id: 0 }];
  for (let i = 1; i <= wordSitemapCount; i++) {
    ids.push({ id: i });
  }
  return ids;
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  if (id === 0) {
    // Static pages + comparisons + letter pages + lengths + rhymes
    const comparisons = getTopComparisons(2000);
    const lengths = getAvailableLengths();
    const topWords = getWordSlugsPage(0, 500); // for rhymes

    return [
      { url: SITE_URL, changeFrequency: "monthly", priority: 1.0 },
      { url: `${SITE_URL}/word`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE_URL}/compare`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
      ..."abcdefghijklmnopqrstuvwxyz".split("").map((l) => ({
        url: `${SITE_URL}/letter/${l}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...comparisons.map((p) => {
        const [a, b] = [p.slugA, p.slugB].sort();
        return {
          url: `${SITE_URL}/compare/${a}-vs-${b}`,
          changeFrequency: "monthly" as const,
          priority: 0.5,
        };
      }),
      ...topWords.map((w) => ({
        url: `${SITE_URL}/rhymes/${w.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...lengths.map((l) => ({
        url: `${SITE_URL}/words-length/${l}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  }

  // Word pages: paginated (id 1 = offset 0, id 2 = offset 40K, ...)
  const offset = (id - 1) * URLS_PER_SITEMAP;
  const words = getWordSlugsPage(offset, URLS_PER_SITEMAP);

  return words.map((w) => ({
    url: `${SITE_URL}/word/${w.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
