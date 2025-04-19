// download-styles.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const styles = [
  'alpha', 'anarcandy', 'caliente', 'cardinal', 'cburnett', 'celtic', 
  'chess7', 'chessnut', 'companion', 'cooke', 'disguised', 'dubrovny', 
  'fantasy', 'firi', 'fresca', 'gioco', 'governor', 'horsey', 'icpieces', 
  'kiwen-suwi'
];

const pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];

const baseUrl = 'https://raw.githubusercontent.com/ornicar/lila/master/public/piece';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error(`Failed to get ${url}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function run() {
  for (const style of styles) {
    const dir = path.join(__dirname, 'public', 'piece', style);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const piece of pieces) {
      const fileUrl = `${baseUrl}/${style}/${piece}.svg`;
      const filePath = path.join(dir, `${piece}.svg`);
      try {
        await download(fileUrl, filePath);
        console.log(`✅ Downloaded ${style}/${piece}`);
      } catch (err) {
        console.warn(`❌ Failed ${style}/${piece}:`, err.message);
      }
    }
  }
}

run();
