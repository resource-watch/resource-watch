import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { Popup } from 'react-map-gl';
import {
  Legend,
  LegendListItem,
  LegendItemToolbar,
  LegendItemTypes,
  LegendItemTimeStep,
} from 'vizzuality-components';
import {
  LegendItemTimeline,
} from 'old-vizzuality-components';

// components
import Map from 'components/map';
import Modal from 'components/modal/modal-component';
import LayerInfoModal from 'components/modal/layer-info-modal';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import BasemapControls from 'components/map/controls/basemap';
import ResetViewControls from 'components/map/controls/reset-view';
import LayerPopup from 'components/map/popup';

// constants
import {
  MAPSTYLES,
  BASEMAPS,
  LABELS,
} from 'components/map/constants';
// todo: these constants should be generic
import {
  LEGEND_TIMELINE_PROPERTIES,
  TIMELINE_THRESHOLD,
} from 'layout/explore/explore-map/constants';

export default function MiniExploreMap({
  viewport,
  basemapId,
  labelsId,
  bounds,
  boundaries,
  activeLayers,
  activeInteractiveLayers,
  layerGroups,
  layerGroupsInteraction,
  layerGroupsInteractionSelected,
  layerGroupsInteractionLatLng,
  layerModal,
  mapClass,
  handleMapCursor,
  handleViewport,
  handleClosePopup,
  onChangeInteractiveLayer,
  handleZoom,
  handleBasemap,
  handleLabels,
  handleBoundaries,
  handleResetView,
  onClickLayer,
  onChangeOrder,
  onChangeInfo,
  onChangeOpacity,
  onChangeVisibility,
  onChangeLayer,
  onRemoveLayer,
  onChangeLayerDate,
  onChangeLayerTimeLine,
  handleFitBoundsChange,
}) {
  const {
    pitch,
    bearing,
  } = viewport;
  const resetViewBtnClass = classnames({
    '-with-transition': true,
    '-visible': pitch !== 0 || bearing !== 0,
  });
  const basemap = useMemo(() => BASEMAPS[basemapId], [basemapId]);
  const labels = useMemo(() => LABELS[labelsId], [labelsId]);
  const activeLayersWithoutAreaOfInterest = useMemo(
    () => activeLayers.filter(({ isAreaOfInterest }) => !isAreaOfInterest),
    [activeLayers],
  );

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
      }}
    >
      <Map
        interactiveLayerIds={activeInteractiveLayers}
        onClick={onClickLayer}
        mapStyle={MAPSTYLES}
        viewport={viewport}
        bounds={bounds}
        basemap={basemap.value}
        labels={labels.value}
        boundaries={boundaries}
        getCursor={handleMapCursor}
        className={mapClass}
        onViewportChange={handleViewport}
        onFitBoundsChange={handleFitBoundsChange}
      >
        {(_map) => (
          <>
            <LayerManager
              map={_map}
              layers={activeLayers}
            />

            {(!isEmpty(layerGroupsInteractionLatLng)
              && activeLayersWithoutAreaOfInterest.length) && (
              <Popup
                {...layerGroupsInteractionLatLng}
                closeButton
                closeOnClick={false}
                onClose={handleClosePopup}
                className="rw-popup-layer"
                maxWidth="250px"
                captureScroll
                capturePointerMove
              >
                <LayerPopup
                  data={{
                    // data available in certain point
                    layersInteraction: layerGroupsInteraction,
                    // ID of the layer will display data (defaults into the first layer)
                    layersInteractionSelected: layerGroupsInteractionSelected,
                    // current active layers to get their layerConfig attributes
                    layers: activeLayersWithoutAreaOfInterest,
                  }}
                  latlng={{
                    lat: layerGroupsInteractionLatLng.latitude,
                    lng: layerGroupsInteractionLatLng.longitude,
                  }}
                  onChangeInteractiveLayer={onChangeInteractiveLayer}
                />
              </Popup>
            )}
          </>
        )}
      </Map>

      <MapControls>
        <ZoomControls
          viewport={viewport}
          onClick={handleZoom}
        />
        <BasemapControls
          basemap={basemap}
          labels={labels}
          boundaries={boundaries}
          onChangeBasemap={handleBasemap}
          onChangeLabels={handleLabels}
          onChangeBoundaries={handleBoundaries}
        />
        <ResetViewControls
          className={resetViewBtnClass}
          onResetView={handleResetView}
        />
      </MapControls>

      <div className="c-legend-map">
        <Legend
          maxHeight={300}
          onChangeOrder={onChangeOrder}
        >
          {layerGroups.map((lg, i) => (
            <LegendListItem
              index={i}
              key={lg.id}
              layerGroup={lg}
              toolbar={(
                <LegendItemToolbar />
              )}
              onChangeInfo={onChangeInfo}
              onChangeOpacity={onChangeOpacity}
              onChangeVisibility={onChangeVisibility}
              onChangeLayer={onChangeLayer}
              onRemoveLayer={onRemoveLayer}
            >
              <LegendItemTypes />
              <LegendItemTimeStep
                handleChange={onChangeLayerDate}
                customClass="rw-legend-timeline"
                defaultStyles={LEGEND_TIMELINE_PROPERTIES}
                dots={false}
                {...lg.layers.length > TIMELINE_THRESHOLD && { dotStyle: { opacity: 0 } }}
              />
              {/* Temporary: only show old timeline approach if there's no occurrence of
                new timelineParams config
              */}
              {!lg.layers.find((l) => !!l.timelineParams) && (
                <LegendItemTimeline
                  onChangeLayer={onChangeLayerTimeLine}
                  customClass="rw-legend-timeline"
                  {...LEGEND_TIMELINE_PROPERTIES}
                  {...lg.layers.length > TIMELINE_THRESHOLD && { dotStyle: { opacity: 0 } }}
                />
              )}
            </LegendListItem>
          ))}
        </Legend>
      </div>
      {!!layerModal && (
        <Modal
          isOpen
          className="-medium"
          onRequestClose={() => onChangeInfo(null)}
        >
          <LayerInfoModal layer={layerModal} />
        </Modal>
      )}
    </div>
  );
}

