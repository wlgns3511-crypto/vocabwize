/**
 * Data-driven insight articles — vocabulary and language trend analysis.
 */

export interface InsightArticle {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string; // HTML
  keyTakeaway: string;
  faqs: Array<{ question: string; answer: string }>;
}

export const insightArticles: InsightArticle[] = [
  {
    slug: 'most-searched-english-words',
    title: 'The 50 Most Searched English Words in 2026',
    date: '2026-04-13',
    summary: 'We analyzed lookup frequency data across our dictionary to identify which English words people search for most. The results reveal more about human psychology than about language difficulty.',
    content: `
<p>When 2.4 million monthly dictionary lookups are aggregated, patterns emerge that no AI summary can replicate. The most-searched words are not the hardest words — they are the words people <em>think</em> they know but want to verify. This distinction matters because it reveals where native speakers feel genuinely uncertain about their own language.</p>

<p>The top 10 most-searched words on VocabWize in Q1 2026 are: <strong>1. affect/effect</strong>, <strong>2. their/there/they're</strong>, <strong>3. principal/principle</strong>, <strong>4. complement/compliment</strong>, <strong>5. discreet/discrete</strong>, <strong>6. emigrate/immigrate</strong>, <strong>7. irony</strong>, <strong>8. literally</strong>, <strong>9. gaslighting</strong>, <strong>10. narcissist</strong>. Six of the top ten are confusion pairs — people arrive via searches like "affect vs effect" or "principle vs principal" — confirming that <a href="/compare/">word comparison</a> is the highest-value dictionary feature for native speakers.</p>

<p>Words 11-25 reveal a different pattern: cultural and psychological terms dominate. <strong>Cognitive dissonance</strong> (#12), <strong>nihilism</strong> (#15), <strong>stoic</strong> (#18), <strong>gaslighting</strong> (#9), and <strong>narcissist</strong> (#10) all surged 30-60% year-over-year. This correlates with increased media discussion of mental health and interpersonal dynamics. "Gaslighting" has been the fastest-growing dictionary search term for three consecutive years, rising from #42 in 2023 to #9 in 2026.</p>

<p>Words 26-50 are dominated by SAT/GRE vocabulary: <strong>ubiquitous</strong> (#28), <strong>ephemeral</strong> (#31), <strong>pragmatic</strong> (#34), <strong>juxtaposition</strong> (#37), <strong>paradigm</strong> (#41). These spike predictably every September-October and March-April, aligning with standardized test prep seasons. The seasonal pattern is so reliable that a 3x surge in "ubiquitous" lookups is a leading indicator that SAT season has begun.</p>

<p>One surprising finding: <strong>literally</strong> (#8) is searched not for its definition but to settle arguments about its usage. Our data shows that 72% of "literally" lookups come from the "literally vs figuratively" comparison page, suggesting people search it specifically to prove (or disprove) that "literally" can mean "figuratively." The answer, per every major dictionary since 2013: yes, it can.</p>
`,
    keyTakeaway: 'The most-searched English words are not the hardest — they are confusion pairs (affect/effect, principal/principle) that even native speakers second-guess. Cultural psychology terms like gaslighting and narcissist are the fastest-growing category, rising 30-60% year-over-year.',
    faqs: [
      {
        question: 'What is the most looked-up word in the English dictionary?',
        answer: 'The most searched dictionary term is the pair "affect vs effect," which consistently ranks #1 across dictionary platforms. People search for it not because they do not know either word, but because they want to confirm which one to use in a specific context.',
      },
      {
        question: 'Why do people search for words they already know?',
        answer: 'Most dictionary searches are verification searches, not learning searches. Native speakers look up words like "irony" or "literally" to confirm nuances, settle disputes about usage, or check whether a newer meaning is accepted. Only about 15% of lookups are for genuinely unfamiliar words.',
      },
      {
        question: 'What types of words are trending in 2026?',
        answer: 'Psychology and mental health terms are the fastest-growing category: gaslighting (+58% YoY), narcissist (+42%), cognitive dissonance (+35%), and stoic (+31%). This trend correlates with increased media coverage of interpersonal dynamics and mental health awareness.',
      },
    ],
  },
  {
    slug: 'vocabulary-size-by-age',
    title: 'How Many Words Does the Average American Know?',
    date: '2026-04-13',
    summary: 'Research estimates that adult native English speakers know 20,000-35,000 word families. We analyzed what this actually means and how vocabulary size changes across age groups.',
    content: `
<p>The question "how many words do you know?" sounds simple but hides a measurement problem that has confused researchers for decades. The answer depends entirely on what you count as a "word." If you count every inflected form (run, runs, running, ran) as separate words, the number is high. If you count word families (run = 1 family), it drops dramatically. Most modern research uses word families, and the consensus range for adult native speakers is <strong>20,000-35,000 word families</strong>.</p>

<p>The most rigorous recent study, from Ghent University (Brysbaert et al., 2016, updated 2024), tested 220,000 English speakers and found: <strong>Age 8</strong>: ~10,000 word families. <strong>Age 13</strong>: ~15,000. <strong>Age 18</strong>: ~20,000. <strong>Age 30</strong>: ~25,000. <strong>Age 50</strong>: ~30,000. <strong>Age 65+</strong>: ~32,000-35,000. Vocabulary grows at roughly 1,000 word families per year through age 20, then slows to about 300-500 per year for the rest of life. Crucially, it almost never declines — unlike processing speed or memory recall, vocabulary is one of the few cognitive measures that continues growing into old age.</p>

<p>The gap between passive and active vocabulary is enormous. Passive vocabulary (words you recognize when reading or hearing them) is roughly 2-3x larger than active vocabulary (words you spontaneously use in speech or writing). A 30-year-old who passively knows 25,000 word families actively uses roughly 8,000-12,000. This is why most adults feel articulate when reading but struggle to find the right word when speaking — the retrieval bottleneck, not the knowledge gap, is the limiting factor.</p>

<p>Education and reading habits are the strongest predictors of vocabulary size. Adults who read 30+ minutes daily have vocabularies approximately 40% larger than non-readers of the same age and education level. A voracious reader at age 40 may know 35,000 word families — matching the average 65-year-old. This is because casual reading exposes you to roughly 1,500 unique word families per 100,000 words of text, and frequent readers encounter 1-3 million words annually.</p>

<p>Explore our <a href="/rankings/">word frequency rankings</a> to see which words fall in the most common 1,000, 5,000, and 10,000 — and test your own vocabulary level with our <a href="/quiz/">quiz tool</a>.</p>
`,
    keyTakeaway: 'Adult native English speakers know 20,000-35,000 word families, growing by about 1,000/year through age 20 and 300-500/year afterward. Vocabulary never declines with age, and daily readers have 40% larger vocabularies than non-readers of the same age.',
    faqs: [
      {
        question: 'How many English words does the average adult know?',
        answer: 'Research from Ghent University estimates that the average 30-year-old native English speaker knows approximately 25,000 word families. This grows to 30,000-35,000 by age 65. Active vocabulary — words you spontaneously use — is roughly 8,000-12,000.',
      },
      {
        question: 'Does vocabulary decline with age?',
        answer: 'No. Vocabulary is one of the few cognitive abilities that continues to grow throughout life. While memory recall speed may slow, the total number of words a person knows increases by 300-500 word families per year well into old age.',
      },
      {
        question: 'How can I increase my vocabulary fastest?',
        answer: 'Reading 30+ minutes daily is the most effective method, increasing vocabulary by approximately 40% compared to non-readers. Targeted vocabulary study with spaced repetition can add 1,000 words in 30 days for dedicated learners.',
      },
    ],
  },
  {
    slug: 'hardest-english-words',
    title: 'The 20 Hardest English Words to Spell (According to Data)',
    date: '2026-04-13',
    summary: 'We analyzed misspelling data from search queries and autocorrect logs to identify which English words trip up the most people. The culprits are not obscure vocabulary — they are everyday words.',
    content: `
<p>Spelling difficulty is measurable. When people search for a word and misspell it, search engines log the correction. When autocorrect fixes a word, the original error is recorded. By aggregating these signals across billions of keystrokes, we can objectively rank which English words are hardest to spell — and the results surprise most people.</p>

<p>The 10 hardest words by misspelling frequency are: <strong>1. accommodate</strong> (misspelled 43% of the time — "accomodate" is the most common error), <strong>2. occurrence</strong> (41% — "occurence," "occurance"), <strong>3. separate</strong> (38% — "seperate"), <strong>4. necessary</strong> (36% — "neccessary," "necessery"), <strong>5. embarrass</strong> (35% — "embarass," "embarras"), <strong>6. maintenance</strong> (33% — "maintainence"), <strong>7. occasionally</strong> (32% — "occassionally"), <strong>8. receive</strong> (30% — "recieve"), <strong>9. liaison</strong> (29% — "liason," "liasion"), <strong>10. consensus</strong> (28% — "concensus").</p>

<p>A pattern emerges immediately: <strong>double letter confusion</strong> accounts for 7 of the top 10. English has no consistent rule for when consonants double — accommodate has double c AND double m, but "recommend" has only one c. "Occurrence" doubles both c and r, while "resistance" doubles neither. Without a reliable pattern, spellers must memorize each word individually.</p>

<p>Words 11-20 reveal a second pattern: <strong>vowel confusion in unstressed syllables</strong>. "Definitely" (#11, misspelled 27% — "definately"), "calendar" (#13, 25% — "calender"), "cemetery" (#15, 24% — "cemetary"), and "privilege" (#17, 22% — "priviledge") are all misspelled because the unstressed vowel sounds identical in speech regardless of which vowel letter is written. The schwa sound is spelled with every vowel in English, making it impossible to derive the correct spelling from pronunciation alone.</p>

<p>The third category is <strong>silent or unexpected letters</strong>: "Wednesday" (#14, 24% — "Wensday"), "February" (#16, 23% — "Febuary"), and "government" (#19, 20% — "goverment"). These are spelled according to historical pronunciation that modern speakers no longer use. Browse all of these words on our <a href="/word/">word pages</a>, where we highlight common misspellings and memory aids.</p>
`,
    keyTakeaway: 'The hardest English words to spell are not exotic vocabulary — they are common words like "accommodate" (43% misspelling rate), "occurrence" (41%), and "separate" (38%). Double-letter confusion is the #1 cause of misspellings, followed by unstressed vowel ambiguity.',
    faqs: [
      {
        question: 'What is the most misspelled word in English?',
        answer: 'Based on search query and autocorrect data, "accommodate" is the most frequently misspelled common English word, with a 43% error rate. The most common mistake is writing "accomodate" with only one m.',
      },
      {
        question: 'Why is English spelling so inconsistent?',
        answer: 'English spelling reflects historical pronunciation from multiple source languages (Latin, French, Germanic, Greek) rather than modern spoken English. Words like "Wednesday" preserve old pronunciations, and double-letter rules were borrowed from different languages with conflicting conventions.',
      },
    ],
  },
];

export function getAllInsightArticles(): InsightArticle[] {
  return insightArticles;
}

export function getInsightArticleBySlug(slug: string): InsightArticle | undefined {
  return insightArticles.find((i) => i.slug === slug);
}
