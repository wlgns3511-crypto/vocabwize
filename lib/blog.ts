export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  readingTime: number;
  content: string;
}

const posts: BlogPost[] = [
  {
    slug: "how-to-learn-new-words-fast",
    title: "How to Learn 100 New Words Per Week (And Actually Remember Them)",
    description:
      "Spaced repetition, context learning, and root-based chunking are scientifically proven to accelerate vocabulary acquisition. Here's exactly how to learn 100 words per week and retain them long-term.",
    publishedAt: "2024-10-12",
    updatedAt: "2025-01-08",
    category: "Vocabulary Building",
    readingTime: 7,
    content: `
<h2>Why Most Vocabulary Study Doesn't Stick</h2>
<p>Flashcards that you look at once a day in linear order are one of the least efficient ways to learn vocabulary. The problem is the "forgetting curve" — first described by psychologist Hermann Ebbinghaus in 1885 and confirmed by decades of subsequent research.</p>
<p>Ebbinghaus found that we forget roughly <strong>50% of new information within an hour</strong>, 70% within a day, and 90% within a week — unless we actively review. The key insight: each review resets the forgetting curve and extends how long we remember. This is the foundation of <strong>spaced repetition</strong>.</p>

<h2>Spaced Repetition: The Science of When to Review</h2>
<p>Spaced Repetition Systems (SRS) schedule reviews at increasing intervals based on how well you know each item:</p>
<ul>
  <li><strong>First review</strong>: 1 day after initial learning</li>
  <li><strong>Second review</strong>: 3 days after first review</li>
  <li><strong>Third review</strong>: 7 days</li>
  <li><strong>Fourth review</strong>: 21 days</li>
  <li><strong>Fifth+ review</strong>: Progressively longer intervals</li>
</ul>
<p>Items you know well get reviewed less frequently. Items you struggle with get reviewed more often. SRS apps like Anki implement this automatically. If you use physical flashcards, the Leitner box system approximates the same effect.</p>
<p>Research consistently shows SRS users retain 90%+ of vocabulary after 6 months versus less than 20% for passive review methods.</p>

<h2>Context Learning vs. Definition Memorization</h2>
<p>Here is a critical finding from vocabulary research: <strong>learning a word in context is approximately 3 times more effective</strong> than memorizing a definition in isolation.</p>
<p>When you see "perfidious" in the sentence "The perfidious advisor betrayed his king's secrets to the enemy," you encode the word's meaning, connotation, grammar class, and typical usage simultaneously. When you memorize "perfidious = treacherous," you encode only a synonym.</p>
<p>Practical implication: always write an example sentence when adding a new word to your flashcard. Reading widely — novels, quality journalism, academic writing — provides continuous context exposure.</p>

<h2>Active Recall vs. Passive Reading</h2>
<p>Passive review (reading your word list) creates the <em>illusion</em> of learning. Active recall — trying to produce the word before you see it — creates actual learning. Studies by Roediger and Karpicke (2006) found active recall produced 50% better retention than passive study over a one-week period.</p>
<p>Practical technique: cover the definition side of your flashcard and try to recall it. Test yourself before reviewing notes. This "testing effect" is one of the most replicated findings in cognitive psychology.</p>

<h2>Root-Based Chunking: Learning Dozens of Words at Once</h2>
<p>English borrows heavily from Latin and Greek. Learning roots, prefixes, and suffixes lets you decode unfamiliar words on the fly. The prefix <strong>"pre-"</strong> (before) appears in: precede, predict, preliminary, preempt, prescribe, precocious, premise, premonition, prerequisite, prevalent — and hundreds more.</p>
<p>Knowing 50 high-frequency roots unlocks 5,000+ words. This is dramatically more efficient than learning words one at a time.</p>

<h2>The 100-Words-Per-Week Framework</h2>
<p>To learn 100 new words per week sustainably:</p>
<ul>
  <li><strong>Daily new words</strong>: Add 20 new words per day (Monday–Friday)</li>
  <li><strong>Daily review time</strong>: 15–20 minutes using SRS</li>
  <li><strong>Context exposure</strong>: Read 20–30 minutes in English daily (books, quality articles)</li>
  <li><strong>Weekly review</strong>: Saturday/Sunday — review the week's 100 words without looking at definitions first</li>
</ul>
<p>At this pace, you learn 5,200 words per year — enough to go from intermediate to advanced English fluency. Use <a href="/word/">VocabWize</a> to look up definitions, usage examples, and etymology for every word you encounter.</p>
`,
  },
  {
    slug: "gre-vocabulary-most-common-words",
    title: "Most Common GRE Vocabulary Words: The 100 You Must Know",
    description:
      "The GRE tests obscure academic vocabulary that rarely appears in everyday conversation. Learn why the test focuses on these words, which categories matter most, and the 100 most frequently tested.",
    publishedAt: "2024-10-28",
    updatedAt: "2025-01-20",
    category: "Test Prep",
    readingTime: 8,
    content: `
<h2>Why Does the GRE Test Such Obscure Words?</h2>
<p>The GRE Verbal section tests vocabulary that is common in academic writing but rare in everyday speech. ETS (the test maker) defends this by arguing that the ability to understand nuanced academic vocabulary predicts success in graduate-level reading — which relies heavily on precise, technical, and abstract language.</p>
<p>Critics argue the vocabulary section primarily tests socioeconomic exposure to books and quality education. Regardless of your view, if you're taking the GRE, you need to know these words.</p>

<h2>Categories of GRE Vocabulary</h2>
<p>GRE vocabulary clusters into predictable categories:</p>

<h3>Academic Verbs</h3>
<p>Verbs used to describe intellectual actions: <strong>attenuate</strong> (weaken), <strong>enumerate</strong> (list systematically), <strong>corroborate</strong> (confirm with evidence), <strong>obfuscate</strong> (make confusing), <strong>conflate</strong> (merge incorrectly), <strong>extrapolate</strong> (extend data beyond known range), <strong>posit</strong> (assume as fact), <strong>mitigate</strong> (lessen severity), <strong>obviate</strong> (prevent), <strong>promulgate</strong> (make widely known).</p>

<h3>Negative Adjectives</h3>
<p>Adjectives describing undesirable qualities: <strong>inimical</strong> (hostile, harmful), <strong>tendentious</strong> (promoting a particular cause biased), <strong>truculent</strong> (aggressively defiant), <strong>venal</strong> (susceptible to bribery), <strong>vituperative</strong> (bitter, abusive), <strong>obsequious</strong> (fawning, servile), <strong>perfidious</strong> (treacherous), <strong>recalcitrant</strong> (stubbornly resistant), <strong>sycophantic</strong> (excessively complimentary).</p>

<h3>Positive Adjectives</h3>
<p>Adjectives describing admirable qualities: <strong>perspicacious</strong> (having keen insight), <strong>magnanimous</strong> (generous, noble), <strong>sagacious</strong> (having good judgment), <strong>pellucid</strong> (clear and easy to understand), <strong>sanguine</strong> (optimistic), <strong>assiduous</strong> (diligent), <strong>circumspect</strong> (careful, cautious).</p>

<h3>Words About Words and Arguments</h3>
<p>The GRE loves words about rhetoric and reasoning: <strong>polemic</strong> (controversial argument), <strong>sophistry</strong> (clever but misleading reasoning), <strong>apocryphal</strong> (of doubtful authenticity), <strong>tendentious</strong>, <strong>equivocate</strong> (use ambiguous language to avoid commitment), <strong>gainsay</strong> (deny or contradict), <strong>belie</strong> (disguise or contradict).</p>

<h3>Personality Descriptors</h3>
<p><strong>Laconic</strong> (using few words), <strong>loquacious</strong> (very talkative), <strong>phlegmatic</strong> (calm, unexcitable), <strong>choleric</strong> (easily angered), <strong>mercurial</strong> (subject to sudden changes), <strong>stolid</strong> (calm and dependable), <strong>sanguine</strong> (optimistic).</p>

<h2>Top 30 Most Frequently Tested GRE Words</h2>
<table>
  <thead>
    <tr><th>Word</th><th>Part of Speech</th><th>Definition</th></tr>
  </thead>
  <tbody>
    <tr><td>Abjure</td><td>verb</td><td>Solemnly renounce a belief or claim</td></tr>
    <tr><td>Ameliorate</td><td>verb</td><td>Make something bad better</td></tr>
    <tr><td>Anachronism</td><td>noun</td><td>Thing out of its proper time period</td></tr>
    <tr><td>Anomalous</td><td>adjective</td><td>Deviating from the norm</td></tr>
    <tr><td>Antipathy</td><td>noun</td><td>Strong dislike</td></tr>
    <tr><td>Arcane</td><td>adjective</td><td>Understood by few; mysterious</td></tr>
    <tr><td>Assuage</td><td>verb</td><td>Make an unpleasant feeling less intense</td></tr>
    <tr><td>Belie</td><td>verb</td><td>Fail to give a true impression of</td></tr>
    <tr><td>Capricious</td><td>adjective</td><td>Given to sudden, unpredictable changes</td></tr>
    <tr><td>Censure</td><td>verb/noun</td><td>Express severe disapproval</td></tr>
    <tr><td>Chicanery</td><td>noun</td><td>Trickery used to achieve a goal</td></tr>
    <tr><td>Compunction</td><td>noun</td><td>Anxiety or guilt from wrongdoing</td></tr>
    <tr><td>Cupidity</td><td>noun</td><td>Greed for money or possessions</td></tr>
    <tr><td>Dearth</td><td>noun</td><td>A scarcity or lack of something</td></tr>
    <tr><td>Didactic</td><td>adjective</td><td>Intended to teach; moralistic</td></tr>
    <tr><td>Enervate</td><td>verb</td><td>Weaken or deplete energy</td></tr>
    <tr><td>Equivocate</td><td>verb</td><td>Use ambiguous language to avoid commitment</td></tr>
    <tr><td>Erudite</td><td>adjective</td><td>Having wide knowledge from study</td></tr>
    <tr><td>Filibuster</td><td>noun/verb</td><td>Prolonged speech obstructing legislation</td></tr>
    <tr><td>Garrulous</td><td>adjective</td><td>Excessively talkative about trivial matters</td></tr>
    <tr><td>Iconoclast</td><td>noun</td><td>One who attacks cherished beliefs</td></tr>
    <tr><td>Impecunious</td><td>adjective</td><td>Having little or no money</td></tr>
    <tr><td>Inimical</td><td>adjective</td><td>Tending to obstruct or harm</td></tr>
    <tr><td>Laconic</td><td>adjective</td><td>Using very few words</td></tr>
    <tr><td>Loquacious</td><td>adjective</td><td>Tending to talk a great deal</td></tr>
    <tr><td>Mendacious</td><td>adjective</td><td>Not telling the truth; lying</td></tr>
    <tr><td>Pedantic</td><td>adjective</td><td>Excessively concerned with minor details</td></tr>
    <tr><td>Perfidious</td><td>adjective</td><td>Deceitful and untrustworthy</td></tr>
    <tr><td>Recondite</td><td>adjective</td><td>Not known by many people; obscure</td></tr>
    <tr><td>Sycophant</td><td>noun</td><td>Person who flatters powerful people for gain</td></tr>
  </tbody>
</table>

<h2>Learning Strategy</h2>
<p>Group GRE words by category (as above) rather than alphabetically. Use each word in your own sentence immediately after learning it. Look up the etymology — many GRE words become memorable once you know their roots (ameliorate = Latin <em>melior</em>, better).</p>
<p>Use <a href="/word/">VocabWize</a> to look up full definitions, etymology, and usage examples for every GRE word you encounter. Building deep knowledge of each word — not just a synonym — is what helps on the actual test, which often asks you to distinguish between closely related words.</p>
`,
  },
  {
    slug: "sat-vocabulary-strategies-2024",
    title: "SAT Vocabulary Strategies That Actually Work in 2024",
    description:
      "The current SAT tests vocabulary in context, not through definition recall. Learn the new format, the right study strategies, and how to build the vocabulary knowledge that actually moves the needle.",
    publishedAt: "2024-11-10",
    category: "Test Prep",
    readingTime: 6,
    content: `
<h2>How the SAT Tests Vocabulary Today</h2>
<p>The SAT has changed significantly. If you're using vocabulary lists from 2015 or earlier, stop — they're designed for an outdated test format.</p>
<p>The current digital SAT (introduced in 2023 for US students) tests vocabulary through <strong>"words in context" questions</strong>, not traditional sentence completion or definition questions. You'll see a passage, then a question like:</p>
<blockquote>"As used in line 14, 'cultivated' most nearly means..."</blockquote>
<p>The answer choices will contain multiple legitimate definitions of the word. Your job is to identify which meaning fits the specific context of the passage.</p>

<h2>What Changed: Goodbye Sentence Completions</h2>
<p>The old SAT had questions like:</p>
<blockquote>"The professor was known for her _____ lectures, which held students spellbound for hours." (A) laconic (B) soporific (C) captivating (D) terse (E) pithy</blockquote>
<p>These tested raw vocabulary knowledge — you either knew the words or you didn't. The new format is different: it tests whether you understand how a word functions in context, including connotation, register, and precise meaning.</p>

<h2>Key Strategy: Connotation Over Denotation</h2>
<p>On words-in-context questions, the right answer often hinges on <strong>connotation</strong> (emotional tone and associations) rather than denotation (literal definition).</p>
<p>Example: "undermine," "weaken," and "destabilize" are synonyms, but they have different connotations. "Undermine" implies covert or gradual action; "destabilize" is more neutral; "weaken" is the most general. In a passage about political opposition tactics, the correct answer might be "undermine" even though all three technically mean "make less strong."</p>
<p>When studying vocabulary, always learn the connotation and typical usage context, not just the definition.</p>

<h2>Process of Elimination on Vocabulary Questions</h2>
<p>Even if you don't know a word well, you can often eliminate wrong answers:</p>
<ol>
  <li>Read the full sentence and paragraph containing the word</li>
  <li>Identify whether the context is positive, negative, or neutral</li>
  <li>Eliminate answers with the wrong valence (positive vs. negative)</li>
  <li>Among remaining options, identify which fits the specific degree and context</li>
</ol>
<p>This process of elimination can raise your accuracy even on words you've never encountered before.</p>

<h2>Building Vocabulary Through High-Yield Reading</h2>
<p>The most efficient long-term SAT vocabulary preparation is extensive reading in high-quality prose. The SAT's passages are drawn from:</p>
<ul>
  <li>Literary fiction and literary nonfiction</li>
  <li>Historical documents and political speeches</li>
  <li>Social science articles</li>
  <li>Natural science articles</li>
</ul>
<p>High-yield reading sources that expose you to SAT-relevant vocabulary:</p>
<ul>
  <li><strong>The New York Times Opinion section</strong> — analytical vocabulary in context</li>
  <li><strong>The Atlantic</strong> — long-form articles with sophisticated vocabulary</li>
  <li><strong>Scientific American</strong> — science vocabulary and precise technical language</li>
  <li><strong>Classic American literature</strong> (Jane Austen, F. Scott Fitzgerald, Toni Morrison) — literary vocabulary in narrative context</li>
</ul>

<h2>30-Day Vocabulary Plan</h2>
<table>
  <thead>
    <tr><th>Week</th><th>Focus</th><th>Words per Day</th><th>Activities</th></tr>
  </thead>
  <tbody>
    <tr><td>Week 1</td><td>Transition/contrast words</td><td>10</td><td>Flashcards + sentences</td></tr>
    <tr><td>Week 2</td><td>Academic verbs (analyze, evaluate, argue)</td><td>10</td><td>Passage practice</td></tr>
    <tr><td>Week 3</td><td>Adjectives with subtle distinctions</td><td>10</td><td>Connotation practice</td></tr>
    <tr><td>Week 4</td><td>Review + full practice questions</td><td>Spaced review</td><td>Official SAT practice tests</td></tr>
  </tbody>
</table>
<p>Use <a href="/word/">VocabWize</a> to look up usage examples and <a href="/compare/">compare similar words</a> to understand subtle distinctions — exactly the skill the SAT tests.</p>
`,
  },
  {
    slug: "vocabulary-for-professional-emails",
    title: "Professional Email Vocabulary: Words That Make You Sound Credible",
    description:
      "The words you choose in professional emails signal competence, confidence, and credibility. Learn which words to use, which to avoid, and how to strike the right tone.",
    publishedAt: "2024-11-25",
    category: "Professional Skills",
    readingTime: 6,
    content: `
<h2>Why Vocabulary Matters in Professional Communication</h2>
<p>Research on workplace communication consistently finds that word choice influences how readers perceive the writer's competence. In email specifically — where tone and facial expression are absent — vocabulary does heavy lifting in establishing credibility.</p>
<p>This doesn't mean using complex words to impress. It means choosing <strong>precise, confident, active words</strong> that communicate clearly without hedging or filler.</p>

<h2>Replacing Weak Words with Stronger Alternatives</h2>
<table>
  <thead>
    <tr><th>Weak Word/Phrase</th><th>Stronger Alternative</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Very important</td><td>Critical / Essential</td><td>"Very" is a crutch; be specific</td></tr>
    <tr><td>I think</td><td>I believe / The data suggests</td><td>Separate opinion from evidence</td></tr>
    <tr><td>Soon</td><td>By [specific date]</td><td>Vague timelines breed misunderstanding</td></tr>
    <tr><td>Try to</td><td>Will / Plan to</td><td>Signals commitment, not uncertainty</td></tr>
    <tr><td>Sorry to bother you</td><td>(omit entirely)</td><td>Undermines your position from the start</td></tr>
    <tr><td>Just checking in</td><td>Following up on [specific item]</td><td>Be direct about what you need</td></tr>
    <tr><td>As per my last email</td><td>(refer to specific content)</td><td>Passive-aggressive; avoid</td></tr>
    <tr><td>Utilize</td><td>Use</td><td>"Utilize" rarely adds meaning over "use"</td></tr>
  </tbody>
</table>

<h2>Action Verbs for Accomplishments and Proposals</h2>
<p>When describing what you've done or proposing action, strong action verbs create a more compelling picture:</p>
<ul>
  <li><strong>Spearheaded</strong> — led an initiative as the primary driver ("I spearheaded the migration to the new CRM")</li>
  <li><strong>Orchestrated</strong> — coordinated a complex effort with multiple parts ("orchestrated the cross-functional product launch")</li>
  <li><strong>Leveraged</strong> — used an existing asset effectively ("leveraged our existing vendor relationship to negotiate a 15% reduction")</li>
  <li><strong>Streamlined</strong> — made a process more efficient ("streamlined the approval workflow from 5 steps to 2")</li>
  <li><strong>Synthesized</strong> — combined information from multiple sources meaningfully ("synthesized findings from 3 departments")</li>
  <li><strong>Facilitated</strong> — enabled something to happen ("facilitated the alignment between engineering and marketing")</li>
</ul>

<h2>Hedging Language: When to Use It Carefully</h2>
<p>Hedging language signals appropriate epistemic humility — acknowledging uncertainty without sounding unconfident. Use it when you're reporting preliminary findings or uncertain data:</p>
<ul>
  <li>"Preliminary findings suggest…" (not "The data proves…" when you have limited data)</li>
  <li>"Based on current information, it appears that…"</li>
  <li>"Subject to final confirmation…"</li>
  <li>"The evidence is consistent with…"</li>
</ul>
<p>The key: hedge when you genuinely don't know something, not as a default. Excessive hedging sounds weak; no hedging sounds overconfident.</p>

<h2>Words and Phrases to Avoid</h2>
<ul>
  <li><strong>"To be honest" / "Honestly"</strong>: Implies you aren't always honest. Omit.</li>
  <li><strong>"Basically"</strong>: Often meaningless filler, sometimes condescending.</li>
  <li><strong>"Going forward"</strong>: Usually replaceable with "From now on" or just removed entirely.</li>
  <li><strong>"Touch base"</strong>: Vague business jargon. "Schedule a 30-minute call" is better.</li>
  <li><strong>"Circle back"</strong>: Overused. "Follow up on Thursday" is clearer.</li>
  <li><strong>"Per my previous email"</strong>: Almost always reads as passive-aggressive.</li>
</ul>

<h2>Email Openers and Closers</h2>
<p>Strong openers state purpose immediately: "I'm writing to request your approval for…" or "Following our conversation on Tuesday, here are the three options I mentioned."</p>
<p>Avoid: "I hope this email finds you well" — it's filler. Your reader knows you hope this; don't make them read past it to find the point.</p>
<p>Professional closers: "Please let me know if you have questions." "I'll send the revised draft by Thursday." Weak closers: "Feel free to reach out." (Implies you're not sure they should.) "Looking forward to hearing from you" is fine but generic.</p>
<p>Use <a href="/word/">VocabWize</a> to look up precise definitions and usage examples whenever you're unsure which word best fits your context.</p>
`,
  },
  {
    slug: "english-words-from-latin-greek-roots",
    title: "50 Latin and Greek Roots That Unlock Thousands of English Words",
    description:
      "Learning 50 key roots lets you decode thousands of unfamiliar English words instantly. Here are the most powerful roots, each with multiple example words and sentences.",
    publishedAt: "2024-12-08",
    updatedAt: "2025-01-15",
    category: "Etymology",
    readingTime: 7,
    content: `
<h2>Why Learning Roots Is the Most Efficient Vocabulary Strategy</h2>
<p>English has approximately 170,000 words in current use, but most educated adults only need 20,000–30,000 for near-complete comprehension of written English. Learning word by word is inefficient. Learning roots is a force multiplier: <strong>knowing 50 high-frequency roots lets you decode 5,000+ English words</strong> from context.</p>
<p>The reason: about 60% of English vocabulary derives from Latin and Greek, and academic, scientific, and professional English leans heavily on this classical vocabulary. Every word you encounter with a known root becomes a familiar pattern rather than an alien string of letters.</p>

<h2>The Most Powerful Roots: Latin</h2>

<h3>PORT (carry)</h3>
<p>Words: import, export, transport, portable, portfolio, deport, report, support, portage, portly</p>
<p>Example: "The <strong>portable</strong> generator was easy to <strong>transport</strong>, allowing them to <strong>export</strong> it overseas."</p>

<h3>SCRIB / SCRIPT (write)</h3>
<p>Words: describe, prescribe, inscribe, subscribe, transcript, scripture, manuscript, circumscribe, proscribe, postscript</p>
<p>Example: "The doctor <strong>prescribed</strong> medication after reviewing the <strong>transcript</strong> of the patient's medical history."</p>

<h3>DICT (say, speak)</h3>
<p>Words: predict, dictate, verdict, indicate, contradict, edict, diction, dictionary, indict, abdicate</p>
<p>Example: "The jury's <strong>verdict</strong> contradicted the <strong>prediction</strong> of most legal analysts."</p>

<h3>DUC / DUCT (lead)</h3>
<p>Words: produce, reduce, conduct, deduce, introduce, educate, abduct, induct, seduction, aqueduct</p>
<p>Example: "Good teachers <strong>educate</strong> by <strong>inducing</strong> curiosity, not by simply <strong>conducting</strong> lectures."</p>

<h3>MIT / MISS (send)</h3>
<p>Words: submit, emit, transmit, admit, permit, commit, dismiss, mission, missile, remission, intermittent</p>
<p>Example: "The satellite was <strong>commissioned</strong> to <strong>transmit</strong> data after the launch team <strong>admitted</strong> the earlier model had failed."</p>

<h3>VIS / VID (see)</h3>
<p>Words: visible, vision, revise, supervise, evidence, provide, envision, television, video, visage, vista</p>
<p>Example: "The <strong>evidence</strong> was clearly <strong>visible</strong> on the <strong>video</strong> footage reviewed by the supervisor."</p>

<h3>AUD (hear)</h3>
<p>Words: audio, audience, auditorium, auditory, audit, audible, inaudible, audition</p>
<p>Example: "The <strong>auditorium</strong> was packed as the <strong>audience</strong> strained to hear the barely <strong>audible</strong> speaker."</p>

<h3>FORM (shape)</h3>
<p>Words: reform, inform, conform, transform, deform, uniform, formula, formal, platform, format</p>
<p>Example: "The <strong>uniform</strong> design <strong>informed</strong> all subsequent <strong>formats</strong> after the company underwent significant <strong>reform</strong>."</p>

<h2>The Most Powerful Roots: Greek</h2>

<h3>CHRONO (time)</h3>
<p>Words: chronology, chronicle, synchronize, anachronism, chronic, chronometer</p>
<p>Example: "The historian's <strong>chronology</strong> revealed that the event was an <strong>anachronism</strong> — impossible given when the document was written."</p>

<h3>GRAPH / GRAM (write, draw)</h3>
<p>Words: photograph, paragraph, autobiography, geography, grammar, diagram, telegram, biography, calligraphy, cartography</p>
<p>Example: "The <strong>autobiography</strong> included detailed <strong>diagrams</strong> of the inventor's process."</p>

<h3>BIO (life)</h3>
<p>Words: biology, biography, antibiotic, biodiversity, biomass, biopsy, biome, symbiosis, microbiology</p>
<p>Example: "The <strong>biologist</strong> studied <strong>microbiology</strong> to understand how <strong>antibiotics</strong> affect <strong>biodiversity</strong>."</p>

<h3>LOG / LOGY (study of, word)</h3>
<p>Words: biology, psychology, geology, dialogue, monologue, epilogue, apology, logic, catalog</p>
<p>Example: "The <strong>psychologist</strong>'s <strong>monologue</strong> touched on the <strong>logic</strong> underlying human behavior."</p>

<h3>PHON (sound)</h3>
<p>Words: telephone, microphone, symphony, phonics, phonology, euphony, cacophony, saxophone, megaphone</p>
<p>Example: "The <strong>symphony</strong> opened with a brief <strong>cacophony</strong> of sounds before the conductor raised the <strong>microphone</strong>."</p>

<h3>PATH (feeling, suffering)</h3>
<p>Words: sympathy, empathy, apathy, pathology, antipathy, telepathy, sociopath, pathos</p>
<p>Example: "The audience felt deep <strong>empathy</strong> — the film captured the character's <strong>pathos</strong> without turning into mere <strong>apathy</strong>."</p>

<h2>How to Use This Knowledge</h2>
<p>When you encounter an unfamiliar word, break it into roots, prefixes, and suffixes. "Circumscribe" = <em>circum</em> (around) + <em>scrib</em> (write) → "to draw a line around; to limit." "Antipathy" = <em>anti</em> (against) + <em>path</em> (feeling) → "strong feeling against."</p>
<p>Use <a href="/word/">VocabWize</a> to look up the etymology of any word you're studying — you'll often find the roots that unlock dozens of related words.</p>
`,
  },
];

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  return [...new Set(posts.map((p) => p.category))];
}
