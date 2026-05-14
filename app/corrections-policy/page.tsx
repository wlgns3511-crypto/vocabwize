import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';

const c = siteConfig;

export const metadata: Metadata = {
  title: 'Corrections Policy',
  description:
    'How to report a vocabwize.com data error against the upstream corpus (ECDICT, Princeton WordNet, BNC, COCA, Academic Word List). How we verify and post-correct CEFR tier vs raw BNC/COCA frequency band mismatches.',
  alternates: { canonical: '/corrections-policy/' },
  openGraph: { url: '/corrections-policy/' },
};

export default function CorrectionsPolicyPage() {
  return (
    <article className="prose prose-slate max-w-3xl">
      <h1>Corrections Policy</h1>
      <p>
        {c.name} aims to make data errors easy to report and easy to verify. We review every correction request
        against the underlying upstream corpus &mdash; ECDICT for headword/definition, Princeton WordNet for
        synset/antonym relationships, the British National Corpus (BNC) and the Corpus of Contemporary American
        English (COCA) for frequency-derived CEFR tier, and the Academic Word List (AWL, Coxhead 2000) for academic
        register &mdash; before updating a page.
      </p>

      <h2>What to send</h2>
      <p>
        Include the page URL, the field you believe is incorrect, and the source link or document you used to verify
        the discrepancy. For frequency-related corrections, please specify whether you are citing BNC or COCA
        rank, since the two corpora sometimes disagree by several bands. For AWL membership, please cite the Coxhead
        2000 publication.
      </p>

      <h2>How CEFR tier corrections are handled</h2>
      <p>
        Our CEFR tier (A1 through C2) is derived from a deterministic heuristic over BNC and COCA frequency rank.
        It is not a Cambridge-certified classification. <strong>If our derived CEFR tier mismatches the BNC or
        COCA frequency band you observe</strong>, please tell us which corpus disagrees and what rank you see. The
        BNC and COCA frequency rankings themselves are not editable on our side (we ingest them as-is), but the
        heuristic mapping table between rank and CEFR band is, and we adjust it when a class of mismatches is
        reported.
      </p>

      <h2>How AWL-sublist corrections are handled</h2>
      <p>
        Each AWL membership claim cites Coxhead 2000. If you believe a word should appear in a different AWL sublist,
        please reference the original Coxhead 2000 sublist tables. If you believe a word should not be in the AWL at
        all, the same Coxhead 2000 source is the authority. We do not add or remove AWL entries on our own opinion.
      </p>

      <h2>How definitions and inflection corrections are handled</h2>
      <p>
        ECDICT definitions and inflection forms come from the upstream release we ingested. Where ECDICT is wrong,
        we file a correction upstream and add a per-word usage note on our page in the interim. Princeton WordNet
        synset corrections are similarly upstreamed.
      </p>

      <h2>How corrections appear</h2>
      <p>
        When a correction changes the substance of a page, we update the reviewed date and keep the revised source
        labeling visible. Pages do not silently revise &mdash; the upstream corpus is named on each fix, so readers
        can verify the chain of evidence back to ECDICT, BNC, COCA, or the AWL.
      </p>

      <h2>Scope</h2>
      <p>
        We correct factual data issues (wrong definition, wrong POS, wrong inflection, wrong frequency band, wrong
        AWL sublist), broken links, and methodology mistakes. We do not rewrite pages to imply fresher data than the
        underlying ECDICT release, BNC, or COCA actually provides.
      </p>
    </article>
  );
}
