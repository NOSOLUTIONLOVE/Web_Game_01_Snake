/**
 * PauseOverlay - 暂停遮罩
 */

import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { useEngine } from './GameCanvas';
import { Button } from './ui/button';

export function PauseOverlay() {
  const engine = useEngine();

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-4 p-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-4xl font-extrabold tracking-widest text-primary text-glow">
          PAUSED
        </h2>
        <p className="text-sm text-muted-foreground">按 P 或点击继续</p>

        <div className="flex gap-3 mt-2">
          <Button onClick={() => engine.togglePause()} aria-label="继续游戏">
            <Play className="h-4 w-4 mr-2" />
            继续
          </Button>
          <Button variant="outline" onClick={() => engine.startGame()} aria-label="重新开始">
            <RotateCcw className="h-4 w-4 mr-2" />
            重开
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
