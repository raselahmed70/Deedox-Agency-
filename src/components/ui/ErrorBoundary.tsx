import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-[#111820] rounded-[40px] border border-white/5 border-dashed m-8">
          <div className="w-16 h-16 bg-[#FF5757]/10 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#FF5757]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-bold text-white mb-2">Neural Link Interrupted</h3>
          <p className="text-[#6B7A8D] font-sans text-sm max-w-xs mx-auto mb-8">
            A component has experienced a fatal resolution error. Our systems are attempting to isolate the failure.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white/5 text-white/40 hover:text-white border border-white/10 rounded-xl px-8 py-2 font-bold uppercase text-[10px] tracking-widest transition-all"
          >
            Reboot Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
