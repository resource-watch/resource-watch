import React from 'react';
import PropTypes from 'prop-types';

// Recompose
import { onlyUpdateForKeys } from 'recompose';

// Redux
import { connect } from 'react-redux';

// Leaflet can't be imported on the server because it's not isomorphic
const L = (typeof window !== 'undefined') ? require('leaflet') : null;

class Basemap extends React.Component {
  static propTypes = {
    // STORE
    basemap: PropTypes.string,
    map: PropTypes.object
  };

  componentDidMount() {
    this.setBasemap();
  }

  componentDidUpdate() {
    this.setBasemap();
  }

  /**
   * SETTERS
   * - setBasemap
  */
  setBasemap() {
    const { basemap, map } = this.props;
    if (map) {
      L.tileLayer(basemap, {})
        .addTo(map)
        .setZIndex(0);
    }
  }

  // RENDER
  render() {
    return null;
  }
}

export default onlyUpdateForKeys(['basemap', 'map'])(connect(
  state => ({
    basemap: state.map.basemap
  })
)(Basemap));
