import { SkillBar } from './SkillBar';
import { ActionButton } from './ActionButton';
import { useEffect, useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';

export const StatusPanel = () => {
  const { gameState, getMentalEmoji, getSkillDisplayName } = useGameState();
  const mapSkills = (languages) =>
    Object.entries(languages).map(([name, lv]) => ({
      name: getSkillDisplayName(name),
      level: lv,
    }));

  // アニメーション用 state
  const [mentalWidth, setMentalWidth] = useState(0);
  const [mentalColor, setMentalColor] = useState('hsl(120,100%,50%)'); // 初期は緑

  useEffect(() => {
    // 幅の更新
    setMentalWidth(100 - gameState.player.mental);

    // HSLで色を滑らかに変化
    const hue = (gameState.player.mental / 100) * 120; // 0%→0(hue:red), 100%→120(hue:green)
    setMentalColor(`hsl(${hue},100%,50%)`);
  }, [gameState.player.mental]);

  return (
    <section className="bg-white border-2 border-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-[10px] font-black bg-zinc-900 text-white px-2 py-1 inline-block mb-6 uppercase">Player_Status</h2>

      <div className="space-y-6">
        {/* Mental Health */}
        <ActionButton
          onClick={() => {}}
          disabled
          colorClasses={`flex justify-between items-center text-white`}
          sizeClasses="py-2 px-3 text-sm"
        >
          <span className="text-2xl">{getMentalEmoji()}</span>
          <div className="flex-1 ml-3 h-3 bg-zinc-100 rounded overflow-hidden border border-zinc-200">
            <div
              className={`h-full transition-all duration-700 ${
                gameState.player.mental <= 20 ? 'animate-pulse' : ''
              }`}
              style={{ width: `${mentalWidth}%`, backgroundColor: mentalColor }}
            />
          </div>
        </ActionButton>

        {/* Skills */}
        <div className="space-y-2">
          {mapSkills(gameState.player.languages).map((skill) => (
            <SkillBar key={skill.name} name={skill.name} level={skill.level} />
          ))}
        </div>

        {/* Followers & Role */}
        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            onClick={() => {}}
            disabled
            colorClasses="bg-zinc-50 border border-zinc-200 flex-col items-start py-3 px-3"
            sizeClasses="text-xs"
          >
            <span className="text-zinc-400 font-black uppercase">Followers</span>
            <span className="text-sm font-black">{gameState.player.followers.toLocaleString()}</span>
          </ActionButton>
          <ActionButton
            onClick={() => {}}
            disabled
            colorClasses="bg-zinc-50 border border-zinc-200 flex-col items-start py-3 px-3"
            sizeClasses="text-xs"
          >
            <span className="text-zinc-400 font-black uppercase">Role</span>
            <span className="text-sm font-black text-indigo-600 truncate">{gameState.player.job}</span>
          </ActionButton>
        </div>
      </div>
    </section>
  );
};