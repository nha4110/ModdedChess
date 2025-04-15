'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

// Define the Item type
interface ShopItem {
  id: number;
  name: string;
  image: string;
  price: string;
}

// List of shop items (more than 3 for scrolling)
const shopItems: ShopItem[] = [
  { id: 1, name: 'Classic Chess Set', image: '/shop-items/item1.png', price: '$29.99' },
  { id: 2, name: 'Blue Marble Board', image: '/shop-items/item2.png', price: '$39.99' },
  { id: 3, name: 'Purple Glass Pieces', image: '/shop-items/item3.png', price: '$19.99' },
  { id: 4, name: 'Golden Royal Set', image: '/shop-items/item4.png', price: '$49.99' },
  { id: 5, name: 'Dark Wood Board', image: '/shop-items/item5.png', price: '$34.99' },
  { id: 6, name: 'Neon Chess Pieces', image: '/shop-items/item6.png', price: '$24.99' },
];

export default function ChessShopPage() {
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle item click to open the modal
  const handleItemClick = (item: ShopItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle purchase confirmation
  const handleConfirmPurchase = () => {
    if (selectedItem) {
      alert(`You have purchased ${selectedItem.name} for ${selectedItem.price}!`);
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
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
        className={`flex flex-col items-center justify-center min-h-screen bg-[transparent] w-full px-6 ${
          isModalOpen ? 'blur-sm' : ''
        }`}
      >
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mb-8"
        >
          <h1 className="text-6xl font-extrabold text-center text-[#2cdd0c] drop-shadow-[0_0_20px_#2cdd0c] mb-4 font-[fantasy]">
            Chess Shop
          </h1>
          <div className="w-full h-[40vh] rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center overflow-hidden">
            <Image
              src="/chess-shop.png"
              alt="Chess Shop Banner"
              width={1200}
              height={400}
              className="object-cover rounded-2xl"
            />
          </div>
        </motion.div>

        {/* Items Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-6xl h-[40vh] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        >
          <div className="flex flex-row gap-6">
            {shopItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                onClick={() => handleItemClick(item)}
                className="flex-none w-64 h-full rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-4 flex flex-col items-center justify-between shadow-lg cursor-pointer"
              >
                {/* Item Name */}
                <h3 className="text-lg font-bold text-[#2cdd0c] drop-shadow-[0_0_4px_#2cdd0c] mb-2">
                  {item.name}
                </h3>

                {/* Item Image */}
                <div className="w-48 h-48 rounded-xl overflow-hidden mb-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </div>

                {/* Item Price */}
                <p className="text-md font-semibold text-lime-300">{item.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-8 text-lg font-semibold text-lime-300 hover:text-lime-400 transition-all duration-500 ease-in-out hover:underline hover:tracking-wider drop-shadow-[0_0_4px_#2cdd0c]"
        >
          ← Back to Menu
        </Link>
      </motion.div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-lg w-[500px] flex flex-col items-center"
          >
            <h3 className="text-3xl font-bold text-[#2cdd0c] drop-shadow-[0_0_4px_#2cdd0c] mb-6">
              Confirm Purchase
            </h3>
            {selectedItem && (
              <>
                <p className="text-xl text-white mb-4 text-center">
                  Do you want to buy <span className="text-[#2cdd0c]">{selectedItem.name}</span> for{' '}
                  <span className="text-lime-300">{selectedItem.price}</span>?
                </p>
                <div className="w-48 h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </div>
              </>
            )}
            <div className="flex gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmPurchase}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#2cdd0c] to-green-600 hover:from-green-600 hover:to-[#2cdd0c] text-white text-lg font-bold shadow-lg hover:shadow-green-500/60 transition-all duration-300"
              >
                Yes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseModal}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white text-lg font-bold shadow-lg hover:shadow-gray-500/60 transition-all duration-300"
              >
                No
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}