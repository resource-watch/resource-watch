import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, Router } from 'routes';

// Utils
import { LAYERS_PLANET_PULSE } from 'utils/layers/pulse_layers';

// Components
import Legend from 'components/app/pulse/Legend';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';
import LoginModal from 'components/modal/login-modal';

class LayerCardComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataset: null
    };

    // ------------------- Bindings -----------------------
    this.handleSubscribeToAlerts = this.handleSubscribeToAlerts.bind(this);
    // ----------------------------------------------------
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

  handleSubscribeToAlerts() {
    const { user } = this.props;
    const userLoggedIn = user && user.id;

    let options = null;
    if (!userLoggedIn) {
      options = {
        children: LoginModal,
        childrenProps: {
          toggleModal: this.props.toggleModal,
          text: 'Log in to subscribe to near-real time datasets'
        }
      };
    } else {
      options = {
        children: SubscribeToDatasetModal,
        childrenProps: {
          toggleModal: this.props.toggleModal,
          dataset: this.state.dataset,
          showDatasetSelector: false
        }
      };
    }
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const { layerMenuPulse, layerCardPulse } = this.props;
    const { layerActive, layerPoints } = layerMenuPulse;
    const { dataset, widget } = layerCardPulse;
    const subscribable = dataset && dataset.attributes && dataset.attributes.subscribable &&
      Object.keys(dataset.attributes.subscribable).length > 0;

    console.log('subscribable', subscribable, 'dataset', dataset);

    const className = classNames({
      'c-layer-card': true,
      '-hidden': layerActive === null
    });

    const datasetId = (layerActive !== null) ? layerActive.attributes.dataset : null;
    const contextLayers = layerActive && layerActive.contextLayers;

    return (
      <div className={className}>
        <h3>{layerActive && layerActive.attributes.name}</h3>
        {layerActive && layerActive.descriptionPulse}
        {layerPoints && layerPoints.length > 0 &&
          <div className="number-of-points">
            Number of objects: {layerPoints.length}
          </div>
        }
        <Legend
          layerActive={layerActive}
          className={{ color: '-dark' }}
        />
        {contextLayers &&
          <div className="context-layers-legends">
            {
              contextLayers.map(ctLayer => ctLayer.active && (
                <Legend
                  layerActive={ctLayer}
                  className={{ color: '-dark' }}
                />
              ))
            }
          </div>
        }
        {widget &&
          <div>
            <h5>Similar content</h5>
            <div
              key={widget.id}
              className="widget-card"
              onClick={() => Router.pushRoute('explore_detail', { id: widget.attributes.dataset })}
              role="button"
              tabIndex={-1}
            >
              <div className="widget-title">
                {widget.attributes.name}
              </div>
              <DatasetWidgetChart
                widget={widget.attributes}
                mode="thumbnail"
              />
            </div>
          </div>
        }
        <div className="buttons">
          { datasetId &&
            <Link
              route="explore_detail"
              params={{ id: datasetId }}
            >
              <a className="link_button" >Explore the data</a>
            </Link>
          }
          { subscribable &&
            <button
              className="link_button"
              onClick={this.handleSubscribeToAlerts}
            >
              Subscribe to alerts
            </button>
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
  user: PropTypes.object.isRequired,

  // Actions
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  loadDatasetData: PropTypes.func.isRequired,
  loadWidgetData: PropTypes.func.isRequired,
  setWidget: PropTypes.func.isRequired
};

export default LayerCardComponent;
