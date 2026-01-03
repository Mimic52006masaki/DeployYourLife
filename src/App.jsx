import { useState, useEffect } from 'react';

function App() {
  const [gameState, setGameState] = useState({
    month: 1,
    job: 'バイト',
    money: 100000,
    mental: 30,
    languages: { javascript: 0, python: 0, design: 0 },
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
        if (newState.mental >= 80) {
          reward = Math.floor(reward * 0.5); // ケアレスミス
          newState.message = 'ケアレスミス発生。';
        }
        if (success) {
          newState.money += reward;
          newState.mental += job.mentalGain;
          newState.message += `${job.name}完了。報酬+${reward}円, 精神+${job.mentalGain}`;
        } else {
          newState.message += `${job.name}失敗。報酬なし`;
        }
        newState.selectedJob = null;
      } else if (action === 'rest') {
        newState.mental = Math.max(0, newState.mental - 20);
        newState.message = '休養しました。精神-20';
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
    const score = gameState.money * 0.3 + gameState.skill * 10000 + gameState.mental * 1000; // 仮評価
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
        <p>残行動: {gameState.actionsLeft}</p>
        <p>{gameState.message}</p>
      </div>
      <div>
        <h3>言語学習</h3>
        <button onClick={() => doAction('learn', 'javascript')} disabled={gameState.actionsLeft <= 0}>JavaScript</button>
        <button onClick={() => doAction('learn', 'python')} disabled={gameState.actionsLeft <= 0}>Python</button>
        <button onClick={() => doAction('learn', 'design')} disabled={gameState.actionsLeft <= 0}>デザイン</button>
        <br />
        <button onClick={() => doAction('rest')} disabled={gameState.actionsLeft <= 0}>休養</button>
      </div>
      <div>
        <h2>副業案件</h2>
        {gameState.jobs.map((job, index) => (
          <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <p>{job.name}</p>
            <p>必要スキル: {job.skillReq}</p>
            <p>報酬: {job.reward}円</p>
            <p>精神: +{job.mentalGain}</p>
            <button onClick={() => setGameState(prev => ({ ...prev, selectedJob: job }))} disabled={gameState.actionsLeft <= 0}>選択</button>
          </div>
        ))}
        {gameState.selectedJob && <p>選択中: {gameState.selectedJob.name}</p>}
        <button onClick={() => doAction('job')} disabled={!gameState.selectedJob || gameState.actionsLeft <= 0}>副業実行</button>
      </div>
      <button onClick={endMonth} disabled={gameState.actionsLeft > 0}>月末処理</button>
    </div>
  );
}

export default App;