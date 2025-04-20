'use client';

import { useState, useCallback, useMemo } from 'react';
import { ChessInstance, Square, Move, ShortMove } from 'chess.js';
import { Chess } from 'chess.js';
import { motion } from 'framer-motion';
import SquareComponent from './SquareComponent';
import MovingPiece from './MovingPiece';
import { Style } from './types';
import styles from './Game.module.css';

interface ChessBoardProps {
  game: ChessInstance;
  setGame: (game: ChessInstance) => void;
  isWhiteTurn: boolean;
  setIsWhiteTurn: (turn: boolean) => void;
  setError: (error: string | null) => void;
  pieceStyles: Style[];
  selectedStyle: string;
  boardColor: string | null;
  moveSound: React.MutableRefObject<HTMLAudioElement | null>;
  captureSound: React.MutableRefObject<HTMLAudioElement | null>;
  winSound: React.MutableRefObject<HTMLAudioElement | null>;
  setGameEnded: (winner: string | null) => void;
}

export default function ChessBoard({
  game,
  setGame,
  isWhiteTurn,
  setIsWhiteTurn,
  setError,
  pieceStyles,
  selectedStyle,
  boardColor,
  moveSound,
  captureSound,
  winSound,
  setGameEnded,
}: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMovedSquare, setLastMovedSquare] = useState<Square | null>(null);
  const [movingPiece, setMovingPiece] = useState<{ from: Square; to: Square; piece: string } | null>(null);

  const validMoves = useMemo(
    () =>
      selectedSquare
        ? game.moves({ square: selectedSquare, verbose: true }).map((move: Move) => move.to)
        : [],
    [game, selectedSquare]
  );

  const pieceMap = useMemo(() => {
    const style = pieceStyles.find((s) => s.name === selectedStyle);
    return style ? style.pieces : {};
  }, [pieceStyles, selectedStyle]);

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
        const move: ShortMove = { from: selectedSquare, to: square };
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
              setIsWhiteTurn(!isWhiteTurn);
              setLastMovedSquare(square);
              setMovingPiece(null);

              if (isCapture) {
                captureSound.current?.play().catch(() => {});
              } else {
                moveSound.current?.play().catch(() => {});
              }

              if (game.game_over()) {
                if (game.in_checkmate()) {
                  setGameEnded(isWhiteTurn ? 'black' : 'white');
                } else {
                  setGameEnded('draw');
                }
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
    [
      game,
      isWhiteTurn,
      selectedSquare,
      validMoves,
      setGame,
      setIsWhiteTurn,
      setError,
      captureSound,
      moveSound,
      winSound,
      setGameEnded,
    ]
  );

  return (
    <motion.div
      className={styles.board}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {game.board().map((row: Array<{ type: string; color: string } | null>, rowIndex: number) =>
        row.map((square: { type: string; color: string } | null, colIndex: number) => {
          const squareName = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}` as Square;
          const isWhiteTile = (rowIndex + colIndex) % 2 === 0;
          const piece = square ? `${square.color}${square.type}` : null;
          return (
            <SquareComponent
              key={squareName}
              squareName={squareName}
              isWhiteTile={isWhiteTile}
              piece={piece}
              isValidMove={validMoves.includes(squareName)}
              isSelected={selectedSquare === squareName}
              isLastMoved={lastMovedSquare === squareName}
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
  );
}