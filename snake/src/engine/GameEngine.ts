/**
 * GameEngine - 游戏主循环 + 状态机（v3.0，框架无关）
 *
 * 阶段机：
 *   menu ──Space──▶ countdown ──▶ playing ──P──▶ paused ──P──▶ playing
 *                                    │                       │
 *                                    └─撞墙/撞身─▶ dying ──▶ over ──Space──▶ countdown
 *
 * 设计要点：
 * - 60Hz 固定时间步长主循环
 * - 不依赖 React / DOM（除 canvas），通过 callbacks 通知外部
 * - v3.0 新增：
 *   - 配置驱动：从 store 读取 difficulty/gridSize/theme/wrapWall/volume
 *   - visibilitychange 监听：隐藏时暂停 RAF，显示时恢复
 *   - 倒计时阶段：3-2-1-GO 后进入 playing
 *   - 金色食物：吃普通食物后 20% 概率生成，超时消失，+50 分 + 粒子 + 震动
 *   - 障碍物：hard 难度生成
 *   - 蛇身插值：render 时传入 getTickProgress()
 *   - 穿墙：从 store 读取 wrapWall
 *   - 粒子系统：吃食物时 emit
 *   - 死亡动画：dying 阶段约 1s 蛇身闪烁，完成后进入 over
 *   - 震动：死亡与吃金色食物时触发
 *   - 统计：死亡时记录本局食物数、存活秒数
 *   - 音量：从 store 读取 volume
 */

import {
  CONFIG,
  DIFFICULTY_PRESETS,
  GRID_SIZES,
  type Difficulty,
  type Direction,
  type GamePhase,
  type GridConfig,
  type GridSize,
  type Theme,
} from '../config';
import { Snake } from '../entities/Snake';
import { Food } from '../entities/Food';
import { Obstacle } from '../entities/Obstacle';
import { Renderer } from './Renderer';
import { Input, type ExtendedInputCallbacks } from './Input';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { storage } from '../lib/storage';

/**
 * 一局结束统计
 */
export interface RoundEndStats {
  /** 本局吃食物数 */
  foodEaten: number;
  /** 本局存活秒数 */
  survivalSec: number;
  /** 本局分数 */
  score: number;
  /** 难度 */
  difficulty: Difficulty;
}

/**
 * 引擎回调 - 桥接 UI 层（Zustand store）
 */
export interface GameEngineCallbacks {
  /** 阶段变化时通知 */
  onPhaseChange: (phase: GamePhase) => void;
  /** 分数变化时通知（score, highScore, isNewRecord） */
  onScoreChange: (score: number, highScore: number, isNewRecord: boolean) => void;
  /** 倒计时数字变化时通知（3/2/1/0，0 表示 GO） */
  onCountdownTick?: (num: number) => void;
  /** 一局结束统计通知 */
  onRoundEnd?: (stats: RoundEndStats) => void;
}

export interface GameEngineOptions {
  canvas: HTMLCanvasElement;
  /** canvas 父元素，用于测量宽度（DPR 自适应） */
  container?: HTMLElement | null;
  callbacks: GameEngineCallbacks;
  /** 初始设置（从 store 读取） */
  settings?: GameEngineSettings;
}

/**
 * 引擎设置（从 store 同步）
 */
export interface GameEngineSettings {
  difficulty: Difficulty;
  theme: Theme;
  gridSize: GridSize;
  wrapWall: boolean;
  volume: number;
}

/** 倒计时总时长（毫秒） */
const COUNTDOWN_DURATION_MS = 3000;
/** 死亡动画时长（毫秒） */
const DYING_DURATION_MS = 1000;

export class GameEngine {
  // ============ 状态 ============
  private phase: GamePhase = 'menu';
  private rafId = 0;
  private lastTime = 0;
  private accumulator = 0;

  /** 固定逻辑更新间隔（毫秒） */
  private readonly LOGIC_STEP = 1000 / 60; // 60Hz

  // ============ 倒计时 ============
  private countdownStartTime = 0;
  private lastCountdownNum = 4; // 上次通知的数字（4 表示尚未开始）

  // ============ 死亡动画 ============
  private dyingStartTime = 0;
  /** 本局开始时刻（用于存活秒数统计） */
  private roundStartTime = 0;
  /** 本局吃食物数 */
  private roundFoodEaten = 0;

  // ============ 实体 ============
  private snake: Snake;
  private food: Food;
  private obstacle: Obstacle;

  // ============ 子系统 ============
  private renderer: Renderer;
  private input: Input;
  private collision: CollisionSystem;
  private score: ScoreSystem;
  private audio: AudioSystem;
  private particles: ParticleSystem;

