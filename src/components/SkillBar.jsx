import { ActionButton } from './ActionButton';
import { useEffect, useState } from 'react';

export const SkillBar = ({ name, level, maxLevel = 5 }) => {
  const [animatedLevel, setAnimatedLevel] = useState(level);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (level > animatedLevel) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 700); // 0.7秒で消えるフラッシュ
      setAnimatedLevel(level);
      return () => clearTimeout(timeout);
    } else {
      setAnimatedLevel(level);
    }
  }, [level, animatedLevel]);

  return (
    <ActionButton
      onClick={() => {}}
      disabled
      colorClasses="bg-zinc-50 border-2 border-zinc-100 flex justify-between items-center"
      sizeClasses="py-2 px-3 text-xs"
    >
      <span className="font-bold text-zinc-600 uppercase">{name}</span>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[...Array(maxLevel)].map((_, i) => {
            const isFilled = i < animatedLevel;
            return (
              <div
                key={i}
                className={`
                  w-3 h-3 rounded-sm transition-all duration-500
                  ${isFilled ? 'shadow-lg scale-110' : 'bg-zinc-100'}
                  ${flash && isFilled ? 'animate-pulse' : ''}
                `}
                style={{
                  backgroundColor: isFilled ? `hsl(${i * 20 + 200},80%,50%)` : '#f3f3f3',
                  transform: isFilled ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.5s ease',
                }}
              />
            );
          })}
        </div>
        <span
          className={`font-black w-8 text-right transition-colors duration-500 ${
            flash ? 'text-yellow-400' : 'text-zinc-900'
          }`}
        >
          LV.{level}
        </span>
      </div>
    </ActionButton>
  );
};