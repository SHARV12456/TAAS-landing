const fs = require('fs');
const sharp = require('sharp');
const pngToIco = require('png-to-ico').default;

const svgBase = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <style>
    @media (max-width: 32px) {
      .inner-outline { display: none; }
    }
  </style>
  <rect width="512" height="512" rx="112" fill="#10150E"/>
  <path d="M 126 422 L 126 220 A 130 130 0 0 1 386 220 L 386 422 Z" fill="#F3F0E2"/>
  <path class="inner-outline" d="M 142 422 L 142 220 A 114 114 0 0 1 370 220 L 370 422" fill="none" stroke="#10150E" stroke-width="8"/>
  <rect x="186" y="200" width="140" height="32" fill="#10150E"/>
  <rect x="240" y="232" width="32" height="190" fill="#C05E2C"/>
</svg>`;

const svgSimple = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#10150E"/>
  <path d="M 126 422 L 126 220 A 130 130 0 0 1 386 220 L 386 422 Z" fill="#F3F0E2"/>
  <rect x="186" y="200" width="140" height="32" fill="#10150E"/>
  <rect x="240" y="232" width="32" height="190" fill="#C05E2C"/>
</svg>`;

const svgMaskable = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#10150E"/>
  <g transform="translate(64, 64) scale(0.75)">
    <path d="M 126 422 L 126 220 A 130 130 0 0 1 386 220 L 386 422 Z" fill="#F3F0E2"/>
    <path class="inner-outline" d="M 142 422 L 142 220 A 114 114 0 0 1 370 220 L 370 422" fill="none" stroke="#10150E" stroke-width="8"/>
    <rect x="186" y="200" width="140" height="32" fill="#10150E"/>
    <rect x="240" y="232" width="32" height="190" fill="#C05E2C"/>
  </g>
</svg>`;

fs.writeFileSync('favicon.svg', svgBase);

async function generate() {
  try {
    // 1. apple-touch-icon.png (180x180)
    await sharp(Buffer.from(svgBase)).resize(180, 180).toFile('apple-touch-icon.png');
    
    // 2. icon-192.png and icon-512.png (maskable)
    await sharp(Buffer.from(svgMaskable)).resize(192, 192).toFile('icon-192.png');
    await sharp(Buffer.from(svgMaskable)).resize(512, 512).toFile('icon-512.png');
    
    // 3. favicon.ico (16, 32, 48)
    await sharp(Buffer.from(svgSimple)).resize(16, 16).toFile('fav-16.png');
    await sharp(Buffer.from(svgBase)).resize(32, 32).toFile('fav-32.png');
    await sharp(Buffer.from(svgBase)).resize(48, 48).toFile('fav-48.png');
    
    pngToIco(['fav-16.png', 'fav-32.png', 'fav-48.png']).then(buf => {
      fs.writeFileSync('favicon.ico', buf);
      // cleanup temp pngs
      fs.unlinkSync('fav-16.png');
      fs.unlinkSync('fav-32.png');
      fs.unlinkSync('fav-48.png');
      console.log('Icons generated successfully.');
    });
  } catch(e) {
    console.error(e);
  }
}

generate();
