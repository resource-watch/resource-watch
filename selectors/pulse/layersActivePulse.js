import find from 'lodash/find';
import { createSelector } from 'reselect';

// Get the pulse
const pulse = state => state.pulse;

// Create a function to compare the current active datatasets and the current pulseIds
const getActiveLayersPulse = (_pulse) => {
  if (_pulse.layerActive && _pulse.layers && _pulse.layers.length) {
    const layerActive = find(_pulse.layers, { id: _pulse.layerActive });
    return layerActive;
  }
  return null;
};

// Export the selector
export default createSelector(pulse, getActiveLayersPulse);
