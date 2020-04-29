import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';
import { Tooltip } from 'vizzuality-components';
import { CancelToken } from 'axios';

// services
import { fetchGeostore } from 'services/geostore';

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES } from 'components/map/constants';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import Spinner from 'components/ui/Spinner';
import Modal from 'components/modal/modal-component';
import SubscriptionsModal from 'components/modal/subscriptions-modal/area';
import AreaActionsTooltip from './tooltip';

// styles
import './styles.scss';

const AreaCard = (props) => {
  const { area, removeUserArea } = props;
  const {
    subscriptions,
    subscription,
    name,
    geostore: geostoreId
  } = area;
  const [modal, setModalState] = useState({ open: false, mode: 'new' });
  const [tooltip, setTooltipState] = useState({ open: false });
  const [loading, setLoadingState] = useState(true);
  const [layer, setLayerState] = useState({ bounds: {}, geojson: null });

  const handleEditArea = () => {
    const { id } = area;
    Router.pushRoute('myrw_detail', { id, tab: 'areas' });
  };

  const handleEditSubscription = (modalState = true) => {
    setModalState({
      open: modalState,
      mode: subscription ? 'edit' : 'new'
    });
  };

  const handleDeleteArea = () => {
    toastr.confirm(`Are you sure you want to delete the area ${area.name}?
      Deleting an area will delete all the subscriptions associated to it`,
    { onOk: () => { removeUserArea(area); } });
  };

  const handleTooltip = (isTooltipOpen) => {
    setTooltipState({
      ...tooltip,
      open: isTooltipOpen
    });
  };

  useEffect(() => {
    const cancelToken = CancelToken.source();

    fetchGeostore(geostoreId, { cancelToken: cancelToken.token })
      .then((geostore = {}) => {
        const { bbox, geojson } = geostore;

        setLayerState({
          bounds: { bbox, options: { padding: 30 } },
          geojson
        });
      })
      .catch(() => {
        toastr.error(`Something went wrong loading your area "${name}"`);
      });

    return () => { cancelToken.cancel('Fetching geostore: operation canceled by the user.'); };
  }, [area, geostoreId, name]);

  const { open: isModalOpen } = modal;
  const { open: isTooltipOpen } = tooltip;
  const { bounds, geojson } = layer;
  const mapContainerClass = classnames({
    'map-container': true,
    '-ready': !loading
  });

  return (
    <div className="c-area-card">
      <div className={mapContainerClass}>
        <Spinner
          isLoading={loading}
          className="-transparent"
        />
        <Map
          mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
          mapStyle={MAPSTYLES}
          viewport={DEFAULT_VIEWPORT}
          basemap="dark"
          boundaries
          bounds={bounds}
          fitBoundsOptions={{ transitionDuration: 0 }}
          getCursor={() => 'default'}
          doubleClickZoom={false}
          scrollZoom={false}
          touchZoom={false}
          reuseMaps
          dragRotate={false}
          dragPan={false}
          visible={!loading}
          onLoad={({ map }) => {
            map.on('render', () => {
              if (map.areTilesLoaded()) {
                setLoadingState(false);
                map.off('render');
              }
            });
          }}
        >
          {_map => (
            <LayerManager
              map={_map}
              layers={geojson ? [{
                id: 'user-area',
                provider: 'geojson',
                layerConfig: {
                  parse: false,
                  data: geojson,
                  body: {
                    vectorLayers: [
                    {
                      id: 'user-area-line',
                      type: 'line',
                      source: 'user-area',
                      paint: { 'line-color': '#fab72e' }
                    },
                    {
                      id: 'user-area-fill',
                      type: 'fill',
                      source: 'user-area',
                      paint: {
                        'fill-color': '#fab72e',
                        'fill-opacity': 0.2
                      }
                    }
                  ]
                  }
                }
              }] : []}
            />
          )}
        </Map>
      </div>
      <div className="text-container">
        <div className="name-container">
          <h4>{name}</h4>
        </div>
        <div className="subscriptions-container">
          {subscriptions && subscriptions.length > 0 &&
            <div className="datasets-container">
              <div className="datasets-list">
                {subscriptions.map(_subscription => (
                  <div
                    className="dataset-element"
                    key={_subscription.id}
                  >
                    <div className="dataset-subscription-type">
                      {_subscription.datasetsQuery[0].type}
                      &nbsp;({_subscription.datasetsQuery[0].threshold})
                    </div>
                    <div className="subscription-status">
                      <div className="status-label">
                        {!_subscription.confirmed &&
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
          <Tooltip
            visible={isTooltipOpen}
            overlayClassName="c-rc-tooltip -default"
            placement="top"
            destroyTooltipOnHide
            overlay={
              <AreaActionsTooltip
                onEditArea={handleEditArea}
                onEditSubscriptions={handleEditSubscription}
                onDeleteArea={handleDeleteArea}
                onMouseDown={() => { handleTooltip(false); }}
                area={area}
              />
            }
          >
            <button
              type="button"
              className="c-btn -secondary -compressed"
              onClick={() => { handleTooltip(true); }}
            >
              Area Options
            </button>
          </Tooltip>
        </div>
      </div>

      {isModalOpen &&
        <Modal
          isOpen
          onRequestClose={() => handleEditSubscription(false)}
        >
          <SubscriptionsModal
            activeArea={area}
            onRequestClose={() => handleEditSubscription(false)}
          />
        </Modal>}
    </div>
  );
};

AreaCard.propTypes = {
  area: PropTypes.object.isRequired,
  removeUserArea: PropTypes.func.isRequired
};

export default AreaCard;
