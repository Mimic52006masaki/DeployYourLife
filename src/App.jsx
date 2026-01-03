import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Brain,
  Coins,
  Users,
  Code,
  Terminal,
  Palette,
  Zap,
  Moon,
  MessageSquare,
  ChevronRight,
  Building2,
  TrendingUp,
  AlertCircle,
  Skull,
  Gamepad2,
  Rocket,
  Sun
} from 'lucide-react';

function App() {
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

  useEffect(() => {
    setGameState(prev => ({ ...prev, jobs: generateJobs(prev.languages) }));
  }, []);

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

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-red-100 text-red-900 flex items-center justify-center p-6 font-mono">
        <div className="bg-white border-4 border-red-600 p-8 rounded-none shadow-[10px_10px_0px_0px_rgba(220,38,38,1)] text-center max-w-md w-full">
          <Skull className="text-red-600 w-20 h-20 mx-auto mb-4 animate-bounce" />
          <h1 className="text-5xl font-black mb-4 text-red-600 uppercase">Game Over</h1>
          <p className="text-zinc-600 mb-8 font-bold">資金ショート。世知辛い世の中に敗北しました。</p>
          <button onClick={resetGame} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 border-b-4 border-red-800 active:translate-y-1 active:border-b-0 transition-all">RETRY?</button>
        </div>
      </div>
    );
  }

  if (gameState.endGame) {
    const score = gameState.money * 0.3 + gameState.followers * 100 + gameState.mental * 1000;
    let rank = 'F';
    if (score > 1500000) rank = 'S';
    else if (score > 1000000) rank = 'A';
    else if (score > 500000) rank = 'B';

    return (
      <div className="min-h-screen bg-indigo-50 text-indigo-900 flex items-center justify-center p-6 font-mono">
        <div className="bg-white border-4 border-indigo-500 p-10 rounded-none shadow-[12px_12px_0px_0px_rgba(99,102,241,1)] max-w-xl w-full">
          <h1 className="text-4xl font-black mb-8 text-center text-indigo-600 italic">MISSION COMPLETE</h1>
          <div className="flex justify-center mb-8">
            <div className="text-8xl font-black text-yellow-400 border-8 border-yellow-400 p-4 rotate-12">{rank}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="bg-indigo-50 p-4 border-2 border-indigo-200">
              <p className="text-indigo-400 font-bold uppercase">Final Cash</p>
              <p className="text-xl font-bold">¥{gameState.money.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-50 p-4 border-2 border-indigo-200">
              <p className="text-indigo-400 font-bold uppercase">Influence</p>
              <p className="text-xl font-bold">{gameState.followers.toLocaleString()}</p>
            </div>
          </div>
          <button onClick={resetGame} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 transition-all">NEW GAME</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-zinc-800 font-mono p-2 md:p-6 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Top HUD */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border-2 border-zinc-900 p-4 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
          <div className="flex flex-col items-center md:items-start justify-center">
            <h1 className="text-xl font-black tracking-widest flex items-center gap-2 text-zinc-900">
              <Sun size={24} className="text-yellow-500" />
              DEPLOY_YOUR_LIFE.EXE
            </h1>
          </div>
          <div className="flex justify-center items-center gap-4 bg-zinc-50 p-2 border border-zinc-200">
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">Month</p>
              <p className="text-2xl font-black text-zinc-900">{gameState.month.toString().padStart(2, '0')}<span className="text-xs text-zinc-400">/12</span></p>
            </div>
            <div className="h-8 w-px bg-zinc-200"></div>
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">Actions</p>
              <div className="flex gap-1 justify-center mt-1">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-sm border ${i < gameState.actionsLeft ? 'bg-indigo-500 border-indigo-600' : 'bg-zinc-200 border-zinc-300'}`}></div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end items-center gap-4">
             <div className="bg-yellow-50 px-4 py-2 border-2 border-yellow-500 flex items-center gap-3">
               <Coins size={20} className="text-yellow-600" />
               <span className="text-2xl font-black text-zinc-900">¥{gameState.money.toLocaleString()}</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Status Column */}
          <div className="lg:col-span-3 space-y-4">
            <section className="bg-white border-2 border-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xs font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-4">STATUS</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-zinc-50 border-2 border-zinc-900 w-16 h-16 flex items-center justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {getMentalEmoji()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">HP / Mental Stress</p>
                    <div className="h-4 w-full bg-zinc-100 border border-zinc-300 mt-1 relative">
                      <div
                        className={`h-full transition-all duration-700 ${gameState.mental >= 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${100 - gameState.mental}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Skills_Tree</p>
                  {Object.entries(gameState.languages).map(([name, lv]) => (
                    <div key={name} className="flex justify-between items-center p-2 bg-zinc-50 border border-zinc-200 group hover:border-indigo-500 transition-colors">
                      <span className="text-xs font-bold uppercase text-zinc-600">{name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-1.5 h-3 ${i < lv ? 'bg-indigo-500' : 'bg-zinc-200'}`}></div>
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold">LV.{lv}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-zinc-50 border border-zinc-200 p-2">
                    <p className="text-zinc-400 font-bold">INFLUENCE</p>
                    <p className="text-sm font-bold text-zinc-900">{gameState.followers.toLocaleString()}</p>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 p-2">
                    <p className="text-zinc-400 font-bold">CORP</p>
                    <p className={`text-sm font-bold ${gameState.corporation ? 'text-indigo-600' : 'text-zinc-600'}`}>
                      {gameState.corporation ? 'ACTIVE' : 'NONE'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-zinc-900 text-white p-4 border-b-4 border-zinc-700 font-black flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="text-[10px] opacity-70 uppercase">Current Job</p>
              <p className="text-xl uppercase tracking-tighter">{gameState.job}</p>
            </div>
          </div>

          {/* Action Area */}
          <div className="lg:col-span-6 space-y-4">
            <section className="bg-white border-2 border-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xs font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-4">COMMAND_MENU</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-bold mb-1">DEVELOPMENT / -¥20,000</p>
                  <div className="grid grid-cols-1 gap-2">
                    {['javascript', 'python', 'design'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => doAction('learn', lang)}
                        disabled={gameState.actionsLeft <= 0}
                        className="bg-zinc-50 hover:bg-indigo-50 border-2 border-zinc-200 hover:border-indigo-500 p-3 flex justify-between items-center group disabled:opacity-30 disabled:hover:bg-zinc-50 disabled:hover:border-zinc-200 transition-all active:translate-y-0.5"
                      >
                        <span className="text-xs font-black uppercase text-zinc-700">{lang}</span>
                        <Code size={16} className="text-zinc-400 group-hover:text-indigo-500" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-bold mb-1">OTHERS / -1 ACTION</p>
                  <button onClick={() => doAction('post')} disabled={gameState.actionsLeft <= 0} className="w-full bg-zinc-50 hover:bg-indigo-50 border-2 border-zinc-200 hover:border-indigo-500 p-4 flex flex-col items-center gap-1 disabled:opacity-30 active:translate-y-0.5 transition-all group">
                    <TrendingUp size={20} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase text-zinc-700">SNS POST</span>
                  </button>
                  <button onClick={() => doAction('rest')} disabled={gameState.actionsLeft <= 0} className="w-full bg-zinc-50 hover:bg-amber-50 border-2 border-zinc-200 hover:border-amber-500 p-4 flex flex-col items-center gap-1 disabled:opacity-30 active:translate-y-0.5 transition-all group">
                    <Moon size={20} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase text-zinc-700">REST</span>
                  </button>
                </div>
              </div>

              {gameState.actionsLeft === 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
                  <button
                    onClick={endMonth}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-12 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
                  >
                    NEXT TURN
                  </button>
                </div>
              )}
            </section>

            {/* Terminal Logs */}
            <section className="bg-zinc-900 border-2 border-zinc-900 p-4 h-56 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-mono ml-2 text-zinc-500 uppercase tracking-widest">Live Output</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 pr-2 text-xs font-mono scrollbar-none">
                {gameState.logs.map((log, i) => (
                  <div key={i} className={`flex items-start gap-2 ${
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'error' ? 'text-red-400 font-bold' :
                    log.type === 'warning' ? 'text-yellow-400' :
                    'text-zinc-400'
                  }`}>
                    <span>&gt;</span>
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Side Panel */}
          <div className="lg:col-span-3 space-y-4">

            <section className="bg-white border-2 border-zinc-900 p-4 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xs font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-4">AVAILABLE_QUESTS</h2>
              <div className="space-y-2">
                {gameState.jobs.map((job, index) => (
                  <div
                    key={index}
                    className={`p-3 border-2 transition-all cursor-pointer ${
                      gameState.selectedJob?.name === job.name
                      ? 'bg-indigo-50 border-indigo-500'
                      : 'bg-zinc-50 border-zinc-100 hover:border-zinc-300'
                    }`}
                    onClick={() => setGameState(prev => ({ ...prev, selectedJob: job }))}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-bold truncate leading-tight uppercase text-zinc-900">{job.name}</p>
                      {job.lang && <span className="text-[8px] bg-zinc-900 text-white px-1">{job.lang}</span>}
                    </div>
                    <p className="text-sm font-black text-indigo-600">¥{job.reward.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => doAction('job')}
                disabled={!gameState.selectedJob || gameState.actionsLeft <= 0}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-black py-3 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all text-xs"
              >
                START QUEST
              </button>
            </section>

            {/* AI Enhancement */}
            <section className="bg-white border-2 border-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xs font-black text-zinc-400 mb-3 uppercase flex items-center gap-2"><Rocket size={12}/> AI_BOOSTER</h2>
              <div className="flex border-2 border-zinc-100 bg-zinc-50 p-1">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'free' }))}
                  className={`flex-1 py-1 text-[10px] font-black transition-all ${gameState.aiPlan === 'free' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  FREE
                </button>
                <button
                  onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'pro' }))}
                  className={`flex-1 py-1 text-[10px] font-black transition-all ${gameState.aiPlan === 'pro' ? 'bg-indigo-600 text-white shadow-inner' : 'text-zinc-400 hover:text-indigo-400'}`}
                >
                  PRO
                </button>
              </div>
            </section>

            {!gameState.corporation && (
              <button
                onClick={() => doAction('incorporate')}
                className="w-full py-3 bg-white hover:bg-indigo-50 text-indigo-600 border-2 border-indigo-500 font-black text-[10px] transition-all flex items-center justify-center gap-2 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]"
              >
                <Building2 size={14} /> [ FOUNDATION ]
              </button>
            )}

          </div>
        </div>

        {/* Month Summary Screen */}
        {gameState.monthReport && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border-4 border-zinc-900 p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)]">
              <h2 className="text-2xl font-black mb-8 text-center text-zinc-900 italic underline underline-offset-8 decoration-indigo-500">MONTHLY SUMMARY</h2>

              <div className="space-y-4 mb-10 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 uppercase font-bold">Income</span>
                  <span className="text-emerald-600 font-bold">+¥{gameState.monthReport.income.toLocaleString()}</span>
                </div>
                {gameState.monthReport.freelanceIncome > 0 && (
                  <div className="flex justify-between items-center text-[10px] pl-4">
                    <span className="text-zinc-400">-- Freelance</span>
                    <span className="text-emerald-500 font-bold">+¥{gameState.monthReport.freelanceIncome.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 uppercase font-bold">Expenses</span>
                  <span className="text-red-500 font-bold">-¥{gameState.monthReport.expenses.toLocaleString()}</span>
                </div>
                <div className="h-px bg-zinc-100 my-2"></div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-zinc-900 font-black text-xs uppercase">Net Gain</span>
                  <span className={`text-2xl font-black ${gameState.monthReport.netMoney >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {gameState.monthReport.netMoney >= 0 ? '+' : ''}¥{gameState.monthReport.netMoney.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setGameState(prev => ({ ...prev, monthReport: null }))}
                className="w-full bg-zinc-900 text-white font-black py-4 hover:bg-zinc-800 transition-all text-sm border-b-4 border-black"
              >
                NEXT STAGE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;