MiniExploreMap.defaultProps = {
  mapClass: null,
  layerModal: null,
  layerGroupsInteractionLatLng: null,
  layerGroupsInteractionSelected: null,
};

MiniExploreMap.propTypes = {
  viewport: PropTypes.shape({
    bearing: PropTypes.number,
    pitch: PropTypes.number,
  }).isRequired,
  bounds: PropTypes.shape({}).isRequired,
  boundaries: PropTypes.bool.isRequired,
  basemapId: PropTypes.string.isRequired,
  labelsId: PropTypes.string.isRequired,
  layerModal: PropTypes.shape({}),
  mapClass: PropTypes.string,
  layerGroups: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  activeInteractiveLayers: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  layerGroupsInteraction: PropTypes.shape({}).isRequired,
  layerGroupsInteractionSelected: PropTypes.string,
  layerGroupsInteractionLatLng: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  activeLayers: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  handleMapCursor: PropTypes.func.isRequired,
  handleViewport: PropTypes.func.isRequired,
  handleFitBoundsChange: PropTypes.func.isRequired,
  handleClosePopup: PropTypes.func.isRequired,
  onChangeInteractiveLayer: PropTypes.func.isRequired,
  handleZoom: PropTypes.func.isRequired,
  handleBasemap: PropTypes.func.isRequired,
  handleLabels: PropTypes.func.isRequired,
  handleBoundaries: PropTypes.func.isRequired,
  handleResetView: PropTypes.func.isRequired,
  onClickLayer: PropTypes.func.isRequired,
  onChangeOrder: PropTypes.func.isRequired,
  onChangeInfo: PropTypes.func.isRequired,
  onChangeOpacity: PropTypes.func.isRequired,
  onChangeVisibility: PropTypes.func.isRequired,
  onChangeLayer: PropTypes.func.isRequired,
  onRemoveLayer: PropTypes.func.isRequired,
  onChangeLayerDate: PropTypes.func.isRequired,
  onChangeLayerTimeLine: PropTypes.func.isRequired,
};
