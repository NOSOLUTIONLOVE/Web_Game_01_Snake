/**
 * Snake 实体 - 贪吃蛇游戏核心实体（v3.0）
 *
 * 设计要点：
 * - body 数组头部为蛇头（index 0）
 * - direction 是当前移动方向，nextDirection 是缓冲方向（防 180° 反向）
 * - move() 方法接收食物坐标，返回是否吃到食物
 * - prevBody 保存移动前蛇身，用于渲染插值
 * - tickAccumulator 私有，通过 getTickProgress() 暴露插值进度
 * - move(wrapWall) 支持穿墙模式
 */

import { CONFIG, type Direction, type Point } from '../config';

/** 方向向量映射 */
const DIR_DELTA: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

/** 反向映射（用于防 180°） */
const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export class Snake {
  /** 蛇身坐标数组（头部在 [0]） */
  public body: Point[];

  /** 上一帧蛇身（用于渲染插值） */
  public prevBody: Point[];

  /** 当前移动方向 */
  public direction: Direction;

  /** 缓冲方向（下一帧应用） */
  public nextDirection: Direction;

  /** 移动间隔（毫秒），越短越快 */
  public moveInterval: number;

  /** tick 累积器（用于固定时间步长） */
  private tickAccumulator = 0;

  constructor() {
    this.body = [];
    this.prevBody = [];
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.moveInterval = CONFIG.SPEED.INITIAL_MS;
    this.tickAccumulator = 0;
    this.reset();
  }

  /**
   * 重置到初始状态
   * @param cols 网格列数（用于居中，默认 CONFIG.GRID.COLS）
   * @param rows 网格行数（用于居中，默认 CONFIG.GRID.ROWS）
   * @param moveInterval 初始移动间隔（默认 CONFIG.SPEED.INITIAL_MS）
   */
  reset(
    cols: number = CONFIG.GRID.COLS,
    rows: number = CONFIG.GRID.ROWS,
    moveInterval: number = CONFIG.SPEED.INITIAL_MS
  ): void {
    const midX = Math.floor(cols / 2);
    const midY = Math.floor(rows / 2);
    this.body = [
      { x: midX, y: midY },
      { x: midX - 1, y: midY },
      { x: midX - 2, y: midY },
    ];
    this.prevBody = this.body.map((p) => ({ ...p }));
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.moveInterval = moveInterval;
    this.tickAccumulator = 0;
  }

  /**
   * 缓冲新方向输入
   * 防 180° 反向：不允许与当前方向相反
   */
  queueDirection(dir: Direction): void {
    if (OPPOSITE[this.direction] !== dir) {
      this.nextDirection = dir;
    }
  }

  /**
   * 移动一格
   * @param food 食物坐标（用于判定是否吃到食物）
   * @param wrapWall 是否穿墙（开启时越界坐标取模）
   * @param cols 网格列数（穿墙时使用）
   * @param rows 网格行数（穿墙时使用）
   * @returns 是否吃到食物（吃到则不删除尾部，实现身体增长）
   */
  move(food: Point, wrapWall: boolean = false, cols: number = CONFIG.GRID.COLS, rows: number = CONFIG.GRID.ROWS): boolean {
    // 保存移动前蛇身（用于渲染插值）
    this.prevBody = this.body.map((p) => ({ ...p }));

    // 应用缓冲方向
    this.direction = this.nextDirection;

    const head = this.body[0];
    const delta = DIR_DELTA[this.direction];
    let newHead: Point = { x: head.x + delta.x, y: head.y + delta.y };

    // 穿墙模式：越界取模
    if (wrapWall) {
      newHead = {
        x: (newHead.x + cols) % cols,
        y: (newHead.y + rows) % rows,
      };
    }

    // 新头部入队
    this.body.unshift(newHead);

    // 吃到食物？不删除尾部（身体增长）
    if (newHead.x === food.x && newHead.y === food.y) {
      return true;
    }

    // 否则删除尾部（保持长度）
    this.body.pop();
    return false;
  }

  /** 获取蛇头坐标 */
  getHead(): Point {
    return this.body[0];
  }

  /** 获取蛇身长度 */
  get length(): number {
    return this.body.length;
  }

  /**
   * 获取当前 tick 进度（0-1），供渲染插值用
   * 进度 = tickAccumulator / moveInterval
   */
  getTickProgress(): number {
    if (this.moveInterval <= 0) return 0;
    return Math.min(1, this.tickAccumulator / this.moveInterval);
  }

  /** 累加 tick（供 GameEngine 调用） */
  accumulateTick(dt: number): void {
    this.tickAccumulator += dt;
  }

  /** 消耗一个 tick（供 GameEngine 调用） */
  consumeTick(): void {
    this.tickAccumulator -= this.moveInterval;
  }

  /** 是否到达 tick 阈值（供 GameEngine 调用） */
  isTickReady(): boolean {
    return this.tickAccumulator >= this.moveInterval;
  }

  /**
   * 返回当前蛇身坐标集合（格式 "x,y"）
   * 用于食物生成与碰撞检测的快速查找
   */
  occupiedSet(): Set<string> {
    const set = new Set<string>();
    for (const seg of this.body) {
      set.add(`${seg.x},${seg.y}`);
    }
    return set;
  }
}
