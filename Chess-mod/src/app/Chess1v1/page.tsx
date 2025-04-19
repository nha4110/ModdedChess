'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chess, Square, Move, ShortMove } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './Game.module.css';

// Type definition for NFT JSON
interface NFTJson {
  name: string;
  description: string;
  type: string;
  attributes: Array<{
    trait_type: string;
    value: string | string[];
  }>;
}

// Hardcoded NFT JSON (replace with fetch from Pinata/database later)
const nftJson: NFTJson | null = null; // Test default case; restore original for NFT behavior
// const nftJson: NFTJson | null = {
//   name: 'Modernist PieceSet1 NFT',
//   description: 'A unique PieceSet1 NFT with a style of Modernist and random effects.',
//   type: 'PieceSet1',
//   attributes: [
//     { trait_type: 'Color', value: '#c0fbf5' },
//     { trait_type: 'Effect', value: ['Shadow Wisp'] },
//     { trait_type: 'Style', value: 'alpha' },
//   ],
// };

interface Style {
  name: string;
  pieces: Record<string, string>;
}

export default function GamePage() {
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastMovedSquare, setLastMovedSquare] = useState<Square | null>(null);
  const [movingPiece, setMovingPiece] = useState<{ from: Square; to: Square; piece: string } | null>(null);
  const [pieceStyles, setPieceStyles] = useState<Style[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('alpha'); // Default to alpha
  const [boardColor, setBoardColor] = useState<string | null>(null); // NFT color or null for default

  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);

  // Fetch styles from API
  useEffect(() => {
    async function fetchStyles() {
      try {
        const response = await fetch('/api/styles');
        const data = await response.json();
        if (data.success) {
          setPieceStyles(data.styles);
        } else {
          console.error('Failed to fetch styles:', data.error);
        }
      } catch (error) {
        console.error('Error fetching styles:', error);
      }
    }
    fetchStyles();
  }, []);

  // Set style and color from NFT JSON (or use defaults)
  useEffect(() => {
    if (!nftJson) {
      setSelectedStyle('alpha'); // Default style
      setBoardColor(null); // Use CSS default colors
      return;
    }

    const styleAttr = nftJson.attributes.find((attr: { trait_type: string; value: string | string[] }) => attr.trait_type === 'Style');
    const colorAttr = nftJson.attributes.find((attr: { trait_type: string; value: string | string[] }) => attr.trait_type === 'Color');

    setSelectedStyle(typeof styleAttr?.value === 'string' ? styleAttr.value : 'alpha');
    setBoardColor(typeof colorAttr?.value === 'string' ? colorAttr.value : null);
  }, []);

  // Initialize sounds
  useEffect(() => {
    moveSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3');
    captureSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3');
    winSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/notify.mp3');
  }, []);

  const validMoves = useMemo(
    () =>
      selectedSquare
        ? game.moves({ square: selectedSquare, verbose: true }).map((move: Move) => move.to)
        : [],
    [game, selectedSquare]
  );

  const getSquarePosition = (square: Square) => {
    const col = square.charCodeAt(0) - 97;
    const row = 8 - parseInt(square[1]);
    return { x: col * 10, y: row * 10 };
  };

  const handleClick = useCallback(
    (square: Square) => {
      const piece = game.get(square);
      setError(null);

      if (piece && piece.color === (isWhiteTurn ? 'w' : 'b')) {
        setSelectedSquare(square);
        return;
      }

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
          if (!selectedPiece) throw new Error('No piece on selected square');

          const pieceKey = `${selectedPiece.color}${selectedPiece.type}`;
          setMovingPiece({ from: selectedSquare, to: square, piece: pieceKey });

          setTimeout(() => {
            const result = game.move(move);
            if (result) {
              setGame(new Chess(game.fen()));
              setSelectedSquare(null);
              setIsWhiteTurn((prev) => !prev);
              setLastMovedSquare(square);
              setMovingPiece(null);

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
          }, 300);
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

  // Get piece mappings for the selected style
  const pieceMap = useMemo(() => {
    const style = pieceStyles.find((s) => s.name === selectedStyle);
    return style ? style.pieces : {};
  }, [pieceStyles, selectedStyle]);

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

      <div className={styles.styleSelector}>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className={styles.styleDropdown}
        >
          {pieceStyles.map((style) => (
            <option key={style.name} value={style.name}>
              {style.name}
            </option>
          ))}
        </select>
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
                pieceMap={pieceMap}
                boardColor={boardColor}
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
            pieceMap={pieceMap}
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
  pieceMap: Record<string, string>;
  boardColor: string | null;
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
  pieceMap,
  boardColor,
}: SquareComponentProps) {
  const pieceSrc = piece ? pieceMap[piece] : null;

  return (
    <motion.div
      className={`${styles.square} ${isWhiteTile ? styles.whiteTile : styles.blackTile}`}
      style={boardColor ? { backgroundColor: isWhiteTile ? boardColor : darkenColor(boardColor, 0.7) } : {}}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Square ${squareName}${piece ? ` containing ${piece}` : ''}`}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') onClick();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {pieceSrc && !isMoving && (
        <motion.img
          src={pieceSrc}
          alt={piece || 'chess piece'}
          className={styles.piece}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          animate={{
            scale: isSelected ? 1.15 : 1,
            rotate: isSelected ? [0, 5, -5, 0] : 0,
            boxShadow: isLastMoved ? '0 0 8px #FFD700' : 'none',
          }}
          transition={{ duration: 0.3 }}
        />
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
  pieceMap: Record<string, string>;
}

function MovingPiece({ piece, from, to, getSquarePosition, pieceMap }: MovingPieceProps) {
  const pieceSrc = pieceMap[piece];
  const fromPos = getSquarePosition(from);
  const toPos = getSquarePosition(to);

  return (
    <motion.img
      src={pieceSrc}
      alt={piece}
      className={styles.piece}
      style={{
        width: '10vmin',
        height: '10vmin',
        objectFit: 'contain',
        position: 'absolute',
        left: `${fromPos.x}vmin`,
        top: `${fromPos.y}vmin`,
      }}
      animate={{
        left: `${toPos.x}vmin`,
        top: `${toPos.y}vmin`,
      }}
      transition={{ duration: 0.3 }}
    />
  );
}

// Utility to darken a color for black tiles
function darkenColor(hex: string, factor: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
}