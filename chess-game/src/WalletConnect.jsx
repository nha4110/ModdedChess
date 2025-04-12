// src/WalletConnect.jsx
import React, { useEffect, useState } from 'react';

const WalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error('Wallet connection error:', err);
      }
    } else {
      alert('Phantom Wallet not found. Please install it.');
    }
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then((res) => {
        setWalletAddress(res.publicKey.toString());
      });
    }
  }, []);

  return (
    <div>
      {walletAddress ? (
        <p>Connected: {walletAddress}</p>
      ) : (
        <button onClick={connectWallet}>Connect Phantom Wallet</button>
      )}
    </div>
  );
};

export default WalletConnect;
