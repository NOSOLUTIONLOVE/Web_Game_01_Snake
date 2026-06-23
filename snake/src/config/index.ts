/**
 * Snake Web - 全局配置（v3.0）
 *
 * 所有可调参数集中在此处，单一数据源原则
 * 含 Zod schema 用于运行时校验
 * v3.0 新增：难度系统、主题系统、网格尺寸、金色食物、统计类型
 */

import { z } from 'zod';

/**
 * Zod schema - 用于校验配置 / 表单
 */
export const gameConfigSchema = z.object({
  grid: z.object({
    cols: z.number().int().positive(),
    rows: z.number().int().positive(),
    cellSize: z.number().int().positive(),
  }),
  canvas: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  speed: z.object({
    initialMs: z.number().positive(),
    minMs: z.number().positive(),
    accel: z.number().positive(),
    scorePerLevel: z.number().positive(),
  }),
  score: z.object({
    perFood: z.number().int().positive(),
  }),
  audio: z.object({
    enabled: z.boolean(),
  }),
});

export type GameConfig = z.infer<typeof gameConfigSchema>;

/**
 * 配置常量
 */
export const CONFIG = {
  GRID: {
    COLS: 20,
    ROWS: 20,
    CELL_SIZE: 20,
  },

  CANVAS: {
    WIDTH: 20 * 20, // 400
    HEIGHT: 20 * 20, // 400
  },

  SPEED: {
    INITIAL_MS: 200,
    MIN_MS: 80,
    ACCEL: 0.95,
    SCORE_PER_LEVEL: 50,
  },

  SCORE: {
    PER_FOOD: 10,
  },

  // COLORS 保留作为默认/兼容，引擎层会改用 THEME_COLORS
  COLORS: {
    BG: '#0a0a0f',
    GRID_LINE: '#1c1c2e',
    SNAKE_BODY: '#4ade80',
    SNAKE_HEAD: '#22c55e',
    FOOD: '#f87171',
    FOOD_GLOW: '#fbbf24',
    TEXT: '#e5e7eb',
    TEXT_DIM: '#9ca3af',
  },

  // 金色食物配置
  GOLDEN_FOOD: {
    PROBABILITY: 0.2,
    SCORE: 50,
    DURATION_MS: 5000,
  },

  TOUCH: {
    THRESHOLD: 30,
  },

  STORAGE_KEY: 'snake:best_score',
  STORAGE_VERSION: 3,
  STATS_KEY: 'snake:stats',
} as const;

/**
 * 游戏阶段（替代旧 GameState 枚举）
 * v3.0 新增 countdown（倒计时）与 dying（死亡动画）
 */
export type GamePhase = 'menu' | 'countdown' | 'playing' | 'paused' | 'dying' | 'over';

/**
 * 方向
 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * 坐标点
 */
export interface Point {
  x: number;
  y: number;
}

// ============ 难度系统 ============

/**
 * 难度类型
 */
export type Difficulty = 'easy' | 'normal' | 'hard';

/**
 * 难度预设
 */
export interface DifficultyPreset {
  /** 初始速度（毫秒/步） */
  initialMs: number;
  /** 最小速度（毫秒/步） */
  minMs: number;
  /** 加速系数 */
  accel: number;
  /** 每级所需分数 */
  scorePerLevel: number;
  /** 是否有障碍物 */
  hasObstacles: boolean;
  /** 障碍物数量 */
  obstacleCount: number;
}

/**
 * 难度预设表
 */
export const DIFFICULTY_PRESETS: Record<Difficulty, DifficultyPreset> = {
  easy:   { initialMs: 250, minMs: 120, accel: 0.95, scorePerLevel: 80, hasObstacles: false, obstacleCount: 0 },
  normal: { initialMs: 200, minMs: 80,  accel: 0.95, scorePerLevel: 50, hasObstacles: false, obstacleCount: 0 },
  hard:   { initialMs: 150, minMs: 60,  accel: 0.95, scorePerLevel: 40, hasObstacles: true,  obstacleCount: 7 },
};

// ============ 主题系统 ============

/**
 * 主题类型
 */
export type Theme = 'dark' | 'neon' | 'classic';

/**
 * 主题配色（影响 Canvas 渲染颜色）
 */
export interface ThemeColors {
  bg: string;
  gridLine: string;
  snakeBody: string;
  snakeHead: string;
  food: string;
  foodGlow: string;
  goldenFood: string;
  goldenGlow: string;
  obstacle: string;
  obstacleBorder: string;
  text: string;
  textDim: string;
}

/**
 * 主题配色表
 */
export const THEME_COLORS: Record<Theme, ThemeColors> = {
  dark: {
    bg: '#0a0a0f', gridLine: '#1c1c2e', snakeBody: '#4ade80', snakeHead: '#22c55e',
    food: '#f87171', foodGlow: '#fbbf24', goldenFood: '#fbbf24', goldenGlow: '#fde68a',
    obstacle: '#374151', obstacleBorder: '#6b7280', text: '#e5e7eb', textDim: '#9ca3af',
  },
  neon: {
    bg: '#0d0221', gridLine: '#2d1b69', snakeBody: '#00ffff', snakeHead: '#00e5ff',
    food: '#ff00ff', foodGlow: '#ff80ff', goldenFood: '#ffff00', goldenGlow: '#ffff80',
    obstacle: '#4a148c', obstacleBorder: '#9c27b0', text: '#e0f7fa', textDim: '#80deea',
  },
  classic: {
    bg: '#000000', gridLine: '#1a1a1a', snakeBody: '#00ff00', snakeHead: '#00cc00',
    food: '#ff0000', foodGlow: '#ff6666', goldenFood: '#ffd700', goldenGlow: '#fff099',
    obstacle: '#404040', obstacleBorder: '#808080', text: '#ffffff', textDim: '#a0a0a0',
  },
};

// ============ 网格尺寸 ============

/**
 * 网格尺寸类型
 */
export type GridSize = 'small' | 'medium' | 'large';

/**
 * 网格配置
 */
export interface GridConfig {
  cols: number;
  rows: number;
  cellSize: number;
}

/**
 * 网格尺寸预设表
 */
export const GRID_SIZES: Record<GridSize, GridConfig> = {
  small:  { cols: 15, rows: 15, cellSize: 26 },
  medium: { cols: 20, rows: 20, cellSize: 20 },
  large:  { cols: 25, rows: 25, cellSize: 16 },
};

// ============ 食物类型 ============

/**
 * 食物类型
 */
export type FoodType = 'normal' | 'golden';

// ============ 统计 ============

/**
 * 游戏统计数据
 */
export interface GameStatistics {
  /** 总游戏局数 */
  gamesPlayed: number;
  /** 总吃食物数 */
  totalFood: number;
  /** 最长存活时间（秒） */
  maxSurvivalSec: number;
  /** 各难度最高分 */
  bestPerDifficulty: Record<Difficulty, number>;
}
