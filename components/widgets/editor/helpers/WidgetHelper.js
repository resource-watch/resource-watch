import 'isomorphic-fetch';
import { format } from 'd3';
import { toastr } from 'react-redux-toastr';

// Components
import BarChart from 'components/widgets/editor/helpers/bar';
import LineChart from 'components/widgets/editor/helpers/line';
import PieChart from 'components/widgets/editor/helpers/pie';
import OneDScatterChart from 'components/widgets/editor/helpers/1d_scatter';
import OneDTickChart from 'components/widgets/editor/helpers/1d_tick';
import ScatterChart from 'components/widgets/editor/helpers/scatter';

// Utils
import getQueryByFilters from 'components/widgets/editor/helpers/getQueryByFilters';

// Services
import RasterService from 'components/widgets/editor/services/RasterService';

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
  if (datasetType === 'raster') return RasterService.getChartInfo(widgetEditor);

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

  const chartInfo = {
    chartType,
    limit: (datasetProvider === 'nexgddp') ? null : limit,
    order: orderBy,
    filters,
    areaIntersection,
    x: {
      type: category.type,
      name: category.name,
      alias: fields.length && fields.find(f => f.columnName === category.name).alias
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
      name: color.name,
      alias: fields.length && fields.find(f => f.columnName === color.name).alias,
      aggregateFunction: color.aggregateFunction
    };
  }

  if (size) {
    chartInfo.size = {
      name: size.name,
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
 * @param {{ name: string, type: string, alias: string, description: string }} band
 * Band (in case of a raster dataset)
 * @param {string} provider - Name of the provider
 * @param {ChartInfo} chartInfo
 * @return {string}
 */
export async function getRasterDataURL(dataset, datasetType, tableName, band, provider, chartInfo) {
  const bandType = band.type || 'categorical';

  let query;
  if (provider === 'gee') {
    if (bandType === 'continuous') {
      query = `SELECT ST_HISTOGRAM(rast, ${band.name}, auto, true) from "${tableName}"`;
    } else {
      query = `SELECT st_valuecount(rast, '${band.name}', true) from '${tableName}'`;
    }
  } else if (provider === 'cartodb') {
    if (bandType === 'continuous') {
      query = `SELECT (ST_Histogram(st_union(the_raster_webmercator), ${band.name}, auto, true)).* from ${tableName}`;
    } else {
      query = `SELECT (ST_valueCount(st_union(the_raster_webmercator), ${band.name}, True)).* from ${tableName}`;
    }
  }

  const geostore = chartInfo.areaIntersection ? `&geostore=${chartInfo.areaIntersection}` : '';

  return `${process.env.WRI_API_URL}/query/${dataset}?sql=${query}${geostore}`;
}

/**
 * Return the URL of the data needed for the Vega chart
 * @export
 * @param {string} dataset - Dataset ID
 * @param {string} datasetType - Type of dataset
 * @param {string} tableName - Name of the table
 * @param {{ name: string, type: string, alias: string, description: string }} band
 * Band (in case of a raster dataset)
 * @param {string} provider - Name of the provider
 * @param {ChartInfo} chartInfo
 * @param {boolean} [isTable=false] Whether we fetch the data of a table
 * @return {string}
 */
export async function getDataURL(dataset, datasetType, tableName, band, provider,
  chartInfo, isTable = false) {
  // If the dataset is a raster one, the behaviour is totally different
  if (datasetType === 'raster') {
    if (!band) return '';
    return getRasterDataURL(dataset, datasetType, tableName, band, provider, chartInfo);
  }

  let isBidimensional = false;
  if (!isTable) {
    isBidimensional = isBidimensionalChart(chartInfo.chartType);
  } else if (!chartInfo.chartType) {
    if (chartInfo.x && chartInfo.y) {
      isBidimensional = true;
    } else {
      isBidimensional = false;
    }
  }

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
 * NOTE: by default, a timeout of 15s is applied and the
 * function will reject with the string "timeout"
 * @export
 * @param {string} url URL of the data
 * @param {number} [timeout=15] Timeout in seconds
 * @returns {Promise<object[]>}
 */
export function fetchData(url, timeout = 15) { // eslint-disable-line no-unused-vars
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), 1000 * timeout);

    fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Unable to load the data of the chart');
      })
      .then(data => data.data)
      .then(resolve)
      .catch(reject);
  });
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
 * @param {{ name: string, type: string, alias: string, description: string }} band
 * Band (in case of a raster dataset)
 * @param {string} provider - Name of the provider
 * @returns {object[]}
 */
export function parseRasterData(data, band, provider) {
  if (!data.length) return data;

  if (provider === 'gee') {
    if (band.type === 'continuous') {
      return data[0][band.name].map(d => ({
        x: get2DecimalFixedNumber(d[0]),
        y: d[1]
      }));
    }

    return Object.keys(data[0][band.name]).map(k => ({
      x: k === 'null' ? 'No data' : get2DecimalFixedNumber(k),
      y: data[0][band.name][k]
    }));
  } else if (provider === 'cartodb') {
    if (band.type === 'continuous') {
      return data.map(d => ({
        x: get2DecimalFixedNumber(d.max),
        y: d.count
      }));
    }

    return data.map(d => ({
      x: get2DecimalFixedNumber(d.value),
      y: d.count
    }));
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
 * @param {{ name: string, type: string, alias: string, description: string }} band
 * Band (in case of a raster dataset)
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
  const url = await getDataURL(dataset, datasetType, tableName, band, provider, chartInfo);

  // We fetch the data to have clever charts
  let data
  try {
    data = await fetchData(url);
  } catch(err) {
    if (err === 'timeout') {
      throw new Error('This dataset is taking longer than expected to load. Please try again in a few minutes.');
    } else {
      throw new Error('The request to load the data has failed. Please try again in a few minutes.');
    }
  }

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
          ? chartInfo.x.alias[0].toUpperCase()
              + chartInfo.x.alias.slice(1, chartInfo.x.alias.length)
          : null
      },
      y: {
        present: !!chartInfo.y,
        type: chartInfo.y && chartInfo.y.type,
        name: yLabel,
        alias: chartInfo.y && chartInfo.y.alias
          ? chartInfo.y.alias[0].toUpperCase()
            + chartInfo.y.alias.slice(1, chartInfo.y.alias.length)
          : null
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
 * @param {{ name: string, type: string, alias: string, description: string }} band
 * Band (in case of a raster dataset)
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
