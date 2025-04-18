"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const fs = require('fs');
const path = require('path');
const canvas = require('canvas');

// Directory path (relative to dist)
const SKINS_DIR = path.join(__dirname, 'skins'); // skins is in dist, PNGs saved here too
const ICON_PATH = path.join(__dirname, 'knight.png'); // Path to knight icon in dist

// Function to draw a knight by loading an icon and applying a color tint to the inner area
async function drawKnight(ctx, color, canvasWidth, canvasHeight) {
    // Load the knight icon
    const img = await canvas.loadImage(ICON_PATH);

    // Calculate scaling to fit the image within the canvas (maintaining aspect ratio)
    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height) * 0.8; // 80% of canvas size
    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;
    const x = (canvasWidth - imgWidth) / 2; // Center horizontally
    const y = (canvasHeight - imgHeight) / 2; // Center vertically

    // Create a temporary canvas for the inner area
    const tempCanvas = canvas.createCanvas(imgWidth, imgHeight);
    const tempCtx = tempCanvas.getContext('2d');

    // Draw the original image on the temporary canvas
    tempCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

    // Apply the color tint to the inner area (non-transparent pixels)
    tempCtx.globalCompositeOperation = 'source-in'; // Only keep the color in non-transparent areas
    tempCtx.fillStyle = color;
    tempCtx.fillRect(0, 0, imgWidth, imgHeight);

    // Draw the tinted inner area onto the main canvas
    ctx.drawImage(tempCanvas, x, y, imgWidth, imgHeight);

    // Draw the original image on top to preserve the border
    ctx.globalCompositeOperation = 'destination-over'; // Draw behind the tinted area
    ctx.drawImage(img, x, y, imgWidth, imgHeight);
}

// Function to generate a PNG image for an NFT
async function generateNFTImage(nft, filename) {
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
        // For PieceSet1/PieceSet2: Draw knight with transparent background
        await drawKnight(ctx, colorAttr, width, height);
    }

    // Save the image in the same directory as JSON
    const outputPath = path.join(SKINS_DIR, filename.replace('.json', '.png'));
    const out = fs.createWriteStream(outputPath);
    const stream = canvasInstance.createPNGStream();
    stream.pipe(out);
}

// Function to generate images for all NFTs
async function generateAllNFTImages() {
    // Read all JSON files from skins directory
    const files = fs.readdirSync(SKINS_DIR).filter(file => file.endsWith('.json'));

    // Generate an image for each NFT
    for (const file of files) {
        const filePath = path.join(SKINS_DIR, file);
        const nftData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        await generateNFTImage(nftData, file);
    }

    console.log(`Generated ${files.length} NFT images in ${SKINS_DIR}.`);
}

// Call the function to generate images
generateAllNFTImages();