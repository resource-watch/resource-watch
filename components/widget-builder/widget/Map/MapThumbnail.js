import React from 'react';
import PropTypes from 'prop-types';
import { getLayerImage, getBasemapImage } from '../../helpers/layer-helpers';

class MapThumbnail extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    zoom: PropTypes.number,
    lat: PropTypes.number,
    lng: PropTypes.number,
    // https://resource-watch.github.io/doc-api/#layer
    layerSpec: PropTypes.object
  }

  static defaultProps = {
    width: 200,
    height: 180,
    zoom: 1,
    lat: 20,
    lng: -20,
    layerSpec: {}
  }

  state = {}

  async componentDidMount() {
    const { width, height, zoom, lat, lng, layerSpec } = this.props;
    const thumbnail = await getLayerImage({ width, height, zoom, lat, lng, layerSpec });
    const basemap = await getBasemapImage({ width, height, zoom, lat, lng });
    this.setStateAsync({
      imageSrc: thumbnail,
      basemapSrc: basemap
    });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  render() {
    const { width, height, layerSpec } = this.props;
    const { imageSrc, basemapSrc } = this.state;
    const componentStyle = { position: 'relative', width, height };
    const imageStyle = { position: 'absolute', width, height };

    if (!basemapSrc) return null;

    return (
      <div style={componentStyle}>
        <img src={basemapSrc} alt="Basemap" style={imageStyle} />
        {imageSrc && <img src={imageSrc} alt={layerSpec.name} style={imageStyle} />}
      </div>
    );
  }
}

export default MapThumbnail;
