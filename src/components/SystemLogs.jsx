export const SystemLogs = ({ logs }) => {
  return (
    <section className="bg-zinc-900 border-2 border-zinc-900 p-4 h-56 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        <span className="text-[10px] font-mono ml-2 text-zinc-500 uppercase tracking-widest">Live Output</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 text-xs font-mono scrollbar-none">
        {logs.map((log, i) => (
          <div key={i} className={`flex items-start gap-2 ${
            log.type === 'success' ? 'text-emerald-400' :
            log.type === 'error' ? 'text-red-400 font-bold' :
            log.type === 'warning' ? 'text-yellow-400' :
            'text-zinc-400'
          }`}>
            <span>></span>
            <span>{log.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};