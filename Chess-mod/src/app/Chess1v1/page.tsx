'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ChessPiece {
  type: string;
  color: 'w' | 'b';
}

// Leipzig font import
const leipzigFontStyles = `
  @font-face {
    font-family: 'ChessLeipzig';
    src: url('https://cdn.jsdelivr.net/npm/chess-fonts@1.0.0/leipzig/Leipzig.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
`;

const PIECE_COLORS = {
  white: '#FFFFFF',
  black: '#000000',
} as const;

const LEIPZIG_PIECES: Record<string, string> = {
  wp: '♙',
  bp: '♟',
  wr: '♖',
  br: '♜',
  wn: '♘',
  bn: '♞',
  wb: '♗',
  bb: '♝',
  wq: '♕',
  bq: '♛',
  wk: '♔',
  bk: '♚',
} as const;

export default function GamePage() {
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastMovedSquare, setLastMovedSquare] = useState<Square | null>(null);

  // Load font
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = leipzigFontStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  // Memoize valid moves
  const validMoves = useMemo(
    () =>
      selectedSquare
        ? game.moves({ square: selectedSquare, verbose: true }).map((move: Move) => move.to)
        : [],
    [game, selectedSquare]
  );

  // Handle square clicks
  const handleClick = useCallback(
    (square: Square) => {
      const piece = game.get(square);
      setError(null);
  
      // Select piece
      if (piece && piece.color === (isWhiteTurn ? 'w' : 'b')) {
        setSelectedSquare(square);
        return;
      }
  
      // Move piece
      if (selectedSquare && validMoves.includes(square)) {
        const move: { from: string; to: string; promotion?: string } = {
          from: selectedSquare,
          to: square,
        };
        if (game.get(selectedSquare)?.type === 'p' && (square[1] === '8' || square[1] === '1')) {
          move.promotion = 'q';
        }
  
        try {
          const result = game.move(move);
          if (result) {
            setGame(new Chess(game.fen()));
            setSelectedSquare(null);
            setIsWhiteTurn((prev) => !prev);
            setLastMovedSquare(square);
            if (game.isGameOver()) {
              setError(
                game.isCheckmate()
                  ? `Checkmate! ${isWhiteTurn ? 'Black' : 'White'} wins!`
                  : game.isStalemate()
                  ? "Stalemate! It's a draw."
                  : "Draw!"
              );
            }
          }
        } catch {
          setError('Invalid move');
          setSelectedSquare(null);
        }
      } else {
        setSelectedSquare(null);
      }
    },
    [game, isWhiteTurn, selectedSquare, validMoves]
  );

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 text-white"
      style={{
        backgroundImage: "url('/marble-chess-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mb-6 flex w-full max-w-3xl justify-between">
        <Link href="/GameCollection">
          <motion.button
            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white shadow hover:bg-red-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>
        </Link>
        <motion.h2
          className="text-3xl font-bold"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          1v1 Offline
        </motion.h2>
        <div className="w-24" />
      </div>

      <motion.div
        className="grid grid-cols-8 overflow-hidden rounded-xl border-4 border-white shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {game.board().map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const squareName = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}` as Square;
            const isWhiteTile = (rowIndex + colIndex) % 2 === 0;
            const piece = square ? `${square.color}${square.type}` : null;
            const isValidMove = validMoves.includes(squareName);
            const isSelected = selectedSquare === squareName;
            const isLastMoved = lastMovedSquare === squareName;

            return (
              <SquareComponent
                key={squareName}
                squareName={squareName}
                isWhiteTile={isWhiteTile}
                piece={piece}
                isValidMove={isValidMove}
                isSelected={isSelected}
                isLastMoved={isLastMoved}
                onClick={() => handleClick(squareName)}
              />
            );
          })
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-4 text-lg font-semibold text-red-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

interface SquareComponentProps {
  squareName: Square;
  isWhiteTile: boolean;
  piece: string | null;
  isValidMove: boolean;
  isSelected: boolean;
  isLastMoved: boolean;
  onClick: () => void;
}

function SquareComponent({
  squareName,
  isWhiteTile,
  piece,
  isValidMove,
  isSelected,
  isLastMoved,
  onClick,
}: SquareComponentProps) {
  const isWhitePiece = piece?.startsWith('w');
  const pieceUnicode = piece ? LEIPZIG_PIECES[piece] : null;

  return (
    <motion.div
      className={`flex h-[10vmin] w-[10vmin] cursor-pointer items-center justify-center transition-colors
        ${isWhiteTile ? 'bg-white' : 'bg-black'}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Square ${squareName}${piece ? ` containing ${piece}` : ''}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {pieceUnicode && (
        <motion.span
          className="text-4xl font-bold"
          style={{
            color: isWhitePiece ? PIECE_COLORS.white : PIECE_COLORS.black,
            fontFamily: "'ChessLeipzig', sans-serif",
            textShadow: isWhiteTile
              ? '0.5px 0.5px 0 #000, -0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000'
              : '0.5px 0.5px 0 #fff, -0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff',
            filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))',
          }}
          animate={{
            scale: isSelected ? 1.15 : 1,
            rotate: isSelected ? [0, 5, -5, 0] : 0,
            boxShadow: isLastMoved ? '0 0 8px #FFD700' : 'none',
          }}
          transition={{ duration: 0.3 }}
        >
          {pieceUnicode}
        </motion.span>
      )}
      <AnimatePresence>
        {isValidMove && (
          <motion.div
            className="absolute h-5 w-5 rounded-full border-2 border-black bg-green-400 opacity-80"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8, y: [0, -3, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, y: { repeat: Infinity, duration: 1 } }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}