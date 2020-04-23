import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, Router } from 'routes';

// Utils
import { LAYERS_PLANET_PULSE } from 'utils/layers/pulse_layers';

// Components
import Legend from 'layout/app/pulse/legend';
import WidgetChart from 'components/charts/widget-chart';
import LoginRequired from 'components/ui/login-required';
import LayerInfoModal from 'components/modal/layer-info-modal';
import Icon from 'components/ui/icon';

// Modal
import Modal from 'components/modal/modal-component';
import SubscriptionsModal from 'components/modal/subscriptions-modal/dataset';

// styles
import './styles.scss';

class LayerCardComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showSubscribeToDatasetModal: false,
      showInfoModal: false,
      showContextLayersInfoModal: false
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if ((nextProps.layerMenuPulse.layerActive && nextProps.layerMenuPulse.layerActive.id) !==
      (this.props.layerMenuPulse.layerActive && this.props.layerMenuPulse.layerActive.id)) {
      this.loadWidgets(nextProps);
      this.props.loadDatasetData(nextProps.layerMenuPulse.layerActive
        ? { id: nextProps.layerMenuPulse.layerActive.dataset }
        : null);
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
    const { showSubscribeToDatasetModal, showInfoModal, showContextLayersInfoModal } = this.state;
    const { layerMenuPulse, layerCardPulse, activeContextLayers } = this.props;
    const { layerActive, layerPoints } = layerMenuPulse;
    const { dataset, widget } = layerCardPulse;
    const subscribable = dataset && dataset.subscribable &&
      Object.keys(dataset.subscribable).length > 0;

    const source = dataset && dataset.metadata && dataset.metadata.source;
    const layerName = layerActive && layerActive.name;
    const rotatableGlobe = layerActive && layerActive.rotatableGlobe;
    const lastUpdateDate = dataset && dataset.dataLastUpdated;

    const className = classNames({
      'c-layer-card': true,
      '-hidden': layerActive === null
    });

    const datasetId = (layerActive !== null) ? layerActive.dataset : null;

    return (
      <div className={className}>
        <div>
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
          {rotatableGlobe &&
            <div>
              <button
                className="c-button -secondary rotate-globe-button"
                onClick={() => this.props.togglePosition()}
              >
                Rotate globe
              </button>
            </div>
          }
          <div className="legends">
            {layerName &&
              <div className="layer-container">
                <div>{layerName}</div>
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
                      layer={layerActive}
                    />
                  </Modal>
                </button>
              </div>
            }
            {
              lastUpdateDate &&
              <div className="last-update-date-container">
                Last update: {lastUpdateDate}
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
                    <div key={ctLayer.name}>
                      <div className="layer-container">
                        <span>{ctLayer.name}</span>
                        <button
                          type="button"
                          className="info"
                          aria-label="More information"
                          onClick={() => this.setState({ showContextLayersInfoModal: true })}
                        >
                          <Icon name="icon-info" />

                          <Modal
                            isOpen={showContextLayersInfoModal}
                            className="-medium"
                            onRequestClose={() => this.setState({ showContextLayersInfoModal: false })}
                          >
                            <LayerInfoModal
                              layer={ctLayer}
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
                onClick={() => Router.pushRoute('explore', { dataset: widget.dataset })}
                onKeyDown={() => Router.pushRoute('explore', { dataset: widget.dataset })}
                role="button"
                tabIndex={-1}
              >
                <div className="widget-title">
                  {widget.name}
                </div>

                <WidgetChart
                  widget={widget}
                  thumbnail={true}
                />
              </div>
            </div>
          }
          <div className="card-buttons">
            {datasetId &&
              <Link
                route="explore"
                params={{ dataset: datasetId }}
              >
                <a className="c-button -tertiary link_button" >Details</a>
              </Link>
            }
            {subscribable &&
              <LoginRequired>
                <button
                  className="c-button -secondary link_button"
                  onClick={() => this.handleToggleSubscribeToDatasetModal(true)}
                >
                  Subscribe to alerts
                  <Modal
                    isOpen={showSubscribeToDatasetModal}
                    onRequestClose={() => this.handleToggleSubscribeToDatasetModal(false)}
                  >
                    <SubscriptionsModal
                      onRequestClose={() => this.handleToggleSubscribeToDatasetModal(false)}
                    />
                  </Modal>
                </button>
              </LoginRequired>
            }
          </div>
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
  setWidget: PropTypes.func.isRequired,
  togglePosition: PropTypes.func.isRequired
};

export default LayerCardComponent;
