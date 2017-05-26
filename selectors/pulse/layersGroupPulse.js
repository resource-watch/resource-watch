import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import { createSelector } from 'reselect';

// Get the pulse
const pulse = state => state.pulse;

// Create a function to compare the current active datatasets and the current pulseIds
const getLayersGroupPulse = (_pulse) => {
  // We will improve this by merging the layerSpec with the dataset.layer
  const groups = map(groupBy(_pulse.layers, 'group'), (layers, key) => ({
    name: key,
    layers
  }));
  return groups;
};

// Export the selector
export default createSelector(pulse, getLayersGroupPulse);
