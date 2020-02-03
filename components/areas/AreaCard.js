import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';
import {
  removeUserArea,
  getUserAreaLayerGroups
} from 'redactions/user';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/ui/map/Map';
import AreaActionsTooltip from 'components/areas/AreaActionsTooltip';

// Modal
import Modal from 'components/modal/modal-component';
import SubscriptionsModal from 'components/modal/subscriptions-modal/area';

// Utils
import LayerManager from 'utils/layers/LayerManager';

// services
import { fetchGeostore } from 'services/geostore';

const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};

class AreaCard extends React.Component {
  static propTypes = {
    area: PropTypes.object.isRequired,
    // Store
    toggleTooltip: PropTypes.func.isRequired,
    removeUserArea: PropTypes.func.isRequired
  };
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

  state = {
    loading: true,
    modal: {
      open: false,
      mode: 'new'
    },
    layer: {
      bbox: null,
      geojson: null
    }
  };

  UNSAFE_componentWillMount() {
    const { area: { geostore: geostoreId, name } } = this.props;

    fetchGeostore(geostoreId)
      .then((geostore = {}) => {
        const { bbox, geojson } = geostore;

        this.setState({
          layer: {
            bbox,
            geojson
          },
          loading: false
        });
      })
      .catch(({ message }) => {
        toastr.error(`Something went wrong loading your area ${name}`);
        throw new Error(message);
      });
  }

  handleEditArea = () => {
    Router.pushRoute('myrw_detail', { id: this.props.area.id, tab: 'areas' });
  }

  handleEditSubscription = (modalState = true) => {
    this.setState({
      modal: {
        open: modalState,
        mode: this.props.area.subscription ? 'edit' : 'new'
      }
    });
  }

  handleDeleteArea = () => {
    const { area } = this.props;
    const toastrConfirmOptions = {
      onOk: () => {
        this.props.removeUserArea(area);
      }
    };
    toastr.confirm(`Are you sure you want to delete the area ${area.name}?
      Deleting an area will delete all the subscriptions associated to it`, toastrConfirmOptions);
  }

  handleEdit = (event) => {
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
    const { area } = this.props;
    const {
      loading,
      layer: { bbox, geojson }
    } = this.state;
    const { name } = area;
    const { subscriptions } = area;

    const borderContainerClassNames = classnames({ 'border-container': true });

    return (
      <div className="c-area-card">
        <div className={borderContainerClassNames}>
          <div className="map-container">
            <Spinner isLoading={loading} />

            {!loading &&
              <Map
                mapConfig={{
                  ...MAP_CONFIG,
                  ...(bbox && { bbox })
                }}
                LayerManager={LayerManager}
                layerGroups={[{
                  id: 'layergroup-user-area',
                  visible: true,
                  layers: geojson ? [{
                    id: 'user-area',
                    active: true,
                    provider: 'leaflet',
                    layerConfig: {
                      body: geojson,
                      type: 'geoJSON',
                      options: { style: { fillOpacity: 0.2, weight: 3, opacity: 1, color: '#FAB72E' } }
                    }
                  }] : []
                }]}
                interactionEnabled={false}
              />
            }
          </div>
          <div className="text-container">
            <div className="name-container">
              <h4>{name}</h4>
            </div>
            <div className="subscriptions-container">
              {subscriptions && subscriptions.length > 0 &&
                <div className="datasets-container">
                  <div className="datasets-list">
                    {subscriptions.map(subscription => (
                      <div
                        className="dataset-element"
                        key={subscription.id}
                      >
                        <div className="dataset-subscription-type">
                          {subscription.datasetsQuery[0].type}
                          &nbsp;({subscription.datasetsQuery[0].threshold})
                        </div>
                        <div className="subscription-status">
                          <div className="status-label">
                            {!subscription.confirmed &&
                              <div className="pending-label">
                                Pending email confirmation
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    ))}
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
          </Modal>}

      </div>
    );
  }
}

const mapStateToProps = state => ({ locale: state.common.locale });

const mapDispatchToProps = {
  toggleTooltip,
  removeUserArea,
  getUserAreaLayerGroups
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaCard);
