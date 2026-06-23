/**
 * Obstacle 实体 - 障碍物（v3.0）
 *
 * 设计要点：
 * - blocks 存储障碍物方块坐标
 * - generate() 随机生成 count 个块，避开蛇身、蛇头附近 3 格、食物
 * - occupiedSet() 返回坐标集合，供食物生成与碰撞检测使用
 */

import { type Point } from '../config';
import type { Snake } from './Snake';
import type { Food } from './Food';

export class Obstacle {
  /** 障碍物方块坐标数组 */
  public blocks: Point[] = [];

  /** 清空障碍物 */
  clear(): void {
    this.blocks = [];
  }

  /**
   * 随机生成 count 个障碍物块
   * 不与蛇身、蛇头附近 3 格、食物重叠
   * @param count 数量
   * @param snake 蛇
   * @param food 食物（用于避开食物位置）
   * @param cols 网格列数
   * @param rows 网格行数
   */
  generate(count: number, snake: Snake, food: Food, cols: number, rows: number): void {
    this.blocks = [];

    // 已占用集合：蛇身
    const occupied = snake.occupiedSet();

    // 蛇头附近 3 格（曼哈顿距离 <= 3）也避开，给玩家反应空间
    const head = snake.getHead();
    for (let dx = -3; dx <= 3; dx++) {
      for (let dy = -3; dy <= 3; dy++) {
        if (Math.abs(dx) + Math.abs(dy) <= 3) {
          occupied.add(`${head.x + dx},${head.y + dy}`);
        }
      }
    }

    // 食物位置也避开
    if (food.isExists()) {
      occupied.add(`${food.position.x},${food.position.y}`);
    }

    // 候选格
    const candidates: Point[] = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (!occupied.has(`${x},${y}`)) {
          candidates.push({ x, y });
        }
      }
    }

    // 随机选 count 个（Fisher-Yates 部分洗牌）
    const n = Math.min(count, candidates.length);
    for (let i = 0; i < n; i++) {
      const j = i + Math.floor(Math.random() * (candidates.length - i));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      this.blocks.push(candidates[i]);
    }
  }

  /**
   * 返回障碍物坐标集合（格式 "x,y"）
   */
  occupiedSet(): Set<string> {
    const set = new Set<string>();
    for (const b of this.blocks) {
      set.add(`${b.x},${b.y}`);
    }
    return set;
  }
}
