'use client';

import { useState } from 'react';
import { Chess } from 'chess.js';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GamePage() {
  const [game, setGame] = useState(new Chess());
  const [selected, setSelected] = useState<string | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  const board = isWhiteTurn
    ? game.board()
    : [...game.board()].reverse().map(row => [...row].reverse());

  const handleClick = (row: number, col: number) => {
    const actualRow = isWhiteTurn ? row : 7 - row;
    const actualCol = isWhiteTurn ? col : 7 - col;

    const square = String.fromCharCode(97 + actualCol) + (8 - actualRow);
    if (selected) {
      const move = { from: selected, to: square };
      const result = game.move(move);
      if (result) {
        setGame(new Chess(game.fen()));
        setSelected(null);
        setIsWhiteTurn(!isWhiteTurn);
      } else {
        setSelected(square);
      }
    } else {
      setSelected(square);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="flex justify-between w-full max-w-2xl mb-6">
        <Link href="/GameCollection">
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold text-white shadow">
            ← Back
          </button>
        </Link>
        <h2 className="text-2xl font-bold">1v1 Offline</h2>
        <div className="w-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-8 border-4 border-white rounded-lg overflow-hidden shadow-2xl"
      >
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const isWhiteTile = (rowIndex + colIndex) % 2 === 0;
            const squareColor = isWhiteTile ? 'bg-white' : 'bg-black';

            const piece = square ? `${square.color}${square.type}` : null;
            const isWhitePiece = piece?.startsWith('w');

            const pieceStyle = piece
              ? isWhitePiece
                ? 'text-white drop-shadow-[0_0_3px_black]'
                : 'text-black drop-shadow-[0_0_3px_white]'
              : '';

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                className={`${squareColor} w-16 h-16 flex items-center justify-center text-2xl cursor-pointer hover:brightness-110 transition-all`}
              >
                {piece ? <span className={`${pieceStyle}`}>{renderPiece(piece)}</span> : ''}
              </div>
            );
          })
        )}
      </motion.div>
    </main>
  );
}

function renderPiece(piece: string) {
  const unicodePieces: { [key: string]: string } = {
    pw: '♙', pb: '♟︎',
    rw: '♖', rb: '♜',
    nw: '♘', nb: '♞',
    bw: '♗', bb: '♝',
    qw: '♕', qb: '♛',
    kw: '♔', kb: '♚',
  };
  return unicodePieces[piece[1] + piece[0]];
}
