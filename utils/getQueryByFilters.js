import compact from 'lodash/compact';
/**
 * It returns a string query using filters Data
 * @param  {Array} filters
 * @return {String}
 */
export default function getQueryByFilters(tableName, arrFilters = [], arrColumns = []) {
  const filtersQuery = compact(arrFilters.map((element) => {
    const filter = element.filters;
    // Check that there is a filter present
    if (!filter || !filter.columnType || !filter.columnName) {
      return null;
    }

    // Check that it's a number/date column
    if (filter.columnType === 'number' || filter.columnName === 'date') {
      const min = (filter.properties.min) ? `${filter.columnName} >= ${filter.properties.min}` : '';
      const max = (filter.properties.max) ? `${filter.columnName} <= ${filter.properties.max}` : '';

      return `${min}${(min && max) ? ' AND ' : ''}${max}`;
    }

    const values = `'${filter.properties.values.join("','")}'`;

    // Check that it's a string column
    return `${filter.columnName} IN (${values})`;
  })).join(' AND ');

  const columns = (arrColumns.length) ? arrColumns.map(column => `${column.value} as ${column.key}`).join(', ') : '*';
  const where = (filtersQuery.length) ? `WHERE ${filtersQuery}` : '';

  return `SELECT ${columns} FROM ${tableName} ${where}`;
}
