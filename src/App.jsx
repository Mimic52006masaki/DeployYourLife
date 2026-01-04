import React from 'react';
import { useGameState } from './contexts/GameStateContext.jsx';
import { HUD } from './components/HUD';
import { StatusPanel } from './components/StatusPanel';
import { CommandMenu } from './components/CommandMenu';
import { JobList } from './components/JobList';
import { SystemLogs } from './components/SystemLogs';
import { SummaryModal } from './components/SummaryModal';

function App() {
  const { gameState, doAction, endMonth, resetGame, getMentalEmoji, getSkillDisplayName, dispatch } = useGameState();

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center p-6 font-mono">
        <div className="bg-white border-4 border-red-600 p-8 shadow-[10px_10px_0px_0px_rgba(220,38,38,1)] text-center max-w-md w-full">
          <div className="text-red-600 w-16 h-16 mx-auto mb-4 text-4xl">💀</div>
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

        <HUD gameState={gameState} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Status (Order 2 on mobile, 1 on PC) */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <StatusPanel />
            <SystemLogs gameState={gameState} />
          </div>

          {/* Middle Column: Actions (Order 1 on mobile, 2 on PC) */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <CommandMenu />
          </div>

          {/* Right Column: Quests & Boosters (Order 3) */}
          <div className="lg:col-span-4 space-y-6 order-3">
            <JobList />
          </div>
        </div>

        <SummaryModal gameState={gameState} setGameState={setGameState} />
      </div>
    </div>
  );
}

export default App;