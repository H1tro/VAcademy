const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, filename);
const records = new Map();
let identity = 'user', sendResult, throws = false, sends = 0;
const db = { doc: path => ({ get: async () => ({ exists: true, data: () => ({ email: 'test@example.org' }) }), set: async data => records.set(path, data), delete: async () => records.delete(path) }) };
const original = Module._load;
Module._load = function(name, ...args) {
  if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
  if (name === '@/lib/server-auth') return { requestUser: async () => identity };
  if (name === '@/utils/supabase/admin') return { createAdminClient: () => ({ auth: { admin: { getUserById: async () => ({ data: { user: { email: 'test@example.org' } }, error: null }) } } }) };
  if (name === '@/lib/database') return { getDb: () => db, FieldValue: { serverTimestamp: () => 'timestamp' } };
  if (name === 'resend') return { Resend: class { emails = { send: async () => { sends++; if (throws) throw new Error('Private provider details'); return sendResult; } }; } };
  return original.call(this, name, ...args);
};
const { POST } = require('../src/app/api/account/request-deletion/route.ts');
const request = () => new Request('https://example.org/api/account/request-deletion', { method: 'POST', body: JSON.stringify({ uid: 'user', email: 'test@example.org' }) });
(async () => {
  const oldLog = console.error;
  const logs = [];
  console.error = (...args) => logs.push(JSON.stringify(args));
  try {
    process.env.RESEND_API_KEY = 'test-key';
    delete process.env.RESEND_FROM_EMAIL;
    let res = await POST(request());
    assert.equal(res.status, 503); assert.equal((await res.json()).code, 'mail_not_configured');
    assert.equal(records.size, 0); assert.equal(sends, 0);
    process.env.RESEND_FROM_EMAIL = 'VAcademy <accounts@example.org>';
    identity = null;
    assert.equal((await POST(request())).status, 401); assert.equal(sends, 0);
    identity = 'user';
    for (const [statusCode, code] of [[403, 'mail_configuration_error'], [429, 'mail_rate_limited'], [500, 'mail_delivery_failed']]) {
      sendResult = { data: null, error: { name: 'validation_error', statusCode, message: 'Private provider details' } };
      res = await POST(request());
      assert.equal((await res.json()).code, code); assert.equal(records.size, 0, 'Failed sending must remove deletion token');
    }
    throws = true;
    res = await POST(request()); assert.equal(res.status, 500); assert.equal(records.size, 0);
    throws = false; sendResult = { data: null, error: null };
    res = await POST(request()); assert.equal(res.status, 502); assert.equal(records.size, 0);
    sendResult = { data: { id: 'message-id' }, error: null };
    res = await POST(request()); assert.equal(res.status, 200); assert.equal(records.size, 1);
    assert.ok(!logs.join('').includes('Private provider details'), 'Logs must not leak provider messages');
    assert.ok(!logs.join('').includes('test@example.org'), 'Logs must not leak recipient emails');
  } finally { console.error = oldLog; Module._load = original; }
  console.log('Deletion email checks passed: configuration, ownership, rejection, rate limit, network failure, token cleanup, success and safe logging. No real emails sent.');
})().catch(error => { console.error(error); process.exitCode = 1; });
