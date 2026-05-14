import type { Metadata } from "next";
import { LEGAL_VINTAGES } from "@/lib/authorship";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer and limitations of liability for VocabWize. Word definitions originate from ECDICT (CC BY 4.0), Princeton WordNet, BNC, COCA, and the Academic Word List (Coxhead 2000) — not legal, medical, or career advice. ESL learners should cross-reference critical usage against a registered exam authority.",
  alternates: { canonical: "/disclaimer/" },
  openGraph: { url: "/disclaimer/" },
};

export default function DisclaimerPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Disclaimer</h1>
      <p className="text-sm text-slate-500 mb-8">
        Last updated: <time dateTime={LEGAL_VINTAGES.disclaimer}>November 4, 2025</time>
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">General Information</h2>
      <p>
        The information provided on VocabWize is for general informational and educational purposes only. While we
        strive to keep the underlying lexical data accurate by ingesting open corpora directly, we make no
        representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability,
        or suitability of the information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Not Professional Advice</h2>
      <p>
        The content on VocabWize is reference-grade vocabulary information for ESL learners and writers. Definitions
        originate from ECDICT (open-source, CC BY 4.0 licensed) and Princeton WordNet. Neither ECDICT, WordNet, the
        British National Corpus (BNC), the Corpus of Contemporary American English (COCA), nor the Academic Word
        List (AWL, Coxhead 2000) is a legal, medical, financial, or career-advice instrument, and neither is this
        site. Do not rely on a VocabWize entry as legal, medical, or financial advice. Any reliance you place on the
        information is strictly at your own risk. Always consult with a qualified professional before making
        decisions based on the information found here.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Source &amp; Accuracy</h2>
      <p>
        Word data on VocabWize is sourced from five public lexical authorities:
      </p>
      <ul>
        <li>
          <strong>ECDICT</strong> &mdash; primary headword, definition, IPA, and inflection corpus. Licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            className="text-indigo-700 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Creative Commons BY 4.0
          </a>
          . Attribution is required, which is why ECDICT is named on every page footer and in our JSON-LD source
          arrays.
        </li>
        <li>
          <strong>Princeton WordNet</strong> &mdash; synonym, antonym, and synset relationship source from Princeton
          University.
        </li>
        <li>
          <strong>British National Corpus (BNC)</strong> &mdash; frequency-rank source for our CEFR tier classifier
          (balanced British-English reference corpus).
        </li>
        <li>
          <strong>Corpus of Contemporary American English (COCA)</strong> &mdash; second frequency-rank source for our
          CEFR tier classifier (American-English balanced corpus, 1990 to present).
        </li>
        <li>
          <strong>Academic Word List (AWL)</strong> &mdash; Coxhead 2000 list of 570 academic word families used for
          academic-register classification.
        </li>
      </ul>
      <p>
        Despite using upstream corpora directly, data may contain errors, be outdated relative to the latest release,
        or have known coverage limitations. ECDICT lacks etymology for many rare words; BNC and COCA are sampled
        corpora, not exhaustive ones; AWL was published in 2000 and is not updated since. Users should independently
        verify critical information before relying on it for high-stakes use (exam preparation, professional
        translation, legal interpretation).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">CEFR Heuristic Disclosure</h2>
      <p>
        CEFR tiers (A1 through C2) shown on VocabWize are not officially-certified Cambridge classifications. They
        are derived from a deterministic heuristic over BNC and COCA frequency rank, with academic-register
        escalation from the AWL. Test-prep readers should treat them as a strong frequency proxy, not as a Cambridge
        guarantee of TOEFL or IELTS placement.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">External Links</h2>
      <p>
        This website may contain links to external websites &mdash; including upstream lexical sources such as
        ECDICT, Princeton WordNet, the British National Corpus, the Corpus of Contemporary American English, and the
        Academic Word List references &mdash; that are not under our control. We have no responsibility for the
        content, privacy policies, or practices of any third-party websites.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Advertising</h2>
      <p>
        VocabWize displays third-party advertisements through Google AdSense and other ad networks. These
        advertisements are provided by third parties and do not imply endorsement by VocabWize. We are not
        responsible for the content or accuracy of any advertisements displayed on this website.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
      <p>
        In no event shall VocabWize, its owners, operators, or contributors be liable for any direct, indirect,
        incidental, consequential, or punitive damages arising from the use of this website or the information
        contained herein.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
      <p>
        If you have concerns about any content on this website, please visit our{" "}
        <a href="/contact/" className="text-indigo-700 hover:underline">
          Contact page
        </a>{" "}
        or report a data correction through our{" "}
        <a href="/corrections-policy/" className="text-indigo-700 hover:underline">
          Corrections Policy
        </a>
        .
      </p>
    </article>
  );
}
