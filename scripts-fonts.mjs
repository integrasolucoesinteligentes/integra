import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
mkdirSync('public/fonts', { recursive: true });
for (const w of ['300','400','600']) {
  const n = `outfit-latin-${w}-normal.woff2`;
  if (!existsSync(`public/fonts/${n}`)) copyFileSync(`node_modules/@fontsource/outfit/files/${n}`, `public/fonts/${n}`);
}
