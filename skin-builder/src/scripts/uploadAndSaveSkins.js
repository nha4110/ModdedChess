// src/scripts/uploadAndSaveSkins.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { Client } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

if (!PINATA_API_KEY || !PINATA_API_SECRET || !DATABASE_URL) {
  console.error('❌ Missing required environment variables.');
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

const uploadToPinata = async (filePath) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const headers = {
      ...form.getHeaders(),
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    };

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, { headers });
    const hash = res?.data?.IpfsHash;

    if (!hash) {
      console.error('❌ Pinata upload failed: No IPFS hash returned.');
      return null;
    }

    const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
    console.log(`📦 Uploaded ${path.basename(filePath)} to Pinata: ${url}`);
    return url;
  } catch (err) {
    console.error('❌ Failed to upload to Pinata:', err.response?.data || err.message);
    return null;
  }
};

const saveSkinToNeon = async (metadata, metadataUrl) => {
  try {
    const name = metadata.name || 'Unknown';
    const type = (metadata.type || 'unknown').toLowerCase(); // 'board', 'pieceset1', 'pieceset2'
    const validTypes = ['board', 'pieceset1', 'pieceset2'];
    const normalizedType = validTypes.includes(type) ? type : 'pieceset1'; // fallback

    const collectionName = 'case1';

    const query = `
      INSERT INTO "Skins" (name, type, metadata_url, collection_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (metadata_url) DO NOTHING
      RETURNING id;
    `;

    const result = await client.query(query, [name, normalizedType, metadataUrl, collectionName]);

    if (result.rows.length > 0) {
      console.log(`✅ Saved ${name} to Neon with ID ${result.rows[0].id}`);
    } else {
      console.warn(`⚠️ ${name} already exists in the database.`);
    }
  } catch (err) {
    console.error(`❌ DB insert failed for ${metadata.name}:`, err.message);
  }
};

const processSkins = async () => {
  const skinsFolder = path.join(__dirname, '..', '..', 'dist', 'Case1');

  if (!fs.existsSync(skinsFolder)) {
    console.error('❌ Skins folder does not exist:', skinsFolder);
    return;
  }

  const files = fs.readdirSync(skinsFolder).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.warn('⚠️ No metadata JSON files found in:', skinsFolder);
    return;
  }

  try {
    await client.connect();
    for (const file of files) {
      const fullPath = path.join(skinsFolder, file);
      const metadata = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

      const metadataUrl = await uploadToPinata(fullPath);
      if (metadataUrl) {
        await saveSkinToNeon(metadata, metadataUrl);
      }
    }
    console.log('🎉 All skins uploaded and saved.');
  } catch (err) {
    console.error('🔥 Processing failed:', err.message);
  } finally {
    await client.end();
  }
};

processSkins();
