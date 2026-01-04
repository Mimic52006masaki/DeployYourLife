import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PHASES, canDo } from '../phaseConfig';

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
    jobs: generateJobs({ javascript: 0, python: 0, design: 0 }),
    selectedJob: null,
  },
  ai: {
    plan: 'free',
  },
  game: {
    month: 1,
    phase: 'student',
    corporation: false,
    gameOver: false,
    endGame: false,
    logs: [{ text: "SYSTEM: ゲームを開始しました。目標は12ヶ月で成功を収めることです。", type: "info" }],
    monthReport: null,
    history: [],
    employees: [],
    monthlyRevenue: 0,
    products: [],
  },
};

function generateJobs(languages) {
  const jobPool = [];
  if (languages.javascript > 0) {
    jobPool.push({ name: 'LP制作 (JS)', lang: 'javascript', levelReq: 1, reward: Math.floor(Math.random() * 30000) + 50000, mentalGain: 15, maxTeam: Math.floor(Math.random() * 3) + 2 });
  }
  if (languages.javascript >= 2) {
    jobPool.push({ name: 'Web開発 (JS)', lang: 'javascript', levelReq: 2, reward: Math.floor(Math.random() * 20000) + 80000, mentalGain: 25, maxTeam: Math.floor(Math.random() * 3) + 2 });
  }
  if (languages.python >= 1) {
    jobPool.push({ name: 'API開発 (Python)', lang: 'python', levelReq: 1, reward: Math.floor(Math.random() * 40000) + 60000, mentalGain: 20, maxTeam: Math.floor(Math.random() * 3) + 2 });
  }
  if (languages.python >= 2) {
    jobPool.push({ name: 'データ分析 (Python)', lang: 'python', levelReq: 2, reward: Math.floor(Math.random() * 50000) + 100000, mentalGain: 30, maxTeam: Math.floor(Math.random() * 3) + 2 });
  }
  if (languages.design >= 1) {
    jobPool.push({ name: 'バナー制作', lang: 'design', levelReq: 1, reward: Math.floor(Math.random() * 20000) + 30000, mentalGain: 10, maxTeam: Math.floor(Math.random() * 3) + 2 });
  }
  jobPool.push({ name: 'デバッグ', lang: null, levelReq: 0, reward: Math.floor(Math.random() * 30000) + 30000, mentalGain: 10 });

  const numJobs = Math.floor(Math.random() * 3) + 1;
  const selectedJobs = [];
  for (let i = 0; i < numJobs && jobPool.length > 0; i++) {
    const idx = Math.floor(Math.random() * jobPool.length);
    selectedJobs.push(jobPool.splice(idx, 1)[0]);
  }
  return selectedJobs;
}

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

const developProductAction = () => (state, addLog) => {
  const jsLv = state.player.languages.javascript;

  if (jsLv < 1) {
    addLog("⚠️ JavaScript Lv1 が必要です", "error");
    return state;
  }

  const newProduct = {
    id: Date.now().toString(),
    name: `MyApp-${state.game.products.length + 1}`,
    stage: 'prototype',
    hasPayment: false,
    quality: 10 + jsLv * 5,
    users: 0,
    monthlyRevenue: 0,
    age: 0,
    lastBuzz: null,
    marketingBonus: { buzzBoost: 0, userBoost: 0, flamePenalty: 0 },
  };

  addLog("🛠 アプリのプロトタイプを作成した！", "success");

  return {
    ...state,
    game: {
      ...state.game,
      products: [...state.game.products, newProduct],
    },
  };
};

const deployProductAction = (id) => (state, addLog) => {
  const product = state.game.products.find(p => p.id === id);

  if (!product || product.stage !== 'prototype') {
    addLog("❌ デプロイできるアプリがありません", "error");
    return state;
  }

  const jsLv = state.player.languages.javascript;

  const updated = {
    ...product,
    stage: 'released',
    users: Math.floor(Math.random() * 50) + 10,
    quality: Math.max(0, product.quality - 2), // Deploy penalty
  };

  addLog("🚀 アプリを公開した！（品質が2下がった）", "warning");

  if (jsLv < 2) {
    addLog("😇 決済機能がなく、収益は¥0…", "warning");
  }

  return {
    ...state,
    game: {
      ...state.game,
      products: state.game.products.map(p =>
        p.id === id ? updated : p
      ),
    },
  };
};

