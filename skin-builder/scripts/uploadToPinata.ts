import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { NFTMetadata } from '../types/NFTMetadata';
import { client } from './db';

const pinataJWT = process.env.PINATA_JWT!;

export const uploadNFTs = async () => {
  const nftDir = path.join(process.cwd(), 'public', 'nfts');
  const files = fs.readdirSync(nftDir).filter(file => file.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(nftDir, file);
    const metadata: NFTMetadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: { Authorization: `Bearer ${pinataJWT}` }
    });

    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

    await client.query(
      `INSERT INTO "Skins" (id, name, type, image_url, metadata_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [metadata.id, metadata.name, metadata.type, '', metadataUrl, metadata.created_at]
    );

    console.log(`✅ Uploaded: ${metadata.name}`);
  }

  await client.end();
};
