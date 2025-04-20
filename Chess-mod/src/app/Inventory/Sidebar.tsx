import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SkinOption } from './types';

interface SidebarProps {
  activeTab: 'board' | 'piece' | 'case';
  setActiveTab: (tab: 'board' | 'piece' | 'case') => void;
  boardOptions: SkinOption[];
  pieceOptions: SkinOption[];
  selectedBoard: string;
  setSelectedBoard: (id: string) => void;
  selectedPiece: string;
  setSelectedPiece: (id: string) => void;
  setSelectedStyle: (style: string) => void;
}

const casePlaceholder: SkinOption = {
  id: 'case1',
  name: 'Mystery Case',
  image: 'https://images.oki.gg/?url=https%3A%2F%2Fraw.githubusercontent.com%2FByMykel%2Fcounter-strike-image-tracker%2Fmain%2Fstatic%2Fpanorama%2Fimages%2Fecon%2Fweapon_cases%2Fcrate_community_29_png.png&w=128&h=97',
};

export default function Sidebar({
  activeTab,
  setActiveTab,
  boardOptions,
  pieceOptions,
  selectedBoard,
  setSelectedBoard,
  selectedPiece,
  setSelectedPiece,
  setSelectedStyle,
}: SidebarProps) {
  return (
    <div className="w-80 mr-[-20px] bg-black/50 rounded-lg p-4 flex flex-col">
      <div className="flex flex-row gap-2 mb-4">
        {(['board', 'piece', 'case'] as const).map((tab) => (
          <motion.button
            key={tab}
            className={`flex-1 text-lg font-semibold text-center py-2 px-2 rounded-lg ${activeTab === tab ? 'text-lime-300 bg-lime-500/30' : 'text-gray-400 hover:text-lime-400 hover:bg-gray-700/50'} transition`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (['board', 'piece', 'case'].indexOf(tab) + 1) }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      <div className="space-y-2">
        {activeTab === 'board' &&
          boardOptions.map((board) => (
            <motion.button
              key={board.id}
              className={`w-full p-2 rounded-lg text-left ${selectedBoard === board.id ? 'bg-lime-500/50' : 'bg-gray-700/50'} hover:bg-lime-500/30 transition`}
              onClick={() => setSelectedBoard(board.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {board.name}
            </motion.button>
          ))}
        {activeTab === 'piece' &&
          pieceOptions.map((piece) => (
            <motion.button
              key={piece.id}
              className={`w-full p-2 rounded-lg text-left ${selectedPiece === piece.id ? 'bg-lime-500/50' : 'bg-gray-700/50'} hover:bg-lime-500/30 transition`}
              onClick={() => {
                setSelectedPiece(piece.id);
                setSelectedStyle(piece.style || 'alpha');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {piece.name}
            </motion.button>
          ))}
        {activeTab === 'case' && (
          <motion.div
            className="w-full p-2 rounded-lg bg-lime-500/50 hover:bg-lime-500/30 transition flex items-center gap-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              className="w-16 h-16 object-cover"
              src={casePlaceholder.image as string}
              alt={casePlaceholder.name}
              width={64}
              height={64}
            />
            <div>{casePlaceholder.name}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}