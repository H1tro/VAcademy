const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
// Load the project's pure TypeScript data modules without adding a test dependency.
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
};
const { practiceProblems, checkAnswer } = require('../src/lib/practice-problems.ts');
const { problemsData } = require('../src/lib/problems-data.ts');
const { youtubeEmbed } = require('../src/lib/video-resources.ts');
const { olympiadCatalog } = require('../src/lib/olympiad-catalog.ts');
assert.equal(practiceProblems.length, 66);
assert.equal(new Set(problemsData.map(p => p.id)).size, problemsData.length, 'Problem IDs must be unique');
assert.equal(new Set(practiceProblems.map(p => p.subject)).size, 5);
for (const p of problemsData) {
  assert.ok(p.description && p.correctAnswer && p.explanation, `Incomplete task ${p.id}`);
  if (p.type === 'choice') assert.ok(p.options.includes(p.correctAnswer), `Answer missing from choices: ${p.id}`);
}
assert.equal(checkAnswer(' 11,2 ', '11.2'), true);
assert.equal(checkAnswer('25.0', '25'), true);
assert.equal(checkAnswer('', '0'), false);
assert.equal(checkAnswer('Infinity', '1'), false);
assert.equal(checkAnswer('12 kg', '12'), false);
assert.equal(checkAnswer('  Да ', 'да'), true);
assert.equal(checkAnswer('26', '25'), false);
assert.equal(youtubeEmbed('https://youtu.be/oOiyHq9MiAM?x=1'), 'https://www.youtube-nocookie.com/embed/oOiyHq9MiAM');
assert.equal(youtubeEmbed('https://www.youtube.com/watch?v=oOiyHq9MiAM'), 'https://www.youtube-nocookie.com/embed/oOiyHq9MiAM');
assert.equal(youtubeEmbed('https://www.youtube.com/results?search_query=physics'), null);
assert.equal(youtubeEmbed('https://example.org/watch?v=oOiyHq9MiAM'), null);
assert.equal(olympiadCatalog.filter(o => o.region === 'kg').length, 2);
assert.equal(olympiadCatalog.filter(o => o.participation === 'team').length, 5);
for (const o of olympiadCatalog) assert.equal(new URL(o.url).protocol, 'https:');
console.log(`Learning checks passed: ${problemsData.length} tasks, 66 new exercises, 7 olympiads.`);
