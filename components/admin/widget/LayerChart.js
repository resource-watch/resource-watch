import React from 'react';
import isEqual from 'lodash/isEqual';
import { toastr } from 'react-redux-toastr';

class LayerChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      background: ''
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.getImagePreview();
    this.getBasemapPreview();
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
      width: this.chart.offsetWidth,
      height: this.chart.offsetHeight
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
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', `https://${basemap.account}.carto.com/api/v1/map`);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(basemap.body));
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
            basemap: `https://${basemap.account}.carto.com/api/v1/map/static/center/${options.token}/${options.z}/${options.lat}/${options.lng}/${options.width}/${options.height}.${options.format}`
          });
        } else {
          toastr.error('Error', 'Basemap could not be loaded');
        }
      }
    };
  }

  getImagePreview() {
    const { data } = this.props;

    if (this.mounted) this.props.toggleLoading(true);

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', `https://${data.account}.carto.com/api/v1/map`);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(data.body));
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
            background: `https://${data.account}.carto.com/api/v1/map/static/center/${options.token}/${options.z}/${options.lat}/${options.lng}/${options.width}/${options.height}.${options.format}`
          });
        } else {
          toastr.error('Error', 'Image could not be loaded');
        }
      }
    };
  }

  render() {
    return (
      <div className="c-chart">
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
  data: React.PropTypes.object,
  toggleLoading: React.PropTypes.func
};

export default LayerChart;
