import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [error, setError] = useState(null);

  const handleMove = (from, to) => {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({ from, to });

      if (move === null) {
        setError(`Invalid move: ${from} → ${to}`);
        return false;
      }

      setGame(gameCopy);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Unexpected move error.');
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        minHeight: '100vh',
        background: '#f0f2f5',
      }}
    >
      <h1 style={{ marginBottom: '2rem' }}>♟ Modded Chess Game</h1>

      <div style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.2)', borderRadius: '10px' }}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={(sourceSquare, targetSquare) =>
            handleMove(sourceSquare, targetSquare)
          }
          boardWidth={500}
          boardOrientation="white"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: '1.5rem',
              color: '#b00020',
              backgroundColor: '#ffe6e6',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChessGame;
