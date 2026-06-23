/**
 * Overlays - 统一管理游戏状态遮罩
 *
 * 根据 phase 显示对应遮罩：
 * - menu: MainMenu
 * - countdown: Countdown（倒计时数字）
 * - paused: PauseOverlay
 * - over: GameOverModal
 */

import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { MainMenu } from './MainMenu';
import { PauseOverlay } from './PauseOverlay';
import { GameOverModal } from './GameOverModal';
import { Countdown } from './Countdown';

interface OverlaysProps {
  /** 倒计时数字（3/2/1/0，0 表示 GO），由 GameCanvas 从 engine 同步 */
  countdownNum: number;
}

export function Overlays({ countdownNum }: OverlaysProps) {
  const phase = useGameStore((s) => s.phase);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence mode="wait">
        {phase === 'menu' && <MainMenu key="menu" />}
        {phase === 'paused' && <PauseOverlay key="paused" />}
      </AnimatePresence>
      {/* 倒计时遮罩：独立于 AnimatePresence，避免与 menu/paused 切换冲突 */}
      {phase === 'countdown' && <Countdown key="countdown" num={countdownNum} />}
      {phase === 'over' && <GameOverModal key="over" />}
    </div>
  );
}
