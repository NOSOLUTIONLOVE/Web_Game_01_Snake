/**
 * HUD - 顶部状态栏
 *
 * 显示标题、分数、最高分、设置按钮
 * v3.0：分数变化时通过 aria-live 播报，增强可访问性
 */

import { Settings, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { SettingsPanel } from './SettingsPanel';

export function HUD() {
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const isNewRecord = useGameStore((s) => s.isNewRecord);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const toggleAudio = useGameStore((s) => s.toggleAudio);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between w-full px-2">
        {/* 左侧标题 */}
        <h1 className="text-3xl font-extrabold tracking-widest text-primary text-glow">
          SNAKE
        </h1>

        {/* 右侧分数 + 按钮 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Score
              </div>
              <motion.div
                key={score}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="font-mono text-xl font-bold text-foreground tabular-nums"
              >
                {score}
              </motion.div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Best
              </div>
              <motion.div
                key={`best-${highScore}`}
                initial={{ scale: 1 }}
                animate={isNewRecord ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`font-mono text-xl font-bold tabular-nums ${
                  isNewRecord ? 'text-yellow-400 text-glow' : 'text-accent'
                }`}
              >
                {highScore}
              </motion.div>
            </div>
          </div>

          {isNewRecord && (
            <Badge variant="success" className="animate-scale-in">
              NEW!
            </Badge>
          )}

          {/* 音效按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudio}
            aria-label={audioEnabled ? '关闭音效' : '开启音效'}
          >
            {audioEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>

          {/* 设置按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            aria-label="设置"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 分数播报（视觉隐藏，供屏幕阅读器） */}
      <div className="sr-only" aria-live="polite" role="status">
        得分 {score} 分
      </div>

      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
