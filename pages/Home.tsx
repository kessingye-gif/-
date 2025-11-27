
import React from 'react';
import { Card } from '../components/Card';
import { Activity, Award, Gamepad2 } from 'lucide-react';
import { AppView } from '../types';

interface HomeProps {
  onNavigate: (view: AppView) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto pt-8 pb-12 px-6">
      {/* Header */}
      <div className="mb-10 text-center relative z-10">
        <h1 className="text-3xl font-bold text-stone-600 mb-2">嗨，小闪电！⚡️</h1>
        <p className="text-stone-400 font-medium">今天想玩什么游戏呢？</p>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {/* Main Action - Go to Game List */}
        <Card 
          onClick={() => onNavigate('GAME_LIST')} 
          className="bg-gradient-to-br from-white/60 to-soft-yellow/20 cursor-pointer h-48 flex flex-col items-center justify-center gap-4 group"
        >
          <div className="w-20 h-20 bg-soft-yellow rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
            <Gamepad2 className="w-10 h-10 text-stone-600 ml-1" fill="currentColor" />
          </div>
          <h2 className="text-xl font-bold text-stone-600">进入游戏大厅 🎮</h2>
          <p className="text-sm text-stone-400 font-medium">这里有两个好玩的训练哦！</p>
        </Card>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            onClick={() => onNavigate('RESULTS')}
            delay={0.1}
            className="cursor-pointer flex flex-col items-center gap-3 py-8"
          >
            <div className="w-12 h-12 bg-soft-green rounded-2xl flex items-center justify-center text-soft-greenText">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-bold text-stone-500">成长日记 📝</span>
          </Card>

          <Card 
            delay={0.2}
            className="flex flex-col items-center gap-3 py-8 opacity-80"
          >
             <div className="w-12 h-12 bg-soft-pink rounded-2xl flex items-center justify-center text-soft-pinkText">
              <Award className="w-6 h-6" />
            </div>
            <span className="font-bold text-stone-500">我的徽章 🏅</span>
          </Card>
        </div>
      </div>
    </div>
  );
};
