import React from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { PART_TIME_JOBS } from '../phaseConfig';

const PartTimeSelection = () => {
  const { gameState, dispatch } = useGameState();

  const handleSelectJob = (jobId) => {
    dispatch({ type: 'SELECT_PARTTIME', payload: { jobId } });
  };

  if (gameState.player.partTimeJob) {
    return null; // 選択済みなら表示しない
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">💼 アルバイトを探す</h2>
        <p className="text-center mb-6 text-gray-600">
          最初の選択がゲームの道筋を決めます。<br />
          高収入ほど自由時間が減り、低収入ほど成長余地があります。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PART_TIME_JOBS.map(job => (
            <div
              key={job.id}
              className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => handleSelectJob(job.id)}
            >
              <h3 className="text-lg font-semibold mb-2">{job.name}</h3>
              <div className="space-y-1 text-sm">
                <div>💰 月収 ¥{job.income.toLocaleString()}</div>
                <div>⏳ 自由時間 {job.actionModifier >= 0 ? '+' : ''}{job.actionModifier}（行動回数修正）</div>
                <div>📈 学習効率 {job.studyBonus ? `${job.studyBonus * 100}%` : '通常'}</div>
                <div>😰 疲労 {job.fatigue}/10</div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                {job.id === 'convenience' && "⏰ 自由時間が比較的多い。スキルアップに最適！"}
                {job.id === 'warehouse' && "⚖️ バランスが取れた選択。安定志向向け。"}
                {job.id === 'fulltime' && "💸 月収 ¥180,000。⏳ 自由時間がほぼ無い… 📉 スキルの伸びが遅そう"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          ※ どれを選んでも正解／不正解はありません。
        </div>
      </div>
    </div>
  );
};

export default PartTimeSelection;