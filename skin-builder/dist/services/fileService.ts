import * as fs from 'fs';
import * as path from 'path';

export function saveNFTToFile(filename: string, data: object) {
    const dir = path.join(__dirname, '..', '..', 'skins');  // Create skins folder in the root of the project
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });  // Create the 'skins' directory if it doesn't exist
    }

    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved NFT to ${filePath}`);
}
