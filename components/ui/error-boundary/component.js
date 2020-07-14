import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
        const { message } = this.props;
        return (
            <div className="c-error-boundary">
                {error &&
                    <div>
                        {message}
                    </div>
                }
                {!error && this.props.children}
            </div>
        );
    }
}

ErrorBoundary.propTypes = {
    message: PropTypes.string
};

ErrorBoundary.defaultProps = {
    message: 'There was an error'
};

export default ErrorBoundary;