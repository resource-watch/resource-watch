import { createAction, createThunkAction } from 'redux-tools';

// Actions
import { setContextActiveLayers } from 'layout/pulse/layer-pill/actions';

// Components
import LayerGlobeManager from 'utils/layers/LayerGlobeManager';

export const resetLayerPoints = createAction('layer-menu-dropdown/resetLayerPoints');
export const setActiveLayer = createAction('layer-menu-dropdown/setActiveLayer');
export const setActiveLayerLoading = createAction('layer-menu-dropdown/setActiveLayerLoading');
export const setActiveLayerError = createAction('layer-menu-dropdown/setActiveLayerError');

export const toggleActiveLayer = createThunkAction('layer-menu-dropdown/toggleActiveLayer', ({
  id,
  threedimensional,
  markerType,
  basemap,
  contextLayers,
  descriptionPulse,
  contextLayersOnTop,
  label
}) =>
  (dispatch) => {
    if (id) {
      // Clear the possible active layers from the previous layer selection
      dispatch(setContextActiveLayers([]));
      dispatch(setActiveLayerLoading(true));

      const layerGlobeManager = new LayerGlobeManager();

      fetch(new Request(`${process.env.WRI_API_URL}/layer/${id}`))
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error(response.statusText);
        })
        .then(async (response) => {
          const layer = response.data;
          layer.threedimensional = threedimensional;
          layer.markerType = markerType;
          layer.contextLayersOnTop = contextLayersOnTop;
          layer.basemap = basemap;
          layer.contextLayers = [];
          layer.descriptionPulse = descriptionPulse;
          layer.label = label;

          layerGlobeManager.addLayer(
            layer.attributes,
            {
              onLayerAddedSuccess: function success(result) {
                layer.url = result.url;
                if (contextLayers.length > 0) {
                  let layersLoaded = 0;
                  const urlSt = `${process.env.WRI_API_URL}/layer/?ids=${contextLayers.join()}&env=production,preproduction`;
                  fetch(new Request(urlSt))
                    .then((resp) => {
                      return resp.json();
                    })
                    .then((res) => {
                      res.data.forEach((l) => {
                        layerGlobeManager.addLayer(
                          { ...l.attributes, id: l.id },
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
      dispatch(setActiveLayer(null));
    }
  });
