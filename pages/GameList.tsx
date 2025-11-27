
import React from 'react';
import { Card } from '../components/Card';
import { X, Zap, Footprints } from 'lucide-react';
import { AppView } from '../types';

interface GameListProps {
  onNavigate: (view: AppView) => void;
}

export const GameList: React.FC<GameListProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto pt-8 pb-12 px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h1 className="text-2xl font-bold text-stone-600">选择一个挑战</h1>
        <button 
          onClick={() => onNavigate('HOME')}
          className="p-2 bg-white/50 backdrop-blur rounded-full text-stone-500 hover:bg-white/80 transition"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6 justify-center">
        
        {/* Game 1: Orb */}
        <Card 
          onClick={() => onNavigate('GAME_ORB')}
          className="cursor-pointer group relative overflow-hidden"
          delay={0.1}
        >
           <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-soft-yellow/50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
           
           <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 bg-soft-yellow rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Zap className="w-8 h-8 text-stone-600 fill-stone-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-600 mb-1">光点捕手</h3>
                <p className="text-sm text-stone-400">看到发光立刻点！<br/>锻炼瞬间爆发力 ⚡️</p>
              </div>
           </div>
        </Card>

        {/* Game 2: Runner */}
        <Card 
          onClick={() => onNavigate('GAME_RUNNER')}
          className="cursor-pointer group relative overflow-hidden"
          delay={0.2}
        >
           <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-soft-green/50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
           
           <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 bg-soft-green rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Footprints className="w-8 h-8 text-soft-greenText fill-soft-greenText" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-600 mb-1">森林大冒险</h3>
                <p className="text-sm text-stone-400">蘑菇怪出现就跳！<br/>锻炼专注与预判 🐰</p>
              </div>
           </div>
        </Card>

      </div>
    </div>
  );
};
