
import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { X, Sparkles, Zap, Footprints } from 'lucide-react';
import { AppView, ReactionResult, GameType } from '../types';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { getEncouragement } from '../services/geminiService';

interface ResultsProps {
  onNavigate: (view: AppView) => void;
  results: ReactionResult[];
}

export const Results: React.FC<ResultsProps> = ({ onNavigate, results }) => {
  const [aiMessage, setAiMessage] = useState<string>("正在计算你的超能力值...");

  // Mock data generation if empty for visual demo
  const displayData = results.length > 0 ? results.slice(-15) : [
    { id: '1', timestamp: 1, scoreMs: 450, gameType: 'ORB' as GameType },
    { id: '2', timestamp: 2, scoreMs: 420, gameType: 'ORB' as GameType },
    { id: '3', timestamp: 3, scoreMs: 380, gameType: 'RUNNER' as GameType },
    { id: '4', timestamp: 4, scoreMs: 400, gameType: 'ORB' as GameType },
    { id: '5', timestamp: 5, scoreMs: 350, gameType: 'RUNNER' as GameType },
  ];

  const bestScore = Math.min(...displayData.map(d => d.scoreMs));
  const avgScore = Math.round(displayData.reduce((acc, curr) => acc + curr.scoreMs, 0) / displayData.length);

  useEffect(() => {
    if (results.length > 0) {
      getEncouragement(results.slice(-5)).then(setAiMessage);
    } else {
        setAiMessage("快去玩一局，听听 AI 教练怎么夸你！");
    }
  }, [results]);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto pt-8 pb-12 px-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-stone-600">你的成长日记</h1>
        <button 
          onClick={() => onNavigate('HOME')}
          className="p-2 bg-white/50 backdrop-blur rounded-full text-stone-500"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col gap-1 items-center py-6">
            <span className="text-stone-400 text-sm font-bold uppercase tracking-wider">最快纪录</span>
            <div className="flex items-baseline gap-1">
               <span className="text-3xl font-extrabold text-soft-greenText">{bestScore}</span>
               <span className="text-xs text-stone-400">毫秒</span>
            </div>
          </Card>
          <Card className="flex flex-col gap-1 items-center py-6">
            <span className="text-stone-400 text-sm font-bold uppercase tracking-wider">平均速度</span>
            <div className="flex items-baseline gap-1">
               <span className="text-3xl font-extrabold text-stone-600">{avgScore}</span>
               <span className="text-xs text-stone-400">毫秒</span>
            </div>
          </Card>
        </div>

        {/* AI Coach Card */}
        <Card className="bg-gradient-to-r from-soft-blue/30 to-soft-pink/30 border-none">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-full shadow-sm text-yellow-400">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-stone-600 text-sm mb-1">AI 教练悄悄话</h3>
              <p className="text-stone-500 text-sm leading-relaxed italic">
                "{aiMessage}"
              </p>
            </div>
          </div>
        </Card>

        {/* Chart */}
        <Card className="h-64 pt-6 pr-0 pb-2 pl-0">
          <h3 className="px-6 font-bold text-stone-600 mb-4">进步曲线 (混合统计)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E7F1E9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E7F1E9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.8)', 
                    backdropFilter: 'blur(4px)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    color: '#57534E'
                }}
                itemStyle={{ color: '#6FA379', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="scoreMs" 
                stroke="#6FA379" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMs)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent History List */}
        <div className="pb-4">
            <h3 className="font-bold text-stone-600 mb-4 px-2">最近挑战</h3>
            <div className="space-y-3">
                {displayData.slice().reverse().map((res, index) => (
                    <Card key={res.id || index} className="py-4 flex items-center justify-between !rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${res.gameType === 'RUNNER' ? 'bg-soft-green/50 text-soft-greenText' : 'bg-soft-yellow/50 text-stone-500'}`}>
                                {res.gameType === 'RUNNER' ? <Footprints size={18} /> : <Zap size={18} />}
                            </div>
                            <div>
                                <div className="font-bold text-stone-600">{res.scoreMs} ms</div>
                                <div className="text-xs text-stone-400">{res.gameType === 'RUNNER' ? '森林大冒险' : '光点捕手'}</div>
                            </div>
                        </div>
                        <div className="text-xs text-stone-300 font-medium">
                            {index === 0 ? '刚刚' : '之前'}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
