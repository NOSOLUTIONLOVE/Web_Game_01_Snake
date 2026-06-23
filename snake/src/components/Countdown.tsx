/**
 * Countdown - 倒计时遮罩
 *
 * 在 canvas 上层居中显示大号倒计时数字（3/2/1）或 "GO"
 * 使用 framer-motion 做数字弹出动画（scale + opacity，每次数字变化时重新动画）
 */

import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  /** 倒计时数字：3/2/1/0，0 显示 "GO" */
  num: number;
}

export function Countdown({ num }: CountdownProps) {
  const display = num === 0 ? 'GO' : String(num);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* 半透明背景遮罩 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 数字弹出动画：key 变化时重新触发 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={num}
          className="relative z-10 text-6xl font-extrabold text-primary text-glow"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {display}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
