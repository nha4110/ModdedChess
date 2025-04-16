'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chess, Square, Move, ShortMove } from 'chess.js';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Link from 'next/link';
import styles from './Game.module.css';

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
  const [movingPiece, setMovingPiece] = useState<{ from: Square; to: Square; piece: string } | null>(null);

  // Sound effects
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);

  // Load font and initialize sounds
  useEffect(() => {
    // Font
    const styleSheet = document.createElement('style');
    styleSheet.textContent = leipzigFontStyles;
    document.head.appendChild(styleSheet);

    // Sounds
    moveSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3');
    captureSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3');
    winSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/notify.mp3');

    return () => {
      styleSheet.remove();
    };
  }, []);

  // Memoize valid moves
  const validMoves = useMemo(
    () =>
      selectedSquare
        ? game.moves({ square: selectedSquare, verbose: true }).map((move: Move) => move.to)
        : [],
    [game, selectedSquare]
  );

  // Calculate position for animation
  const getSquarePosition = (square: Square) => {
    const col = square.charCodeAt(0) - 97; // a=0, b=1, ..., h=7
    const row = 8 - parseInt(square[1]); // 1=7, 2=6, ..., 8=0
    return { x: col * 10, y: row * 10 }; // 10vmin per square
  };

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
      const move: ShortMove = {
        from: selectedSquare,
        to: square,
      };
      const selectedPiece = game.get(selectedSquare);
      if (selectedPiece?.type === 'p' && (square[1] === '8' || square[1] === '1')) {
        move.promotion = 'q';
      }

      try {
        const isCapture = game.get(square) !== null;
        // Ensure selectedPiece is not null before accessing its properties
        if (!selectedPiece) {
          throw new Error('No piece on selected square');
        }
        const pieceKey = `${selectedPiece.color}${selectedPiece.type}`;
        setMovingPiece({ from: selectedSquare, to: square, piece: pieceKey });

        // Animate piece movement
        setTimeout(() => {
          const result = game.move(move);
          if (result) {
            setGame(new Chess(game.fen()));
            setSelectedSquare(null);
            setIsWhiteTurn((prev) => !prev);
            setLastMovedSquare(square);
            setMovingPiece(null);

            // Play sound
            if (isCapture) {
              captureSound.current?.play().catch(() => {});
            } else {
              moveSound.current?.play().catch(() => {});
            }

            if (game.game_over()) {
              setError(
                game.in_checkmate()
                  ? `Checkmate! ${isWhiteTurn ? 'Black' : 'White'} wins!`
                  : game.in_stalemate()
                  ? "Stalemate! It's a draw."
                  : "Draw!"
              );
              winSound.current?.play().catch(() => {});
            }
          }
        }, 300); // Match animation duration
      } catch {
        setError('Invalid move');
        setSelectedSquare(null);
        setMovingPiece(null);
      }
    } else {
      setSelectedSquare(null);
    }
  },
  [game, isWhiteTurn, selectedSquare, validMoves]
);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link href="/GameCollection">
          <motion.button
            className={styles.backButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>
        </Link>
        <motion.h2
          className={styles.title}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          1v1 Offline
        </motion.h2>
        <div className={styles.placeholder} />
      </div>

      <motion.div
        className={styles.board}
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
                isMoving={movingPiece?.from === squareName}
              />
            );
          })
        )}
        {movingPiece && (
          <MovingPiece
            piece={movingPiece.piece}
            from={movingPiece.from}
            to={movingPiece.to}
            getSquarePosition={getSquarePosition}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className={styles.error}
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
  isMoving?: boolean;
}

function SquareComponent({
  squareName,
  isWhiteTile,
  piece,
  isValidMove,
  isSelected,
  isLastMoved,
  onClick,
  isMoving,
}: SquareComponentProps) {
  const isWhitePiece = piece?.startsWith('w');
  const pieceUnicode = piece ? LEIPZIG_PIECES[piece] : null;

  return (
    <motion.div
      className={`${styles.square} ${isWhiteTile ? styles.whiteTile : styles.blackTile}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Square ${squareName}${piece ? ` containing ${piece}` : ''}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {pieceUnicode && !isMoving && (
        <motion.span
          className={styles.piece}
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
            className={styles.validMove}
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

interface MovingPieceProps {
  piece: string;
  from: Square;
  to: Square;
  getSquarePosition: (square: Square) => { x: number; y: number };
}

function MovingPiece({ piece, from, to, getSquarePosition }: MovingPieceProps) {
  const isWhitePiece = piece.startsWith('w');
  const pieceUnicode = LEIPZIG_PIECES[piece];
  const fromPos = getSquarePosition(from);
  const toPos = getSquarePosition(to);

  return (
    <motion.span
      className={styles.piece}
      style={{
        color: isWhitePiece ? PIECE_COLORS.white : PIECE_COLORS.black,
        fontFamily: "'ChessLeipzig', sans-serif",
        textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
        filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))',
        position: 'absolute',
        fontSize: '2.25rem',
        zIndex: 10,
      }}
      initial={{ x: fromPos.x + 'vmin', y: fromPos.y + 'vmin' }}
      animate={{ x: toPos.x + 'vmin', y: toPos.y + 'vmin', scale: [1, 1.2, 1] }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {pieceUnicode}
    </motion.span>
  );
}