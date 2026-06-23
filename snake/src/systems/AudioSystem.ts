/**
 * AudioSystem - 音效系统（Web Audio API 合成，v3.0）
 *
 * 设计要点：
 * - 零素材：用 Oscillator 合成所有音效
 * - 懒加载 AudioContext（首次播放时才创建，避免浏览器策略警告）
 * - 浏览器策略要求 AudioContext 必须在用户交互后才能 resume
 * - v3.0 新增：音量控制（setVolume 0-100，映射到 gain 0-0.3）
 */

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private enabled = true;

  /** 音量因子（0-1），由 setVolume 设置，所有 play 方法的 gain 乘以此值 */
  private volumeFactor = 0.7;

  /** 获取或创建 AudioContext */
  private getCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtor();
    }
    // 部分浏览器在后台标签页挂起 AudioContext
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  /** 开关音效 */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 设置音量
   * @param vol 0-100，映射到 volumeFactor 0-1（gain 上限 0.3）
   */
  setVolume(vol: number): void {
    this.volumeFactor = Math.max(0, Math.min(1, vol / 100));
  }

  /** 吃食物：明亮短促上扬 */
  playEat(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.06);

    gain.gain.setValueAtTime(0.12 * this.volumeFactor, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  /** 死亡：低沉双音下行 */
  playDeath(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.4);

    gain.gain.setValueAtTime(0.15 * this.volumeFactor, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  /** 暂停切换：柔和 click */
  playClick(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);

    gain.gain.setValueAtTime(0.06 * this.volumeFactor, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  /** 新纪录：明亮上行琶音 */
  playNewRecord(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;

    // 三和弦上行（C - E - G）
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);

      gain.gain.setValueAtTime(0, t + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12 * this.volumeFactor, t + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.3);

      osc.connect(gain).connect(ctx.destination);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.3);
    });
  }

  /** 切换静音状态 */
  toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}
