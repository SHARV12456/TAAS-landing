const sharp = require('sharp');
const pngToIco = require('png-to-ico').default;
const fs = require('fs');

// Clean, simplified SVG - single arch outline, no double stroke
// Looks crisp at 16px all the way to 512px
const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Forest Night background -->
  <rect width="512" height="512" rx="96" fill="#10150E"/>
  <!-- Arch: single filled cream shape with one Forest Night border -->
  <path d="M 136 420 L 136 230 A 120 120 0 0 1 376 230 L 376 420 Z"
        fill="#F3F0E2" stroke="#10150E" stroke-width="12"/>
  <!-- T bar (dark) -->
  <rect x="176" y="210" width="160" height="38" rx="4" fill="#22221F"/>
  <!-- Terracotta stem -->
  <rect x="239" y="248" width="34" height="172" rx="4" fill="#C05E2C"/>
</svg>`;

// 16px – ultra simple, no border
const svgSimple = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="96" fill="#10150E"/>
  <path d="M 136 420 L 136 230 A 120 120 0 0 1 376 230 L 376 420 Z" fill="#F3F0E2"/>
  <rect x="176" y="210" width="160" height="38" rx="4" fill="#22221F"/>
  <rect x="239" y="248" width="34" height="172" rx="4" fill="#C05E2C"/>
</svg>`;

async function generate() {
  const buf16  = await sharp(Buffer.from(svgSimple)).resize(16, 16).png().toBuffer();
  const buf32  = await sharp(Buffer.from(svgSimple)).resize(32, 32).png().toBuffer();
  const buf48  = await sharp(Buffer.from(svgFull)).resize(48, 48).png().toBuffer();
  const buf180 = await sharp(Buffer.from(svgFull)).resize(180, 180).png().toBuffer();
  const buf192 = await sharp(Buffer.from(svgFull)).resize(192, 192).png().toBuffer();
  const buf512 = await sharp(Buffer.from(svgFull)).resize(512, 512).png().toBuffer();

  // favicon.ico bundling 16+32+48
  const ico = await pngToIco([buf16, buf32, buf48]);
  fs.writeFileSync('favicon.ico', ico);

  fs.writeFileSync('apple-touch-icon.png', buf180);
  fs.writeFileSync('icon-192.png', buf192);
  fs.writeFileSync('icon-512.png', buf512);

  // favicon.svg – clean vector, no double line
  fs.writeFileSync('favicon.svg', svgFull);

  console.log('All favicon assets regenerated.');
}

generate().catch(console.error);
