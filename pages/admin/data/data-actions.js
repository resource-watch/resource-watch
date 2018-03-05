import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import * as queryString from 'query-string';
import WRISerializer from 'wri-json-api-serializer';

import sortBy from 'lodash/sortBy';

export const setActiveTab = createAction('ADMIN_DATA_PAGE/setActiveTab');

export const setPageParams = createAction('ADMIN_DATA_PAGE/setPageParams');

export const setPagination = createAction('ADMIN_DATA_PAGE/setPagination');
export const setDatasets = createAction('ADMIN_DATA_PAGE/setDatasets');

export const setError = createAction('ADMIN_DATA_PAGE/setError');

export const setWidgets = createAction('ADMIN_DATA_PAGE/setWidgets');

export const getDatasets = createThunkAction('ADMIN_DATA_PAGE/getDatasets', () =>
  (dispatch, getState) => {
    const { user } = getState();

    const qParams = queryString.stringify({
      application: process.env.APPLICATIONS,
      env: process.env.API_ENV,
      includes: 'widget,layer,metadata,vocabulary,user'
    });

    fetch(`${process.env.WRI_API_URL}/dataset?${qParams}`, {
      headers: {
        Authorization: user.token
      }
    }).then((response) => {
      const { status, statusText } = response;
      if (status === 200) return response.json();
      const errorObject = {
        errors: {
          status,
          details: statusText
        }
      };
      throw errorObject;
    })
      .then(({ data, meta }) => {
        const datasets = data.map(dataset => ({ ...dataset.attributes, id: dataset.id }));
        dispatch(setDatasets({ datasets: sortBy(datasets, 'name'), pagination: meta }));
      })
      .catch(errors => errors);
  });
