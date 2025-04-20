'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Square } from 'chess.js';
import { darkenColor } from './utils';
import styles from './Game.module.css';

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

export default function SquareComponent({
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