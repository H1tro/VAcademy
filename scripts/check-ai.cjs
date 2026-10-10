const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, filename);
const original = Module._load;
let selectedLocale;
Module._load = function(name, ...args) {
  if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
  if (name === 'next-intl/server') return { getLocale: async () => 'ru', getTranslations: async options => { selectedLocale = options.locale; return key => key; } };
  if (name === '@/lib/navigation') return { SUBJECTS: [{ key: 'informatics', name: 'Информатика' }] };
  return original.call(this, name, ...args);
};
const { POST, GET } = require('../src/app/api/ai/olympiad/route.ts');
const originalFetch = global.fetch;
const request = body => new Request('https://example.org/api/ai/olympiad', { method: 'POST', body: JSON.stringify(body) });
(async () => {
  const originalLog = console.error, logs = [];
  console.error = (...args) => logs.push(JSON.stringify(args));
  try {
    delete process.env.GROQ_API_KEY;
    assert.equal((await (await GET()).json()).configured, false);
    assert.equal((await POST(request({ question: 'test' }))).status, 503);
    process.env.GROQ_API_KEY = 'private-test-key';
    let calls = 0;
    global.fetch = async () => { calls++; return new Response(); };
    assert.equal((await POST(request({ question: {} }))).status, 400);
    assert.equal((await POST(request({ question: 'x'.repeat(6001) }))).status, 400);
    assert.equal((await POST(request(null))).status, 400); assert.equal(calls, 0);
    for (const [status, code, outgoing] of [[401, 'invalid_key', 503], [403, 'permission_denied', 503], [400, 'configuration_error', 503], [404, 'configuration_error', 503], [429, 'rate_limited', 429], [500, 'provider_unavailable', 502]]) {
      global.fetch = async () => new Response('Private provider body', { status });
      const res = await POST(request({ question: 'private-question', locale: 'en' }));
      assert.equal(res.status, outgoing); assert.equal((await res.json()).code, code); assert.equal(selectedLocale, 'en');
    }
    global.fetch = async () => { const e = new Error(); e.name = 'TimeoutError'; throw e; };
    assert.equal((await POST(request({ question: 'test' }))).status, 504);
    global.fetch = async () => { throw new Error('private-test-key'); };
    assert.equal((await POST(request({ question: 'test' }))).status, 502);
    let expectedModel = 'llama-3.3-70b-versatile';
    process.env.GROQ_MODEL = ' llama-3.3-70b-versatile ';
    global.fetch = async (url, options) => {
      assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
      const payload = JSON.parse(options.body);
      assert.equal(payload.model, expectedModel); assert.match(payload.messages[0].content, /английский/);
      return Response.json({ choices: [{ message: { content: ' Answer ' } }] });
    };
    assert.equal((await (await POST(request({ question: 'test', locale: 'en' }))).json()).answer, 'Answer');
    delete process.env.GROQ_MODEL; expectedModel = 'openai/gpt-oss-20b';
    assert.equal((await (await POST(request({ question: 'test', locale: 'en' }))).json()).answer, 'Answer');
    assert.ok(!logs.join('').match(/private-question|private-test-key|Private provider body/));
  } finally { console.error = originalLog; global.fetch = originalFetch; Module._load = original; }
  console.log('AI checks passed: configuration, invalid input, RU/EN locale, key/permission/model failures, limits, timeout, network failure, safe logging and success. No live AI requests.');
})().catch(error => { console.error(error); process.exitCode = 1; });
