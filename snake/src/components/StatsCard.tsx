/**
 * StatsCard - 统计概览卡片
 *
 * 展示：总游戏次数 / 总吃食物数 / 最长存活时间 / 当前难度最高分
 */

import { useGameStore } from '../store/useGameStore';

/** 将秒数格式化为 "Xm Ys" 或 "Xs" */
function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export function StatsCard() {
  const statistics = useGameStore((s) => s.statistics);
  const difficulty = useGameStore((s) => s.difficulty);

  const items = [
    { label: '总游戏', value: statistics.gamesPlayed },
    { label: '总食物', value: statistics.totalFood },
    { label: '最长存活', value: formatDuration(statistics.maxSurvivalSec) },
    {
      label: `${difficulty} 最佳`,
      value: statistics.bestPerDifficulty[difficulty],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {items.map((item) => (
        <div
          key={item.label}
          className="p-2 rounded-lg bg-secondary/50 text-center"
        >
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {item.label}
          </div>
          <div className="font-mono text-lg font-bold tabular-nums">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
