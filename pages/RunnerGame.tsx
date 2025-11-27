
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TreePine, Cloud } from 'lucide-react';
import { AppView } from '../types';
import { Card } from '../components/Card';

interface RunnerGameProps {
  onNavigate: (view: AppView) => void;
  onSaveResult: (ms: number, gameType: 'RUNNER') => void;
}

type GameState = 'TUTORIAL' | 'RUNNING' | 'JUMPING' | 'FINISHED';

export const RunnerGame: React.FC<RunnerGameProps> = ({ onNavigate, onSaveResult }) => {
  const [gameState, setGameState] = useState<GameState>('TUTORIAL');
  const [rounds, setRounds] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [showObstacle, setShowObstacle] = useState(false);
  const [message, setMessage] = useState("准备好了吗？");
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_ROUNDS = 5;

  // Schedule next obstacle
  const scheduleObstacle = useCallback(() => {
    setMessage("跑呀跑...");
    setShowObstacle(false);
    
    // Random delay between 2s and 5s
    const delay = Math.random() * 3000 + 2000;
    
    timeoutRef.current = setTimeout(() => {
      // Stimulus Appears
      setShowObstacle(true);
      setStartTime(Date.now());
      setMessage("跳！🐰");
    }, delay);
  }, []);

  const startGame = () => {
    setGameState('RUNNING');
    scheduleObstacle();
  };

  const handleJump = () => {
    if (gameState !== 'RUNNING' || !showObstacle) {
        if (gameState === 'RUNNING' && !showObstacle) {
            setMessage("太早啦！没看到蘑菇呢 🍄");
        }
        return;
    }

    // Correct Jump Action
    const reactionTime = Date.now() - startTime;
    setGameState('JUMPING'); // This triggers the jump AND the mushroom move
    setMessage(`${reactionTime} ms! 完美起跳! ✨`);
    
    // Save Result
    const newRounds = [...rounds, reactionTime];
    setRounds(newRounds);
    onSaveResult(reactionTime, 'RUNNER');

    // Reset physics after animation completes
    setTimeout(() => {
        if (newRounds.length >= MAX_ROUNDS) {
            setGameState('FINISHED');
        } else {
            setGameState('RUNNING');
            scheduleObstacle();
        }
    }, 1000); // Allow time for full jump and mushroom pass
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const average = rounds.length > 0 ? Math.round(rounds.reduce((a, b) => a + b, 0) / rounds.length) : 0;

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-blue-50 to-green-50">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ x: [300, -400] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 text-white/60"
          >
             <Cloud size={64} fill="currentColor" />
          </motion.div>
          <motion.div 
            animate={{ x: [400, -300] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
            className="absolute top-40 left-1/2 text-white/40"
          >
             <Cloud size={48} fill="currentColor" />
          </motion.div>
      </div>

      {/* Header */}
      <div className="p-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('GAME_LIST')}
          className="p-2 bg-white/50 backdrop-blur rounded-full text-stone-500"
        >
          <X size={24} />
        </button>
        <div className="font-bold text-soft-greenText bg-white/60 px-4 py-1 rounded-full backdrop-blur">
          {gameState === 'FINISHED' ? '完成' : `关卡 ${Math.min(rounds.length + 1, MAX_ROUNDS)} / ${MAX_ROUNDS}`}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex flex-col justify-end pb-20 overflow-hidden" onClick={handleJump}>
         
         <div className="absolute top-1/4 w-full text-center pointer-events-none z-30 px-6">
           <h2 className="text-2xl font-bold text-stone-600 drop-shadow-sm">{message}</h2>
         </div>

         {/* Ground */}
         <div className="absolute bottom-0 w-full h-24 bg-soft-green border-t-4 border-white/50 z-10" />
         
         {/* Trees */}
         <div className="absolute bottom-24 w-full flex justify-around opacity-40 px-10">
            <TreePine size={64} className="text-soft-greenText" />
            <TreePine size={48} className="text-soft-greenText translate-y-4" />
            <TreePine size={80} className="text-soft-greenText -translate-y-2" />
         </div>

         {/* Bunny Player */}
         <motion.div 
            className="absolute left-10 bottom-24 z-20 text-5xl"
            animate={
                gameState === 'JUMPING' ? { 
                    y: [0, -180, 0], // Jump high
                    rotate: [0, -10, 10, 0] // Wiggle ears
                } : 
                gameState === 'RUNNING' ? { 
                    y: [0, -10, 0] // Run bounce
                } : {}
            }
            transition={
                gameState === 'JUMPING' ? { duration: 0.8, ease: "easeInOut" } :
                gameState === 'RUNNING' ? { duration: 0.4, repeat: Infinity } : {}
            }
         >
            🐰
         </motion.div>

         {/* Obstacle Mushroom */}
         <AnimatePresence>
            {showObstacle && (
                <motion.div
                    // Initial: Appear on the right
                    initial={{ left: '80%', opacity: 0, scale: 0.5 }}
                    // Animate: If Jumping, slide quickly to the left (under bunny). Otherwise stay on right.
                    animate={
                        gameState === 'JUMPING' 
                        ? { left: '-20%', opacity: 1, scale: 1 } 
                        : { left: '80%', opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0 }}
                    // Transition: Fast slide when jumping
                    transition={
                        gameState === 'JUMPING' 
                        ? { duration: 0.6, ease: "linear" } // Fast pass
                        : { duration: 0.2, type: "spring" } // Pop in
                    }
                    className="absolute bottom-24 z-20 text-4xl"
                >
                    🍄
                </motion.div>
            )}
         </AnimatePresence>

         {/* Tutorial */}
         {gameState === 'TUTORIAL' && (
             <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-40 flex items-center justify-center p-6">
                 <Card className="text-center">
                     <h3 className="text-xl font-bold text-stone-600 mb-2">玩法说明 📖</h3>
                     <p className="text-stone-500 mb-6">小兔子正在森林里散步。<br/>当 <span className="text-2xl">🍄</span> 突然出现时，<br/><strong>立刻点击屏幕</strong>跳过去！</p>
                     <button 
                        onClick={startGame}
                        className="w-full py-3 bg-soft-green text-stone-600 font-bold rounded-2xl animate-pulse"
                     >
                        明白啦，开始！
                     </button>
                 </Card>
             </div>
         )}

         {/* Finished */}
         {gameState === 'FINISHED' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/20 backdrop-blur-sm">
              <Card className="w-64 text-center">
                <h3 className="text-xl font-bold text-stone-600 mb-2">大冒险成功！🎉</h3>
                <div className="text-4xl font-extrabold text-soft-greenText mb-4">{average} <span className="text-base font-normal text-stone-400">平均毫秒</span></div>
                <button 
                  onClick={() => onNavigate('RESULTS')}
                  className="w-full py-3 bg-soft-green text-stone-600 font-bold rounded-2xl hover:bg-green-100 transition"
                >
                  看看成绩单 👀
                </button>
              </Card>
            </div>
         )}

         {gameState === 'RUNNING' && (
             <div className="absolute bottom-4 w-full text-center text-stone-400 text-sm opacity-60 z-30">
                 (点击屏幕任意位置跳跃)
             </div>
         )}
      </div>
    </div>
  );
};
