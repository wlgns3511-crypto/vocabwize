import type { MetadataRoute } from "next";
import { getTopWords, getTopComparisons, getAllWordsCount } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Get maximum allowed by Next.js sitemap (50K limit, we use 45K to be safe)
  const words = getTopWords(44000);
  const comparisons = getTopComparisons(500);
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/word`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.8 },
    ..."abcdefghijklmnopqrstuvwxyz".split("").map((l) => ({
      url: `${SITE_URL}/letter/${l}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...words.map((w) => ({
      url: `${SITE_URL}/word/${w.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...comparisons.map((p) => {
      const [a, b] = [p.slugA, p.slugB].sort();
      return {
        url: `${SITE_URL}/compare/${a}-vs-${b}`,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      };
    }),
  ];
}
