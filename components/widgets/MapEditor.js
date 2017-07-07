import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { showLayer } from 'redactions/widgetEditor';

// Components
import Select from 'components/form/SelectInput';

class MapEditor extends React.Component {

  @Autobind
  handleLayerChange(layerID) {
    this.props.showLayer(this.state.layers.find(val => val.id === layerID));
  }

  render() {
    const { widgetEditor, layers } = this.props;
    const { layer } = widgetEditor;

    return (
      <div className="c-map-editor">
        <h5>
          Layers
        </h5>
        <Select
          properties={{
            name: 'layer-selector',
            value: layer && layer.id,
            default: layer && layer.id
          }}
          options={layers.map(val => (
            {
              label: val.name,
              value: val.id
            }
          ))}
          onChange={this.handleLayerChange}

        />
      </div>
    );
  }
}


MapEditor.propTypes = {
  layers: PropTypes.array.isRequired, // Dataset ID
  // Store
  showLayer: PropTypes.func.isRequired,
  widgetEditor: PropTypes.object.isRequired
};

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = dispatch => ({
  showLayer: layer => dispatch(showLayer(layer))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(MapEditor);
