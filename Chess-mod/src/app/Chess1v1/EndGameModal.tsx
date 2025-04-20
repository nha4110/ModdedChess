'use client';

import { motion } from 'framer-motion';
import styles from './Game.module.css';
import { recordGameOutcome } from '../../utils/gameOutcome';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface EndGameModalProps {
  winner: string | null;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const NOTIFICATION_TIMEOUT = 4000;

export default function EndGameModal({ winner, onPlayAgain, onBackToMenu }: EndGameModalProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const hasRecordedRef = useRef(false);
  const router = useRouter();

  const message =
    winner === 'white' ? 'White Wins!' :
    winner === 'black' ? 'Black Wins!' :
    "It's a Draw!";

  useEffect(() => {
    let isCancelled = false;

    const showTempNotification = (message: string) => {
      setNotificationMessage(message);
      setShowNotification(true);
      setTimeout(() => {
        if (!isCancelled) setShowNotification(false);
      }, NOTIFICATION_TIMEOUT);
    };

    if (winner !== null && !hasRecordedRef.current) {
      const token = localStorage.getItem('token');

      if (!token) {
        showTempNotification('Log in to earn a chest!');
        return;
      }

      hasRecordedRef.current = true;

      recordGameOutcome({ gameMode: 'Chess1v1', winner })
        .then(() => {
          showTempNotification('You received a chest!');
        })
        .catch(() => {
          showTempNotification('Failed to award chest. Please try again.');
          hasRecordedRef.current = false;
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [winner]);

  useEffect(() => {
    if (winner === null) hasRecordedRef.current = false;
  }, [winner]);

  return (
    <motion.div
      className={styles.endGameModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.endGameContent}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.endGameTitle}>{message}</h2>

        {showNotification && (
          <p className={styles.chestNotification}>{notificationMessage}</p>
        )}

        <div className={styles.endGameButtons}>
        <div className={styles.chestReceivedContainer}>
            <Image
              src="https://images.oki.gg/?url=https%3A%2F%2Fraw.githubusercontent.com%2FByMykel%2Fcounter-strike-image-tracker%2Fmain%2Fstatic%2Fpanorama%2Fimages%2Fecon%2Fweapon_cases%2Fcrate_community_29_png.png&w=128&h=97"
              alt="Chest"
              width={128} 
              height={97} 
              className={styles.chestImage}
            />
            <p className={styles.chestReceivedText}>
              You have received a chest in your inventory.
            </p>
            <button
              onClick={() => router.push('/Inventory')}
              className={styles.endGameButton}
            >
              Go to Inventory
            </button>
        </div>

          <button onClick={onPlayAgain} className={styles.endGameButton}>
            Play Again
          </button>
          <button onClick={onBackToMenu} className={styles.endGameButton}>
            Back to Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
