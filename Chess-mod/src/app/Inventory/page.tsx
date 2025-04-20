'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import ChessBoard from './ChessBoard';
import CaseOpeningWrapper from './CaseOpeningWrapper';
import { SkinOption } from './types';

const initialBoardOptions: SkinOption[] = [
  { id: 'board1', name: 'Classic Wood', colors: { light: '#f0d9b5', dark: '#b58863' } },
];

const initialPieceOptions: SkinOption[] = [
  { id: 'piece1', name: 'Alpha Pieces', style: 'alpha' },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'board' | 'piece' | 'case'>('board');
  const [selectedBoard, setSelectedBoard] = useState<string>(initialBoardOptions[0].id);
  const [selectedPiece, setSelectedPiece] = useState<string>(initialPieceOptions[0].id);
  const [selectedStyle, setSelectedStyle] = useState<string>('alpha');
  const [boardOptions, setBoardOptions] = useState<SkinOption[]>(initialBoardOptions);
  const [pieceOptions, setPieceOptions] = useState<SkinOption[]>(initialPieceOptions);

  const handleCaseFinish = (item: SkinOption) => {
    console.log('User received:', item);
    if (item.colors) {
      setBoardOptions((prev) => [...prev, item]);
    } else if (item.style) {
      setPieceOptions((prev) => [...prev, item]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="w-full p-4 flex justify-between items-center bg-black/30">
        <Link href="/" className="text-lime-300 hover:text-lime-400 transition">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
        <Link href="/profile" className="text-lime-300 hover:text-lime-400 transition">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
      </div>

      <div className="flex flex-1 w-full max-w-7xl mx-auto p-4 gap-4">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          boardOptions={boardOptions}
          pieceOptions={pieceOptions}
          selectedBoard={selectedBoard}
          setSelectedBoard={setSelectedBoard}
          selectedPiece={selectedPiece}
          setSelectedPiece={setSelectedPiece}
          setSelectedStyle={setSelectedStyle}
        />
        <div className="flex-1 bg-black/50 rounded-lg p-4 flex items-center justify-center">
          {activeTab === 'case' ? (
            <CaseOpeningWrapper pieceStyle={selectedStyle} onFinish={handleCaseFinish} />
          ) : (
            <ChessBoard boardId={selectedBoard} pieceStyle={selectedStyle} boardOptions={boardOptions} />
          )}
        </div>
      </div>
    </main>
  );
}