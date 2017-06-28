import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { showLayer } from 'redactions/widgetEditor';

// Components
import Select from 'components/form/SelectInput';

// Services
import DatasetService from 'services/DatasetService';

class MapEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      layers: []
    };

    this.datasetService = new DatasetService(props.dataset, { apiURL: process.env.WRI_API_URL });
  }

  componentWillMount() {
    this.datasetService.getLayers().then((response) => {
      this.setState({
        layers: response
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  @Autobind
  handleLayerChange(val) {
    const layer = {
      id: val.id,
      name: val.attributes.name,
      subtitle: val.attributes.subtitle,
      ...val.attributes,
      order: 1,
      hidden: false
    };
    this.props.showLayer(layer);
  }

  render() {
    const { layers } = this.state;
    const { widgetEditor } = this.props;
    const { layer } = widgetEditor;

    return (
      <div className="c-map-editor">
        <h5>
          Layers
        </h5>
        <Select
          properties={{
            name: 'layer-selector',
            value: layer
          }}
          options={layers.map(val => (
            {
              label: val.attributes.name,
              value: val
            }
          ))}
          onChange={this.handleLayerChange}

        />
      </div>
    );
  }
}


MapEditor.propTypes = {
  dataset: PropTypes.string.isRequired, // Dataset ID
  // Store
  showLayer: PropTypes.func.isRequired,
  widgetEditor: PropTypes.object.isRequired
};

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = dispatch => ({
  showLayer: layer => dispatch(showLayer(layer))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(MapEditor);
