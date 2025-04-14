declare module 'react-stockfish' {
    export interface StockfishEvaluation {
      type: 'cp' | 'mate';
      value: number;
    }
  
    export interface UseStockfishOptions {
      depth?: number;
      enginePath?: string;
    }
  
    export interface UseStockfishReturn {
      engineName: string;
      isReady: boolean;
      evaluating: boolean;
      evaluation: StockfishEvaluation | null;
      bestMove: string | null;
      setFEN: (fen: string) => void;
      setSkillLevel: (level: number) => void;
      setPosition: (moves: string[]) => void;
      start: (options?: { depth?: number; movetime?: number }) => void;
      stop: () => void;
      destroy: () => void;
    }
  
    export function useStockfish(options?: UseStockfishOptions): UseStockfishReturn;
  }