
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AppView } from '../types';
import { Card } from '../components/Card';

interface GameProps {
  onNavigate: (view: AppView) => void;
  onSaveResult: (ms: number) => void;
}

type GameState = 'IDLE' | 'WAITING' | 'READY' | 'CLICKED' | 'FINISHED';

// Particle definition for explosion
interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  size: number;
  color: string;
}

export const Game: React.FC<GameProps> = ({ onNavigate, onSaveResult }) => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [rounds, setRounds] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [message, setMessage] = useState("看到发光就点我！✨");
  
  // Particle State
  const [particles, setParticles] = useState<Particle[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_ROUNDS = 5;

  const startRound = useCallback(() => {
    setGameState('WAITING');
    setMessage("嘘... 屏住呼吸... 🤫");
    
    // Random delay between 2s and 5s
    const delay = Math.random() * 3000 + 2000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('READY');
      setStartTime(Date.now());
      setMessage("就是现在！🔥");
    }, delay);
  }, []);

  const handleIdleClick = () => {
    startRound();
  };

  const handleWaitingClick = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage("哎呀，抢跑啦！再试一次 🐢");
    setGameState('IDLE');
  };

  const createExplosion = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const colors = ['#FCE8A7', '#E7F1E9', '#F3EDEE', '#FFFFFF'];
    
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        angle: (i / 12) * 360,
        velocity: Math.random() * 4 + 2,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => setParticles([]), 800);
  };

  const handleReadyClick = (e: React.MouseEvent | React.TouchEvent) => {
    const endTime = Date.now();
    const reactionTime = endTime - startTime;
    
    // Create particles at click position (approximate center for touch)
    // For simplicity in this demo, exploding from center of container
    createExplosion(0, 0);

    setGameState('CLICKED');
    const newRounds = [...rounds, reactionTime];
    setRounds(newRounds);
    setMessage(`${reactionTime} 毫秒! ⚡️`);
    onSaveResult(reactionTime);

    if (newRounds.length >= MAX_ROUNDS) {
      setTimeout(() => setGameState('FINISHED'), 1000);
    } else {
      setTimeout(() => startRound(), 1500);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Calculate Average
  const average = rounds.length > 0 ? Math.round(rounds.reduce((a, b) => a + b, 0) / rounds.length) : 0;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('GAME_LIST')}
          className="p-2 bg-white/50 backdrop-blur rounded-full text-stone-500"
        >
          <X size={24} />
        </button>
        <div className="font-bold text-stone-500 bg-white/40 px-4 py-1 rounded-full backdrop-blur">
          第 {Math.min(rounds.length + 1, MAX_ROUNDS)} / {MAX_ROUNDS} 关
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* Instructions / Feedback */}
        <div className="absolute top-1/4 w-full text-center pointer-events-none z-20 px-6">
           <motion.h2 
             key={message}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-2xl font-bold text-stone-600"
           >
             {message}
           </motion.h2>
        </div>

        {/* Interactive Target */}
        <div className="relative w-full h-96 flex items-center justify-center">
            
            {/* Particles Render */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ 
                    x: Math.cos(p.angle * Math.PI / 180) * 100 * (Math.random() + 0.5), 
                    y: Math.sin(p.angle * Math.PI / 180) * 100 * (Math.random() + 0.5),
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute rounded-full blur-[2px]"
                  style={{ 
                    width: p.size, 
                    height: p.size, 
                    backgroundColor: p.color,
                  }}
                />
              ))}
            </AnimatePresence>

            {gameState === 'FINISHED' ? (
              <Card className="w-64 text-center z-30">
                <h3 className="text-xl font-bold text-stone-600 mb-2">特训完成啦！🎉</h3>
                <div className="text-4xl font-extrabold text-soft-greenText mb-4">{average} <span className="text-base font-normal text-stone-400">平均毫秒</span></div>
                <button 
                  onClick={() => onNavigate('RESULTS')}
                  className="w-full py-3 bg-soft-green text-stone-600 font-bold rounded-2xl hover:bg-green-100 transition"
                >
                  看看成绩单 👀
                </button>
              </Card>
            ) : (
              /* The Orb */
              <motion.button
                layout
                whileTap={{ scale: 0.9 }}
                animate={
                  gameState === 'READY' ? { 
                    scale: [1, 1.1, 1],
                    boxShadow: "0 0 40px 10px rgba(252, 232, 167, 0.6)" // Glow
                  } : gameState === 'WAITING' ? {
                    scale: [1, 1.05, 1], // Breathing
                  } : {}
                }
                transition={
                  gameState === 'READY' ? { repeat: Infinity, duration: 0.5 } :
                  gameState === 'WAITING' ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}
                }
                onClick={
                   gameState === 'IDLE' ? handleIdleClick :
                   gameState === 'WAITING' ? handleWaitingClick :
                   gameState === 'READY' ? handleReadyClick : undefined
                }
                className={`
                  w-48 h-48 rounded-full z-10 transition-colors duration-300 backdrop-blur-md border-4 border-white/40
                  ${gameState === 'IDLE' ? 'bg-white/30 text-stone-400' : ''}
                  ${gameState === 'WAITING' ? 'bg-soft-pink/40 border-soft-pink/60' : ''}
                  ${gameState === 'READY' ? 'bg-soft-yellow border-white cursor-pointer' : ''}
                  ${gameState === 'CLICKED' ? 'bg-white scale-110' : ''}
                `}
              >
                {gameState === 'IDLE' && <span className="text-lg font-bold tracking-wide">开始</span>}
                {gameState === 'READY' && <div className="w-full h-full rounded-full bg-white/20 animate-ping" />}
              </motion.button>
            )}
        </div>
      </div>
    </div>
  );
};
