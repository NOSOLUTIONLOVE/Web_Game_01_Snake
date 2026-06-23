/**
 * SettingsPanel - 设置弹窗（v3.0 多分组）
 *
 * 分组：难度 / 主题 / 网格尺寸 / 穿墙 / 音效 / 音量
 * 直接读写 store，不再使用 react-hook-form
 */

import { Volume2 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import type { Difficulty, GridSize, Theme } from '../config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** 难度选项 */
const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'normal', label: '普通' },
  { value: 'hard', label: '困难' },
];

/** 主题选项 */
const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'dark', label: '暗黑紫' },
  { value: 'neon', label: '霓虹绿' },
  { value: 'classic', label: '经典黑白' },
];

/** 网格尺寸选项 */
const GRID_OPTIONS: { value: GridSize; label: string }[] = [
  { value: 'small', label: '小 (15×15)' },
  { value: 'medium', label: '中 (20×20)' },
  { value: 'large', label: '大 (25×25)' },
];

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  // 从 store 读取当前设置
  const difficulty = useGameStore((s) => s.difficulty);
  const theme = useGameStore((s) => s.theme);
  const gridSize = useGameStore((s) => s.gridSize);
  const wrapWall = useGameStore((s) => s.wrapWall);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const volume = useGameStore((s) => s.volume);

  // store actions
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const setTheme = useGameStore((s) => s.setTheme);
  const setGridSize = useGameStore((s) => s.setGridSize);
  const setWrapWall = useGameStore((s) => s.setWrapWall);
  const setAudioEnabled = useGameStore((s) => s.setAudioEnabled);
  const setVolume = useGameStore((s) => s.setVolume);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
          <DialogDescription>调整游戏偏好</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* 难度单选组 */}
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium">难度</div>
              <div className="text-xs text-muted-foreground">影响初始速度与障碍物</div>
            </div>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="难度">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={difficulty === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(opt.value)}
                  aria-label={`难度：${opt.label}`}
                  role="radio"
                  aria-checked={difficulty === opt.value}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* 主题单选组 */}
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium">主题</div>
              <div className="text-xs text-muted-foreground">切换配色方案</div>
            </div>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="主题">
              {THEME_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={theme === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme(opt.value)}
                  aria-label={`主题：${opt.label}`}
                  role="radio"
                  aria-checked={theme === opt.value}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* 网格尺寸单选组 */}
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium">网格尺寸</div>
              <div className="text-xs text-muted-foreground">影响棋盘大小与单格尺寸</div>
            </div>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="网格尺寸">
              {GRID_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={gridSize === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGridSize(opt.value)}
                  aria-label={`网格尺寸：${opt.label}`}
                  role="radio"
                  aria-checked={gridSize === opt.value}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* 穿墙模式 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">穿墙模式</div>
              <div className="text-xs text-muted-foreground">撞墙后从对侧穿出</div>
            </div>
            <Switch
              checked={wrapWall}
              onCheckedChange={setWrapWall}
              aria-label="穿墙模式"
            />
          </div>

          <Separator />

          {/* 音效开关 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">音效</div>
                <div className="text-xs text-muted-foreground">游戏音效开关</div>
              </div>
            </div>
            <Switch
              checked={audioEnabled}
              onCheckedChange={setAudioEnabled}
              aria-label="音效开关"
            />
          </div>

          {/* 音量滑块 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">音量</div>
                <div className="text-xs text-muted-foreground">调整音效大小</div>
              </div>
              <span className="font-mono text-sm text-muted-foreground tabular-nums">
                {volume}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
              aria-label="音量"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
