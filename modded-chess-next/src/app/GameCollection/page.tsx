'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GameSelector() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen text-white"
      style={{
        backgroundImage: `url('/bg4.gif')`, // Replace with your image path
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-screen px-6 bg-[transparent]"
      >
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-extrabold text-center text-[#2cdd0c] drop-shadow-[0_0_20px_#2cdd0c] mb-16 font-[fantasy]"
        >
          🎮 Choose Your Mode
        </motion.h2>

        {/* Game Modes */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* 1v1 Offline */}
          <Link href="/Chess1v1">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-64 h-40 rounded-2xl bg-gradient-to-br from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white text-2xl font-bold shadow-lg hover:shadow-lime-500/60 transition-all duration-300 ease-in-out tracking-wide flex items-center justify-center"
            >
              🧑‍🤝‍🧑 1v1 Offline
            </motion.button>
          </Link>

          {/* Bot Match */}
          <Link href="/Bot">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-64 h-40 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white text-2xl font-bold shadow-lg hover:shadow-cyan-400/60 transition-all duration-300 ease-in-out tracking-wide flex items-center justify-center"
            >
              🤖 Bot Match
            </motion.button>
          </Link>

          {/* Adventure Mode */}
          <Link href="/Adventure">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-64 h-40 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-2xl font-bold shadow-lg hover:shadow-pink-500/60 transition-all duration-300 ease-in-out tracking-wide flex items-center justify-center"
            >
              🗺️ Adventure
            </motion.button>
          </Link>
        </motion.div>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-20 text-lg font-semibold text-lime-300 hover:text-lime-400 transition-all duration-500 ease-in-out hover:underline hover:tracking-wider drop-shadow-[0_0_4px_#2cdd0c]"
        >
          ← Back to Menu
        </Link>


      </motion.div>


    </main>
  );
}
