import type { MetadataRoute } from "next";
import { getWordCount, getWordSlugsPage, getTopComparisons, getRotatingComparisons, getAvailableLengths } from "@/lib/db";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vocabwize.com";
const MAX_PER_SITEMAP = 45000;

export async function generateSitemaps() {
  const totalWords = getWordCount();
  const sitemapCount = Math.ceil(totalWords / MAX_PER_SITEMAP) + 1;
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);

  if (id === 0) {
    // Static + letters + categories(pos) + rankings + comparisons + rhymes + blog
    const stableComparisons = getTopComparisons(1600);
    const rotatingComps = getRotatingComparisons(400);
    const comparisons = [...stableComparisons, ...rotatingComps];
    const lengths = getAvailableLengths();
    const posts = getAllPosts();
    // Top 500 words for rhymes pages
    const topWordsForRhymes = getWordSlugsPage(0, 500);

    return [
      { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1.0 },
      { url: `${SITE_URL}/word/`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE_URL}/compare/`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE_URL}/quiz/`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/terms/`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/about/`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/privacy/`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/contact/`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/pos/`, changeFrequency: "monthly", priority: 0.8 },
      ...["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection"].map((p) => ({
        url: `${SITE_URL}/pos/${p}/`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      { url: `${SITE_URL}/rankings/`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/blog/`, changeFrequency: "weekly" as const, priority: 0.8 },
      ...posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}/`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: p.updatedAt ?? p.publishedAt,
      })),
      ..."abcdefghijklmnopqrstuvwxyz".split("").map((l) => ({
        url: `${SITE_URL}/letter/${l}/`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...comparisons.map((p) => {
        const [a, b] = [p.slugA, p.slugB].sort();
        return {
          url: `${SITE_URL}/compare/${a}-vs-${b}/`,
          changeFrequency: "monthly" as const,
          priority: 0.5,
        };
      }),
      ...topWordsForRhymes.map((w) => ({
        url: `${SITE_URL}/rhymes/${w.slug}/`,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...lengths.map((l) => ({
        url: `${SITE_URL}/words-length/${l}/`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  }

  // Sitemap 1+: word pages
  const offset = (id - 1) * MAX_PER_SITEMAP;
  const words = getWordSlugsPage(offset, MAX_PER_SITEMAP);
  return words.map((w) => ({
    url: `${SITE_URL}/word/${w.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
