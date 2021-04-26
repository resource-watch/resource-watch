import PropTypes from 'prop-types';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import SimilarDatasets from 'components/datasets/similar-datasets/similar-datasets';

export default function LayoutEmbedSimilarDatasets({
  id,
  loading,
}) {
  const titleSt = loading ? 'Loading similar datasets...' : '';

  return (
    <LayoutEmbed
      title={titleSt}
      description=""
    >
      <SimilarDatasets
        datasetIds={id}
      />
    </LayoutEmbed>
  );
}

LayoutEmbedSimilarDatasets.propTypes = {
  id: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};
