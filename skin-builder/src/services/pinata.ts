// src/services/pinata.ts
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PINATA_JWT = process.env.PINATA_JWT || '';
const PINATA_BASE_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export async function uploadToPinata(data: any): Promise<{ IpfsHash: string } | null> {
    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_API_SECRET!,
        },
      });
  
      return { IpfsHash: res.data.IpfsHash }; // ✅ important
    } catch (err) {
      console.error('Pinata upload failed:', err);
      return null;
    }
  }
