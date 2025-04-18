export interface NFTMetadata {
    id: string;
    name: string;
    description: string;
    type: 'Board' | 'PieceSet1' | 'PieceSet2';
    color: string;
    effects: string[];
    created_at: string;
  }
  