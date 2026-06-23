/**
 * GameCanvas - Canvas 挂载点 + GameEngine 生命周期管理（v3.0）
 *
 * 职责：
 * - 渲染 <canvas> 元素，外层 div 作为 container 传给 Renderer（DPR 自适应）
 * - useEffect 实例化 GameEngine，卸载时清理
 * - 通过 Context 暴露 engine 实例给子组件（HUD/Overlays）
 * - 同步 audioEnabled 到 engine
 * - v3.0 新增：同步 difficulty/gridSize/theme/wrapWall/volume 到 engine.applySettings()
 * - v3.0 新增：连接 onCountdownTick / onRoundEnd 回调到 store
 */

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { GameEngine, type GameEngineSettings } from '../engine/GameEngine';
import { useGameStore } from '../store/useGameStore';
import { HUD } from './HUD';
import { Overlays } from './Overlays';

const EngineContext = createContext<GameEngine | null>(null);

/** 获取 GameEngine 实例（必须在 GameCanvas 内使用） */
export function useEngine(): GameEngine {
  const engine = useContext(EngineContext);
  if (!engine) {
    throw new Error('useEngine must be used within GameCanvas');
  }
  return engine;
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  // 倒计时数字（3/2/1/0，0 表示 GO），由 engine.onCountdownTick 推送
  const [countdownNum, setCountdownNum] = useState<number>(3);

  // 实例化引擎
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas) return;

    // 从 store 读取初始设置
    const storeState = useGameStore.getState();
    const initialSettings: GameEngineSettings = {
      difficulty: storeState.difficulty,
      theme: storeState.theme,
      gridSize: storeState.gridSize,
      wrapWall: storeState.wrapWall,
      volume: storeState.volume,
    };

    const e = new GameEngine({
      canvas,
      container,
      settings: initialSettings,
      callbacks: {
        onPhaseChange: (p) => useGameStore.getState().setPhase(p),
        onScoreChange: (s, h, isNew) => useGameStore.getState().setScore(s, h, isNew),
        onCountdownTick: (num) => {
          // 倒计时数字变化时同步到 UI
          setCountdownNum(num);
        },
        onRoundEnd: (stats) => {
          const store = useGameStore.getState();
          store.setLastRound(stats.foodEaten, stats.survivalSec);
          // 更新累计统计
          const prev = store.statistics;
          store.updateStatistics({
            gamesPlayed: prev.gamesPlayed + 1,
            totalFood: prev.totalFood + stats.foodEaten,
            maxSurvivalSec: Math.max(prev.maxSurvivalSec, stats.survivalSec),
            bestPerDifficulty: {
              ...prev.bestPerDifficulty,
              [stats.difficulty]: Math.max(
                prev.bestPerDifficulty[stats.difficulty],
                stats.score
              ),
            },
          });
        },
      },
    });
    setEngine(e);
    e.start();

    return () => {
      e.stop();
      setEngine(null);
    };
  }, []);

  // 同步 audioEnabled 到 engine
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  useEffect(() => {
    if (engine) {
      engine.getAudio().setEnabled(audioEnabled);
    }
  }, [audioEnabled, engine]);

  // 同步设置项（difficulty/gridSize/theme/wrapWall/volume）到 engine
  const difficulty = useGameStore((s) => s.difficulty);
  const theme = useGameStore((s) => s.theme);
  const gridSize = useGameStore((s) => s.gridSize);
  const wrapWall = useGameStore((s) => s.wrapWall);
  const volume = useGameStore((s) => s.volume);

  useEffect(() => {
    if (!engine) return;
    const settings: GameEngineSettings = { difficulty, theme, gridSize, wrapWall, volume };
    engine.applySettings(settings);
  }, [engine, difficulty, theme, gridSize, wrapWall, volume]);

  // 监听窗口尺寸变化，触发 Renderer 重新测量
  useEffect(() => {
    if (!engine) return;
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [engine]);

  return (
    <EngineContext.Provider value={engine}>
      <div className="space-y-4">
        <HUD />
        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ width: '100%', maxWidth: 400, aspectRatio: '1 / 1' }}
        >
          <canvas
            ref={canvasRef}
            className="rounded-xl ring-1 ring-white/10 shadow-2xl shadow-purple-500/20"
          />
          {engine && <Overlays countdownNum={countdownNum} />}
        </div>
      </div>
    </EngineContext.Provider>
  );
}
