'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isSignedIn = false; // Change to true when integrating auth

  return (
    <main
      className="min-h-screen bg-cover bg-center text-[#f5f5dc] p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url('/bg3.gif')`, // Replace with your image path
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Top-right User Dropdown */}
      <div className="absolute top-6 right-6 z-20">
        <div className="relative">
          {isSignedIn ? (
            <>
              <FaUserCircle
                size={32}
                className="cursor-pointer text-[#f5f5dc] hover:text-[#f5f5dc]/80"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-[#6f624a]/90 rounded shadow-lg z-10 text-sm backdrop-blur-sm">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-[#6f624a]/70 text-[#f5f5dc]">Profile</Link>
                  <Link href="/inventory" className="block px-4 py-2 hover:bg-[#6f624a]/70 text-[#f5f5dc]">Inventory</Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-[#6f624a]/70 text-[#f5f5dc]">Sign Out</button>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/signup"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-green-400 to-lime-500 text-white font-semibold shadow-md hover:from-green-500 hover:to-lime-600 hover:scale-105 transition duration-300 ease-in-out"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-green-400 to-lime-500 text-white font-semibold shadow-md hover:from-green-500 hover:to-lime-600 hover:scale-105 transition duration-300 ease-in-out"
              >
                Log In
              </Link>
            </div>

          )}
        </div>
      </div>

      {/* Centered Title and Buttons */}
      <div className="flex flex-col items-center justify-center h-full gap-6 z-10 pt-24">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-8xl font-bold text-center text-[#2cdd0c] drop-shadow-lg font-[cursive]"
        >
          Modded Chess
        </motion.h1>

        <div className="flex flex-col gap-6">
          {/* Play Button - Navigate to GameCollection */}
          <Link href="/GameCollection">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 15 }}
              className="w-60 px-10 py-4 rounded-2xl text-xl font-bold text-[#4b4b4b] bg-gradient-to-r from-[#f7facc] to-[#e5e09b] hover:from-[#ecefa9] hover:to-[#d6cf77] shadow-xl shadow-[#6f624a]/40 hover:shadow-[#6f624a]/60 transition duration-300 ease-in-out tracking-wide"
            >
              Play
            </motion.button>

          </Link>

          {/* Option Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
            className="w-60 px-10 py-4 rounded-2xl text-xl font-bold text-[#4b4b4b] bg-gradient-to-r from-[#f7facc] to-[#e5e09b] hover:from-[#ecefa9] hover:to-[#d6cf77] shadow-xl shadow-[#6f624a]/40 hover:shadow-[#6f624a]/60 transition duration-300 ease-in-out tracking-wide"
          >
            Option
          </motion.button>

          {/* Inventory Button */}
          <Link href="/Inventory">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 15 }}
              className="w-60 px-10 py-4 rounded-2xl text-xl font-bold text-[#4b4b4b] bg-gradient-to-r from-[#f7facc] to-[#e5e09b] hover:from-[#ecefa9] hover:to-[#d6cf77] shadow-xl shadow-[#6f624a]/40 hover:shadow-[#6f624a]/60 transition duration-300 ease-in-out tracking-wide"
            >
              Inventory
            </motion.button>
          </Link>

          {/* New Audition Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
            className="w-60 px-10 py-4 rounded-2xl text-xl font-bold text-[#4b4b4b] bg-gradient-to-r from-[#f7facc] to-[#e5e09b] hover:from-[#ecefa9] hover:to-[#d6cf77] shadow-xl shadow-[#6f624a]/40 hover:shadow-[#6f624a]/60 transition duration-300 ease-in-out tracking-wide"
          >
            Audition
          </motion.button>
        </div>
      </div>

      {/* Chess Board Preview (bottom-right) */}
      <div className="absolute bottom-16 right-12 z-0">
        {/* Board */}
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-48 h-48 bg-gray-900/80 rounded-lg p-1 backdrop-blur-sm">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className="w-full h-full flex items-center justify-center text-sm font-bold"
              style={{
                backgroundColor: (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? '#FFF' : '#000', // Black and white chessboard
                color: (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? '#000' : '#FFF', // Black text on white squares, white on black
              }}
            >
              {i === 5 && ''}
            </div>
          ))}
        </div>

        {/* Piece floating slightly to the right of the 4x4 board */}
        <div className="flex justify-end mt-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl text-[#fff] drop-shadow-lg"
          >
            ♞
          </motion.div>
        </div>

        <button className="text-sm mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-400 to-lime-500 text-white font-semibold shadow-md hover:from-green-500 hover:to-lime-600 hover:scale-105 transition duration-300 ease-in-out">
          Preview Skin
        </button>

      </div>
    </main>
  );
}