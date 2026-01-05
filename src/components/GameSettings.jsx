import { useState } from 'react';

export const GameSettings = ({ onApply }) => {
  const [initialMoney, setInitialMoney] = useState(1000);
  const [initialMental, setInitialMental] = useState(90);
  const [maxActions, setMaxActions] = useState(2);
  const [learningCost, setLearningCost] = useState(20000);
  const [learningGain, setLearningGain] = useState(1);
  const [learningMode, setLearningMode] = useState('investment'); // 'selfstudy' or 'investment'

  const handleApply = () => {
    onApply({
      initialMoney,
      initialMental,
      maxActions,
      learningCost,
      learningGain,
      learningMode
    });
  };

  return (
    <div className="p-4 bg-zinc-100 border-2 border-zinc-900 rounded shadow-md space-y-4">
      <h2 className="font-bold text-lg">ゲーム設定</h2>

      <div>
        <label>初期所持金: </label>
        <input type="number" value={initialMoney} onChange={e => setInitialMoney(Number(e.target.value))} />
      </div>

      <div>
        <label>初期メンタル: </label>
        <input type="number" value={initialMental} onChange={e => setInitialMental(Number(e.target.value))} />
      </div>

      <div>
        <label>最大アクション数: </label>
        <input type="number" value={maxActions} onChange={e => setMaxActions(Number(e.target.value))} />
      </div>

      <div>
        <label>学習コスト: </label>
        <input type="number" value={learningCost} onChange={e => setLearningCost(Number(e.target.value))} />
      </div>

      <div>
        <label>学習ごとのスキル増加量: </label>
        <input type="number" value={learningGain} onChange={e => setLearningGain(Number(e.target.value))} />
      </div>

      <div>
        <label className="block font-bold mb-1">学習モード:</label>
        <select
          value={learningMode}
          onChange={e => setLearningMode(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="selfstudy">独学モード (無料、低速)</option>
          <option value="investment">投資モード (有料、高速)</option>
        </select>
      </div>

      <button onClick={handleApply} className="mt-2 p-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">設定を適用</button>
    </div>
  );
};