/**
 * Footer - 底部操作说明
 */

export function Footer() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">↑↓←→</kbd>
        移动
      </span>
      <span className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">Space</kbd>
        开始/重开
      </span>
      <span className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">P</kbd>
        暂停
      </span>
      <span className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">R</kbd>
        重置
      </span>
      <span className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">M</kbd>
        静音
      </span>
    </div>
  );
}
