import React, { PureComponent } from 'react';

class ErrorBoundary extends PureComponent {

    state = {
        error: null
    }

    static getDerivedStateFromError(error) {
        // Update state so next render shows fallback UI.
        return { error: error };
    }

    componentDidCatch(error, info) {
        // Log the error to an error reporting service
        console.error(error, info);
    }

    render() {
        const { error } = this.state;
        return (
            <div className="c-error-boundary">
                {error &&
                    <div>
                        There was an error loading the visualization
                    </div>
                }
                {!error && this.props.children}
            </div>
        );
    }
}

export default ErrorBoundary;