import { useState, useEffect } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    month: 1,
    job: 'バイト',
    money: 100000,
    mental: 30,
    languages: { javascript: 0, python: 0, design: 0 },
    aiPlan: 'free',
    followers: 0,
    corporation: false,
    actionsLeft: 2,
    jobs: [],
    selectedJob: null,
    gameOver: false,
    endGame: false,
    logs: [{ text: "SYSTEM: ゲームを開始しました。目標は12ヶ月で成功を収めることです。", type: "info" }],
    monthReport: null,
  });

  const addLog = (text, type = "info") => {
    setGameState(prev => ({
      ...prev,
      logs: [{ text, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...prev.logs].slice(0, 15)
    }));
  };

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
    jobPool.push({ name: 'デバッグ', lang: null, levelReq: 0, reward: Math.floor(Math.random() * 30000) + 30000, mentalGain: 10 });

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
          addLog("💰 お金が足りない！", "error");
          return prev;
        }
        newState.languages = { ...newState.languages };
        newState.languages[lang] += 1;
        newState.money -= 20000;
        newState.mental += 5;
        addLog(`📖 ${lang.toUpperCase()} LEVEL UP!`, "success");
      } else if (action === 'job') {
        if (!newState.selectedJob) return prev;
        const job = newState.selectedJob;
        let reward = job.reward;
        let success = true;
        if (job.lang && newState.languages[job.lang] < job.levelReq) {
          success = Math.random() > 0.5;
        }

        let mentalGain = job.mentalGain;
        if (newState.aiPlan === 'pro') {
          mentalGain += 10;
          success = success || Math.random() < 0.1;
        }

        if (newState.mental >= 80) {
          reward = Math.floor(reward * 0.5);
          addLog("😵 過労でミス連発...報酬激減！", "warning");
        }

        const followerBonus = 1 + Math.min(newState.followers / 1000, 1);
        reward = Math.floor(reward * followerBonus);

        if (success) {
          newState.money += reward;
          newState.mental += mentalGain;
          if (!newState.monthReport) newState.monthReport = { freelanceIncome: 0 };
          newState.monthReport.freelanceIncome = (newState.monthReport.freelanceIncome || 0) + reward;
          addLog(`✨ 案件完了！ ¥${reward.toLocaleString()} 獲得`, "success");
        } else {
          addLog(`❌ 案件失敗... 信頼を失った`, "error");
        }
        newState.selectedJob = null;
      } else if (action === 'rest') {
        newState.mental = Math.max(0, newState.mental - 25);
        addLog("💤 HP（精神）が回復した！", "info");
      } else if (action === 'post') {
        let followChange = 0;
        let mentalChange = 0;
        const rand = Math.random();
        let proBonus = newState.aiPlan === 'pro' ? 0.1 : 0;
        let flameRisk = 0.1 + (newState.mental / 100) * 0.2 - proBonus;
        if (rand < flameRisk) {
          followChange = -Math.floor(Math.random() * 70) - 30;
          mentalChange = 20;
          addLog(`🔥 炎上発生！！ フォロワー急減`, "error");
        } else if (rand < flameRisk + 0.2 + proBonus) {
          followChange = Math.floor(Math.random() * 100) + 50;
          addLog(`🚀 バズった！拡散力が上昇`, "success");
        } else {
          followChange = Math.floor(Math.random() * 10) + 5;
          addLog("📱 SNSに投稿した", "info");
        }
        newState.followers = Math.max(0, newState.followers + followChange);
        newState.mental += mentalChange;
      } else if (action === 'incorporate') {
        if (newState.money < 200000 || newState.languages.javascript < 1 || newState.languages.python < 1 || newState.languages.design < 1 || newState.followers < 500) {
          addLog("⚠️ 法人化のレベルに達していない", "warning");
          return prev;
        }
        newState.money -= 200000;
        newState.corporation = true;
        addLog("会社を設立した！真の冒険の始まりだ", "success");
      }
      return newState;
    });
  };

  const endMonth = () => {
    setGameState(prev => {
      let newState = { ...prev };
      let report = {
        month: newState.month,
        income: 0,
        expenses: 0,
        jobIncome: 0,
        freelanceIncome: newState.monthReport?.freelanceIncome || 0,
        corporationIncome: 0,
        mentalChange: 0,
        netMoney: 0,
      };

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

      if (newState.job === 'バイト') {
        newState.money -= 100000;
        report.expenses += 100000;
      } else {
        newState.money -= 180000;
        report.expenses += 180000;
      }

      if (newState.aiPlan === 'pro') {
        newState.money -= 50000;
        report.expenses += 50000;
      }

      if (newState.corporation) {
        const corpRevenue = newState.followers * 100;
        newState.money += corpRevenue;
        newState.money -= 100000;
        report.corporationIncome = corpRevenue;
        report.income += corpRevenue;
        report.expenses += 100000;
      }

      newState = checkEvents(newState);
      report.mentalChange = newState.mental - prev.mental;
      report.netMoney = newState.money - prev.money;
      newState.monthReport = report;

      if (newState.money <= 0) {
        newState.gameOver = true;
      }

      newState.month += 1;
      newState.actionsLeft = 2;
      newState.jobs = generateJobs(newState.languages);
      if (newState.month > 12) {
        newState.endGame = true;
      }

      if (newState.job === 'バイト' && newState.money >= 300000 && newState.languages.javascript >= 1) {
        newState.job = '会社員';
        addLog("🆙 JOB CHANGE: 会社員に昇格！", "success");
      }

      return newState;
    });
  };

  const checkEvents = (state) => {
    let newState = { ...state };
    if (newState.mental >= 90) {
      newState.actionsLeft = Math.max(0, newState.actionsLeft - 1);
      addLog("😨 メンタル限界。活動効率が低下中", "error");
    }
    if (newState.mental <= 0) {
      newState.mental += 30;
      newState.actionsLeft = 0;
      addLog("⚠️ Overheat! 強制リブート（休養）", "error");
    }
    return newState;
  };

  const resetGame = () => {
    setGameState({
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
      logs: [{ text: "SYSTEM: ゲームを開始しました。", type: "info" }],
      monthReport: null,
    });
  };

  const getMentalEmoji = () => {
    if (gameState.mental >= 90) return "💀";
    if (gameState.mental >= 70) return "😨";
    if (gameState.mental >= 50) return "😐";
    return "😎";
  };

  useEffect(() => {
    setGameState(prev => ({ ...prev, jobs: generateJobs(prev.languages) }));
  }, []);

  return {
    gameState,
    doAction,
    endMonth,
    resetGame,
    getMentalEmoji,
    setGameState,
  };
};