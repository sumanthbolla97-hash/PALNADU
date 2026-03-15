import React, { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-text">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-brand-red mx-auto mb-4" />
            <h1 className="text-4xl font-serif mb-2">Something went wrong</h1>
            <p className="text-xl text-brand-text/80 mb-8">We're sorry, but an unexpected error occurred.</p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-brand-red text-brand-bg font-medium tracking-widest uppercase text-sm rounded-full hover:bg-brand-red-light transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
