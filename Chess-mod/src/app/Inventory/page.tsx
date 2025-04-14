'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Define types for chessboard and piece options
interface SkinOption {
  id: string;
  name: string;
  filter: string; // CSS filter for unique icon color
  iconBackground: string; // CSS class for unique icon background
}

const chessboardOptions: SkinOption[] = [
  {
    id: 'board1',
    name: 'Classic',
    filter: 'grayscale(100%) brightness-110 sepia hue-rotate-90 saturate-200', // Light green
    iconBackground: 'bg-lime-200/50', // Light green background
  },
  {
    id: 'board2',
    name: 'Wooden',
    filter: 'grayscale(100%) brightness-110 sepia hue-rotate-60 saturate-150', // Olive green
    iconBackground: 'bg-olive-600/50', // Olive background
  },
  {
    id: 'board3',
    name: 'Marble',
    filter: 'grayscale(100%) brightness-110 hue-rotate-160 saturate-180', // Teal
    iconBackground: 'bg-teal-300/50', // Teal background
  },
  {
    id: 'board4',
    name: 'Glass',
    filter: 'grayscale(100%) brightness-110 sepia hue-rotate-100 saturate-250', // Deep lime
    iconBackground: 'bg-lime-500/50', // Deep lime background
  },
];

const chessPieceOptions: SkinOption[] = [
  {
    id: 'piece1',
    name: 'Standard',
    filter: 'grayscale(100%) brightness-110 hue-rotate-180 saturate-150', // Light blue
    iconBackground: 'bg-blue-200/50', // Light blue background
  },
  {
    id: 'piece2',
    name: 'Fancy',
    filter: 'grayscale(100%) brightness-110 hue-rotate-190 saturate-200', // Cyan
    iconBackground: 'bg-cyan-300/50', // Cyan background
  },
  {
    id: 'piece3',
    name: 'Modern',
    filter: 'grayscale(100%) brightness-110 hue-rotate-220 saturate-180', // Navy blue
    iconBackground: 'bg-blue-600/50', // Navy background
  },
  {
    id: 'piece4',
    name: 'Minimal',
    filter: 'grayscale(100%) brightness-110 hue-rotate-200 saturate-250', // Deep blue
    iconBackground: 'bg-blue-400/50', // Deep blue background
  },
];

