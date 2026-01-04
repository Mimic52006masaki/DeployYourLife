import { useGameState } from '../contexts/GameStateContext';
import { IncomeBarChart } from './IncomeBarChart';
import TrendChart from './TrendChart';
import { TrendingUp, TrendingDown, Users, Heart } from 'lucide-react';
import { useState } from 'react';

export const SummaryModal = () => {
  const { gameState, dispatch } = useGameState();
  const [closing, setClosing] = useState(false);
  if (!gameState.game.monthReport) return null;

  const report = gameState.game.monthReport;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      dispatch({ type: 'UPDATE_STATE', payload: { ...gameState, game: { ...gameState.game, monthReport: null } } });
    }, 300); // アニメーション時間
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-white border-4 border-zinc-900 p-10 max-w-lg w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] ${closing ? 'animate-out slide-out-to-bottom-2 duration-300' : 'animate-in zoom-in-95 duration-200'}`}>
        <h2 className="text-3xl font-black mb-10 text-center uppercase italic underline decoration-indigo-500 underline-offset-8">Month {report.month} Summary</h2>

        {/* 収支グラフ */}
        <div className="mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-4">Financial Overview</h3>
          <IncomeBarChart income={report.income} expenses={report.expenses} />
        </div>

        {/* 詳細収入内訳 */}
        <div className="space-y-3 mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Income Breakdown</h3>
          {report.jobIncome > 0 && (
            <div className="flex justify-between items-center text-xs animate-in fade-in slide-in-from-left-2 duration-500">
              <span className="text-zinc-400 uppercase font-bold">Job Income</span>
              <span className="text-emerald-600 font-black">¥{report.jobIncome.toLocaleString()}</span>
            </div>
          )}
          {report.freelanceIncome > 0 && (
            <div className="flex justify-between items-center text-xs animate-in fade-in slide-in-from-left-2 duration-500 delay-100">
              <span className="text-zinc-400 uppercase font-bold">Freelance</span>
              <span className={`font-black ${report.freelanceIncome > 100000 ? 'text-yellow-500 animate-pulse' : 'text-emerald-600'}`}>¥{report.freelanceIncome.toLocaleString()}</span>
            </div>
          )}
          {report.corporationIncome > 0 && (
            <div className="flex justify-between items-center text-xs animate-in fade-in slide-in-from-left-2 duration-500 delay-200">
              <span className="text-zinc-400 uppercase font-bold">Corporation</span>
              <span className="text-indigo-600 font-black">¥{report.corporationIncome.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* メンタル・フォロワー変化 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-50 p-4 border border-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={16} className="text-red-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Mental</span>
            </div>
            <div className="flex items-center gap-1">
              {report.mentalChange > 0 ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : report.mentalChange < 0 ? (
                <TrendingDown size={14} className="text-red-500" />
              ) : null}
              <span className={`font-black ${report.mentalChange > 0 ? 'text-emerald-600' : report.mentalChange < 0 ? 'text-red-600' : 'text-zinc-600'}`}>
                {report.mentalChange > 0 ? '+' : ''}{report.mentalChange}
              </span>
            </div>
          </div>
          <div className="bg-zinc-50 p-4 border border-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-blue-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Followers</span>
            </div>
            <div className="flex items-center gap-1">
              {report.followerChange > 0 ? (
                <TrendingUp size={14} className="text-green-500" />
              ) : report.followerChange < 0 ? (
                <TrendingDown size={14} className="text-red-500" />
              ) : null}
              <span className={`font-black ${report.followerChange > 0 ? 'text-green-600' : report.followerChange < 0 ? 'text-red-600' : 'text-zinc-600'}`}>
                {report.followerChange > 0 ? '+' : ''}{report.followerChange}
              </span>
            </div>
          </div>
        </div>

        {/* 過去6ヶ月のトレンド */}
        <TrendChart history={gameState.game.history} />

        <div className="h-0.5 bg-zinc-900 my-6"></div>
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-black uppercase">Net Result</span>
          <span className={`text-3xl font-black ${report.netMoney >= 0 ? "text-indigo-600" : "text-red-600"}`}>
            ¥{report.netMoney.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleClose}
          className="w-full bg-indigo-600 text-white font-black py-5 hover:bg-indigo-500 transition-all uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700"
        >
          Next Turn
        </button>
      </div>
    </div>
  );
};