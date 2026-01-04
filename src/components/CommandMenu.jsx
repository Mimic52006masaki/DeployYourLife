import { Code, TrendingUp, Moon, Sparkles, MousePointer2 } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { useGameState } from '../contexts/GameStateContext';

export const CommandMenu = () => {
  const { gameState, doAction, endMonth, getSkillDisplayName } = useGameState();

  const canPerformAction = (type, lang) => {
    if (gameState.economy.actionsLeft <= 0) return false;
    if (type === 'learn' && gameState.economy.money < 20000) return false;
    if (type === 'job' && !gameState.quests.selectedJob) return false;
    return true;
  };

  return (
    <section className="bg-white border-2 border-zinc-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[10px] font-black bg-zinc-900 text-white px-2 py-1 uppercase tracking-tighter">Command_Menu</h2>
        <div className="text-[10px] font-black text-indigo-500 animate-pulse uppercase tracking-widest">
          {gameState.economy.actionsLeft > 0 ? 'Wait_Input...' : 'Actions_Consumed'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skill Development */}
        <div className="space-y-4">
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Skill_Development</p>
          <div className="grid grid-cols-1 gap-2">
            {['javascript', 'python', 'design'].map(lang => (
              <ActionButton
                key={lang}
                onClick={() => doAction('learn', lang)}
                disabled={!canPerformAction('learn', lang)}
                colorClasses="bg-zinc-50 hover:bg-white border-2 border-zinc-100 hover:border-indigo-500 flex justify-between items-center"
              >
                <span className="text-xs font-black uppercase">{getSkillDisplayName(lang)}</span>
                <div className="bg-white group-hover:bg-indigo-500 group-hover:text-white p-1 rounded border border-zinc-200 transition-colors">
                  <Code size={14} />
                </div>
              </ActionButton>
            ))}
          </div>
        </div>

        {/* Life Execution */}
        <div className="space-y-4">
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Life_Execution</p>
          <ActionButton onClick={() => doAction('post')} disabled={!canPerformAction('post')} colorClasses="bg-zinc-50 hover:bg-white border-2 border-zinc-100 hover:border-indigo-500 flex justify-between items-center">
            <div className="bg-indigo-100 p-2 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <TrendingUp size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black">SNS POST</p>
              <p className="text-[8px] text-zinc-400 font-bold uppercase">Increase Influence</p>
            </div>
          </ActionButton>

          <ActionButton
            onClick={() => doAction('rest')}
            disabled={!canPerformAction('rest')}
            colorClasses="bg-zinc-50 hover:bg-white border-2 border-zinc-100 hover:border-amber-500 flex justify-between items-center"
          >
            <div className="bg-amber-100 p-2 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Moon size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black">RECOVERY</p>
              <p className="text-[8px] text-zinc-400 font-bold uppercase">Heal Mental Fatigue</p>
            </div>
          </ActionButton>
        </div>
      </div>

      {gameState.economy.actionsLeft <= 0 && (
        <div className="mt-12 pt-8 border-t-2 border-dashed border-zinc-100 text-center animate-in fade-in slide-in-from-bottom-2">
          <ActionButton onClick={endMonth} colorClasses="bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-12 border-b-4 border-indigo-900 shadow-xl flex items-center justify-center gap-3">
            <Sparkles size={18} />
            <span>NEXT TURN</span>
            <MousePointer2 size={18} className="animate-bounce" />
          </ActionButton>
        </div>
      )}
    </section>
  );
};