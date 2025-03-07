import React from 'react';
import Alert from './Alert';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <Alert 
            type="error" 
            message="Something went wrong. Please try refreshing the page." 
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
