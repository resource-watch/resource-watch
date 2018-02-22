import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, Router } from 'routes';

// Components
import Legend from 'components/app/pulse/Legend';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';
import LoginModal from 'components/modal/LoginModal';

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
    if ((nextProps.pulse.layerActive && nextProps.pulse.layerActive.id) !==
      (this.props.pulse.layerActive && this.props.pulse.layerActive.id)) {
      this.loadWidgets(nextProps);
      this.props.loadDatasetData(nextProps.pulse.layerActive.id);
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
    const { pulse } = this.props;
    const { layerActive, layerPoints, similarWidgets } = pulse;
    const { dataset } = this.state;
    const subscribable = dataset && dataset.attributes && dataset.attributes.subscribable &&
      Object.keys(dataset.attributes.subscribable).length > 0;

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
        {similarWidgets && similarWidgets.length > 0 &&
          <div>
            <h5>Similar content</h5>
            <div className="similar-widgets">
              {similarWidgets.map(widget =>
                (<div
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
                ))
              }
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
  pulse: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  contextualLayers: PropTypes.array,

  // Actions
  setSimilarWidgets: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  toggleContextualLayer: PropTypes.func.isRequired,
  loadDatasetData: PropTypes.func.isRequired
};

export default LayerCardComponent;
