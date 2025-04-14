// src/hooks/useStockfish.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export interface StockfishEvaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface StockfishOptions {
  depth?: number;
  movetime?: number;
}

export function useStockfish() {
  const [engineName, setEngineName] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<StockfishEvaluation | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);
  
  const engineRef = useRef<Worker | null>(null);
  const currentFenRef = useRef<string>('');

  // Initialize the engine
  useEffect(() => {
    let mounted = true;

    const initEngine = async () => {
      try {
        // Create a new worker
        const worker = new Worker('/stockfish/stockfish-nnue-16-single.js');
        engineRef.current = worker;

        // Set up message handler
        worker.onmessage = (e) => {
          if (!mounted) return;
          
          const message = e.data;
          console.log('Engine response:', message);
          
          // Process UCI responses
          if (message.includes('id name')) {
            const name = message.split('id name ')[1];
            setEngineName(name);
          } 
          else if (message.includes('readyok')) {
            setIsReady(true);
          } 
          else if (message.includes('bestmove')) {
            setEvaluating(false);
            const bestMoveMatch = message.match(/bestmove\s+(\w+)/);
            if (bestMoveMatch && bestMoveMatch[1]) {
              setBestMove(bestMoveMatch[1]);
            }
          } 
          else if (message.includes('score cp')) {
            // Extract centipawn evaluation
            const cpMatch = message.match(/score cp\s+(-?\d+)/);
            if (cpMatch && cpMatch[1]) {
              setEvaluation({
                type: 'cp',
                value: parseInt(cpMatch[1], 10)
              });
            }
          } 
          else if (message.includes('score mate')) {
            // Extract mate in X evaluation
            const mateMatch = message.match(/score mate\s+(-?\d+)/);
            if (mateMatch && mateMatch[1]) {
              setEvaluation({
                type: 'mate',
                value: parseInt(mateMatch[1], 10)
              });
            }
          }
        };

        // Initialize UCI commands
        worker.postMessage('uci');
        worker.postMessage('setoption name Threads value 1');
        worker.postMessage('setoption name Hash value 16');
        worker.postMessage('isready');
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error);
      }
    };

    initEngine();

    return () => {
      mounted = false;
      if (engineRef.current) {
        engineRef.current.terminate();
        engineRef.current = null;
      }
    };
  }, []);

  // Set FEN position
  const setFEN = useCallback((fen: string) => {
    currentFenRef.current = fen;
    if (engineRef.current) {
      engineRef.current.postMessage('position fen ' + fen);
    }
  }, []);

  // Set skill level (0-20)
  const setSkillLevel = useCallback((level: number) => {
    if (engineRef.current) {
      engineRef.current.postMessage(`setoption name Skill Level value ${level}`);
    }
  }, []);

  // Start evaluation
  const start = useCallback((options: StockfishOptions = {}) => {
    if (!engineRef.current) return;
    
    setBestMove(null);
    setEvaluating(true);
    
    let command = 'go';
    if (options.depth) command += ` depth ${options.depth}`;
    if (options.movetime) command += ` movetime ${options.movetime}`;
    
    engineRef.current.postMessage(command);
  }, []);

  // Stop evaluation
  const stop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.postMessage('stop');
      setEvaluating(false);
    }
  }, []);

  // Clean up
  const destroy = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.terminate();
      engineRef.current = null;
      setIsReady(false);
    }
  }, []);

  return {
    engineName,
    isReady,
    evaluating,
    evaluation,
    bestMove,
    setFEN,
    setSkillLevel,
    start,
    stop,
    destroy
  };
}