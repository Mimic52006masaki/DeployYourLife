import { Building2 } from 'lucide-react';

export const StatusPanel = ({ gameState, getMentalEmoji }) => {
  return (
    <>
      <section className="bg-white border-2 border-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xs font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-4">STATUS</h2>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl bg-zinc-50 border-2 border-zinc-900 w-16 h-16 flex items-center justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {getMentalEmoji()}
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">HP / Mental Stress</p>
              <div className="h-4 w-full bg-zinc-100 border border-zinc-300 mt-1 relative">
                <div
                  className={`h-full transition-all duration-700 ${gameState.mental >= 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${100 - gameState.mental}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-zinc-400 font-bold uppercase">Skills_Tree</p>
            {Object.entries(gameState.languages).map(([name, lv]) => (
              <div key={name} className="flex justify-between items-center p-2 bg-zinc-50 border border-zinc-200 group hover:border-indigo-500 transition-colors">
                <span className="text-xs font-bold uppercase text-zinc-600">{name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-3 ${i < lv ? 'bg-indigo-500' : 'bg-zinc-200'}`}></div>
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold">LV.{lv}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-zinc-50 border border-zinc-200 p-2">
              <p className="text-zinc-400 font-bold">INFLUENCE</p>
              <p className="text-sm font-bold text-zinc-900">{gameState.followers.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 p-2">
              <p className="text-zinc-400 font-bold">CORP</p>
              <p className={`text-sm font-bold ${gameState.corporation ? 'text-indigo-600' : 'text-zinc-600'}`}>
                {gameState.corporation ? 'ACTIVE' : 'NONE'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-zinc-900 text-white p-4 border-b-4 border-zinc-700 font-black flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <p className="text-[10px] opacity-70 uppercase">Current Job</p>
        <p className="text-xl uppercase tracking-tighter">{gameState.job}</p>
      </div>
    </>
  );
};