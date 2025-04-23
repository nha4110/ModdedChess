'use client';

import React from 'react';
import styles from './Inventory.module.css';

interface SkinOption {
  id: string;
  name: string;
  colors?: { light: string; dark: string };
}

interface BoardTabProps {
  boardOptions: SkinOption[];
  selectedBoard: string;
  setSelectedBoard: (id: string) => void;
}

const BoardTab: React.FC<BoardTabProps> = ({ boardOptions, selectedBoard, setSelectedBoard }) => {
  return (
    <div className="space-y-2">
      {boardOptions.map((board) => (
        <button
          key={board.id}
          className={`${styles.boardButton} ${
            selectedBoard === board.id ? styles.selected : styles.unselected
          }`}
          onClick={() => setSelectedBoard(board.id)}
        >
          <span className="flex items-center gap-2">
            {board.name}
            {board.id === 'classic-wood' && selectedBoard === board.id && (
              <svg
                className="w-4 h-4 text-lime-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default BoardTab;