'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GameSelector() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black text-white">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10"
      >
        Choose a Game Mode
      </motion.h2>

      <motion.div
        className="flex flex-col space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Link href="/Chess1v1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-semibold text-xl"
          >
            1v1 Offline
          </motion.button>
        </Link>

        {/* You can add more game modes here in the future */}
      </motion.div>

      <Link href="/" className="mt-12 text-sm text-gray-300 hover:text-white transition">
        ← Back to Menu
      </Link>
    </main>
  );
}
