import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetLayerCard from './dataset-layer-card';

// Styles
import './styles.scss';

function DatasetLayers(props) {
  const { layers, dataset, layerGroups } = props;
  // Flag indicating if this layer group is of "timeline" type
  const isATimelineDataset = layers.find(l => l.layerConfig.timeline);
  // There exists a layer witht the new Mapbox implementation of the timeline for this
  // In this case this layer should take precedence
  const timelineDatasetLayer = layers.find(l => !!l.layerConfig.timeline_config);
  // Layer group for the current dataset
  const layerGroup = isATimelineDataset
    && layerGroups.find(lg => lg.dataset === dataset.id);
  // Active layer - if any
  const activeLayerValue = layerGroup && layerGroup.layers.find(l => l.active);
  // We need to use the layer from the "layers" property, instead of the layer object
  // found in the Redux state
  const activeLayer = activeLayerValue && layers.find(l => l.id === activeLayerValue.id);
  // We select the first layer as the default one in the case the metadata section is
  // open for a dataset that has a timeline with the "old approach" but there's no
  // active layer at the moment.
  const defaultTimelineLayer = !!isATimelineDataset && !activeLayer
    && layers.length > 0 && layers[0];

  return (
    <div className="c-dataset-layers">
      <h3>Dataset layers</h3>
      <div className="layers-container" >
        {isATimelineDataset && !timelineDatasetLayer && activeLayer &&
          <DatasetLayerCard layer={activeLayer} dataset={dataset} />
        }
        {isATimelineDataset && !timelineDatasetLayer && !activeLayer &&
          <DatasetLayerCard layer={defaultTimelineLayer} dataset={dataset} />
        }
        {isATimelineDataset && !!timelineDatasetLayer &&
          <DatasetLayerCard layer={timelineDatasetLayer} dataset={dataset} />
        }
        {!isATimelineDataset && layers.map(layer => (
          <DatasetLayerCard layer={layer} dataset={dataset} />
          ))}
      </div>
    </div>
  );
}

DatasetLayers.propTypes = {
  layers: PropTypes.array.isRequired,
  dataset: PropTypes.object.isRequired,
  layerGroups: PropTypes.object.isRequired
};

export default DatasetLayers;
