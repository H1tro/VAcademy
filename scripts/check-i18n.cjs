const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

async function main() {
  const { createTranslator } = await import('use-intl/core');
  const root = path.resolve(__dirname, '..');
  const errors = [];
  const flatten = (value, prefix = '') => Object.assign({}, ...Object.entries(value).map(([key, item]) => typeof item === 'string' ? { [prefix + key]: item } : flatten(item, prefix + key + '.')));
  const messages = Object.fromEntries(['ru', 'en'].map(locale => [locale, JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/messages', locale + '.json'), 'utf8'))]));
  const ru = flatten(messages.ru), en = flatten(messages.en);
  for (const key of new Set([...Object.keys(ru), ...Object.keys(en)])) {
    if (!(key in ru) || !(key in en)) errors.push('Locale key mismatch: ' + key);
  }
  for (const locale of ['ru', 'en']) {
    const t = createTranslator({locale, messages: messages[locale], onError: error => errors.push(locale + ': ' + error.message)});
    for (const [key, message] of Object.entries(flatten(messages[locale]))) {
      const args = Object.fromEntries([...message.matchAll(/\{(\w+)(?:[,}])/g)].map(match => [match[1], /name|title|id/.test(match[1]) ? 'Sample' : 2]));
      t(key, args);
    }
  }
  // Check literal translation calls in each component's lexical scope.
  for (const dir of ['src/app', 'src/components']) {
    for (const relative of fs.readdirSync(path.join(root, dir), {recursive: true}).filter(file => /\.tsx?$/.test(file))) {
      const file = path.join(root, dir, relative), source = fs.readFileSync(file, 'utf8');
      const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      const visit = (node, parentBindings = {}) => {
        let bindings = parentBindings;
        if (ts.isSourceFile(node) || ts.isBlock(node)) {
          bindings = {...parentBindings};
          for (const statement of node.statements) if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) {
            const initializer = declaration.initializer;
            const call = initializer && ts.isAwaitExpression(initializer) ? initializer.expression : initializer;
            if (call && ts.isCallExpression(call) && /^(useTranslations|useUITranslations|getTranslations)$/.test(call.expression.getText(tree))) {
              const namespace = call.arguments[0];
              if (!namespace || ts.isStringLiteral(namespace)) bindings[declaration.name.getText(tree)] = namespace?.text || '';
            }
          }
        }
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text in bindings && ts.isStringLiteral(node.arguments[0])) {
          const namespace = bindings[node.expression.text];
          const key = (namespace ? namespace + '.' : '') + node.arguments[0].text;
          if (!(key in ru)) errors.push(path.relative(root, file) + ': missing ' + key);
        }
        ts.forEachChild(node, child => visit(child, bindings));
      };
      visit(tree);
    }
  }
  if (errors.length) { console.error([...new Set(errors)].join('\n')); process.exitCode = 1; }
  else console.log('RU/EN dictionaries match; all ICU messages and literal translation calls are valid.');
}
main().catch(error => {console.error(error); process.exitCode = 1;});
