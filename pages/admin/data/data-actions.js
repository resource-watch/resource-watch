import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import WRISerializer from 'wri-json-api-serializer';

export const setActiveTab = createAction('ADMIN_DATA_PAGE/setActiveTab');

export const setPagination = createAction('ADMIN_DATA_PAGE/setPagination');
export const setError = createAction('ADMIN_DATA_PAGE/setError');

export const setWidgets = createAction('ADMIN_DATA_PAGE/setWidgets');
