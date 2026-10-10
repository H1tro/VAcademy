const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
const { isApprovedTeacher } = require('../src/lib/teacher-access.ts');
let identity = 'student';
const records = new Map();
const db = {
  doc: path => ({ path, get: async () => snapshot(path), set: async (data, options) => write(path, data, options) }),
  collection: name => ({ where: (_, __, value) => ({ limit: () => ({ get: async () => ({ docs: [...records].filter(([path, data]) => path.startsWith(name + '/') && (name === 'assignments' ? data.teacherId : data.status) === value).map(([path, data]) => ({ id: path.split('/')[1], data: () => data })) }) }) }), add: async data => { records.set(name + '/new', data); return { id: 'new' }; } }),
  runTransaction: async callback => { const writes = []; const result = await callback({ get: async ref => snapshot(ref.path), set: (ref, data, options) => writes.push([ref.path, data, options]) }); for (const args of writes) write(...args); return result; },
};
function snapshot(path) { return { exists: records.has(path), data: () => records.get(path) }; }
function write(path, data, options) { records.set(path, options?.merge ? { ...records.get(path), ...data } : data); }
const original = Module._load;
Module._load = function(name, ...args) {
  if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
  if (name === '@/lib/firebase-server' || name === './firebase-server') return { getDb: () => db };
  if (name === 'firebase-admin/auth') return { getAuth: () => ({ verifyIdToken: async token => { if (token === 'invalid') throw new Error(); return { uid: token }; } }) };
  if (name === '@/lib/server-auth') return require('../src/lib/server-auth.ts');
  if (name === '@/lib/teacher-access') return { isApprovedTeacher };
  if (name === '@/lib/legal-config') return require('../src/lib/legal-config.ts');
  if (name === '@/lib/problems-data') return { problemsData: [{ id: 'task-1' }] };
  if (name === 'firebase-admin/firestore') return { FieldValue: { serverTimestamp: () => 'timestamp' } };
  return original.call(this, name, ...args);
};
const profile = require('../src/app/api/profile/route.ts');
const assignments = require('../src/app/api/assignments/route.ts');
const applications = require('../src/app/api/teacher-applications/route.ts');
const reviews = require('../src/app/api/admin/teachers/route.ts');
const config = require('../src/app/api/admin/config/route.ts');
const request = (method, body, query = '') => new Request('https://example.org/api' + query, { method, headers: identity ? { Authorization: `Bearer ${identity}` } : {}, ...(body ? { body: JSON.stringify(body) } : {}) });
const application = { displayName: 'Teacher Name', school: 'Example School', reason: 'Physics teacher. Work contact: school staff directory.' };
(async () => {
  process.env.ADMIN_UIDS = 'trusted-admin';
  assert.equal((await profile.POST(request('POST', { uid: 'student', displayName: 'Student' }))).status, 200);
  assert.equal(records.get('users/student').role, 'student');
  const { LEGAL_VERSION } = require('../src/lib/legal-config.ts');
  const acknowledgement = { version: LEGAL_VERSION, ageRange: '13-17', guardianPermission: true, termsAccepted: true, privacyRead: true };
  for (const value of [{ ...acknowledgement, ageRange: 'under13' }, { ...acknowledgement, guardianPermission: false }, { ...acknowledgement, termsAccepted: false }]) {
    assert.equal((await profile.POST(request('POST', { uid: 'student', legalAcknowledgement: value }))).status, 400);
  }
  assert.equal((await profile.POST(request('POST', { uid: 'student', legalAcknowledgement: acknowledgement }))).status, 200);
  assert.equal(records.get('users/student').legalAcknowledgement.acceptedAt, 'timestamp');
  await profile.POST(request('POST', { uid: 'student', legalAcknowledgement: { ...acknowledgement, ageRange: '18+' } }));
  assert.equal(records.get('users/student').legalAcknowledgement.ageRange, '13-17', 'Profile edits preserve the first acknowledgement');
  for (const data of [{ role: 'teacher' }, { teacherStatus: 'approved' }, { admin: true }, { reviewedBy: 'trusted-admin' }]) assert.equal((await profile.POST(request('POST', { uid: 'student', ...data }))).status, 403);
  assert.equal((await profile.POST(request('POST', { uid: 'someone-else' }))).status, 401);
  records.set('users/student', { role: 'teacher' });
  assert.equal((await (await profile.GET(request('GET', null, '?uid=student'))).json()).role, 'student');
  assert.equal((await assignments.GET(request('GET'))).status, 403, 'Legacy self-selected teachers must be denied');
  assert.equal((await assignments.POST(request('POST', { title: 'Homework', problemIds: ['task-1'] }))).status, 403);
  assert.equal((await applications.POST(request('POST', { ...application, uid: 'someone-else', status: 'approved' }))).status, 200);
  assert.equal(records.get('teacher_applications/student').status, 'pending');
  assert.equal(records.has('teacher_applications/someone-else'), false);
  await applications.POST(request('POST', { ...application, reason: 'Changed request details' }));
  assert.equal(records.get('teacher_applications/student').reason, application.reason, 'Pending applications must not be overwritten');
  assert.equal((await reviews.GET(request('GET'))).status, 403);
  assert.equal((await reviews.PATCH(request('PATCH', { uid: 'student', decision: 'approved' }))).status, 403);
  for (const method of ['GET', 'POST', 'DELETE']) assert.equal((await config[method](request(method, method === 'GET' ? null : { subject: 'math', chatId: 1 }))).status, 403);
  identity = 'trusted-admin';
  assert.equal((await (await reviews.GET(request('GET'))).json()).length, 1);
  assert.equal((await reviews.PATCH(request('PATCH', { uid: 'student', decision: 'approved' }))).status, 200);
  assert.equal(records.get('users/student').reviewedBy, 'trusted-admin');
  assert.equal((await reviews.PATCH(request('PATCH', { uid: 'student', decision: 'rejected' }))).status, 409);
  identity = 'student';
  assert.equal((await assignments.GET(request('GET'))).status, 200);
  assert.equal((await assignments.POST(request('POST', { title: 'Homework', problemIds: ['task-1'] }))).status, 200);
  await applications.POST(request('POST', application));
  await profile.POST(request('POST', { uid: 'student', school: 'Updated school' }));
  assert.equal(isApprovedTeacher(records.get('users/student')), true, 'Profile edits and repeated applications must preserve approval');
  identity = 'other-student'; await applications.POST(request('POST', application));
  identity = 'trusted-admin'; await reviews.PATCH(request('PATCH', { uid: 'other-student', decision: 'rejected' }));
  identity = 'other-student';
  assert.equal((await assignments.GET(request('GET'))).status, 403);
  await applications.POST(request('POST', application));
  assert.equal(records.get('teacher_applications/other-student').status, 'pending');
  identity = null;
  assert.equal((await applications.GET(request('GET'))).status, 401);
  assert.equal((await applications.POST(request('POST', application))).status, 401);
  identity = 'invalid'; assert.equal((await assignments.GET(request('GET'))).status, 401);
  process.env.ADMIN_UIDS = ''; identity = 'trusted-admin'; assert.equal((await reviews.GET(request('GET'))).status, 403);
  console.log('Teacher access checks passed: role forgery, legacy accounts, authenticated ownership, admin allowlist, approval/rejection, duplicate reviews and reapplication.');
})().catch(error => { console.error(error); process.exitCode = 1; });
