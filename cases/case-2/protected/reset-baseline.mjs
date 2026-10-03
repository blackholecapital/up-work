import { cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, '..');
await cp(join(root, 'baseline-src', 'boundary.mjs'), join(root, 'src', 'boundary.mjs'));
console.log('Baseline restored: intentionally broken boundary module copied into editable src.');
