import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Tooltip } from 'vizzuality-components';
import axios from 'axios';

// services
import { fetchGeostore } from 'services/geostore';
import { updateArea } from 'services/areas';

// constants
import {
  DEFAULT_VIEWPORT,
  MAPSTYLES,
} from 'components/map/constants';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import Spinner from 'components/ui/Spinner';
import Modal from 'components/modal/modal-component';
import SubscriptionsModal from 'components/modal/subscriptions-modal/area';
import AreaActionsTooltip from 'components/areas/card/tooltip';

// hooks
import useSubscriptionsByArea from 'hooks/subscription/fetch-subscriptions-by-area';

// utils
import { getUserAreaLayer } from 'components/map/utils';

// styles
import './styles.scss';

const AreaCard = (props) => {
  const {
    area,
    token,
    removeUserArea,
    showSubscriptions,
    onMapView,
    onEditArea,
    onChangedVisibility,
    onDeletionArea,
  } = props;
  const {
    id,
    geostore,
    subscription,
    name,
    geostore: geostoreId,
    isVisible,
  } = area;
  const tooltipRef = useRef(null);
  const formRef = useRef(null);
  const nameRef = useRef(null);

  const [modal, setModalState] = useState({ open: false, mode: 'new' });
  const [areaName, setAreaName] = useState(name);
  const [tooltip, setTooltipState] = useState({ open: false });
  const [loading, setLoadingState] = useState(true);
  const [layer, setLayerState] = useState({ bounds: {}, geojson: null });

  const {
    data: subscriptionsByArea,
    refetch,
  } = useSubscriptionsByArea(id, token);

  const handleMapView = useCallback(() => onMapView(area), [onMapView, area]);

  const handleEditSubscription = useCallback((modalState = true) => {
    setModalState({
      open: modalState,
      mode: subscription ? 'edit' : 'new',
    });
  }, [subscription]);

  const handleDeleteArea = useCallback(() => {
    toastr.confirm(`Are you sure you want to delete the area ${area.name}?
      Deleting an area will delete all the subscriptions associated to it`,
    {
      onOk: async () => {
        try {
          await removeUserArea(area);
          onDeletionArea();
        } catch (e) {
          toastr.error(e.message);
        }
      },
    });
  }, [removeUserArea, onDeletionArea, area]);

  const handleChangeVisibility = useCallback(async () => {
    const {
      public: isAreaPublic,
    } = area;
    try {
      await updateArea(
        id,
        {
          public: !isAreaPublic,
        },
        token,
      );
      onChangedVisibility();
    } catch (e) {
      toastr.error('Something went wrong updating the area.');
    }
  }, [id, area, token, onChangedVisibility]);

  const handleTooltip = useCallback((isTooltipOpen) => {
    setTooltipState((prevTooltip) => ({
      ...prevTooltip,
      open: isTooltipOpen,
    }));
  }, []);

  const handleRenameArea = useCallback(() => {
    nameRef.current.select();
  }, []);

  const handleClick = useCallback(() => {
    nameRef.current.select();
  }, []);

  const handleChange = useCallback((evt) => {
    setAreaName(evt.target.value);
  }, []);

  const handleKeyDown = useCallback(async (evt) => {
    if (evt.key === 'Escape') {
      setAreaName(name);
      nameRef.current.blur();
    }
  }, [name]);

  const handleSubmit = useCallback(async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    try {
      await updateArea(
        id,
        {
          name: areaName,
          geostore,
        },
        token,
      );
      nameRef.current.blur();
      if (onEditArea) onEditArea(id);
    } catch (e) {
      toastr.error('Something went wrong updating the area.');
    }
  }, [id, areaName, geostore, token, onEditArea]);

  const openSubscriptionsModal = useCallback(() => {
    handleEditSubscription(true);
  }, [handleEditSubscription]);

  const closeSubscriptionsModal = useCallback(() => {
    handleEditSubscription(false);
    refetch();
  }, [handleEditSubscription, refetch]);

  useEffect(() => {
    fetchGeostore(geostoreId)
      .then((_geostore = {}) => {
        const { bbox, geojson } = _geostore;

        setLayerState({
          bounds: { bbox, options: { padding: 30 } },
          geojson,
        });
      })
      .catch((_error) => {
        if (axios.isCancel(_error)) {
          // eslint-disable-next-line no-console
          console.error('Cancelled by user');
        } else {
          toastr.error(`Something went wrong loading your area "${name}"`);
        }
      });
  }, [area, geostoreId, name]);

  useEffect(() => {
    setAreaName(name);
  }, [name]);

  const { open: isModalOpen } = modal;
  const { open: isTooltipOpen } = tooltip;
  const { bounds, geojson } = layer;
  const mapContainerClass = classnames({
    'map-container': true,
    '-ready': !loading,
  });

  const userAreaLayer = useMemo(() => (geojson ? [getUserAreaLayer({ id: 'user-area', geojson })] : []), [geojson]);

  const subscriptionsToConfirm = useMemo(() => subscriptionsByArea
    .filter(({ confirmed }) => !confirmed),
  [subscriptionsByArea]);

  return (
    <div className="c-area-card">
      <div className={mapContainerClass}>
        <Spinner
          isLoading={loading}
          className="-transparent"
        />
        <Map
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
          {(_map) => (
            <LayerManager
              map={_map}
              layers={userAreaLayer}
            />
          )}
        </Map>
      </div>
      <div className="text-container">
        <div className="basic-info">
          <div className="name-visibility">
            <form
              ref={(ref) => { formRef.current = ref; }}
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                id={`area-name-${id}`}
                name="area-name"
                required
                minLength={3}
                ref={(ref) => { nameRef.current = ref; }}
                onChange={handleChange}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                value={areaName}
                className="editable-name"
              />
            </form>
            {area.public && <span className="is-public">Public</span>}
          </div>
          <div className="subscriptions">
            {subscriptionsByArea.length > 0 && (
              <button
                type="button"
                className="c-btn -clean"
                onClick={openSubscriptionsModal}
              >
                {`${subscriptionsByArea.length} subscription`}
                {subscriptionsByArea.length > 1 && 's'}
                {subscriptionsToConfirm.length > 0 && ` (${subscriptionsToConfirm.length} to confirm)`}
              </button>
            )}
            {!subscriptionsByArea.length && (
              <span>
                No subscriptions
              </span>
            )}
          </div>
        </div>
        <div className="actions-container">
          <button
            type="button"
            className={classnames('c-btn -compressed -fs-medium', {
              '-primary': isVisible,
              '-secondary': !isVisible,
            })}
            onClick={handleMapView}
          >
            {isVisible ? 'Active' : 'Show area'}
          </button>
          <Tooltip
            visible={isTooltipOpen}
            overlayClassName="c-rc-tooltip -default"
            placement="top"
            destroyTooltipOnHide
            onPopupAlign={(ref) => { tooltipRef.current = ref; }}
            overlay={(
              <AreaActionsTooltip
                area={area}
                tooltipRef={tooltipRef}
                showSubscriptions={showSubscriptions}
                onMouseDown={() => { handleTooltip(false); }}
                onRenameArea={handleRenameArea}
                onChangeVisibility={handleChangeVisibility}
                onEditSubscriptions={openSubscriptionsModal}
                onDeleteArea={handleDeleteArea}
              />
            )}
          >
            <button
              type="button"
              className="c-btn -tertiary -compressed -fs-medium"
              onClick={() => { handleTooltip(true); }}
            >
              Edit
            </button>
          </Tooltip>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen
          onRequestClose={closeSubscriptionsModal}
        >
          <SubscriptionsModal
            area={area.id}
            onRequestClose={closeSubscriptionsModal}
          />
        </Modal>
      )}
    </div>
  );
};

AreaCard.defaultProps = {
  onEditArea: null,
};

AreaCard.propTypes = {
  token: PropTypes.string.isRequired,
  area: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    geostore: PropTypes.string.isRequired,
    subscriptions: PropTypes.arrayOf(
      PropTypes.shape({}).isRequired,
    ),
    subscription: PropTypes.shape({}),
    isVisible: PropTypes.bool,
    public: PropTypes.bool.isRequired,
  }).isRequired,
  showSubscriptions: PropTypes.bool.isRequired,
  onMapView: PropTypes.func.isRequired,
  onEditArea: PropTypes.func,
  onChangedVisibility: PropTypes.func.isRequired,
  onDeletionArea: PropTypes.func.isRequired,
  removeUserArea: PropTypes.func.isRequired,
};

export default AreaCard;
