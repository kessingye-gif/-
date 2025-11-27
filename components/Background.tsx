import React from 'react';
import { motion } from 'framer-motion';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-cream-100">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-cream-100/80" />

      {/* Floating Blobs - Using CSS blur for performance + Framer Motion for movement */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-soft-yellow/40 rounded-full blur-3xl opacity-60"
      />
      
      <motion.div
        animate={{
          x: [0, -70, 30, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-[20%] right-[-10%] w-80 h-80 bg-soft-green/50 rounded-full blur-3xl opacity-50"
      />

      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-soft-pink/40 rounded-full blur-3xl opacity-40"
      />
    </div>
  );
};