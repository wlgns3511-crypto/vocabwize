/**
 * Long-form evergreen guides — vocabulary learning methodology.
 * Hub pages that link deep into the word/compare/quiz matrix.
 * Each guide targets a high-intent keyword and answers a complete question.
 */

export interface Guide {
  slug: string;
  title: string;
  description: string;
  intro: string; // HTML
  sections: Array<{ heading: string; html: string }>;
  faqs: Array<{ question: string; answer: string }>;
  category: string;
  updatedAt: string;
}

const u = '2026-04-09';

export const guides: Guide[] = [
  {
    slug: 'how-to-learn-1000-english-words',
    title: 'How to Learn 1000 English Words in 30 Days (Without Burning Out)',
    description: 'A systematic 30-day plan to add 1000 active English words to your vocabulary using spaced repetition, chunking, and context reading. Based on proven memory research.',
    category: 'Study Plans',
    updatedAt: u,
    intro: `<p>Adding 1000 English words to your vocabulary in 30 days sounds impossible — but the math works. You only need to actively learn about 35 new words per day, review previous days' words briefly, and consolidate each week. The hard part is not the quantity; it is avoiding the three mistakes that cause most people to quit by day 7.</p><p>This guide gives you the exact daily schedule, the memory science behind why it works, and what to do when your brain feels saturated. Every technique here is backed by research on spaced repetition, the testing effect, and retrieval practice.</p>`,
    sections: [
      {
        heading: 'The 30-day plan at a glance',
        html: `<ul><li><strong>Days 1-7 (Foundation)</strong> — Learn 35 words per day from a high-frequency list. Focus on recognition, not production.</li><li><strong>Days 8-14 (Expansion)</strong> — 35 new words per day, plus 10-minute review of days 1-7.</li><li><strong>Days 15-21 (Consolidation)</strong> — 30 new words per day. Add sentence-writing practice for the 50 most useful words so far.</li><li><strong>Days 22-30 (Activation)</strong> — 30 new words per day. Start reading short texts that reuse target words. This moves them from passive to active vocabulary.</li></ul><p>Total: roughly 1,000 new words exposed, about 600-750 retained at 30 days, and 400-500 actively usable in conversation within 3 months.</p>`,
      },
      {
        heading: 'The 3 mistakes that kill most attempts',
        html: `<ol><li><strong>Starting too hard.</strong> Beginners pick academic or literary word lists before learning the 2,000 most common words. Without the frequency base, rare words have no mental hooks. Always master the first 2,000 frequency band first — see our <a href="/rankings/">word rankings</a> for the most common English words.</li><li><strong>Cramming without spacing.</strong> Reading a word once does almost nothing. You need to meet it again at increasing intervals: 1 day, 3 days, 7 days, 14 days. This is called spaced repetition, and it is the single most important idea in vocabulary learning.</li><li><strong>Recognition-only practice.</strong> Recognizing a word when you see it is 4x easier than producing it when you need it. If you only ever do flashcard-style recognition, most words will never become usable.</li></ol>`,
      },
      {
        heading: 'A working daily routine (25 minutes)',
        html: `<ul><li><strong>10 minutes</strong> — Learn 35 new words. For each word: read the definition, see one example sentence, and close your eyes and try to recall the meaning before moving on.</li><li><strong>8 minutes</strong> — Review yesterday's 35 words. If you can recall the meaning without looking, mark it "known." If you cannot, put it in the review pile for tomorrow.</li><li><strong>5 minutes</strong> — Review the oldest pile (words from 7-14 days ago). This is what converts short-term memory to long-term.</li><li><strong>2 minutes</strong> — Write two sentences using two new words from today. This is the single most powerful activation technique.</li></ul><p>Use our <a href="/quiz/">vocabulary quiz</a> to test recall instead of just recognition. Quizzing is 3x more effective than re-reading.</p>`,
      },
      {
        heading: 'How to pick the right words',
        html: `<p>Not all words are equally useful. Learning 1000 random words is roughly half as useful as learning the 1000 most frequent ones in your target context.</p><ul><li><strong>General English</strong> — start with the General Service List or our <a href="/rankings/">top-ranked words</a>. The most common 2,000 words cover about 80% of everyday speech.</li><li><strong>Academic English</strong> — after the top 2,000, move to the Academic Word List (570 word families). This covers another 10% of academic writing.</li><li><strong>Domain-specific</strong> — if you need business, medical, or legal vocabulary, use a domain corpus — but only after you have the general 3,000-word base.</li></ul>`,
      },
      {
        heading: 'What to do when you plateau',
        html: `<p>Most learners hit a wall around day 10-14. The brain is saturated and new words feel slippery. Three recovery tactics:</p><ol><li><strong>Drop new-word count to 20/day for 3 days.</strong> Use freed time for review and sentence writing. You will feel the old words "click" into place.</li><li><strong>Switch from flashcards to reading.</strong> Find a text at your level (look for stories marked B1 or B2) and read passively. You will re-meet recent words in context, which solidifies them.</li><li><strong>Sleep.</strong> Memory consolidation happens during sleep. If you short-changed sleep for a few days, even doubling your study time will not help until you catch up.</li></ol>`,
      },
      {
        heading: 'Passive vs active vocabulary',
        html: `<p>You have two vocabularies: passive (words you recognize) and active (words you can produce on demand). The gap is enormous — most fluent non-native speakers have a passive vocabulary 3-4x larger than their active one.</p><p>To convert passive words to active, you must <strong>retrieve them from memory under pressure</strong>. Three ways:</p><ul><li>Write short paragraphs forcing yourself to use 5 target words</li><li>Speak aloud describing what you see around you, using target words</li><li>Take <a href="/quiz/">quick quizzes</a> that require typing the word, not picking it from a list</li></ul>`,
      },
    ],
    faqs: [
      { question: 'Can I really learn 1000 words in 30 days?', answer: 'You can expose yourself to 1000 words and retain 60-75% of them at 30 days. Of those retained, roughly 60% will become actively usable within 3 months if you keep reading and using the language. So "1000 words" is real in terms of input, but "1000 usable words" takes closer to 90 days.' },
      { question: 'What is the best app for spaced repetition?', answer: 'Anki is the most powerful free option, but requires setup. Quizlet is easier but less effective long-term. Our <a href="/quiz/">built-in quiz</a> is the fastest for quick daily sessions without setup.' },
      { question: 'How many words should a beginner know?', answer: 'The 2,000 most frequent words cover about 80% of everyday conversation. After that, each additional 1,000 words adds diminishing comprehension — 3,000 covers 85%, 5,000 covers 90%. The first 2,000 are the highest ROI.' },
      { question: 'Should I learn words in sentences or by themselves?', answer: 'Both, in sequence. Learn the isolated definition first (fast), then immediately see 1-2 example sentences (context). Sentence-only learning is slow, and word-only learning does not stick. The 10-second pattern "meaning + one example" beats both.' },
      { question: 'Why do I forget words I just learned?', answer: 'Forgetting within 24 hours is normal — your brain is deciding what is worth keeping. The fix is spaced review: meet the word again 1, 3, 7, and 14 days later. After four spaced reviews, retention typically jumps to over 80%.' },
      { question: 'Is it better to learn synonyms together or separately?', answer: 'Separately, in different sessions. Learning "big, huge, enormous, massive" at once creates interference — your brain mixes them up. Learn one, use it for a few days, then add the next. Our <a href="/compare/">comparison tool</a> helps you distinguish nuances once you know the core word.' },
    ],
  },
  {
    slug: 'spaced-repetition-method-explained',
    title: 'Spaced Repetition: The Science of Remembering Vocabulary Forever',
    description: 'How spaced repetition works, why it beats cramming 10x for long-term retention, and how to apply it without expensive apps. A practical guide based on memory research.',
    category: 'Memory Science',
    updatedAt: u,
    intro: `<p>Spaced repetition is the single most important discovery in vocabulary learning. Reviewing a word at increasing intervals — 1 day, 3 days, 7 days, 14 days, 30 days — locks it into long-term memory 10x more efficiently than studying the same word multiple times in one sitting. This guide explains exactly how it works and how to apply it without complex software.</p>`,
    sections: [
      {
        heading: 'The forgetting curve',
        html: `<p>In 1885, German psychologist Hermann Ebbinghaus ran one of the most cited experiments in memory science. He memorized nonsense syllables and tested himself at intervals. The result: without review, you forget roughly 50% of new information within 1 hour, and 70% within 24 hours.</p><p>But here is the key finding: each time you successfully recall a memory, the forgetting curve flattens. A word you recall after 1 day lasts longer. A word you recall after 3 days lasts even longer. By the fourth successful recall, many memories become essentially permanent.</p>`,
      },
      {
        heading: 'The optimal schedule',
        html: `<p>For each new word, review at these intervals after first learning:</p><ol><li>Same day, 10 minutes later (while it is still in working memory)</li><li>Next day (this is the critical review — it takes the word out of the "24-hour forget" zone)</li><li>3 days later</li><li>7 days later</li><li>14 days later</li><li>30 days later</li></ol><p>After the 30-day review, most words enter long-term storage and need only occasional refreshing.</p>`,
      },
      {
        heading: 'How to implement it without apps',
        html: `<p>You do not need software. The classic "Leitner box" system works with index cards and 5 piles:</p><ul><li><strong>Pile 1</strong> — new and recently missed cards. Review daily.</li><li><strong>Pile 2</strong> — cards you got right once. Review every 2 days.</li><li><strong>Pile 3</strong> — cards you got right twice. Review every 4 days.</li><li><strong>Pile 4</strong> — cards you got right three times. Review weekly.</li><li><strong>Pile 5</strong> — mastered. Review monthly.</li></ul><p>When you miss a card, it goes back to Pile 1 regardless of where it was. That is the feedback loop that makes the system work.</p>`,
      },
      {
        heading: 'Common mistakes',
        html: `<ul><li><strong>Re-reading instead of recalling.</strong> Looking at the word and its definition is 3x less effective than trying to recall the meaning from memory first. Always attempt recall before revealing the answer.</li><li><strong>Reviewing too often.</strong> If you review every day, you never let the forgetting curve start. That means each review is "easy" and builds weak memory. Spacing is uncomfortable — that is the point.</li><li><strong>Reviewing too late.</strong> Skipping the 1-day review loses most of the benefit. The 1-day mark is the single most important checkpoint.</li></ul>`,
      },
      {
        heading: 'Why cramming fails',
        html: `<p>Cramming 50 words in one 2-hour session produces 10-20% retention at one week. Spacing the same 50 words across 10 short sessions over two weeks produces 70-85% retention. The total study time is similar — only the distribution changes.</p><p>This is because memory consolidation happens between sessions, not during them. Sleep especially is when the brain moves short-term memories into long-term storage. Cramming denies your brain the off-time it needs to do this work.</p>`,
      },
    ],
    faqs: [
      { question: 'How long does each review session need to be?', answer: '5-15 minutes is ideal. Sessions longer than 20 minutes produce diminishing returns because attention drops. Three 10-minute sessions per day beat one 30-minute session.' },
      { question: 'What if I miss a day?', answer: 'Do the missed review the next day, then continue the original schedule. One missed day is not fatal. Missing 3+ days means words in the "1-day" pile will need to restart.' },
      { question: 'Is Anki better than paper flashcards?', answer: 'Anki is more efficient (automatic scheduling, stats) but requires setup. Paper is simpler and tactile. Both work. The best system is the one you actually use daily.' },
      { question: 'Can I do spaced repetition with reading instead of flashcards?', answer: 'Yes — graded readers reuse target words at spaced intervals naturally. Reading is less precise than flashcards but more enjoyable, which matters for sustainability.' },
      { question: 'How many cards per day is realistic?', answer: 'Beginners: 20-30 new cards per day plus 80-120 review cards. Intermediate learners handle 40-50 new per day. Over 50 new per day leads to review burnout within 2 weeks for most people.' },
    ],
  },
  {
    slug: 'active-vs-passive-vocabulary',
    title: 'Active vs Passive Vocabulary: How to Convert Words You Know into Words You Use',
    description: 'The gap between recognizing a word and using it fluently is the main reason learners feel stuck. This guide explains the difference and gives you five proven conversion techniques.',
    category: 'Learning Methods',
    updatedAt: u,
    intro: `<p>Most English learners have 3-4 times more passive vocabulary (words they understand) than active vocabulary (words they can produce fluently). This gap is the main reason people feel "stuck" — they have learned plenty of words but cannot reach them when speaking or writing. Closing this gap is mostly about a single idea: retrieval practice.</p>`,
    sections: [
      {
        heading: 'What passive and active actually mean',
        html: `<ul><li><strong>Passive vocabulary</strong> — words you recognize when you read or hear them. You can understand the sentence, but you would not have chosen that word yourself.</li><li><strong>Active vocabulary</strong> — words you produce from memory when speaking or writing. You do not have to think about them; they come out naturally.</li></ul><p>The typical gap: a fluent non-native speaker might have 12,000 passive words but only 3,000-4,000 active. That is why they can read a newspaper comfortably but still pause when speaking.</p>`,
      },
      {
        heading: 'Why recognition is easier than production',
        html: `<p>Recognition is a multiple-choice test — your brain sees the word and picks from existing connections. Production is a fill-in-the-blank test — your brain has to generate the word from meaning alone, with no cue.</p><p>Neuroscience research shows that production engages roughly 4x more neural pathways than recognition. Every time you successfully produce a word, you strengthen the memory trace much more than just recognizing it.</p>`,
      },
      {
        heading: 'Five conversion techniques',
        html: `<ol><li><strong>Productive flashcards.</strong> Instead of "see word → recall meaning," flip it: "see meaning → produce word." This is harder and 3x more effective.</li><li><strong>Forced output.</strong> Pick 5 words you just learned. Write three sentences using all five. The struggle is the point.</li><li><strong>Shadow speaking.</strong> Listen to a native speaker (podcast, video) and repeat each sentence aloud immediately. This activates the word at spoken-production speed.</li><li><strong>Re-telling.</strong> Read a paragraph, close the text, and re-tell it in your own words. You will reach for target vocabulary because you need it.</li><li><strong>Substitution drill.</strong> Take a simple sentence like "I like it." Replace "like" with 5 synonyms (enjoy, appreciate, adore, fancy, favor). Repeat the exercise daily with different base sentences.</li></ol>`,
      },
      {
        heading: 'How long does conversion take',
        html: `<p>For words you recognize clearly: 5-10 deliberate production attempts will usually move them to active status. For words you "half-know": 15-20 attempts. For words that feel foreign despite recognition: they probably need to go back into the learning pile.</p><p>A practical benchmark: if you do 10 minutes of focused retrieval practice per day, you will typically convert 50-80 words from passive to active per month.</p>`,
      },
    ],
    faqs: [
      { question: 'Why do I forget words I just learned when I try to use them?', answer: 'Because recognition and production use different memory pathways. Being able to understand a word does not mean you can recall it under pressure. Only production practice builds the production pathway.' },
      { question: 'How big should my active vocabulary be?', answer: 'For comfortable conversation: 2,000-3,000 active words. For professional use: 4,000-5,000. Native speakers typically have 15,000-20,000 active words. You do not need to match that to be fluent.' },
      { question: 'Is reading enough to build active vocabulary?', answer: 'Reading builds passive vocabulary efficiently but does not convert it to active. You need production practice — writing, speaking, or retrieval drills — to cross the gap.' },
      { question: 'Should I worry about words I recognize but cannot produce?', answer: 'Only if you need them. Passive vocabulary is valuable by itself — it lets you understand more. Convert only the words you actually want to use in speech or writing.' },
    ],
  },
  {
    slug: 'which-english-words-to-learn-first',
    title: 'Which English Words Should You Learn First? (With Data)',
    description: 'Not all words are equally useful. This data-backed guide tells you exactly which 2,000 words to learn first, in what order, and how to skip the filler.',
    category: 'Word Selection',
    updatedAt: u,
    intro: `<p>The single biggest time-saver in vocabulary learning is choosing the right words. The 2,000 most frequent English words cover about 80% of everyday speech. The next 1,000 adds only another 5%. The word <em>the</em> alone accounts for roughly 7% of all English text. This means the order you learn matters enormously.</p>`,
    sections: [
      {
        heading: 'Frequency beats everything',
        html: `<p>English has roughly 170,000 words in current use, but a native speaker only uses about 20,000 regularly, and only 2,000-3,000 actively in conversation. For a learner, this is great news: you do not need all the words, just the right ones.</p><p>Research on word frequency shows:</p><ul><li>Top 100 words → 50% of all English text</li><li>Top 1,000 words → 75% of spoken English</li><li>Top 2,000 words → 80-85% of spoken English, 80% of most novels</li><li>Top 5,000 words → 90% of spoken English</li><li>Top 10,000 words → 95% of written English</li></ul><p>Browse our <a href="/rankings/">word rankings</a> to see the most frequent words in order.</p>`,
      },
      {
        heading: 'The 5 tiers of priority',
        html: `<ol><li><strong>Tier 1: The top 500 (1-4 weeks)</strong> — function words (the, is, of), basic verbs (go, do, make), common nouns (time, year, person), essential adjectives (good, small, important). Without these, you cannot form a sentence.</li><li><strong>Tier 2: Words 501-2000 (2-4 months)</strong> — the working vocabulary of everyday conversation. After this tier, you can understand 80% of casual speech.</li><li><strong>Tier 3: Words 2001-5000 (6-12 months)</strong> — the difference between "survival English" and "fluent English." Adds nuance, register, and the ability to read mainstream media.</li><li><strong>Tier 4: Academic Word List (570 word families)</strong> — if you study or work in English, this list covers 10% of academic writing not covered by the top 2,000.</li><li><strong>Tier 5: Domain-specific (medical, legal, business)</strong> — learn these only when you need them, after Tier 3.</li></ol>`,
      },
      {
        heading: 'How to find frequency lists',
        html: `<p>Good sources (free):</p><ul><li><strong>General Service List (GSL)</strong> — the original 2,000 most useful words, still a solid starting point</li><li><strong>New General Service List (NGSL)</strong> — updated version based on 273 million words of modern text</li><li><strong>Oxford 3000 / 5000</strong> — Oxford's curated lists, balanced for learners</li><li><strong>Our <a href="/rankings/">word rankings page</a></strong> — free, browsable, organized by part of speech</li></ul>`,
      },
      {
        heading: 'What to skip (for now)',
        html: `<ul><li><strong>Rare academic words</strong> like <em>obfuscate</em>, <em>perspicacious</em>, <em>ameliorate</em> — impressive but <strong>useless until you have the base 3,000</strong></li><li><strong>Archaic or literary words</strong> from Shakespeare or Victorian novels — fun to know but not worth study time</li><li><strong>Slang and idioms</strong> — these should come after Tier 2, and from exposure rather than lists</li><li><strong>Domain jargon</strong> (medical, legal) you do not need for your actual life</li></ul>`,
      },
      {
        heading: 'Verifying a list is worth learning',
        html: `<p>Before committing to a word list, check three things:</p><ol><li><strong>Recency.</strong> Lists from before 2000 may overweight words like <em>telegram</em> and <em>cassette</em>. Look for lists updated after 2010.</li><li><strong>Source corpus.</strong> A list based on news articles skews differently from one based on fiction or conversation. Pick a corpus that matches your goals.</li><li><strong>Coverage claim.</strong> A list claiming "learn these 200 words to speak English" is almost certainly marketing. Real coverage milestones start at 2,000 words.</li></ol>`,
      },
    ],
    faqs: [
      { question: 'How many words do I need for conversational English?', answer: 'Around 2,000-3,000 active words. This covers 80-85% of everyday speech. You will still encounter unknown words, but context usually makes the meaning clear.' },
      { question: 'Should I learn British or American English words first?', answer: 'They differ in only about 100-200 common words. Pick one to match your goals (work, travel, media preference) and learn the other as exceptions later. The frequency lists are 98% identical.' },
      { question: 'Is it worth learning uncommon words for exams like TOEFL or IELTS?', answer: 'Only after the base 3,000 is solid. Exam-specific vocabulary gives you 50-150 bonus words, but cannot substitute for the foundation.' },
      { question: 'How do I know which words I already know?', answer: 'Take a placement quiz based on a frequency list. Our <a href="/quiz/">vocabulary quiz</a> can sample words across tiers to show you your active level.' },
    ],
  },
  {
    slug: 'context-learning-reading-for-vocabulary',
    title: 'Context Learning: Why Reading Beats Word Lists (If You Do It Right)',
    description: 'Reading builds vocabulary naturally — but only if you choose the right level, do not stop every 30 seconds to look up words, and re-read strategically. Here is how.',
    category: 'Learning Methods',
    updatedAt: u,
    intro: `<p>Reading is the most natural way to expand vocabulary, but most learners do it wrong — they pick texts that are too hard, stop every sentence to look up words, and never re-read anything. Done correctly, 30 minutes of reading per day can add more active vocabulary than 2 hours of flashcards. This guide explains why, and gives you a practical reading protocol.</p>`,
    sections: [
      {
        heading: 'Why context beats isolated definitions',
        html: `<p>Dictionary definitions give you a word's meaning. Context gives you its <em>behavior</em> — what it combines with, what register it lives in, what feelings it carries. The word <em>destroy</em> and the word <em>demolish</em> both "mean" to break something, but they are not interchangeable. A dictionary cannot easily explain this. Seeing both words in 10 different texts does.</p><p>Research on incidental learning (picking up words from reading without deliberate study) shows learners retain about 10-15% of unknown words per exposure. That sounds low until you realize that a single book can expose you to 2,000+ word tokens — and the words that matter appear dozens of times.</p>`,
      },
      {
        heading: 'The 98% rule',
        html: `<p>For a text to be useful for incidental vocabulary learning, you should know about 98% of the words on the page — meaning only 1 unknown word per 50. That is not "your reading level" — that is "your comfortable level, minus a notch."</p><ul><li><strong>90% known</strong> — frustrating, you lose comprehension and cannot guess from context</li><li><strong>95% known</strong> — slow going, you need the dictionary</li><li><strong>98% known</strong> — comfortable, you can guess most unknowns from context</li><li><strong>100% known</strong> — no new vocabulary is being learned</li></ul><p>The 98% sweet spot is why graded readers (books written for language learners at specific levels) are so effective.</p>`,
      },
      {
        heading: 'The reading protocol',
        html: `<ol><li><strong>Pick a text at or slightly below your level.</strong> Use CEFR-graded readers, or articles aimed at children or language learners.</li><li><strong>First pass: do not stop.</strong> Read for gist. Tolerate 5-10 unknown words per page. Guess from context.</li><li><strong>Mark the words you meet 2+ times but cannot guess.</strong> These are the highest priority — the text is telling you they matter.</li><li><strong>Look up only the marked words.</strong> Add them to your study pile.</li><li><strong>Re-read the same text the next day.</strong> The words you just learned will now be in context, reinforcing memory.</li></ol>`,
      },
      {
        heading: 'Where to find the right texts',
        html: `<ul><li><strong>Graded readers</strong> — "Penguin Readers," "Cambridge English Readers," "Oxford Bookworms" — each series has 6+ difficulty levels</li><li><strong>News sites for learners</strong> — News in Levels, VOA Learning English, BBC Learning English</li><li><strong>Children's chapter books</strong> — "Magic Tree House," "Boxcar Children" — simple vocabulary, engaging stories</li><li><strong>Audiobooks paired with text</strong> — reading and hearing a word simultaneously activates both memory channels</li></ul>`,
      },
      {
        heading: 'Extensive vs intensive reading',
        html: `<p>Two reading modes, both necessary:</p><ul><li><strong>Extensive reading</strong> — lots of easy text, read fast, do not stop for dictionaries. Builds fluency, reinforces known vocabulary, natural context exposure. Aim for 15-30 pages per session.</li><li><strong>Intensive reading</strong> — short difficult text, looked up carefully, analyzed sentence by sentence. Builds new vocabulary and grammar knowledge. Aim for 1-2 pages per session.</li></ul><p>Most learners over-do intensive and under-do extensive. The ideal ratio is about 5:1 extensive to intensive time.</p>`,
      },
    ],
    faqs: [
      { question: 'How many pages per day should I read?', answer: 'For extensive reading: 15-30 pages of easy text. For intensive: 1-2 pages of slightly harder text. Total time: 20-30 minutes daily produces measurable vocabulary gains within 3 weeks.' },
      { question: 'Should I read on paper or digitally?', answer: 'Digital has instant dictionary lookup, which is convenient but breaks flow. Paper forces you to guess from context more, which is better for extensive reading. Use both.' },
      { question: 'What if I do not know enough words to read anything comfortably?', answer: 'Start with children\'s books or graded readers at level A1-A2. They are written specifically for learners. Once you can read A2 comfortably, move to B1, and so on.' },
      { question: 'Is reading fiction or non-fiction better for vocabulary?', answer: 'Fiction gives you more varied vocabulary (description, emotion, dialogue). Non-fiction gives you more abstract and academic words. Read both, with a slight tilt toward whatever you enjoy — enjoyment determines consistency.' },
      { question: 'How long before I see results?', answer: 'Noticeable recognition improvement in 2-3 weeks of daily reading. Active vocabulary gains take 2-3 months because new words need time to move from passive to active.' },
    ],
  },
];

export function getAllGuides(): Guide[] {
  return guides;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
