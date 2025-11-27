
import React, { useState } from 'react';
import { Background } from './components/Background';
import { Home } from './pages/Home';
import { GameList } from './pages/GameList';
import { Game } from './pages/Game';
import { RunnerGame } from './pages/RunnerGame';
import { Results } from './pages/Results';
import { AppView, ReactionResult, GameType } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [results, setResults] = useState<ReactionResult[]>([]);

  const handleSaveResult = (scoreMs: number, gameType: GameType) => {
    const newResult: ReactionResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      scoreMs,
      gameType
    };
    setResults(prev => [...prev, newResult]);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-stone-600 font-sans selection:bg-soft-yellow/50">
      <Background />
      
      <main className="relative z-10 h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'HOME' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <Home onNavigate={setCurrentView} />
            </motion.div>
          )}

          {currentView === 'GAME_LIST' && (
            <motion.div 
              key="game-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <GameList onNavigate={setCurrentView} />
            </motion.div>
          )}

          {currentView === 'GAME_ORB' && (
             <motion.div 
               key="game-orb"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
               className="h-full"
             >
              <Game 
                onNavigate={setCurrentView} 
                onSaveResult={(ms) => handleSaveResult(ms, 'ORB')} 
              />
            </motion.div>
          )}

          {currentView === 'GAME_RUNNER' && (
             <motion.div 
               key="game-runner"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
               className="h-full"
             >
              <RunnerGame 
                onNavigate={setCurrentView} 
                onSaveResult={(ms) => handleSaveResult(ms, 'RUNNER')} 
              />
            </motion.div>
          )}

          {currentView === 'RESULTS' && (
             <motion.div 
               key="results"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.5 }}
               className="h-full"
             >
              <Results onNavigate={setCurrentView} results={results} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
