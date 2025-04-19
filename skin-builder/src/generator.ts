import { generateAttributes } from './utils/randomizer';
import { saveNFTToFile } from './services/fileService';

// Define NFT Type for better readability
type NFTType = "Board" | "PieceSet1" | "PieceSet2";

// Function to generate NFT based on type
function generateNFT(type: NFTType) {
    // Get random attributes for the NFT
    const attributes = generateAttributes(type);

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
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    const filename = `${type}-${randomNum}.json`;
    
    // Save the NFT JSON to a file
    saveNFTToFile(filename, nft);
}

// Function to generate multiple NFTs
function generateMultipleNFTs(numberOfNFTs: number = 100) {
    const types: NFTType[] = ["Board", "PieceSet1", "PieceSet2"];

    // Loop through and generate the NFTs
    for (let i = 0; i < numberOfNFTs; i++) {
        // Randomly select an NFT type
        const randomType: NFTType = types[Math.floor(Math.random() * types.length)];
        generateNFT(randomType);
    }

    console.log(`Generated ${numberOfNFTs} NFTs.`);
}

// Call the function to generate 100 NFTs
generateMultipleNFTs(100);
