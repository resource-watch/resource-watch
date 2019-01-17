import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Link, Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';
import { removeUserArea, getUserAreaLayerGroups } from 'redactions/user';

// Selectors
import areaAlerts from 'selectors/user/areaAlerts';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/ui/map/Map';
import AreaActionsTooltip from 'components/areas/AreaActionsTooltip';

// Modal
import Modal from 'components/modal/modal-component';
import SubscriptionsModal from 'components/modal/subscriptions-modal/area';

// Services
import AreasService from 'services/AreasService';

// Utils
import LayerManager from 'utils/layers/LayerManager';

const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};

class AreaCard extends React.Component {
  /**
   * Return the position of the click within the page taking
   * into account the scroll (relative to the page, not the
   * viewport )
   * @static
   * @param {MouseEvent} e Event
   * @returns {{ x: number, y: number }}
   */
  static getClickPosition(e) {
    return {
      x: window.scrollX + e.clientX,
      y: window.scrollY + e.clientY
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      modal: {
        open: false,
        mode: 'new'
      }
    };

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });

    // ------------------- Bindings -----------------------
    this.handleEditSubscription = this.handleEditSubscription.bind(this);
    this.handleDeleteArea = this.handleDeleteArea.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditArea = this.handleEditArea.bind(this);
    // ----------------------------------------------------
  }

  handleEditArea() {
    Router.pushRoute('myrw_detail', { id: this.props.area.id, tab: 'areas' });
  }

  handleEditSubscription(modalState = true) {
    this.setState({
      modal: {
        open: modalState,
        mode: this.props.area.subscription ? 'edit' : 'new'
      }
    });
  }

  handleDeleteArea() {
    const { area } = this.props;
    const toastrConfirmOptions = {
      onOk: () => {
        this.props.removeUserArea(area);
      }
    };
    toastr.confirm(`Are you sure you want to delete the area ${area.attributes.name}?
      Deleting an area will delete all the subscriptions associated to it`, toastrConfirmOptions);
  }

  handleEdit(event) {
    const position = AreaCard.getClickPosition(event);
    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: AreaActionsTooltip,
      childrenProps: {
        toggleTooltip: this.props.toggleTooltip,
        onEditArea: this.handleEditArea,
        onEditSubscriptions: this.handleEditSubscription,
        onDeleteArea: this.handleDeleteArea
      }
    });
  }

  render() {
    const { loading } = this.state;
    const { area, user, alerts } = this.props;
    const { name } = area.attributes;
    const { subscription } = area;
    const subscriptionConfirmed = area.subscription && area.subscription.attributes.confirmed;

    const borderContainerClassNames = classnames({
      'border-container': true
    });

    // TODO: Selector
    let layerGroups = [];

    if (area.id in user.areas.layerGroups) {
      layerGroups = user.areas.layerGroups[area.id];
    }

    const activeAlerts = area.id in alerts ? alerts[area.id] : [];

    return (
      <div className="c-area-card">
        <div className={borderContainerClassNames}>
          <div className="map-container">
            <Spinner isLoading={loading} />

            {!loading &&
              <Map
                mapConfig={{
                  ...MAP_CONFIG,
                  ...!!layerGroups.length && {
                    bbox: [
                      layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][0][0],
                      layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][0][1],
                      layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][1][0],
                      layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][1][1]
                    ]
                  }
                }}
                LayerManager={LayerManager}
                layerGroups={layerGroups}
                interactionEnabled={false}
              />
            }
          </div>
          <div className="text-container">
            <div className="name-container">
              <h4>{name}</h4>
            </div>
            <div className="subscriptions-container">
              {activeAlerts &&
                <div className="datasets-container">
                  <div className="datasets-list">
                    {activeAlerts.map((alert, index) =>
                      (<div
                        className="dataset-element"
                        key={`${alert.id}-${index}`}
                      >
                        <div className="dataset-name">
                          {alert.id &&
                            <Link
                              route="explore_detail"
                              params={{ id: alert.id }}
                            >
                              <a>
                                {/* getLabel(alert.dataset) */}
                              </a>
                            </Link>}
                        </div>
                        <div className="dataset-subscription-type">
                          {alert.type}
                          &nbsp;({alert.threshold})
                        </div>
                      </div>)
                    )}
                  </div>
                </div>
              }
              {subscription &&
                <div className="subscription-status">
                  <div className="status-label">
                    {!subscriptionConfirmed &&
                      <div className="pending-label">
                        Pending email confirmation
                    </div>
                    }
                  </div>
                </div>
              }
            </div>
            <div className="actions-div">
              <button
                className="c-btn -secondary -compressed"
                onClick={this.handleEdit}
              >
                Area Options
              </button>
              {/* {activeAlerts.length > 0 &&
                <Link
                  route="myrw_detail"
                  params={{ id: area.id, tab: 'areas', subtab: 'alerts' }}
                >
                  <a
                    className="c-btn -tertiary -compressed"
                  >
                    View alerts
                  </a>
                </Link>} */}
            </div>
          </div>
        </div>

        {this.state.modal.open &&
          <Modal
            isOpen
            onRequestClose={() => this.handleEditSubscription(false)}
          >
            <SubscriptionsModal
              activeArea={area}
              onRequestClose={() => this.handleEditSubscription(false)}
            />
            {/* <AreaSubscriptionModal
              area={this.props.area}
              mode={this.state.modal.mode}
              onRequestClose={() => this.handleEditSubscription(false)}
              subscriptionDataset
              subscriptionType
              subscriptionThreshold
            /> */}
          </Modal>}

      </div>
    );
  }
}

AreaCard.propTypes = {
  area: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  alerts: PropTypes.object.isRequired,
  // Store
  toggleTooltip: PropTypes.func.isRequired,
  removeUserArea: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  locale: state.common.locale,
  user: state.user,
  alerts: areaAlerts(state)
});

const mapDispatchToProps = {
  toggleTooltip,
  removeUserArea,
  getUserAreaLayerGroups
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaCard);
