/**
 * Food 实体 - 食物（v3.0）
 *
 * 设计要点：
 * - spawn() 接收占用集合（蛇身+障碍物），仅从空白格随机选一个
 * - 支持 normal / golden 两种类型
 * - spawnTime 记录生成时刻，用于金色食物超时判定与倒计时环绘制
 */

import { type FoodType, type Point } from '../config';

export class Food {
  public position: Point = { x: 0, y: 0 };
  private exists = false;

  /** 食物类型 */
  private type: FoodType = 'normal';

  /** 生成时刻（performance.now()） */
  private spawnTime = 0;

  /**
   * 在空白格随机生成食物
   * @param occupied 已占用坐标集合（蛇身+障碍物，格式 "x,y"）
   * @param cols 网格列数
   * @param rows 网格行数
   * @param type 食物类型，默认 'normal'
   * @returns 是否生成成功（无空白格时返回 false）
   */
  spawn(occupied: Set<string>, cols: number, rows: number, type: FoodType = 'normal'): boolean {
    // 收集空白格
    const empty: Point[] = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (!occupied.has(`${x},${y}`)) {
          empty.push({ x, y });
        }
      }
    }

    // 边界：蛇填满整个网格（不可能发生但要处理）
    if (empty.length === 0) {
      this.exists = false;
      return false;
    }

    // 随机选择一个空白格
    this.position = empty[Math.floor(Math.random() * empty.length)];
    this.type = type;
    this.spawnTime = performance.now();
    this.exists = true;
    return true;
  }

  /** 是否存在 */
  isExists(): boolean {
    return this.exists;
  }

  /** 获取食物类型 */
  getType(): FoodType {
    return this.type;
  }

  /** 获取生成时刻 */
  getSpawnTime(): number {
    return this.spawnTime;
  }

  /** 消除食物（用于金色食物超时） */
  despawn(): void {
    this.exists = false;
  }
}
