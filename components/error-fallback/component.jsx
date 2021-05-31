import PropTypes from 'prop-types';

// styles
import './styles.scss';

export default function ErrorFallback({
  title,
  resetErrorBoundary,
}) {
  return (
    <div
      role="alert"
      className="c-error-fallback"
    >
      <p>
        {title}
      </p>
      <button
        type="button"
        className="c-button -primary"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}

ErrorFallback.defaultProps = {
  title: 'Something went wrong.',
};

ErrorFallback.propTypes = {
  title: PropTypes.string,
  // https://github.com/bvaughn/react-error-boundary#usage
  resetErrorBoundary: PropTypes.func.isRequired,
};
