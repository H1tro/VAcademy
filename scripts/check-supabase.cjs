const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const { NextRequest } = require('next/server');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
let created = 0, refreshed = 0;
const original = Module._load;
Module._load = function(name, ...args) {
  if (name === '@supabase/ssr') return { createServerClient: (_url, _key, options) => {
    created++;
    return { auth: { getClaims: async () => {
      refreshed++;
      options.cookies.setAll([{ name: 'sb-session', value: 'refreshed', options: { path: '/', httpOnly: true } }], { 'Cache-Control': 'private, no-store', Pragma: 'no-cache' });
      options.cookies.setAll([{ name: 'sb-verifier', value: 'updated', options: { path: '/' } }], {});
      return { data: null, error: null };
    } } };
  } };
  return original.call(this, name, ...args);
};
const { updateSession } = require('../src/utils/supabase/middleware.ts');
(async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const fallback = await updateSession(new NextRequest('https://example.org/dashboard'));
  assert.equal(fallback.status, 200);
  assert.equal(created, 0, 'Unconfigured deployments must keep working');
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-publishable-key';
  const request = new NextRequest('https://example.org/supabase', { headers: { cookie: 'next-intl-locale=en' } });
  const response = await updateSession(request);
  assert.equal(refreshed, 1, 'Refresh must call Auth, not just create a client');
  assert.equal(request.cookies.get('sb-session').value, 'refreshed');
  assert.equal(response.cookies.get('sb-session').value, 'refreshed');
  assert.equal(response.cookies.get('sb-verifier').value, 'updated');
  assert.equal(response.cookies.get('sb-session').httpOnly, true);
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  assert.equal(response.headers.get('Pragma'), 'no-cache');
  assert.match(response.headers.get('x-middleware-request-cookie'), /sb-session=refreshed/);
  assert.equal(request.cookies.get('next-intl-locale').value, 'en');
  assert.equal(response.headers.get('location'), null, 'Firebase users must not be redirected');
  console.log('Supabase checks passed: Auth refresh, request/response cookies, repeated writes, cache headers, locale and missing-env fallback.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = original; });
