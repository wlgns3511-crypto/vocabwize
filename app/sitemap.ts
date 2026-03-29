import type { MetadataRoute } from "next";
import { getTopWords, getTopComparisons, getAvailableLengths } from "@/lib/db";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // 50K URL 제한 — 고빈도 단어 우선, 나머지는 내부 링크로 크롤링 유도
  const words = getTopWords(45000);
  const comparisons = getTopComparisons(2000);
  const lengths = getAvailableLengths();
  const posts = getAllPosts();

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/word`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/blog/`, changeFrequency: "weekly" as const, priority: 0.8 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: p.updatedAt ?? p.publishedAt,
    })),
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
    ...words.slice(0, 500).map((w) => ({
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
