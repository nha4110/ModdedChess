// src/lib/upload.ts
import { NFTMetadata } from '../../types/nft';
import { uploadToPinata } from '@/services/pinata';
import fs from 'fs';
import path from 'path';
import { NeonClient } from './neon';

const metadataDir = path.join(process.cwd(), 'public', 'metadata');
if (!fs.existsSync(metadataDir)) fs.mkdirSync(metadataDir, { recursive: true });

export async function uploadAllNFTs(client: NeonClient) {
  const files = fs.readdirSync(metadataDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const metadata: NFTMetadata = JSON.parse(
      fs.readFileSync(path.join(metadataDir, file), 'utf-8')
    );

    const res = await uploadToPinata(metadata);
    if (!res) {
      console.error(`❌ Failed to upload ${metadata.name}`);
      continue;
    }

    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;

    await client.insertSkin({
      name: metadata.name,
      type: metadata.type,
      image_url: metadata.image,
      metadata_url: metadataUrl
    });

    console.log(`✅ Uploaded ${metadata.name}`);
  }
}
