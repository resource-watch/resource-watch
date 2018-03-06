import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import * as queryString from 'query-string';

import { Router } from 'routes';

export const toggleLoading = createAction('ADMIN_DATA_PAGE/toggleLoading');
export const setDataError = createAction('ADMIN_DATA_PAGE/setDataError');

export const setDatasetSearchTerm = createAction('ADMIN_DATA_PAGE/setDatasetSearchTerm');

export const setActiveTab = createAction('ADMIN_DATA_PAGE/setActiveTab');

export const setPageParams = createAction('ADMIN_DATA_PAGE/setPageParams');
export const setDatasetPage = createAction('ADMIN_DATA_PAGE/setDatasetPage');

export const setPagination = createAction('ADMIN_DATA_PAGE/setPagination');

export const setDatasets = createAction('ADMIN_DATA_PAGE/setDatasets');
export const changeDatasetPage = createAction('ADMIN_DATA_PAGE/changeDatasetPage');

export const setError = createAction('ADMIN_DATA_PAGE/setError');

export const setWidgets = createAction('ADMIN_DATA_PAGE/setWidgets');

export const getDatasets = createThunkAction('ADMIN_DATA_PAGE/getDatasets', () =>
  (dispatch, getState) => {
    dispatch(toggleLoading());

    const { user, adminDataPage } = getState();
    const { search, activePage } = adminDataPage.datasets;

    const qParams = queryString.stringify({
      application: process.env.APPLICATIONS,
      env: process.env.API_ENV,
      'page[size]': 20,
      search,
      'page[number]': activePage,
      includes: 'widget,layer,metadata,vocabulary,user'
    });

    console.log(qParams);

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
          pagination: { size: meta.size, total: meta['total-items'], limit: meta['total-pages'] }
        }));

        dispatch(toggleLoading());
      })
      .catch(errors => dispatch(setDataError(errors)));
  });

export const setDatasetUrl = createThunkAction('ADMIN_DATA_PAGE/setUrl', options => (dispatch, getState) => {
  const { adminDataPage } = getState();
  const { activePage, sort, search } = adminDataPage.datasets;

  const params = {};

  if (sort) {
    params.sort = sort;
  }

  if (search) {
    params.search = search;
  }

  Router.replaceRoute('admin_data', Object.assign(
    {},
    {
      tab: 'datasets',
      page: activePage
    },
    params
  ), options || {});
});
