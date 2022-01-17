export interface ErrorFallbackProps {
  title?: string;
  // https://github.com/bvaughn/react-error-boundary#usage
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({
  title = 'Something went wrong.',
  resetErrorBoundary,
}: ErrorFallbackProps): JSX.Element => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center w-full h-full p-4 text-center border rounded border-gray-light"
    >
      <p>{title}</p>
      <button type="button" className="mt-5 c-button -primary" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
};

export default ErrorFallback;
