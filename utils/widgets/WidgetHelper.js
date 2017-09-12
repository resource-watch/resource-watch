import 'isomorphic-fetch';
import { format } from 'd3';
import { toastr } from 'react-redux-toastr';

// Components
import BarChart from 'utils/widgets/bar';
import LineChart from 'utils/widgets/line';
import PieChart from 'utils/widgets/pie';
import OneDScatterChart from 'utils/widgets/1d_scatter';
import OneDTickChart from 'utils/widgets/1d_tick';
import ScatterChart from 'utils/widgets/scatter';

// Utils
import getQueryByFilters from 'utils/getQueryByFilters';

// Services
import RasterService from 'services/RasterService';

const CHART_TYPES = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  scatter: ScatterChart,
  '1d_scatter': OneDScatterChart,
  '1d_tick': OneDTickChart
};

const ALLOWED_FIELD_TYPES = [
  // --- NUMBER ----
  { name: 'esriFieldTypeSmallInteger', type: 'number', provider: 'esri' },
  { name: 'esriFieldTypeInteger', type: 'number', provider: 'esri' },
  { name: 'esriFieldTypeSingle', type: 'number', provider: 'esri' },
  { name: 'esriFieldTypeDouble', type: 'number', provider: 'esri' },
  { name: 'numeric', type: 'number', provider: 'psql' },
  { name: 'number', type: 'number', provider: 'carto' },
  { name: 'int', type: 'number', provider: 'psql' },
  { name: 'integer', type: 'number', provider: 'psql' },
  { name: 'float', type: 'number', provider: 'sql' },
  { name: 'real', type: 'number', provider: 'sql' },
  { name: 'decimal', type: 'number', provider: 'sql' },
  // ----- TEXT -----
  { name: 'string', type: 'text', provider: 'sql' },
  { name: 'char', type: 'text', provider: 'sql' },
  { name: 'varchar', type: 'text', provider: 'sql' },
  { name: 'esriFieldTypeString', type: 'text', provider: 'esri' },
  { name: 'text', type: 'text', provider: 'elastic' },
  // ----- DATE ----
  { name: 'esriFieldTypeDate', type: 'date', provider: 'esri' },
  { name: 'date', type: 'date', provider: 'sql' },
  { name: 'time', type: 'date', provider: 'sql' },
  { name: 'timestamp', type: 'date', provider: 'sql' },
  { name: 'interval', type: 'date', provider: 'sql' },
  // ------ BOOLEAN -----
  { name: 'boolean', type: 'boolean', provider: 'sql' },
  // ------ ARRAY -------
  { name: 'array', type: 'array', provider: 'sql' }
];

const oneDimensionalChartTypes = ['1d_scatter', '1d_tick'];

/* eslint-disable max-len */
/**
 * @typedef ChartInfo - Information needed to compute a chart's config
 * @property {string} chartType - Type of the chart (scatter, pie, etc.)
 * @property {number} limit - Maximum number of row to fetch
 * @property {{ name: string, type: string }} order - Order of the data
 * (name corresponds to the column name and type to either "asc" or "desc")
 * @property {string} areaIntersection - Geostore ID of the area, if exists
 * @property {{ type: string, name: string, alias: string }} x - Column x
 * @property {{ type: string, name: string, alias: string, aggregateFunction: string }} y? - Column y
 * @property {{ alias: string, aggregateFunction: string }} color? - Column color
 * @property {{ alias: string, aggregateFunction: string }} size? - Column size
 */
/* eslint-enable max-len */

/**
 * Return whether the chart needs the x and y columns or just
 * the x one
 * @param {string} chartType - Type of chart
 * @returns {boolean}
 */
function isBidimensionalChart(chartType) {
  return !oneDimensionalChartTypes.includes(chartType);
}

export function isFieldAllowed(field) {
  const fieldTypeAllowed = ALLOWED_FIELD_TYPES
    .find(val => val.name.toLowerCase() === field.columnType.toLowerCase());
  const isCartodbId = field.columnName === 'cartodb_id';
  const result = !isCartodbId && fieldTypeAllowed;
  return result;
}

