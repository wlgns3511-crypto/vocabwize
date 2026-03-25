import type { MetadataRoute } from "next";
import { getTopWords, getTopComparisons } from "@/lib/db";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const words = getTopWords(3000);
  const comparisons = getTopComparisons(500);
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/word`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, changeFrequency: "monthly", priority: 0.9 },
    ..."abcdefghijklmnopqrstuvwxyz".split("").map((l) => ({ url: `${SITE_URL}/letter/${l}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...words.map((w) => ({ url: `${SITE_URL}/word/${w.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...comparisons.map((p) => { const [a, b] = [p.slugA, p.slugB].sort(); return { url: `${SITE_URL}/compare/${a}-vs-${b}`, changeFrequency: "monthly" as const, priority: 0.5 }; }),
  ];
}