  /** localStorage 中的历史最高分 */
  private savedBest: number;

  /** 外部回调 */
  private callbacks: GameEngineCallbacks;

  // ============ 设置 ============
  private settings: GameEngineSettings;
  /** 当前网格配置 */
  private gridConfig: GridConfig;
  /** 当前难度预设 */
  private difficultyPreset = DIFFICULTY_PRESETS.normal;

  /** visibilitychange 处理器（用于卸载） */
  private visibilityHandler: (() => void) | null = null;

  constructor(options: GameEngineOptions) {
    const { canvas, container = null, callbacks } = options;
    this.callbacks = callbacks;

    // 初始设置（默认值，applySettings 会从 store 同步）
    this.settings = options.settings ?? {
      difficulty: 'normal',
      theme: 'dark',
      gridSize: 'medium',
      wrapWall: false,
      volume: 70,
    };

    this.savedBest = storage.get<number>(CONFIG.STORAGE_KEY, 0);

    this.renderer = new Renderer(canvas, container);
    this.input = new Input();
    this.snake = new Snake();
    this.food = new Food();
    this.obstacle = new Obstacle();
    this.collision = new CollisionSystem();
    this.audio = new AudioSystem();
    this.particles = new ParticleSystem();

    // 计分系统：分数变化时通过回调通知外部
    this.score = new ScoreSystem(({ score, best, isNewRecord }) => {
      this.callbacks.onScoreChange(score, best, isNewRecord);
    }, this.savedBest);

    // 应用初始设置（主题/网格/音量/难度）
    this.gridConfig = GRID_SIZES[this.settings.gridSize];
    this.difficultyPreset = DIFFICULTY_PRESETS[this.settings.difficulty];
    this.renderer.setTheme(this.settings.theme);
    this.renderer.setGridConfig(this.gridConfig);
    this.audio.setVolume(this.settings.volume);

    // 重置蛇到当前网格
    this.snake.reset(this.gridConfig.cols, this.gridConfig.rows, this.difficultyPreset.initialMs);

    // 绑定输入回调
    const inputCallbacks: ExtendedInputCallbacks = {
      onDirection: (dir: Direction) => {
        if (this.phase === 'playing') {
          this.snake.queueDirection(dir);
        }
      },
      onPause: () => {
        this.togglePause();
      },
      onConfirm: () => {
        if (this.phase === 'menu' || this.phase === 'over') {
          this.startGame();
        }
      },
      onReset: () => {
        if (this.phase === 'playing' || this.phase === 'over' || this.phase === 'dying') {
          this.startGame();
        }
      },
      onToggleMute: () => {
        const enabled = this.audio.toggle();
        console.info(enabled ? '🔊 音效已开启' : '🔇 音效已关闭');
      },
    };
    this.input.bind(inputCallbacks, canvas, {
      getPhase: () => this.phase,
    });

    // 挂载 visibilitychange 监听
    this.visibilityHandler = () => this.handleVisibilityChange();
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  // ============ 生命周期 ============

  public start(): void {
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  public stop(): void {
    cancelAnimationFrame(this.rafId);
    this.input.unbind();
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
  }

  /** visibilitychange 处理 */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // 隐藏时取消 RAF
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    } else {
      // 显示时重置 lastTime 并重启 RAF（避免大 delta 跳变）
      if (this.rafId === 0) {
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame((t) => this.loop(t));
      }
    }
  }

  // ============ 主循环 ============

