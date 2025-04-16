'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { toast, Toaster } from 'react-hot-toast';
import styles from './Profile.module.css';

interface User {
  username: string;
  email: string;
  wallet_address: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedWallet = localStorage.getItem('walletAddress');

    if (storedWallet) {
      setWalletAddress(storedWallet);
    }

    if (!userId) {
      router.push('/login');
    } else {
      fetch('/api/user', {
        method: 'GET',
        headers: {
          'user-id': userId,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setUser(data.user);
          }
        })
        .catch(() => {
          setError('Failed to load user data');
        });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('walletAddress');
    router.push('/login');
  };

  const connectWallet = async () => {
    try {
      const adapter = new PhantomWalletAdapter();
      await adapter.connect();

      if (!adapter.connected || !adapter.publicKey) {
        toast.error('Failed to connect to Phantom.');
        return;
      }

      const address = adapter.publicKey.toBase58();
      setWalletAddress(address);
      localStorage.setItem('walletAddress', address);

      toast.success(`Connected to: ${address}`);

      // Update wallet in database
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'user-id': userId,
          },
          body: JSON.stringify({ wallet_address: address }), // Correct key for wallet_address
        });

        const result = await response.json();
        if (result.error) {
          toast.error('Failed to update wallet in database.');
          console.error(result.error);
        } else {
          toast.success('Wallet saved to profile!');
        }
      }
    } catch {
      toast.error('Phantom not found or connection failed.');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem('walletAddress');
    toast.success('Wallet disconnected.');
  };

  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <div className={styles.navbar}>
        <button onClick={() => router.push('/')} className={styles.homeButton}>
          Home
        </button>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}></div>
          <h1 className={styles.username}>{user.username}</h1>
        </div>
        <div className={styles.details}>
          <p className={styles.detail}>
            <span className={styles.label}>Email:</span> {user.email}
          </p>
          <p className={styles.detail}>
            <span className={styles.label}>Wallet (DB):</span>{' '}
            {user.wallet_address || 'Not provided'}
          </p>
          <p className={styles.detail}>
            <span className={styles.label}>Wallet (Local):</span>{' '}
            {walletAddress || 'Not connected'}
          </p>
        </div>

        <div className={styles.walletActions}>
          {!walletAddress ? (
            <button onClick={connectWallet} className={styles.connectButton}>
              Connect Phantom Wallet
            </button>
          ) : (
            <button onClick={disconnectWallet} className={styles.removeButton}>
              Disconnect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
