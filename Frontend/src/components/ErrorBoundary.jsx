import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm text-gray-300 mb-4">
            {this.state.error?.message || "An unknown error occurred"}
          </p>
          {this.props.fallback || (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 