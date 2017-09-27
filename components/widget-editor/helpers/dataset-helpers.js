const getKey = (obj, val) => Object.keys(obj).find(key => obj[key] === val);

// Namespace for dataset types in WRI's API
const TYPES = {
  tabular: 'tabular',
  raster: 'raster'
};

// Namespace for dataset connectors in WRI's API
const CONNECTORS = {
  doc: 'document',
  rest: 'rest'
};

// Namespace for dataset providers in WRI's API
const PROVIDERS = {
  carto: 'cartodb',
  gee: 'gee',
  wms: 'wms',
  nextgddp: 'nextgddp',
  bigquery: 'bigquery',
  rasdaman: 'rasdaman',
  featureService: 'featureservice',
  imageService: 'imageservice'
};

const visTypes = {
  chart: 'Chart',
  table: 'Table',
  map: 'Map',
  embed: 'Embed',
  text: 'Text'
};

const DECISIONTREE = {
  tabular: {
    rest: {
      carto: [visTypes.chart, visTypes.table, visTypes.map],
      gee: [visTypes.chart, visTypes.table, visTypes.map],
      featureService: [visTypes.chart, visTypes.table, visTypes.map],
      wms: [visTypes.map],
      bigquery: [visTypes.chart, visTypes.table, visTypes.map],
      nextgddp: [visTypes.chart, visTypes.table, visTypes.map]
    },
    doc: {
      csv: [visTypes.chart, visTypes.table, visTypes.map],
      tsv: [visTypes.chart, visTypes.table, visTypes.map],
      xml: [visTypes.chart, visTypes.table, visTypes.map],
      json: [visTypes.chart, visTypes.table, visTypes.map]
    }
  },
  raster: {
    rest: {
      carto: [visTypes.chart, visTypes.map],
      gee: [visTypes.chart, visTypes.map],
      imageService: [visTypes.chart, visTypes.map],
      rasdaman: [visTypes.chart, visTypes.map]
    }
  }
};

export const getVisualisationTypes = (datasetData) => {
  if (!datasetData) throw Error('datasetData param is required.');

  const { id, type, connectorType, provider, geoInfo } = datasetData;
  const datasetType = !type ? 'tabular' : getKey(TYPES, type); // null means 'tabular'
  const datasetConnector = getKey(CONNECTORS, connectorType);
  const datasetProvider = getKey(PROVIDERS, provider);

  let visualisationTypes = DECISIONTREE[datasetType][datasetConnector][datasetProvider];

  // Checking geoInfo: it will remove Map if geoInfo is false
  if (!geoInfo) {
    visualisationTypes = visualisationTypes.filter(el => el !== visTypes.map);
  }

  return {
    datasetId: id,
    type: TYPES[datasetType],
    connectorType,
    provider,
    visualisationTypes
  };
};
