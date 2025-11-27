import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={onClick ? { scale: 1.02, y: -5 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        bg-white/40 backdrop-blur-xl 
        border border-white/60 
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        rounded-[32px] 
        p-6 
        relative overflow-hidden
        transition-colors
        ${className}
      `}
    >
      {/* Subtle shine effect on top right */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none" />
      {children}
    </motion.div>
  );
};