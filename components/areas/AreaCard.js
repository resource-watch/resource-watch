import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Link, Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { removeUserArea, getUserAreaLayerGroups } from 'redactions/user';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/ui/map/Map';
import AreaSubscriptionModal from 'components/modal/AreaSubscriptionModal';
import AreaActionsTooltip from 'components/areas/AreaActionsTooltip';

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
      loading: false
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

  componentDidMount() {
    const {
      openSubscriptionsModal,
      subscriptionThreshold,
      subscriptionType,
      subscriptionDataset
    } = this.props;

    if (openSubscriptionsModal) {
      this.handleEditSubscription(subscriptionDataset, subscriptionType, subscriptionThreshold);
    }
  }

  handleEditArea() {
    Router.pushRoute('myrw_detail', { id: this.props.area.id, tab: 'areas' });
  }

  handleEditSubscription(
    subscriptionDataset = null,
    subscriptionType = null,
    subscriptionThreshold = null
  ) {
    const mode = this.props.area.subscription ? 'edit' : 'new';
    const options = {
      children: AreaSubscriptionModal,
      childrenProps: {
        area: this.props.area,
        toggleModal: this.props.toggleModal,
        onSubscriptionUpdated: this.handleSubscriptionUpdated,
        onSubscriptionCreated: this.handleSubscriptionUpdated,
        mode,
        subscriptionDataset,
        subscriptionType,
        subscriptionThreshold
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
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
    const { area, user } = this.props;
    const { name, id } = area.attributes;
    const { subscription } = area;
    const subscriptionConfirmed = area.subscription && area.subscription.attributes.confirmed;

    const borderContainerClassNames = classnames({
      'border-container': true
    });

    // TODO: Selector
    let layerGroups = [];
    if (user.areas.layerGroups.hasOwnProperty(area.id)) {
      layerGroups = user.areas.layerGroups[area.id];
    }

    return (
      <div className="c-area-card">
        <div className={borderContainerClassNames}>
          <div className="map-container">
            <Spinner isLoading={loading} />
            {!loading && <Map
              LayerManager={LayerManager}
              mapConfig={MAP_CONFIG}
              layerGroups={layerGroups}
              interactionEnabled={false}
              useLightBasemap
            />}
          </div>
          <div className="text-container">
            <div className="name-container">
              <h4>{name}</h4>
            </div>
            <div className="subscriptions-container">
              {subscription &&
                <div className="datasets-container">
                  <div className="datasets-list">
                    {subscription.attributes.datasets.map((datasetObj, index) => datasetObj &&
                      (<div
                        className="dataset-element"
                        key={`${datasetObj}-${index}`}
                      >
                        <div className="dataset-name">
                          <Link
                            route="explore_detail"
                            params={{ id: datasetObj.id }}
                          >
                            <a>
                              {datasetObj.label}
                            </a>
                          </Link>
                        </div>
                        <div className="dataset-subscription-type">
                          {subscription.attributes.datasetsQuery
                            .find(elem => elem.id === datasetObj.id).type}
                          &nbsp;({subscription.attributes.datasetsQuery
                            .find(elem => elem.id === datasetObj.id).threshold})
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
                className="c-btn -b -compressed"
                onClick={this.handleEdit}
              >
                Area Options
              </button>
              <Link
                route="myrw_detail"
                params={{ id: area.id, tab: 'areas', subtab: 'alerts' }}
              >
                <a>View alerts</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


AreaCard.defaultProps = {
  openSubscriptionsModal: false
};

AreaCard.propTypes = {
  area: PropTypes.object.isRequired,
  openSubscriptionsModal: PropTypes.bool,
  subscriptionThreshold: PropTypes.bool,
  subscriptionType: PropTypes.bool,
  subscriptionDataset: PropTypes.bool,
  // Store
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  removeUserArea: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  locale: state.common.locale,
  user: state.user
});

const mapDispatchToProps = {
  toggleModal,
  setModalOptions,
  toggleTooltip,
  removeUserArea,
  getUserAreaLayerGroups
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaCard);
