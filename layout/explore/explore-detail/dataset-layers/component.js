import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetLayerCard from './dataset-layer-card';

// Styles
import './styles.scss';

function DatasetLayers(props) {
  const { layers, dataset, isATimeline, timelineLayerMapbox, timelineLayer } = props;
  const showTimelineMapbox = isATimeline && !!timelineLayerMapbox;
  const showTimelineOldApproach = isATimeline && !timelineLayerMapbox && timelineLayer;
  
  return (
    <div className="c-dataset-layers">
      <h3>Dataset layers</h3>
      <div className="layers-container" >
        {showTimelineOldApproach &&
          <DatasetLayerCard layer={timelineLayer} dataset={dataset} />
        }
        {showTimelineMapbox &&
          <DatasetLayerCard layer={timelineLayerMapbox} dataset={dataset} />
        }
        {!isATimeline && layers.map(layer => (
          <DatasetLayerCard layer={layer} dataset={dataset} />
          ))}
      </div>
    </div>
  );
}

DatasetLayers.propTypes = {
  layers: PropTypes.array.isRequired,
  dataset: PropTypes.object.isRequired,
  layerGroups: PropTypes.object.isRequired,
  isATimeline: PropTypes.bool.isRequired,
  timelineLayerMapbox: PropTypes.object.isRequired
};

export default DatasetLayers;
