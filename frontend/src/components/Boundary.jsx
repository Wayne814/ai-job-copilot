import { Component } from "react";
import styles from "./ErrorBoundary.module.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
    // You could send this to an error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h1>Oops! Something went wrong</h1>
          <p>{this.state.error?.message || "An unexpected error occurred"}</p>
          <button 
            className={styles.retryBtn}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;