import { useGameState } from '../contexts/GameStateContext';
import { useState, useEffect } from 'react';
import { Heart, Users } from 'lucide-react';

export const SummaryModal = () => {
  const { gameState, dispatch } = useGameState();
  const [closing, setClosing] = useState(false);

  const report = gameState.game.monthReport;
  if (!report) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MONTH_REPORT' });
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-white border-4 border-zinc-900 p-8 max-w-md w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] ${closing ? 'animate-out slide-out-to-bottom-2 duration-300' : 'animate-in zoom-in-95 duration-200'}`}>
        <h2 className="text-3xl font-black mb-8 text-center uppercase">{report.month}ヶ月目サマリー</h2>

        {/* 収入・支出・収支 */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-bold">収入:</span>
            <span className="font-black text-emerald-600">¥{report.income.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">支出:</span>
            <span className="font-black text-red-600">¥{report.expenses.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">収支:</span>
            <span className={`font-black ${report.netMoney >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              ¥{report.netMoney.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">現在の所持金:</span>
            <span className="font-black">¥{gameState.economy.money.toLocaleString()}</span>
          </div>
        </div>

        {/* メンタル */}
        <div className="flex justify-between items-center mb-4 bg-zinc-50 p-3 border border-zinc-200 rounded">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-red-500" />
            <span className="font-bold">メンタル</span>
          </div>
          <span className={`font-black ${report.mentalChange > 0 ? 'text-emerald-600' : report.mentalChange < 0 ? 'text-red-600' : 'text-zinc-600'}`}>
            {report.mentalChange >= 0 ? '+' : ''}{report.mentalChange} → {gameState.player.mental}
          </span>
        </div>

        {/* フォロワー */}
        <div className="flex justify-between items-center mb-6 bg-zinc-50 p-3 border border-zinc-200 rounded">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            <span className="font-bold">フォロワー</span>
          </div>
          <span className={`font-black ${report.followerChange > 0 ? 'text-emerald-600' : report.followerChange < 0 ? 'text-red-600' : 'text-zinc-600'}`}>
            {report.followerChange >= 0 ? '+' : ''}{report.followerChange} → {gameState.player.followers}
          </span>
        </div>

        {/* 次へ */}
        <button
          onClick={handleClose}
          className="w-full bg-indigo-600 text-white font-black py-4 hover:bg-indigo-500 transition-all uppercase tracking-widest"
        >
          次へ
        </button>
      </div>
    </div>
  );
};