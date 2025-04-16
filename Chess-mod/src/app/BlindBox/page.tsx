'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';


interface Item {
  id: number;
  name: string;
  color: string;
  hoverColor: string;
  shadow: string;
  image: string;
}

interface Box {
  id: number;
  image: string;
}

const items: Item[] = [
  { id: 1, name: 'Classic Board & Black Pieces', color: 'from-green-400 to-lime-500', hoverColor: 'hover:from-green-500 hover:to-lime-600', shadow: 'hover:shadow-lime-500/60', image: '/items/item1.png' },
  { id: 2, name: 'Blue Board & White Pieces', color: 'from-blue-500 to-cyan-400', hoverColor: 'hover:from-blue-600 hover:to-cyan-500', shadow: 'hover:shadow-cyan-400/60', image: '/items/item2.png' },
  { id: 3, name: 'Purple Board & Red Pieces', color: 'from-purple-500 to-pink-500', hoverColor: 'hover:from-purple-600 hover:to-pink-600', shadow: 'hover:shadow-pink-500/60', image: '/items/item3.png' },
  { id: 4, name: 'Golden Board & Silver Pieces', color: 'from-yellow-400 to-amber-500', hoverColor: 'hover:from-yellow-500 hover:to-amber-600', shadow: 'hover:shadow-amber-500/60', image: '/items/item4.png' },
  { id: 5, name: 'Dark Board & Neon Pieces', color: 'from-gray-700 to-gray-900', hoverColor: 'hover:from-gray-800 hover:to-black', shadow: 'hover:shadow-gray-900/60', image: '/items/item5.png' },
  { id: 6, name: 'Red Board & Gold Pieces', color: 'from-red-500 to-rose-500', hoverColor: 'hover:from-red-600 hover:to-rose-600', shadow: 'hover:shadow-rose-500/60', image: '/items/item6.png' },
  { id: 7, name: 'Emerald Board & White Pieces', color: 'from-emerald-500 to-teal-500', hoverColor: 'hover:from-emerald-600 hover:to-teal-600', shadow: 'hover:shadow-teal-500/60', image: '/items/item7.png' },
  { id: 8, name: 'Silver Board & Blue Pieces', color: 'from-gray-400 to-gray-600', hoverColor: 'hover:from-gray-500 hover:to-gray-700', shadow: 'hover:shadow-gray-600/60', image: '/items/item8.png' },
  { id: 9, name: 'Neon Board & Pink Pieces', color: 'from-pink-400 to-fuchsia-500', hoverColor: 'hover:from-pink-500 hover:to-fuchsia-600', shadow: 'hover:shadow-fuchsia-500/60', image: '/items/item9.png' },
  { id: 10, name: 'Obsidian Board & Green Pieces', color: 'from-gray-800 to-black', hoverColor: 'hover:from-gray-900 hover:to-black', shadow: 'hover:shadow-black/60', image: '/items/item10.png' },
];

const boxes: Box[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  image: `/boxes/box${i + 1}.png`,
}));

export default function ItemBoxPage() {
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [revealedItem, setRevealedItem] = useState<Item | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Item[]>(items.slice(0, 5));
  const controls = useAnimation();

  const handleBoxSelect = (box: Box) => {
    setSelectedBox(box);
    setRevealedItem(null);
  };

  const handleSpin = async () => {
    if (!selectedBox || isSpinning) return;

    setIsSpinning(true);
    setRevealedItem(null);

    const totalSpins = 50;
    const spinDuration = 5;
    let currentIndex = 0;

    for (let i = 0; i < totalSpins; i++) {
      currentIndex = (currentIndex + 1) % items.length;
      const newVisible = [];
      for (let j = 0; j < 5; j++) {
        newVisible.push(items[(currentIndex + j) % items.length]);
      }
      setVisibleItems(newVisible);
      const delay = (spinDuration * 1000 * (i + 1)) / totalSpins;
      await new Promise((resolve) => setTimeout(resolve, delay / 10));
    }

    const finalItem = items[Math.floor(Math.random() * items.length)];
    setVisibleItems([finalItem, ...items.slice(0, 4)]);
    setRevealedItem(finalItem);
    setIsSpinning(false);
  };

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen text-white"
      style={{
        backgroundImage: `url('/bg4.gif')`,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-screen bg-[transparent] w-full"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute top-5 text-6xl font-extrabold text-center text-[#2cdd0c] drop-shadow-[0_0_20px_#2cdd0c] mb-16 font-[fantasy]"
        >
          🎁 Spin Your Item Box
        </motion.h2>

        <div className="absolute top-25 flex flex-row w-full max-w-7xl">
          <motion.div
            className="w-[35%] bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-2xl shadow-lg h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {boxes.map((box) => (
                <motion.button
                  key={box.id}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  onClick={() => handleBoxSelect(box)}
                  className={`w-full h-40 rounded-xl bg-gradient-to-br from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white text-lg font-bold shadow-lg hover:shadow-lime-500/60 transition-all duration-300 ease-in-out tracking-wide flex items-center justify-center relative ${
                    selectedBox?.id === box.id ? 'ring-4 ring-[#2cdd0c]' : ''
                  }`}
                >
                  <Image
                    src={box.image}
                    alt={`Box ${box.id}`}
                    width={160}
                    height={160}
                    className="object-cover rounded-xl"
                  />
                  <span className="absolute bottom-2 text-sm font-semibold">Box {box.id}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="w-[65%] flex flex-col items-center gap-6 pl-8">
            <motion.div
              className="w-[400px] h-[300px] rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {revealedItem ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={revealedItem.image}
                    alt={revealedItem.name}
                    width={400}
                    height={300}
                    className="object-cover rounded-2xl"
                  />
                </motion.div>
              ) : selectedBox ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={selectedBox.image}
                    alt={`Box ${selectedBox.id}`}
                    width={400}
                    height={300}
                    className="object-cover rounded-2xl"
                  />
                </motion.div>
              ) : (
                <span className="text-xl font-bold">Select a Box</span>
              )}
            </motion.div>

            <motion.div
              className="relative w-[800px] h-[200px] rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex flex-row gap-2 pl-8"
                animate={controls}
              >
                {visibleItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`w-40 h-40 rounded-xl bg-gradient-to-br ${item.color} ${item.hoverColor} text-white text-xs font-bold shadow-lg ${item.shadow} flex items-center justify-center transition-all duration-300 ease-in-out ${
                      index === 0 && revealedItem ? 'ring-4 ring-[#2cdd0c]' : ''
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover rounded-xl"
                    />
                  </motion.div>
                ))}
              </motion.div>

              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-[#2cdd0c]"></div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              onClick={handleSpin}
              disabled={!selectedBox || isSpinning}
              className={`w-32 h-12 rounded-xl bg-gradient-to-br from-[#2cdd0c] to-green-600 hover:from-green-600 hover:to-[#2cdd0c] text-white text-lg font-bold shadow-lg hover:shadow-green-500/60 transition-all duration-300 ease-in-out tracking-wide flex items-center justify-center mt-4 ${
                (!selectedBox || isSpinning) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSpinning ? 'Spinning...' : 'Open'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
