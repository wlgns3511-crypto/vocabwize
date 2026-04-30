// HCU 2026-04-24 GSC rescue + reinforcement submit for vocabwize.
//
// Context: 20 URLs earned clicks in 28d GSC window (2026-03-24 ~ 2026-04-21):
//   - 10 /word/ URLs (vixen 2 clicks, others 1 each). 8 of 10 fell outside
//     the existing top-20K-by-frequency prerender cap. Rescued via GSC union.
//   - 10 /compare/ URLs (casing-vs-cassino 2 clicks, others 1 each). None
//     exist in the comparisons table (historical artifacts) but all 20 word
//     halves exist in words table → page renders once added to keep-set.
//
// This deploy: build-keep-sets.ts emits word-keep.json (~20,010) and
// compare-keep.json (~110), middleware 410s everything outside. IndexNow
// submits the 20 GSC URLs to reinforce KEPT signal ahead of organic recrawl.

const HOST = 'vocabwize.com';
const KEY = '12acda610c3c481399e0ead768a8b5d3';

const gscWords = [
  'vixen', 'expanded', 'false', 'hemingwayesque', 'implement',
  'keyes', 'kreel', 'noticing', 'ok', 'xvx',
];

const gscComparePairs: [string, string][] = [
  ['casing', 'cassino'],
  ['carcinogen', 'caruso'],
  ['abyss', 'abyssinia'],
  ['allocated', 'allottee'],
  ['amor', 'amour'],
  ['amputate', 'anathematising'],
  ['androgynous', 'andromeda'],
  ['arabesque', 'arabian'],
  ['balloonist', 'balsamous'],
  ['bani', 'banyan'],
];

const urls: string[] = [];
for (const slug of gscWords) {
  urls.push(`https://${HOST}/word/${slug}/`);
}
for (const [a, b] of gscComparePairs) {
  urls.push(`https://${HOST}/compare/${a}-vs-${b}/`);
  urls.push(`https://${HOST}/compare/${b}-vs-${a}/`);
}

(async () => {
  console.log(`[GSC-RESCUE] submitting ${urls.length} URLs as KEPT...`);
  urls.forEach((u) => console.log(`  ${u}`));
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  });
  console.log(`status ${res.status} ${await res.text()}`);
})();
