import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameStateContext = createContext();

const initialState = {
  player: {
    mental: 30,
    followers: 0,
    job: 'バイト',
    languages: { javascript: 0, python: 0, design: 0 },
  },
  economy: {
    money: 100000,
    actionsLeft: 2,
  },
  quests: {
    jobs: [],
    selectedJob: null,
  },
  ai: {
    plan: 'free',
  },
  game: {
    month: 1,
    corporation: false,
    gameOver: false,
    endGame: false,
    logs: [{ text: "SYSTEM: ゲームを開始しました。目標は12ヶ月で成功を収めることです。", type: "info" }],
    monthReport: null,
  },
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

const learnAction = (lang) => (state, addLog) => {
  if (state.economy.money < 20000) {
    addLog("💰 お金が足りない！", "error");
    return state;
  }
  const newState = {
    ...state,
    player: {
      ...state.player,
      languages: { ...state.player.languages },
      mental: state.player.mental + 5
    },
    economy: {
      ...state.economy,
      money: state.economy.money - 20000
    }
  };
  newState.player.languages[lang] += 1;
  addLog(`📖 ${lang.toUpperCase()} LEVEL UP!`, "success");
  return newState;
};

const jobAction = (state, addLog) => {
  if (!state.quests.selectedJob) return state;
  const job = state.quests.selectedJob;
  let reward = job.reward;
  let success = true;
  if (job.lang && state.player.languages[job.lang] < job.levelReq) {
    success = Math.random() > 0.5;
  }

  let mentalGain = job.mentalGain;
  if (state.ai.plan === 'pro') {
    mentalGain += 10;
    success = success || Math.random() < 0.1;
  }

  if (state.player.mental >= 80) {
    reward = Math.floor(reward * 0.5);
    addLog("😵 過労でミス連発...報酬激減！", "warning");
  }

  const followerBonus = 1 + Math.min(state.player.followers / 1000, 1);
  reward = Math.floor(reward * followerBonus);

  const newState = {
    ...state,
    economy: { ...state.economy },
    player: { ...state.player },
    quests: { ...state.quests, selectedJob: null },
    game: { ...state.game }
  };

  if (success) {
    newState.economy.money += reward;
    newState.player.mental += mentalGain;
    newState.game.monthReport = newState.game.monthReport || { freelanceIncome: 0 };
    newState.game.monthReport.freelanceIncome = (newState.game.monthReport.freelanceIncome || 0) + reward;
    addLog(`✨ 案件完了！ ¥${reward.toLocaleString()} 獲得`, "success");
  } else {
    addLog(`❌ 案件失敗... 信頼を失った`, "error");
  }
  return newState;
};

const restAction = (state, addLog) => {
  const newState = {
    ...state,
    player: {
      ...state.player,
      mental: Math.max(0, state.player.mental - 25)
    }
  };
  addLog("💤 HP（精神）が回復した！", "info");
  return newState;
};

const postAction = (state, addLog) => {
  let followChange = 0;
  let mentalChange = 0;
  const rand = Math.random();
  let proBonus = state.ai.plan === 'pro' ? 0.1 : 0;
  let flameRisk = 0.1 + (state.player.mental / 100) * 0.2 - proBonus;
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
  const newState = {
    ...state,
    player: {
      ...state.player,
      followers: Math.max(0, state.player.followers + followChange),
      mental: state.player.mental + mentalChange
    }
  };
  return newState;
};

const incorporateAction = (state, addLog) => {
  if (state.economy.money < 200000 || state.player.languages.javascript < 1 || state.player.languages.python < 1 || state.player.languages.design < 1 || state.player.followers < 500) {
    addLog("⚠️ 法人化のレベルに達していない", "warning");
    return state;
  }
  const newState = {
    ...state,
    economy: {
      ...state.economy,
      money: state.economy.money - 200000
    },
    game: {
      ...state.game,
      corporation: true
    }
  };
  addLog("会社を設立した！真の冒険の始まりだ", "success");
  return newState;
};

const checkEvents = (state, addLog) => {
  let newState = { ...state };
  if (newState.player.mental >= 90) {
    newState.economy.actionsLeft = Math.max(0, newState.economy.actionsLeft - 1);
    addLog("😨 メンタル限界。活動効率が低下中", "error");
  }
  if (newState.player.mental <= 0) {
    newState.player.mental += 30;
    newState.economy.actionsLeft = 0;
    addLog("⚠️ Overheat! 強制リブート（休養）", "error");
  }
  return newState;
};

const endMonthLogic = (state, addLog) => {
  let newState = { ...state };
  let report = {
    month: newState.game.month,
    income: 0,
    expenses: 0,
    jobIncome: 0,
    freelanceIncome: newState.game.monthReport?.freelanceIncome || 0,
    corporationIncome: 0,
    mentalChange: 0,
    netMoney: 0,
  };

  if (newState.player.job === 'バイト') {
    const jobInc = Math.floor(Math.random() * 30000) + 120000;
    newState.economy.money += jobInc;
    report.jobIncome = jobInc;
    report.income += jobInc;
  } else if (newState.player.job === '会社員') {
    newState.economy.money += 220000;
    report.jobIncome = 220000;
    report.income += 220000;
  }

  if (newState.player.job === 'バイト') {
    newState.economy.money -= 100000;
    report.expenses += 100000;
  } else {
    newState.economy.money -= 180000;
    report.expenses += 180000;
  }

  if (newState.ai.plan === 'pro') {
    newState.economy.money -= 50000;
    report.expenses += 50000;
  }

  if (newState.game.corporation) {
    const corpRevenue = newState.player.followers * 100;
    newState.economy.money += corpRevenue;
    newState.economy.money -= 100000;
    report.corporationIncome = corpRevenue;
    report.income += corpRevenue;
    report.expenses += 100000;
  }

  newState = checkEvents(newState, addLog);
  report.mentalChange = newState.player.mental - state.player.mental;
  report.netMoney = newState.economy.money - state.economy.money;
  newState.game.monthReport = report;

  if (newState.economy.money <= 0) {
    newState.game.gameOver = true;
  }

  newState.game.month += 1;
  newState.economy.actionsLeft = 2;
  newState.quests.jobs = generateJobs(newState.player.languages);
  if (newState.game.month > 12) {
    newState.game.endGame = true;
  }

  if (newState.player.job === 'バイト' && newState.economy.money >= 300000 && newState.player.languages.javascript >= 1) {
    newState.player.job = '会社員';
    addLog("🆙 JOB CHANGE: 会社員に昇格！", "success");
  }

  return newState;
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LOG':
      return {
        ...state,
        game: {
          ...state.game,
          logs: [{ text: action.payload.text, type: action.payload.type, time: action.payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...state.game.logs].slice(0, 15)
        }
      };
    case 'UPDATE_STATE':
      return action.payload;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const doAction = (action, lang) => {
    dispatch({ type: 'DO_ACTION', payload: { action, lang } });
  };

  const endMonth = () => {
    dispatch({ type: 'END_MONTH' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET' });
  };

  const getMentalEmoji = () => {
    if (state.player.mental >= 90) return "💀";
    if (state.player.mental >= 70) return "😨";
    if (state.player.mental >= 50) return "😐";
    return "😎";
  };

  const getSkillDisplayName = (lang) => {
    const names = { javascript: 'JavaScript', python: 'Python', design: 'デザイン' };
    return names[lang] || lang;
  };

  useEffect(() => {
    dispatch({ type: 'END_MONTH' }); // or something to generate initial jobs
  }, []);

  const value = {
    gameState: state,
    doAction,
    endMonth,
    resetGame,
    getMentalEmoji,
    getSkillDisplayName,
    dispatch,
  };

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

export const useGameState = () => useContext(GameStateContext);