const sellProductAction = (id) => (state, addLog) => {
  const product = state.game.products.find(p => p.id === id);
  if (!product || product.stage !== 'monetized' || product.age < 12 || product.monthlyRevenue < 10000) {
    addLog("❌ 売却条件を満たしていません", "error");
    return state;
  }

  const baseValue = product.monthlyRevenue * product.age * 10; // 適当
  const finalAmount = Math.min(baseValue, 5000000);

  const updatedProducts = state.game.products.map(p =>
    p.id === id ? { ...p, stage: 'sold' } : p
  );

  addLog(`💰 ${product.name} を売却！ ¥${finalAmount.toLocaleString()} 獲得`, "success");

  return {
    ...state,
    economy: {
      ...state.economy,
      money: state.economy.money + finalAmount,
    },
    game: {
      ...state.game,
      products: updatedProducts,
    },
  };
};

const hireEmployeeAction = (name, role) => (state, addLog) => {
  if (state.economy.money < 50000) {
    addLog("💰 お金が足りない！", "error");
    return state;
  }
  const salaries = { Developer: 50000, Designer: 45000, Marketer: 40000 };
  const salary = salaries[role] || 50000;
  const specialties = ['javascript', 'python', 'design'];
  const specialty = specialties[Math.floor(Math.random() * specialties.length)];
  const newEmployee = {
    id: Date.now().toString(),
    name,
    role,
    skill: 50,
    salary,
    morale: 80,
    level: 1,
    exp: 0,
    specialty,
    lastAssignedMonth: 0,
  };
  const newState = {
    ...state,
    economy: { ...state.economy, money: state.economy.money - 50000 },
    game: {
      ...state.game,
      employees: [...state.game.employees, newEmployee],
    },
  };
  addLog(`社員 ${name} を雇用しました！`, "success");
  return newState;
};

