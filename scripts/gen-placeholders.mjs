/**
 * Génère des images placeholder de marque (fond sombre + accent acid).
 * À REMPLACER par de vrais visuels / captures avant la mise en ligne.
 *
 * Usage : node scripts/gen-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const BG = "#0a0a0b";
const SURFACE = "#151517";
const ACCENT = "#c8f24e";
const INK = "#f4f3ee";
const MUTED = "#86857e";

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function coverSvg({ w, h, label, sub }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="halo" cx="28%" cy="22%" r="80%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.20"/>
      <stop offset="55%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="${SURFACE}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#halo)"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="rgba(255,255,255,0.09)"/>
  <circle cx="${w * 0.5}" cy="${h * 0.5}" r="6" fill="${ACCENT}"/>
  <text x="50%" y="50%" dy="64" text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="700" font-size="46"
        fill="${INK}" letter-spacing="-1">${esc(label)}</text>
  <text x="50%" y="50%" dy="104" text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="500" font-size="22"
        fill="${MUTED}" letter-spacing="1">${esc(sub)}</text>
</svg>`;
}

async function write(path, svg) {
  await mkdir(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(path);
  console.log("✓", path);
}

const targets = [
  {
    path: "src/assets/case-studies/ppf-strasbourg.png",
    svg: coverSvg({ w: 1280, h: 800, label: "PPF Strasbourg", sub: "PPF · COVERING — À REMPLACER" }),
  },
  {
    path: "src/assets/case-studies/strasclean.png",
    svg: coverSvg({ w: 1280, h: 800, label: "StrasClean", sub: "DETAILING · LAVAGE PREMIUM — À REMPLACER" }),
  },
  {
    path: "src/assets/blog/default-cover.png",
    svg: coverSvg({ w: 1280, h: 800, label: "Naviel — Blog", sub: "ACQUISITION AUTO PREMIUM" }),
  },
  {
    path: "public/og-default.png",
    svg: coverSvg({ w: 1200, h: 630, label: "Naviel", sub: "ON CRÉE VOTRE SITE ET ON VOUS AMÈNE DES CLIENTS" }),
  },
];

for (const t of targets) {
  await write(t.path, t.svg);
}
console.log("Terminé.");
