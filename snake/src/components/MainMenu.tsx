/**
 * MainMenu - 主菜单遮罩
 *
 * 显示标题、开始按钮、统计概览、操作说明
 */

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useEngine } from './GameCanvas';
import { Button } from './ui/button';
import { StatsCard } from './StatsCard';

export function MainMenu() {
  const engine = useEngine();

  const handleStart = () => {
    engine.startGame();
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 p-8 w-full"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-center space-y-2">
          <h2 className="text-6xl font-extrabold tracking-widest text-primary text-glow">
            SNAKE
          </h2>
          <p className="text-sm text-muted-foreground">经典贪吃蛇 · v2.0</p>
        </div>

        <Button
          size="lg"
          onClick={handleStart}
          className="min-w-[200px]"
          aria-label="开始游戏"
        >
          <Play className="h-4 w-4 mr-2" />
          开始游戏
        </Button>

        {/* 统计概览 */}
        <StatsCard />

        <div className="text-center space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">↑↓←→</kbd>
            <span>/</span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">WASD</kbd>
            <span>移动</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">Space</kbd>
            <span>开始 / 重开</span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">P</kbd>
            <span>暂停</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">R</kbd>
            <span>重置</span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">M</kbd>
            <span>静音</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