export function isFieldNumber(field) {
  const fieldd = isFieldAllowed(field);
  return fieldd ? fieldd.type === 'number' : false;
}

export function isFieldDate(field) {
  const fieldd = isFieldAllowed(field);
  return fieldd ? fieldd.type === 'date' : false;
}

export function getChartType(type) {
  return CHART_TYPES[type];
}

/**
 * Return whether the chart/map can be rendered according to the
 * state of the WidgetEditor in the store
 * @export
 * @param {object} widgetEditor - Store's state of the WidgetEditor
 * @returns {boolean}
 */
export function canRenderChart(widgetEditor) {
  const { visualizationType, category, value, chartType, band, layer } = widgetEditor;

  const chart = visualizationType === 'chart'
    && !!(chartType
      && category
      && category.name
      && (
        (isBidimensionalChart(widgetEditor.chartType)
          && value
          && value.name
        )
        || !isBidimensionalChart(widgetEditor.chartType)
      )
    );

  const rasterChart = visualizationType === 'raster_chart' && !!band;

  const map = visualizationType === 'map' && !!layer;

  // Standard chart
  return chart || rasterChart || map;
}

/**
 * Generate a ChartInfo object with the data provided from the arguments
 * @export
 * @param {string} dataset - Dataset ID
 * @param {string} datasetType - Type of dataset
 * @param {string} datasetProvider - Provider of the dataset
 * @param {object} widgetEditor - Store object
 * @returns
 */
export function getChartInfo(dataset, datasetType, datasetProvider, widgetEditor) {
  // If the dataset is a raster one, the chart info is always the same
  if (datasetType === 'raster') return RasterService.getChartInfo();

  const {
    chartType,
    limit,
    areaIntersection,
    category,
    value,
    aggregateFunction,
    color,
    size,
    orderBy,
    fields,
    filters
  } = widgetEditor;

  const categoryField = fields.length &&
    fields.find(f => (category && f.columnName === category.name));

  const chartInfo = {
    chartType,
    limit,
    order: orderBy,
    filters,
    areaIntersection,
    x: {
      type: category && category.type,
      name: category && category.name,
      alias: categoryField && categoryField.alias
    },
    y: null,
    color: null,
    size: null
  };

  if (value) {
    chartInfo.y = {
      type: value.type,
      name: value.name,
      alias: fields.length && fields.find(f => f.columnName === value.name).alias,
      aggregateFunction
    };
  }

  if (color) {
    chartInfo.color = {
      alias: fields.length && fields.find(f => f.columnName === color.name).alias,
      aggregateFunction: color.aggregateFunction
    };
  }

  if (size) {
    chartInfo.size = {
      alias: fields.length && fields.find(f => f.columnName === size.name).alias,
      aggregateFunction: size.aggregateFunction
    };
  }

  return chartInfo;
}

/**
 * Return the URL of the data needed for the Vega chart in case
 * of a raster dataset
 * @export
 * @param {string} dataset - Dataset ID
 * @param {string} datasetType - Type of dataset
 * @param {string} tableName - Name of the table
 * @param {string} band - Name of band (in case of a raster dataset)
 * @param {string} provider - Name of the provider
 * @return {string}
 */
export function getRasterDataURL(dataset, datasetType, tableName, band, provider) {
  let query;
  if (provider === 'gee') {
    query = `SELECT ST_HISTOGRAM(rast, ${band}, 10, true) from "${tableName}"`;
  } else if (provider === 'cartodb') {
    const bandNumber = band.split(' ')[1];
    query = `SELECT (ST_Histogram(st_union(the_raster_webmercator), ${bandNumber}, 10, true)).* from ${tableName}`;
  }

  return `${process.env.WRI_API_URL}/query/${dataset}?sql=${query}`;
}

/**
 * Return the URL of the data needed for the Vega chart
 * @export
 * @param {string} dataset - Dataset ID
 * @param {string} datasetType - Type of dataset
 * @param {string} tableName - Name of the table
 * @param {string} band - Name of band (in case of a raster dataset)
 * @param {string} provider - Name of the provider
 * @param {ChartInfo} chartInfo
 * @return {string}
 */