export default function ChessSkinSelector() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'board' | 'piece' | null>('board');
  const [previewKey, setPreviewKey] = useState(0); // Force preview re-render

  const handleBoardSelect = (id: string) => {
    console.log('Selected board:', id);
    setSelectedBoard(id);
    setPreviewKey((prev) => prev + 1); // Force re-render
  };

  const handlePieceSelect = (id: string) => {
    console.log('Selected piece:', id);
    setSelectedPiece(id);
    setPreviewKey((prev) => prev + 1); // Force re-render
  };

  const handleApply = () => {
    if (selectedBoard && selectedPiece) {
      console.log(`Applied: Board - ${selectedBoard}, Piece - ${selectedPiece}`);
      setPreviewKey((prev) => prev + 1); // Force re-render preview
    } else {
      alert('Please select both a chessboard and a piece style.');
    }
  };

  // Helper to get the selected option's filter
  const getSelectedBoardFilter = () => {
    const board = chessboardOptions.find((option) => option.id === selectedBoard);
    const filter = board ? board.filter : '';
    console.log('Board filter:', filter);
    return filter;
  };

  const getSelectedPieceFilter = () => {
    const piece = chessPieceOptions.find((option) => option.id === selectedPiece);
    const filter = piece ? piece.filter : '';
    console.log('Piece filter:', filter);
    return filter;
  };

  return (
    <main
      className="flex flex-col items-center justify-start w-full min-h-[120vh] text-white bg-fixed bg-cover bg-left bg-no-repeat"
      style={{
        backgroundImage: "url('/bg1.gif')",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-screen px-6 bg-[transparent] w-full relative"
      >
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute top-10 left1/2 text-6xl font-extrabold text-center text-[#2cdd0c] drop-shadow-[0_0_20px_#2cdd0c] mb-16 font-[fantasy]"
        >
          🎨 Choose Your Chess Skin
        </motion.h2>

        {/* Navigation Tabs */}
        <div className="flex justify-center w-full max-w-4xl mt-28 gap-12">
          <motion.a
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-3xl font-bold text-lime-300 drop-shadow-[0_0_10px_#2cdd0c] cursor-pointer ${
              activeSection === 'board' ? 'underline' : ''
            }`}
            onClick={() => setActiveSection('board')}
          >
            Chess Board
          </motion.a>
          <motion.a
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-3xl font-bold text-cyan-300 drop-shadow-[0_0_10px_#00b7eb] cursor-pointer ${
              activeSection === 'piece' ? 'underline' : ''
            }`}
            onClick={() => setActiveSection('piece')}
          >
            Chess Pieces
          </motion.a>
        </div>

        {/* Overlapped Content Area */}
        <div className="relative w-full max-w-4xl mt-8">
          {/* Chessboard Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: activeSection === 'board' ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`absolute top-0 left-0 w-full flex flex-col items-center gap-6 ${
              activeSection === 'board' ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <div className="border-4 border-lime-400 rounded-2xl p-6 w-full h-80 flex items-center justify-center bg-black/50">
              {selectedBoard ? (
                <Image
                  key={`board-${previewKey}`}
                  src="/icons/board-icon.png"
                  alt="Selected chess board"
                  width={200}
                  height={200}
                  className={`object-contain max-h-full max-w-full filter ${getSelectedBoardFilter()}`} 
                />
              ) : (
                <span className="text-gray-300 text-center text-xl">Select a board</span>
              )}
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
                      ? 'from-transparent-700 to-lime-700'
                      : 'from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600'
                  } text-white text-lg font-bold shadow-lg hover:shadow-lime-500/60 transition-all duration-300 ease-in-out tracking-wide flex flex-col items-center justify-center`}
                  onClick={() => handleBoardSelect(option.id)}
                >
                  <div
                    className={`w-24 h-24 border-2 border-white rounded-lg flex items-center justify-center mb-2 ${option.iconBackground}`}
                  >
                    <Image
                      src="/icons/board-icon.png"
                      alt={option.name}
                      width={80}
                      height={80}
                      className={`object-contain filter ${option.filter}`}
                    />
                  </div>
                  <span>{option.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Chess Pieces Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: activeSection === 'piece' ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`absolute top-0 left-0 w-full flex flex-col items-center gap-6 ${
              activeSection === 'piece' ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <div className="border-4 border-cyan-400 rounded-2xl p-6 w-full h-80 flex items-center justify-center bg-black/50">
              {selectedPiece ? (
                <Image
                  key={`piece-${previewKey}`}
                  src="/icons/chess-icon.png"
                  alt="Selected chess pieces"
                  width={200}
                  height={200}
                  className={`object-contain max-h-full max-w-full filter ${getSelectedPieceFilter()}`} // Use className
                />
              ) : (
                <span className="text-gray-300 text-center text-xl">Select a piece style</span>
              )}
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
                      ? 'from-blue-700 to-cyan-600'
                      : 'from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'
                  } text-white text-lg font-bold shadow-lg hover:shadow-cyan-400/60 transition-all duration-300 ease-in-out tracking-wide flex flex-col items-center justify-center`}
                  onClick={() => handlePieceSelect(option.id)}
                >
                  <div
                    className={`w-24 h-24 border-2 border-white rounded-lg flex items-center justify-center mb-2 ${option.iconBackground}`}
                  >
                    <Image
                      src="/icons/chess-icon.png"
                      alt={option.name}
                      width={80}
                      height={80}
                      className={`object-contain filter ${option.filter}`}
                    />
                  </div>
                  <span>{option.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Apply Button */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="mt-[34rem] w-64 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-2xl font-bold shadow-lg hover:shadow-pink-500/60 transition-all duration-300 ease-in-out tracking-wide flex items-center justify-center mb-8"
          onClick={handleApply}
        >
          Apply
        </motion.button>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-4 text-lg font-semibold text-lime-300 hover:text-lime-400 transition-all duration-500 ease-in-out hover:underline hover:tracking-wider drop-shadow-[0_0_4px_#2cdd0c]"
        >
          ← Back to Menu
        </Link>
      </motion.div>
    </main>
  );
}