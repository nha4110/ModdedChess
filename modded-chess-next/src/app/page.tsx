'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-6xl font-bold mb-12"
      >
        Modded Chess
      </motion.h1>

      <Link href="/GameCollection">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg transition"
      >
        Play
      </motion.button>
    </Link>

    </main>
  );
}
