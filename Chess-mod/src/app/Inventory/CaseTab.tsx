'use client';

import React, { useState } from 'react';
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

  const handleOpenCase = async () => {
    if (isOpening || selectedCaseIndex === null || caseCount === 0) {
      console.log('Cannot open case:', { isOpening, selectedCaseIndex, caseCount });
      return;
    }

    setIsOpening(true);
    console.log('Opening case:', selectedCaseIndex);

    try {
      const response = await fetch('/api/spin-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ caseIndex: selectedCaseIndex }),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (data.selectedSkin) {
        setTimeout(() => {
          onFinish(data.selectedSkin);
          setSelectedCaseIndex(null);
          setIsOpening(false);
        }, 2000);
      } else {
        setIsOpening(false);
      }
    } catch (error) {
      console.error('Error spinning case:', error);
      setIsOpening(false);
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
        <div
          className="flex flex-col items-center cursor-pointer"
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
          <p className="text-lg mt-4">Mystery Case</p>
        </div>
      )}
    </div>
  );
};

export default CaseTab;