  private loop(timestamp: number): void {
    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    const clampedDelta = Math.min(delta, 100);
    this.accumulator += clampedDelta;

    while (this.accumulator >= this.LOGIC_STEP) {
      this.update(this.LOGIC_STEP);
      this.accumulator -= this.LOGIC_STEP;
    }

    this.render(clampedDelta);
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  /** 逻辑更新（60Hz） */
  private update(dt: number): void {
    // 倒计时阶段：驱动 3-2-1-GO 通知
    if (this.phase === 'countdown') {
      this.updateCountdown(dt);
      // 倒计时期间仍更新粒子（视觉连续）
      this.particles.update(dt);
      return;
    }

    // 死亡动画阶段：等待动画完成后进入 over
    if (this.phase === 'dying') {
      const elapsed = performance.now() - this.dyingStartTime;
      this.particles.update(dt);
      if (elapsed > DYING_DURATION_MS) {
        this.finishDeath();
      }
      return;
    }

    if (this.phase !== 'playing') return;

    // 检查金色食物超时
    if (
      this.food.isExists() &&
      this.food.getType() === 'golden' &&
      performance.now() - this.food.getSpawnTime() > CONFIG.GOLDEN_FOOD.DURATION_MS
    ) {
      this.food.despawn();
    }

    // 驱动蛇移动
    this.snake.accumulateTick(dt);
    while (this.snake.isTickReady()) {
      this.snake.consumeTick();
      this.tickSnake();
    }

    // 更新粒子
    this.particles.update(dt);
  }

  /** 倒计时更新 */
  private updateCountdown(_dt: number): void {
    const elapsed = performance.now() - this.countdownStartTime;
    // 当前应显示的数字：3 -2 -1 -0(GO)
    const remaining = COUNTDOWN_DURATION_MS - elapsed;
    const num = Math.ceil(remaining / 1000); // 3, 2, 1, 0

    if (num !== this.lastCountdownNum) {
      this.lastCountdownNum = num;
      if (num > 0) {
        this.callbacks.onCountdownTick?.(num);
      } else {
        this.callbacks.onCountdownTick?.(0); // GO
      }
    }

    if (elapsed >= COUNTDOWN_DURATION_MS) {
      this.setPhase('playing');
      this.roundStartTime = performance.now();
    }
  }

  /** 蛇移动一格 */
  private tickSnake(): void {
    const ate = this.snake.move(
      this.food.position,
      this.settings.wrapWall,
      this.gridConfig.cols,
      this.gridConfig.rows
    );

    if (ate) {
      const foodType = this.food.getType();
      if (foodType === 'golden') {
        // 金色食物：+50 分 + 粒子 + 震动
        this.score.add(CONFIG.GOLDEN_FOOD.SCORE);
        this.audio.playEat();
        this.emitFoodParticles(this.food.position, this.renderer.getThemeColors().goldenFood);
        this.renderer.shake(6, 300);
        this.roundFoodEaten++;
        this.food.despawn();
        this.spawnNormalFood();
      } else {
        // 普通食物：+10 分 + 粒子
        this.score.add(CONFIG.SCORE.PER_FOOD);
        this.audio.playEat();
        this.emitFoodParticles(this.food.position, this.renderer.getThemeColors().food);
        this.roundFoodEaten++;
        // 20% 概率生成金色食物，否则生成普通食物
        if (Math.random() < CONFIG.GOLDEN_FOOD.PROBABILITY) {
          this.spawnFood('golden');
        } else {
          this.spawnNormalFood();
        }
        this.trySpeedUp();
      }
    }

    // 碰撞检测
    if (
      this.collision.checkWall(this.snake, this.settings.wrapWall, this.gridConfig.cols, this.gridConfig.rows) ||
      this.collision.checkSelf(this.snake) ||
      this.collision.checkObstacle(this.snake, this.obstacle)
    ) {
      this.gameOver();
    }
  }

  /** 生成普通食物（避开蛇身与障碍物） */
  private spawnNormalFood(): void {
    const occupied = this.collectOccupied();
    this.food.spawn(occupied, this.gridConfig.cols, this.gridConfig.rows, 'normal');
  }

  /** 生成指定类型食物（避开蛇身与障碍物） */
  private spawnFood(type: 'normal' | 'golden'): void {
    const occupied = this.collectOccupied();
    this.food.spawn(occupied, this.gridConfig.cols, this.gridConfig.rows, type);
  }

  /** 收集所有占用坐标（蛇身 + 障碍物） */
  private collectOccupied(): Set<string> {
    const occupied = this.snake.occupiedSet();
    for (const k of this.obstacle.occupiedSet()) {
      occupied.add(k);
    }
    return occupied;
  }

  /** 在食物位置发射粒子 */
  private emitFoodParticles(pos: { x: number; y: number }, color: string): void {
    const { cellSize } = this.gridConfig;
    const px = pos.x * cellSize + cellSize / 2;
    const py = pos.y * cellSize + cellSize / 2;
    this.particles.emit(px, py, color, 12);
  }

  /** 难度递增：每 scorePerLevel 分加速，下限 minMs */
  private trySpeedUp(): void {
    const score = this.score.score;
    const threshold = Math.floor(score / this.difficultyPreset.scorePerLevel);
    const prevThreshold = Math.floor(
      (score - CONFIG.SCORE.PER_FOOD) / this.difficultyPreset.scorePerLevel
    );

    if (threshold > prevThreshold) {
      this.snake.moveInterval = Math.max(
        this.difficultyPreset.minMs,
        this.snake.moveInterval * this.difficultyPreset.accel
      );
    }
  }

  /** 渲染（每帧）—— 只画游戏画面，UI 覆盖层交给 React */
  private render(dt: number): void {
    this.renderer.render(dt, () => {
      this.renderer.clear();
      this.renderer.drawGrid();

      // 障碍物
      if (this.obstacle.blocks.length > 0) {
        this.renderer.drawObstacles(this.obstacle);
      }

      // 食物
      this.renderer.drawFood(this.food);

      // 蛇（playing/paused/dying 都画；dying 时插值进度为 0 并闪烁）
      const isDying = this.phase === 'dying';
      const progress = isDying ? 0 : this.snake.getTickProgress();
      this.renderer.drawSnake(this.snake, progress, isDying);

      // 粒子
      this.renderer.drawParticles(this.particles);
    });
  }

  // ============ 状态切换 ============

  /** 开始新游戏（从 menu 或 over 进入 countdown） */
  public startGame(): void {
    // 重置实体
    this.snake.reset(this.gridConfig.cols, this.gridConfig.rows, this.difficultyPreset.initialMs);
    this.food.despawn();
    this.obstacle.clear();
    this.particles.clear();
    this.score.reset();
    this.roundFoodEaten = 0;

    // 生成初始普通食物
    this.spawnNormalFood();

    // 难度有障碍物则生成
    if (this.difficultyPreset.hasObstacles) {
      this.obstacle.generate(
        this.difficultyPreset.obstacleCount,
        this.snake,
        this.food,
        this.gridConfig.cols,
        this.gridConfig.rows
      );
    }

    // 进入倒计时
    this.countdownStartTime = performance.now();
    this.lastCountdownNum = 4;
    this.setPhase('countdown');
  }

  /** 暂停 / 继续 */
  public togglePause(): void {
    if (this.phase === 'playing') {
      this.setPhase('paused');
      this.audio.playClick();
    } else if (this.phase === 'paused') {
      this.setPhase('playing');
      this.audio.playClick();
    }
  }

  /** 回主菜单 */
  public backToMenu(): void {
    this.setPhase('menu');
  }

  /** 游戏结束（进入 dying 阶段） */
  private gameOver(): void {
    if (this.phase !== 'playing') return;

    this.audio.playDeath();
    this.renderer.shake(8, 400);
    this.setPhase('dying');
    this.dyingStartTime = performance.now();
  }

  /** 死亡动画完成：更新统计、保存最高分、进入 over */
  private finishDeath(): void {
    // 计算存活秒数
    const survivalSec = Math.floor((performance.now() - this.roundStartTime) / 1000);

    // 破纪录则持久化 + 播放新纪录音效
    let isNewRecord = false;
    if (this.score.score > this.savedBest) {
      this.savedBest = this.score.score;
      storage.set(CONFIG.STORAGE_KEY, this.savedBest);
      this.audio.playNewRecord();
      isNewRecord = true;
    }

    // 通知一局结束统计
    this.callbacks.onRoundEnd?.({
      foodEaten: this.roundFoodEaten,
      survivalSec,
      score: this.score.score,
      difficulty: this.settings.difficulty,
    });

    // 通知分数（确保 isNewRecord 反映到 store）
    this.callbacks.onScoreChange(this.score.score, this.savedBest, isNewRecord);

    this.setPhase('over');
  }

  private setPhase(p: GamePhase): void {
    this.phase = p;
    this.callbacks.onPhaseChange(p);
  }

  /** 获取当前阶段（供调试与 Input 回调用） */
  public getPhase(): GamePhase {
    return this.phase;
  }

  /** 获取音效系统（供 UI 控制静音） */
  public getAudio(): AudioSystem {
    return this.audio;
  }

  /**
   * 应用设置变更（在 store 中 difficulty/gridSize/theme/wrapWall/volume 变化时调用）
   */
  public applySettings(settings: GameEngineSettings): void {
    const themeChanged = settings.theme !== this.settings.theme;
    const gridSizeChanged = settings.gridSize !== this.settings.gridSize;
    const difficultyChanged = settings.difficulty !== this.settings.difficulty;

    this.settings = settings;

    if (themeChanged) {
      this.renderer.setTheme(settings.theme);
    }
    if (gridSizeChanged) {
      this.gridConfig = GRID_SIZES[settings.gridSize];
      this.renderer.setGridConfig(this.gridConfig);
      // 网格变化时重置蛇位置（避免越界）
      this.snake.reset(this.gridConfig.cols, this.gridConfig.rows, this.difficultyPreset.initialMs);
      this.food.despawn();
      this.obstacle.clear();
    }
    if (difficultyChanged) {
      this.difficultyPreset = DIFFICULTY_PRESETS[settings.difficulty];
      // 难度变化时重置速度
      this.snake.moveInterval = this.difficultyPreset.initialMs;
    }

    // 音量始终同步
    this.audio.setVolume(settings.volume);
  }

  /** 触发 Renderer 重新测量尺寸（container 变化时调用） */
  public resize(): void {
    this.renderer.resize();
  }
}
