"use strict";
// services/fileService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveNFTToFile = saveNFTToFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function saveNFTToFile(filename, data) {
    const filePath = path_1.default.join(__dirname, '../skins', filename);
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
