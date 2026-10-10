const { Jimp } = require('jimp');
const fs = require('fs');

async function makeTransparent(input, output, targetR, targetG, targetB) {
  const image = await Jimp.read(input);
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    const dist = Math.sqrt((r-targetR)**2 + (g-targetG)**2 + (b-targetB)**2);
    
    if (dist < 10) {
      this.bitmap.data[idx + 3] = 0;
    } else if (dist < 100) {
      const alpha = Math.floor(((dist - 10) / 90) * 255);
      this.bitmap.data[idx + 3] = alpha;
      
      let a = alpha / 255;
      this.bitmap.data[idx + 0] = Math.min(255, Math.max(0, (r - targetR * (1 - a)) / a));
      this.bitmap.data[idx + 1] = Math.min(255, Math.max(0, (g - targetG * (1 - a)) / a));
      this.bitmap.data[idx + 2] = Math.min(255, Math.max(0, (b - targetB * (1 - a)) / a));
    }
  });

  // crop the image to remove empty space
  image.autocrop();

  await image.write(output);
  console.log('Processed', output);
}

async function run() {
  await makeTransparent('C:/Users/Xreva/.gemini/antigravity/brain/735f63c2-f251-4b66-ac4a-9c98995d98bc/.user_uploaded/media_1791635170653.png', 'logo-dark.png', 16, 21, 14);
}

run();
