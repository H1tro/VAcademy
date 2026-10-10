const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, filename);
let identity = 'owner', verifiedId = 'owner', verificationError = null, deletionError = null, cleanupThrows = false;
let verifications = 0, cleanups = 0;
const deleted = [];
const original = Module._load;
Module._load = function(name, ...args) {
  if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
  if (name === '@/lib/server-auth') return { requestUser: async () => identity };
  if (name === '@/utils/supabase/config') return { getSupabaseConfig: () => ({ url: 'https://test.supabase.co', key: 'test' }) };
  if (name === '@/utils/supabase/admin') return { createAdminClient: () => ({ auth: { admin: {
    getUserById: async id => { assert.equal(id, 'owner'); return { data: { user: { email: 'owner@example.org' } }, error: null }; },
    deleteUser: async (id, soft) => { assert.equal(soft, false); deleted.push(id); return { error: deletionError }; },
  } } }) };
  if (name === '@supabase/supabase-js') return { createClient: () => ({ auth: {
    signInWithPassword: async ({ email }) => { assert.equal(email, 'owner@example.org'); verifications++; return { data: { user: verificationError ? null : { id: verifiedId }, session: verificationError ? null : {} }, error: verificationError }; },
    signOut: async ({ scope }) => { assert.equal(scope, 'local'); cleanups++; if (cleanupThrows) throw new Error(); return { error: null }; },
  } }) };
  return original.call(this, name, ...args);
};
const { POST } = require('../src/app/api/account/delete-with-password/route.ts');
const request = (password = 'current-password') => new Request('https://example.org/api/account/delete-with-password', { method: 'POST', body: JSON.stringify({ password, uid: 'victim', email: 'victim@example.org' }) });
(async () => {
  identity = null;
  assert.equal((await POST(request())).status, 401); assert.equal(verifications, 0);
  identity = 'owner';
  assert.equal((await POST(request(''))).status, 400); assert.equal(deleted.length, 0);
  verificationError = { status: 400 };
  let res = await POST(request()); assert.equal(res.status, 403); assert.equal((await res.json()).code, 'invalid_password');
  verificationError = { status: 429 };
  res = await POST(request()); assert.equal(res.status, 429); assert.equal((await res.json()).code, 'rate_limited');
  verificationError = null; verifiedId = 'victim';
  assert.equal((await POST(request())).status, 403); assert.equal(deleted.length, 0); assert.equal(cleanups, 1);
  verifiedId = 'owner'; cleanupThrows = true;
  res = await POST(request()); assert.equal(res.status, 200); assert.deepEqual(deleted, ['owner']); assert.equal(cleanups, 2);
  cleanupThrows = false; deletionError = { status: 500, code: 'test_error' };
  const previous = console.error; console.error = () => {};
  try { assert.equal((await POST(request())).status, 500); assert.equal(cleanups, 3); } finally { console.error = previous; }
  console.log('Password deletion checks passed: authentication, password required, incorrect password, rate limit, account mismatch, forged target ignored, temporary-session cleanup and deletion failure. No real accounts deleted.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = original; });