const fireEmployeeAction = (id) => (state, addLog) => {
  const employee = state.game.employees.find(e => e.id === id);
  if (!employee) return state;
  const newState = {
    ...state,
    game: {
      ...state.game,
      employees: state.game.employees.filter(e => e.id !== id),
    },
  };
  addLog(`社員 ${employee.name} を解雇しました。`, "info");
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

  // Skill bonus (use assigned team or all employees)
  const assignedEmployees = state.quests.assignedTeam ? state.game.employees.filter(emp => state.quests.assignedTeam.includes(emp.id)) : state.game.employees;
  let skillBonus = 0;
  if (job.lang === 'javascript' && assignedEmployees.some(emp => emp.role === 'Developer')) {
    skillBonus = Math.floor(reward * 0.2);
    reward += skillBonus;
    addLog("Developer社員のスキルボーナス！", "success");
  } else if (job.lang === 'python' && assignedEmployees.some(emp => emp.role === 'Developer')) {
    skillBonus = Math.floor(reward * 0.15);
    reward += skillBonus;
    addLog("Developer社員のスキルボーナス！", "success");
  } else if (job.lang === 'design' && assignedEmployees.some(emp => emp.role === 'Designer')) {
    skillBonus = Math.floor(reward * 0.25);
    reward += skillBonus;
    addLog("Designer社員のスキルボーナス！", "success");
  }

  // Cooperation bonus
  let coopBonus = 0;
  const devCount = state.game.employees.filter(emp => emp.role === 'Developer').length;
  const desCount = state.game.employees.filter(emp => emp.role === 'Designer').length;
  if (devCount >= 2 && (job.lang === 'javascript' || job.lang === 'python')) {
    coopBonus = Math.floor(reward * 0.1);
    reward += coopBonus;
    addLog(`複数Developer協力ボーナス！`, "success");
  } else if (desCount >= 2 && job.lang === 'design') {
    coopBonus = Math.floor(reward * 0.15);
    reward += coopBonus;
    addLog(`複数Designer協力ボーナス！`, "success");
  }

  // Specialty bonus
  let specialtyBonus = 0;
  if (assignedEmployees.some(emp => emp.specialty === job.lang)) {
    specialtyBonus = Math.floor(reward * 0.05);
    reward += specialtyBonus;
    addLog(`得意スキル社員のスペシャルボーナス！`, "success");
  }

  // High difficulty job skill dependency
  if (job.reward > 100000) {
    const hasSkilledDev = state.game.employees.some(emp => emp.role === 'Developer' && emp.skill > 70);
    const hasSkilledDes = state.game.employees.some(emp => emp.role === 'Designer' && emp.skill > 60);
    if ((job.lang === 'javascript' || job.lang === 'python') && !hasSkilledDev) {
      success = Math.random() > 0.7;
      addLog("高額案件のため、スキル不足でリスク高め...", "warning");
    } else if (job.lang === 'design' && !hasSkilledDes) {
      success = Math.random() > 0.8;
      addLog("高額デザイン案件のため、スキル不足でリスク高め...", "warning");
    }
  }

  const newState = {
    ...state,
    economy: { ...state.economy },
    player: { ...state.player },
    quests: { ...state.quests, selectedJob: null, assignedTeam: null },
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
  let buzzType = null;
  const rand = Math.random();
  let proBonus = state.ai.plan === 'pro' ? 0.1 : 0;
  let flameRisk = 0.1 + (state.player.mental / 100) * 0.2 - proBonus;

  // Select target product if available
  const releasedProducts = state.game.products.filter(p => p.stage === 'released' || p.stage === 'monetized');
  let targetProduct = null;
  if (releasedProducts.length > 0) {
    targetProduct = releasedProducts[Math.floor(Math.random() * releasedProducts.length)];
  }

  if (rand < flameRisk) {
    followChange = -Math.floor(Math.random() * 70) - 30;
    mentalChange = 20;
    buzzType = 'negative';
    addLog(`🔥 炎上発生！！ フォロワー急減`, "error");
    if (targetProduct) {
      targetProduct.users = Math.max(0, Math.floor(targetProduct.users * 0.7)); // 30% loss
      addLog(`😱 ${targetProduct.name} のユーザーが激減...`, "error");
      targetProduct.marketingBonus = { buzzBoost: 0, userBoost: 0, flamePenalty: 0 };
    }
  } else if (rand < flameRisk + 0.2 + proBonus) {
    followChange = Math.floor(Math.random() * 100) + 50;
    buzzType = 'positive';
    addLog(`🚀 バズった！拡散力が上昇`, "success");
    if (targetProduct) {
      targetProduct.users += Math.floor(Math.random() * 200) + 100;
      addLog(`🎉 ${targetProduct.name} がバズ！ユーザー急増`, "success");
      targetProduct.marketingBonus = { buzzBoost: 0, userBoost: 0, flamePenalty: 0 };
    }
  } else {
    followChange = Math.floor(Math.random() * 10) + 5;
    addLog("📱 SNSに投稿した", "info");
    if (targetProduct) {
      targetProduct.users += Math.floor(Math.random() * 10) + 5 + (targetProduct.marketingBonus.userBoost || 0);
      targetProduct.marketingBonus = { buzzBoost: 0, userBoost: 0, flamePenalty: 0 };
    }
  }

  const newState = {
    ...state,
    player: {
      ...state.player,
      followers: Math.max(0, state.player.followers + followChange),
      mental: state.player.mental + mentalChange
    },
    game: {
      ...state.game,
      products: state.game.products.map(p =>
        targetProduct && p.id === targetProduct.id ? targetProduct : p
      ),
      marketingBonus: { buzzBoost: 0, userBoost: 0, flamePenalty: 0 }
    }
  };
  return newState;
};

const fixBugAction = (id) => (state, addLog) => {
  const product = state.game.products.find(p => p.id === id);

  if (!product) return state;

  const qualityBoost = Math.floor(Math.random() * 6) + 5; // 5-10

  addLog("🛠 バグ修正に集中した。派手さはないが、土台が安定した。", "info");

  return {
    ...state,
    player: {
      ...state.player,
      mental: state.player.mental + 10,
    },
    game: {
      ...state.game,
      products: state.game.products.map(p =>
        p.id === id
          ? { ...p, quality: p.quality + qualityBoost }
          : p
      ),
    },
  };
};

const uiImproveAction = (id) => (state, addLog) => {
  const product = state.game.products.find(p => p.id === id);

  if (!product) return state;

  if (state.economy.money < 30000) {
    addLog("💰 お金が足りない！", "error");
    return state;
  }

  addLog("🎨 UIを改善。ユーザーの反応が明らかに良くなった。", "success");

  return {
    ...state,
    player: {
      ...state.player,
      mental: state.player.mental + 5,
    },
    economy: {
      ...state.economy,
      money: state.economy.money - 30000,
    },
    game: {
      ...state.game,
      products: state.game.products.map(p =>
        p.id === id
          ? { ...p, quality: p.quality + 3, users: p.users + 10 }
          : p
      ),
    },
  };
};

const marketingAction = (id) => (state, addLog) => {
  if (state.economy.money < 30000) {
    addLog("💰 お金が足りない！", "error");
    return state;
  }

  const product = state.game.products.find(p => p.id === id);
  if (!product) return state;

  const qualityAvg = state.game.products.length > 0 ? state.game.products.reduce((sum, p) => sum + p.quality, 0) / state.game.products.length : 0;
  const successChance = Math.min(0.8, 0.5 + qualityAvg / 100);

  let result;
  if (Math.random() < successChance) {
    result = 'buzzBoost';
    addLog(`📢 ${product.name} のマーケティング施策を実行した。次回バズ確率 +20%！`, "success");
  } else if (Math.random() < 0.5) {
    result = 'userBoost';
    addLog(`👀 ${product.name} の露出が増え、ユーザーが流入している…`, "info");
  } else {
    result = 'flamePenalty';
    addLog(`🔥 ${product.name} の広告表現が炎上気味だ…`, "warning");
  }

  const bonus = {
    buzzBoost: result === 'buzzBoost' ? 0.2 : 0,
    userBoost: result === 'userBoost' ? Math.floor(Math.random() * 31) + 30 : 0, // 30-60
    flamePenalty: result === 'flamePenalty' ? 0.1 : 0,
  };

  return {
    ...state,
    economy: {
      ...state.economy,
      money: state.economy.money - 30000,
    },
    game: {
      ...state.game,
      products: state.game.products.map(p =>
        p.id === id ? { ...p, marketingBonus: bonus } : p
      ),
    },
  };
};

const addPaymentAction = (id) => (state, addLog) => {
  const product = state.game.products.find(p => p.id === id);

  if (!product) return state;

  if (
    state.player.languages.javascript < 2 ||
    state.player.languages.python < 1
  ) {
    addLog("⚠️ 決済実装スキルが足りない", "error");
    return state;
  }

  addLog("💳 決済機能を実装！サブスク開始", "success");

  return {
    ...state,
    game: {
      ...state.game,
      products: state.game.products.map(p =>
        p.id === id
          ? { ...p, hasPayment: true, stage: 'monetized' }
          : p
      ),
    },
  };
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
    productIncome: 0,
    skillBonus: 0,
    coopBonus: 0,
    employeeIncome: 0,
    employeeBonus: 0,
    events: [],
    expensesBreakdown: {
      living: 0,
      pro: 0,
      corp: 0,
      employee: 0,
    },
    mentalChange: 0,
    followerChange: 0,
    netMoney: 0,
  };

  if (newState.game.phase === 'parttime') {
    const jobInc = Math.floor(Math.random() * 30000) + 120000;
    newState.economy.money += jobInc;
    report.jobIncome = jobInc;
    report.income += jobInc;
  } else if (newState.game.phase === 'employee') {
    newState.economy.money += 220000;
    report.jobIncome = 220000;
    report.income += 220000;
  }

  if (newState.game.phase === 'student') {
    // No expenses for student
  } else if (newState.game.phase === 'parttime') {
    newState.economy.money -= 100000;
    report.expenses += 100000;
    report.expensesBreakdown.living += 100000;
  } else {
    newState.economy.money -= 180000;
    report.expenses += 180000;
    report.expensesBreakdown.living += 180000;
  }

  if (newState.ai.plan === 'pro') {
    newState.economy.money -= 50000;
    report.expenses += 50000;
    report.expensesBreakdown.pro += 50000;
  }

  if (newState.game.corporation) {
    const corpRevenue = newState.player.followers * 100;
    newState.economy.money += corpRevenue;
    newState.economy.money -= 100000;
    report.corporationIncome = corpRevenue;
    report.income += corpRevenue;
    report.expenses += 100000;
    report.expensesBreakdown.corp += 100000;
  }

  newState = checkEvents(newState, addLog);

  // Product income calculation
  let productIncome = 0;
  newState.game.products = newState.game.products.map(p => {
    if (p.stage === 'sold') return p;

    p.age += 1;

    // Users growth for released+
    if (p.stage === 'released' || p.stage === 'monetized') {
      let userGrowth = Math.floor(Math.random() * 20) + 5;
      if (Math.random() < 0.1) {
        userGrowth *= 3;
        addLog(`🔥 ${p.name} がバズった！`, "success");
      }
      p.users += userGrowth;
    }

    let income = 0;
    if (p.hasPayment) {
      const base = 100;
      const followerScale = Math.log10(newState.player.followers + 10);
      const userScale = Math.log10(p.users + 10);
      const qualityBonus = p.quality / 20;
      const buzz = Math.random() < 0.1 ? 5 : 1;
      income = Math.floor(base * (followerScale * 0.6 + userScale * 0.4) * qualityBonus * buzz);
      p.monthlyRevenue = income;
    }

    productIncome += income;

    // 寿命
    if (p.age > 12 && Math.random() < 0.2) {
      p.stage = 'sold';
      addLog(`🪦 ${p.name} はサービス終了した`, "info");
    }

    return p;
  });

  newState.economy.money += productIncome;
  report.income += productIncome;
  report.productIncome = productIncome;

  // Employee logic
  let employeeExpenses = 0;
  let employeeRevenue = 0;
  newState.game.employees = newState.game.employees.map(emp => {
    employeeExpenses += emp.salary;
    let empRevenue = Math.floor(emp.skill * (emp.morale / 100) * 10000);

    // Employee events
    if (Math.random() < 0.15) { // 15% chance
      const eventRoll = Math.random();
      let event = {};
      if (eventRoll < 0.3) { // Skill boost
        emp.skill = Math.min(100, emp.skill + 10);
        event = { employee: emp.name, type: 'positive', description: 'スキルアップ！' };
        addLog(`${emp.name} のスキルが向上しました！`, "success");
      } else if (eventRoll < 0.6) { // Morale boost
        emp.morale = Math.min(100, emp.morale + 10);
        event = { employee: emp.name, type: 'positive', description: 'モラル向上！' };
        addLog(`${emp.name} のモラルが向上しました！`, "success");
      } else if (eventRoll < 0.8) { // Sick leave
        empRevenue = 0; // No revenue this month
        event = { employee: emp.name, type: 'negative', description: '病気休暇' };
        addLog(`${emp.name} が病気で休暇を取りました...`, "warning");
      } else { // Morale drop
        emp.morale = Math.max(50, emp.morale - 10);
        event = { employee: emp.name, type: 'negative', description: '不満爆発' };
        addLog(`${emp.name} が不満を爆発させました...`, "error");
      }
      report.events.push(event);
    }

    employeeRevenue += empRevenue;

    // Experience gain
    emp.exp += Math.floor(100 * (emp.morale / 100));

    // Level up check
    const expRequired = emp.level * 1000;
    if (emp.exp >= expRequired) {
      emp.level += 1;
      emp.skill = Math.min(100, emp.skill + 5);
      emp.exp = 0;
      report.events.push({ employee: emp.name, type: 'levelup', description: `レベルアップ！ Lv.${emp.level}` });
      addLog(`${emp.name} がレベルアップしました！ Lv.${emp.level}`, "success");
    }

    return { ...emp, morale: Math.max(50, emp.morale - 5) };
  });
  // Employee bonus
  const totalBonus = newState.game.employees.reduce((sum, emp) => sum + emp.level * 5000, 0);
  newState.economy.money -= employeeExpenses;
  newState.economy.money += employeeRevenue + totalBonus;
  newState.game.monthlyRevenue = employeeRevenue + totalBonus;
  report.employeeIncome = employeeRevenue;
  report.employeeBonus = totalBonus;
  report.expenses += employeeExpenses;
  report.expensesBreakdown.employee += employeeExpenses;
  report.income += employeeRevenue + totalBonus;

  report.mentalChange = newState.player.mental - state.player.mental;
  report.followerChange = newState.player.followers - state.player.followers;
  report.netMoney = newState.economy.money - state.economy.money;
  newState.game.monthReport = report;
  newState.game.history = [...newState.game.history, report].slice(-6);

  // Phase transitions
  if (newState.game.phase === 'student' && newState.economy.money >= 100000) {
    newState.game.phase = 'parttime';
    addLog("🚀 PHASE CHANGE: バイトフェーズへ移行！", "success");
  } else if (newState.game.phase === 'parttime' && newState.player.languages.javascript >= 1) {
    newState.game.phase = 'employee';
    addLog("🚀 PHASE CHANGE: 会社員フェーズへ移行！", "success");
  } else if (newState.game.phase === 'employee' && newState.economy.money >= 300000 && newState.player.languages.javascript >= 1) {
    newState.game.phase = 'freelance';
    addLog("🚀 PHASE CHANGE: フリーランスフェーズへ移行！", "success");
  } else if (newState.game.phase === 'freelance' && newState.economy.money >= 200000 && newState.player.languages.javascript >= 1 && newState.player.languages.python >= 1 && newState.player.languages.design >= 1 && newState.player.followers >= 500) {
    newState.game.phase = 'corporation';
    newState.game.corporation = true;
    addLog("🏢 PHASE CHANGE: 法人フェーズへ移行！会社設立！", "success");
  }

  if (newState.economy.money <= 0) {
    newState.game.gameOver = true;
  }

  newState.game.month += 1;
  newState.economy.actionsLeft = 2;
  newState.quests.jobs = generateJobs(newState.player.languages);

  // End game conditions
  if (newState.game.month > 36) {
    newState.game.endGame = true;
    addLog("⏰ 3年が経過しました。ゲーム終了。", "info");
  } else if (newState.game.phase === 'corporation' && newState.economy.money >= 10000000) {
    newState.game.endGame = true;
    addLog("💰 経済的自由を達成しました！おめでとうございます。", "success");
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
    case 'DO_ACTION':
      {
        const { action: actionType, lang, name, role, id, addLog } = action.payload;
        if (!canDo(actionType, state)) {
          addLog(`🔒 ${PHASES[state.game.phase].label}フェーズでは実行できません`);
          return state;
        }
        let newState = { ...state };
        if (actionType === 'learn') {
          newState = learnAction(lang)(newState, addLog);
        } else if (actionType === 'develop') {
          newState = developProductAction()(newState, addLog);
        } else if (actionType === 'deploy') {
          newState = deployProductAction(lang)(newState, addLog);
        } else if (actionType === 'sell') {
          newState = sellProductAction(lang)(newState, addLog);
        } else if (actionType === 'payment') {
          newState = addPaymentAction(lang)(newState, addLog);
        } else if (actionType === 'fix_bug') {
          newState = fixBugAction(lang)(newState, addLog);
        } else if (actionType === 'ui_improve') {
          newState = uiImproveAction(lang)(newState, addLog);
        } else if (actionType === 'marketing') {
          newState = marketingAction(lang)(newState, addLog);
        } else if (actionType === 'job') {
          newState = jobAction(newState, addLog);
        } else if (actionType === 'rest') {
          newState = restAction(newState, addLog);
        } else if (actionType === 'post') {
          newState = postAction(newState, addLog);
        } else if (actionType === 'incorporate') {
          newState = incorporateAction(newState, addLog);
        } else if (actionType === 'hire') {
          newState = hireEmployeeAction(name, role)(newState, addLog);
        } else if (actionType === 'fire') {
          newState = fireEmployeeAction(id)(newState, addLog);
        }
        newState = checkEvents(newState, addLog);
        const penalty = PHASES[state.game.phase].actionPenalty || 0;
        if (newState.economy.actionsLeft > 0 && actionType !== 'hire' && actionType !== 'fire') {
          newState.economy.actionsLeft -= (1 + penalty);
        }
        return newState;
      }
    case 'END_MONTH':
      {
        const { addLog } = action.payload;
        const newState = endMonthLogic(state, addLog);
        return newState;
      }
    case 'CHANGE_PHASE':
      addLog(`🚀 ${PHASES[action.payload].label}フェーズに移行しました！`);
      return {
        ...state,
        game: {
          ...state.game,
          phase: action.payload,
        },
      };
    default:
      return state;
  }
};

export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const addLog = (text, type) => {
    dispatch({ type: 'ADD_LOG', payload: { text, type } });
  };

  const doAction = (action, lang) => {
    dispatch({ type: 'DO_ACTION', payload: { action, lang, addLog } });
  };

  const hireEmployee = (name, role) => {
    dispatch({ type: 'DO_ACTION', payload: { action: 'hire', name, role, addLog } });
  };

  const fireEmployee = (id) => {
    dispatch({ type: 'DO_ACTION', payload: { action: 'fire', id, addLog } });
  };

  const endMonth = () => {
    dispatch({ type: 'END_MONTH', payload: { addLog } });
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



  const value = {
    gameState: state,
    doAction,
    endMonth,
    resetGame,
    getMentalEmoji,
    getSkillDisplayName,
    dispatch,
    hireEmployee,
    fireEmployee,
  };

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

export const useGameState = () => useContext(GameStateContext);