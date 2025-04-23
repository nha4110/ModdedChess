'use client';

import React from 'react';
import styles from './Inventory.module.css';

interface SkinOption {
  id: string;
  name: string;
  style?: string;
}

interface PieceTabProps {
  pieceOptions: SkinOption[];
  selectedPiece: string;
  setSelectedPiece: (id: string) => void;
  setSelectedStyle: (style: string) => void;
}

const PieceTab: React.FC<PieceTabProps> = ({
  pieceOptions,
  selectedPiece,
  setSelectedPiece,
  setSelectedStyle,
}) => {
  return (
    <div className="space-y-2">
      {pieceOptions.map((piece) => (
        <button
          key={piece.id}
          className={`${styles.pieceButton} ${
            selectedPiece === piece.id ? styles.selected : styles.unselected
          }`}
          onClick={() => {
            setSelectedPiece(piece.id);
            setSelectedStyle(piece.style || 'alpha');
          }}
        >
          <span className="flex items-center gap-2">
            {piece.name}
            {piece.id === 'alpha' && selectedPiece === piece.id && (
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

export default PieceTab;