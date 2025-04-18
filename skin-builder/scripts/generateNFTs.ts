import fs from 'fs';
import path from 'path';
import { NFTMetadata } from '../types/NFTMetadata';
import { randomUUID } from 'crypto';

export const generateNFTs = () => {
  const outputDir = path.join(process.cwd(), 'public', 'nfts');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const types = ['Board', 'PieceSet1', 'PieceSet2'];
  const effectsPool = ['glow', 'shadow', 'neon', 'sparkle'];
  
  for (let i = 0; i < 10; i++) {
    const isBoard = Math.random() < 0.3;
    const type = isBoard ? 'Board' : Math.random() < 0.5 ? 'PieceSet1' : 'PieceSet2';

    const effectChance = Math.random();
    let numEffects = 0;
    if (effectChance < 0.05) numEffects = 3;
    else if (effectChance < 0.25) numEffects = 2;
    else if (effectChance < 0.60) numEffects = 1;

    const effects = Array.from({ length: numEffects }, () => 
      effectsPool[Math.floor(Math.random() * effectsPool.length)]
    );

    const metadata: NFTMetadata = {
      id: randomUUID(),
      name: `${type} Skin #${i + 1}`,
      description: `A unique ${type} skin for Modded Chess`,
      type,
      color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`,
      effects,
      created_at: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(outputDir, `${metadata.id}.json`),
      JSON.stringify(metadata, null, 2)
    );
  }

  console.log('✅ NFT JSONs generated in /public/nfts');
};
