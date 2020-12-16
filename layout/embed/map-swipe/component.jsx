import React from 'react';
import PropTypes from 'prop-types';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import CompareMaps from 'components/map/plugins/compare';
import Spinner from 'components/ui/Spinner';

const LayoutEmbedMapSwipe = ({
  isFetching,
  layers,
  mapOptions,
  bbox,
}) => (
  <LayoutEmbed
    title="Map comparison"
    description=""
  >
    {isFetching && (
      <Spinner
        isLoading
        className="-light"
      />
    )}

    {!isFetching && (
      <CompareMaps
        layers={layers}
        bbox={bbox}
        mapOptions={mapOptions}
      />
    )}
  </LayoutEmbed>
);

LayoutEmbedMapSwipe.defaultProps = {
  bbox: null,
};

LayoutEmbedMapSwipe.propTypes = {
  layers: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  isFetching: PropTypes.bool.isRequired,
  mapOptions: PropTypes.shape({
    viewport: PropTypes.shape({}),
  }).isRequired,
  bbox: PropTypes.arrayOf(
    PropTypes.number,
  ),
};
export default LayoutEmbedMapSwipe;
