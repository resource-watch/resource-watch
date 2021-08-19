import { useQuery } from 'react-query';
import axios from 'axios';

const useFetchQuery = (sql, params = {}, queryConfig) => useQuery(
  ['sql-query', sql, params],
  () => axios.get(sql, {
    params,
  })
    .then(({ data }) => data),
  { ...queryConfig },
);

/**
 *
 * @param {string} sql URL address containing a SQL
 * @param {Object} params additional params to send in the request
 * @param {Object} queryConfig additional configuration for react-query
 * @returns react-query instance
 */
export const useSQLQuery = (sql, params, queryConfig = {}) => useFetchQuery(
  sql,
  params,
  {
    enabled: Boolean(sql),
    refetchOnWindowFocus: false,
    ...queryConfig,
  },
);

export default {
  useSQLQuery,
};