export function getDataURL(dataset, datasetType, tableName, band, provider,
  chartInfo, isTable = false) {
  // If the dataset is a raster one, the behaviour is totally different
  if (datasetType === 'raster') {
    if (!band) return '';
    return getRasterDataURL(dataset, datasetType, tableName, band, provider);
  }

  const isBidimensional = (isTable) ? false : isBidimensionalChart(chartInfo.chartType);

  if (!isTable && (!chartInfo.x || (isBidimensional && !chartInfo.y))) return '';

  const columns = [{ key: 'x', value: chartInfo.x.name, as: true }];

  if (isBidimensional) {
    columns.push({ key: 'y', value: chartInfo.y.name, as: true });

    if (chartInfo.y.aggregateFunction && chartInfo.y.aggregateFunction !== 'none') {
      // If there's an aggregate function, we group the results
      // with the first column (dimension x)
      columns[0].group = true;

      // We then apply the aggregate function to the current
      // column
      columns[1].aggregateFunction = chartInfo.y.aggregateFunction;
    }
  }

  if (chartInfo.color) {
    const colorColumn = { key: 'color', value: chartInfo.color.name, as: true };
    if (chartInfo.color.aggregateFunction && chartInfo.color.aggregateFunction !== 'none') {
      colorColumn.aggregateFunction = chartInfo.color.aggregateFunction;
    }
    columns.push(colorColumn);
  }

  if (chartInfo.size) {
    const sizeColumn = { key: 'size', value: chartInfo.size.name, as: true };
    if (chartInfo.size.aggregateFunction && chartInfo.size.aggregateFunction !== 'none') {
      sizeColumn.aggregateFunction = chartInfo.size.aggregateFunction;
    }
    columns.push(sizeColumn);
  }

  const orderByColumn = chartInfo.order ? [chartInfo.order] : [];

  // If the visualization is a line chart and the user doesn't sort
  // the data, by default we sort it with the category column
  if (!orderByColumn.length && chartInfo.chartType === 'line') {
    orderByColumn.push({ name: chartInfo.x.name });
  }

  if (orderByColumn.length > 0 && chartInfo.y && orderByColumn[0].name === chartInfo.y.name && chartInfo.y.aggregateFunction && chartInfo.y.aggregateFunction !== 'none') {
    orderByColumn[0].name = `${chartInfo.y.aggregateFunction}(${chartInfo.y.name})`;
  }

  const sortOrder = chartInfo.order ? chartInfo.order.orderType : 'asc';
  const query = `${getQueryByFilters(tableName, chartInfo.filters, columns, orderByColumn, sortOrder)} LIMIT ${chartInfo.limit}`;

  const geostore = chartInfo.areaIntersection ? `&geostore=${chartInfo.areaIntersection}` : '';

  return `${process.env.WRI_API_URL}/query/${dataset}?sql=${query}${geostore}`;
}

/**
 * Fetch the data of the chart
 * NOTE: if the request fails, an empty array will be
 * returned
 * @export
 * @param {string} url URL of the data
 * @returns {object[]}
 */
export async function fetchData(url) { // eslint-disable-line no-unused-vars
  let data;

  try {
    const response = await fetch(url);

    if (response.ok) {
      data = await response.json();
      data = data.data;
    }
  } catch (err) {
    // TODO: properly handle this error case in the UI
    toastr.error('Unable to load the data of the chart');
  }

  if (!data) {
    data = [];
  }

  return data;
}

/**
 * Return the optimal time format for the temporal data passed
 * as argument
 * The format will be one of d3's:
 * https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Formatting.md#format
 * NOTE: the function might return null if the strings can't
 * be parsed as dates
 * @param {object[]} data array of strings parseable as dates
 * @returns {string} date format
 */
export function getTimeFormat(data) {
  const timestamps = data.map(d => +(new Date(d)));

  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);

  // If some of the dates couldn't be parsed, we return null
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return null;
  }

  // Number of milliseconds in a...
  const day = 1000 * 60 * 60 * 24;
  const month = 31 * day;
  const year = 12 * month;

  if (max - min <= 2 * day) {
    return '%H:%M'; // ex: 10:00
  } else if (max - min <= 2 * month) {
    return '%d %b'; // ex: 20 Jul
  } else if (max - min <= 2 * year) {
    return '%b %Y'; // ex: Jul 2017
  }

  return '%Y'; // ex: 2017
}

