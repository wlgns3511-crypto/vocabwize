import type { Metadata } from "next";
import { METHODOLOGY_VINTAGE } from "@/lib/authorship";

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

      <h2>AWL Sublist tagging (Coxhead 2000)</h2>
      <p>
        On top of the basic/academic level flag, every entry is independently
        checked against the original 10-sublist table from Coxhead&apos;s 2000
        Academic Word List. The static lookup table covers all 570 word
        families and their inflections; if your word appears in any family, the
        entry page shows an &ldquo;AWL Sublist <em>N</em>&rdquo; badge (1 = most
        frequent in academic prose, 10 = least). The AWL signal is the
        authoritative published reference and is separate from our DB
        <code>level=academic</code> heuristic. See our{" "}
        <a href="/guide/awl-academic-word-list-sublists/">
          AWL Sublists Explained guide
        </a>{" "}
        for the full 570-family breakdown and a recommended study order.
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

      <h2>The CEFR Difficulty Tier classifier (A1-C2)</h2>
      <p>
        Every word entry on VocabWize carries a CEFR tier badge: A1, A2, B1, B2,
        C1, or C2. The Common European Framework of Reference is a published
        proficiency framework from the Council of Europe and is the de facto
        standard for describing English vocabulary difficulty in test prep
        (Cambridge English, IELTS, Pearson PTE), in published reference lists
        (English Vocabulary Profile from Cambridge University Press, Oxford 3000
        and Oxford 5000 from Oxford University Press), and in language teaching
        worldwide. CEFR itself does not classify individual words — that work is
        done by the published reference lists that map CEFR levels to specific
        vocabulary. We do not have access to the proprietary EVP, Oxford 3000,
        or Pearson Global Scale of English classifications.
      </p>
      <p>
        Our CEFR tag is a deterministic derivation from the COCA and BNC
        corpus-frequency rank already on every entry, calibrated against the
        published EVP and Oxford 3000/5000 cutoff bands. The cutoff table: A1 =
        COCA rank 1-1,000; A2 = COCA rank 1,001-2,000; B1 = COCA rank
        2,001-5,000; B2 = COCA rank 5,001-15,000; C1 = COCA rank 15,001-50,000;
        C2 = COCA rank 0 (unranked in COCA / BNC) or beyond 50,000. A
        morphological-depth correction bumps the tier up by one when the word
        is in a top-frequency band but has length ≥ 10 letters and a
        low-frequency derivational suffix (-tion, -graph, -ology, -ize,
        -ferous, -escence) — the COCA rank captures the lemma family while the
        surface form can be harder than the rank suggests. The cutoffs are
        VocabWize heuristics over the Council of Europe framework, not an
        official Council of Europe rating; every word entry surfaces this
        distinction in the CEFR reader-help block. The full classifier
        documentation is on the dedicated{" "}
        <a href="/guide/cefr-difficulty-tiers/">CEFR Difficulty Tiers</a> guide.
      </p>

      <h2>Coxhead AWL signal — the academic-register layer</h2>
      <p>
        On top of the CEFR tier, every word entry checks membership in the
        Coxhead Academic Word List (Averil Coxhead, 2000) — a closed,
        published list of 570 word families derived from a 3.5-million-word
        corpus of academic writing across arts, commerce, law, and science.
        The Coxhead AWL is the published reference cited by virtually every
        TOEFL, IELTS, and GRE preparation curriculum, and it is the
        authoritative source for "academic register" claims about a word. We
        check each headword (and its inflections) against a static lookup
        compiled directly from the 2000 sublist tables — no edits, no
        additions, no synthetic family expansion. A word that is in the
        Coxhead AWL appears with an "AWL Sublist N" badge; a word that is not
        in the AWL is honestly labelled outside the academic register
        (regardless of how "academic" it might sound). The CEFR tier and the
        Coxhead AWL sublist are orthogonal signals — see{" "}
        <a href="/guide/awl-academic-word-list-sublists/">the AWL guide</a>{" "}
        and{" "}
        <a href="/guide/cefr-difficulty-tiers/">the CEFR guide</a> for the
        published references behind each layer.
      </p>

      <h2>Two-tier honesty: DB level= heuristic vs published reference</h2>
      <p>
        Our internal database (ECDICT-derived) tags every word with a coarse
        <code>level</code> field — basic, intermediate, advanced, or academic.
        That tag is heuristic: it was assigned by ECDICT compilers using a mix
        of frequency and dictionary-cross-reference signals, and it is noisy in
        the academic bucket (~19,000 medical Latin entries are tagged
        academic). We expose the ECDICT level tag for transparency, but the
        authoritative signals on every entry are the published references: the
        COCA / BNC corpus frequency rank (Mark Davies, BYU / Oxford University
        Computing Services), the Coxhead AWL membership (Averil Coxhead,
        Victoria University of Wellington, 2000), and the Princeton WordNet
        synonym graph (George A. Miller et al., Princeton University). Where
        the ECDICT level tag disagrees with the COCA rank or with Coxhead AWL
        membership, the published reference takes priority on the visible
        reader-help block.
      </p>

      <h2>Corrections and feedback</h2>
      <p>
        If you find an incorrect definition, a missing sense, or a level
        classification that doesn&apos;t match your experience, we want to
        hear about it. Please <a href="/contact/">contact us</a> with the word
        and what you would change. We track every correction request.
      </p>

      <p className="text-sm text-slate-500 border-t pt-4 mt-8">
        Last reviewed: <time dateTime={METHODOLOGY_VINTAGE}>{new Date(METHODOLOGY_VINTAGE).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time>. Substantive
        changes to how we build the dataset will be reflected here before they
        reach production data.
      </p>
    </article>
  );
}
