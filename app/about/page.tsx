import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About VocabWize",
  description:
    "VocabWize is an English-vocabulary reference site for ESL learners. Our 160,000-word dictionary is built from ECDICT (CC BY 4.0), Princeton WordNet, the British National Corpus (BNC), and the Corpus of Contemporary American English (COCA), with academic-register classification from the Academic Word List (AWL, Coxhead 2000).",
  alternates: { canonical: "/about/" },
  openGraph: { url: "/about/" },
};

export default function AboutPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">About VocabWize</h1>

      <p>
        VocabWize is a free English-vocabulary reference site for ESL learners, students preparing for TOEFL or IELTS,
        and writers who want concrete frequency evidence behind a word. We cover over 160,000 headwords with definitions,
        IPA phonetics, parts of speech, inflections, frequency band, synonyms, antonyms, and side-by-side pair
        comparisons for commonly confused words.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Our Mission</h2>
      <p>
        Most online dictionaries copy from each other. We build ours directly from open lexical corpora so that every
        frequency claim, every part-of-speech tag, and every academic-register flag traces back to a named upstream
        source you can verify. That principle drives our methodology page, our corrections policy, and the per-page
        &ldquo;source&rdquo; labels you see on every word entry.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Sources</h2>
      <p>
        Five upstream authorities back the vocabwize.com data layer. We do not paraphrase third-party dictionaries; we
        ingest these corpora directly at build time.
      </p>
      <ul>
        <li>
          <strong>ECDICT</strong> &mdash; primary lexical corpus. ECDICT is an open-source English-Chinese dictionary
          database released under <em>CC BY 4.0</em>. ECDICT supplies our headword list, definitions, IPA phonetic
          transcriptions, inflection forms, and base frequency rank. The license requires attribution, which is why
          ECDICT appears on every page footer and in the JSON-LD <code>isBasedOn</code> array.
        </li>
        <li>
          <strong>Princeton WordNet</strong> &mdash; lexical database from Princeton University. Princeton WordNet
          supplies synonym, antonym, and synset relationships layered on top of ECDICT entries. The Princeton license
          is permissive; we use the standard 3.1 release.
        </li>
        <li>
          <strong>British National Corpus (BNC)</strong> &mdash; 100-million-word reference corpus of balanced British
          English. BNC frequency rank is one of the two inputs to our CEFR tier classifier. BNC is the older but
          register-balanced anchor; without BNC, a frequency band built only from COCA would over-weight American
          journalistic vocabulary.
        </li>
        <li>
          <strong>Corpus of Contemporary American English (COCA)</strong> &mdash; 1-billion-word corpus, 1990 to
          present, balanced across spoken, fiction, magazine, newspaper, and academic registers. COCA frequency rank
          is the second input to our CEFR classifier. Where BNC and COCA disagree by more than two bands, we mark the
          word as a low-confidence classification on the entry page itself.
        </li>
        <li>
          <strong>Academic Word List (AWL)</strong> &mdash; the 570 word families published by Averil Coxhead in 2000,
          grouped into 10 sublists by frequency in academic writing. AWL membership drives our
          <code>level=academic</code> tag and the &ldquo;Sublist N&rdquo; badge on entry pages. AWL is widely cited in
          ESL pedagogy; we cite Coxhead 2000 as the source on every relevant word page.
        </li>
      </ul>
      <p>
        We deliberately do not list Merriam-Webster, Oxford English Dictionary, or Wiktionary in the schema.org
        <code>reviewedBy</code> array. We link to them from our methodology page for cross-reference, but we do not
        copy or ingest their data, so claiming them as a source would be dishonest.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Two-tier corpus authority — DB heuristic vs published reference</h2>
      <p>
        Most online English-vocabulary sites either inherit a single dictionary
        wholesale (and copy its idiosyncrasies) or build a heuristic over
        scraped web text (and inherit its noise). VocabWize takes a two-tier
        approach. The first tier is the ECDICT-derived database — open-source
        under CC BY 4.0, with a coarse <code>level</code> tag (basic /
        intermediate / advanced / academic) that the ECDICT compilers
        assigned. We expose that tag for transparency, but we know it is
        heuristic: the <code>level=academic</code> bucket alone contains
        ~19,000 medical Latin entries that are not core academic register in
        the modern Coxhead AWL sense.
      </p>
      <p>
        The second tier is the published-reference layer that sits above the
        ECDICT database. The Corpus of Contemporary American English (Mark
        Davies, Brigham Young University; 1B+ words from 1990 to present) and
        the British National Corpus (Oxford University Computing Services;
        100M words, balanced British English) provide the frequency rank for
        every headword. The Coxhead Academic Word List (Averil Coxhead,
        Victoria University of Wellington, 2000; 570 word families × 10
        sublists, derived from a 3.5M-word academic corpus) provides the
        academic-register membership. The Princeton WordNet 3.1 lexical
        database (George A. Miller et al., Princeton University) provides the
        synonym / antonym / synset graph. Where the ECDICT heuristic
        disagrees with the COCA rank or the Coxhead AWL list, the published
        reference takes priority on the visible reader-help blocks. This is
        the two-tier honesty principle: a dictionary entry can show both the
        heuristic tag (for context) and the published-reference signal (as
        the authority), with no synthesis layer in between.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">EN-only positioning — what we cover, what we link out to</h2>
      <p>
        VocabWize is intentionally English-only. We do not host
        cross-language translation tables, bilingual glossaries, or non-English
        definitions; users who need EN-FR, EN-DE, EN-PT, EN-AR, or EN-JA
        translations can follow the per-page links to our sibling dictionaries
        in the DataPeek Research Network. Keeping the scope narrow lets us be
        more rigorous about the corpus authorities we cite: ECDICT, Princeton
        WordNet, the BNC, COCA, and the Coxhead AWL are all English-language
        published references, and each one is named on every word entry
        page, in the schema.org JSON-LD <code>sourceOrganization</code> array,
        and in the AuthorBox footer. A reader can take any frequency band,
        any AWL Sublist label, or any CEFR tier on this site straight back to
        the named upstream corpus and reproduce it.
      </p>
      <p>
        VocabWize is operated by the DataPeek Research Network from South
        Korea. Our editorial scope is grounded in the algorithmic authority of
        the COCA corpus (Mark Davies, Brigham Young University), the BNC
        corpus (Oxford University Computing Services), the Coxhead 2000 AWL
        list (Averil Coxhead, Victoria University of Wellington), the
        Princeton WordNet 3.1 graph (George A. Miller et al., Princeton
        University), and the Council of Europe CEFR framework — verifiable
        upstream published references that any reader can reproduce against
        the corpus. For first-language usage-judgment questions (is this
        register appropriate for an academic essay? does this phrasing sound
        natural?), we link out to the Oxford Learner&apos;s Dictionary, the
        Cambridge Advanced Learner&apos;s Dictionary, and Merriam-Webster.
        Those publishers remain authoritative on those questions and our
        per-word links lead readers directly to their entries for consultation.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Editorial Team</h2>
      <p>
        VocabWize is published by the DataPeek Research Network. The corpora
        and published reference lists named above &mdash; ECDICT, Princeton
        WordNet, the British National Corpus, the Corpus of Contemporary
        American English, the Coxhead Academic Word List, and the Council of
        Europe CEFR framework &mdash; are the authorities behind every figure
        on the site. The VocabWize Editorial Team handles selection,
        normalization, surface phrasing of CEFR-tier explanations, surface
        phrasing of AWL reader-help blocks, and corrections; the team
        reviews every word entry against these published references before
        publication.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact Us</h2>
      <p>
        Have questions or feedback? Visit our{" "}
        <a href="/contact/" className="text-indigo-600 hover:underline">
          Contact page
        </a>{" "}
        or report a data error through our{" "}
        <a href="/corrections-policy/" className="text-indigo-600 hover:underline">
          Corrections Policy
        </a>
        .
      </p>
    </article>
  );
}
