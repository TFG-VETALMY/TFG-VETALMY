const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dirs = [
  'Vetalmy/frontend/public/imgs/Web/Sobre-nosotros',
  'Vetalmy/frontend/public/imgs/Web/Consejos'
];

async function compressImage(filePath) {
  if (!filePath.match(/\.(jpg|jpeg|png|webp)$/i)) return;
  const stat = fs.statSync(filePath);
  
  // Si pesa menos de 300KB lo ignoramos
  if (stat.size < 300 * 1024) {
    console.log(`Skipping ${path.basename(filePath)} (already small: ${(stat.size/1024).toFixed(0)} KB)`);
    return;
  }
  
  console.log(`Compressing ${path.basename(filePath)} (${(stat.size/1024/1024).toFixed(2)} MB)...`);
  try {
    const tempFile = filePath + '.temp.webp';
    await sharp(filePath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 }) // WebP is smaller than JPEG and native to browsers now
      .toFile(tempFile);
      
    // Replace original image with compressed image (overwrite with .webp contents but keep original extension so we don't have to change HTML everywhere)
    // Actually, keeping the .jpg extension with webp contents is bad practice.
    // Let's just output as standard jpeg to be safe
    const tempFileJpeg = filePath + '.temp2.jpg';
    await sharp(filePath)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(tempFileJpeg);
      
    fs.renameSync(tempFileJpeg, filePath);
    if(fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    
    const newStat = fs.statSync(filePath);
    console.log(`✅ Success: ${path.basename(filePath)} is now ${(newStat.size/1024).toFixed(0)} KB`);
  } catch (error) {
    console.error(`❌ Failed to compress ${path.basename(filePath)}:`, error.message);
  }
}

async function processDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processDir(fullPath);
    } else {
      await compressImage(fullPath);
    }
  }
}

async function run() {
  for (const dir of dirs) {
    await processDir(path.resolve(__dirname, dir));
  }
  console.log('Done!');
}

run();
