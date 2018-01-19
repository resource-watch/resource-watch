import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

import { showLayer } from 'components/widgets/editor/redux/widgetEditor';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import Select from 'components/form/SelectInput';
// import EmbedLayerModal from 'components/widgets/editor/modal/EmbedLayerModal';
import SaveWidgetModal from 'components/modal/SaveWidgetModal';

class MapEditor extends React.Component {
  /**
   * Event handler executed when the user clicks the
   * Save button
   */
  @Autobind
  onClickSaveWidget() {
    const options = {
      children: SaveWidgetModal,
      childrenProps: {
        dataset: this.props.dataset,
        datasetType: this.props.datasetType,
        datasetProvider: this.props.provider,
        tableName: this.props.tableName
      }
    };

    this.props.toggleModal(true, options);
  }

  /**
   * Event handler executed when the user clicks the
   * Save button while editing an existing widget
   */
  @Autobind
  onClickUpdateWidget() {
    this.props.onUpdateWidget();
  }

  @Autobind
  handleLayerChange(layerID) {
    this.props.showLayer(this.props.layers.find(val => val.id === layerID));
  }

  render() {
    const { widgetEditor, layers, mode, showSaveButton, showNotLoggedInText } = this.props;
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
        <div className="actions-container">
          {showSaveButton && mode === 'save' && layer &&
            <button
              className="c-button -primary"
              onClick={this.onClickSaveWidget}
            >
              Save widget
            </button>
          }
          {showSaveButton && mode === 'update' && layer &&
            <button
              className="c-button -primary"
              onClick={this.onClickUpdateWidget}
            >
              Save widget
            </button>
          }
          {!showSaveButton && showNotLoggedInText &&
            <span className="not-logged-in-text">
              Please log in to save changes
            </span>
          }
        </div>
      </div>
    );
  }
}

MapEditor.propTypes = {
  layers: PropTypes.array.isRequired, // Dataset ID
  dataset: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  datasetType: PropTypes.string,
  mode: PropTypes.oneOf(['save', 'update']),
  showSaveButton: PropTypes.bool,
  showNotLoggedInText: PropTypes.bool,
  onUpdateWidget: PropTypes.func,

  // Store
  showLayer: PropTypes.func.isRequired,
  widgetEditor: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = dispatch => ({
  showLayer: layer => dispatch(showLayer(layer)),
  toggleModal: (...args) => { dispatch(toggleModal(...args)); },
  setModalOptions: (...args) => { dispatch(setModalOptions(...args)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapEditor);
