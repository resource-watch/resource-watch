/**
 * It returns a string query using filters Data
 * @param  {Array} filters
 * @return {String}
 */

/* eslint-disable max-len */
/**
 * Return the query to fetch the data of the dataset
 * @export
 * @param {string} tableName Name of the table
 * @param {{ name: string, type: string, value: any[] }[]} [filters=[]]
 * @param {{ key: string, value: string, as?: boolean, aggregateFunction: string, group: boolean }} [arrColumns=[]]
 * @param {any} [arrOrder=[]]
 * @param {'asc'|'desc'} sortOrder
 * @returns {string} SQL query
 */
/* eslint-enable max-len */
export default function getQueryByFilters(
  tableName,
  filters = [],
  arrColumns = [],
  arrOrder = [],
  sortOrder = 'asc'
) {
  // We compute the WHERE part of the query which corresponds
  // to the filters
  const filtersQuery = filters.map((filter) => {
    if (!filter.value || !filter.value.length) return null;

    if (filter.type === 'string') {
      const whereClause = `${filter.name} IN ('${filter.value.join('\', \'')}')`;
      return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
    }

    if (filter.type === 'number') {
      const whereClause = `${filter.name} >= ${filter.value[0]} AND ${filter.name} <= ${filter.value[1]}`;
      return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
    }

    return null;
  }).filter(filter => !!filter)
    .join(' AND ');

  // Get column names
  let columns = '*';
  if (arrColumns.length) {
    columns = arrColumns.map((column) => {
      let res = `${column.value}`;

      // We eventually apply a aggregate function to the column
      if (column.aggregateFunction) {
        res = `${column.aggregateFunction.toUpperCase()}(${res})`;
      }

      // We eventually rename the column
      if (column.as) {
        res = `${res} as ${column.key}`;
      }

      return res;
    }).join(', ');
  }

  let orderBy = '';
  if (arrOrder.length) {
    const orders = arrOrder.map(order => order.name).join(' ');

    orderBy = `ORDER BY ${orders} ${sortOrder}`;
  }

  const where = (filtersQuery.length) ? `WHERE ${filtersQuery}` : '';

  // The column used to group the data, if exist
  const groupingColumns = arrColumns.filter(col => col.group);

  let groupBy = 'GROUP BY ';
  groupingColumns.forEach((val) => {
    groupBy = `${groupBy} ${val.key},`;
  });
  if (groupingColumns.length === 0) {
    groupBy = '';
  } else {
    groupBy = groupBy.slice(0, -1); // remove extra comma at the end
  }

  return `SELECT ${columns} FROM ${tableName} ${where} ${groupBy} ${orderBy}`;
}
