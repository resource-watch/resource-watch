import { createAction, createThunkAction } from 'redux-tools';

import { fetchLayers, fetchLayer } from 'services/layer';

// Actions
import { setContextActiveLayers } from 'layout/app/pulse/layer-pill/actions';
import { setInitialPosition } from 'components/vis/globe-cesium/actions';
import { resetLabelsLayer } from 'layout/app/pulse/labels-pill/actions';

// Components
import LayerGlobeManager from 'utils/layers/LayerGlobeManager';

export const resetLayerPoints = createAction('layer-menu/resetLayerPoints');
export const setActiveLayer = createAction('layer-menu/setActiveLayer');
export const setActiveLayerLoading = createAction('layer-menu/setActiveLayerLoading');
export const setActiveLayerError = createAction('layer-menu/setActiveLayerError');

export const resetActiveLayer = createThunkAction('layer-menu/resetActiveLayer', () => (dispatch) => {
  dispatch(setContextActiveLayers([]));
  dispatch(setActiveLayer(null));
  dispatch(setActiveLayerLoading(false));
  dispatch(resetLabelsLayer());
});

export const toggleActiveLayer = createThunkAction('layer-menu/toggleActiveLayer', ({
  id,
  threedimensional,
  markerType,
  basemap,
  contextLayers,
  descriptionPulse,
  contextLayersOnTop,
  label,
  rotatableGlobe,
  initialPosition
}) =>
  (dispatch, state) => {
    const { layerActive } = state().layerMenuPulse;
    if (!layerActive || layerActive.id !== id) {
      // Clear the possible active layers from the previous layer selection
      dispatch(setContextActiveLayers([]));
      dispatch(resetLabelsLayer());
      dispatch(setActiveLayerLoading(true));

      if (initialPosition) {
        dispatch(setInitialPosition(initialPosition));
      }

      const layerGlobeManager = new LayerGlobeManager();

      fetchLayer(id)
        .then((layer) => {
          layer.threedimensional = threedimensional;
          layer.markerType = markerType;
          layer.contextLayersOnTop = contextLayersOnTop;
          layer.basemap = basemap;
          layer.contextLayers = [];
          layer.descriptionPulse = descriptionPulse;
          layer.label = label;
          layer.rotatableGlobe = rotatableGlobe;
          layer.initialPosition = initialPosition;

          layerGlobeManager.addLayer(
            { ...layer, id },
            {
              onLayerAddedSuccess: function success(result) {
                layer.url = result.url;
                if (contextLayers.length > 0) {
                  let layersLoaded = 0;
                  fetchLayers({ ids: contextLayers.join() })
                    .then((res) => {
                      res.forEach((l) => {
                        layerGlobeManager.addLayer(
                          { ...l, id: l.id },
                          {
                            onLayerAddedSuccess: function successContextLayers(ctxtLayer) {
                              layer.contextLayers.push(ctxtLayer);
                              layersLoaded++;
                              if (contextLayers.length === layersLoaded) {
                                dispatch(setActiveLayer(layer));
                              }
                            }
                          },
                          true
                        );
                      });
                    });
                } else {
                  dispatch(setActiveLayer(layer));
                }
              }
            },
            true
          );
        })
        .catch((error) => {
          // Fetch from server ko -> Dispatch error
          dispatch(setActiveLayerError(error));
        });
    } else {
      dispatch(resetActiveLayer());
    }
  });
