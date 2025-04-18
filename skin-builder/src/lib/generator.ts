import { NFTMetadata, NFTType } from '../../types/nft';

const boardStyles = ['Wooden', 'Marble', 'Glass'];
const pieceStyles1 = ['Classic', 'Modern', 'Fantasy'];
const pieceStyles2 = ['SciFi', 'Pixel', 'Minimal'];
const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'];
const effectsPool = ['Glow', 'Shadow', 'Pulse', 'Trail'];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickEffects(): string[] {
  const roll = Math.random();
  if (roll < 0.4) return []; // 40%
  if (roll < 0.75) return [getRandom(effectsPool)]; // 35%
  if (roll < 0.95) return [getRandom(effectsPool), getRandom(effectsPool)]; // 20%
  return [...new Set([getRandom(effectsPool), getRandom(effectsPool), getRandom(effectsPool)])]; // 5%
}

function generateType(): NFTType {
  const roll = Math.random();
  if (roll < 0.3) return 'Board';
  return Math.random() < 0.5 ? 'PieceSet1' : 'PieceSet2';
}

export function generateNFT(): NFTMetadata {
  const type = generateType();
  const style = type === 'Board' ? getRandom(boardStyles)
               : type === 'PieceSet1' ? getRandom(pieceStyles1)
               : getRandom(pieceStyles2);

  const color = getRandom(colors);
  const effects = pickEffects();

  return {
    name: `${style} ${type}`,
    description: `A ${type} skin with ${effects.length ? effects.join(', ') : 'no special effects'}`,
    type,
    color,
    style,
    effects,
    image: '',
    attributes: [
      { trait_type: 'Type', value: type },
      { trait_type: 'Style', value: style },
      { trait_type: 'Color', value: color },
      { trait_type: 'Effects', value: effects }
    ]
  };
}
