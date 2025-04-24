'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';
import styles from './Inventory.module.css';

interface SkinOption {
  id: string;
  name: string;
  image?: string;
}

interface CaseTabProps {
  activeTab: 'board' | 'piece' | 'case';
  pieceStyle: string;
  caseCount: number | null;
  selectedCaseIndex: number | null;
  setSelectedCaseIndex: (index: number | null) => void;
  onFinish: (item: SkinOption) => void;
  renderSidebar?: boolean;
}

const casePlaceholder: SkinOption = {
  id: 'case1',
  name: 'Mystery Case',
  image: 'https://images.oki.gg/?url=https%3A%2F%2Fraw.githubusercontent.com%2FByMykel%2Fcounter-strike-image-tracker%2Fmain%2Fstatic%2Fpanorama%2Fimages%2Fecon%2Fweapon_cases%2Fcrate_community_29_png.png&w=128&h=97',
};

// List of available NFTs from Pinata (IPFS CIDs)
const availableNFTs = [
  { name: 'PieceSet2-99412', metadataCid: 'QmRrDiNn1mLM6UjVwaqXnfR6PhfA55XFeYRkQXKArrRtns', imageCid: 'QmVLHnUTzzVjm3Z6EuxCnA8wdwH5v9UkF3zJXTuVadXKHC' },
  { name: 'PieceSet2-99195', metadataCid: 'QmRUqXFuAcZDr6ngegLxbSuUmY5MzjXgLi5xtnrPE6Ljhv', imageCid: 'QmeKYtWESGDMPuCshLWGkkRBnZh91pV5qK5yrCLMuVwWMB' },
  { name: 'PieceSet2-94251', metadataCid: 'QmawWtUM9EeLnkDzNwzR3eqUv39cqFXH8ssqVBsUGaRykp', imageCid: 'Qmasbw48dPK5GMyqv4jnNXLdDRPxe7RarMjT7dYnVFxdCA' },
  { name: 'PieceSet2-93098', metadataCid: 'QmdoW3BUgNBDR9izTuX2sygDW2HCh1vQiAcQQvPfro2AKj', imageCid: 'QmQXGrHtxysiCSgPzq5ZppfEhxVV5jexy2CFqafhCxtpSX' },
  { name: 'PieceSet2-87967', metadataCid: 'QmR5vJnxCo375Kw3uhgW6Keb6tJfTcQFsQ6CFRgBQkr3XY', imageCid: 'QmWsHpU3vb6QiXFwXpcWMB3GM9fz3W6CarumcxhuiBHGn8' },
];

const CaseTab: React.FC<CaseTabProps> = ({
  activeTab,
  pieceStyle,
  caseCount,
  selectedCaseIndex,
  setSelectedCaseIndex,
  onFinish,
  renderSidebar = false,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const { publicKey, connected, signTransaction } = useWallet();
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  const handleOpenCase = async () => {
    // Pre-checks
    if (!connected || !publicKey || !signTransaction) {
      alert('Please connect your wallet before opening the case.');
      return;
    }

    if (isOpening || selectedCaseIndex === null || caseCount === 0) {
      alert('Cannot open case. Please select a case and ensure you have cases available.');
      return;
    }

    setIsOpening(true);
    console.log('Opening case:', selectedCaseIndex);

    try {
      // Randomly select an NFT from the available list
      const randomIndex = Math.floor(Math.random() * availableNFTs.length);
      const selectedNFT = availableNFTs[randomIndex];
      const collectionName = 'PieceSet2';

      // Call the mint-nft API to get the transaction
      const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletPublicKey: publicKey.toBase58(),
          name: selectedNFT.name,
          metadataCid: selectedNFT.metadataCid,
          imageCid: selectedNFT.imageCid,
          collectionName: collectionName,
        }),
      });

      //if (!response.ok) {
        //throw new Error(`HTTP error! Status: ${response.status}`);
      //}

      const data = await response.json();
      console.log('Mint NFT response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to prepare transaction');
      }

      // Deserialize the transaction
      const transaction = Transaction.from(Buffer.from(data.transaction, 'base64'));

      // Sign and send the transaction with the user's wallet
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Transaction confirmed:', signature);

      // After transaction confirmation, store the metadata
      const confirmResponse = await fetch('/api/confirm-mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedNFT.name,
          metadataCid: selectedNFT.metadataCid,
          imageCid: selectedNFT.imageCid,
          collectionName: collectionName,
          transactionSignature: signature,
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error(`Failed to confirm mint: ${confirmResponse.status}`);
      }

      const confirmData = await confirmResponse.json();
      if (!confirmData.success) {
        throw new Error(confirmData.error || 'Failed to store NFT metadata');
      }

      // Simulate the "opening" animation delay
      setTimeout(() => {
        const newSkin: SkinOption = {
          id: selectedNFT.name,
          name: selectedNFT.name,
          image: `https://ipfs.io/ipfs/${selectedNFT.imageCid}`,
        };
        onFinish(newSkin);
        setSelectedCaseIndex(null);
        setIsOpening(false);
        alert(`Successfully minted ${selectedNFT.name} to your wallet! Transaction: ${signature}`);
      }, 2000);
    } catch (error) {
      console.error('Error opening case:', error);
      setIsOpening(false);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert('Failed to open case: ' + errorMessage);
    }
  };

  if (renderSidebar) {
    console.log('Rendering sidebar with caseCount:', caseCount);
    return (
      <div className={styles.caseGrid}>
        {caseCount !== null && caseCount > 0 ? (
          <>
            {Array.from({ length: caseCount }, (_, index) => (
              <div
                key={index}
                className={`${styles.caseItem} ${
                  selectedCaseIndex === index ? 'border-2 border-blue-400' : ''
                }`}
                onClick={() => {
                  console.log('Clicked case:', index);
                  setSelectedCaseIndex(index);
                }}
              >
                <img
                  src={casePlaceholder.image}
                  alt={`Case ${index + 1}`}
                  className="w-full h-auto object-contain"
                  style={{ maxWidth: '80px', maxHeight: '80px' }}
                  onError={(e) => {
                    console.error(`Failed to load case image: ${casePlaceholder.image}`);
                    e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='; // Gray placeholder
                  }}
                />
                <p className="text-center mt-2">Case {index + 1}</p>
              </div>
            ))}
            <p className="text-gray-400 text-center">
              Total cases rendered: {caseCount}
            </p>
          </>
        ) : (
          <p className="text-gray-400 text-center">No cases available</p>
        )}
      </div>
    );
  }

  console.log('Rendering main content with selectedCaseIndex:', selectedCaseIndex);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {caseCount === null ? (
        <p className="text-gray-400 text-lg">Loading...</p>
      ) : selectedCaseIndex === null || caseCount === 0 ? (
        <p className="text-gray-400 text-lg">No Case Selected</p>
      ) : (
        <div className="flex flex-col items-center">
          {!connected ? (
            <p className="text-red-500 text-lg mb-4">
              Please connect your wallet to open the Mystery Case. Click the wallet button in the header to connect.
            </p>
          ) : null}
          <div
            className={`flex flex-col items-center ${connected ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            onClick={handleOpenCase}
          >
            <img
              src={casePlaceholder.image}
              alt="Mystery Case"
              className="w-32 h-32 object-contain"
              onError={(e) => {
                console.error(`Failed to load case image: ${casePlaceholder.image}`);
                e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='; // Gray placeholder
              }}
            />
            <p className="text-lg mt-4">{isOpening ? 'Opening...' : 'Mystery Case'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTab;