import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import Select from 'components/form/SelectInput';
import Spinner from 'components/ui/Spinner';

// Services
import RasterService from 'services/RasterService';

class RasterChartEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false, // Whether the component is loading
      error: null, // Whether an error happened
      bands: [] // List of the name of the bands
    };

    this.rasterService = new RasterService(props.dataset, props.tableName, props.provider);
  }

  componentDidMount() {
    this.fetchBandNames();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataset !== this.props.dataset
      || nextProps.tableName !== this.props.tableName) {
      this.rasterService = new RasterService(
        nextProps.dataset,
        nextProps.tableName,
        nextProps.provider
      );
      this.fetchBandNames();
    }
  }

  /**
   * Event handler executed when the user selects a band
   * @param {string} band 
   */
  @Autobind
  onChangeBand(band) {
    this.props.onChangeBand(band);
  }

  /**
   * Fetch the name of the bands and set it in the state
   */
  fetchBandNames() {
    this.setState({ loading: true, error: null });
    this.rasterService.getBandNames()
      .then(bands => this.setState({ bands }))
      .catch(({ message }) => this.setState({ error: message }))
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading, bands, error } = this.state;

    return (
      <div className="c-raster-chart-editor">
        <h5>Bands { loading && <Spinner isLoading className="-light -small -inline" /> }</h5>
        { error && <div className="error"><span>Error:</span> {error}</div> }
        { !error && (
          <Select
            properties={{
              name: 'raster-bands'
            }}
            options={bands.map(band => ({ label: band, value: band }))}
            onChange={this.onChangeBand}
          />
        ) }
      </div>
    );
  }
}

RasterChartEditor.propTypes = {
  dataset: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  onChangeBand: PropTypes.func // Callback executed with the name of the band
};

RasterChartEditor.defaultProps = {
  onChangeBand: () => {}
};

export default RasterChartEditor;
