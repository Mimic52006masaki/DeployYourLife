import { Gamepad2, Coins } from 'lucide-react';

export const HUD = ({ gameState }) => {
  return (
    <header className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border-2 border-zinc-900 p-4 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
      <div className="flex flex-col items-center md:items-start justify-center">
        <h1 className="text-xl font-black tracking-widest flex items-center gap-2 text-zinc-900">
          <Gamepad2 size={24} className="text-yellow-500 animate-spin-slow" />
          DEPLOY_YOUR_LIFE.EXE
        </h1>
      </div>
      <div className="flex justify-center items-center gap-4 bg-zinc-50 p-2 border border-zinc-200">
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Month</p>
          <p className="text-2xl font-black text-zinc-900">{gameState.month.toString().padStart(2, '0')}<span className="text-xs text-zinc-400">/12</span></p>
        </div>
        <div className="h-8 w-px bg-zinc-200"></div>
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Actions</p>
          <div className="flex gap-1 justify-center mt-1">
            {[...Array(2)].map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm border ${i < gameState.actionsLeft ? 'bg-indigo-500 border-indigo-600' : 'bg-zinc-200 border-zinc-300'}`}></div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center md:justify-end items-center gap-4">
         <div className="bg-yellow-50 px-4 py-2 border-2 border-yellow-500 flex items-center gap-3">
           <Coins size={20} className="text-yellow-600" />
           <span className="text-2xl font-black text-zinc-900">¥{gameState.money.toLocaleString()}</span>
         </div>
      </div>
    </header>
  );
};