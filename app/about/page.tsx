import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About VocabWize",
  description: "Learn about VocabWize, our mission, and data sources.",
  alternates: { canonical: "/about/" },
  openGraph: { url: "/about/" },
};

export default function AboutPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">About VocabWize</h1>

      <p>
        VocabWize is a free online dictionary and vocabulary resource offering definitions, meanings, and usage
        information for over 160,000 English words. We also provide side-by-side comparisons of commonly confused
        words so you can use language with confidence.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Our Mission</h2>
      <p>
        Language is the foundation of communication. Our mission is to make English vocabulary accessible and easy to
        understand for students, writers, professionals, and language learners worldwide. Whether you are looking up a
        word definition, trying to understand the difference between similar words, or expanding your vocabulary,
        VocabWize provides clear, concise, and reliable information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Sources</h2>
      <p>
        Our word definitions, pronunciations, and usage data are compiled from established public-domain lexicographic
        sources and linguistic databases. We continuously review and update entries to ensure accuracy and
        completeness. Our comparison feature draws on expert linguistic analysis to highlight the nuances between
        commonly confused word pairs.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact Us</h2>
      <p>
        Have questions or feedback? Visit our <a href="/contact" className="text-indigo-600 hover:underline">Contact page</a> to get in touch.
      </p>
    </article>
  );
}
