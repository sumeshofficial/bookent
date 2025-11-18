import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">
            Something went wrong 
          </h2>
          <p className="text-sm text-gray-500">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
