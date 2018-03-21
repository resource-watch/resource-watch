export function mergeSubscriptions(areas, subs, datasets) {
  // Fetch data for the datasets needed
  const datasetsWithLabels = datasets.map(elem => ({
    id: elem.id,
    label: elem.attributes.metadata && elem.attributes.metadata[0] &&
      elem.attributes.metadata[0].attributes.info &&
      elem.attributes.metadata[0].attributes.info.name ?
      elem.attributes.metadata[0].attributes.info.name :
      elem.attributes.name,
    ...elem.attributes
  }));

  // Merge datasets with labels inside of subscriptions
  subs.forEach((sub) => {
    sub.attributes.datasets = sub.attributes.datasets
      .map(val => datasetsWithLabels.find(elem => elem.id === val));
  });

  // Load datasets info
  subs.forEach((sub) => {
    const tempArea = areas.find(val => val.id === sub.attributes.params.area);
    if (tempArea) {
      tempArea.subscription = sub;
    }
  });

  return areas;
}

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
