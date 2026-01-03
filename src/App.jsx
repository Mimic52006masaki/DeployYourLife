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
  Sun,
  Sparkles,
  MousePointer2
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
    logs: [{ text: "システム: ログイン成功。目標は12ヶ月で成功を収めることです。", type: "info" }],
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
        newState.languages = { ...newState.languages, [lang]: newState.languages[lang] + 1 };
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
        const rand = Math.random();
        if (rand < 0.15) {
          followChange = Math.floor(Math.random() * 100) + 50;
          addLog(`🚀 バズった！拡散力が上昇`, "success");
        } else {
          followChange = Math.floor(Math.random() * 10) + 5;
          addLog("📱 SNSに投稿した", "info");
        }
        newState.followers = Math.max(0, newState.followers + followChange);
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

      const jobInc = newState.job === 'バイト' ? 120000 : 220000;
      newState.money += jobInc;
      report.jobIncome = jobInc;
      report.income += jobInc;

      const rent = newState.job === 'バイト' ? 100000 : 180000;
      newState.money -= rent;
      report.expenses += rent;

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

      report.mentalChange = newState.mental - prev.mental;
      report.netMoney = newState.money - prev.money;
      newState.monthReport = report;

      if (newState.money <= 0) newState.gameOver = true;

      newState.month += 1;
      newState.actionsLeft = 2;
      newState.jobs = generateJobs(newState.languages);
      if (newState.month > 12) newState.endGame = true;

      if (newState.job === 'バイト' && newState.money >= 300000 && newState.languages.javascript >= 1) {
        newState.job = '会社員';
        addLog("🆙 JOB CHANGE: 会社員に昇格！", "success");
      }

      return newState;
    });
  };

  useEffect(() => {
    setGameState(prev => ({ ...prev, jobs: generateJobs(prev.languages) }));
  }, []);

  const resetGame = () => {
    window.location.reload();
  };

  const getMentalEmoji = () => {
    if (gameState.mental >= 90) return "💀";
    if (gameState.mental >= 70) return "😨";
    if (gameState.mental >= 50) return "😐";
    return "😎";
  };

  const getSkillDisplayName = (lang) => {
    const names = { javascript: 'JavaScript', python: 'Python', design: 'デザイン' };
    return names[lang] || lang;
  };

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center p-6 font-mono">
        <div className="bg-white border-4 border-red-600 p-8 shadow-[10px_10px_0px_0px_rgba(220,38,38,1)] text-center max-w-md w-full">
          <Skull className="text-red-600 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-black mb-4 text-red-600">GAME OVER</h1>
          <p className="text-zinc-600 mb-8 font-bold">資金ショート。再起を誓いましょう。</p>
          <button onClick={resetGame} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 border-b-4 border-red-800 active:translate-y-1 transition-all">RETRY</button>
        </div>
      </div>
    );
  }

  if (gameState.endGame) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6 font-mono">
        <div className="bg-white border-4 border-indigo-500 p-10 shadow-[12px_12px_0px_0px_rgba(99,102,241,1)] max-w-xl w-full text-center">
          <h1 className="text-4xl font-black mb-8 text-indigo-600">MISSION COMPLETE</h1>
          <div className="bg-indigo-50 p-6 border-2 border-indigo-200 mb-8">
            <p className="text-indigo-400 font-bold uppercase mb-2">Final Balance</p>
            <p className="text-4xl font-black">¥{gameState.money.toLocaleString()}</p>
          </div>
          <button onClick={resetGame} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 border-b-4 border-indigo-800 active:translate-y-1 transition-all">NEW GAME</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-zinc-800 font-mono p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HUD - Top Bar */}
        <header className="bg-white border-2 border-zinc-900 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-zinc-900 text-white p-3">
              <Sun size={24} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter">Deploy Your Life</h1>
              <p className="text-[10px] text-zinc-400 font-bold">SIMULATION_V2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-zinc-50 border border-zinc-200 px-6 py-2 w-full md:w-auto justify-center">
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">Month</p>
              <p className="text-xl font-black">{gameState.month}/12</p>
            </div>
            <div className="h-8 w-px bg-zinc-200"></div>
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">Actions</p>
              <div className="flex gap-1.5 mt-1 justify-center">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 border-2 ${i < gameState.actionsLeft ? 'bg-indigo-500 border-indigo-700 animate-pulse' : 'bg-zinc-200 border-zinc-300'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 px-6 py-2 border-2 border-yellow-500 flex items-center gap-4 w-full md:w-auto justify-center">
            <Coins size={20} className="text-yellow-600" />
            <span className="text-2xl font-black">¥{gameState.money.toLocaleString()}</span>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Status (Order 2 on mobile, 1 on PC) */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <section className="bg-white border-2 border-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-[10px] font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-6 uppercase">Player_Status</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-zinc-50 border-2 border-zinc-900 w-16 h-16 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {getMentalEmoji()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Mental Health</p>
                    <div className="h-3 w-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${gameState.mental >= 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${100 - gameState.mental}%` }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-100 pb-1">Skills</p>
                  {Object.entries(gameState.languages).map(([name, lv]) => (
                    <div key={name} className="flex justify-between items-center group">
                      <span className="text-xs font-bold text-zinc-600 uppercase">{getSkillDisplayName(name)}</span>
                      <div className="flex items-center gap-2">
                         <div className="flex gap-0.5">
                           {[...Array(5)].map((_, i) => (
                             <div key={i} className={`w-2 h-3 ${i < lv ? 'bg-indigo-500' : 'bg-zinc-100'}`} />
                           ))}
                         </div>
                         <span className="text-[10px] font-black w-8 text-right">LV.{lv}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-50 p-3 border border-zinc-200">
                    <p className="text-[9px] text-zinc-400 font-black uppercase">Followers</p>
                    <p className="text-sm font-black">{gameState.followers.toLocaleString()}</p>
                  </div>
                  <div className="bg-zinc-50 p-3 border border-zinc-200">
                    <p className="text-[9px] text-zinc-400 font-black uppercase">Role</p>
                    <p className="text-sm font-black text-indigo-600 truncate">{gameState.job}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-zinc-900 p-5 text-zinc-500 h-64 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
                <Terminal size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Log_Output</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none text-[10px] font-mono">
                {gameState.logs.map((log, i) => (
                  <div key={i} className={`${log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>
                    {'>'} {log.text}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Middle Column: Actions (Order 1 on mobile, 2 on PC) */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <section className="bg-white border-2 border-zinc-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[10px] font-black bg-zinc-900 text-white px-2 py-1 uppercase tracking-tighter">Command_Menu</h2>
                <div className="text-[10px] font-black text-indigo-500 animate-pulse uppercase tracking-widest">
                  {gameState.actionsLeft > 0 ? 'Wait_Input...' : 'Actions_Consumed'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Learn Section */}
                <div className="space-y-4">
                   <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Skill_Development</p>
                   <div className="grid grid-cols-1 gap-2">
                      {['javascript', 'python', 'design'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => doAction('learn', lang)}
                          disabled={gameState.actionsLeft <= 0 || gameState.money < 20000}
                          className="w-full flex justify-between items-center p-3 bg-zinc-50 hover:bg-white border-2 border-zinc-100 hover:border-indigo-500 transition-all disabled:opacity-30 group"
                        >
                          <span className="text-xs font-black uppercase">{getSkillDisplayName(lang)}</span>
                          <div className="bg-white group-hover:bg-indigo-500 group-hover:text-white p-1 rounded border border-zinc-200 transition-colors">
                            <Code size={14} />
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Other Actions */}
                <div className="space-y-4">
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Life_Execution</p>
                  <button 
                    onClick={() => doAction('post')} 
                    disabled={gameState.actionsLeft <= 0}
                    className="w-full flex items-center gap-4 p-4 bg-zinc-50 hover:bg-white border-2 border-zinc-100 hover:border-indigo-500 transition-all disabled:opacity-30 group"
                  >
                    <div className="bg-indigo-100 p-2 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <TrendingUp size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black">SNS POST</p>
                      <p className="text-[8px] text-zinc-400 font-bold uppercase">Increase Influence</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => doAction('rest')} 
                    disabled={gameState.actionsLeft <= 0}
                    className="w-full flex items-center gap-4 p-4 bg-zinc-50 hover:bg-white border-2 border-zinc-100 hover:border-amber-500 transition-all disabled:opacity-30 group"
                  >
                    <div className="bg-amber-100 p-2 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Moon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black">RECOVERY</p>
                      <p className="text-[8px] text-zinc-400 font-bold uppercase">Heal Mental Fatigue</p>
                    </div>
                  </button>
                </div>
              </div>

              {gameState.actionsLeft <= 0 && (
                <div className="mt-12 pt-8 border-t-2 border-dashed border-zinc-100 text-center animate-in fade-in slide-in-from-bottom-2">
                  <button
                    onClick={endMonth}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-12 border-b-4 border-indigo-900 shadow-xl active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3"
                  >
                    <Sparkles size={18} />
                    <span>NEXT TURN</span>
                    <MousePointer2 size={18} className="animate-bounce" />
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Quests & Boosters (Order 3) */}
          <div className="lg:col-span-4 space-y-6 order-3">
            <section className="bg-white border-2 border-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-[10px] font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-6 uppercase tracking-widest">Available_Quests</h2>
              <div className="space-y-3">
                {gameState.jobs.map((job, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 transition-all cursor-pointer ${
                      gameState.selectedJob?.name === job.name
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500 ring-offset-2'
                      : 'bg-zinc-50 border-zinc-100 hover:border-zinc-300'
                    }`}
                    onClick={() => setGameState(prev => ({ ...prev, selectedJob: job }))}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-black uppercase text-zinc-900">{job.name}</p>
                      {job.lang && <span className="text-[8px] bg-zinc-900 text-white px-1.5 py-0.5">{job.lang}</span>}
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-lg font-black text-indigo-600">¥{job.reward.toLocaleString()}</p>
                       <p className="text-[9px] text-zinc-400 font-bold uppercase">Target_Level: {job.levelReq}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => doAction('job')}
                disabled={!gameState.selectedJob || gameState.actionsLeft <= 0}
                className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-black py-4 border-b-4 border-emerald-800 active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest text-sm"
              >
                Accept Quest
              </button>
            </section>

            <section className="bg-white border-2 border-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-4">
                <Rocket size={16} className="text-indigo-500" />
                <h2 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">AI_Enhancement</h2>
              </div>
              <div className="flex gap-2 p-1 bg-zinc-100 border border-zinc-200">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'free' }))}
                  className={`flex-1 py-2 text-[10px] font-black uppercase transition-all ${gameState.aiPlan === 'free' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  Free
                </button>
                <button
                  onClick={() => setGameState(prev => ({ ...prev, aiPlan: 'pro' }))}
                  className={`flex-1 py-2 text-[10px] font-black uppercase transition-all ${gameState.aiPlan === 'pro' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-indigo-400'}`}
                >
                  Pro (¥50k)
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Summary Modal */}
        {gameState.monthReport && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white border-4 border-zinc-900 p-10 max-w-md w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-black mb-10 text-center uppercase italic underline decoration-indigo-500 underline-offset-8">Month Summary</h2>
              <div className="space-y-4 mb-12">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 uppercase font-bold tracking-widest">Income</span>
                  <span className="text-emerald-600 font-black text-lg">+¥{gameState.monthReport.income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 uppercase font-bold tracking-widest">Expenses</span>
                  <span className="text-red-500 font-black text-lg">-¥{gameState.monthReport.expenses.toLocaleString()}</span>
                </div>
                <div className="h-0.5 bg-zinc-900 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black uppercase">Net Surplus</span>
                  <span className={`text-3xl font-black ${gameState.monthReport.netMoney >= 0 ? "text-indigo-600" : "text-red-600"}`}>
                    ¥{gameState.monthReport.netMoney.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setGameState(prev => ({ ...prev, monthReport: null }))}
                className="w-full bg-zinc-900 text-white font-black py-5 hover:bg-zinc-800 transition-all uppercase tracking-widest"
              >
                Confirm Phase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;