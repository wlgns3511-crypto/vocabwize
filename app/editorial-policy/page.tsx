import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';

const c = siteConfig;

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description:
    'Editorial standards for VocabWize: how we ingest ECDICT, Princeton WordNet, BNC, COCA, and the Academic Word List (Coxhead 2000); how we separate review responsibility from source responsibility; and how we handle CEFR-tier heuristics.',
  alternates: { canonical: '/editorial-policy/' },
  openGraph: { url: '/editorial-policy/' },
};

export default function EditorialPolicyPage() {
  return (
    <article className="prose prose-slate max-w-3xl">
      <h1>Editorial Policy</h1>
      <p>
        {c.name} publishes English-vocabulary reference pages built from open lexical corpora. We favor source
        transparency over recency theater: each word entry shows the actual data vintage of the corpus we ingested,
        not the date a page was casually refreshed.
      </p>

      <h2>Source authorities &mdash; what we ingest, who is responsible</h2>
      <p>
        Five upstream authorities are the source of fact on this site. We list them explicitly on the About page and
        in JSON-LD <code>isBasedOn</code>:
      </p>
      <ul>
        <li>
          <strong>ECDICT</strong> &mdash; primary lexical corpus, licensed under CC BY 4.0. ECDICT supplies headwords,
          definitions, IPA phonetics, parts of speech, and inflection forms.
        </li>
        <li>
          <strong>Princeton WordNet</strong> &mdash; Princeton University&apos;s lexical database, used for synonym,
          antonym, and synset linkage on top of ECDICT.
        </li>
        <li>
          <strong>British National Corpus (BNC)</strong> &mdash; the 100-million-word balanced British-English
          reference corpus, used as one of two inputs to our CEFR-tier classifier.
        </li>
        <li>
          <strong>Corpus of Contemporary American English (COCA)</strong> &mdash; the 1-billion-word American-English
          corpus, used as the second input to our CEFR-tier classifier.
        </li>
        <li>
          <strong>Academic Word List (AWL)</strong> &mdash; Averil Coxhead&apos;s 2000 list of 570 academic word
          families across 10 sublists. AWL drives our <code>level=academic</code> classification and the
          &ldquo;Sublist N&rdquo; badge on entry pages.
        </li>
      </ul>

      <h2>Review responsibility vs source responsibility</h2>
      <p>
        We deliberately separate two roles in schema.org. The <code>sourceOrganization</code> array on every word
        entry lists ECDICT, Princeton WordNet, BNC, COCA, and the AWL because those are the actual data origins. The
        <code>reviewedBy</code> field lists the VocabWize Editorial Team because the team is responsible for
        normalization, classification choices, and corrections &mdash; not for fabricating fresh dictionary content
        that the upstream corpora never published.
      </p>

      <h2>How we publish</h2>
      <p>
        Every entry page shows the underlying dataset (ECDICT vintage), the data review date, and a per-word band
        derived from BNC and COCA frequency rank. We do not relabel stale ECDICT data with a newer year. The Coxhead
        2000 AWL is also dated honestly: AWL was published in 2000 and we do not pretend it was updated since.
      </p>

      <h2>CEFR tier &mdash; honest heuristic disclosure</h2>
      <p>
        CEFR tier (A1 through C2) is not an officially-licensed Cambridge classification. We derive it from a
        deterministic heuristic over BNC frequency rank and COCA frequency rank, with academic-register escalation
        from the AWL. This heuristic is disclosed on the methodology page. We do not claim CEFR-Cambridge
        certification, and we mark a word as low-confidence whenever BNC and COCA bands disagree by more than two
        levels.
      </p>

      <h2>What we avoid</h2>
      <p>
        We do not relabel stale data with a newer year, invent expert credentials, hide source limitations, or claim
        Merriam-Webster or Oxford as data sources when we do not ingest their data. Where ECDICT or WordNet is
        incomplete (etymology, usage notes), we say so directly on the entry rather than fabricating prose.
      </p>

      <h2>Corrections</h2>
      <p>
        If you find an error &mdash; a misclassified CEFR tier, a wrong AWL sublist, a missing or wrong inflection
        &mdash; use the contact page or the correction link on the site. Material corrections are reviewed against the
        upstream corpus (ECDICT release, BNC ranking, COCA ranking, AWL membership) and reflected on-page after
        verification.
      </p>
    </article>
  );
}
