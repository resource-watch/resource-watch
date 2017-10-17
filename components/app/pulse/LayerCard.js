import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Autobind } from 'es-decorators';

import { Link, Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { setSimilarWidgets } from 'redactions/pulse';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import Legend from 'components/app/pulse/Legend';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';


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
      this.datasetService = new DatasetService(pulse.layerActive.attributes.dataset,
        { apiURL: process.env.WRI_API_URL });
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

  @Autobind
  handleSubscribeToAlerts() {
    const options = {
      children: SubscribeToDatasetModal,
      childrenProps: {
        toggleModal: this.props.toggleModal,
        dataset: this.state.dataset,
        showDatasetSelector: false
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const { pulse, user } = this.props;
    const { layerActive, layerPoints, similarWidgets } = pulse;
    const { dataset } = this.state;
    const subscribable = dataset && dataset.attributes && dataset.attributes.subscribable;
    const userLoggedIn = user && user.id;

    const className = classNames({
      'c-layer-card': true,
      '-hidden': layerActive === null
    });

    const datasetId = (layerActive !== null) ? layerActive.attributes.dataset : null;

    return (
      <div className={className}>
        <h3>{layerActive && layerActive.attributes.name}</h3>
        {layerActive && layerActive.attributes.description &&
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: layerActive.attributes.description }} // eslint-disble-line react/no-danger
          />
        }
        {layerPoints && layerPoints.length > 0 &&
          <div className="number-of-points">
            Number of objects: {layerPoints.length}
          </div>
        }
        <Legend
          layerActive={layerActive}
          className={{ color: '-dark' }}
        />
        {similarWidgets && similarWidgets.length > 0 &&
          <div>
            <h5>Similar content</h5>
            <div className="similar-widgets">
              <div className="row list">
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
          { subscribable && userLoggedIn &&
            <button
              className="link_button"
              onClick={this.handleSubscribeToAlerts}
            >
              Subscribe to alerts
            </button>
          }
          { subscribable && !userLoggedIn &&
            <span className="subscribe-text">Log in to subscribe</span>
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

  // Actions
  setSimilarWidgets: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pulse: state.pulse,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  setSimilarWidgets: (widgets) => { dispatch(setSimilarWidgets(widgets)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerCard);
