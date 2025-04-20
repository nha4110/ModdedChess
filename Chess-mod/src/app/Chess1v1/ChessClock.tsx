'use client';

import { motion } from 'framer-motion';
import styles from './Game.module.css';

interface ChessClockProps {
  whiteTime: number;
  blackTime: number;
  isWhiteTurn: boolean;
}

export default function ChessClock({ whiteTime, blackTime, isWhiteTurn }: ChessClockProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.clockContainer}>
      <motion.div
        className={`${styles.clock} ${isWhiteTurn ? styles.activeClock : ''}`}
        animate={{ scale: isWhiteTurn ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        White: {formatTime(whiteTime)}
      </motion.div>
      <motion.div
        className={`${styles.clock} ${!isWhiteTurn ? styles.activeClock : ''}`}
        animate={{ scale: !isWhiteTurn ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        Black: {formatTime(blackTime)}
      </motion.div>
    </div>
  );
}