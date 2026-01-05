import { Terminal } from 'lucide-react';

export const SystemLogs = ({ gameState }) => {
  return (
    <section className="bg-zinc-900 p-5 text-zinc-500 h-64 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
        <Terminal size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Log_Output</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none text-[10px] font-mono">
        {(gameState.logs ?? []).map((log, i) => (
          <div key={i} className={`${log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>
            {'>'} {log.message}
          </div>
        ))}
      </div>
    </section>
  );
};