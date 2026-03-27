"use client";

import { useState, useCallback } from "react";

interface QuizOption {
  word: string;
  slug: string;
}

interface QuizQuestion {
  definition: string;
  pos: string | null;
  correctSlug: string;
  options: QuizOption[];
}

export function VocabQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const startQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz-words");
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setCurrentIdx(0);
        setScore(0);
        setTotal(0);
        setSelected(null);
        setStarted(true);
        setFinished(false);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = (slug: string) => {
    if (selected) return; // already answered
    setSelected(slug);
    setTotal((t) => t + 1);
    if (slug === questions[currentIdx].correctSlug) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
  };

  const current = questions[currentIdx];

  return (
    <section className="my-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl">
      <h2 className="text-2xl font-bold text-indigo-900 mb-2">Vocabulary Quiz</h2>
      <p className="text-sm text-indigo-700 mb-5">
        Test your vocabulary! Read the definition and pick the correct word.
      </p>

      {!started ? (
        <div className="text-center py-8">
          <p className="text-slate-600 mb-4">
            10 questions. How many can you get right?
          </p>
          <button
            onClick={startQuiz}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Start Quiz"}
          </button>
        </div>
      ) : finished ? (
        <div className="text-center py-8">
          <div className="text-5xl font-bold text-indigo-900 mb-2">
            {score}/{total}
          </div>
          <p className="text-slate-600 mb-1">
            {score === total
              ? "Perfect score! Amazing vocabulary!"
              : score >= total * 0.7
                ? "Great job! You know your words well."
                : score >= total * 0.5
                  ? "Good effort! Keep studying to improve."
                  : "Keep practicing! Every word you learn makes you stronger."}
          </p>
          <p className="text-xs text-slate-400 mb-4">
            {Math.round((score / total) * 100)}% correct
          </p>
          <button
            onClick={startQuiz}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Play Again"}
          </button>
        </div>
      ) : current ? (
        <div>
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-indigo-500 font-medium">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-xs text-indigo-500 font-medium">
              Score: {score}/{total}
            </span>
          </div>
          <div className="w-full h-1.5 bg-indigo-100 rounded-full mb-5">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Definition */}
          <div className="bg-white border border-indigo-200 rounded-xl p-5 mb-5">
            <p className="text-sm text-slate-500 mb-1">
              Which word matches this definition?
            </p>
            <p className="text-lg text-slate-800 font-medium leading-relaxed">
              {current.definition}
            </p>
            {current.pos && (
              <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-600 rounded-full px-2 py-0.5">
                {current.pos}
              </span>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {current.options.map((opt) => {
              let btnClass =
                "p-3 rounded-xl border text-left text-sm font-medium transition-colors ";
              if (!selected) {
                btnClass +=
                  "border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-400 text-slate-800 cursor-pointer";
              } else if (opt.slug === current.correctSlug) {
                btnClass +=
                  "border-green-400 bg-green-50 text-green-800";
              } else if (opt.slug === selected) {
                btnClass +=
                  "border-red-400 bg-red-50 text-red-800";
              } else {
                btnClass +=
                  "border-slate-200 bg-slate-50 text-slate-400";
              }

              return (
                <button
                  key={opt.slug}
                  onClick={() => handleSelect(opt.slug)}
                  disabled={!!selected}
                  className={btnClass}
                >
                  {opt.word}
                  {selected && opt.slug === current.correctSlug && (
                    <span className="ml-2 text-green-600">&#10003;</span>
                  )}
                  {selected &&
                    opt.slug === selected &&
                    opt.slug !== current.correctSlug && (
                      <span className="ml-2 text-red-500">&#10007;</span>
                    )}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="text-right">
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                {currentIdx + 1 >= questions.length ? "See Results" : "Next Question"}
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* High-CPC footer */}
      <div className="mt-6 pt-5 border-t border-indigo-200">
        <h3 className="text-sm font-semibold text-indigo-900 mb-2">
          Want to Improve Your Vocabulary?
        </h3>
        <p className="text-xs text-indigo-700 leading-relaxed">
          Explore online English courses, TOEFL preparation materials, top-rated
          language learning apps, and professional ESL tutoring services to
          accelerate your language skills.
        </p>
      </div>
    </section>
  );
}