/**
 * Parse and return the data of a raster band
 * @export
 * @param {any[]} data - Raw data of the band
 * @param {string} band - Name of the band
 * @param {string} provider - Name of the provider
 * @returns {object[]}
 */
export function parseRasterData(data, band, provider) {
  if (provider === 'gee') {
    return data[0][band].map(d => ({ x: d[0], y: d[1] }));
  } else if (provider === 'cartodb') {
    return data.map(d => ({ x: d.max, y: d.count }));
  }

  return data;
}

/**
 * Generate the chart configuration (Vega's) according to the
 * parameters
 * @export
 * @param {string} dataset - Dataset ID
 * @param {string} datasetType - Type of dataset
 * @param {string} tableName - Name of the table
 * @param {string} band - Name of the band (in case of a raster dataset)
 * @param {string} provider - Name of the provider
 * @param {ChartInfo} chartInfo
 * @param {boolean} [embedData=false] Whether the configuration should
 * be saved with the data in it or just its URL
 */
export async function getChartConfig(
  dataset,
  datasetType,
  tableName,
  band,
  provider,
  chartInfo,
  embedData = false
) {
  // URL of the data needed to display the chart
  const url = getDataURL(dataset, datasetType, tableName, band, provider, chartInfo);

  // We fetch the data to have clever charts
  let data = await fetchData(url);

  if (datasetType === 'raster') {
    data = parseRasterData(data, band, provider);
  }

  // We compute the name of the x column
  const xLabel = chartInfo.x.name[0].toUpperCase()
    + chartInfo.x.name.slice(1, chartInfo.x.name.length);

  // We compute the name of the y column
  let yLabel = chartInfo.y && chartInfo.y.name;
  if (yLabel) {
    // We make the first letter uppercase
    yLabel = yLabel[0].toUpperCase() + yLabel.slice(1, yLabel.length);

    // If there's an aggregation, we add it next to the name
    if (chartInfo.y.aggregateFunction) {
      yLabel = `${yLabel} (${chartInfo.y.aggregateFunction})`;
    }
  }

  return CHART_TYPES[chartInfo.chartType]({
    // In the future, we could pass the type of the columns so the chart
    // could select the right scale
    columns: {
      x: {
        present: true,
        type: chartInfo.x.type,
        name: xLabel,
        alias: chartInfo.x.alias
      },
      y: {
        present: !!chartInfo.y,
        type: chartInfo.y && chartInfo.y.type,
        name: yLabel,
        alias: chartInfo.y && chartInfo.y.alias
      },
      color: {
        present: !!chartInfo.color,
        alias: chartInfo.color && chartInfo.color.alias
      },
      size: {
        present: !!chartInfo.size,
        alias: chartInfo.size && chartInfo.size.alias
      }
    },
    data,
    embedData,
    url,
    provider,
    band
  });
}

/**
 * Fetch the data of a raster dataset and return the parsed data
 * @export
 * @param {string} url - URL of the data
 * @param {string} band - Band name
 * @param {string} provider - Dataset provider
 * @returns
 */
export async function fetchRasterData(url, band, provider) {
  // We fetch the data to have clever charts
  const data = await fetchData(url);

  return parseRasterData(data, band, provider);
}

// TOOLTIP & LEGEND

/**
 * Return a two-decimal fixed number (as a string) if the number
 * isn't an integer, if it is, just return the number
 * For example:
 *  * 1773.38    => 1,773.38
 *  *    2.76557 =>     2.76
 *  *    2.7     =>     2.70
 *  *    2       =>     2
 * @export
 * @param {number} number Number to format
 * @return {string}
 */
export function get2DecimalFixedNumber(number) {
  return Math.abs(number % 1) > 0 ? format(',.2f')(number) : `${number}`;
}

/**
 * Return the number in the SI format
 * @export
 * @param {number} number Number to format
 * @return {string}
 */
export function getSINumber(number) {
  return format('.2s')(number);
}
