/**
 * Input 输入系统（v3.0，框架无关）
 *
 * - 通过回调函数向 GameEngine 发送输入事件（观察者模式）
 * - 支持键盘 + 触屏双端
 * - 防 180° 反向逻辑在 Snake 层处理
 * - v3.0 新增：
 *   - clickHandler 仅在 'menu'|'over' 阶段触发 onConfirm（通过 getPhase 回调判断）
 *   - handleKey 过滤所有 repeat 事件（避免按住方向键持续触发）
 */

import { CONFIG, type Direction, type GamePhase } from '../config';

export interface InputCallbacks {
  onDirection: (dir: Direction) => void;
  onPause: () => void;
  onConfirm: () => void;
  onReset: () => void;
}

export interface InputOptions {
  /** 获取当前游戏阶段（用于 clickHandler 判断是否在 menu/over） */
  getPhase: () => GamePhase;
}

export class Input {
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;
  private touchStartHandler: ((e: TouchEvent) => void) | null = null;
  private touchEndHandler: ((e: TouchEvent) => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private boundElement: HTMLElement | null = null;

  private touchStartX = 0;
  private touchStartY = 0;

  /** 获取当前阶段的回调 */
  private getPhase: (() => GamePhase) | null = null;

  bind(callbacks: InputCallbacks, target: HTMLElement, options?: InputOptions): void {
    this.boundElement = target;
    this.getPhase = options?.getPhase ?? null;

    this.keyHandler = (e: KeyboardEvent) => this.handleKey(e, callbacks);
    window.addEventListener('keydown', this.keyHandler);

    this.touchStartHandler = (e: TouchEvent) => this.handleTouchStart(e);
    this.touchEndHandler = (e: TouchEvent) => this.handleTouchEnd(e, callbacks);
    target.addEventListener('touchstart', this.touchStartHandler, { passive: true });
    target.addEventListener('touchend', this.touchEndHandler, { passive: true });

    // clickHandler 仅在 'menu'|'over' 阶段触发 onConfirm
    this.clickHandler = () => {
      const phase = this.getPhase ? this.getPhase() : 'menu';
      if (phase === 'menu' || phase === 'over') {
        callbacks.onConfirm();
      }
    };
    target.addEventListener('click', this.clickHandler);
  }

  unbind(): void {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
    if (this.boundElement) {
      if (this.touchStartHandler) {
        this.boundElement.removeEventListener('touchstart', this.touchStartHandler);
        this.touchStartHandler = null;
      }
      if (this.touchEndHandler) {
        this.boundElement.removeEventListener('touchend', this.touchEndHandler);
        this.touchEndHandler = null;
      }
      if (this.clickHandler) {
        this.boundElement.removeEventListener('click', this.clickHandler);
        this.clickHandler = null;
      }
      this.boundElement = null;
    }
    this.getPhase = null;
  }

  // ============ 键盘 ============

  private handleKey(e: KeyboardEvent, cb: ExtendedInputCallbacks): void {
    // 过滤所有 repeat 事件（按住键不持续触发）
    if (e.repeat) return;

    const key = e.key.toLowerCase();

    if (key === 'arrowup' || key === 'w') {
      cb.onDirection('UP');
      e.preventDefault();
      return;
    }
    if (key === 'arrowdown' || key === 's') {
      cb.onDirection('DOWN');
      e.preventDefault();
      return;
    }
    if (key === 'arrowleft' || key === 'a') {
      cb.onDirection('LEFT');
      e.preventDefault();
      return;
    }
    if (key === 'arrowright' || key === 'd') {
      cb.onDirection('RIGHT');
      e.preventDefault();
      return;
    }

    if (key === ' ' || key === 'enter') {
      cb.onConfirm();
      e.preventDefault();
      return;
    }

    if (key === 'p') {
      cb.onPause();
      e.preventDefault();
      return;
    }

    if (key === 'r') {
      cb.onReset();
      e.preventDefault();
      return;
    }

    if (key === 'm') {
      cb.onToggleMute?.();
      return;
    }
  }

  // ============ 触屏 ============

  private handleTouchStart(e: TouchEvent): void {
    const touch = e.touches[0];
    if (!touch) return;
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  private handleTouchEnd(e: TouchEvent, cb: InputCallbacks): void {
    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;
    const threshold = CONFIG.TOUCH.THRESHOLD;

    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      cb.onDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      cb.onDirection(dy > 0 ? 'DOWN' : 'UP');
    }
  }
}

/**
 * 扩展 InputCallbacks 包含静音切换
 */
export type ExtendedInputCallbacks = InputCallbacks & {
  onToggleMute?: () => void;
};
