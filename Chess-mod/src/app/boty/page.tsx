'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// Define a type for the Stockfish worker
interface StockfishWorker extends Worker {
  postMessage: (message: string) => void;
  onmessage: ((event: MessageEvent<string>) => void) | null;
  terminate: () => void;
}

export default function ChessBot() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [stockfish, setStockfish] = useState<StockfishWorker | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Stockfish
  useEffect(() => {
    let sf: StockfishWorker | null = null;
    let isMounted = true;

    function initStockfish() {
      try {
        // Load Stockfish as a Web Worker from public/stockfish
        const stockfishWorker = new Worker('/stockfish/stockfish-nnue-16-single.js') as StockfishWorker;
        if (isMounted) {
          sf = stockfishWorker;
          setStockfish(stockfishWorker);
          stockfishWorker.onmessage = (event: MessageEvent<string>) => {
            console.log('Stockfish message:', event.data); // Log all messages
            const message = event.data;
            if (message.startsWith('bestmove')) {
              const bestMove = message.split(' ')[1];
              if (bestMove && !game.isGameOver()) {
                makeMove(bestMove);
                setIsBotThinking(false);
              }
            } else if (message === 'readyok') {
              console.log('Stockfish is ready');
            }
          };
          // Initialize Stockfish with UCI commands
          stockfishWorker.postMessage('uci');
          stockfishWorker.postMessage('isready');
        }
      } catch (err) {
        console.error('Failed to initialize Stockfish:', err);
        if (isMounted) {
          setError('Failed to initialize Stockfish engine');
        }
      }

      return () => {
        if (sf) {
          sf.terminate();
        }
      };
    }

    initStockfish();

    return () => {
      isMounted = false;
      if (sf) {
        sf.terminate();
      }
    };
  }, []);

  // Handle player move
  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      if (isBotThinking || game.isGameOver()) return false;

      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // Auto-promote to queen
        });

        if (move === null) return false;

        setFen(game.fen());
        setGame(new Chess(game.fen()));

        // Trigger bot move
        if (!game.isGameOver() && stockfish) {
          setIsBotThinking(true);
          console.log('Sending position:', game.fen()); // Debug log
          stockfish.postMessage('position fen ' + game.fen());
          stockfish.postMessage('go depth 5'); // Lower depth for faster response
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    [game, stockfish, isBotThinking]
  );

  // Make bot move
  const makeMove = (move: string) => {
    try {
      console.log('Bot move:', move); // Debug log
      game.move({
        from: move.substring(0, 2),
        to: move.substring(2, 4),
        promotion: move.length > 4 ? move[4] : 'q',
      });
      setFen(game.fen());
      setGame(new Chess(game.fen()));
    } catch (error) {
      console.error('Error making bot move:', error);
    }
  };

  // Reset game
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setIsBotThinking(false);
    if (stockfish) {
      stockfish.postMessage('uci');
      stockfish.postMessage('isready');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          Play Chess Against Bot
        </h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Play Chess Against Bot
      </h1>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardWidth={500}
        arePiecesDraggable={!isBotThinking}
        className="shadow-lg"
        {...({} as any)} // Suppress TypeScript error for className
      />
      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          onClick={resetGame}
          disabled={isBotThinking}
          className={`px-6 py-2 text-lg font-medium text-white rounded-md transition-colors duration-200 ${
            isBotThinking
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          New Game
        </button>
        <p className="text-lg sm:text-xl text-gray-700">
          {isBotThinking
            ? 'Bot is thinking...'
            : game.isGameOver()
            ? game.isCheckmate()
              ? 'Checkmate!'
              : game.isDraw()
              ? 'Draw!'
              : 'Game Over'
            : 'Your move'}
        </p>
      </div>
    </div>
  );
}