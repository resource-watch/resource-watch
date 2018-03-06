import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

class LayerChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      basemap: '',
      background: ''
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.getBasemapPreview();
    this.getImagePreview();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps.data, this.props.data) ||
           nextState.background !== this.state.background ||
           nextState.basemap !== this.state.basemap;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getSize() {
    return {
      width: this.chart ? this.chart.offsetWidth : 0,
      height: this.chart ? this.chart.offsetHeight : 0
    };
  }

  getBasemapPreview() {
    const basemap = {
      account: 'wri-01',
      body: {
        maxzoom: 18,
        minzoom: 3,
        layers: [{
          type: 'mapnik',
          options: {
            sql: 'SELECT * FROM gadm28_countries',
            cartocss: '#gadm28_countries{ polygon-fill: #bbbbbb; polygon-opacity: 1; line-color: #FFFFFF; line-width: 0.5; line-opacity: 0.5;}',
            cartocss_version: '2.3.0'
          }
        }]
      }
    };

    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      layers: basemap.body.layers
    };
    const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', `https://${basemap.account}.carto.com/api/v1/map${params}`);
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200 && this.mounted) {
          const response = JSON.parse(xmlhttp.responseText);
          const dimensions = this.getSize();
          const options = {
            token: response.layergroupid,
            z: 1,
            lat: 0,
            lng: 0,
            width: dimensions.width,
            height: dimensions.height,
            format: 'png'
          };

          this.setState({
            basemap: `https://${response.cdn_url.https}/${basemap.account}/api/v1/map/static/center/${options.token}/${options.z}/${options.lat}/${options.lng}/${options.width}/${options.height}.${options.format}`
          });
        } else {
          console.error('Basemap could not be loaded');
        }
      }
    };
    xmlhttp.send(null);
  }

  getImagePreview() {
    const { data } = this.props;

    if (!data || !data.account) return;

    if (this.mounted) this.props.toggleLoading(true);

    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      layers: data.body.layers
    };
    const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', `https://${data.account}.carto.com/api/v1/map${params}`);
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        if (this.mounted) this.props.toggleLoading(false);
        if (xmlhttp.status === 200 && this.mounted) {
          const response = JSON.parse(xmlhttp.responseText);
          const dimensions = this.getSize();
          const options = {
            token: response.layergroupid,
            z: 1,
            lat: 0,
            lng: 0,
            width: dimensions.width,
            height: dimensions.height,
            format: 'png'
          };

          this.setState({
            background: `https://${response.cdn_url.https}/${data.account}/api/v1/map/static/center/${options.token}/${options.z}/${options.lat}/${options.lng}/${options.width}/${options.height}.${options.format}`
          });
        } else {
          console.error('Basemap could not be loaded');
        }
      }
    };
    xmlhttp.send(null);
  }

  render() {
    return (
      <div className="c-we-chart">
        <div
          ref={(c) => { this.chart = c; }}
          className="chart"
          style={{ backgroundImage: `url('${this.state.background}') , url('${this.state.basemap}')` }}
        />
      </div>
    );
  }
}

LayerChart.propTypes = {
  // Define the chart data
  data: PropTypes.object,
  toggleLoading: PropTypes.func
};

export default LayerChart;
