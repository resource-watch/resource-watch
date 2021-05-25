import {
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

// components
import ErrorFallback from 'components/error-fallback';
import MiniExplore from 'components/mini-explore';

function MiniExploreBlock({
  item,
}) {
  const config = useMemo(() => {
    try {
      return JSON.parse(item.content);
    } catch (e) {
      throw new Error('Mini Explore: error parsing content.');
    }
  }, [item]);

  return (
    <MiniExplore
      config={config}
    />
  );
}

export default function MiniExploreBlockWithErrorBoundary(props) {
  const CustomErrorFallback = useCallback((_props) => (
    <ErrorFallback
      {..._props}
      title="Something went wrong loading Mini Explore."
    />
  ), []);

  return (
    <ErrorBoundary
      FallbackComponent={CustomErrorFallback}
      onError={((error) => { console.error(error.message); })}
    >
      <MiniExploreBlock {...props} />
    </ErrorBoundary>
  );
}

MiniExploreBlock.propTypes = {
  item: PropTypes.shape({
    content: PropTypes.string.isRequired,
  }).isRequired,
};
