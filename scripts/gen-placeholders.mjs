/**
 * Génère les visuels de marque centrés sur le LOSANGE Naviel (fond sombre).
 *  - public/og-default.png         (1200×630, image Open Graph)
 *  - public/apple-touch-icon.png   (180×180, icône iOS)
 *  - src/assets/blog/default-cover.png (1280×800, cover blog par défaut)
 *
 * ⚠️ Ne touche PAS aux covers d'études de cas (src/assets/case-studies/*) :
 * ce sont de vraies captures.
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

// Losange = carré arrondi tourné à 45°, centré en (cx,cy)
function diamond(cx, cy, side, rx) {
  return `<rect x="${cx - side / 2}" y="${cy - side / 2}" width="${side}" height="${side}" rx="${rx}" fill="${ACCENT}" transform="rotate(45 ${cx} ${cy})"/>`;
}

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/><stop offset="100%" stop-color="${SURFACE}"/>
    </linearGradient>
    <radialGradient id="halo" cx="22%" cy="18%" r="75%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.18"/>
      <stop offset="55%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#halo)"/>
  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="rgba(255,255,255,0.09)"/>
  <g transform="translate(96,150)">
    ${diamond(26, 26, 40, 9)}
    <text x="66" y="42" font-family="Arial,sans-serif" font-weight="700" font-size="44" fill="${INK}" letter-spacing="-2">Naviel</text>
  </g>
  <text x="96" y="320" font-family="Arial,sans-serif" font-weight="700" font-size="62" fill="${INK}" letter-spacing="-2">On crée votre site et on vous</text>
  <text x="96" y="392" font-family="Arial,sans-serif" font-weight="700" font-size="62" letter-spacing="-2" xml:space="preserve"><tspan fill="${INK}">amène </tspan><tspan fill="${ACCENT}">les clients.</tspan></text>
  <text x="96" y="470" font-family="Arial,sans-serif" font-weight="500" font-size="28" fill="${MUTED}">Agence d’acquisition · Entreprises de service premium</text>
  <text x="96" y="556" font-family="Arial,sans-serif" font-weight="600" font-size="24" fill="${ACCENT}">naviel.fr</text>
  <text x="270" y="556" font-family="Arial,sans-serif" font-weight="500" font-size="24" fill="${MUTED}">· Paris · Partout en France</text>
</svg>`;

const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${BG}"/>
  <circle cx="90" cy="70" r="120" fill="${ACCENT}" opacity="0.08"/>
  ${diamond(90, 90, 80, 16)}
</svg>`;

const blogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/><stop offset="100%" stop-color="${SURFACE}"/>
    </linearGradient>
    <radialGradient id="halo" cx="28%" cy="22%" r="80%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.16"/>
      <stop offset="55%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="800" fill="url(#bg)"/>
  <rect width="1280" height="800" fill="url(#halo)"/>
  <rect x="0.5" y="0.5" width="1279" height="799" fill="none" stroke="rgba(255,255,255,0.09)"/>
  ${diamond(640, 360, 84, 18)}
  <text x="640" y="470" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="46" fill="${INK}" letter-spacing="-2">Naviel — Blog</text>
  <text x="640" y="512" text-anchor="middle" font-family="Arial,sans-serif" font-weight="500" font-size="20" fill="${MUTED}" letter-spacing="1">ACQUISITION · SITES · SEO</text>
</svg>`;

async function write(path, svg) {
  await mkdir(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(path);
  console.log("✓", path);
}

await write("public/og-default.png", ogSvg);
await write("public/apple-touch-icon.png", appleSvg);
await write("src/assets/blog/default-cover.png", blogSvg);
console.log("Terminé.");
