/**
 * ErrorBoundary - React 错误边界
 *
 * 捕获子组件渲染异常，显示友好兜底页
 * 提供"重试"按钮重置 state 重新挂载子组件
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // 错误信息可在控制台查看，便于调试
    console.error('[ErrorBoundary] 捕获到渲染异常:', error, info);
  }

  /** 重试：重置 state 重新挂载子组件 */
  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className="w-full max-w-md mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">出错了</h1>
            <p className="text-sm text-muted-foreground break-words">
              {this.state.error?.message ?? '发生未知错误'}
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
