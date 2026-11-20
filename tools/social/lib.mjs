import fs from 'fs';
import opentype from 'opentype.js';

import { fileURLToPath } from 'url';
import path from 'path';
const FD = path.join(path.dirname(fileURLToPath(import.meta.url)), 'node_modules/@fontsource/outfit/files/');
function load(w) {
  const b = fs.readFileSync(FD + `outfit-latin-${w}-normal.woff`);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}
export const F = { 200: load(200), 300: load(300), 400: load(400), 500: load(500), 600: load(600), 700: load(700) };

export const C = {
  bg: '#060D1A',
  bg2: '#0B1628',
  bg3: '#101E36',
  blue: '#4DA3FF',
  blueDeep: '#1E7BFF',
  blueInk: '#1565D8', // azul sobre fundo claro
  white: '#F4F7FB',
  mute: '#8FA0B8',
  ink: '#0B1628',
  light: '#F4F7FB',
};

// texto -> path (baseline em y=0). tracking em px.
function cleanPath(p) {
  let px = 0, py = 0;
  for (const c of p.commands) {
    if (c.type === 'Q') {
      if (!Number.isFinite(c.x)) c.x = px;
      if (!Number.isFinite(c.y)) c.y = py;
      if (!Number.isFinite(c.x1)) c.x1 = (px + c.x) / 2;
      if (!Number.isFinite(c.y1)) c.y1 = (py + c.y) / 2;
    } else if (c.type === 'C') {
      for (const k of ['x1', 'y1', 'x2', 'y2']) if (!Number.isFinite(c[k])) c[k] = k.startsWith('x') ? c.x : c.y;
    }
    if (Number.isFinite(c.x)) px = c.x;
    if (Number.isFinite(c.y)) py = c.y;
  }
  return p;
}
const nf = (v) => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? '0' : String(r); };
function pd(path) {
  cleanPath(path);
  return path.commands.map((c) => {
    if (c.type === 'M' || c.type === 'L') return c.type + nf(c.x) + ' ' + nf(c.y);
    if (c.type === 'Q') return 'Q' + nf(c.x1) + ' ' + nf(c.y1) + ' ' + nf(c.x) + ' ' + nf(c.y);
    if (c.type === 'C') return 'C' + nf(c.x1) + ' ' + nf(c.y1) + ' ' + nf(c.x2) + ' ' + nf(c.y2) + ' ' + nf(c.x) + ' ' + nf(c.y);
    return 'Z';
  }).join('');
}
const fixd = (d) => d.replace(/-?\d*\.?\d+e[-+]?\d+/gi, '0');
export function tp(text, w, size, tracking = 0) {
  const font = F[w];
  let x = 0, d = '';
  const chars = [...text];
  chars.forEach((ch, i) => {
    const g = font.charToGlyph(ch);
    const p = g.getPath(x, 0, size);
    d += pd(p);
    x += (g.advanceWidth * size) / font.unitsPerEm + (i < chars.length - 1 ? tracking : 0);
  });
  return { d, width: x };
}
export function textW(text, w, size, tracking = 0) { return tp(text, w, size, tracking).width; }

// texto alinhado: anchor 'start'|'middle'|'end'
export function T(text, { x, y, size, w = 400, tracking = 0, fill = C.white, anchor = 'start', opacity = 1 }) {
  const { d, width } = tp(text, w, size, tracking);
  let dx = x;
  if (anchor === 'middle') dx = x - width / 2;
  if (anchor === 'end') dx = x - width;
  return `<path transform="translate(${dx.toFixed(2)} ${y})" d="${d}" fill="${fill}" opacity="${opacity}"/>`;
}

// parágrafo em linhas (já quebradas): retorna svg e altura
export function lines(arr, { x, y, size, w = 300, fill = C.white, lh = 1.2, tracking = 0, anchor = 'start' }) {
  return arr.map((l, i) => T(l, { x, y: y + i * size * lh, size, w, fill, tracking, anchor })).join('');
}

// ---------- Wordmark ----------
// capHeight do Outfit = 700/1000
const CAP = 0.7;
export function wordmark({ size = 100, fill = C.white, accent = null, tracking = 0.27, weight = 400 }) {
  // size = tamanho da fonte; altura de caixa-alta H
  const H = size * CAP;
  const trk = size * tracking;
  const letters = ['I', 'N', 'T', 'E', 'G', 'R'];
  let x = 0, parts = '';
  const font = F[weight];
  letters.forEach((ch) => {
    const g = font.charToGlyph(ch);
    parts += `<path transform="translate(${x.toFixed(2)} 0)" d="${pd(g.getPath(0, 0, size))}" fill="${fill}"/>`;
    x += (g.advanceWidth * size) / font.unitsPerEm + trk;
  });
  // espessura da haste a partir do I
  const bI = font.charToGlyph('I').getPath(0, 0, size).getBoundingBox();
  const stem = bI.x2 - bI.x1;
  // A custom: chevron sem travessa
  const Wd = H * 0.94;
  const ht = stem * 1.32;
  const a = ht * 0.5;
  const tprime = (Wd / 2 - ht) / (Wd / 2 - a);
  const yi = H * tprime;
  const ax = x;
  const pts = [
    [0, 0], [Wd / 2 - a, -H], [Wd / 2 + a, -H], [Wd, 0], [Wd - ht, 0], [Wd / 2, -yi], [ht, 0],
  ].map(([px, py]) => `${(px + ax).toFixed(2)},${py.toFixed(2)}`).join(' ');
  parts += `<polygon points="${pts}" fill="${accent || fill}"/>`;
  return { svg: parts, width: ax + Wd, H, stem };
}

