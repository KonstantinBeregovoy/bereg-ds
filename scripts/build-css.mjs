// Copies the hand-written CSS from src/css to dist/css and checks that it parses.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { transform } from 'lightningcss';

const src = new URL('../src/css/', import.meta.url);
const out = new URL('../dist/css/', import.meta.url);
await mkdir(out, { recursive: true });

for (const name of await readdir(src)) {
  if (!name.endsWith('.css')) continue;
  const code = await readFile(new URL(name, src));
  // Parse only, to fail the build on a syntax error. The output keeps the original, readable CSS.
  const { warnings } = transform({ filename: name, code, errorRecovery: false });
  for (const w of warnings) console.warn(`${name}: ${w.message}`);
  await writeFile(new URL(name, out), code);
  console.log(`dist/css/${name}`);
}
