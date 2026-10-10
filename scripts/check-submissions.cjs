const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
const { problemsData } = require('../src/lib/problems-data.ts');
const { checkAnswer } = require('../src/lib/practice-problems.ts');
let authenticated = true, updates = 0, submissions = [];
const profile = { solvedProblems: [] };
const db = {
  doc: path => ({ path }), collection: () => ({ doc: () => ({ path: 'submissions/new' }) }),
  runTransaction: async callback => callback({
    get: async () => ({ data: () => profile }),
    set: (ref, values) => {
      if (ref.path.startsWith('users/')) { updates++; profile.solvedProblems.push(values.solvedProblems.id); }
      else submissions.push(values);
    },
  }),
};
const originalLoad = Module._load;
Module._load = function(name, ...args) {
  if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
  if (name === '@/lib/firebase-server') return { getDb: () => db };
  if (name === '@/lib/server-auth') return { requestUser: async () => authenticated ? 'signed-in-user' : null };
  if (name === '@/lib/problems-data') return { problemsData, DIFFICULTY_POINTS: { easy: 1, medium: 3, hard: 5 } };
  if (name === '@/lib/practice-problems') return { checkAnswer };
  if (name === 'firebase-admin/firestore') return { FieldValue: { serverTimestamp: () => 'timestamp', increment: n => n, arrayUnion: id => ({ id }) } };
  return originalLoad.call(this, name, ...args);
};
const { POST } = require('../src/app/api/submissions/route.ts');
const send = body => POST(new Request('https://example.org/api/submissions', { method: 'POST', body: JSON.stringify(body) }));
(async () => {
  const problem = problemsData[0];
  const incorrect = await send({ problemId: problem.id, answer: 'wrong', uid: 'someone-else' });
  assert.equal((await incorrect.json()).correct, false);
  assert.equal(updates, 0, 'Wrong answers must not award points');
  const accepted = await send({ problemId: problem.id, answer: problem.correctAnswer, uid: 'someone-else' });
  assert.equal((await accepted.json()).correct, true);
  assert.equal(updates, 1);
  assert.equal(submissions.at(-1).uid, 'signed-in-user', 'Use verified identity, never body uid');
  await send({ problemId: problem.id, answer: problem.correctAnswer });
  assert.equal(updates, 1, 'Repeated correct answer must not award points twice');
  assert.equal((await send({ problemId: 'unknown', answer: '1' })).status, 400);
  assert.equal((await send({ problemId: problem.id, answer: '' })).status, 400);
  authenticated = false;
  assert.equal((await send({ problemId: problem.id, answer: problem.correctAnswer })).status, 401);
  console.log('Submission checks passed: wrong/correct answers, repeated scoring, verified identity, validation and authentication.');
})().catch(error => { console.error(error); process.exitCode = 1; });
