/**
 * CollisionSystem - 碰撞检测（v3.0）
 *
 * 设计要点：
 * - checkWall: AABB 边界检测，支持穿墙模式
 * - checkSelf: 蛇头与身体任意一节重合检测（用 Set 优化）
 * - checkObstacle: 蛇头与障碍物方块重合检测
 * - 纯函数设计，无状态
 */

import { CONFIG } from '../config';
import type { Snake } from '../entities/Snake';
import type { Obstacle } from '../entities/Obstacle';

export class CollisionSystem {
  /**
   * 撞墙检测：蛇头是否超出边界
   * @param wrapWall 是否穿墙模式（开启时永远不撞墙）
   * @param cols 网格列数
   * @param rows 网格行数
   */
  checkWall(snake: Snake, wrapWall: boolean = false, cols: number = CONFIG.GRID.COLS, rows: number = CONFIG.GRID.ROWS): boolean {
    if (wrapWall) return false;
    const head = snake.getHead();
    return head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
  }

  /**
   * 撞自身检测：蛇头是否与身体任意一节重合
   * 注：必须先移动（push 新头），才能检测
   */
  checkSelf(snake: Snake): boolean {
    const [head, ...rest] = snake.body;
    const bodySet = new Set(rest.map((p) => `${p.x},${p.y}`));
    return bodySet.has(`${head.x},${head.y}`);
  }

  /**
   * 撞障碍物检测：蛇头是否与障碍物任意方块重合
   */
  checkObstacle(snake: Snake, obstacles: Obstacle): boolean {
    const head = snake.getHead();
    return obstacles.occupiedSet().has(`${head.x},${head.y}`);
  }
}
