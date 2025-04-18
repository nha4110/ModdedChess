// services/fileService.ts

import fs from 'fs';
import path from 'path';

export function saveNFTToFile(filename: string, data: object) {
    const filePath = path.join(__dirname, '../skins', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
