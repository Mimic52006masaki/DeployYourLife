export const SummaryModal = ({ gameState, setGameState }) => {
  if (!gameState.monthReport) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-zinc-900 p-10 max-w-md w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
        <h2 className="text-3xl font-black mb-10 text-center uppercase italic underline decoration-indigo-500 underline-offset-8">Month Summary</h2>
        <div className="space-y-4 mb-12">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 uppercase font-bold tracking-widest">Income</span>
            <span className="text-emerald-600 font-black text-lg">+¥{gameState.monthReport.income.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 uppercase font-bold tracking-widest">Expenses</span>
            <span className="text-red-500 font-black text-lg">-¥{gameState.monthReport.expenses.toLocaleString()}</span>
          </div>
          <div className="h-0.5 bg-zinc-900 my-4"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-black uppercase">Net Surplus</span>
            <span className={`text-3xl font-black ${gameState.monthReport.netMoney >= 0 ? "text-indigo-600" : "text-red-600"}`}>
              ¥{gameState.monthReport.netMoney.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          onClick={() => setGameState(prev => ({ ...prev, monthReport: null }))}
          className="w-full bg-zinc-900 text-white font-black py-5 hover:bg-zinc-800 transition-all uppercase tracking-widest"
        >
          Confirm Phase
        </button>
      </div>
    </div>
  );
};