// lockup: wordmark + subtítulo justificado à largura
export function lockup({ size = 100, fill = C.white, accent = null, subFill = null, tracking = 0.27, sub = 'Soluções Inteligentes' }) {
  const wm = wordmark({ size, fill, accent, tracking });
  const subSize = size * 0.31;
  const gap = size * 0.3;
  const n = [...sub].length;
  const base = textW(sub, 300, subSize, 0);
  const subTrk = (wm.width - base) / (n - 1);
  const subSvg = T(sub, { x: 0, y: gap + subSize * CAP, size: subSize, w: 300, tracking: subTrk, fill: subFill || fill });
  return { svg: wm.svg + subSvg, width: wm.width, height: wm.H + gap + subSize * CAP + subSize * 0.2, H: wm.H };
}

// símbolo: chevron "A"
export function symbol({ size = 100, fill = C.blue }) {
  const H = size, Wd = H * 0.94, stem = H * 0.14, ht = stem * 1.32, a = ht * 0.5;
  const tprime = (Wd / 2 - ht) / (Wd / 2 - a);
  const yi = H * tprime;
  const pts = [[0, H], [Wd / 2 - a, 0], [Wd / 2 + a, 0], [Wd, H], [Wd - ht, H], [Wd / 2, H - yi], [ht, H]]
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  return { svg: `<polygon points="${pts}" fill="${fill}"/>`, width: Wd, height: H };
}

// ---------- Fundos / motivos ----------
export function defs() {
  return `<defs>
  <radialGradient id="glowA" cx="0.18" cy="0.12" r="0.9">
    <stop offset="0" stop-color="#16315C" stop-opacity="0.55"/>
    <stop offset="0.5" stop-color="#0B1B36" stop-opacity="0.25"/>
    <stop offset="1" stop-color="#060D1A" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="arcG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4DA3FF" stop-opacity="0"/>
    <stop offset="0.55" stop-color="#4DA3FF" stop-opacity="0.35"/>
    <stop offset="1" stop-color="#5CB0FF" stop-opacity="1"/>
  </linearGradient>
  <linearGradient id="arcG2" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4DA3FF" stop-opacity="0"/>
    <stop offset="1" stop-color="#4DA3FF" stop-opacity="0.9"/>
  </linearGradient>
  <radialGradient id="orb" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0.82" stop-color="#0B1B36" stop-opacity="0"/>
    <stop offset="0.97" stop-color="#1E5BC0" stop-opacity="0.45"/>
    <stop offset="1" stop-color="#4DA3FF" stop-opacity="0.9"/>
  </radialGradient>
  <filter id="blur30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="blur12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
</defs>`;
}
export function bg(w, h, { glow = true } = {}) {
  return `<rect width="${w}" height="${h}" fill="${C.bg}"/>` + (glow ? `<rect width="${w}" height="${h}" fill="url(#glowA)"/>` : '');
}
// arco/esfera com brilho (círculo parcialmente fora da tela)
export function arc({ cx, cy, r, sw = 2, glowOp = 0.55 }) {
  return `<g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#orb)" opacity="0.55"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#arcG)" stroke-width="${sw * 5}" filter="url(#blur12)" opacity="${glowOp}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#arcG)" stroke-width="${sw}"/>
</g>`;
}
export function svgWrap(w, h, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs()}${inner}</svg>`;
}
export function dotSep(x, y, r = 3, fill = C.blue) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}
// linha de pilares "PROCESSOS • DADOS • IA" centrada ou alinhada
export function pillars({ x, y, size, fill = C.mute, anchor = 'start', tracking = null }) {
  const items = ['PROCESSOS', 'DADOS', 'IA'];
  const trk = tracking ?? size * 0.32;
  const gapPx = size * 1.6;
  const ws = items.map((t) => textW(t, 400, size, trk));
  const total = ws.reduce((a, b) => a + b, 0) + gapPx * 2;
  let sx = anchor === 'start' ? x : anchor === 'middle' ? x - total / 2 : x - total;
  let out = '';
  items.forEach((t, i) => {
    out += T(t, { x: sx, y, size, w: 400, tracking: trk, fill });
    sx += ws[i];
    if (i < items.length - 1) { out += dotSep(sx + gapPx / 2, y - size * 0.35, size * 0.16); sx += gapPx; }
  });
  return { svg: out, width: total };
}
