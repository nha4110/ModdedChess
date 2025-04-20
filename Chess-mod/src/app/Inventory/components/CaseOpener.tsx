'use client';

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';

interface CaseItem {
  id: string;
  name: string;
  image: string;
}

interface CaseOpeningProps {
  pieceStyle: string;
  onFinish: (item: { id: string; name: string }) => void;
}

const pieceMaps: Record<string, Record<string, string>> = {
  alpha: {
    wp: '/piece/alpha/wP.svg',
    wn: '/piece/alpha/wN.svg',
    wb: '/piece/alpha/wB.svg',
    wr: '/piece/alpha/wR.svg',
    wq: '/piece/alpha/wQ.svg',
    wk: '/piece/alpha/wK.svg',
    bp: '/piece/alpha/bP.svg',
    bn: '/piece/alpha/bN.svg',
    bb: '/piece/alpha/bB.svg',
    br: '/piece/alpha/bR.svg',
    bq: '/piece/alpha/bQ.svg',
    bk: '/piece/alpha/bK.svg',
  },
  staunton: {
    wp: '/piece/staunton/wP.svg',
    wn: '/piece/staunton/wN.svg',
    wb: '/piece/staunton/wB.svg',
    wr: '/piece/staunton/wR.svg',
    wq: '/piece/staunton/wQ.svg',
    wk: '/piece/staunton/wK.svg',
    bp: '/piece/staunton/bP.svg',
    bn: '/piece/staunton/bN.svg',
    bb: '/piece/staunton/bB.svg',
    br: '/piece/staunton/bR.svg',
    bq: '/piece/staunton/bQ.svg',
    bk: '/piece/staunton/bK.svg',
  },
};

// Chess pieces as case items
const getCaseItems = (pieceStyle: string): CaseItem[] => [
  { id: 'wp', name: 'White Pawn', image: pieceMaps[pieceStyle].wp },
  { id: 'bp', name: 'Black Pawn', image: pieceMaps[pieceStyle].bp },
  { id: 'wn', name: 'White Knight', image: pieceMaps[pieceStyle].wn },
  { id: 'bn', name: 'Black Knight', image: pieceMaps[pieceStyle].bn },
  { id: 'wb', name: 'White Bishop', image: pieceMaps[pieceStyle].wb },
  { id: 'bb', name: 'Black Bishop', image: pieceMaps[pieceStyle].bb },
  { id: 'wr', name: 'White Rook', image: pieceMaps[pieceStyle].wr },
  { id: 'br', name: 'Black Rook', image: pieceMaps[pieceStyle].br },
  { id: 'wq', name: 'White Queen', image: pieceMaps[pieceStyle].wq },
  { id: 'bq', name: 'Black Queen', image: pieceMaps[pieceStyle].bq },
  { id: 'wk', name: 'White King', image: pieceMaps[pieceStyle].wk },
  { id: 'bk', name: 'Black King', image: pieceMaps[pieceStyle].bk },
];

// Function to generate a random chess piece
const getRandomItem = (caseItems: CaseItem[]): CaseItem => {
  return caseItems[Math.floor(Math.random() * caseItems.length)];
};

const casePlaceholder = {
  name: 'Mystery Case',
  image: 'https://images.oki.gg/?url=https%3A%2F%2Fraw.githubusercontent.com%2FByMykel%2Fcounter-strike-image-tracker%2Fmain%2Fstatic%2Fpanorama%2Fimages%2Fecon%2Fweapon_cases%2Fcrate_community_29_png.png&w=128&h=97',
};

const CaseOpening: React.FC<CaseOpeningProps> = ({ pieceStyle, onFinish }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CaseItem | null>(null);
  const [animationItems, setAnimationItems] = useState<CaseItem[]>([]);
  const controls = useAnimation();
  const caseItems = getCaseItems(pieceStyle);

  const handleOpenCase = async () => {
    if (isOpening) return;
    setIsOpening(true);
    setSelectedItem(null);

    // Generate a sequence of items for the animation
    const newAnimationItems = Array(30)
      .fill(0)
      .map(() => caseItems[Math.floor(Math.random() * caseItems.length)]);
    const finalItem = getRandomItem(caseItems);
    newAnimationItems.push(finalItem);
    setAnimationItems(newAnimationItems);

    // Animation sequence
    await controls.start({
      x: [-100 * newAnimationItems.length, 0],
      transition: {
        x: {
          duration: 6, // Mimics CS2's ~6-second animation
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.7, 0.9, 1], // Slow down near the end
        },
      },
    });

    setSelectedItem(finalItem);
    onFinish({ id: finalItem.id, name: finalItem.name });
    setIsOpening(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {!isOpening && !selectedItem && (
        <>
          <Image
            src={casePlaceholder.image}
            alt={casePlaceholder.name}
            width={256}
            height={256}
            className="w-64 h-64 object-contain rounded-lg"
          />
          <p className="mt-4 text-lg font-semibold">{casePlaceholder.name}</p>
          <motion.button
            className="mt-4 px-4 py-2 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-400 transition"
            onClick={handleOpenCase}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Case
          </motion.button>
        </>
      )}
      {isOpening && (
        <motion.div
          className="w-full h-32 bg-gray-800 rounded-lg overflow-hidden relative flex items-center"
          style={{ perspective: 1000 }}
        >
          <motion.div
            className="flex"
            animate={controls}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            {animationItems.concat(selectedItem || caseItems[0]).map((item: CaseItem, index: number) => (
              <motion.div
                key={index}
                className="w-32 h-24 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center mx-1"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
          {/* Center highlight */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-24 border-4 border-lime-500 rounded" />
          </div>
        </motion.div>
      )}
      {selectedItem && !isOpening && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <Image
            src={selectedItem.image}
            alt={selectedItem.name}
            width={256}
            height={256}
            className="w-64 h-64 object-contain rounded-lg"
          />
          <p className="mt-4 text-lg font-semibold">{selectedItem.name}</p>
          <motion.button
            className="mt-4 px-4 py-2 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-400 transition"
            onClick={handleOpenCase}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Another Case
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CaseOpening;