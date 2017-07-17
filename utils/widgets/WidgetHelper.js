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
  return ALLOWED_FIELD_TYPES.find(val => val.name.toLowerCase() === fieldType.toLowerCase());
}

export function getChartType(type) {
  return CHART_TYPES[type];
}

export function canRenderChart(widgetEditor) {
  const { category, value, chartType } = widgetEditor;

  return chartType
    && category
    && category.name
    && (
      (isBidimensionalChart(widgetEditor)
        && value
        && value.name
      )
      || !isBidimensionalChart(widgetEditor)
    );
}

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

export function getChartConfig(widgetEditor, tableName, dataset) {
  const { category, value, size, color, chartType } = widgetEditor;

  return CHART_TYPES[chartType]({
    // In the future, we could pass the type of the columns so the chart
    // could select the right scale
    columns: {
      x: { present: true, type: category.type },
      y: { present: !!value, type: value.type },
      color: { present: !!color },
      size: { present: !!size }
    },
    data: {
      url: getDataURL(widgetEditor, tableName, dataset),
      property: 'data'
    }
  });
}
