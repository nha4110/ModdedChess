import React from 'react';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { pieceMaps } from './pieceMaps';
import { SkinOption } from './types';

interface ChessBoardProps {
  boardId: string;
  pieceStyle: string;
  boardOptions: SkinOption[];
}

export default function ChessBoard({ boardId, pieceStyle, boardOptions }: ChessBoardProps) {
  const game = new Chess();
  const currentBoard = boardOptions.find((b) => b.id === boardId) || boardOptions[0];
  const pieceMap = pieceMaps[pieceStyle] || pieceMaps.alpha;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="board"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-8 w-[480px] h-[480px] border-4 border-white rounded-xl shadow-xl relative"
      >
        {game.board().map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const squareName = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
            const isWhiteTile = (rowIndex + colIndex) % 2 === 0;
            const tileColor = isWhiteTile ? currentBoard.colors?.light : currentBoard.colors?.dark;
            const piece = square?.type ? `${square.color}${square.type}` : null;

            return (
              <div
                key={squareName}
                className="relative w-full aspect-square"
                style={{ backgroundColor: tileColor }}
              >
                {piece && (
                  <Image
                    src={pieceMap[piece]}
                    alt={piece}
                    width={60}
                    height={60}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                )}
              </div>
            );
          })
        )}
      </motion.div>
    </AnimatePresence>
  );
}