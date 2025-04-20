'use client';

import { motion } from 'framer-motion';
import { Square } from 'chess.js';
import styles from './Game.module.css';

interface MovingPieceProps {
  piece: string;
  from: Square;
  to: Square;
  getSquarePosition: (square: Square) => { x: number; y: number };
  pieceMap: Record<string, string>;
}

export default function MovingPiece({ piece, from, to, getSquarePosition, pieceMap }: MovingPieceProps) {
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