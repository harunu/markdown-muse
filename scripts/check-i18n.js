import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tr = JSON.parse(readFileSync(join(__dirname, '../src/i18n/locales/tr.json'), 'utf8'));
const en = JSON.parse(readFileSync(join(__dirname, '../src/i18n/locales/en.json'), 'utf8'));

function getLeafKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? getLeafKeys(v, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  );
}

const trKeys = new Set(getLeafKeys(tr));
const enKeys = new Set(getLeafKeys(en));

const missingInEn = [...trKeys].filter(k => !enKeys.has(k));
const missingInTr = [...enKeys].filter(k => !trKeys.has(k));

if (missingInEn.length || missingInTr.length) {
  if (missingInEn.length) console.error('Missing in en.json:', missingInEn);
  if (missingInTr.length) console.error('Missing in tr.json:', missingInTr);
  process.exit(1);
}
console.log(`i18n complete: ${trKeys.size} keys in both tr.json and en.json`);
