'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChessInstance, Chess } from 'chess.js';
import { motion } from 'framer-motion';
import ChessBoard from './ChessBoard';
import ChessClock from './ChessClock';
import EndGameModal from './EndGameModal';
import { Style, NFTJson } from './types';
import styles from './Game.module.css';

// Hardcoded NFT JSON (replace with fetch later)
const nftJson: NFTJson | null = null; // Test default case

// For testing purposes, easily removable
const IS_TESTING = true;

export default function GamePage() {
  const [game, setGame] = useState<ChessInstance>(() => new Chess());
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pieceStyles, setPieceStyles] = useState<Style[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('alpha');
  const [boardColor, setBoardColor] = useState<string | null>(null);
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes in seconds
  const [blackTime, setBlackTime] = useState(600);
  const [gameEnded, setGameEnded] = useState<string | null>(null); // 'white', 'black', 'draw', or null

  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);

  // Fetch styles
  useEffect(() => {
    async function fetchStyles() {
      try {
        const response = await fetch('/api/styles');
        const data = await response.json();
        if (data.success) {
          setPieceStyles(data.styles);
        }
      } catch (error) {
        console.error('Error fetching styles:', error);
      }
    }
    fetchStyles();
  }, []);

  // Set NFT styles
  useEffect(() => {
    if (!nftJson) {
      setSelectedStyle('alpha');
      setBoardColor(null);
      return;
    }
    const styleAttr = nftJson.attributes.find((attr) => attr.trait_type === 'Style');
    const colorAttr = nftJson.attributes.find((attr) => attr.trait_type === 'Color');
    setSelectedStyle(typeof styleAttr?.value === 'string' ? styleAttr.value : 'alpha');
    setBoardColor(typeof colorAttr?.value === 'string' ? colorAttr.value : null);
  }, []);

  // Initialize sounds
  useEffect(() => {
    moveSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3');
    captureSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3');
    winSound.current = new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/notify.mp3');
  }, []);

  // Handle clock
  useEffect(() => {
    if (gameEnded) return;
    const timer = setInterval(() => {
      if (isWhiteTurn) {
        setWhiteTime((prev) => {
          if (prev <= 0 && !gameEnded) {
            setGameEnded('black');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 0 && !gameEnded) {
            setGameEnded('white');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isWhiteTurn, gameEnded]);

  const handleBackClick = useCallback(() => {
    if (confirm('Leaving the game will end it with no winner. Are you sure?')) {
      window.location.href = '/GameCollection';
    }
  }, []);

  const resetGame = useCallback(() => {
    setGame(new Chess());
    setIsWhiteTurn(true);
    setError(null);
    setGameEnded(null);
    setWhiteTime(600);
    setBlackTime(600);
  }, []);

  // Testing function to manually set winner
  const setWinnerForTesting = (winner: 'white' | 'black') => {
    setGameEnded(winner);
    winSound.current?.play().catch(() => {});
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <motion.button
          className={styles.backButton}
          onClick={handleBackClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          1v1 Offline
        </motion.h2>
        <div className={styles.placeholder} />
      </div>

      <div className={styles.styleSelector}>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className={styles.styleDropdown}
        >
          {pieceStyles.map((style) => (
            <option key={style.name} value={style.name}>
              {style.name}
            </option>
          ))}
        </select>
      </div>

      <ChessClock whiteTime={whiteTime} blackTime={blackTime} isWhiteTurn={isWhiteTurn} />

      <ChessBoard
        game={game}
        setGame={setGame}
        isWhiteTurn={isWhiteTurn}
        setIsWhiteTurn={setIsWhiteTurn}
        setError={setError}
        pieceStyles={pieceStyles}
        selectedStyle={selectedStyle}
        boardColor={boardColor}
        moveSound={moveSound}
        captureSound={captureSound}
        winSound={winSound}
        setGameEnded={setGameEnded}
      />

      {IS_TESTING && (
        <div className={styles.testButtons} style={{ zIndex: 2 }}>
          <button onClick={() => setWinnerForTesting('white')}>Test White Wins</button>
          <button onClick={() => setWinnerForTesting('black')}>Test Black Wins</button>
        </div>
      )}

      {error && (
        <motion.div
          className={styles.error}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          style={{ zIndex: 2 }}
        >
          {error}
        </motion.div>
      )}

      {gameEnded && (
        <EndGameModal
          winner={gameEnded}
          onPlayAgain={resetGame}
          onBackToMenu={() => (window.location.href = '/GameCollection')}
        />
      )}
    </main>
  );
}