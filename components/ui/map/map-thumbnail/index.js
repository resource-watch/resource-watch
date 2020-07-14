import React from 'react';
import PropTypes from 'prop-types';
import { getLayerImage, getBasemapImage } from './helper';

class MapThumbnail extends React.Component {
  static propTypes = {
    zoom: PropTypes.number,
    lat: PropTypes.number,
    lng: PropTypes.number,
    // https://resource-watch.github.io/doc-api/#layer
    layerSpec: PropTypes.object.isRequired
  };

  static defaultProps = {
    zoom: 1,
    lat: 20,
    lng: -20
  };

  state = {
    imageSrc: '',
    basemapSrc: ''
  }

  async componentDidMount() {
    const { width, height } = this.getSize();

    const { zoom, lat, lng, layerSpec } = this.props;

    const thumbnail = await getLayerImage({ width, height, zoom, lat, lng, layerSpec });

    const basemap = await getBasemapImage({ width, height, zoom, lat, lng, layerSpec });

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

  getSize() {    
    return {
      width: this.chart && this.chart.offsetWidth 
        ? this.chart.offsetWidth : 100,
      height: this.chart && this.chart.offsetHeight 
        ? this.chart.offsetHeight : 100
    };
  }

  render() {
    const { imageSrc, basemapSrc } = this.state;
    const bgImage = (imageSrc && imageSrc !== '') ? `url('${imageSrc}') , url('${basemapSrc}')` : `url('${basemapSrc}')`;

    return (
      <div
        ref={(c) => { this.chart = c; }}
        style={{
          width: '100%',
          height: '100%',
          ...bgImage && { backgroundImage: bgImage },
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
    );
  }
}

export default MapThumbnail;
