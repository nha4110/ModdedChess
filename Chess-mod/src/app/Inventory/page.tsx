'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define types for inventory items
interface SkinOption {
  id: string;
  name: string;
  image: string;
}

// Minimal dummy data (options added later via inventory table)
const boardOptions: SkinOption[] = [
  { id: 'board1', name: 'Default Board', image: '/chess-board.png' },
];

const pieceOptions: SkinOption[] = [
  { id: 'piece1', name: 'Alpha Pieces', image: '/chess-pieces-alpha.png' },
];

// Placeholder for case
const casePlaceholder: SkinOption = {
  id: 'case1',
  name: 'Mystery Case',
  image: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGo5aGw2bm5xMDdvbnFkd2g4OGpzMHhvcnd5ZzdqZWNuaHJ2YmhkcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2yWgF536HDyiA/giphy.gif',
};

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'board' | 'piece' | 'case'>('board');
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  // Default piece
  const defaultPiece = pieceOptions[0];

  // Board colors from chess1v1
  const boardColor = '#c0fbf5'; // Light cyan for white tiles
  const darkBoardColor = darkenColor(boardColor, 0.7); // Darkened for black tiles

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Bar */}
      <div className="w-full p-4 flex justify-between items-center bg-black/30">
        <Link href="/" className="text-lime-300 hover:text-lime-400 transition">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
        <div className="text-lime-300">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto p-4 gap-4">
        {/* Sidebar with Tabs */}
        <div className="w-64 bg-black/50 rounded-lg p-4">
          <div className="flex gap-4 mb-4">
            {['board', 'piece', 'case'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 text-lg font-semibold ${
                  activeTab === tab
                    ? 'text-lime-300 border-b-2 border-lime-300'
                    : 'text-gray-400 hover:text-lime-400'
                } transition`}
                onClick={() => setActiveTab(tab as 'board' | 'piece' | 'case')}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Inventory Items */}
          {activeTab === 'board' && (
            <div className="space-y-2">
              {boardOptions.map((board) => (
                <button
                  key={board.id}
                  className={`w-full p-2 rounded-lg text-left ${
                    selectedBoard === board.id ? 'bg-lime-500/50' : 'bg-gray-700/50'
                  } hover:bg-lime-500/30 transition`}
                  onClick={() => setSelectedBoard(board.id)}
                >
                  {board.name}
                </button>
              ))}
            </div>
          )}
          {activeTab === 'piece' && (
            <div className="space-y-2">
              {pieceOptions.map((piece) => (
                <button
                  key={piece.id}
                  className={`w-full p-2 rounded-lg text-left ${
                    selectedPiece === piece.id ? 'bg-lime-500/50' : 'bg-gray-700/50'
                  } hover:bg-lime-500/30 transition`}
                  onClick={() => setSelectedPiece(piece.id)}
                >
                  {piece.name}
                </button>
              ))}
            </div>
          )}
          {activeTab === 'case' && (
            <div className="space-y-2">
              <button
                className="w-full p-2 rounded-lg text-left bg-gray-700/50 hover:bg-lime-500/30 transition"
                onClick={() => {}}
              >
                {casePlaceholder.name}
              </button>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-black/50 rounded-lg p-4 flex items-center justify-center">
          {activeTab !== 'case' ? (
            <div className="relative">
              <div
                className="w-[400px] h-[400px] rounded-lg shadow-lg"
                style={{
                  background: `linear-gradient(45deg, ${boardColor} 25%, ${darkBoardColor} 25%, ${darkBoardColor} 50%, ${boardColor} 50%, ${boardColor} 75%, ${darkBoardColor} 75%)`,
                  backgroundSize: '40px 40px',
                }}
              />
              {selectedPiece || activeTab === 'piece' ? (
                <Image
                  src={
                    selectedPiece
                      ? pieceOptions.find((p) => p.id === selectedPiece)?.image ||
                        defaultPiece.image
                      : defaultPiece.image
                  }
                  alt="Chess Pieces"
                  width={200}
                  height={200}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={casePlaceholder.image}
                alt="Mystery Case"
                className="w-[300px] h-[300px] rounded-lg shadow-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Darken color function from chess1v1
function darkenColor(hex: string, factor: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
}