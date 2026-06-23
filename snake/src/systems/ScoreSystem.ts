/**
 * ScoreSystem - 计分系统
 *
 * 设计要点：
 * - 当前分数 + 最高分（best）
 * - 通过回调通知 UI 更新（解耦）
 * - reset() 重置当前分（重开游戏时调用）
 */

export interface ScoreUpdatePayload {
  score: number;
  best: number;
  isNewRecord: boolean;
}

export class ScoreSystem {
  private currentScore = 0;
  private bestScore = 0;

  constructor(
    private onUpdate: (payload: ScoreUpdatePayload) => void,
    initialBest = 0
  ) {
    this.bestScore = initialBest;
  }

  /** 加分 */
  add(points: number): void {
    const oldBest = this.bestScore;
    this.currentScore += points;
    this.bestScore = Math.max(this.bestScore, this.currentScore);
    this.notify(oldBest);
  }

  /** 重置当前分（保留最高分） */
  reset(): void {
    this.currentScore = 0;
    this.notify(this.bestScore);
  }

  /** 直接设置最高分（从存储读取时） */
  setBest(best: number): void {
    this.bestScore = best;
    this.notify(this.bestScore);
  }

  /** 获取当前分 */
  get score(): number {
    return this.currentScore;
  }

  /** 获取最高分 */
  get best(): number {
    return this.bestScore;
  }

  private notify(oldBest: number): void {
    this.onUpdate({
      score: this.currentScore,
      best: this.bestScore,
      isNewRecord: this.bestScore > oldBest,
    });
  }
}