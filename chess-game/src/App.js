import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

function App() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [gameStatus, setGameStatus] = useState('');

  function makeMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    if (result) {
      setGame(gameCopy);
      setFen(gameCopy.fen());
      updateGameStatus(gameCopy);
      return true;
    }
    return false;
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Auto-promote to queen for simplicity
    });
    return move;
  }

  function updateGameStatus(game) {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setGameStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`);
      } else if (game.isDraw()) {
        setGameStatus('Draw!');
      } else if (game.isStalemate()) {
        setGameStatus('Stalemate!');
      }
    } else if (game.inCheck()) {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} is in check!`);
    } else {
      setGameStatus('');
    }
  }

  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setGameStatus('');
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Chess Game</h1>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardWidth={400}
      />
      <div style={{ marginTop: '20px' }}>
        <p>{gameStatus || `Turn: ${game.turn() === 'w' ? 'White' : 'Black'}`}</p>
        <button onClick={resetGame}>New Game</button>
      </div>
    </div>
  );
}

export default App;