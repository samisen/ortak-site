import { pbkdf2Sync } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const FALLBACK = 'asd987';                   // .env yoksa build kirilmasin diye
const SALT = 'arayanindan/gate/v1';          // her projede farkli olmali
const ITERATIONS = 200_000;

function fromDotEnv() {
  const file = join(root, '.env');
  if (!existsSync(file)) return undefined;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = /^\s*(?:export\s+)?SITE_PASSWORD\s*=\s*(.*)$/.exec(line);
    if (m) return m[1].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
}

const password = process.env.SITE_PASSWORD?.trim() || fromDotEnv() || FALLBACK;
const key = pbkdf2Sync(password, SALT, ITERATIONS, 32, 'sha256').toString('hex');

writeFileSync(join(root, 'src/lib/gate-key.ts'),
`// scripts/gate-key.mjs tarafindan uretildi. Elle duzenleme, commit'leme.
export const GATE_KEY = '${key}';
export const GATE_SALT = '${SALT}';
export const GATE_ITERATIONS = ${ITERATIONS};
`);

console.log(`gate-key.ts yazildi (salt: ${SALT}, ${ITERATIONS} tur)`);
