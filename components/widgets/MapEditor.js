import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

import { showLayer } from 'redactions/widgetEditor';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import Select from 'components/form/SelectInput';
import EmbedLayerModal from 'components/modal/EmbedLayerModal';

class MapEditor extends React.Component {

  @Autobind
  handleLayerChange(layerID) {
    this.props.showLayer(this.props.layers.find(val => val.id === layerID));
  }

  @Autobind
  handleEmbedMap() {
    const options = {
      children: EmbedLayerModal,
      childrenProps: {
        url: window.location.href,
        layerGroups: this.props.layerGroups
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const { widgetEditor, layers } = this.props;
    const { layer } = widgetEditor;

    return (
      <div className="c-map-editor">
        <div className="selector-container">
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
        {layer &&
          <div className="actions-container">
            <a
              tabIndex={0}
              role="button"
              onClick={this.handleEmbedMap}
            >
              Embed Map
            </a>
          </div>
        }
      </div>
    );
  }
}


MapEditor.propTypes = {
  layerGroups: PropTypes.array, // List of layer groups
  layers: PropTypes.array.isRequired, // Dataset ID
  // Store
  showLayer: PropTypes.func.isRequired,
  widgetEditor: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired
};

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = dispatch => ({
  showLayer: layer => dispatch(showLayer(layer)),
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapEditor);
