import fs from 'fs';

const report = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));

console.log('=== SKOR KATEGORI LIGHTHOUSE ===');
for (const [key, val] of Object.entries(report.categories)) {
  console.log(`${val.title}: ${Math.round(val.score * 100)}`);
}

console.log('\n=== STATUS AUDIT PWA ===');
const audits = report.audits;
const pwaKeys = [
  'service-worker',
  'installable-manifest',
  'splash-screen',
  'themed-omnibox',
  'viewport',
  'content-width',
  'apple-touch-icon',
  'maskable-icon'
];

pwaKeys.forEach((k) => {
  if (audits[k]) {
    const status = audits[k].score === 1 || audits[k].score === null ? 'PASS' : 'FAIL';
    console.log(`[${status}] ${audits[k].title}`);
    if (audits[k].explanation) {
      console.log(`   Detail: ${audits[k].explanation}`);
    }
  }
});

console.log('\n=== AUDIT YANG MEMERLUKAN PERBAIKAN (Score < 1) ===');
Object.values(audits)
  .filter((a) => typeof a.score === 'number' && a.score < 1)
  .forEach((a) => {
    console.log(`- [${Math.round(a.score * 100)}] ${a.title} (ID: ${a.id})`);
    if (a.displayValue) console.log(`   Value: ${a.displayValue}`);
    if (a.description) console.log(`   Info: ${a.description.slice(0, 100)}...`);
  });

