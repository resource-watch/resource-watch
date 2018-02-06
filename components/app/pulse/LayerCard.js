import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { setSimilarWidgets, toggleContextualLayer } from 'redactions/pulse';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import Legend from 'components/app/pulse/Legend';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';
import LoginModal from 'components/modal/LoginModal';

// Services
import WidgetService from 'services/WidgetService';
import DatasetService from 'services/DatasetService';

import { LAYERS_PLANET_PULSE } from 'utils/layers/pulse_layers';

class LayerCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: null
    };

    this.buttonsListenersAdded = false;

    // ------------------- Bindings -----------------------
    this.handleSubscribeToAlerts = this.handleSubscribeToAlerts.bind(this);
    this.handleContextLayerClick = this.handleContextLayerClick.bind(this);
    // ----------------------------------------------------
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pulse.layerActive !== this.props.pulse.layerActive) {
      this.loadWidgets(nextProps);
      this.loadDatasetData(nextProps);
    }
  }

  loadDatasetData(nextProps) {
    const { pulse } = nextProps;
    const layerActiveLoaded = pulse.layerActive && pulse.layerActive.id;

    if (layerActiveLoaded) {
      this.datasetService = new DatasetService(pulse.layerActive.attributes.dataset, {
        apiURL: process.env.WRI_API_URL,
        language: nextProps.locale
      });

      this.datasetService.fetchData().then((data) => {
        this.setState({
          dataset: data
        });
      });
    }
  }

  loadWidgets(nextProps) {
    const { pulse } = nextProps;
    const layerActive = pulse.layerActive && pulse.layerActive.id;

    if (layerActive) {
      let found = false;
      for (let i = 0; i < LAYERS_PLANET_PULSE.length && !found; i++) {
        found = LAYERS_PLANET_PULSE[i].layers.find(obj => obj.id === layerActive);
      }
      if (found) {
        const { widgets } = found;
        if (widgets && widgets.length && widgets.length > 0) {
          const widgetService = new WidgetService(widgets[0], { apiURL: process.env.WRI_API_URL });
          widgetService.fetchData().then((response) => {
            this.props.setSimilarWidgets([response]);
          });
        } else {
          this.props.setSimilarWidgets([]);
        }
      } else {
        this.props.setSimilarWidgets([]);
      }
    }
  }

  addListenersToLayerButtons() {
    const buttons = Array.from(document.getElementsByClassName('layer-button'));
    buttons.forEach(button =>
      button.addEventListener('click', (event) => this.handleContextLayerClick(event, button.id)));
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

  handleContextLayerClick(event, layerId) {
    const classList = event.target.classList;
    if (Array.from(classList).find(e => e === '-active')) {
      classList.remove(['-active', '-primary']);
      classList.add(['-secondary']);
    } else {
      classList.remove(['-secondary']);
      classList.add(['-active', '-primary']);
    }
    this.props.toggleContextualLayer(layerId);
  }

  render() {
    const { pulse, contextualLayers } = this.props;
    const { layerActive, layerPoints, similarWidgets } = pulse;
    const { dataset } = this.state;
    const subscribable = dataset && dataset.attributes && dataset.attributes.subscribable &&
      Object.keys(dataset.attributes.subscribable).length > 0;

    const className = classNames({
      'c-layer-card': true,
      '-hidden': layerActive === null
    });

    const datasetId = (layerActive !== null) ? layerActive.attributes.dataset : null;

    if (layerActive && layerActive.descriptionPulse && !this.buttonsListenersAdded) {
      this.buttonsListenersAdded = true;
      setTimeout(() => this.addListenersToLayerButtons(), 500);
    }

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
        {contextualLayers &&
          <div className="context-layers-legends">
            {
              contextualLayers.map(ctLayer => (
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
              route={'explore_detail'}
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

LayerCard.propTypes = {
  // PROPS
  pulse: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  contextualLayers: PropTypes.array,

  // Actions
  setSimilarWidgets: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  toggleContextualLayer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pulse: state.pulse,
  user: state.user,
  locale: state.common.locale
});

const mapDispatchToProps = {
  toggleModal,
  setModalOptions,
  setSimilarWidgets,
  toggleContextualLayer
};

export default connect(mapStateToProps, mapDispatchToProps)(LayerCard);
