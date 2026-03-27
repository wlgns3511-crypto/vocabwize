import type { Metadata } from "next";
import { VocabQuiz } from "@/components/VocabQuiz";

export const metadata: Metadata = {
  title: "Vocabulary Quiz - Test Your Word Knowledge",
  description:
    "Take a fun vocabulary quiz! Match definitions to words and test your English vocabulary. 10 questions per round with instant feedback.",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <div>
      <section className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Vocabulary Quiz</h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Challenge yourself with our vocabulary quiz. Read the definition, pick
          the correct word, and track your score.
        </p>
      </section>

      <VocabQuiz />

      <section className="mt-10 text-center text-sm text-slate-500">
        <p>
          Want to study more words?{" "}
          <a href="/" className="text-indigo-600 hover:underline">
            Browse our full dictionary
          </a>{" "}
          or{" "}
          <a href="/compare" className="text-indigo-600 hover:underline">
            compare confusing word pairs
          </a>
          .
        </p>
      </section>
    </div>
  );
}
