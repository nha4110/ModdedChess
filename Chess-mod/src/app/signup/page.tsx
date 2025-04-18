'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: '', type: '' }); // Clear message on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' }); // Clear previous message

    const res = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      setMessage({ text: 'User created successfully! Redirecting to login...', type: 'success' });
      setTimeout(() => {
        router.push('/login');
      }, 1500); // Redirect after 1.5 seconds to allow user to see the message
    } else {
      const data = await res.json();
      setMessage({ text: data.error || 'Error creating user. Please try again later.', type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative">
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
          {message.text && (
            <div
              className={`text-sm text-center p-2 rounded-lg ${
                message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}
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