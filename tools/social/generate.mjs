import fs from 'fs';
import sharp from 'sharp';
import { C, lockup, svgWrap, bg, arc, T, pillars, textW } from './lib.mjs';

import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '../../public/social');
fs.mkdirSync(OUT, { recursive: true });
const W = 1080, H = 1350, M = 96;
const MAXW = W - 2 * M; // largura útil
const URL_TXT = 'integrasolucoesinteligentes.com';
const problems = [];
let current = '';

// texto com verificação de largura (evita corte)
function t(text, o) {
  const w = textW(text, o.w ?? 400, o.size, o.tracking ?? 0);
  const x0 = o.anchor === 'middle' ? o.x - w / 2 : o.anchor === 'end' ? o.x - w : o.x;
  if (x0 < M - 1 || x0 + w > W - M + 1) problems.push(`${current}: "${text}" largura ${Math.round(w)} (x ${Math.round(x0)}..${Math.round(x0 + w)}) fora da margem`);
  return T(text, o);
}
function ls(arr, { x, y, size, w = 300, fill, lh = 1.45 }) {
  return arr.map((l, i) => t(l, { x, y: y + i * size * lh, size, w, fill })).join('');
}
const lk = (size) => lockup({ size, fill: C.white, accent: C.blue, subFill: C.mute });
function footer() {
  const l2 = lk(48);
  return `<g transform="translate(${M} ${H - 150 + l2.H})">${l2.svg}</g>`;
}
async function save(name, inner) {
  await sharp(Buffer.from(svgWrap(W, H, inner))).png().toFile(`${OUT}/${name}.png`);
}

// ---- Layout "pilares/lista" (igual ao template post-2) ----
async function listaPost(name, { label, head, rows }) {
  current = name;
  let inner = bg(W, H) + arc({ cx: W + 260, cy: 140, r: 480, sw: 2, glowOp: 0.4 });
  inner += t(label, { x: M, y: 230, size: 20, w: 400, tracking: 7, fill: C.blue });
  head.forEach((h, i) => { inner += t(h, { x: M, y: 340 + i * 88, size: 76, w: 300 }); });
  rows.forEach((r, i) => {
    const y = 680 + i * 150;
    inner += `<rect x="${M}" y="${y - 70}" width="${W - M * 2}" height="1" fill="#FFFFFF" opacity="0.12"/>`;
    inner += t(r[0], { x: M, y: y + 8, size: 28, w: 400, tracking: 3, fill: C.blue });
    inner += t(r[1], { x: M + 110, y: y + 4, size: 46, w: 600 });
    inner += t(r[2], { x: M + 110, y: y + 48, size: 26, w: 300, fill: C.mute });
  });
  inner += `<rect x="${M}" y="${680 + 3 * 150 - 70}" width="${W - M * 2}" height="1" fill="#FFFFFF" opacity="0.12"/>`;
  inner += footer();
  await save(name, inner);
}

// ---- Layout "gancho" (igual ao template post-3) ----
async function ganchoPost(name, { label, head, support, cta1, cta2 }) {
  current = name;
  let inner = bg(W, H) + arc({ cx: W + 200, cy: 90, r: 480, sw: 2, glowOp: 0.45 });
  inner += t(label, { x: M, y: 220, size: 20, w: 400, tracking: 7, fill: C.blue });
  head.forEach((h, i) => { inner += t(h, { x: M, y: 440 + i * 100, size: 84, w: i === head.length - 1 ? 600 : 300, fill: i === head.length - 1 ? C.blue : C.white }); });
  inner += ls(support, { x: M, y: 770, size: 32, fill: C.mute, lh: 1.45 });
  inner += `<rect x="${M}" y="940" width="84" height="2" fill="${C.blue}"/>`;
  inner += t(cta1, { x: M, y: 1015, size: 34, w: 500 });
  inner += t(cta2, { x: M, y: 1062, size: 26, w: 300, fill: C.blue });
  inner += footer();
  await save(name, inner);
}

// ---- Layout "manifesto" (igual ao template post-1, com apoio) ----
async function manifestoPost(name, { head, support }) {
  current = name;
  let inner = bg(W, H) + arc({ cx: W + 330, cy: 1000, r: 520, sw: 2 });
  head.forEach((h, i) => { inner += t(h, { x: M, y: 400 + i * 112, size: 92, w: i === head.length - 1 ? 600 : 300, fill: i === head.length - 1 ? C.blue : C.white }); });
  inner += ls(support, { x: M, y: 400 + head.length * 112 + 20, size: 32, fill: C.mute, lh: 1.45 });
  inner += `<rect x="${M}" y="960" width="84" height="2" fill="${C.blue}"/>`;
  inner += pillars({ x: M, y: 1025, size: 22, fill: C.mute }).svg;
  inner += footer();
  await save(name, inner);
}


const specFile = process.argv[2];
if (!specFile) { console.error('uso: node generate.mjs posts/AAAA-MM-DD.json'); process.exit(1); }
const specs = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const layouts = { lista: listaPost, gancho: ganchoPost, manifesto: manifestoPost };
for (const s of specs) {
  if (!layouts[s.layout]) throw new Error('layout desconhecido: ' + s.layout);
  await layouts[s.layout](s.file, s);
}
if (problems.length) { console.log('PROBLEMAS:\n' + problems.join('\n')); process.exitCode = 1; } else console.log('artes ok, sem texto fora da margem');
