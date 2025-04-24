'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Button styles for consistency
  const buttonStyles = `
    w-56 px-6 py-3 rounded-xl text-lg font-semibold text-[#4b4b4b]
    bg-gradient-to-r from-[#f7facc] to-[#e5e09b]
    hover:from-[#ecefa9] hover:to-[#d6cf77]
    shadow-md hover:shadow-lg
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-[#6f624a]/50
    font-[Arial,Helvetica,sans-serif]
    text-center
    block
  `;

  const authButtonStyles = `
    px-4 py-2 rounded-full text-sm font-semibold text-white
    bg-gradient-to-r from-green-400 to-lime-500
    hover:from-green-500 hover:to-lime-600
    shadow-md hover:shadow-lg
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-green-400/50
    font-[Arial,Helvetica,sans-serif]
    text-center
    block
  `;

  // Check if the user is signed in on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsSignedIn(true);
    }
  }, []);

  return (
    <main
      className="min-h-screen bg-cover bg-center text-[#f5f5dc] p-4 relative overflow-hidden isolate"
      style={{
        backgroundImage: `url('/bg3.gif')`,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Top-right User Dropdown */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          {isSignedIn ? (
            <>
              <FaUserCircle
                size={28}
                className="cursor-pointer text-[#f5f5dc] hover:text-[#f5f5dc]/80 transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#6f624a]/95 rounded-lg shadow-lg z-10 text-sm backdrop-blur-sm">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-[#6f624a]/70 text-[#f5f5dc] rounded-t-lg font-[Arial,Helvetica,sans-serif]"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/Inventory"
                    className="block px-4 py-2 hover:bg-[#6f624a]/70 text-[#f5f5dc] font-[Arial,Helvetica,sans-serif]"
                  >
                    Inventory
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#6f624a]/70 text-[#f5f5dc] rounded-b-lg font-[Arial,Helvetica,sans-serif]"
                    onClick={() => {
                      localStorage.removeItem('userId'); // Remove the userId from localStorage
                      setIsSignedIn(false); // Update the signed-in state
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/signup" className={authButtonStyles}>
                Sign Up
              </Link>
              <Link href="/login" className={authButtonStyles}>
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Centered Title and Buttons */}
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-6xl md:text-7xl font-bold text-center text-[#2cdd0c] drop-shadow-md"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Modded Chess
        </motion.h1>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/GameCollection" className={buttonStyles}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-full h-full flex items-center justify-center"
            >
              Play
            </motion.div>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={buttonStyles}
          >
            Option
          </motion.button>

          <Link href="/Inventory" className={buttonStyles}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-full h-full flex items-center justify-center"
            >
              Inventory
            </motion.div>
          </Link>

          <Link href="/Shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={buttonStyles}
            >
              Shop
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Chess Board Preview */}
      <div className="absolute bottom-8 right-8 z-0">
        <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-40 h-40 bg-gray-900/80 rounded-md p-0.5 backdrop-blur-sm">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className="w-full h-full"
              style={{
                backgroundColor: (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? '#FFF' : '#000',
              }}
            />
          ))}
        </div>

        <div className="flex justify-end mt-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl text-[#fff] drop-shadow-md"
          >
            ♞
          </motion.div>
        </div>

        <button className={authButtonStyles}>Preview Skin</button>
      </div>
    </main>
  );
}
