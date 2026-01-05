import { Sun, Coins, Clock, Zap, BookOpen } from 'lucide-react';

export const HUD = ({ gameState }) => {
  const calculateLearnGain = (config, money) => {
    if (config.learningMode === 'selfstudy') {
      return Math.max(1, Math.floor(config.learningGain * 0.5));
    } else {
      const cost = Math.min(config.learningCost, money);
      return Math.max(1, Math.floor(cost / 10000) * config.learningGain);
    }
  };

  const selfstudyGain = Math.max(1, Math.floor(gameState.config.learningGain * 0.5));
  const investmentGain = Math.max(1, Math.floor(Math.min(gameState.config.learningCost, gameState.economy.money) / 10000) * gameState.config.learningGain);

  return (
    <header className="bg-white border-2 border-zinc-900 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="bg-zinc-900 text-white p-3">
          <Sun size={24} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-lg font-black uppercase tracking-tighter">Deploy Your Life</h1>
          <p className="text-[10px] text-zinc-400 font-bold">SIMULATION_V2.0</p>
        </div>
      </div>

      <div className="flex items-center gap-6 bg-white border-2 border-zinc-900 px-6 py-2 w-full md:w-auto justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center">
          <Clock size={16} className="mx-auto text-zinc-600 mb-1" />
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Phase</p>
          <p className="text-xl font-black">{gameState.game.phase.toUpperCase()}</p>
        </div>
        <div className="h-8 w-px bg-zinc-200"></div>
        <div className="text-center">
          <Zap size={16} className="mx-auto text-zinc-600 mb-1" />
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Actions</p>
          <div className="flex gap-1.5 mt-1 justify-center">
            {[...Array(gameState.economy.maxActions || 2)].map((_, i) => (
              <div key={i} className={`w-4 h-4 border-2 ${i < gameState.economy.actionsLeft ? 'bg-indigo-500 border-indigo-700 animate-pulse' : 'bg-zinc-200 border-zinc-300'}`} />
            ))}
          </div>
        </div>
        <div className="h-8 w-px bg-zinc-200"></div>
        <div className="text-center">
          <BookOpen size={16} className="mx-auto text-zinc-600 mb-1" />
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Learning</p>
          <p className="text-xl font-black">{gameState.config.learningMode === 'selfstudy' ? '独学' : '投資'}</p>
          <p className="text-xs text-zinc-500">次回: +{calculateLearnGain(gameState.config, gameState.economy.money)} skill</p>
          <p className="text-xs text-zinc-400">独学: +{selfstudyGain} | 投資: +{investmentGain}</p>
        </div>
      </div>

      <div className="bg-yellow-50 px-6 py-2 border-2 border-yellow-500 flex items-center gap-4 w-full md:w-auto justify-center">
        <Coins size={20} className="text-yellow-600" />
        <span className="text-2xl font-black">¥{(gameState.economy.money ?? 0).toLocaleString()}</span>
      </div>
    </header>
  );
};