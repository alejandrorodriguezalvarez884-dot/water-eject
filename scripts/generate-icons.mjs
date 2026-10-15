// Renders the app icon, Android adaptive layers, splash and favicon into assets/.
// Run with: node scripts/generate-icons.mjs  (needs the `sharp` dev dependency)
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const assets = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const SIZE = 1024;

// Same palette as src/theme.ts.
const WATER = ['#38BDF8', '#2563EB'];
const DUST = ['#FCD34D', '#F97316'];

// Speaker glyph drawn on a 24-unit grid (same shape as SpeakerIcon), centered on (12, 12).
function glyph({ scale, mono = false }) {
  const inner = mono ? '#FFFFFF' : 'url(#water)';
  const outer = mono ? '#FFFFFF' : 'url(#dust)';
  return `
    <g transform="translate(${SIZE / 2} ${SIZE / 2}) scale(${scale}) translate(-11.9 -12)">
      <path d="M4 9.2h2.8L11 5.5v13l-4.2-3.7H4a1 1 0 0 1-1-1V10.2a1 1 0 0 1 1-1Z" fill="#FFFFFF" />
      <path d="M14.8 9a4.2 4.2 0 0 1 0 6" stroke="${inner}" stroke-width="2.1" stroke-linecap="round" fill="none" />
      <path d="M17.8 6.3a8 8 0 0 1 0 11.4" stroke="${outer}" stroke-width="2.1" stroke-linecap="round" fill="none" />
    </g>`;
}

const defs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1B2F6B" />
      <stop offset="1" stop-color="#050A18" />
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#38BDF8" stop-opacity="0.35" />
      <stop offset="1" stop-color="#38BDF8" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${WATER[0]}" />
      <stop offset="1" stop-color="${WATER[1]}" />
    </linearGradient>
    <linearGradient id="dust" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${DUST[0]}" />
      <stop offset="1" stop-color="${DUST[1]}" />
    </linearGradient>
  </defs>`;

const background = `
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)" />
  <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE * 0.42}" fill="url(#glow)" />`;

const svg = (content) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${defs}${content}</svg>`;

// Android keeps the adaptive-icon foreground inside a ~61% circle, so the glyph is smaller there.
const files = {
  'icon.png': svg(background + glyph({ scale: 26 })),
  'android-icon-background.png': svg(background),
  'android-icon-foreground.png': svg(glyph({ scale: 19 })),
  'android-icon-monochrome.png': svg(glyph({ scale: 19, mono: true })),
  'splash-icon.png': svg(glyph({ scale: 38 })),
};

for (const [name, content] of Object.entries(files)) {
  let image = sharp(Buffer.from(content));
  // The App Store rejects icons with an alpha channel.
  if (name === 'icon.png') image = image.removeAlpha();
  await image.png().toFile(join(assets, name));
  console.log(`wrote assets/${name}`);
}

await sharp(Buffer.from(files['icon.png'])).resize(48, 48).png().toFile(join(assets, 'favicon.png'));
console.log('wrote assets/favicon.png');
