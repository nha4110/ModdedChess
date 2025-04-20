import React from 'react';
import { motion } from 'framer-motion';
import CaseOpening from './components/CaseOpener';
import { SkinOption } from './types';

interface CaseOpeningWrapperProps {
  pieceStyle: string;
  onFinish: (item: SkinOption) => void;
}

export default function CaseOpeningWrapper({ pieceStyle, onFinish }: CaseOpeningWrapperProps) {
  return (
    <motion.div
      key="case-opening"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <CaseOpening pieceStyle={pieceStyle} onFinish={onFinish} />
    </motion.div>
  );
}