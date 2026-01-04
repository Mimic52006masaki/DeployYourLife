import { Sun, Coins } from 'lucide-react';

export const HUD = ({ gameState }) => {
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

      <div className="flex items-center gap-6 bg-zinc-50 border border-zinc-200 px-6 py-2 w-full md:w-auto justify-center">
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Month</p>
          <p className="text-xl font-black">{gameState.month}/12</p>
        </div>
        <div className="h-8 w-px bg-zinc-200"></div>
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Actions</p>
          <div className="flex gap-1.5 mt-1 justify-center">
            {[...Array(2)].map((_, i) => (
              <div key={i} className={`w-4 h-4 border-2 ${i < gameState.actionsLeft ? 'bg-indigo-500 border-indigo-700 animate-pulse' : 'bg-zinc-200 border-zinc-300'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 px-6 py-2 border-2 border-yellow-500 flex items-center gap-4 w-full md:w-auto justify-center">
        <Coins size={20} className="text-yellow-600" />
        <span className="text-2xl font-black">¥{gameState.money.toLocaleString()}</span>
      </div>
    </header>
  );
};