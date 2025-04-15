'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Profile.module.css';

interface User {
  username: string;
  email: string;
  wallet_address: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

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
        .catch((err) => {
          setError('Failed to load user data');
        });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear session
    router.push('/login');
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
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
            <span className={styles.label}>Wallet Address:</span>{' '}
            {user.wallet_address ? user.wallet_address : 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;