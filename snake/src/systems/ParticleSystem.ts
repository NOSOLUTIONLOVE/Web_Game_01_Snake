/**
 * ParticleSystem - 粒子系统（v3.0）
 *
 * 设计要点：
 * - 粒子结构：{ x, y, vx, vy, life, maxLife, color, size }
 * - emit() 生成粒子，随机速度（向外 360°）
 * - update(dt) 更新位置、生命衰减、重力 vy += 0.3
 * - draw(ctx) 绘制粒子（alpha = life/maxLife）
 * - clear() 清空所有粒子
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

/** 重力加速度（每帧增量） */
const GRAVITY = 0.3;

/** 默认粒子寿命（毫秒） */
const DEFAULT_LIFE = 600;

export class ParticleSystem {
  private particles: Particle[] = [];

  /**
   * 在指定位置发射粒子
   * @param x 逻辑 x 坐标（像素）
   * @param y 逻辑 y 坐标（像素）
   * @param color 粒子颜色
   * @param count 粒子数量
   */
  emit(x: number, y: number, color: string, count: number): void {
    for (let i = 0; i < count; i++) {
      // 随机角度（0 - 2π）与速度
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: DEFAULT_LIFE,
        maxLife: DEFAULT_LIFE,
        color,
        size: 2 + Math.random() * 2,
      });
    }
  }

  /**
   * 更新所有粒子
   * @param dt 时间增量（毫秒）
   */
  update(dt: number): void {
    // dt 转换为帧数比例（基于 60Hz = 16.67ms/帧）
    const step = dt / (1000 / 60);
    for (const p of this.particles) {
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.vy += GRAVITY * step;
      p.life -= dt;
    }
    // 移除已死亡粒子
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  /**
   * 绘制所有粒子
   */
  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /** 清空所有粒子 */
  clear(): void {
    this.particles = [];
  }

  /** 当前粒子数（供调试） */
  get count(): number {
    return this.particles.length;
  }
}
