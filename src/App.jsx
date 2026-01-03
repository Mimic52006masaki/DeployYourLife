import { useState, useEffect } from 'react';

function App() {
  const [gameState, setGameState] = useState({
    month: 1,
    job: 'バイト',
    money: 100000,
    mental: 30,
    languages: { javascript: 0, python: 0, design: 0 },
    aiPlan: 'free', // 'free' or 'pro'
    followers: 0,
    corporation: false, // 法人化フラグ
    actionsLeft: 2,
    jobs: [],
    selectedJob: null,
    gameOver: false,
    endGame: false,
    message: '',
    monthReport: null, // 月次レポート
  });

  const generateJobs = (languages) => {
    const jobPool = [];
    if (languages.javascript > 0) {
      jobPool.push({ name: 'LP制作 (JS)', lang: 'javascript', levelReq: 1, reward: Math.floor(Math.random() * 30000) + 50000, mentalGain: 15 });
    }
    if (languages.javascript >= 2) {
      jobPool.push({ name: 'Web開発 (JS)', lang: 'javascript', levelReq: 2, reward: Math.floor(Math.random() * 20000) + 80000, mentalGain: 25 });
    }
    if (languages.python >= 1) {
      jobPool.push({ name: 'API開発 (Python)', lang: 'python', levelReq: 1, reward: Math.floor(Math.random() * 40000) + 60000, mentalGain: 20 });
    }
    if (languages.python >= 2) {
      jobPool.push({ name: 'データ分析 (Python)', lang: 'python', levelReq: 2, reward: Math.floor(Math.random() * 50000) + 100000, mentalGain: 30 });
    }
    if (languages.design >= 1) {
      jobPool.push({ name: 'バナー制作', lang: 'design', levelReq: 1, reward: Math.floor(Math.random() * 20000) + 30000, mentalGain: 10 });
    }
    // 汎用案件（言語不要）
    jobPool.push({ name: 'バグ修正', lang: null, levelReq: 0, reward: Math.floor(Math.random() * 30000) + 30000, mentalGain: 10 });

    const numJobs = Math.floor(Math.random() * 3) + 1;
    const selectedJobs = [];
    for (let i = 0; i < numJobs && jobPool.length > 0; i++) {
      const idx = Math.floor(Math.random() * jobPool.length);
      selectedJobs.push(jobPool.splice(idx, 1)[0]);
    }
    return selectedJobs;
  };

  const doAction = (action, lang) => {
    if (gameState.actionsLeft <= 0) return;
    setGameState(prev => {
      let newState = { ...prev, actionsLeft: prev.actionsLeft - 1 };
      if (action === 'learn') {
        if (newState.money < 20000) {
          newState.message = 'お金が足りません';
          return prev;
        }
        newState.languages = { ...newState.languages };
        newState.languages[lang] += 1;
        newState.money -= 20000;
        newState.mental += 5;
        newState.message = `${lang}学習しました。${lang}レベル+1, 所持金-20,000円, 精神+5`;
      } else if (action === 'job') {
        if (!newState.selectedJob) return prev;
        const job = newState.selectedJob;
        let reward = job.reward;
        let success = true;
        if (job.lang && newState.languages[job.lang] < job.levelReq) {
          success = Math.random() > 0.5; // 失敗率
        }
        // AI Pro 効果
        let mentalGain = job.mentalGain;
        if (newState.aiPlan === 'pro') {
          mentalGain += 10; // 精神消費軽減
          success = success || Math.random() < 0.1; // 成功率 +10%
        }
        if (newState.mental >= 80) {
          reward = Math.floor(reward * 0.5); // ケアレスミス
          newState.message = 'ケアレスミス発生。';
        }
        // フォロワーボーナス
        const followerBonus = 1 + Math.min(newState.followers / 1000, 1);
        reward = Math.floor(reward * followerBonus);
        if (success) {
          newState.money += reward;
          newState.mental += mentalGain;
          if (!newState.monthReport) newState.monthReport = { freelanceIncome: 0 };
          newState.monthReport.freelanceIncome = (newState.monthReport.freelanceIncome || 0) + reward;
          newState.message += `${job.name}完了。報酬+${reward}円, 精神+${mentalGain}`;
        } else {
          newState.message += `${job.name}失敗。報酬なし`;
        }
        newState.selectedJob = null;
      } else if (action === 'rest') {
        newState.mental = Math.max(0, newState.mental - 20);
        newState.message = '休養しました。精神-20';
      } else if (action === 'post') {
        let followChange = 0;
        let mentalChange = 0;
        const rand = Math.random();
        let proBonus = newState.aiPlan === 'pro' ? 0.1 : 0;
        let flameRisk = 0.1 + (newState.mental / 100) * 0.2 - proBonus; // 精神が高いほど炎上率↑, Proで軽減
        if (rand < flameRisk) {
          // 炎上
          followChange = -Math.floor(Math.random() * 70) - 30;
          mentalChange = 20;
          newState.message = `SNS投稿炎上。フォロワー${followChange}, 精神+${mentalChange}`;
        } else if (rand < flameRisk + 0.2 + proBonus) {
          // バズ
          followChange = Math.floor(Math.random() * 100) + 50;
          newState.message = `SNS投稿バズ！フォロワー+${followChange}`;
        } else {
          // 通常
          followChange = Math.floor(Math.random() * 10) + 5;
          newState.message = `SNS投稿。フォロワー+${followChange}`;
        }
        newState.followers = Math.max(0, newState.followers + followChange);
        newState.mental += mentalChange;
      } else if (action === 'incorporate') {
        if (newState.money < 200000 || newState.languages.javascript < 1 || newState.languages.python < 1 || newState.languages.design < 1 || newState.followers < 500) {
          newState.message = '法人化条件を満たしていません（所持金20万以上、各言語Lv1以上、フォロワー500以上）';
          return prev;
        }
        newState.money -= 200000;
        newState.corporation = true;
        newState.message = '法人化しました！月固定費が10万円発生しますが、フォロワー収入が入ります';
      }
      return newState;
    });
  };

  const endMonth = () => {
    setGameState(prev => {
      let newState = { ...prev };
      let report = {
        month: newState.month + 1,
        income: 0,
        expenses: 0,
        jobIncome: 0,
        freelanceIncome: 0,
        corporationIncome: 0,
        mentalChange: 0,
        netMoney: 0,
      };
      // 月収
      if (newState.job === 'バイト') {
        const jobInc = Math.floor(Math.random() * 30000) + 120000;
        newState.money += jobInc;
        report.jobIncome = jobInc;
        report.income += jobInc;
      } else if (newState.job === '会社員') {
        newState.money += 220000;
        report.jobIncome = 220000;
        report.income += 220000;
      }
      // 生活費
      if (newState.job === 'バイト') {
        newState.money -= 100000;
        report.expenses += 100000;
      } else {
        newState.money -= 180000;
        report.expenses += 180000;
      }
      // AI Pro サブスク
      if (newState.aiPlan === 'pro') {
        newState.money -= 50000;
        report.expenses += 50000;
      }
      // 法人化収益・固定費
      if (newState.corporation) {
        const corpRevenue = newState.followers * 100; // フォロワー1人あたり100円/月
        newState.money += corpRevenue;
        newState.money -= 100000; // 固定費（オフィス・人件費等）
        report.corporationIncome = corpRevenue;
        report.income += corpRevenue;
        report.expenses += 100000;
      }
      // 精神変動 (仮)
      // イベント判定
      newState = checkEvents(newState);
      report.mentalChange = newState.mental - prev.mental;
      report.netMoney = newState.money - prev.money;
      // 月次レポート設定
      newState.monthReport = report;
      // 破産チェック
      if (newState.money <= 0) {
        newState.gameOver = true;
        newState.message = '破産しました。ゲームオーバー';
      }
      // 次月
      newState.month += 1;
      newState.actionsLeft = 2;
      newState.jobs = generateJobs(newState.languages);
      if (newState.month > 12) {
        newState.endGame = true;
      }
      // キャリア変更
      if (newState.job === 'バイト' && newState.money >= 300000 && newState.languages.javascript >= 1) {
        newState.job = '会社員';
      }
      return newState;
    });
  };

  const checkEvents = (state) => {
    let newState = { ...state };
    if (newState.mental >= 90) {
      newState.actionsLeft = Math.max(0, newState.actionsLeft - 1); // 次月行動-1
      newState.message += ' 体調不良発生。次月の行動回数-1';
    }
    if (newState.mental <= 0) {
      newState.mental += 30;
      newState.actionsLeft = 0; // 強制休養
      newState.message += ' バーンアウト。次月強制休養';
    }
    return newState;
  };

  useEffect(() => {
    setGameState(prev => ({ ...prev, jobs: generateJobs(prev.languages) }));
  }, []);

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-red-400">ゲームオーバー</h1>
          <p className="mb-6">{gameState.message}</p>
          <button onClick={() => setGameState({
            month: 1,
            job: 'バイト',
            money: 100000,
            mental: 30,
            languages: { javascript: 0, python: 0, design: 0 },
            aiPlan: 'free',
            followers: 0,
            corporation: false,
            actionsLeft: 2,
            jobs: generateJobs({ javascript: 0, python: 0, design: 0 }),
            selectedJob: null,
            gameOver: false,
            endGame: false,
            message: '',
          })} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">リプレイ</button>
        </div>
      </div>
    );
  }

  if (gameState.endGame) {
    const langScore =
      gameState.languages.javascript * 10000 +
      gameState.languages.python * 12000 +
      gameState.languages.design * 8000;
    const score =
      gameState.money * 0.3 +
      langScore +
      gameState.mental * 1000;
    let ending = '破産寸前';
    if (score > 500000) ending = '安定した社会人';
    else if (score > 300000) ending = '攻める準備が整った個人';
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-green-400">エンディング</h1>
          <div className="text-left mb-6 space-y-2">
            <p>所持金: {gameState.money}円</p>
            <p>JavaScript Lv: {gameState.languages.javascript}</p>
            <p>Python Lv: {gameState.languages.python}</p>
            <p>デザイン Lv: {gameState.languages.design}</p>
            <p>フォロワー: {gameState.followers}</p>
            <p>精神: {gameState.mental}</p>
            <p className="text-xl font-bold text-yellow-400">エンディング: {ending}</p>
          </div>
          <button onClick={() => setGameState({
            month: 1,
            job: 'バイト',
            money: 100000,
            mental: 30,
            languages: { javascript: 0, python: 0, design: 0 },
            aiPlan: 'free',
            followers: 0,
            corporation: false,
            actionsLeft: 2,
            jobs: generateJobs({ javascript: 0, python: 0, design: 0 }),
            selectedJob: null,
            gameOver: false,
            endGame: false,
            message: '',
          })} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">リプレイ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Deploy Your Life</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">ステータス</h2>
            <p className="mb-2">月: {gameState.month}</p>
            <p className="mb-2">職業: {gameState.job}</p>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>所持金</span>
                <span>{gameState.money}円</span>
              </div>
              <div className="w-full bg-gray-700 rounded">
                <div className="h-4 bg-green-500 rounded" style={{ width: `${Math.min(gameState.money / 500000 * 100, 100)}%` }} />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className={`font-bold ${gameState.mental >= 80 ? 'text-red-400' : gameState.mental >= 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                  精神: {gameState.mental} ({gameState.mental >= 60 ? (gameState.mental >= 80 ? '危険' : '注意') : '安定'})
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded">
                <div className={`h-4 rounded ${gameState.mental >= 80 ? 'bg-red-500' : gameState.mental >= 60 ? 'bg-yellow-400' : 'bg-green-500'}`} style={{ width: `${gameState.mental}%` }} />
              </div>
            </div>
            <p className="mb-2">JavaScript: {gameState.languages.javascript}</p>
            <p className="mb-2">Python: {gameState.languages.python}</p>
            <p className="mb-2">デザイン: {gameState.languages.design}</p>
            <p className="mb-2">AI Plan: {gameState.aiPlan} ({gameState.aiPlan === 'pro' ? '月50,000円' : '無料'})</p>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>フォロワー</span>
                <span>{gameState.followers}</span>
              </div>
              <div className="w-full bg-gray-700 rounded">
                <div className="h-4 bg-blue-500 rounded" style={{ width: `${Math.min(gameState.followers / 1000 * 100, 100)}%` }} />
              </div>
            </div>
            <p className="mb-2">法人化: <span className={`px-3 py-1 rounded-full text-sm ${gameState.corporation ? 'bg-green-600' : 'bg-gray-600'}`}>{gameState.corporation ? '済' : '未'}</span></p>
            <p className="mb-2">残行動: {gameState.actionsLeft}</p>
            <p className="text-yellow-300 bg-gray-700 p-2 rounded">{gameState.message}</p>
            </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">行動</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">言語学習</h3>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => doAction('learn', 'javascript')} disabled={gameState.actionsLeft <= 0} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-gray-600">JavaScript</button>
                <button onClick={() => doAction('learn', 'python')} disabled={gameState.actionsLeft <= 0} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-gray-600">Python</button>
                <button onClick={() => doAction('learn', 'design')} disabled={gameState.actionsLeft <= 0} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-gray-600">デザイン</button>
              </div>
            </div>
            <div className="mb-4">
              <button onClick={() => doAction('post')} disabled={gameState.actionsLeft <= 0} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded w-full disabled:bg-gray-600">SNS投稿</button>
              <button onClick={() => doAction('rest')} disabled={gameState.actionsLeft <= 0} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded w-full mt-2 disabled:bg-gray-600">休養</button>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">副業案件</h2>
            <div className="space-y-4 mb-4">
              {gameState.jobs.map((job, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded border border-gray-600">
                  <p className="font-medium">{job.name}</p>
                  <p className="text-sm text-gray-300">必要スキル: {job.levelReq}</p>
                  <p className="text-sm text-green-400">報酬: {job.reward}円</p>
                  <p className="text-sm text-blue-400">精神: +{job.mentalGain}</p>
                  <button onClick={() => setGameState(prev => ({ ...prev, selectedJob: job }))} disabled={gameState.actionsLeft <= 0} className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded disabled:bg-gray-600">選択</button>
                </div>
              ))}
            </div>
            {gameState.selectedJob && <p className="text-yellow-300 mb-2">選択中: {gameState.selectedJob.name}</p>}
            <button onClick={() => doAction('job')} disabled={!gameState.selectedJob || gameState.actionsLeft <= 0} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full disabled:bg-gray-600">副業実行</button>
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">AIツール</h3>
              <div className="flex gap-2 mb-2">
                <button onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'free' }))} className={`py-2 px-4 rounded ${gameState.aiPlan === 'free' ? 'bg-blue-600' : 'bg-gray-600'} text-white`}>Free</button>
                <button onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'pro' }))} className={`py-2 px-4 rounded ${gameState.aiPlan === 'pro' ? 'bg-blue-600' : 'bg-gray-600'} text-white`}>Pro</button>
              </div>
              <p className="text-sm text-gray-300">Pro: 精神消費-10, 成功率+10%, 月50,000円</p>
            </div>
            {!gameState.corporation && gameState.money >= 200000 && gameState.languages.javascript >= 1 && gameState.languages.python >= 1 && gameState.languages.design >= 1 && gameState.followers >= 500 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">法人化</h3>
                <button onClick={() => doAction('incorporate')} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full">法人化する (200,000円)</button>
                <p className="text-sm text-gray-300 mt-1">条件: 所持金20万以上、各言語Lv1以上、フォロワー500以上</p>
              </div>
            )}
            <button onClick={endMonth} disabled={gameState.actionsLeft > 0} className="mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded w-full disabled:bg-gray-600">月末処理</button>
          </div>
        </div>
        {gameState.monthReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">📊 月次レポート (第{gameState.monthReport.month}ヶ月)</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>給料収入:</span>
                  <span className="text-green-400">+{gameState.monthReport.jobIncome.toLocaleString()}円</span>
                </div>
                {gameState.monthReport.freelanceIncome > 0 && (
                  <div className="flex justify-between">
                    <span>副業収入:</span>
                    <span className="text-green-400">+{gameState.monthReport.freelanceIncome.toLocaleString()}円</span>
                  </div>
                )}
                {gameState.monthReport.corporationIncome > 0 && (
                  <div className="flex justify-between">
                    <span>法人収益:</span>
                    <span className="text-green-400">+{gameState.monthReport.corporationIncome.toLocaleString()}円</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>生活費:</span>
                  <span className="text-red-400">-{gameState.monthReport.expenses.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-600 pt-2">
                  <span>収支合計:</span>
                  <span className={gameState.monthReport.netMoney >= 0 ? "text-green-400" : "text-red-400"}>
                    {gameState.monthReport.netMoney >= 0 ? '+' : ''}{gameState.monthReport.netMoney.toLocaleString()}円
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>精神変動:</span>
                  <span className={gameState.monthReport.mentalChange >= 0 ? "text-blue-400" : "text-red-400"}>
                    {gameState.monthReport.mentalChange >= 0 ? '+' : ''}{gameState.monthReport.mentalChange}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setGameState(prev => ({ ...prev, monthReport: null }))}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                次月へ進む
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;