/**
 * GameOverModal - 游戏结束弹窗
 *
 * 显示本局分数、最高分、新纪录徽章、本局统计、重开/回主菜单按钮
 */

import { motion } from 'framer-motion';
import { RotateCcw, Home, Trophy } from 'lucide-react';
import { useEngine } from './GameCanvas';
import { useGameStore } from '../store/useGameStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

/** 将秒数格式化为 "Xm Ys" 或 "Xs" */
function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export function GameOverModal() {
  const engine = useEngine();
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const isNewRecord = useGameStore((s) => s.isNewRecord);
  const phase = useGameStore((s) => s.phase);
  const lastRoundFood = useGameStore((s) => s.lastRoundFood);
  const lastRoundSec = useGameStore((s) => s.lastRoundSec);

  const open = phase === 'over';

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.3 }}
        >
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-extrabold text-destructive">
              GAME OVER
            </DialogTitle>
            <DialogDescription>蛇撞到了，本局结束</DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {isNewRecord && (
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <Badge variant="success" className="text-sm px-3 py-1">
                  <Trophy className="h-3 w-3 mr-1" />
                  NEW RECORD!
                </Badge>
              </motion.div>
            )}

            {/* 分数 / 最高分 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Score
                </div>
                <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                  {score}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Best
                </div>
                <div className="font-mono text-2xl font-bold text-accent tabular-nums">
                  {highScore}
                </div>
              </div>
            </div>

            {/* 本局统计 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  本局食物
                </div>
                <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                  {lastRoundFood}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  本局时长
                </div>
                <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                  {formatDuration(lastRoundSec)}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              className="w-full"
              onClick={() => engine.startGame()}
              aria-label="再来一局"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              再来一局
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => engine.backToMenu()}
              aria-label="回主菜单"
            >
              <Home className="h-4 w-4 mr-2" />
              回主菜单
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
