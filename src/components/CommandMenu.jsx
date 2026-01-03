import { Code, TrendingUp, Moon } from 'lucide-react';

export const CommandMenu = ({ gameState, doAction, endMonth }) => {
  return (
    <section className="bg-white border-2 border-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-xs font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-4">COMMAND_MENU</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] text-zinc-400 font-bold mb-1">DEVELOPMENT / -¥20,000</p>
          <div className="grid grid-cols-1 gap-2">
            {['javascript', 'python', 'design'].map(lang => (
              <button
                key={lang}
                onClick={() => doAction('learn', lang)}
                disabled={gameState.actionsLeft <= 0}
                className="bg-zinc-50 hover:bg-indigo-50 border-2 border-zinc-200 hover:border-indigo-500 p-3 flex justify-between items-center group disabled:opacity-30 disabled:hover:bg-zinc-50 disabled:hover:border-zinc-200 transition-all active:translate-y-0.5"
              >
                <span className="text-xs font-black uppercase text-zinc-700">{lang}</span>
                <Code size={16} className="text-zinc-400 group-hover:text-indigo-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-zinc-400 font-bold mb-1">OTHERS / -1 ACTION</p>
          <button onClick={() => doAction('post')} disabled={gameState.actionsLeft <= 0} className="w-full bg-zinc-50 hover:bg-indigo-50 border-2 border-zinc-200 hover:border-indigo-500 p-4 flex flex-col items-center gap-1 disabled:opacity-30 active:translate-y-0.5 transition-all group">
            <TrendingUp size={20} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase text-zinc-700">SNS POST</span>
          </button>
          <button onClick={() => doAction('rest')} disabled={gameState.actionsLeft <= 0} className="w-full bg-zinc-50 hover:bg-amber-50 border-2 border-zinc-200 hover:border-amber-500 p-4 flex flex-col items-center gap-1 disabled:opacity-30 active:translate-y-0.5 transition-all group">
            <Moon size={20} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase text-zinc-700">REST</span>
          </button>
        </div>
      </div>

      {gameState.actionsLeft === 0 && (
        <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
          <button
            onClick={endMonth}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-12 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
          >
            NEXT TURN
          </button>
        </div>
      )}
    </section>
  );
};