import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, Router } from 'routes';

// Utils
import { LAYERS_PLANET_PULSE } from 'utils/layers/pulse_layers';

// Components
import Legend from 'layout/pulse/legend';
import WidgetChart from 'components/charts/widget-chart';
import LoginRequired from 'components/ui/login-required';
import LayerInfoModal from 'components/modal/LayerInfoModal';
import Icon from 'components/ui/Icon';

// Modal
import Modal from 'components/modal/modal-component';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';


class LayerCardComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showSubscribeToDatasetModal: false,
      showInfoModal: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.layerMenuPulse.layerActive && nextProps.layerMenuPulse.layerActive.id) !==
      (this.props.layerMenuPulse.layerActive && this.props.layerMenuPulse.layerActive.id)) {
      this.loadWidgets(nextProps);
      this.props.loadDatasetData({ id: nextProps.layerMenuPulse.layerActive.attributes.dataset });
    }
  }

  loadWidgets(nextProps) {
    const { layerMenuPulse } = nextProps;
    const layerActive = layerMenuPulse.layerActive && layerMenuPulse.layerActive.id;

    if (layerActive) {
      let found = false;
      for (let i = 0; i < LAYERS_PLANET_PULSE.length && !found; i++) {
        found = LAYERS_PLANET_PULSE[i].layers.find(obj => obj.id === layerActive);
      }
      if (found) {
        const { widgets } = found;
        if (widgets && widgets.length > 0) {
          this.props.loadWidgetData(widgets[0]);
        } else {
          this.props.setWidget(null);
        }
      }
    }
  }

  handleToggleSubscribeToDatasetModal = (bool) => {
    this.setState({ showSubscribeToDatasetModal: bool });
  }

  render() {
    const { showSubscribeToDatasetModal, showInfoModal } = this.state;
    const { layerMenuPulse, layerCardPulse, activeContextLayers } = this.props;
    const { layerActive, layerPoints } = layerMenuPulse;
    const { dataset, widget } = layerCardPulse;
    const subscribable = dataset && dataset.attributes && dataset.attributes.subscribable &&
      Object.keys(dataset.attributes.subscribable).length > 0;

    const source = dataset && dataset.attributes && dataset.attributes.metadata &&
      dataset.attributes.metadata[0].attributes.source;
    const layerName = layerActive && layerActive.attributes && layerActive.attributes.name;

    const className = classNames({
      'c-layer-card': true,
      '-hidden': layerActive === null
    });

    const datasetId = (layerActive !== null) ? layerActive.attributes.dataset : null;

    console.log('activeContextLayers', activeContextLayers);

    return (
      <div className={className}>
        <h3>{layerActive && layerActive.label}</h3>
        {source &&
          <div className="source-container">
            {source}
          </div>
        }
        {layerActive && layerActive.descriptionPulse}
        {layerPoints && layerPoints.length > 0 &&
          <div className="number-of-points">
            Number of objects: {layerPoints.length}
          </div>
        }
        <div className="legends">
          {layerName &&
            <div className="layer-container">
              <span>{layerName}</span>
              <button
                type="button"
                className="info"
                aria-label="More information"
                onClick={() => this.setState({ showInfoModal: true })}
              >
                <Icon name="icon-info" />

                <Modal
                  isOpen={showInfoModal}
                  className="-medium"
                  onRequestClose={() => this.setState({ showInfoModal: false })}
                >
                  <LayerInfoModal
                    data={layerActive && layerActive.attributes}
                  />
                </Modal>
              </button>
            </div>
          }
          <Legend
            layerActive={layerActive}
            className={{ color: '-dark' }}
          />
          {activeContextLayers.length > 0 &&
            <div className="context-layers-legends">
              {
                activeContextLayers.map(ctLayer => (
                  <div>
                    <div className="layer-container">
                      <span>{ctLayer.attributes.name}</span>
                      <button
                        type="button"
                        className="info"
                        aria-label="More information"
                        onClick={() => this.setState({ showInfoModal: true })}
                      >
                        <Icon name="icon-info" />

                        <Modal
                          isOpen={showInfoModal}
                          className="-medium"
                          onRequestClose={() => this.setState({ showInfoModal: false })}
                        >
                          <LayerInfoModal
                            data={ctLayer.attributes}
                          />
                        </Modal>
                      </button>
                    </div>
                    <Legend
                      layerActive={ctLayer}
                      className={{ color: '-dark' }}
                    />
                  </div>
                ))
              }
            </div>
          }
        </div>
        {widget &&
          <div>
            <h5>Similar content</h5>
            <div
              key={widget.id}
              className="widget-card"
              onClick={() => Router.pushRoute('explore_detail', { id: widget.attributes.dataset })}
              onKeyDown={() => Router.pushRoute('explore_detail', { id: widget.attributes.dataset })}
              role="button"
              tabIndex={-1}
            >
              <div className="widget-title">
                {widget.attributes.name}
              </div>

              <WidgetChart
                widget={widget.attributes}
                mode="thumbnail"
              />
            </div>
          </div>
        }
        <div className="card-buttons">
          { datasetId &&
            <Link
              route="explore_detail"
              params={{ id: datasetId }}
            >
              <a className="c-button -tertiary link_button" >Details</a>
            </Link>
          }
          { subscribable &&
            <LoginRequired text="Log in or sign up to subscribe to alerts from this dataset">
              <button
                className="c-button -tertiary link_button"
                onClick={() => this.handleToggleSubscribeToDatasetModal(true)}
              >
                Subscribe to alerts
                <Modal
                  isOpen={showSubscribeToDatasetModal}
                  onRequestClose={() => this.handleToggleSubscribeToDatasetModal(false)}
                >
                  <SubscribeToDatasetModal
                    dataset={dataset}
                    showDatasetSelector={false}
                    onRequestClose={() => this.handleToggleSubscribeToDatasetModal(false)}
                  />
                </Modal>
              </button>
            </LoginRequired>
          }
        </div>
      </div>
    );
  }
}

LayerCardComponent.propTypes = {
  // PROPS
  layerMenuPulse: PropTypes.object.isRequired,
  layerCardPulse: PropTypes.object.isRequired,
  activeContextLayers: PropTypes.array.isRequired,

  // Actions
  loadDatasetData: PropTypes.func.isRequired,
  loadWidgetData: PropTypes.func.isRequired,
  setWidget: PropTypes.func.isRequired
};

export default LayerCardComponent;
