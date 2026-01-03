import { Rocket, Building2 } from 'lucide-react';

export const QuestPanel = ({ gameState, doAction, setGameState }) => {
  return (
    <>
      <section className="bg-white border-2 border-zinc-900 p-4 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xs font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-4">利用可能クエスト</h2>
        <div className="space-y-2">
          {gameState.jobs.map((job, index) => (
            <div
              key={index}
              className={`p-3 border-2 transition-all cursor-pointer ${
                gameState.selectedJob?.name === job.name
                ? 'bg-indigo-50 border-indigo-500'
                : 'bg-zinc-50 border-zinc-100 hover:border-zinc-300'
              }`}
              onClick={() => setGameState(prev => ({ ...prev, selectedJob: job }))}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-bold truncate leading-tight uppercase text-zinc-900">{job.name}</p>
                {job.lang && <span className="text-[8px] bg-zinc-900 text-white px-1">{job.lang}</span>}
              </div>
              <p className="text-sm font-black text-indigo-600">¥{job.reward.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => doAction('job')}
          disabled={!gameState.selectedJob || gameState.actionsLeft <= 0}
          className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-black py-3 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all text-xs"
        >
          START QUEST
        </button>
      </section>

      {/* AI Enhancement */}
      <section className="bg-white border-2 border-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xs font-black text-zinc-400 mb-3 uppercase flex items-center gap-2"><Rocket size={12}/> AIブースター</h2>
        <div className="flex border-2 border-zinc-100 bg-zinc-50 p-1">
          <button
            onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'free' }))}
            className={`flex-1 py-1 text-[10px] font-black transition-all ${gameState.aiPlan === 'free' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            無料
          </button>
          <button
            onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'pro' }))}
            className={`flex-1 py-1 text-[10px] font-black transition-all ${gameState.aiPlan === 'pro' ? 'bg-indigo-600 text-white shadow-inner' : 'text-zinc-400 hover:text-indigo-400'}`}
          >
            プロ
          </button>
        </div>
      </section>

      {!gameState.corporation && (
        <button
          onClick={() => doAction('incorporate')}
          className="w-full py-3 bg-white hover:bg-indigo-50 text-indigo-600 border-2 border-indigo-500 font-black text-[10px] transition-all flex items-center justify-center gap-2 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]"
        >
          <Building2 size={14} /> [ 設立 ]
        </button>
      )}
    </>
  );
};