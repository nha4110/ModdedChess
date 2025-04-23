import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Import the pg pool for Neon database

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, metadataCid, imageCid, collectionName, transactionSignature } = body;

    if (!name || !metadataCid || !imageCid || !collectionName || !transactionSignature) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Store the NFT metadata in the Neon database (Skins table)
    const type = collectionName.toLowerCase();
    await pool.query(
      'INSERT INTO "Skins" (name, type, metadata_url, image_url, collection_name, transaction_signature) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, type, `https://ipfs.io/ipfs/${metadataCid}`, `https://ipfs.io/ipfs/${imageCid}`, collectionName, transactionSignature]
    );
    console.log('NFT metadata stored in database:', { name, type, metadataCid, imageCid, collectionName, transactionSignature });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error storing NFT metadata:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}