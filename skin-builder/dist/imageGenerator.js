"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const fs = require('fs');
const path = require('path');
const canvas = require('canvas');

// Directory path (relative to dist)
const SKINS_DIR = path.join(__dirname, 'skins'); // skins is in dist, PNGs saved here too

// Function to generate a PNG image for an NFT
function generateNFTImage(nft, filename) {
    const width = 400;
    const height = 400;
    const canvasInstance = canvas.createCanvas(width, height);
    const ctx = canvasInstance.getContext('2d');

    // Extract color attribute
    const colorAttr = nft.attributes.find(attr => attr.trait_type === 'Color').value;

    if (nft.type === 'Board') {
        // For Board: Create 2x2 chessboard pattern
        const colors = Array.isArray(colorAttr) ? colorAttr : [colorAttr, '#FFFFFF']; // Use second color or white
        const squareSize = width / 2; // 200x200 per square

        // Draw 2x2 grid with alternating colors
        // Top-left (0,0) and bottom-right (1,1) use colors[0]
        // Top-right (0,1) and bottom-left (1,0) use colors[1]
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                ctx.fillStyle = (row + col) % 2 === 0 ? colors[0] : colors[1];
                ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
            }
        }
    } else {
        // For PieceSet1/PieceSet2: Solid color background
        ctx.fillStyle = colorAttr;
        ctx.fillRect(0, 0, width, height);
    }

    // Save the image in the same directory as JSON
    const outputPath = path.join(SKINS_DIR, filename.replace('.json', '.png'));
    const out = fs.createWriteStream(outputPath);
    const stream = canvasInstance.createPNGStream();
    stream.pipe(out);
}

// Function to generate images for all NFTs
function generateAllNFTImages() {
    // Read all JSON files from skins directory
    const files = fs.readdirSync(SKINS_DIR).filter(file => file.endsWith('.json'));

    // Generate an image for each NFT
    for (const file of files) {
        const filePath = path.join(SKINS_DIR, file);
        const nftData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        generateNFTImage(nftData, file);
    }

    console.log(`Generated ${files.length} NFT images in ${SKINS_DIR}.`);
}

// Call the function to generate images
generateAllNFTImages();