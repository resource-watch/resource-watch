import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import * as queryString from 'query-string';
import WRISerializer from 'wri-json-api-serializer';

export const setActiveTab = createAction('ADMIN_DATA_PAGE/setActiveTab');

export const setPageParams = createAction('ADMIN_DATA_PAGE/setPageParams');

export const setPagination = createAction('ADMIN_DATA_PAGE/setPagination');
export const setDatasets = createAction('ADMIN_DATA_PAGE/setDatasets');
export const changeDatasetPage = createAction('ADMIN_DATA_PAGE/changeDatasetPage');

export const setError = createAction('ADMIN_DATA_PAGE/setError');

export const setWidgets = createAction('ADMIN_DATA_PAGE/setWidgets');

export const getDatasets = createThunkAction('ADMIN_DATA_PAGE/getDatasets', page =>
  (dispatch, getState) => {
    const { user, adminDataPage } = getState();

    const qParams = queryString.stringify({
      application: process.env.APPLICATIONS,
      env: process.env.API_ENV,
      'page[size]': 20,
      'page[number]': page || 1,
      includes: 'widget,layer,metadata,vocabulary,user'
    });

    return fetch(`${process.env.WRI_API_URL}/dataset?${qParams}`, {
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
      .then((res) => {
        const { data, meta } = res;
        const list = data && data.length ?
          data.map(dataset => ({ ...dataset.attributes, id: dataset.id })) : [];
        dispatch(setDatasets({
          list,
          activePage: page || adminDataPage.datasets.activePage,
          pagination: { size: meta.size, total: meta['total-items'], limit: meta['total-pages'] }
        }));
      })
      .catch(errors => console.error(errors));
  });
