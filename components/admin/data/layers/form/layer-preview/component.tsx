import { useState, useEffect, useMemo, useCallback } from 'react';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import { MapEvent, Popup } from 'react-map-gl';
import { Legend, LegendListItem, LegendItemTypes } from 'vizzuality-components';

import type { ViewportProps } from 'react-map-gl';
import type { APILayerSpec } from 'types/layer';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import LayerPopup from 'components/map/popup';

import type { LngLatLike } from 'mapbox-gl';
import type { LayerPreviewInitialStateProps } from './initial-state';

// constants
import { MAPSTYLES, DEFAULT_VIEWPORT } from 'components/map/constants';

export interface generateLayerGroupsProps {
  layer: APILayerSpec;
  interactions: LayerPreviewInitialStateProps['interaction'];
}

export interface LayerPreviewProps {
  interactions: LayerPreviewInitialStateProps['interaction'];
  generateLayerGroups: (payload: generateLayerGroupsProps) => void;
  setLayerInteraction: (interactions: LayerPreviewInitialStateProps['interaction']) => void;
  setLayerInteractionSelected: () => void;
  setLayerInteractionLatLng: (coordinate: LngLatLike | null) => void;
  layer: APILayerSpec;
  layers: APILayerSpec[];
  adminLayerPreview: LayerPreviewInitialStateProps;
}

export const LayerPreview = ({
  adminLayerPreview,
  layer,
  layers,
  interactions,
  generateLayerGroups,
  setLayerInteraction,
  setLayerInteractionSelected,
  setLayerInteractionLatLng,
}: LayerPreviewProps): JSX.Element => {
  const [viewport, setViewport] = useState<ViewportProps>(DEFAULT_VIEWPORT);

  const { layerGroups, interaction, interactionLatLng, interactionSelected } = adminLayerPreview;

  const handleViewport = debounce((viewport: ViewportProps) => {
    setViewport(viewport);
  }, 250);

  const handleZoom = useCallback((zoom: number) => {
    setViewport(
      (viewport: ViewportProps): ViewportProps => ({
        ...viewport,
        zoom,
      }),
    );
  }, []);

  const handleClosePopup = useCallback(() => {
    setLayerInteractionLatLng(null);
  }, [setLayerInteractionLatLng]);

  const handleRefreshPreview = useCallback(() => {
    generateLayerGroups({ layer, interactions });
  }, [layer, interactions, generateLayerGroups]);

  const getInteractions = useCallback(({ features, interaction }) => {
    // if the user clicks on a zone where there is no data in any current layer
    // we will reset the current interaction of those layers to display "no data available" message
    const noDataAvailable = !features.length;

    if (noDataAvailable) {
      return Object.keys(interaction).reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          [currentValue]: {},
        }),
        {},
      );
    }

    return features.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.layer.source]: { data: currentValue.properties },
      }),
      {},
    );
  }, []);

  const onClickLayer = useCallback(
    ({ features, lngLat }: MapEvent) => {
      const interactions = getInteractions({ features, interaction });

      setLayerInteractionLatLng(lngLat);
      setLayerInteraction(interactions);
    },
    [interaction, getInteractions, setLayerInteraction, setLayerInteractionLatLng],
  );

  useEffect(() => {
    if (Boolean(Object.keys(layer.layerConfig).length)) handleRefreshPreview();
  }, [layer, handleRefreshPreview]);

  useEffect(() => {
    if (Boolean(Object.keys(interactions).length)) handleRefreshPreview();
  }, [interactions, handleRefreshPreview]);

  const shouldRenderPopup = useMemo(
    () => !isEmpty(interactionLatLng) && layers.length,
    [interactionLatLng, layers],
  );

  const layerPopupData = useMemo(
    () => ({
      // data available in certain point
      layersInteraction: interaction,
      // ID of the layer will display data (defaults into the first layer)
      layersInteractionSelected: interactionSelected,
      // current active layers to get their layerConfig attributes
      layers,
    }),
    [interaction, interactionSelected, layers],
  );

  const layerPopupLatlng = useMemo<LngLatLike>(() => {
    if (!interactionLatLng) return null;

    return {
      lat: interactionLatLng[0],
      lng: interactionLatLng[1],
    };
  }, [interactionLatLng]);

  const interactiveLayerIds = useMemo(
    () =>
      flatten(
        compact(
          layers.map((_activeLayer) => {
            const { id, layerConfig, interactionConfig } = _activeLayer;
            if (isEmpty(layerConfig) || isEmpty(interactionConfig)) return null;

            const { render } = layerConfig;
            if (!render) return null;

            const { layers } = render;

            if (layers) {
              return layers.map(
                ({ id: vectorLayerId, type: vectorLayerType }, index) =>
                  vectorLayerId || `${id}-${vectorLayerType}-${index}`,
              );
            }

            return null;
          }),
        ),
      ),
    [layers],
  );

  return (
    <div className="c-field preview-container">
      <h5>Layer preview</h5>
      <div
        className="relative"
        style={{
          height: 500,
        }}
      >
        <Map
          onClick={onClickLayer}
          mapStyle={MAPSTYLES}
          basemap="dark"
          labels="light"
          viewport={viewport}
          onMapViewportChange={handleViewport}
          scrollZoom={false}
          boundaries
          interactiveLayerIds={interactiveLayerIds}
        >
          {(_map) => (
            <>
              <LayerManager map={_map} layers={layers} />

              {shouldRenderPopup && (
                <Popup
                  {...(interactionLatLng && {
                    longitude: interactionLatLng[0],
                    latitude: interactionLatLng[1],
                  })}
                  closeButton
                  closeOnClick={false}
                  onClose={handleClosePopup}
                  className="rw-popup-layer"
                  // maxWidth="250px"
                >
                  <LayerPopup
                    data={layerPopupData}
                    latlng={layerPopupLatlng}
                    onChangeInteractiveLayer={setLayerInteractionSelected}
                  />
                </Popup>
              )}
            </>
          )}
        </Map>

        <MapControls>
          <ZoomControls viewport={viewport} onClick={handleZoom} />
        </MapControls>

        <div className="c-legend-map">
          <Legend maxHeight={140} sortable={false}>
            {layerGroups.map((lg, i) => (
              <LegendListItem index={i} key={lg.dataset} layerGroup={lg}>
                <LegendItemTypes />
              </LegendListItem>
            ))}
          </Legend>
        </div>
      </div>
      <div className="c-button-container -j-end layer-preview-actions">
        <button type="button" className="c-button -primary" onClick={handleRefreshPreview}>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default LayerPreview;
