'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { FaHome } from 'react-icons/fa'; // Added home icon

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',  // Ensure the correct content type
      },
    });
  
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      // Optionally, navigate to a login page or show success message
    } else if (res.status === 409) {
      alert('Username already taken, please choose another one.');
    } else {
      const data = await res.json();
      console.error(data);
      alert('Error creating user. Please try again later.');
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative">
      {/* Home Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-lg transition duration-200"
      >
        <FaHome size={20} />
        <span className="text-sm font-semibold">Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Create Account
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}