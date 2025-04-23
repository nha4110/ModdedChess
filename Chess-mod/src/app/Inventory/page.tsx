'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Chess } from 'chess.js';
import { pieceMaps } from './pieceMaps';
import BoardTab from './BoardTab';
import PieceTab from './PieceTab';
import CaseTab from './CaseTab';
import styles from './Inventory.module.css';

interface SkinOption {
  id: string;
  name: string;
  image?: string;
  colors?: { light: string; dark: string };
  style?: string;
}

const initialBoardOptions: SkinOption[] = [
  { id: 'board1', name: 'Classic Wood', colors: { light: '#f0d9b5', dark: '#b58863' } },
];

const initialPieceOptions: SkinOption[] = [
  { id: 'piece1', name: 'Alpha Pieces', style: 'alpha' },
];

const ChessBoard: React.FC<{
  boardId: string;
  pieceStyle: string;
  boardOptions: SkinOption[];
}> = ({ boardId, pieceStyle, boardOptions }) => {
  const game = new Chess();
  const currentBoard = boardOptions.find((b) => b.id === boardId) || boardOptions[0];
  const pieceMap = pieceMaps[pieceStyle] || pieceMaps.alpha;

  console.log('ChessBoard props:', { boardId, pieceStyle, currentBoard, pieceMap });

  return (
    <div className={styles.chessBoard} style={{ minHeight: '400px', minWidth: '400px' }}>
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
              style={{ backgroundColor: tileColor || '#ffffff' }}
            >
              {piece && pieceMap[piece] ? (
                <Image
                  src={pieceMap[piece]}
                  alt={piece}
                  width={60}
                  height={60}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  onError={(e) => {
                    console.error(`Failed to load piece: ${pieceMap[piece]}`);
                    e.currentTarget.src = '/fallback-piece.png';
                  }}
                />
              ) : (
                piece && <div className="text-red-500 text-center">Missing {piece}</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'board' | 'piece' | 'case'>('board');
  const [selectedBoard, setSelectedBoard] = useState<string>(initialBoardOptions[0].id);
  const [selectedPiece, setSelectedPiece] = useState<string>(initialPieceOptions[0].id);
  const [selectedStyle, setSelectedStyle] = useState<string>('alpha');
  const [boardOptions, setBoardOptions] = useState<SkinOption[]>(initialBoardOptions);
  const [pieceOptions, setPieceOptions] = useState<SkinOption[]>(initialPieceOptions);
  const [username, setUsername] = useState<string | null>(null);
  const [caseCount, setCaseCount] = useState<number | null>(null);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);

    const checkCases = async () => {
      try {
        const response = await fetch('/api/check-cases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ username: storedUsername }),
        });
        const data = await response.json();
        console.log('Fetched case count:', data);
        setCaseCount(data.caseCount ?? 0);
      } catch (error) {
        console.error('Error fetching cases:', error);
        setCaseCount(0);
      }
    };
    if (storedUsername) {
      checkCases();
    }
  }, []);

  const handleCaseFinish = (item: SkinOption) => {
    console.log('User received:', item);
    if (item.colors) {
      setBoardOptions((prev) => {
        if (prev.some((opt) => opt.id === item.id)) return prev;
        return [...prev, item];
      });
    } else if (item.style) {
      setPieceOptions((prev) => {
        if (prev.some((opt) => opt.id === item.id)) return prev;
        return [...prev, item];
      });
    }
    setCaseCount((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
  };

  const renderTabButtons = () =>
    (['board', 'piece', 'case'] as const).map((tab) => (
      <button
        key={tab}
        className={`${styles.tabButton} ${
          activeTab === tab ? 'bg-blue-500/50 text-blue-300' : 'bg-gray-700/50 text-gray-400'
        }`}
        onClick={() => {
          setActiveTab(tab);
          if (tab !== 'case') setSelectedCaseIndex(null);
        }}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ));

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.navLink}>
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
          <Link href="/profile" className={styles.navLink}>
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.tabButtons}>{renderTabButtons()}</div>
          <div className={styles.tabContent}>
            {activeTab === 'board' && (
              <BoardTab
                boardOptions={boardOptions}
                selectedBoard={selectedBoard}
                setSelectedBoard={setSelectedBoard}
              />
            )}
            {activeTab === 'piece' && (
              <PieceTab
                pieceOptions={pieceOptions}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                setSelectedStyle={setSelectedStyle}
              />
            )}
            {activeTab === 'case' && (
              <CaseTab
                activeTab={activeTab}
                pieceStyle={selectedStyle || 'alpha'}
                caseCount={caseCount}
                selectedCaseIndex={selectedCaseIndex}
                setSelectedCaseIndex={setSelectedCaseIndex}
                onFinish={handleCaseFinish}
                renderSidebar={true}
              />
            )}
          </div>
        </div>
        <div className={styles.mainBox}>
          <div className={styles.mainContentBox}>
            {activeTab === 'board' || activeTab === 'piece' ? (
              <ChessBoard boardId={selectedBoard} pieceStyle={selectedStyle || 'alpha'} boardOptions={boardOptions} />
            ) : (
              <CaseTab
                activeTab={activeTab}
                pieceStyle={selectedStyle || 'alpha'}
                caseCount={caseCount}
                selectedCaseIndex={selectedCaseIndex}
                setSelectedCaseIndex={setSelectedCaseIndex}
                onFinish={handleCaseFinish}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}