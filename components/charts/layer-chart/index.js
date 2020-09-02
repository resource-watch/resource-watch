import React from 'react';
import PropTypes from 'prop-types';
import MapThumbnail from 'components/ui/map/map-thumbnail';

function LayerChart(props) {
  const { layer } = props;

  return (
    <div className="c-layer-chart">
      <div className="c-we-chart">
        <MapThumbnail
          layerSpec={layer}
        />
      </div>
    </div>
  );
}

LayerChart.propTypes = { layer: PropTypes.object };
LayerChart.defaultProps = { layer: null };

export default LayerChart;
