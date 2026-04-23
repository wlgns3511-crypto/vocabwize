import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Methodology — How VocabWize Builds Its Dictionary",
  description:
    "Learn exactly how VocabWize sources, processes, and verifies its English vocabulary data — including the corpora, dictionaries, and frequency data we rely on.",
  alternates: { canonical: "/methodology/" },
  openGraph: { url: "/methodology/" },
};

export default function MethodologyPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1>Our Methodology</h1>
      <p className="lead text-lg text-slate-600">
        We want you to trust the numbers and definitions you see on VocabWize.
        This page explains, in plain English, where our data comes from, how we
        process it, and what its limitations are. Nothing is hidden behind the
        phrase &ldquo;proprietary data&rdquo;.
      </p>

      <h2>Primary data source</h2>
      <p>
        Our core vocabulary dataset is built on top of{" "}
        <a
          href="https://github.com/skywind3000/ECDICT"
          target="_blank"
          rel="noopener noreferrer"
        >
          ECDICT
        </a>
        , an open-source English dictionary database released under a permissive
        license. ECDICT compiles definitions, parts of speech, phonetic
        transcriptions, and inflection data from several public references and
        is used by open-source language tools worldwide.
      </p>
      <p>
        From ECDICT we extract and normalize the fields that matter to our
        readers: the headword, IPA phonetic, part of speech, short definitions,
        and inflected forms. Non-English glosses are filtered out during
        ingestion so that every definition you read on VocabWize is in English.
      </p>

      <h2>Frequency data</h2>
      <p>
        Our word frequency ranks are derived from the frequency field embedded
        in ECDICT, which itself is calibrated against large English corpora
        including the{" "}
        <a
          href="https://www.natcorp.ox.ac.uk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          British National Corpus (BNC)
        </a>{" "}
        and the{" "}
        <a
          href="https://www.english-corpora.org/coca/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Corpus of Contemporary American English (COCA)
        </a>
        . When we say a word is in the top 5&thinsp;% of English usage, that
        statement is grounded in real corpus counts, not editorial opinion.
      </p>

      <h2>Level classification (basic / intermediate / advanced / academic)</h2>
      <p>
        Each word is assigned a learning level based on a combination of its
        corpus frequency and membership in widely-used vocabulary lists such as
        the{" "}
        <a
          href="https://www.eapfoundation.com/vocab/academic/awllists/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Academic Word List (AWL)
        </a>{" "}
        and the General Service List. Words common in everyday speech get
        &ldquo;basic&rdquo;; words primarily seen in scholarly writing,
        standardized tests, or specialized domains get &ldquo;academic&rdquo;.
        The mapping is rule-based and fully reproducible from the data.
      </p>

      <h2>Build and update process</h2>
      <ol>
        <li>
          <strong>Ingest</strong> &mdash; ECDICT snapshots are imported into a
          local SQLite database (<code>data/vocab.db</code>).
        </li>
        <li>
          <strong>Clean</strong> &mdash; non-English content, encoding artifacts,
          and empty fields are removed.
        </li>
        <li>
          <strong>Derive</strong> &mdash; levels, frequency percentiles,
          synonym/antonym relationships, and letter/length indexes are computed
          deterministically from the cleaned records.
        </li>
        <li>
          <strong>Cross-link</strong> &mdash; translations for a subset of words
          are joined against our sister dictionaries (VocabLibre, WortWize,
          DicionarioWize, KalimaWize, KotobaPeek) to build direct
          cross-language links.
        </li>
        <li>
          <strong>Publish</strong> &mdash; the database is packaged with the
          site at build time, so every page is generated from the same verified
          snapshot.
        </li>
      </ol>

      <h2>Update frequency</h2>
      <p>
        Upstream dictionary data is slow-moving; the English lexicon does not
        change hour-to-hour. We refresh our dataset on a monthly cadence, or
        immediately when a source issues a corrective release. Each word page
        carries a human-readable &ldquo;last updated&rdquo; label so you always
        know the provenance of what you are reading.
      </p>

      <h2>Cross-reference and verification</h2>
      <p>
        We do not ask you to take our word for it. For any entry you are unsure
        about, we encourage you to compare against these authoritative public
        references:
      </p>
      <ul>
        <li>
          <a
            href="https://en.wiktionary.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wiktionary
          </a>{" "}
          &mdash; community-maintained multilingual dictionary with detailed
          etymologies.
        </li>
        <li>
          <a
            href="https://www.merriam-webster.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Merriam-Webster
          </a>{" "}
          &mdash; authoritative American English dictionary, useful for current
          usage and pronunciation.
        </li>
        <li>
          <a
            href="https://www.oed.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Oxford English Dictionary
          </a>{" "}
          &mdash; the definitive historical record of the English language.
        </li>
        <li>
          <a
            href="https://wordnet.princeton.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Princeton WordNet
          </a>{" "}
          &mdash; lexical database organizing words into cognitive synonym sets.
        </li>
      </ul>

      <h2>Limitations you should know about</h2>
      <ul>
        <li>
          <strong>Regional variation.</strong> Our definitions lean toward
          contemporary general English and do not always disambiguate between
          British, American, Australian, or Indian usage. For region-specific
          nuance, check Merriam-Webster (US) or the OED (UK).
        </li>
        <li>
          <strong>Neologisms.</strong> Very new words (coined within the last
          12 months) may be missing or have sparse data. These are the entries
          most likely to be refreshed in the next update cycle.
        </li>
        <li>
          <strong>Proper nouns and jargon.</strong> Specialist technical,
          medical, or legal vocabulary is represented but not as our primary
          focus. For domain-specific work, use a specialist reference.
        </li>
        <li>
          <strong>Frequency data is English-wide.</strong> A word can be rare
          in one register (say, legal writing) and common in another
          (everyday speech). Our &ldquo;top N&thinsp;%&rdquo; figures describe
          overall usage, not register-specific usage.
        </li>
      </ul>

      <h2>Corrections and feedback</h2>
      <p>
        If you find an incorrect definition, a missing sense, or a level
        classification that doesn&apos;t match your experience, we want to
        hear about it. Please <a href="/contact/">contact us</a> with the word
        and what you would change. We track every correction request.
      </p>

      <p className="text-sm text-slate-500 border-t pt-4 mt-8">
        This methodology page was last reviewed in March 2026. Substantive
        changes to how we build the dataset will be reflected here before they
        reach production data.
      </p>
    </article>
  );
}
