// src/pages/ChessGame.jsx
import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());

  const handleMove = (from, to) => {
    const newGame = new Chess(game.fen());
    const move = newGame.move({ from, to });

    if (move === null) return false;
    setGame(newGame);
    return true;
  };

  return (
    <div>
      <h2>Modded Chess Game</h2>
      <Chessboard
        position={game.fen()}
        onPieceDrop={handleMove}
        boardWidth={400}
      />
    </div>
  );
};

export default ChessGame;
