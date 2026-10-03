import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export async function integrityCheck() {
  const manifest = JSON.parse(await readFile(new URL('./protected-manifest.json', import.meta.url), 'utf8'));
  for (const [file, expected] of Object.entries(manifest)) {
    const actual = createHash('sha256').update(await readFile(new URL(`./${file}`, import.meta.url))).digest('hex');
    if (actual !== expected) throw new Error(`protected integrity mismatch: ${file}`);
  }
  return true;
}
