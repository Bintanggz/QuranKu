import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ICONS_DIR = path.resolve(PUBLIC_DIR, 'icons');

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 1. Buat Favicon & Master SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#003527" />
      <stop offset="50%" stop-color="#064E3B" />
      <stop offset="100%" stop-color="#002117" />
    </linearGradient>
    <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE088" />
      <stop offset="50%" stop-color="#FED65B" />
      <stop offset="100%" stop-color="#D4AF37" />
    </linearGradient>
  </defs>
  
  <!-- Background Rounded Rect -->
  <rect width="512" height="512" rx="112" fill="url(#gradEmerald)" />
  
  <!-- Outer Gold Rim -->
  <rect x="20" y="20" width="472" height="472" rx="96" fill="none" stroke="url(#gradGold)" stroke-width="6" opacity="0.8" />
  
  <!-- Decorative 8-Pointed Islamic Star -->
  <g transform="translate(256, 256) scale(1.15)">
    <rect x="-100" y="-100" width="200" height="200" fill="none" stroke="url(#gradGold)" stroke-width="4" opacity="0.3" rx="16" />
    <rect x="-100" y="-100" width="200" height="200" fill="none" stroke="url(#gradGold)" stroke-width="4" opacity="0.3" rx="16" transform="rotate(45)" />
    
    <!-- Central Sacred Quran Symbol -->
    <path d="M-80 -40 C-40 -60, -10 -40, 0 -20 C10 -40, 40 -60, 80 -40 L70 50 C35 35, 10 50, 0 65 C-10 50, -35 35, -70 50 Z" fill="url(#gradGold)" />
    
    <!-- Inner Book Details -->
    <path d="M0 -15 L0 60" stroke="#003527" stroke-width="4" stroke-linecap="round" />
    <path d="M-60 -10 C-35 -25, -15 -10, -5 0" fill="none" stroke="#003527" stroke-width="3" stroke-linecap="round" opacity="0.7" />
    <path d="M60 -10 C35 -25, 15 -10, 5 0" fill="none" stroke="#003527" stroke-width="3" stroke-linecap="round" opacity="0.7" />
    <path d="M-55 15 C-35 5, -15 15, -5 25" fill="none" stroke="#003527" stroke-width="3" stroke-linecap="round" opacity="0.7" />
    <path d="M55 15 C35 5, 15 15, 5 25" fill="none" stroke="#003527" stroke-width="3" stroke-linecap="round" opacity="0.7" />
  </g>
  
  <!-- Calligraphy Accent Below -->
  <text x="256" y="420" text-anchor="middle" font-family="'Noto Serif', serif" font-size="34" font-weight="bold" fill="#FFE088" letter-spacing="4">QURANKU</text>
</svg>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), svgContent, 'utf-8');
fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), svgContent, 'utf-8');
console.log('✓ Berhasil membuat public/favicon.svg dan public/icons/icon.svg');

// CRC32 table & function untuk PNG chunk
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

// Fungsi generate PNG murni
function createPng(width, height, isMaskable = false) {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Scanlines RGBA
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowBytes));

  const cx = width / 2;
  const cy = height / 2;
  const maxR = width / 2;
  const safeMargin = isMaskable ? 0.2 * width : 0.08 * width;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + rowBytes);
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base color: Deep Emerald #064E3B -> (6, 78, 59)
      let r = 6;
      let g = 78;
      let b = 59;
      let a = 255;

      // Darker emerald gradient towards edges
      const gradFactor = 1 - Math.min(dist / maxR, 1) * 0.4;
      r = Math.floor(r * gradFactor);
      g = Math.floor(g * gradFactor);
      b = Math.floor(b * gradFactor);

      // Gold outer ring / border #D4AF37 -> (212, 175, 55)
      const ringInner = maxR - safeMargin - 8;
      const ringOuter = maxR - safeMargin;
      if (dist >= ringInner && dist <= ringOuter) {
        r = 212;
        g = 175;
        b = 55;
      }

      // Gold center symbol (Quran silhouette approximation)
      const inBookX = Math.abs(dx) <= (width * 0.22);
      const inBookY = Math.abs(dy) <= (height * 0.18);
      if (inBookX && inBookY && dist < (width * 0.25)) {
        // Gold color #FED65B -> (254, 214, 91)
        r = 254;
        g = 214;
        b = 91;

        // Middle spine divider (emerald)
        if (Math.abs(dx) < 2) {
          r = 6;
          g = 78;
          b = 59;
        }
      }

      // If not maskable, make outside round rect transparent
      if (!isMaskable) {
        const cornerR = width * 0.2;
        const qx = Math.max(Math.abs(dx) - (cx - cornerR), 0);
        const qy = Math.max(Math.abs(dy) - (cy - cornerR), 0);
        const cornerDist = Math.sqrt(qx * qx + qy * qy);
        if (cornerDist > cornerR) {
          a = 0; // transparent
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Generate all PNG files
console.log('Menghasilkan ikon PNG PWA murni (192x192 & 512x512)...');
fs.writeFileSync(path.join(ICONS_DIR, 'icon-192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(ICONS_DIR, 'icon-512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(ICONS_DIR, 'icon-maskable-192.png'), createPng(192, 192, true));
fs.writeFileSync(path.join(ICONS_DIR, 'icon-maskable-512.png'), createPng(512, 512, true));
console.log('✓ Seluruh ikon PNG PWA berhasil dibuat!');

