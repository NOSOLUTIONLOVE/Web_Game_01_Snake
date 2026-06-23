/**
 * Renderer - Canvas 2D 渲染封装（v3.0，框架无关）
 *
 * 设计要点：
 * - DPR 高清渲染：根据 container 宽度自适应 cssSize，物理尺寸 = cssSize * dpr
 * - 网格缓存：离屏 Canvas 缓存网格背景，仅在网格/主题变更时重建
 * - 主题：颜色从 THEME_COLORS 读取，setTheme 触发 gridCache 重建
 * - 蛇身插值：drawSnake 接收 progress，对蛇头位置在 prevBody[0] 到 body[0] 之间线性插值
 * - 金色食物：脉动光环 + 倒计时进度环
 * - 障碍物：深灰带边框方块
 * - 粒子：调用 ParticleSystem.draw
 * - 震动：render 开始时若在震动中，ctx.translate 随机偏移
 * - UI 覆盖层（MENU/PAUSED/GAME_OVER）交给 React，不在 Canvas 内画
 */

import {
  CONFIG,
  THEME_COLORS,
  type Direction,
  type GridConfig,
  type Point,
  type Theme,
  type ThemeColors,
} from '../config';
import type { Snake } from '../entities/Snake';
import type { Food } from '../entities/Food';
import type { Obstacle } from '../entities/Obstacle';
import type { ParticleSystem } from '../systems/ParticleSystem';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private container: HTMLElement | null;

  /** CSS 显示尺寸（逻辑像素） */
  private cssSize = 400;

  /** 当前主题配色 */
  private themeColors: ThemeColors = THEME_COLORS.dark;
  private currentTheme: Theme = 'dark';

  /** 当前网格配置 */
  private gridConfig: GridConfig = {
    cols: CONFIG.GRID.COLS,
    rows: CONFIG.GRID.ROWS,
    cellSize: CONFIG.GRID.CELL_SIZE,
  };

  /** 网格缓存离屏 Canvas */
  private gridCanvas: HTMLCanvasElement | null = null;

  // ============ 震动状态 ============
  private shakeIntensity = 0;
  private shakeDuration = 0;
  private shakeElapsed = 0;

  constructor(canvas: HTMLCanvasElement, container: HTMLElement | null = null) {
    this.canvas = canvas;
    this.container = container;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not supported');
    }
    this.ctx = ctx;
    this.resize();
  }

  // ============ DPR / 尺寸 ============

  /**
   * 根据 container 宽度计算 cssSize，设置物理尺寸与 CSS 尺寸
   * 调用 ctx.setTransform(dpr, 0, 0, dpr, 0, 0) 让绘制坐标基于 CSS 像素
   */
  resize(): void {
    const containerWidth = this.container?.clientWidth ?? 400;
    const cssSize = Math.min(containerWidth, 400);
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = cssSize * dpr;
    this.canvas.height = cssSize * dpr;
    this.canvas.style.width = `${cssSize}px`;
    this.canvas.style.height = `${cssSize}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cssSize = cssSize;
  }

  /** 获取 CSS 显示尺寸 */
  getCssSize(): number {
    return this.cssSize;
  }

  // ============ 主题 ============

  /**
   * 设置主题，触发网格缓存重建
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.themeColors = THEME_COLORS[theme];
    this.buildGridCache(
      this.gridConfig.cols,
      this.gridConfig.rows,
      this.gridConfig.cellSize,
      this.themeColors
    );
  }

  /** 获取当前主题 */
  getTheme(): Theme {
    return this.currentTheme;
  }

  /** 获取当前主题配色 */
  getThemeColors(): ThemeColors {
    return this.themeColors;
  }

  // ============ 网格配置 ============

  /**
   * 设置网格配置，触发网格缓存重建
   */
  setGridConfig(grid: GridConfig): void {
    this.gridConfig = grid;
    this.buildGridCache(grid.cols, grid.rows, grid.cellSize, this.themeColors);
  }

  /** 获取当前网格配置 */
  getGridConfig(): GridConfig {
    return this.gridConfig;
  }

  /**
   * 构建网格缓存（仅在网格/主题变更时调用）
   */
  buildGridCache(cols: number, rows: number, cellSize: number, colors: ThemeColors): void {
    const size = cols * cellSize;
    this.gridCanvas = document.createElement('canvas');
    this.gridCanvas.width = size;
    this.gridCanvas.height = size;
    const gctx = this.gridCanvas.getContext('2d');
    if (!gctx) return;

    // 背景
    gctx.fillStyle = colors.bg;
    gctx.fillRect(0, 0, size, size);

    // 网格线
    gctx.strokeStyle = colors.gridLine;
    gctx.lineWidth = 0.5;
    gctx.beginPath();
    for (let i = 1; i < cols; i++) {
      gctx.moveTo(i * cellSize, 0);
      gctx.lineTo(i * cellSize, rows * cellSize);
    }
    for (let i = 1; i < rows; i++) {
      gctx.moveTo(0, i * cellSize);
      gctx.lineTo(cols * cellSize, i * cellSize);
    }
    gctx.stroke();
  }

  // ============ 震动 ============

  /**
   * 触发屏幕震动
   * @param intensity 最大偏移像素
   * @param duration 持续毫秒
   */
  shake(intensity: number, duration: number): void {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeElapsed = 0;
  }

  /** 当前是否在震动中 */
  private isShaking(): boolean {
    return this.shakeDuration > 0 && this.shakeElapsed < this.shakeDuration;
  }

  /**
   * 应用震动偏移（在 render 开始时调用）
   * 返回的 save/restore 由调用方负责
   */
  private applyShake(dt: number): void {
    if (!this.isShaking()) return;
    this.shakeElapsed += dt;
    const remaining = Math.max(0, this.shakeDuration - this.shakeElapsed);
    const ratio = this.shakeDuration > 0 ? remaining / this.shakeDuration : 0;
    const magnitude = this.shakeIntensity * ratio;
    const dx = (Math.random() - 0.5) * 2 * magnitude;
    const dy = (Math.random() - 0.5) * 2 * magnitude;
    this.ctx.translate(dx, dy);
  }

  // ============ 主渲染入口 ============

  /**
   * 渲染一帧（含震动）
   * @param dt 距上一帧毫秒（用于震动衰减）
   * @param drawFn 实际绘制回调
   */
  render(dt: number, drawFn: () => void): void {
    this.ctx.save();
    this.applyShake(dt);
    drawFn();
    this.ctx.restore();
  }

  // ============ 基础绘制 ============

  clear(): void {
    this.ctx.fillStyle = this.themeColors.bg;
    this.ctx.fillRect(0, 0, this.cssSize, this.cssSize);
  }

  drawGrid(): void {
    if (!this.gridCanvas) {
      // 未构建缓存时即时绘制
      this.buildGridCache(
        this.gridConfig.cols,
        this.gridConfig.rows,
        this.gridConfig.cellSize,
        this.themeColors
      );
    }
    if (this.gridCanvas) {
      this.ctx.drawImage(this.gridCanvas, 0, 0, this.cssSize, this.cssSize);
    }
  }

  drawFood(food: Food): void {
    if (!food.isExists()) return;

    const { cellSize } = this.gridConfig;
    const cx = food.position.x * cellSize + cellSize / 2;
    const cy = food.position.y * cellSize + cellSize / 2;

    // 脉动动画
    const t = performance.now() / 1000;
    const pulse = 1 + Math.sin(t * 5) * 0.12;
    const baseRadius = (cellSize - 4) / 2;
    const radius = baseRadius * pulse;

    if (food.getType() === 'golden') {
      this.drawGoldenFood(food, cx, cy, radius);
    } else {
      this.drawNormalFood(cx, cy, radius);
    }
  }

  /** 普通食物 */
  private drawNormalFood(cx: number, cy: number, radius: number): void {
    const { cellSize } = this.gridConfig;
    const foodX = cx - cellSize / 2;
    const foodY = cy - cellSize / 2;

    // 外发光
    const gradient = this.ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.5);
    gradient.addColorStop(0, this.themeColors.foodGlow + '80');
    gradient.addColorStop(1, this.themeColors.foodGlow + '00');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(foodX, foodY, cellSize, cellSize);

    // 食物本体
    this.ctx.fillStyle = this.themeColors.food;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // 高光
    this.ctx.fillStyle = '#fecaca';
    this.ctx.beginPath();
    this.ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * 金色食物：脉动光环 + 倒计时进度环
   */
  private drawGoldenFood(food: Food, cx: number, cy: number, radius: number): void {
    const { cellSize } = this.gridConfig;
    const foodX = cx - cellSize / 2;
    const foodY = cy - cellSize / 2;

    // 脉动光环（更强烈）
    const t = performance.now() / 1000;
    const haloPulse = 1 + Math.sin(t * 8) * 0.25;
    const haloRadius = radius * 1.8 * haloPulse;

    const gradient = this.ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, haloRadius);
    gradient.addColorStop(0, this.themeColors.goldenGlow + 'cc');
    gradient.addColorStop(0.5, this.themeColors.goldenGlow + '40');
    gradient.addColorStop(1, this.themeColors.goldenGlow + '00');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(foodX - cellSize, foodY - cellSize, cellSize * 3, cellSize * 3);

    // 食物本体（金色）
    this.ctx.fillStyle = this.themeColors.goldenFood;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // 倒计时进度环
    const elapsed = performance.now() - food.getSpawnTime();
    const progress = Math.max(0, 1 - elapsed / CONFIG.GOLDEN_FOOD.DURATION_MS);
    this.ctx.strokeStyle = this.themeColors.goldenGlow;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(
      cx,
      cy,
      radius + 3,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * progress
    );
    this.ctx.stroke();

    // 高光
    this.ctx.fillStyle = '#fff7d6';
    this.ctx.beginPath();
    this.ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * 绘制蛇
   * @param snake 蛇实体
   * @param progress 插值进度（0-1），死亡时不插值传 0
   * @param dying 是否死亡中（死亡时蛇身闪烁）
   */
  drawSnake(snake: Snake, progress = 0, dying = false): void {
    const { cellSize } = this.gridConfig;
    const padding = 1;
    const total = snake.body.length;

    // 死亡闪烁：每 100ms 切换可见性
    const blinkVisible = !dying || Math.floor(performance.now() / 100) % 2 === 0;

    // 蛇头插值位置
    const prevHead = snake.prevBody[0] ?? snake.body[0];
    const currHead = snake.body[0];
    const interpHeadX = prevHead.x + (currHead.x - prevHead.x) * progress;
    const interpHeadY = prevHead.y + (currHead.y - prevHead.y) * progress;

    snake.body.forEach((seg, i) => {
      const isHead = i === 0;
      const ratio = total > 1 ? i / (total - 1) : 0;
      this.ctx.fillStyle = isHead
        ? this.themeColors.snakeHead
        : this.interpolateColor(this.themeColors.snakeBody, '#166534', ratio * 0.6);

      // 蛇头使用插值位置，其余使用 body[i]
      const px = isHead ? interpHeadX : seg.x;
      const py = isHead ? interpHeadY : seg.y;

      const x = px * cellSize + padding;
      const y = py * cellSize + padding;
      const size = cellSize - padding * 2;

      if (blinkVisible) {
        if (isHead) {
          this.roundRect(x, y, size, size, 3);
          this.ctx.fill();
          this.drawSnakeEyes({ x: px, y: py }, snake.direction);
          this.drawHeadGlow({ x: px, y: py });
        } else {
          const radius = i === total - 1 ? 3 : 2;
          this.roundRect(x, y, size, size, radius);
          this.ctx.fill();
        }
      }
    });
  }

  private drawHeadGlow(head: Point): void {
    const { cellSize } = this.gridConfig;
    const cx = head.x * cellSize + cellSize / 2;
    const cy = head.y * cellSize + cellSize / 2;

    const t = performance.now() / 1000;
    const intensity = 0.08 + Math.sin(t * 3) * 0.04;

    const gradient = this.ctx.createRadialGradient(cx, cy, 4, cx, cy, cellSize);
    gradient.addColorStop(0, `rgba(74, 222, 128, ${intensity})`);
    gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      head.x * cellSize - cellSize / 2,
      head.y * cellSize - cellSize / 2,
      cellSize * 2,
      cellSize * 2
    );
  }

  private interpolateColor(color1: string, color2: string, t: number): string {
    const c1 = this.parseColor(color1);
    const c2 = this.parseColor(color2);
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  private parseColor(hex: string): { r: number; g: number; b: number } {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  }

  private drawSnakeEyes(head: Point, dir: Direction): void {
    const { cellSize } = this.gridConfig;
    const cx = head.x * cellSize + cellSize / 2;
    const cy = head.y * cellSize + cellSize / 2;

    const eyeOffset: Record<Direction, [number, number][]> = {
      UP: [[-4, -3], [4, -3]],
      DOWN: [[-4, 3], [4, 3]],
      LEFT: [[-3, -4], [-3, 4]],
      RIGHT: [[3, -4], [3, 4]],
    };

    this.ctx.fillStyle = '#0f172a';

    for (const [ox, oy] of eyeOffset[dir]) {
      this.ctx.beginPath();
      this.ctx.arc(cx + ox, cy + oy, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * 绘制障碍物
   */
  drawObstacles(obstacles: Obstacle): void {
    const { cellSize } = this.gridConfig;
    const padding = 1;
    for (const b of obstacles.blocks) {
      const x = b.x * cellSize + padding;
      const y = b.y * cellSize + padding;
      const size = cellSize - padding * 2;

      // 主体
      this.ctx.fillStyle = this.themeColors.obstacle;
      this.roundRect(x, y, size, size, 2);
      this.ctx.fill();

      // 边框
      this.ctx.strokeStyle = this.themeColors.obstacleBorder;
      this.ctx.lineWidth = 1;
      this.roundRect(x, y, size, size, 2);
      this.ctx.stroke();
    }
  }

  /**
   * 绘制粒子
   */
  drawParticles(particles: ParticleSystem): void {
    particles.draw(this.ctx);
  }

  // ============ 工具方法 ============

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
  }
}
