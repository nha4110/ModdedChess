"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const fs = require("fs");
const path = require("path");
const canvas = require("canvas");

// Paths
const SKINS_DIR = path.join(__dirname, "skins");
const ICON_PATH = path.join(__dirname, "knight.png");
const OUTLINE_PATH = path.join(__dirname, "knight_outline.png");

// 🔍 Utility: Check if a color is light (returns true = use black outline)
function isColorLight(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180; // tweak as needed
}

// 🎯 Draw knight piece with outline and dynamic outline color
async function drawKnight(ctx, color, canvasWidth, canvasHeight) {
    const img = await canvas.loadImage(ICON_PATH);
    const outlineImg = await canvas.loadImage(OUTLINE_PATH);

    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height) * 0.8;
    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;
    const x = (canvasWidth - imgWidth) / 2;
    const y = (canvasHeight - imgHeight) / 2;

    // Tint base knight
    const tempCanvas = canvas.createCanvas(imgWidth, imgHeight);
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(img, 0, 0, imgWidth, imgHeight);
    tempCtx.globalCompositeOperation = "source-in";
    tempCtx.fillStyle = color;
    tempCtx.fillRect(0, 0, imgWidth, imgHeight);
    ctx.drawImage(tempCanvas, x, y, imgWidth, imgHeight);

    // Adjust outline color
    const outlineColor = isColorLight(color) ? "#000000" : "#FFFFFF";

    // Apply outline tint
    const outlineCanvas = canvas.createCanvas(imgWidth, imgHeight);
    const outlineCtx = outlineCanvas.getContext("2d");
    outlineCtx.drawImage(outlineImg, 0, 0, imgWidth, imgHeight);
    outlineCtx.globalCompositeOperation = "source-in";
    outlineCtx.fillStyle = outlineColor;
    outlineCtx.fillRect(0, 0, imgWidth, imgHeight);
    ctx.drawImage(outlineCanvas, x, y, imgWidth, imgHeight);
}

// ☁️ Gradient background (light blue in center → dark blue edges)
function drawGradientBackground(ctx, width, height) {
    const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        width / 1.5
    );
    gradient.addColorStop(0, "#A6D8FF"); // light center
    gradient.addColorStop(1, "#2B5D81"); // darker edge
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

// 🧱 Draw 2x2 board with bold outlines
function drawBoard(ctx, width, height, colors) {
    const squareSize = width / 2;
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            const isEven = (row + col) % 2 === 0;
            ctx.fillStyle = isEven ? colors[0] : colors[1];
            const x = col * squareSize;
            const y = row * squareSize;
            ctx.fillRect(x, y, squareSize, squareSize);

            // Square border
            ctx.strokeStyle = "black";
            ctx.lineWidth = 6;
            ctx.strokeRect(x, y, squareSize, squareSize);
        }
    }
}

// 🎨 Generate one NFT image
async function generateNFTImage(nft, filename) {
    const width = 400;
    const height = 400;
    const canvasInstance = canvas.createCanvas(width, height);
    const ctx = canvasInstance.getContext("2d");

    drawGradientBackground(ctx, width, height); // background first

    const colorAttr = nft.attributes.find(attr => attr.trait_type === "Color").value;

    if (nft.type === "Board") {
        const colors = Array.isArray(colorAttr) ? colorAttr : [colorAttr, "#FFFFFF"];
        drawBoard(ctx, width, height, colors);
    } else {
        await drawKnight(ctx, colorAttr, width, height);
    }

    const outputPath = path.join(SKINS_DIR, filename.replace(".json", ".png"));
    const out = fs.createWriteStream(outputPath);
    const stream = canvasInstance.createPNGStream();
    stream.pipe(out);
}

// ♻️ Process all JSON files in the skins folder
async function generateAllNFTImages() {
    const files = fs.readdirSync(SKINS_DIR).filter(file => file.endsWith(".json"));

    for (const file of files) {
        const filePath = path.join(SKINS_DIR, file);
        const nftData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        await generateNFTImage(nftData, file);
    }

    console.log(`✅ Generated ${files.length} NFT images in ${SKINS_DIR}`);
}

// 🚀 Start
generateAllNFTImages();
