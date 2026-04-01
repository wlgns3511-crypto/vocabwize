import { Metadata } from "next";
import { VocabQuiz } from "@/components/VocabQuiz";

export const metadata: Metadata = {
  title: "Vocabulary Quiz - Embeddable Widget",
  robots: "noindex, nofollow",
  openGraph: { url: "/embed/quiz/" },
};

export default function EmbedQuizPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <VocabQuiz />
      <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 12 }}>
        Powered by{" "}
        <a href="https://vocabwize.com" target="_blank" rel="noopener" style={{ color: "#3b82f6", textDecoration: "underline" }}>
          VocabWize
        </a>
      </p>
    </div>
  );
}
