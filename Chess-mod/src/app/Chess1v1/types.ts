export interface NFTJson {
    name: string;
    description: string;
    type: string;
    attributes: Array<{
      trait_type: string;
      value: string | string[];
    }>;
  }
  
  export interface Style {
    name: string;
    pieces: Record<string, string>;
  }