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
      // 月収
      if (newState.job === 'バイト') {
        newState.money += Math.floor(Math.random() * 30000) + 120000;
      } else if (newState.job === '会社員') {
        newState.money += 220000;
      }
      // 生活費
      if (newState.job === 'バイト') {
        newState.money -= 100000;
      } else {
        newState.money -= 180000;
      }
      // AI Pro サブスク
      if (newState.aiPlan === 'pro') {
        newState.money -= 50000;
      }
      // 法人化収益・固定費
      if (newState.corporation) {
        const corpRevenue = newState.followers * 100; // フォロワー1人あたり100円/月
        newState.money += corpRevenue;
        newState.money -= 100000; // 固定費（オフィス・人件費等）
        newState.message += ` 法人収益+${corpRevenue}円, 固定費-100,000円`;
      }
      // 精神変動 (仮)
      // イベント判定
      newState = checkEvents(newState);
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
      <div>
        <h1>ゲームオーバー</h1>
        <p>{gameState.message}</p>
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
        })}>リプレイ</button>
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
      <div>
        <h1>エンディング</h1>
        <p>所持金: {gameState.money}</p>
        <p>JavaScript: {gameState.languages.javascript}</p>
        <p>Python: {gameState.languages.python}</p>
        <p>デザイン: {gameState.languages.design}</p>
        <p>精神: {gameState.mental}</p>
        <p>エンディング: {ending}</p>
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
        })}>リプレイ</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Deploy Your Life</h1>
      <div>
        <p>月: {gameState.month}</p>
        <p>職業: {gameState.job}</p>
        <p>所持金: {gameState.money}円</p>
        <p>精神: {gameState.mental} {gameState.mental >= 60 ? (gameState.mental >= 80 ? '危険' : '注意') : '安定'}</p>
        <p>JavaScript: {gameState.languages.javascript}</p>
        <p>Python: {gameState.languages.python}</p>
        <p>デザイン: {gameState.languages.design}</p>
        <p>AI Plan: {gameState.aiPlan} ({gameState.aiPlan === 'pro' ? '月50,000円' : '無料'})</p>
        <p>フォロワー: {gameState.followers}</p>
        <p>法人化: {gameState.corporation ? '済' : '未'}</p>
        <p>残行動: {gameState.actionsLeft}</p>
        <p>{gameState.message}</p>
      </div>
      <div>
        <h3>言語学習</h3>
        <button onClick={() => doAction('learn', 'javascript')} disabled={gameState.actionsLeft <= 0}>JavaScript</button>
        <button onClick={() => doAction('learn', 'python')} disabled={gameState.actionsLeft <= 0}>Python</button>
        <button onClick={() => doAction('learn', 'design')} disabled={gameState.actionsLeft <= 0}>デザイン</button>
        <br />
        <button onClick={() => doAction('post')} disabled={gameState.actionsLeft <= 0}>SNS投稿</button>
        <button onClick={() => doAction('rest')} disabled={gameState.actionsLeft <= 0}>休養</button>
      </div>
      <div>
        <h2>副業案件</h2>
        {gameState.jobs.map((job, index) => (
          <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <p>{job.name}</p>
            <p>必要スキル: {job.levelReq}</p>
            <p>報酬: {job.reward}円</p>
            <p>精神: +{job.mentalGain}</p>
            <button onClick={() => setGameState(prev => ({ ...prev, selectedJob: job }))} disabled={gameState.actionsLeft <= 0}>選択</button>
          </div>
        ))}
        {gameState.selectedJob && <p>選択中: {gameState.selectedJob.name}</p>}
        <button onClick={() => doAction('job')} disabled={!gameState.selectedJob || gameState.actionsLeft <= 0}>副業実行</button>
      </div>
      <div>
        <h3>AIツール</h3>
        <button onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'free' }))}>Free</button>
        <button onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'pro' }))}>Pro</button>
        <p>Pro: 精神消費-10, 成功率+10%, 月50,000円</p>
      </div>
      {!gameState.corporation && gameState.money >= 200000 && gameState.languages.javascript >= 1 && gameState.languages.python >= 1 && gameState.languages.design >= 1 && gameState.followers >= 500 && (
        <div>
          <h3>法人化</h3>
          <button onClick={() => doAction('incorporate')}>法人化する (200,000円)</button>
          <p>条件: 所持金20万以上、各言語Lv1以上、フォロワー500以上</p>
        </div>
      )}
      <button onClick={endMonth} disabled={gameState.actionsLeft > 0}>月末処理</button>
    </div>
  );
}

export default App;