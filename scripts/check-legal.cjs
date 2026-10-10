const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');

const source = fs.readFileSync('src/lib/legal-config.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { LEGAL_VERSION, isRegistrationAcknowledgement: valid } = context.exports;
const base = { version: LEGAL_VERSION, ageRange: '13-17', guardianPermission: true, termsAccepted: true, privacyRead: true };

assert.equal(valid(base), true, '13–17 with parental permission is eligible');
assert.equal(valid({ ...base, ageRange: '18+', guardianPermission: false }), true, 'adults do not need parental permission');
for (const value of [null, {}, 'accepted', { ...base, ageRange: 'under13' }, { ...base, ageRange: '12' },
  { ...base, ageRange: 'unknown' }, { ...base, guardianPermission: false }, { ...base, guardianPermission: 'true' },
  { ...base, termsAccepted: false }, { ...base, termsAccepted: 'true' }, { ...base, privacyRead: false },
  { ...base, version: 'old' }]) {
  assert.equal(valid(value), false, `must reject invalid acknowledgement: ${JSON.stringify(value)}`);
}
console.log('Legal acknowledgement: age boundaries, parental permission, explicit acceptance and version checks passed.');
