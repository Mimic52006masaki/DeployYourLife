import { createContext, useContext, useReducer } from 'react';
import { PART_TIME_JOBS } from '../phaseConfig';

export const defaultConfig = {
  initialMoney: 1000,
  initialMental: 90,
  maxActions: 2,
  learningCost: 20000,
  learningGain: 1,
  learningMode: 'investment'
};

export const createInitialState = (config = defaultConfig) => ({
  player: {
    mental: config.initialMental,
    money: config.initialMoney,
    languages: { javascript: 0, python: 0, design: 0 },
    followers: 0,
    job: 'Unemployed',
    partTimeJob: null
  },
  economy: {
    money: config.initialMoney,
    maxActions: config.maxActions,
    actionsLeft: config.maxActions
  },
  quests: {
    selectedJob: null,
    jobs: []
  },
  game: {
    phase: 'parttime',
    monthReport: null,
    history: [],
    gameOver: false,
    endGame: false,
    products: [],
    employees: []
  },
  ai: {
    plan: 'free'
  },
  logs: [],
  config
});

// reducer で状態遷移を定義
function reducer(state, action) {
  const newState = JSON.parse(JSON.stringify(state)); // Deep copy
  const config = newState.config;

  switch (action.type) {
    case 'END_MONTH':
      const fatiguePenalty = 5;
      newState.player.mental = Math.max(0, newState.player.mental - fatiguePenalty);
      // 月末処理: 月報生成、phase変更、history追加など
      const month = newState.game.history.length + 1;
      const income = calculateIncome(newState);
      const expenses = calculateExpenses(newState);
      const netMoney = income.total - expenses.total;
      newState.economy.money += netMoney;
      newState.player.mental = Math.min(100, newState.player.mental + (action.payload?.mentalRecovery || 0));

      newState.game.monthReport = {
        month,
        income,
        expenses,
        netMoney,
        jobIncome: income.job,
        freelanceIncome: income.freelance,
        corporationIncome: income.corporation,
        employeeIncome: income.employee,
        employeeBonus: income.employeeBonus,
        productIncome: income.product,
        productDetails: income.productDetails || [],
        employeeDetails: income.employeeDetails || [],
        mentalChange: (action.payload?.mentalRecovery || 0) - fatiguePenalty,
        followerChange: 0 // TODO
      };
      newState.game.history.push({ month, netMoney, mental: newState.player.mental });
      newState.economy.actionsLeft = newState.economy.maxActions; // リセット
      // phase変更などはここで
      return newState;

    case 'CLOSE_MONTH_REPORT':
      newState.game.monthReport = null;
      return newState;

    case 'DO_ACTION':
      const { actionType, payload } = action.payload;
      switch (actionType) {
        case 'learn':
          if (newState.economy.actionsLeft > 0) {
            let cost, gain;

            if (config.learningMode === 'selfstudy') {
              cost = 0; // 無料
              gain = Math.max(1, Math.floor(config.learningGain * 0.5)); // 少なめ
            } else { // 投資モード
              cost = Math.min(config.learningCost, newState.economy.money);
              gain = Math.max(1, Math.floor(cost / 10000) * config.learningGain);
            }

            newState.economy.money -= cost;
            newState.player.languages[payload.lang] += gain;
            newState.economy.actionsLeft -= 1;

            const modeText = config.learningMode === 'selfstudy' ? '独学' : '投資';
            newState.logs.push({
              message: `Learned ${payload.lang.toUpperCase()} (+${gain} skill, cost ¥${cost}) [${modeText}]`,
              type: 'success'
            });
          }
          break;
        case 'develop':
          if (newState.economy.actionsLeft > 0) {
            // プロダクト開発ロジック
            newState.economy.actionsLeft -= 1;
            newState.logs.push({ message: 'Developed a new app', type: 'success' });
          }
          break;
        case 'post':
          if (newState.economy.actionsLeft > 0) {
            newState.player.followers += 10;
            newState.economy.actionsLeft -= 1;
            newState.logs.push({ message: 'Posted on SNS, gained followers', type: 'info' });
          }
          break;
        case 'rest':
          if (newState.economy.actionsLeft > 0) {
            newState.player.mental = Math.min(100, newState.player.mental + 20);
            newState.economy.actionsLeft -= 1;
            newState.logs.push({ message: 'Rested and recovered mental health', type: 'success' });
          }
          break;
        case 'change_parttime':
          if (newState.economy.actionsLeft > 0 && newState.player.partTimeJob) {
            // バイト変更: 現在のバイトを辞めて再選択可能に
            newState.player.partTimeJob = null;
            newState.economy.actionsLeft -= 1;
            newState.logs.push({ message: 'Changed part-time job. Select a new one.', type: 'info' });
          }
          break;
        default:
          break;
      }
      return newState;

    case 'RESET_GAME':
      return createInitialState(config);

    case 'ADD_LOG':
      newState.logs.push(action.payload);
      return newState;

    case 'SELECT_PARTTIME':
      const jobId = action.payload.jobId;
      const job = PART_TIME_JOBS.find(j => j.id === jobId);
      if (job) {
        newState.player.partTimeJob = job;
        newState.logs.push({ message: `Selected part-time job: ${job.name}`, type: 'info' });
      }
      return newState;

    default:
      return state;
  }
}

// 収入計算関数
export const calculateIncome = (state) => {
  let total = 0;
  const partTimeIncome = state.player.partTimeJob ? state.player.partTimeJob.income : 0;
  total += partTimeIncome;

  return {
    job: partTimeIncome,
    freelance: 0,
    corporation: 0,
    employee: 0,
    employeeBonus: 0,
    product: 0,
    productDetails: [],
    employeeDetails: [],
    total
  };
};

// 支出計算関数 (仮)
export const calculateExpenses = (state) => {
  return {
    total: 0
  };
};

// Context を作成
const GameStateContext = createContext();

// Provider を作成
export const GameStateProvider = ({ children, config }) => {
  const [gameState, dispatch] = useReducer(reducer, createInitialState(config));

  // ヘルパー関数
  const doAction = (actionType, payload) => {
    dispatch({ type: 'DO_ACTION', payload: { actionType, payload } });
  };

  const endMonth = () => {
    dispatch({ type: 'END_MONTH' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const getMentalEmoji = () => {
    const mental = gameState.player.mental;
    if (mental >= 80) return '😊';
    if (mental >= 60) return '😐';
    if (mental >= 40) return '😟';
    if (mental >= 20) return '😰';
    return '😵';
  };

  const getSkillDisplayName = (skill) => {
    return skill.toUpperCase();
  };

  const addLog = (message, type = 'info') => {
    dispatch({ type: 'ADD_LOG', payload: { message, type } });
  };

  return (
    <GameStateContext.Provider value={{
      gameState,
      dispatch,
      doAction,
      endMonth,
      resetGame,
      getMentalEmoji,
      getSkillDisplayName,
      addLog
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

// カスタムフック
export const useGameState = () => useContext(GameStateContext);