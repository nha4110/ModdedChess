'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isSignedIn = false; // Change to true when integrating auth

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6 relative overflow-hidden">
      {/* Top-right User Dropdown */}
      <div className="absolute top-6 right-6 z-20">
        <div className="relative">
          {isSignedIn ? (
            <>
              <FaUserCircle
                size={32}
                className="cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 rounded shadow-lg z-10 text-sm">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link>
                  <Link href="/inventory" className="block px-4 py-2 hover:bg-gray-700">Inventory</Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Sign Out</button>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-3">
              <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Sign Up</Link>
              <Link href="/login" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Log In</Link>
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
          className="text-6xl font-bold text-center text-gradient"
        >
          Modded Chess
        </motion.h1>

        <div className="flex flex-col gap-6">
          {/* Play Button - Navigate to GameCollection */}
          <Link href="/GameCollection">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl text-xl font-semibold shadow-lg"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Play
            </motion.button>
          </Link>

          {/* Option Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-xl font-semibold shadow-lg"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Option
          </motion.button>

          {/* Inventory Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl text-xl font-semibold shadow-lg"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Inventory
          </motion.button>

          {/* New Audition Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-10 py-4 rounded-xl text-xl font-semibold shadow-lg"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Audition
          </motion.button>
        </div>
      </div>

      {/* Chess Board Preview (bottom-right) */}
      <div className="absolute bottom-16 right-12 z-0">
        {/* Board */}
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-48 h-48 bg-gray-700 rounded-lg p-1">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className="w-full h-full flex items-center justify-center text-sm font-bold"
              style={{
                backgroundColor: (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? '#EEE' : '#444',
                color: (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? '#000' : '#FFF',
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
            className="text-6xl"
          >
            ♞
          </motion.div>
        </div>

        <p className="text-center mt-2 text-sm text-gray-400">Preview Skin</p>
      </div>
    </main>
  );
}
