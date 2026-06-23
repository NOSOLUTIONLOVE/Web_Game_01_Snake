/**
 * useGameStore - Zustand 全局状态（v3.0）
 *
 * 桥接 UI 层（React）与游戏层（GameEngine）
 * - GameEngine 通过 actions 通知 UI 状态变化
 * - UI 通过 actions 触发 GameEngine 行为（start/pause/restart）
 * - 持久化 highScore + audioEnabled + 设置项 + statistics 到 localStorage
 * - v3.0 新增：难度/主题/网格/穿墙/音量/统计/迁移
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Difficulty,
  GamePhase,
  GameStatistics,
  GridSize,
  Theme,
} from '../config';

/**
 * 默认统计数据
 */
const DEFAULT_STATISTICS: GameStatistics = {
  gamesPlayed: 0,
  totalFood: 0,
  maxSurvivalSec: 0,
  bestPerDifficulty: { easy: 0, normal: 0, hard: 0 },
};

interface GameStore {
  // ============ 状态 ============
  /** 当前游戏阶段 */
  phase: GamePhase;
  /** 当前局分数 */
  score: number;
  /** 历史最高分 */
  highScore: number;
  /** 本局是否破纪录 */
  isNewRecord: boolean;
  /** 音效是否开启 */
  audioEnabled: boolean;

  // ============ 设置项（v3.0 新增）============
  /** 难度 */
  difficulty: Difficulty;
  /** 主题 */
  theme: Theme;
  /** 网格尺寸 */
  gridSize: GridSize;
  /** 是否穿墙 */
  wrapWall: boolean;
  /** 音量（0-100） */
  volume: number;
  /** 游戏统计 */
  statistics: GameStatistics;
  /** 上局吃食物数 */
  lastRoundFood: number;
  /** 上局存活秒数 */
  lastRoundSec: number;

  // ============ actions（GameEngine 调用）============
  setPhase: (phase: GamePhase) => void;
  setScore: (score: number, highScore: number, isNewRecord: boolean) => void;

  // ============ actions（UI 调用）============
  toggleAudio: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  /** 重置局状态（用于开始新游戏前清空 isNewRecord） */
  resetRound: () => void;

  // ============ 设置 actions（v3.0 新增）============
  setDifficulty: (difficulty: Difficulty) => void;
  setTheme: (theme: Theme) => void;
  setGridSize: (gridSize: GridSize) => void;
  setWrapWall: (wrapWall: boolean) => void;
  setVolume: (volume: number) => void;
  /** 记录上一局的食物数与存活秒数 */
  setLastRound: (food: number, sec: number) => void;
  /** 更新统计数据（合并传入） */
  updateStatistics: (patch: Partial<GameStatistics>) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      // 初始状态
      phase: 'menu',
      score: 0,
      highScore: 0,
      isNewRecord: false,
      audioEnabled: true,

      // 设置项默认值
      difficulty: 'normal',
      theme: 'dark',
      gridSize: 'medium',
      wrapWall: false,
      volume: 70,
      statistics: DEFAULT_STATISTICS,
      lastRoundFood: 0,
      lastRoundSec: 0,

      // GameEngine 回调
      setPhase: (phase) => set({ phase }),
      setScore: (score, highScore, isNewRecord) =>
        set({ score, highScore, isNewRecord }),

      // UI 回调
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
      resetRound: () => set({ score: 0, isNewRecord: false }),

      // 设置 actions
      setDifficulty: (difficulty) => set({ difficulty }),
      setTheme: (theme) => set({ theme }),
      setGridSize: (gridSize) => set({ gridSize }),
      setWrapWall: (wrapWall) => set({ wrapWall }),
      setVolume: (volume) => set({ volume }),
      setLastRound: (food, sec) =>
        set({ lastRoundFood: food, lastRoundSec: sec }),
      updateStatistics: (patch) =>
        set((s) => ({ statistics: { ...s.statistics, ...patch } })),
    }),
    {
      name: 'snake:store',
      version: 3,
      // 持久化：高分、音效、设置项、统计
      partialize: (s) => ({
        highScore: s.highScore,
        audioEnabled: s.audioEnabled,
        difficulty: s.difficulty,
        theme: s.theme,
        gridSize: s.gridSize,
        wrapWall: s.wrapWall,
        volume: s.volume,
        statistics: s.statistics,
      }),
      // 版本迁移：旧版本（无 version 视为 2）填充默认 statistics 与默认设置
      migrate: (persistedState, version) => {
        const s = (persistedState ?? {}) as Partial<{
          highScore: number;
          audioEnabled: boolean;
          difficulty: Difficulty;
          theme: Theme;
          gridSize: GridSize;
          wrapWall: boolean;
          volume: number;
          statistics: GameStatistics;
        }>;
        // version < 3 的旧数据需要补齐新增字段；返回完整持久化状态
        if (version < 3) {
          return {
            highScore: s.highScore ?? 0,
            audioEnabled: s.audioEnabled ?? true,
            difficulty: s.difficulty ?? 'normal',
            theme: s.theme ?? 'dark',
            gridSize: s.gridSize ?? 'medium',
            wrapWall: s.wrapWall ?? false,
            volume: s.volume ?? 70,
            statistics: s.statistics ?? DEFAULT_STATISTICS,
          };
        }
        return {
          highScore: s.highScore ?? 0,
          audioEnabled: s.audioEnabled ?? true,
          difficulty: s.difficulty ?? 'normal',
          theme: s.theme ?? 'dark',
          gridSize: s.gridSize ?? 'medium',
          wrapWall: s.wrapWall ?? false,
          volume: s.volume ?? 70,
          statistics: s.statistics ?? DEFAULT_STATISTICS,
        };
      },
    }
  )
);
