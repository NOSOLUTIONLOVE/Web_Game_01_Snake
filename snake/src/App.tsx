/**
 * App - 根组件
 *
 * 布局：HUD + GameCanvas（含 Overlays）+ Footer
 * v3.0：根据 store.theme 同步根元素 data-theme，触发 CSS 变量切换
 */

import { useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameCanvas } from './components/GameCanvas';
import { Footer } from './components/Footer';
import { useGameStore } from './store/useGameStore';

function App() {
  const theme = useGameStore((s) => s.theme);

  // 同步主题到 <html data-theme="...">，CSS 变量据此切换
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-full max-w-md mx-auto p-4 space-y-4">
          <GameCanvas />
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
