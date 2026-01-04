import { Rocket } from 'lucide-react';
import { JobCard } from './JobCard';
import { ActionButton } from './ActionButton';
import { useGameState } from '../contexts/GameStateContext';

export const JobList = () => {
  const { gameState, doAction, dispatch } = useGameState();

  const selectAIPlan = (plan) => {
    dispatch({ type: 'UPDATE_STATE', payload: { ...gameState, ai: { plan } } });
  };
  return (
    <>
      <section className="bg-white border-2 border-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-[10px] font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-6 uppercase tracking-widest">Available_Quests</h2>
        <div className="space-y-3">
          {gameState.quests.jobs.map((job, index) => (
            <JobCard
              key={index}
              job={job}
              selected={gameState.quests.selectedJob?.name === job.name}
              onSelect={() => dispatch({ type: 'UPDATE_STATE', payload: { ...gameState, quests: { ...gameState.quests, selectedJob: job } } })}
            />
          ))}
        </div>
        {/* Accept Quest ボタンも ActionButton に統一 */}
        <ActionButton
          onClick={() => doAction('job')}
          disabled={!gameState.quests.selectedJob || gameState.economy.actionsLeft <= 0}
          colorClasses="mt-6 bg-emerald-500 hover:bg-emerald-400 text-white py-4 border-b-4 border-emerald-800 active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest text-sm"
        >
          Accept Quest
        </ActionButton>
      </section>

      <section className="bg-white border-2 border-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 mb-4">
          <Rocket size={16} className="text-indigo-500" />
          <h2 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">AI_Enhancement</h2>
        </div>
        <div className="flex gap-2 p-1 bg-zinc-100 border border-zinc-200">
          <ActionButton
            onClick={() => selectAIPlan('free')}
            colorClasses={`flex-1 py-2 text-[10px] font-black uppercase transition-all ${gameState.ai.plan === 'free' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Free
          </ActionButton>
          <ActionButton
            onClick={() => selectAIPlan('pro')}
            colorClasses={`flex-1 py-2 text-[10px] font-black uppercase transition-all ${gameState.ai.plan === 'pro' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-indigo-400'}`}
          >
            Pro (¥50k)
          </ActionButton>
        </div>
      </section>
    </>
  );
};