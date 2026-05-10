const fs = require('fs');
const code = fs.readFileSync('i18n.js','utf8');
const match = code.match(/const translations = \{([\s\S]*)\};\s*const rtlLanguages/);
if(!match){ console.error('Cannot parse translations'); process.exit(1); }
const objCode = '{' + match[1] + '}';
const translations = require('vm').runInNewContext(objCode, {});
const allKeys = new Set([ ...Object.keys(translations.en), ...Object.keys(translations.ar) ]);
const missing = [];
for (const file of ['HOME.html', 'dashboard.html']) {
  const html = fs.readFileSync(file, 'utf8');
  const regex = /data-i18n(?:-placeholder)?=\"([^\"]+)\"/g;
  let m;
  while ((m = regex.exec(html))) {
    if (!allKeys.has(m[1])) missing.push({ file, key: m[1] });
  }
}
console.log(JSON.stringify(missing));