import 'isomorphic-fetch';

// Components
import BarChart from 'utils/widgets/bar';
import LineChart from 'utils/widgets/line';
import PieChart from 'utils/widgets/pie';
import OneDScatterChart from 'utils/widgets/1d_scatter';
import OneDTickChart from 'utils/widgets/1d_tick';
import ScatterChart from 'utils/widgets/scatter';

// utils
import getQueryByFilters from 'utils/getQueryByFilters';

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
  { name: 'esriFieldTypeString', type: 'text', provider: 'esri' },
  // ----- TEXT -----
  { name: 'string', type: 'text', provider: 'sql' },
  { name: 'char', type: 'text', provider: 'sql' },
  { name: 'varchar', type: 'text', provider: 'sql' },
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

function isBidimensionalChart(widgetEditor) {
  return !oneDimensionalChartTypes.includes(widgetEditor.chartType);
}

export function isFieldAllowed(fieldType) {
  let res = ALLOWED_FIELD_TYPES
    .find(val => val.name.toLowerCase() === fieldType.toLowerCase());
  console.log(res);
  // console.log(res.filter(val => val.name !== 'cartodb_id'));
  return res;
}

export function isFieldNumber(fieldType) {
  const field = isFieldAllowed(fieldType);
  return field ? field.type === 'number' : false;
}

export function isFieldDate(fieldType) {
  const field = isFieldAllowed(fieldType);
  return field ? field.type === 'date' : false;
}

export function getChartType(type) {
  return CHART_TYPES[type];
}

export function canRenderChart(widgetEditor) {
  const { category, value, chartType } = widgetEditor;

  return !!(chartType
    && category
    && category.name
    && (
      (isBidimensionalChart(widgetEditor)
        && value
        && value.name
      )
      || !isBidimensionalChart(widgetEditor)
    ));
}

/**
 * Return the URL of the data needed for the Vega chart
 * @export
 * @param {object} widgetEditor Configuration of the widget editor from the store
 * @param {string} tableName Name of dataset's table
 * @param {string} dataset ID of the dataset
 * @returns {string} URL of the data
 */
export function getDataURL(widgetEditor, tableName, dataset) {
  const {
    category,
    value,
    color,
    size,
    filters,
    aggregateFunction,
    orderBy,
    limit,
    chartType
  } = widgetEditor;
  const aggregateFunctionColor = color && color.aggregateFunction;
  const aggregateFunctionSize = size && size.aggregateFunction;
  const isBidimensional = isBidimensionalChart(widgetEditor);

  if (!category || (isBidimensional && !value)) return '';

  const columns = [
    { key: 'x', value: category.name, as: true }
  ];

  if (isBidimensional) {
    columns.push({ key: 'y', value: value.name, as: true });

    if (aggregateFunction && aggregateFunction !== 'none') {
      // If there's an aggregate function, we group the results
      // with the first column (dimension x)
      columns[0].group = true;

      // We then apply the aggregate function to the current
      // column
      columns[1].aggregateFunction = aggregateFunction;
    }
  }

  if (color) {
    const colorColumn = { key: 'color', value: color.name, as: true };
    if (aggregateFunctionColor && aggregateFunctionColor !== 'none') {
      colorColumn.aggregateFunction = aggregateFunctionColor;
    }
    columns.push(colorColumn);
  }

  if (size) {
    const sizeColumn = { key: 'size', value: size.name, as: true };
    if (aggregateFunctionSize && aggregateFunctionSize !== 'none') {
      sizeColumn.aggregateFunction = aggregateFunctionSize;
    }
    columns.push(sizeColumn);
  }

  const orderByColumn = orderBy ? [orderBy] : [];

  // If the visualization is a line chart and the user doesn't sort
  // the data, by default we sort it with the category column
  if (!orderByColumn.length && chartType === 'line') {
    orderByColumn.push({ name: category.name });
  }

  if (orderByColumn.length > 0 && value && orderByColumn[0].name === value.name && aggregateFunction && aggregateFunction !== 'none') {
    orderByColumn[0].name = `${aggregateFunction}(${value.name})`;
  }

  const sortOrder = orderBy ? orderBy.orderType : 'asc';
  const query = `${getQueryByFilters(tableName, filters, columns, orderByColumn, sortOrder)} LIMIT ${limit}`;

  // TODO: remove the limit
  return `${process.env.WRI_API_URL}/query/${dataset}?sql=${query}`;
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
    console.error('Unable to load the data of the chart');
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
 * Generate the chart configuration (Vega's) according to the
 * current state of the store
 * @export
 * @param {any} widgetEditor State of the editor (coming from the store)
 * @param {string} tableName Name of the dataset's table
 * @param {string} dataset ID of the dataset
 * @param {boolean} [mustFetchData=false] Whether the the configuration
 * should store the URL of the raw data (might be needed for smarter
 * charts)
 * @returns {object} JSON object
 */
export async function getChartConfig(widgetEditor, tableName, dataset, mustFetchData = false) {
  const { category, value, size, color, chartType } = widgetEditor;

  // URL of the data needed to display the chart
  const url = getDataURL(widgetEditor, tableName, dataset);

  // In case we must fetch the data, we save it in this variable
  const data = mustFetchData && await fetchData(url);

  return CHART_TYPES[chartType]({
    // In the future, we could pass the type of the columns so the chart
    // could select the right scale
    columns: {
      x: { present: true, type: category.type },
      y: { present: !!value, type: value.type },
      color: { present: !!color },
      size: { present: !!size }
    },
    data: data || {
      url,
      property: 'data'
    }
  });
}
