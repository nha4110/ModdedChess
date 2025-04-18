import { generateNFT } from '@/lib/generator';
import fs from 'fs';
import path from 'path';
import { uploadAllNFTs } from '@/lib/upload';
import { NeonClient } from '@/lib/neon';

const args = process.argv.slice(2);
const metadataDir = path.join(process.cwd(), 'public', 'metadata');
if (!fs.existsSync(metadataDir)) fs.mkdirSync(metadataDir, { recursive: true });

async function main() {
  const command = args[0];
  const client = new NeonClient();

  if (command === 'start') {
    for (let i = 0; i < 10; i++) {
      const nft = generateNFT();
      const fileName = `${nft.name.replace(/\s+/g, '_')}_${i}.json`;
      fs.writeFileSync(path.join(metadataDir, fileName), JSON.stringify(nft, null, 2));
      console.log(`🎲 Generated: ${fileName}`);
    }
  } else if (command === 'upload') {
    await uploadAllNFTs(client);
  } else {
    console.log('❌ Unknown command. Use "start" or "upload"');
  }
}

main();