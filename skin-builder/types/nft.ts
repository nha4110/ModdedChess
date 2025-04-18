export type NFTType = 'Board' | 'PieceSet1' | 'PieceSet2';

export interface NFTMetadata {
  name: string;
  description: string;
  type: NFTType;
  color: string;
  style: string;
  effects: string[];
  image: string;
  attributes: {
    trait_type: string;
    value: string | string[];
  }[];
}
