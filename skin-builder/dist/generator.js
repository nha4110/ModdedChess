"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomizer_1 = require("./utils/randomizer");
const fileService_1 = require("./services/fileService");
// Function to generate NFT based on type
function generateNFT(type) {
    // Get random attributes for the NFT
    const attributes = (0, randomizer_1.generateAttributes)(type);
    // Construct the NFT object
    const nft = {
        name: `${attributes.style} ${type} NFT`, // More dynamic name
        description: `A unique ${type} NFT with a style of ${attributes.style} and random effects.`, // More dynamic description
        type,
        attributes: [
            { trait_type: "Color", value: attributes.color },
            { trait_type: "Effect", value: attributes.effect },
            { trait_type: "Style", value: attributes.style }
        ]
    };
    // Generate a random filename for the NFT JSON
    const filename = `${type}-${Math.random().toString(36).substring(2, 15)}.json`;
    // Save the NFT JSON to a file
    (0, fileService_1.saveNFTToFile)(filename, nft);
}
// Function to generate multiple NFTs
function generateMultipleNFTs(numberOfNFTs = 100) {
    const types = ["Board", "PieceSet1", "PieceSet2"];
    // Loop through and generate the NFTs
    for (let i = 0; i < numberOfNFTs; i++) {
        // Randomly select an NFT type
        const randomType = types[Math.floor(Math.random() * types.length)];
        generateNFT(randomType);
    }
    console.log(`Generated ${numberOfNFTs} NFTs.`);
}
// Call the function to generate 100 NFTs
generateMultipleNFTs(100);
