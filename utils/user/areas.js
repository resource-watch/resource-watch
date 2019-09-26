export const mergeSubscriptions = (userAreas = [], userSusbcriptions = [], datasets = []) => {
  userSusbcriptions.map(_userSubscription => ({
    ..._userSubscription,
    datasets: _userSubscription.datasets.map(val => datasets.find(_dataset => _dataset.id === val))
  }));

  // Load datasets info
  userSusbcriptions.forEach((sub) => {
    const tempArea = userAreas.find(val => val.id === sub.params.area);
    if (tempArea) {
      tempArea.subscription = sub;
    }
  });

  return userAreas;
};

export function setGeoLayer(geo) {
  const obj = geo.data;
  const bounds = [
    [obj.attributes.bbox[0], obj.attributes.bbox[1]],
    [obj.attributes.bbox[2], obj.attributes.bbox[3]]
  ];
  const fakeLayer = {
    id: `${obj.id}`,
    provider: 'geojson',
    active: true,
    layerConfig: {
      data: obj.attributes.geojson,
      fitBounds: true,
      bounds: { type: 'Polygon', coordinates: [bounds] }
    }
  };

  return {
    dataset: null,
    visible: true,
    layers: [fakeLayer]
  };
}

export function setCountryLayer(res) {
  const country = res.data[0];
  const newGeoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: JSON.parse(country.geojson)
      }
    ]
  };
  const fakeLayer = {
    id: `-${country.label}`,
    provider: 'geojson',
    active: true,
    layerConfig: {
      data: newGeoJson,
      fitBounds: true,
      bounds: JSON.parse(country.bounds)
    }
  };

  return {
    dataset: null,
    visible: true,
    layers: [fakeLayer]
  };
}

export default {
  mergeSubscriptions,
  setGeoLayer,
  setCountryLayer
};
