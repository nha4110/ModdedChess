'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | '' }>({ text: '', type: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        router.push('/profile');
      } else {
        setMessage({ text: data.error || 'Login failed', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
    setMessage({ text: '', type: '' });
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        <FaHome size={20} />
        <span className="text-sm font-semibold">Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.card}
      >
        <h1 className={styles.title}>Welcome Back</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <motion.input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Enter your username"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Enter your password"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </div>

          {message.text && (
            <div className={`${styles.message} bg-red-500/20 text-red-300`}>
              {message.text}
            </div>
          )}

          <motion.button
            type="submit"
            className={styles.button}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Sign In
          </motion.button>

          <p className={styles.signupText}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className={styles.signupLink}>
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
