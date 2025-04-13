// src/app/inventory/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Define types for chessboard and piece options
interface SkinOption {
  id: string;
  name: string;
  preview: string; // URL or placeholder for preview image
}

const chessboardOptions: SkinOption[] = [
  { id: 'board1', name: 'Classic', preview: 'Icon of chess piece' },
  { id: 'board2', name: 'Wooden', preview: 'Icon of chess piece' },
  { id: 'board3', name: 'Marble', preview: 'Icon of chess piece' },
  { id: 'board4', name: 'Glass', preview: 'Icon of chess piece' },
];

const chessPieceOptions: SkinOption[] = [
  { id: 'piece1', name: 'Standard', preview: 'Icon of chess piece' },
  { id: 'piece2', name: 'Fancy', preview: 'Icon of chess piece' },
  { id: 'piece3', name: 'Modern', preview: 'Icon of chess piece' },
  { id: 'piece4', name: 'Minimal', preview: 'Icon of chess piece' },
];

export default function ChessSkinSelector() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const handleBoardSelect = (id: string) => {
    setSelectedBoard(id);
  };

  const handlePieceSelect = (id: string) => {
    setSelectedPiece(id);
  };

  const handleApply = () => {
    if (selectedBoard && selectedPiece) {
      console.log(`Applied: Board - ${selectedBoard}, Piece - ${selectedPiece}`);
    } else {
      alert('Please select both a chessboard and a piece style.');
    }
  };

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen text-white"
      style={{
        // backgroundImage: `url('/bg4.gif')`,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-screen px-6 bg-[transparent]"
      >
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-extrabold text-center text-[#2cdd0c] drop-shadow-[0_0_20px_#2cdd0c] mb-16 font-[fantasy]"
        >
          🎨 Choose Your Chess Skin
        </motion.h2>

        {/* Chessboard Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center gap-6 w-full max-w-4xl mb-12"
        >
          <h3 className="text-3xl font-bold text-lime-300 drop-shadow-[0_0_10px_#2cdd0c]">
            Chess Board
          </h3>
          <div className="border-4 border-lime-400 rounded-2xl p-6 w-full h-80 flex items-center justify-center bg-black/50">
            <span className="text-gray-300 text-center text-xl">
              {selectedBoard ? `Selected: ${selectedBoard}` : 'Select a board'}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chessboardOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className={`w-40 h-40 rounded-xl bg-gradient-to-br ${
                  selectedBoard === option.id
                    ? 'from-green-600 to-lime-600'
                    : 'from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600'
                } text-white text-lg font-bold shadow-lg hover:shadow-lime-500/60 transition-all duration-300 ease-in-out tracking-wide flex flex-col items-center justify-center`}
                onClick={() => handleBoardSelect(option.id)}
              >
                <div className="w-24 h-24 border-2 border-white rounded-lg flex items-center justify-center mb-2 bg-white/20">
                  {option.preview}
                </div>
                <span>Choose</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chess Pieces Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-center gap-6 w-full max-w-4xl mb-12"
        >
          <h3 className="text-3xl font-bold text-lime-300 drop-shadow-[0_0_10px_#2cdd0c]">
            Chess Pieces
          </h3>
          <div className="border-4 border-lime-400 rounded-2xl p-6 w-full h-80 flex items-center justify-center bg-black/50">
            <span className="text-gray-300 text-center text-xl">
              {selectedPiece ? `Selected: ${selectedPiece}` : 'Select a piece style'}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chessPieceOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className={`w-40 h-40 rounded-xl bg-gradient-to-br ${
                  selectedPiece === option.id
                    ? 'from-blue-600 to-cyan-500'
                    : 'from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'
                } text-white text-lg font-bold shadow-lg hover:shadow-cyan-400/60 transition-all duration-300 ease-in-out tracking-wide flex flex-col items-center justify-center`}
                onClick={() => handlePieceSelect(option.id)}
              >
                <div className="w-24 h-24 border-2 border-white rounded-lg flex items-center justify-center mb-2 bg-white/20">
                  {option.preview}
                </div>
                <span>Choose</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Apply Button */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="w-64 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-2xl font-bold shadow-lg hover:shadow-pink-500/60 transition-all duration-300 ease-in-out tracking-wide flex items-center justify-center mb-8"
          onClick={handleApply}
        >
          Applied
        </motion.button>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-8 text-lg font-semibold text-lime-300 hover:text-lime-400 transition-all duration-500 ease-in-out hover:underline hover:tracking-wider drop-shadow-[0_0_4px_#2cdd0c]"
        >
          ← Back to Menu
        </Link>
      </motion.div>
    </main>
  );
}